///
/// Game Component
///
#[starknet::component]
pub mod game_component {
    use tournaments::components::interfaces::{IGameToken, IGameDetails, ISettings};
    use starknet::{ContractAddress, get_contract_address};
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use dojo::contract::components::world_provider::{IWorldProvider};

    use tournaments::components::models::game::{GameMetadata, TokenMetadata, SettingsDetails};
    use tournaments::components::models::lifecycle::Lifecycle;
    use tournaments::components::interfaces::{
        WorldTrait, WorldImpl, IGAMETOKEN_ID, IGAME_METADATA_ID,
    };
    use tournaments::components::libs::game_store::{Store, StoreTrait};
    use openzeppelin_introspection::src5::SRC5Component;
    use openzeppelin_introspection::src5::SRC5Component::InternalTrait as SRC5InternalTrait;
    use openzeppelin_introspection::src5::SRC5Component::SRC5Impl;
    use openzeppelin_token::erc721::{
        ERC721Component, ERC721Component::{InternalImpl as ERC721InternalImpl},
        interface::{IERC721_ID, IERC721_METADATA_ID},
    };

    #[storage]
    pub struct Storage {
        namespace: ByteArray,
        score_model: ByteArray,
        score_attribute: ByteArray,
        settings_model: ByteArray,
    }

