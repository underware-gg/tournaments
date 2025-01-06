use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
pub enum GatedEntryType {
    criteria: Span<EntryCriteria>,
    uniform: u64,
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
pub struct EntryCriteria {
    pub token_id: u128,
    pub entry_count: u64,
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
pub struct GatedToken {
    pub token: ContractAddress,
    pub entry_type: GatedEntryType,
}

#[derive(Copy, Drop, Serde, Introspect)]
pub struct ERC20Data {
    pub token_amount: u128,
}

#[derive(Copy, Drop, Serde, Introspect)]
pub struct ERC721Data {
    pub token_id: u128,
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
pub struct Premium {
    pub token: ContractAddress,
    pub token_amount: u128,
    pub token_distribution: Span<u8>,
    pub creator_fee: u8,
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
pub enum GatedType {
    token: GatedToken,
    tournament: Span<u64>,
    address: Span<ContractAddress>,
}

#[derive(Copy, Drop, Serde, Introspect)]
pub enum GatedSubmissionType {
    token_id: u256,
    game_id: Span<felt252>,
}

#[derive(Copy, Drop, Serde, Introspect)]
pub enum TokenDataType {
    erc20: ERC20Data,
    erc721: ERC721Data,
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
pub enum EntryStatus {
    Entered,
    Started,
    Submitted,
}

#[derive(Copy, Drop, PartialEq, Introspect, Serde)]
pub enum FreeGameTokenType {
    GoldenToken,
    LaunchTournamentChampion,
}

///
/// Model
///

#[dojo::model]
#[derive(Drop, Serde)]
pub struct Game {
    #[key]
    pub game: ContractAddress,
    pub name: felt252,
}

#[dojo::model]
#[derive(Drop, Serde)]
pub struct Tournament {
    #[key]
    pub tournament_id: u64,
    pub name: felt252,
    pub description: ByteArray,
    pub creator: ContractAddress,
    pub registration_start_time: u64,
    pub registration_end_time: u64,
    pub start_time: u64,
    pub end_time: u64,
    pub submission_period: u64,
    pub winners_count: u8,
    pub gated_type: Option<GatedType>,
    pub entry_premium: Option<Premium>,
    pub game: ContractAddress,
    pub settings_id: u32,
}

#[dojo::model]
#[derive(Drop, Serde)]
pub struct TournamentEntryAddresses {
    #[key]
    pub tournament_id: u64,
    pub addresses: Array<ContractAddress>,
}

#[dojo::model]
#[derive(Drop, Serde)]
pub struct TournamentEntriesAddress {
    #[key]
    pub tournament_id: u64,
    #[key]
    pub address: ContractAddress,
    pub entry_count: u64,
}

#[dojo::model]
#[derive(Drop, Serde)]
pub struct TournamentStartsAddress {
    #[key]
    pub tournament_id: u64,
    #[key]
    pub address: ContractAddress,
    pub start_count: u64,
}

#[dojo::model]
#[derive(Copy, Drop, Serde)]
pub struct TournamentGame {
    #[key]
    pub tournament_id: u64,
    #[key]
    pub game_id: u64,
    pub score: u64,
    pub exists: bool,
    pub submitted: bool,
}

#[dojo::model]
#[derive(Copy, Drop, Serde)]
pub struct TournamentEntries {
    #[key]
    pub tournament_id: u64,
    pub entry_count: u64,
    pub premiums_formatted: bool,
    pub distribute_called: bool,
}

#[dojo::model]
#[derive(Drop, Serde)]
pub struct TournamentScores {
    #[key]
    pub tournament_id: u64,
    pub top_score_ids: Array<u64>,
}

#[dojo::model]
#[derive(Copy, Drop, Serde)]
pub struct TournamentTotals {
    #[key]
    pub contract: ContractAddress,
    pub total_tournaments: u64,
    pub total_prizes: u64,
}

#[dojo::model]
#[derive(Copy, Drop, Serde)]
pub struct TournamentPrize {
    #[key]
    pub tournament_id: u64,
    #[key]
    pub prize_key: u64,
    pub token: ContractAddress,
    pub token_data_type: TokenDataType,
    pub payout_position: u8,
    pub claimed: bool
}

#[dojo::model]
#[derive(Drop, Serde)]
pub struct Token {
    #[key]
    pub token: ContractAddress,
    pub name: ByteArray,
    pub symbol: ByteArray,
    pub token_data_type: TokenDataType,
    pub is_registered: bool,
}

#[dojo::model]
#[derive(Copy, Drop, Serde)]
pub struct TournamentConfig {
    #[key]
    pub contract: ContractAddress,
    pub safe_mode: bool,
    pub test_mode: bool,
}
