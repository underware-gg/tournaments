use starknet::ContractAddress;
use dojo::world::{WorldStorage, WorldStorageTrait, IWorldDispatcher};

use tournaments::components::libs::utils::ZERO;

pub const TOURNAMENT_ID: felt252 = 0x746f75726e616d656e74;

#[starknet::interface]
pub trait IGame<TState> {
    fn get_score(self: @TState, game_id: felt252) -> u64;
    fn get_setting(self: @TState, settings_id: u32, key: felt252) -> u64;
    fn get_settings_id(self: @TState, game_id: felt252) -> u32;
    fn settings_exists(self: @TState, settings_id: u32) -> bool;

    fn new_game(ref self: TState, settings_id: u32, to: ContractAddress) -> felt252;
    fn add_settings(
        ref self: TState,
        name: felt252,
        description: ByteArray,
        setting_keys: Span<felt252>,
        setting_values: Span<u64>
    );
}

#[generate_trait]
pub impl WorldImpl of WorldTrait {
    fn contract_address(self: @WorldStorage, contract_name: @ByteArray) -> ContractAddress {
        match self.dns(contract_name) {
            Option::Some((contract_address, _)) => { (contract_address) },
            Option::None => { (ZERO()) },
        }
    }

    // Create a Store from a dispatcher
    // https://github.com/dojoengine/dojo/blob/main/crates/dojo/core/src/contract/components/world_provider.cairo
    // https://github.com/dojoengine/dojo/blob/main/crates/dojo/core/src/world/storage.cairo
    #[inline(always)]
    fn storage(dispatcher: IWorldDispatcher, namespace: @ByteArray) -> WorldStorage {
        (WorldStorageTrait::new(dispatcher, namespace))
    }
}