    // #[derive(Drop, starknet::Event)]
    // pub struct MetadataUpdateEvent {
    //     #[key]
    //     token_id: u256,
    // }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        // MetadataUpdate: MetadataUpdateEvent,
    }

    pub const VERSION: felt252 = '0.0.1';

    #[embeddable_as(GameImpl)]
    impl Game<
        TContractState,
        +HasComponent<TContractState>,
        +IWorldProvider<TContractState>,
        +ERC721Component::ERC721HooksTrait<TContractState>,
        +ISettings<TContractState>,
        +IGameDetails<TContractState>,
        impl SRC5: SRC5Component::HasComponent<TContractState>,
        impl ERC721: ERC721Component::HasComponent<TContractState>,
        +Drop<TContractState>,
    > of IGameToken<ComponentState<TContractState>> {
        fn mint(
            ref self: ComponentState<TContractState>,
            player_name: felt252,
            settings_id: u32,
            start: Option<u64>,
            end: Option<u64>,
            to: ContractAddress,
        ) -> u64 {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), @self.namespace(),
            );
            let mut store: Store = StoreTrait::new(world);

            // verify settings exist
            self.assert_setting_exists(settings_id);

            // mint game token
            let token_id = self.mint_game(ref store, to);

            // get block timestamp and caller address
            let lifecycle = Lifecycle { mint: starknet::get_block_timestamp(), start, end };

            let minted_by = starknet::get_caller_address();

            store
                .set_token_metadata(
                    @TokenMetadata { token_id, minted_by, player_name, settings_id, lifecycle },
                );

            token_id
        }

        fn game_metadata(self: @ComponentState<TContractState>) -> GameMetadata {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), @self.namespace.read(),
            );
            let store: Store = StoreTrait::new(world);
            store.get_game_metadata(get_contract_address())
        }

        fn token_metadata(self: @ComponentState<TContractState>, token_id: u64) -> TokenMetadata {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), @self.namespace.read(),
            );
            let store: Store = StoreTrait::new(world);
            store.get_token_metadata(token_id)
        }

        fn game_count(self: @ComponentState<TContractState>) -> u64 {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), @self.namespace.read(),
            );
            let store: Store = StoreTrait::new(world);
            store.get_game_count()
        }

        fn namespace(self: @ComponentState<TContractState>) -> ByteArray {
            self.namespace.read()
        }

        fn emit_metadata_update(ref self: ComponentState<TContractState>, game_id: u64) {
            // self.emit(MetadataUpdateEvent { token_id: game_id.into() });
        }

        fn score_model(self: @ComponentState<TContractState>) -> ByteArray {
            self.score_model.read()
        }

        fn score_attribute(self: @ComponentState<TContractState>) -> ByteArray {
            self.score_attribute.read()
        }

        fn settings_model(self: @ComponentState<TContractState>) -> ByteArray {
            self.settings_model.read()
        }
    }
    #[generate_trait]
    pub impl InternalImpl<
        TContractState,
        +HasComponent<TContractState>,
        +IWorldProvider<TContractState>,
        +ERC721Component::ERC721HooksTrait<TContractState>,
        +ISettings<TContractState>,
        impl ERC721: ERC721Component::HasComponent<TContractState>,
        impl SRC5: SRC5Component::HasComponent<TContractState>,
        +Drop<TContractState>,
    > of InternalTrait<TContractState> {
        fn initializer(
            ref self: ComponentState<TContractState>,
            creator_address: ContractAddress,
            name: felt252,
            description: ByteArray,
            developer: felt252,
            publisher: felt252,
            genre: felt252,
            image: ByteArray,
            namespace: ByteArray,
            score_model: ByteArray,
            score_attribute: ByteArray,
            settings_model: ByteArray,
        ) {
            let mut world = WorldTrait::storage(self.get_contract().world_dispatcher(), @namespace);
            let mut store: Store = StoreTrait::new(world);
            let game_metadata = @GameMetadata {
                contract_address: get_contract_address(),
                creator_address,
                name,
                description,
                developer,
                publisher,
                genre,
                image,
            };
            store.set_game_metadata(game_metadata);
            self.mint_creator_token(ref store, creator_address);
            self.register_src5_interfaces();
            self.namespace.write(namespace);
            self.score_model.write(score_model);
            self.score_attribute.write(score_attribute);
            self.settings_model.write(settings_model);
        }

        fn register_src5_interfaces(ref self: ComponentState<TContractState>) {
            let mut src5_component = get_dep_component_mut!(ref self, SRC5);
            src5_component.register_interface(IGAMETOKEN_ID);
            src5_component.register_interface(IGAME_METADATA_ID);
            src5_component.register_interface(IERC721_ID);
            src5_component.register_interface(IERC721_METADATA_ID);
        }

        fn mint_creator_token(
            ref self: ComponentState<TContractState>, ref store: Store, to: ContractAddress,
        ) {
            let token_id = 0;
            let minted_by = get_contract_address();
            let player_name = 'Creator';
            let settings_id = 0;

            let lifecycle = Lifecycle {
                mint: starknet::get_block_timestamp(), start: Option::None, end: Option::None,
            };

            let mut erc721 = get_dep_component_mut!(ref self, ERC721);
            erc721.mint(to, token_id.into());

            store
                .set_token_metadata(
                    @TokenMetadata { token_id, minted_by, player_name, settings_id, lifecycle },
                );
        }

        fn get_game_count(self: @ComponentState<TContractState>) -> u64 {
            let world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), @self.namespace.read(),
            );
            let store: Store = StoreTrait::new(world);
            store.get_game_count()
        }

        fn set_settings(
            ref self: ComponentState<TContractState>,
            settings_id: u32,
            name: felt252,
            description: ByteArray,
        ) {
            let mut world = WorldTrait::storage(
                self.get_contract().world_dispatcher(), @self.namespace.read(),
            );
            let mut store: Store = StoreTrait::new(world);
            store
                .set_settings_details(
                    @SettingsDetails { id: settings_id, name, description, exists: true },
                );
        }

        fn mint_game(
            ref self: ComponentState<TContractState>, ref store: Store, to: ContractAddress,
        ) -> u64 {
            // get erc721 component
            let mut erc721 = get_dep_component_mut!(ref self, ERC721);

            // increment and get next token id
            let game_id = store.increment_and_get_game_count();

            // mint new game token
            erc721.mint(to, game_id.into());

            // return new game token id
            game_id
        }

        fn assert_setting_exists(self: @ComponentState<TContractState>, settings_id: u32) {
            let setting_exists = self.get_contract().setting_exists(settings_id);
            if !setting_exists {
                let world = WorldTrait::storage(
                    self.get_contract().world_dispatcher(), @self.namespace.read(),
                );
                let store: Store = StoreTrait::new(world);
                let game_metadata = store.get_game_metadata(get_contract_address());
                panic!("{}: Setting ID {} does not exist", game_metadata.name, settings_id);
            }
        }
    }
}
