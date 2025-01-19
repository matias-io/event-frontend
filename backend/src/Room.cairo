use starknet::ContractAddress;

#[starknet::interface]
pub trait IRoomContract<TContractState> {
    fn create_room(ref self: TContractState, room_id: felt252, metadata: felt252);
    fn join_room(ref self: TContractState, room_id: felt252);
    
    // Define a fixed-size array for room members
    fn get_room_members(self: @TContractState, room_id: felt252) -> [ContractAddress; 10]; // Example with a size of 10

    fn leave_room(ref self: TContractState, room_id: felt252);

    fn exists(ref self: TContractState, room_id: felt252); 
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
        pub room_metadata: Map::<felt252, felt252>,       // Maps room_id to metadata
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
            assert(!self.rooms.exists(room_id), Errors::ROOM_ALREADY_EXISTS);

            // Initialize the room with an empty array
            let members: [ContractAddress; 10] = [0;10]; // Initialize with zeros or appropriate default values
            self.rooms.write(room_id, members);
            self.room_metadata.write(room_id, metadata);
        }

        fn join_room(ref self: ContractState, room_id: felt252) {
            // Ensure the room exists
            assert(self.rooms.exists(room_id), Errors::ROOM_NOT_FOUND);

            let user = get_caller_address();

            // Verify user's stake in the staking contract
            let staking_contract = self.staking_contract.read();
            let user_balance: u256 = staking_contract.call(
                "get_rewards",
                (user,),
            ).unwrap();

            assert(user_balance >= self.minimum_stake.read(), Errors::INSUFFICIENT_STAKE);

            // Add user to the room
            let mut members = self.rooms.read(room_id);
            for i in 0..10 {
                if members[i] == 0 { // Assuming 0 means empty slot
                    members[i] = user;
                    break;
                }
            }
            self.rooms.write(room_id, members);
        }

        fn get_room_members(self: @ContractState, room_id: felt252) -> [ContractAddress; 10] {
            // Ensure the room exists
            assert(self.rooms.exists(room_id), Errors::ROOM_NOT_FOUND);

            self.rooms.read(room_id)
        }

        fn leave_room(ref self: ContractState, room_id: felt252) {
            // Ensure the room exists
            assert(self.rooms.exists(room_id), Errors::ROOM_NOT_FOUND);
        
            let user = get_caller_address();
        
            // Fetch the members of the room
            let mut members = self.rooms.read(room_id);
        
            // Ensure the user is in the room
            let index = members.iter().position(|&member| member == user);
            assert(index.is_some(), 'User is not in the room');
        
            // Remove the user from the member list
            members[index.unwrap()] = 0; // Set to 0 or appropriate default value
            self.rooms.write(room_id, members);
        }
    }
}
