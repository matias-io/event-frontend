
/// This interface allows modification and retrieval of the contract balance.
#[starknet::interface]
pub trait IHelloStarknet<TContractState> {
    /// Deletes an existing room.
    fn delete_room(ref self: TContractState, amount: felt252)  -> felt252;
    /// Sets the room
    fn set_room(ref self: TContractState, amount: felt252);
    /// Gets the room
    fn get_room(self: @TContractState) -> felt252;
}

/// Simple contract for managing balance.
#[starknet::contract]
mod HelloStarknet {
    use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

    #[storage]
    struct Storage {
        balance: felt252,
    }

    #[abi(embed_v0)]
    impl HelloStarknetImpl of super::IHelloStarknet<ContractState> {

        fn delete_room(ref self: ContractState, amount: felt252) -> felt252 {
            assert(amount != 0, 'No room to delete');
            self.balance.write(0);
            return 000; 
        }

        fn set_room(ref self: ContractState, amount: felt252){
            self.balance.write(amount);
        }

        fn get_room(self: @ContractState) -> felt252 {
            return self.balance.read();
        }
    }
}
