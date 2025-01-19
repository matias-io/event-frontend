use starknet::{get_caller_address, get_block_timestamp, get_contract_address, ContractAddress, felt252};

#[starknet::interface]
pub trait IStakingContract {
    fn set_reward_amount(self: &mut ContractState, amount: felt252);
    fn set_reward_duration(self: &mut ContractState, duration: felt252);
    fn stake(self: &mut ContractState, amount: felt252);
    fn withdraw(self: &mut ContractState, amount: felt252);
    fn get_rewards(self: &ContractState, account: ContractAddress) -> felt252;
    fn claim_rewards(self: &mut ContractState);
}

#[starknet::interface]
pub trait IRoomContract {
    fn create_room(self: &mut ContractState, room_id: felt252, metadata: felt252);
    fn join_room(self: &mut ContractState, room_id: felt252);
    fn leave_room(self: &mut ContractState, room_id: felt252);
    fn get_room_members(self: &ContractState, room_id: felt252) -> Vec<ContractAddress>;
}

mod Errors {
    pub const NULL_REWARDS: &str = "Reward amount must be > 0";
    pub const NOT_ENOUGH_REWARDS: &str = "Reward amount must be > balance";
    pub const NULL_AMOUNT: &str = "Amount must be > 0";
    pub const NULL_DURATION: &str = "Duration must be > 0";
    pub const UNFINISHED_DURATION: &str = "Reward duration not finished";
    pub const NOT_OWNER: &str = "Caller is not the owner";
    pub const NOT_ENOUGH_BALANCE: &str = "Balance too low";
    pub const ROOM_ALREADY_EXISTS: &str = "Room already exists";
    pub const ROOM_NOT_FOUND: &str = "Room not found";
    pub const INSUFFICIENT_STAKE: &str = "Insufficient stake to join room";
    pub const USER_NOT_IN_ROOM: &str = "User not in the room";
}

#[starknet::contract]
pub mod CombinedContract {
    use super::*;
    use starknet::storage::{Storage};

    #[storage]
    struct Storage {
        pub staking_token: ContractAddress,
        pub reward_token: ContractAddress,
        pub owner: ContractAddress,
        pub reward_rate: felt252,
        pub duration: felt252,
        pub current_reward_per_staked_token: felt252,
        pub finish_at: felt252,
        pub last_updated_at: felt252,
        pub last_user_reward_per_staked_token: felt252,
        pub unclaimed_rewards: felt252,
        pub total_distributed_rewards: felt252,
        pub total_supply: felt252,
        pub balance_of: Storage<ContractAddress, felt252>,
        pub staking_contract: ContractAddress,
        pub minimum_stake: felt252,
        pub rooms: Storage<felt252, Vec<ContractAddress>>,
        pub room_metadata: Storage<felt252, felt252>,
    }

    #[event]
    pub enum Event {
        Deposit(Deposit),
        Withdrawal(Withdrawal),
        RewardsFinished(RewardsFinished),
        RoomLeft(RoomLeft),
    }

    pub struct Deposit {
        pub user: ContractAddress,
        pub amount: felt252,
    }

    pub struct Withdrawal {
        pub user: ContractAddress,
        pub amount: felt252,
    }

    pub struct RewardsFinished {
        pub msg: felt252,
    }

    pub struct RoomLeft {
        pub user: ContractAddress,
        pub room_id: felt252,
        pub redistributed_amount: felt252,
    }

    #[constructor]
    fn constructor(
        self: &mut ContractState,
        staking_token_address: ContractAddress,
        reward_token_address: ContractAddress,
        staking_contract: ContractAddress,
        minimum_stake: felt252,
    ) {
        self.staking_token.write(staking_token_address);
        self.reward_token.write(reward_token_address);
        self.owner.write(get_caller_address());

        self.staking_contract.write(staking_contract);
        self.minimum_stake.write(minimum_stake);
    }

    #[abi(embed_v0)]
    impl CombinedContract of IStakingContract {
        fn set_reward_duration(self: &mut ContractState, duration: felt252) {
            self.only_owner();

            assert(duration > 0, Errors::NULL_DURATION);

            assert(self.finish_at.read() < get_block_timestamp().into(), Errors::UNFINISHED_DURATION);

            self.duration.write(duration);
        }

