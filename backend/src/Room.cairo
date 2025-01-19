use starknet::ContractAddress;

#[starknet::interface]
pub trait IRoomContract<TContractState> {
    fn create_room(ref self: TContractState, room_id: felt252, metadata: felt252);
    fn join_room(ref self: TContractState, room_id: felt252);

    // Define a fixed-size array for room members
    fn get_room_members(
        self: @TContractState, room_id: felt252,
    ) -> Array<ContractAddress>; // Example with a size of 10

    fn leave_room(ref self: TContractState, room_id: felt252);
    fn exists(self: @TContractState, room_id: felt252, user: ContractAddress) -> bool;
}

mod Errors {
    pub const ROOM_ALREADY_EXISTS: felt252 = 0; // Use appropriate felt252 values
    pub const ROOM_NOT_FOUND: felt252 = 1;
    pub const INSUFFICIENT_STAKE: felt252 = 2;
}

#[starknet::contract]
pub mod RoomContract {
    use starknet::{ContractAddress, get_caller_address};
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};

    #[storage]
    struct Storage {
        pub staking_contract: ContractAddress,
        pub minimum_stake: u256,
        // Use a fixed-size array for room members
        pub rooms: Map::<felt252, [ContractAddress; 10]>, // Example with a size of 10
        pub room_metadata: Map::<felt252, felt252> // Maps room_id to metadata
    }

    // #[constructor]
    // fn constructor(
    //     ref self: ContractState,
    //     staking_contract: ContractAddress,
    //     minimum_stake: u256,
    // ) {
    //     // Write to the staking_contract storage variable
    //     self.staking_contract.write(staking_contract);

    //     // Write to the minimum_stake storage variable
    //     self.minimum_stake.write(minimum_stake);
    // }

    #[abi(embed_v0)]
    impl RoomContract of super::IRoomContract<ContractState> {
        fn create_room(ref self: ContractState, room_id: felt252, metadata: felt252) {
            // Ensure the room doesn't already exist
            assert(!self.rooms.exists(room_id), super::Errors::ROOM_ALREADY_EXISTS);

            // Initialize the room with an empty array
            let members: [ContractAddress; 10] = [
                0
            ; 10]; // Initialize with zeros or appropriate default values
            self.rooms.write(room_id, members);
            self.room_metadata.write(room_id, metadata);
        }

        fn join_room(ref self: ContractState, room_id: felt252) {
            // Ensure the room exists
            assert(self.rooms.exists(room_id), super::Errors::ROOM_NOT_FOUND);

            let user = get_caller_address();

            // Verify user's stake in the staking contract
            let staking_contract = self.staking_contract.read();
            let user_balance: u256 = staking_contract.call("get_rewards", (user,)).unwrap();

            assert(user_balance >= self.minimum_stake.read(), super::Errors::INSUFFICIENT_STAKE);

            // Add user to the room
            let mut members = self.rooms.read(room_id);
            for i in 0..10 {
                if members.get(i) == 0 { // Assuming 0 means empty slot
                    members.get(i) = user;
                    break;
                }
            }
            self.rooms.write(room_id, members);
        }

        fn get_room_members(self: @TContractState, room_id: felt252) -> Array<ContractAddress> {
            // First check if room exists using our exists function
            assert(self.exists(room_id, get_caller_address()), super::Errors::ROOM_NOT_FOUND);

            // Read and return the members
            self.rooms.read(room_id)
        }

        fn leave_room(ref self: ContractState, room_id: felt252) {
            // Ensure the room exists
            assert(self.exists(room_id, get_caller_address()), super::Errors::ROOM_NOT_FOUND);

            let user = get_caller_address();

            // Fetch the members of the room
            let mut members = self.rooms.read(room_id);

            // Find and remove the user
            let mut new_members = ArrayTrait::new();
            let mut members_span = members.span();

            loop {
                match members_span.pop_front() {
                    Option::Some(member) => { if *member != user {
                        new_members.append(*member);
                    } },
                    Option::None => { break; },
                };
            };

            // Write back the updated members list
            self.rooms.write(room_id, new_members);
        }

        fn exists(self: @ContractState, room_id: felt252, user: ContractAddress) -> bool {
            // Get the members array from storage
            let mut members = self.rooms.read(room_id);
            let mut found = false;

            // Create a snapshot of the array for iteration
            let mut members_span = members.span();

            // Iterate through members
            loop {
                match members_span.pop_front() {
                    Option::Some(member) => { if *member == user {
                        found = true;
                        break;
                    } },
                    Option::None => { break; },
                };
            };

            found
        }
    }
}
