#[starknet::interface]
trait IGameMock<TContractState> {
    fn start_game(ref self: TContractState, game_id: felt252);
    fn end_game(ref self: TContractState, game_id: felt252, score: u64);
}

#[starknet::interface]
trait IGameMockInit<TContractState> {
    fn initializer(ref self: TContractState);
}

#[dojo::contract]
mod game_mock {
    use tournaments::components::game::game_component;
    use openzeppelin_introspection::src5::SRC5Component;
    use openzeppelin_token::erc721::{ERC721Component, ERC721HooksEmptyImpl};

    use tournaments::components::interfaces::{WorldImpl};
    use tournaments::components::libs::store::{Store, StoreTrait};
    use tournaments::components::models::game::Score;

    use tournaments::components::constants::{DEFAULT_NS};

    component!(path: game_component, storage: game, event: GameEvent);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);
    component!(path: ERC721Component, storage: erc721, event: ERC721Event);

    #[abi(embed_v0)]
    impl GameImpl = game_component::GameImpl<ContractState>;
    #[abi(embed_v0)]
    impl ERC721MixinImpl = ERC721Component::ERC721MixinImpl<ContractState>;

    impl GameInternalImpl = game_component::InternalImpl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        game: game_component::Storage,
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        GameEvent: game_component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        #[flat]
        ERC721Event: ERC721Component::Event,
    }

    //*******************************
    fn TOKEN_NAME() -> ByteArray {
        ("Game")
    }
    fn TOKEN_SYMBOL() -> ByteArray {
        ("GAME")
    }
    fn BASE_URI() -> ByteArray {
        ("https://game.io")
    }
    //*******************************

    #[abi(embed_v0)]
    impl GameMockImpl of super::IGameMock<ContractState> {
        fn start_game(ref self: ContractState, game_id: felt252) {
            let mut world = self.world(DEFAULT_NS());
            let mut store: Store = StoreTrait::new(world);

            store.set_game_score(@Score { game_id: game_id.into(), score: 0, });
        }

        fn end_game(ref self: ContractState, game_id: felt252, score: u64) {
            let mut world = self.world(DEFAULT_NS());
            let mut store: Store = StoreTrait::new(world);
            store.set_game_score(@Score { game_id: game_id.into(), score: score, });
        }
    }

    #[abi(embed_v0)]
    impl GameInitializerImpl of super::IGameMockInit<ContractState> {
        fn initializer(ref self: ContractState,) {
            self.erc721.initializer(TOKEN_NAME(), TOKEN_SYMBOL(), BASE_URI(),);
            self.game.initializer();
        }
    }
}