        fn set_reward_amount(self: &mut ContractState, amount: felt252) {
            self.only_owner();
            self.update_rewards(Zero::zero());

            assert(amount > 0, Errors::NULL_REWARDS);
            assert(self.duration.read() > 0, Errors::NULL_DURATION);

            let block_timestamp: felt252 = get_block_timestamp().into();

            let rate = if self.finish_at.read() < block_timestamp {
                amount / self.duration.read()
            } else {
                let remaining_rewards = self.reward_rate.read() * (self.finish_at.read() - block_timestamp);
                (remaining_rewards + amount) / self.duration.read()
            };

            assert(self.reward_token.read().balance_of(get_contract_address()) >= rate * self.duration.read(), Errors::NOT_ENOUGH_REWARDS);

            self.reward_rate.write(rate);
            self.finish_at.write(block_timestamp + self.duration.read());
            self.last_updated_at.write(block_timestamp);
            self.total_distributed_rewards.write(0);
        }

        fn stake(self: &mut ContractState, amount: felt252) {
            assert(amount > 0, Errors::NULL_AMOUNT);

            let user = get_caller_address();
            self.update_rewards(user);

            self.balance_of.write(user, self.balance_of.read(user) + amount);
            self.total_supply.write(self.total_supply.read() + amount);
            self.staking_token.read().transfer_from(user, get_contract_address(), amount);

            self.emit(Event::Deposit(Deposit { user, amount }));
        }

        fn withdraw(self: &mut ContractState, amount: felt252) {
            assert(amount > 0, Errors::NULL_AMOUNT);

            let user = get_caller_address();

            assert(self.staking_token.read().balance_of(user) >= amount, Errors::NOT_ENOUGH_BALANCE);

            self.update_rewards(user);

            self.balance_of.write(user, self.balance_of.read(user) - amount);
            self.total_supply.write(self.total_supply.read() - amount);
            self.staking_token.read().transfer(user, amount);

            self.emit(Event::Withdrawal(Withdrawal { user, amount }));
        }

        fn get_rewards(self: &ContractState, account: ContractAddress) -> felt252 {
            self.unclaimed_rewards.read(account) + self.compute_new_rewards(account)
        }

        fn claim_rewards(self: &mut ContractState) {
            let user = get_caller_address();
            self.update_rewards(user);

            let rewards = self.unclaimed_rewards.read(user);

            if rewards > 0 {
                self.unclaimed_rewards.write(user, 0);
                self.reward_token.read().transfer(user, rewards);
            }
        }
    }

    #[abi(embed_v0)]
    impl CombinedContract of IRoomContract {
        fn create_room(self: &mut ContractState, room_id: felt252, metadata: felt252) {
            assert(!self.rooms.exists(room_id), Errors::ROOM_ALREADY_EXISTS);

            self.rooms.write(room_id, Vec::new());
            self.room_metadata.write(room_id, metadata);
        }

        fn join_room(self: &mut ContractState, room_id: felt252) {
            assert(self.rooms.exists(room_id), Errors::ROOM_NOT_FOUND);

            let user = get_caller_address();

            let staking_contract = self.staking_contract.read();
            let user_balance: felt252 = staking_contract.call("get_rewards", (user,)).unwrap();

            assert(user_balance >= self.minimum_stake.read(), Errors::INSUFFICIENT_STAKE);

            let mut members = self.rooms.read(room_id);
            members.push(user);
            self.rooms.write(room_id, members);
        }

        fn leave_room(self: &mut ContractState, room_id: felt252) {
            assert(self.rooms.exists(room_id), Errors::ROOM_NOT_FOUND);

            let user = get_caller_address();

            let mut members = self.rooms.read(room_id);
            assert(members.contains(&user), Errors::USER_NOT_IN_ROOM);

            members.retain(|&member| member != user);
            self.rooms.write(room_id, members);

            let user_balance = self.balance_of.read(user);
            let remaining_members = members.len();
            assert(remaining_members > 0, Errors::ROOM_NOT_FOUND);

            let redistributed_amount = user_balance / remaining_members as felt252;

            for &member in &members {
                self.balance_of.write(member, self.balance_of.read(member) + redistributed_amount);
            }

            self.emit(Event::RoomLeft(RoomLeft {
                user,
                room_id,
                redistributed_amount,
            }));
        }

        fn get_room_members(self: &ContractState, room_id: felt252) -> Vec<ContractAddress> {
            assert(self.rooms.exists(room_id), Errors::ROOM_NOT_FOUND);

            self.rooms.read(room_id)
        }
    }
}
