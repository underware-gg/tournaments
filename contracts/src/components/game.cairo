use starknet::ContractAddress;
use tournaments::components::models::game::SettingsDetails;

#[starknet::interface]
trait IGame<TState> {
    fn get_score(self: @TState, game_id: felt252) -> u64;
    fn get_setting(self: @TState, settings_id: u32, key: felt252) -> u64;
    fn get_settings_id(self: @TState, game_id: felt252) -> u32;
    fn get_settings_details(self: @TState, settings_id: u32) -> SettingsDetails;
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

///
/// Game Component
///
#[starknet::component]
pub mod game_component {
    use super::IGame;

    use core::num::traits::Zero;

    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use dojo::contract::components::world_provider::{IWorldProvider};

    use tournaments::components::models::game::{
        Score, GameCount, Settings, SettingsDetails, GameSettings, SettingsCount
    };
    use tournaments::components::interfaces::{WorldTrait, WorldImpl, TOURNAMENT_ID};
    use tournaments::components::libs::store::{Store, StoreTrait};

    use openzeppelin_introspection::src5::SRC5Component;
    use openzeppelin_introspection::src5::SRC5Component::InternalTrait as SRC5InternalTrait;
    use openzeppelin_token::erc721::{
        ERC721Component, ERC721Component::{InternalImpl as ERC721InternalImpl},
    };

    use tournaments::components::constants::{DEFAULT_NS};


    #[storage]
    pub struct Storage {}

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {}

    mod Errors {
        const CALLER_IS_NOT_OWNER: felt252 = 'ERC721: caller is not owner';
    }

    #[embeddable_as(GameImpl)]
    impl Game<
        TContractState,
        +HasComponent<TContractState>,
        +IWorldProvider<TContractState>,
        +SRC5Component::HasComponent<TContractState>,
        +ERC721Component::ERC721HooksTrait<TContractState>,
        impl ERC721: ERC721Component::HasComponent<TContractState>,
        +Drop<TContractState>
    > of IGame<ComponentState<TContractState>> {
        fn get_score(self: @ComponentState<TContractState>, game_id: felt252) -> u64 {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            store.get_game_score(game_id).score
        }

        fn get_setting(
            self: @ComponentState<TContractState>, settings_id: u32, key: felt252
        ) -> u64 {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            store.get_settings_key(settings_id, key).value
        }

        fn get_settings_id(self: @ComponentState<TContractState>, game_id: felt252) -> u32 {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            store.get_game_settings(game_id).settings_id
        }

        fn get_settings_details(
            self: @ComponentState<TContractState>, settings_id: u32
        ) -> SettingsDetails {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            store.get_settings_details(settings_id)
        }

        fn settings_exists(self: @ComponentState<TContractState>, settings_id: u32) -> bool {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            store.get_settings_details(settings_id).exists
        }

        fn new_game(
            ref self: ComponentState<TContractState>, settings_id: u32, to: ContractAddress
        ) -> felt252 {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);

            let game_count = self.get_game_count();
            let game_id = game_count + 1;

            let mut erc721 = get_dep_component_mut!(ref self, ERC721);
            if !to.is_zero() {
                erc721.mint(to, game_id.into());
            } else {
                erc721.mint(get_caller_address(), game_id.into());
            }

            store.set_game_count(@GameCount { contract: get_contract_address(), count: game_id });
            store.set_game_settings(@GameSettings { game_id: game_id, settings_id: settings_id });
            game_id
        }

        fn add_settings(
            ref self: ComponentState<TContractState>,
            name: felt252,
            description: ByteArray,
            setting_keys: Span<felt252>,
            setting_values: Span<u64>
        ) {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            assert(setting_keys.len() == setting_values.len(), 'setting lengths incorrect');
            let settings_count = store.get_settings_count(get_contract_address()).count;
            let mut loop_index = 0;
            loop {
                if (loop_index == setting_keys.len()) {
                    break;
                }
                store
                    .set_settings_key(
                        @Settings {
                            id: settings_count.into() + 1,
                            key: *setting_keys.at(loop_index),
                            value: *setting_values.at(loop_index)
                        }
                    );
                loop_index += 1;
            };
            store
                .set_settings_details(
                    @SettingsDetails {
                        id: settings_count.into() + 1,
                        name: name,
                        description: description,
                        exists: true
                    }
                );
            store
                .set_settings_count(
                    @SettingsCount {
                        contract: get_contract_address(), count: settings_count.into() + 1
                    }
                );
        }
    }

    #[generate_trait]
    pub impl InternalImpl<
        TContractState,
        +HasComponent<TContractState>,
        impl SRC5: SRC5Component::HasComponent<TContractState>,
        +IWorldProvider<TContractState>,
        +Drop<TContractState>
    > of InternalTrait<TContractState> {
        fn initializer(ref self: ComponentState<TContractState>) {
            let mut src5_component = get_dep_component_mut!(ref self, SRC5);
            src5_component.register_interface(TOURNAMENT_ID);
            // TODO: add SRC5 GameMetadata
            // TODO: add name, description etc (game metadata - same style as ERC721 meta)
        }

        fn get_game_count(self: @ComponentState<TContractState>) -> felt252 {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            store.get_game_count(get_contract_address()).count
        }

        fn set_score(ref self: ComponentState<TContractState>, game_id: felt252, score: u64) {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), DEFAULT_NS()
            );
            let mut store: Store = StoreTrait::new(world);
            store.set_game_score(@Score { game_id: game_id, score: score });
        }
    }
}
