use starknet::ContractAddress;
use dojo::world::IWorldDispatcher;
use tournaments::components::models::tournament::{
    Tournament as TournamentModel, Premium, TokenDataType, GatedType, GatedSubmissionType
};

#[starknet::interface]
pub trait ITournamentMock<TState> {
    // IWorldProvider
    fn world_dispatcher(self: @TState) -> IWorldDispatcher;

    fn total_tournaments(self: @TState) -> u64;
    fn tournament(self: @TState, tournament_id: u64) -> TournamentModel;
    fn tournament_entries(self: @TState, tournament_id: u64) -> u64;
    fn top_scores(self: @TState, tournament_id: u64) -> Array<u64>;
    fn is_token_registered(self: @TState, token: ContractAddress) -> bool;
    // TODO: add for V2 (only ERC721 tokens)
    // fn register_tokens(ref self: TState, tokens: Array<Token>);
    fn create_tournament(
        ref self: TState,
        name: felt252,
        description: ByteArray,
        registration_start_time: u64,
        registration_end_time: u64,
        start_time: u64,
        end_time: u64,
        submission_period: u64,
        winners_count: u8,
        gated_type: Option<GatedType>,
        entry_premium: Option<Premium>,
    ) -> u64;
    fn enter_tournament(
        ref self: TState, tournament_id: u64, gated_submission_type: Option<GatedSubmissionType>
    );
    fn start_tournament(
        ref self: TState,
        tournament_id: u64,
        start_all: bool,
        start_count: Option<u64>,
        client_reward_address: ContractAddress,
        golden_token_free_game_ids: Option<Span<u256>>,
        blobert_free_game_ids: Option<Span<u256>>,
        weapon: u8,
        name: felt252,
    );
    fn submit_scores(ref self: TState, tournament_id: u64, game_ids: Array<felt252>);
    fn add_prize(
        ref self: TState,
        tournament_id: u64,
        token: ContractAddress,
        token_data_type: TokenDataType,
        position: u8
    );
    fn distribute_prizes(ref self: TState, tournament_id: u64, prize_keys: Array<u64>);

    fn initializer(
        ref self: TState,
        safe_mode: bool,
        test_mode: bool,
        test_erc20: ContractAddress,
        test_erc721: ContractAddress,
    );
}

#[starknet::interface]
trait ITournamentMockInit<TState> {
    fn initializer(
        ref self: TState,
        safe_mode: bool,
        test_mode: bool,
        test_erc20: ContractAddress,
        test_erc721: ContractAddress,
    );
}

#[dojo::contract]
pub mod tournament_mock {
    use starknet::ContractAddress;
    use tournaments::components::tournament::tournament_component;

    component!(path: tournament_component, storage: tournament, event: TournamentEvent);

    #[abi(embed_v0)]
    impl TournamentImpl = tournament_component::TournamentImpl<ContractState>;

    impl TournamentInternalImpl = tournament_component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        tournament: tournament_component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        TournamentEvent: tournament_component::Event,
    }

    #[abi(embed_v0)]
    impl TournamentInitializerImpl of super::ITournamentMockInit<ContractState> {
        fn initializer(
            ref self: ContractState,
            safe_mode: bool,
            test_mode: bool,
            test_erc20: ContractAddress,
            test_erc721: ContractAddress,
        ) {
            self.tournament.initialize(safe_mode, test_mode);
            self.tournament.initialize_erc20(test_erc20, "Test ERC20", "TERC20");
            self.tournament.initialize_erc721(test_erc721, "Test ERC721", "TERC721");
        }
    }
}
