import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import {
  CairoCustomEnum,
  CairoOption,
  BigNumberish,
  CairoOptionVariant,
} from "starknet";

export type TypedCairoEnum<T> = CairoCustomEnum & {
  variant: { [K in keyof T]: T[K] | undefined };
  unwrap(): T[keyof T];
};

type WithFieldOrder<T> = {
  [K in keyof T]: T[K] extends any[]
    ? T[K]
    : T[K] extends object
    ? WithFieldOrder<T[K]>
    : T[K];
} & { fieldOrder: string[] };

// Type definition for `ls_tournaments_v0::ls15_components::models::loot_survivor::Adventurer` struct
export interface Adventurer {
  health: BigNumberish;
  xp: BigNumberish;
  gold: BigNumberish;
  beast_health: BigNumberish;
  stat_upgrades_available: BigNumberish;
  stats: Stats;
  equipment: Equipment;
  battle_action_count: BigNumberish;
  mutated: boolean;
  awaiting_item_specials: boolean;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::loot_survivor::AdventurerMetaModel` struct
export interface AdventurerMetaModel {
  adventurer_id: BigNumberish;
  adventurer_meta: AdventurerMetadataStorage;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::loot_survivor::AdventurerMetaModelValue` struct
export interface AdventurerMetaModelValue {
  adventurer_meta: AdventurerMetadataStorage;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::loot_survivor::AdventurerMetadataStorage` struct
export interface AdventurerMetadataStorage {
  birth_date: BigNumberish;
  death_date: BigNumberish;
  level_seed: BigNumberish;
  item_specials_seed: BigNumberish;
  rank_at_death: BigNumberish;
  delay_stat_reveal: boolean;
  golden_token_id: BigNumberish;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::loot_survivor::AdventurerModel` struct
export interface AdventurerModel {
  adventurer_id: BigNumberish;
  adventurer: Adventurer;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::loot_survivor::AdventurerModelValue` struct
export interface AdventurerModelValue {
  adventurer: Adventurer;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::loot_survivor::Bag` struct
export interface Bag {
  item_1: Item;
  item_2: Item;
  item_3: Item;
  item_4: Item;
  item_5: Item;
  item_6: Item;
  item_7: Item;
  item_8: Item;
  item_9: Item;
  item_10: Item;
  item_11: Item;
  item_12: Item;
  item_13: Item;
  item_14: Item;
  item_15: Item;
  mutated: boolean;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::loot_survivor::BagModel` struct
export interface BagModel {
  adventurer_id: BigNumberish;
  bag: Bag;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::loot_survivor::BagModelValue` struct
export interface BagModelValue {
  bag: Bag;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::loot_survivor::Contracts` struct
export interface Contracts {
  contract: string;
  eth: string;
  lords: string;
  oracle: string;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::loot_survivor::ContractsValue` struct
export interface ContractsValue {
  eth: string;
  lords: string;
  oracle: string;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::loot_survivor::Equipment` struct
export interface Equipment {
  weapon: Item;
  chest: Item;
  head: Item;
  waist: Item;
  foot: Item;
  hand: Item;
  neck: Item;
  ring: Item;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::loot_survivor::FreeGameAvailableModel` struct
export interface FreeGameAvailableModel {
  free_game_type: FreeGameTokenType;
  token_id: BigNumberish;
  available: boolean;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::loot_survivor::FreeGameAvailableModelValue` struct
export interface FreeGameAvailableModelValue {
  available: boolean;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::loot_survivor::GameCountModel` struct
export interface GameCountModel {
  contract_address: string;
  game_count: BigNumberish;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::loot_survivor::GameCountModelValue` struct
export interface GameCountModelValue {
  game_count: BigNumberish;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::loot_survivor::Item` struct
export interface Item {
  id: BigNumberish;
  xp: BigNumberish;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::loot_survivor::Stats` struct
export interface Stats {
  strength: BigNumberish;
  dexterity: BigNumberish;
  vitality: BigNumberish;
  intelligence: BigNumberish;
  wisdom: BigNumberish;
  charisma: BigNumberish;
  luck: BigNumberish;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::ERC20Data` struct
export interface ERC20Data {
  token_amount: BigNumberish;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::ERC721Data` struct
export interface ERC721Data {
  token_id: BigNumberish;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::EntryCriteria` struct
export interface EntryCriteria {
  token_id: BigNumberish;
  entry_count: BigNumberish;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::GatedToken` struct
export interface GatedToken {
  token: string;
  entry_type: GatedEntryTypeEnum;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::Premium` struct
export interface Premium {
  token: string;
  token_amount: BigNumberish;
  token_distribution: Array<BigNumberish>;
  creator_fee: BigNumberish;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::Token` struct
export interface Token {
  token: string;
  name: string;
  symbol: string;
  token_data_type: TokenDataTypeEnum;
  is_registered: boolean;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TokenValue` struct
export interface TokenValue {
  name: string;
  symbol: string;
  token_data_type: TokenDataTypeEnum;
  is_registered: boolean;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::Tournament` struct
export interface Tournament {
  tournament_id: BigNumberish;
  name: BigNumberish;
  description: string;
  creator: string;
  registration_start_time: BigNumberish;
  registration_end_time: BigNumberish;
  start_time: BigNumberish;
  end_time: BigNumberish;
  submission_period: BigNumberish;
  winners_count: BigNumberish;
  gated_type: CairoOption<GatedTypeEnum>;
  entry_premium: CairoOption<Premium>;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TournamentConfig` struct
export interface TournamentConfig {
  contract: string;
  eth: string;
  lords: string;
  loot_survivor: string;
  oracle: string;
  golden_token: string;
  blobert: string;
  safe_mode: boolean;
  test_mode: boolean;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TournamentConfigValue` struct
export interface TournamentConfigValue {
  eth: string;
  lords: string;
  loot_survivor: string;
  oracle: string;
  golden_token: string;
  blobert: string;
  safe_mode: boolean;
  test_mode: boolean;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TournamentEntries` struct
export interface TournamentEntries {
  tournament_id: BigNumberish;
  entry_count: BigNumberish;
  premiums_formatted: boolean;
  distribute_called: boolean;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TournamentEntriesAddress` struct
export interface TournamentEntriesAddress {
  tournament_id: BigNumberish;
  address: string;
  entry_count: BigNumberish;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TournamentEntriesAddressValue` struct
export interface TournamentEntriesAddressValue {
  entry_count: BigNumberish;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TournamentEntriesValue` struct
export interface TournamentEntriesValue {
  entry_count: BigNumberish;
  premiums_formatted: boolean;
  distribute_called: boolean;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TournamentEntryAddresses` struct
export interface TournamentEntryAddresses {
  tournament_id: BigNumberish;
  addresses: Array<string>;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TournamentEntryAddressesValue` struct
export interface TournamentEntryAddressesValue {
  addresses: Array<string>;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TournamentGame` struct
export interface TournamentGame {
  tournament_id: BigNumberish;
  game_id: BigNumberish;
  address: string;
  status: EntryStatus;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TournamentGameValue` struct
export interface TournamentGameValue {
  address: string;
  status: EntryStatus;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TournamentPrize` struct
export interface TournamentPrize {
  tournament_id: BigNumberish;
  prize_key: BigNumberish;
  token: string;
  token_data_type: TokenDataTypeEnum;
  payout_position: BigNumberish;
  claimed: boolean;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TournamentPrizeValue` struct
export interface TournamentPrizeValue {
  token: string;
  token_data_type: TokenDataTypeEnum;
  payout_position: BigNumberish;
  claimed: boolean;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TournamentScores` struct
export interface TournamentScores {
  tournament_id: BigNumberish;
  top_score_ids: Array<BigNumberish>;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TournamentScoresValue` struct
export interface TournamentScoresValue {
  top_score_ids: Array<BigNumberish>;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TournamentStartsAddress` struct
export interface TournamentStartsAddress {
  tournament_id: BigNumberish;
  address: string;
  start_count: BigNumberish;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TournamentStartsAddressValue` struct
export interface TournamentStartsAddressValue {
  start_count: BigNumberish;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TournamentTotals` struct
export interface TournamentTotals {
  contract: string;
  total_tournaments: BigNumberish;
  total_prizes: BigNumberish;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TournamentTotalsValue` struct
export interface TournamentTotalsValue {
  total_tournaments: BigNumberish;
  total_prizes: BigNumberish;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TournamentValue` struct
export interface TournamentValue {
  name: BigNumberish;
  description: string;
  creator: string;
  registration_start_time: BigNumberish;
  registration_end_time: BigNumberish;
  start_time: BigNumberish;
  end_time: BigNumberish;
  submission_period: BigNumberish;
  winners_count: BigNumberish;
  gated_type: CairoOption<GatedTypeEnum>;
  entry_premium: CairoOption<Premium>;
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::EntryStatus` enum
export enum EntryStatus {
  Started,
  Submitted,
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::FreeGameTokenType` enum
export enum FreeGameTokenType {
  GoldenToken,
  LaunchTournamentChampion,
}

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::GatedEntryType` enum
export type GatedEntryType = {
  criteria: Array<EntryCriteria>;
  uniform: BigNumberish;
};
export type GatedEntryTypeEnum = CairoCustomEnum;

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::GatedType` enum
export type GatedType = {
  token: GatedToken;
  tournament: Array<BigNumberish>;
  address: Array<string>;
};
export type GatedTypeEnum = CairoCustomEnum;

// Type definition for `ls_tournaments_v0::ls15_components::models::tournament::TokenDataType` enum
export type TokenDataType = {
  erc20: ERC20Data;
  erc721: ERC721Data;
};
export type TokenDataTypeEnum = CairoCustomEnum;

export interface SchemaType extends ISchemaType {
  [namespace: string]: {
    Adventurer: WithFieldOrder<Adventurer>;
    AdventurerMetaModel: WithFieldOrder<AdventurerMetaModel>;
    AdventurerMetaModelValue: WithFieldOrder<AdventurerMetaModelValue>;
    AdventurerMetadataStorage: WithFieldOrder<AdventurerMetadataStorage>;
    AdventurerModel: WithFieldOrder<AdventurerModel>;
    AdventurerModelValue: WithFieldOrder<AdventurerModelValue>;
    Bag: WithFieldOrder<Bag>;
    BagModel: WithFieldOrder<BagModel>;
    BagModelValue: WithFieldOrder<BagModelValue>;
    Contracts: WithFieldOrder<Contracts>;
    ContractsValue: WithFieldOrder<ContractsValue>;
    Equipment: WithFieldOrder<Equipment>;
    FreeGameAvailableModel: WithFieldOrder<FreeGameAvailableModel>;
    FreeGameAvailableModelValue: WithFieldOrder<FreeGameAvailableModelValue>;
    GameCountModel: WithFieldOrder<GameCountModel>;
    GameCountModelValue: WithFieldOrder<GameCountModelValue>;
    Item: WithFieldOrder<Item>;
    Stats: WithFieldOrder<Stats>;
    ERC20Data: WithFieldOrder<ERC20Data>;
    ERC721Data: WithFieldOrder<ERC721Data>;
    EntryCriteria: WithFieldOrder<EntryCriteria>;
    GatedToken: WithFieldOrder<GatedToken>;
    Premium: WithFieldOrder<Premium>;
    Token: WithFieldOrder<Token>;
    TokenValue: WithFieldOrder<TokenValue>;
    Tournament: WithFieldOrder<Tournament>;
    TournamentConfig: WithFieldOrder<TournamentConfig>;
    TournamentConfigValue: WithFieldOrder<TournamentConfigValue>;
    TournamentEntries: WithFieldOrder<TournamentEntries>;
    TournamentEntriesAddress: WithFieldOrder<TournamentEntriesAddress>;
    TournamentEntriesAddressValue: WithFieldOrder<TournamentEntriesAddressValue>;
    TournamentEntriesValue: WithFieldOrder<TournamentEntriesValue>;
    TournamentEntryAddresses: WithFieldOrder<TournamentEntryAddresses>;
    TournamentEntryAddressesValue: WithFieldOrder<TournamentEntryAddressesValue>;
    TournamentGame: WithFieldOrder<TournamentGame>;
    TournamentGameValue: WithFieldOrder<TournamentGameValue>;
    TournamentPrize: WithFieldOrder<TournamentPrize>;
    TournamentPrizeValue: WithFieldOrder<TournamentPrizeValue>;
    TournamentScores: WithFieldOrder<TournamentScores>;
    TournamentScoresValue: WithFieldOrder<TournamentScoresValue>;
    TournamentStartsAddress: WithFieldOrder<TournamentStartsAddress>;
    TournamentStartsAddressValue: WithFieldOrder<TournamentStartsAddressValue>;
    TournamentTotals: WithFieldOrder<TournamentTotals>;
    TournamentTotalsValue: WithFieldOrder<TournamentTotalsValue>;
    TournamentValue: WithFieldOrder<TournamentValue>;
  };
}

export interface ModelTypes {
  [namespace: string]: {
    Adventurer: Adventurer;
    AdventurerMetaModel: AdventurerMetaModel;
    AdventurerMetaModelValue: AdventurerMetaModelValue;
    AdventurerMetadataStorage: AdventurerMetadataStorage;
    AdventurerModel: AdventurerModel;
    AdventurerModelValue: AdventurerModelValue;
    Bag: Bag;
    BagModel: BagModel;
    BagModelValue: BagModelValue;
    Contracts: Contracts;
    ContractsValue: ContractsValue;
    Equipment: Equipment;
    FreeGameAvailableModel: FreeGameAvailableModel;
    FreeGameAvailableModelValue: FreeGameAvailableModelValue;
    GameCountModel: GameCountModel;
    GameCountModelValue: GameCountModelValue;
    Item: Item;
    Stats: Stats;
    ERC20Data: ERC20Data;
    ERC721Data: ERC721Data;
    EntryCriteria: EntryCriteria;
    GatedToken: GatedToken;
    Premium: Premium;
    Token: Token;
    TokenValue: TokenValue;
    Tournament: Tournament;
    TournamentConfig: TournamentConfig;
    TournamentConfigValue: TournamentConfigValue;
    TournamentEntries: TournamentEntries;
    TournamentEntriesAddress: TournamentEntriesAddress;
    TournamentEntriesAddressValue: TournamentEntriesAddressValue;
    TournamentEntriesValue: TournamentEntriesValue;
    TournamentEntryAddresses: TournamentEntryAddresses;
    TournamentEntryAddressesValue: TournamentEntryAddressesValue;
    TournamentGame: TournamentGame;
    TournamentGameValue: TournamentGameValue;
    TournamentPrize: TournamentPrize;
    TournamentPrizeValue: TournamentPrizeValue;
    TournamentScores: TournamentScores;
    TournamentScoresValue: TournamentScoresValue;
    TournamentStartsAddress: TournamentStartsAddress;
    TournamentStartsAddressValue: TournamentStartsAddressValue;
    TournamentTotals: TournamentTotals;
    TournamentTotalsValue: TournamentTotalsValue;
    TournamentValue: TournamentValue;
  };
}

export const schema: SchemaType = {
  ls_tournaments_v0: {
    Adventurer: {
      fieldOrder: [
        "health",
        "xp",
        "gold",
        "beast_health",
        "stat_upgrades_available",
        "stats",
        "equipment",
        "battle_action_count",
        "mutated",
        "awaiting_item_specials",
      ],
      health: 0,
      xp: 0,
      gold: 0,
      beast_health: 0,
      stat_upgrades_available: 0,
      stats: {
        fieldOrder: [
          "strength",
          "dexterity",
          "vitality",
          "intelligence",
          "wisdom",
          "charisma",
          "luck",
        ],
        strength: 0,
        dexterity: 0,
        vitality: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
        luck: 0,
      },
      equipment: {
        fieldOrder: [
          "weapon",
          "chest",
          "head",
          "waist",
          "foot",
          "hand",
          "neck",
          "ring",
        ],
        weapon: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        chest: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        head: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        waist: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        foot: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        hand: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        neck: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        ring: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      },
      battle_action_count: 0,
      mutated: false,
      awaiting_item_specials: false,
    },
    AdventurerMetaModel: {
      fieldOrder: ["adventurer_id", "adventurer_meta"],
      adventurer_id: 0,
      adventurer_meta: {
        fieldOrder: [
          "birth_date",
          "death_date",
          "level_seed",
          "item_specials_seed",
          "rank_at_death",
          "delay_stat_reveal",
          "golden_token_id",
        ],
        birth_date: 0,
        death_date: 0,
        level_seed: 0,
        item_specials_seed: 0,
        rank_at_death: 0,
        delay_stat_reveal: false,
        golden_token_id: 0,
      },
    },
    AdventurerMetaModelValue: {
      fieldOrder: ["adventurer_meta"],
      adventurer_meta: {
        fieldOrder: [
          "birth_date",
          "death_date",
          "level_seed",
          "item_specials_seed",
          "rank_at_death",
          "delay_stat_reveal",
          "golden_token_id",
        ],
        birth_date: 0,
        death_date: 0,
        level_seed: 0,
        item_specials_seed: 0,
        rank_at_death: 0,
        delay_stat_reveal: false,
        golden_token_id: 0,
      },
    },
    AdventurerMetadataStorage: {
      fieldOrder: [
        "birth_date",
        "death_date",
        "level_seed",
        "item_specials_seed",
        "rank_at_death",
        "delay_stat_reveal",
        "golden_token_id",
      ],
      birth_date: 0,
      death_date: 0,
      level_seed: 0,
      item_specials_seed: 0,
      rank_at_death: 0,
      delay_stat_reveal: false,
      golden_token_id: 0,
    },
    AdventurerModel: {
      fieldOrder: ["adventurer_id", "adventurer"],
      adventurer_id: 0,
      adventurer: {
        fieldOrder: [
          "health",
          "xp",
          "gold",
          "beast_health",
          "stat_upgrades_available",
          "stats",
          "equipment",
          "battle_action_count",
          "mutated",
          "awaiting_item_specials",
        ],
        health: 0,
        xp: 0,
        gold: 0,
        beast_health: 0,
        stat_upgrades_available: 0,
        stats: {
          fieldOrder: [
            "strength",
            "dexterity",
            "vitality",
            "intelligence",
            "wisdom",
            "charisma",
            "luck",
          ],
          strength: 0,
          dexterity: 0,
          vitality: 0,
          intelligence: 0,
          wisdom: 0,
          charisma: 0,
          luck: 0,
        },
        equipment: {
          fieldOrder: [
            "weapon",
            "chest",
            "head",
            "waist",
            "foot",
            "hand",
            "neck",
            "ring",
          ],
          weapon: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          chest: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          head: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          waist: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          foot: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          hand: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          neck: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          ring: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        },
        battle_action_count: 0,
        mutated: false,
        awaiting_item_specials: false,
      },
    },
    AdventurerModelValue: {
      fieldOrder: ["adventurer"],
      adventurer: {
        fieldOrder: [
          "health",
          "xp",
          "gold",
          "beast_health",
          "stat_upgrades_available",
          "stats",
          "equipment",
          "battle_action_count",
          "mutated",
          "awaiting_item_specials",
        ],
        health: 0,
        xp: 0,
        gold: 0,
        beast_health: 0,
        stat_upgrades_available: 0,
        stats: {
          fieldOrder: [
            "strength",
            "dexterity",
            "vitality",
            "intelligence",
            "wisdom",
            "charisma",
            "luck",
          ],
          strength: 0,
          dexterity: 0,
          vitality: 0,
          intelligence: 0,
          wisdom: 0,
          charisma: 0,
          luck: 0,
        },
        equipment: {
          fieldOrder: [
            "weapon",
            "chest",
            "head",
            "waist",
            "foot",
            "hand",
            "neck",
            "ring",
          ],
          weapon: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          chest: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          head: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          waist: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          foot: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          hand: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          neck: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
          ring: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        },
        battle_action_count: 0,
        mutated: false,
        awaiting_item_specials: false,
      },
    },
    Bag: {
      fieldOrder: [
        "item_1",
        "item_2",
        "item_3",
        "item_4",
        "item_5",
        "item_6",
        "item_7",
        "item_8",
        "item_9",
        "item_10",
        "item_11",
        "item_12",
        "item_13",
        "item_14",
        "item_15",
        "mutated",
      ],
      item_1: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_2: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_3: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_4: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_5: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_6: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_7: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_8: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_9: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_10: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_11: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_12: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_13: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_14: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      item_15: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      mutated: false,
    },
    BagModel: {
      fieldOrder: ["adventurer_id", "bag"],
      adventurer_id: 0,
      bag: {
        fieldOrder: [
          "item_1",
          "item_2",
          "item_3",
          "item_4",
          "item_5",
          "item_6",
          "item_7",
          "item_8",
          "item_9",
          "item_10",
          "item_11",
          "item_12",
          "item_13",
          "item_14",
          "item_15",
          "mutated",
        ],
        item_1: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_2: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_3: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_4: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_5: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_6: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_7: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_8: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_9: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_10: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_11: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_12: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_13: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_14: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_15: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        mutated: false,
      },
    },
    BagModelValue: {
      fieldOrder: ["bag"],
      bag: {
        fieldOrder: [
          "item_1",
          "item_2",
          "item_3",
          "item_4",
          "item_5",
          "item_6",
          "item_7",
          "item_8",
          "item_9",
          "item_10",
          "item_11",
          "item_12",
          "item_13",
          "item_14",
          "item_15",
          "mutated",
        ],
        item_1: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_2: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_3: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_4: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_5: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_6: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_7: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_8: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_9: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_10: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_11: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_12: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_13: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_14: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        item_15: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
        mutated: false,
      },
    },
    Contracts: {
      fieldOrder: ["contract", "eth", "lords", "oracle"],
      contract: "",
      eth: "",
      lords: "",
      oracle: "",
    },
    ContractsValue: {
      fieldOrder: ["eth", "lords", "oracle"],
      eth: "",
      lords: "",
      oracle: "",
    },
    Equipment: {
      fieldOrder: [
        "weapon",
        "chest",
        "head",
        "waist",
        "foot",
        "hand",
        "neck",
        "ring",
      ],
      weapon: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      chest: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      head: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      waist: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      foot: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      hand: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      neck: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
      ring: { fieldOrder: ["id", "xp"], id: 0, xp: 0 },
    },
    FreeGameAvailableModel: {
      fieldOrder: ["free_game_type", "token_id", "available"],
      free_game_type: FreeGameTokenType.GoldenToken,
      token_id: 0,
      available: false,
    },
    FreeGameAvailableModelValue: {
      fieldOrder: ["available"],
      available: false,
    },
    GameCountModel: {
      fieldOrder: ["contract_address", "game_count"],
      contract_address: "",
      game_count: 0,
    },
    GameCountModelValue: {
      fieldOrder: ["game_count"],
      game_count: 0,
    },
    Item: {
      fieldOrder: ["id", "xp"],
      id: 0,
      xp: 0,
    },
    Stats: {
      fieldOrder: [
        "strength",
        "dexterity",
        "vitality",
        "intelligence",
        "wisdom",
        "charisma",
        "luck",
      ],
      strength: 0,
      dexterity: 0,
      vitality: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    ERC20Data: {
      fieldOrder: ["token_amount"],
      token_amount: 0,
    },
    ERC721Data: {
      fieldOrder: ["token_id"],
      token_id: 0,
    },
    EntryCriteria: {
      fieldOrder: ["token_id", "entry_count"],
      token_id: 0,
      entry_count: 0,
    },
    GatedToken: {
      fieldOrder: ["token", "entry_type"],
      token: "",
      entry_type: {
        fieldOrder: ["criteria", "uniform"],
        ...new CairoCustomEnum({
          criteria: [
            {
              fieldOrder: ["token_id", "entry_count"],
              token_id: 0,
              entry_count: 0,
            },
          ],
          uniform: undefined,
        }),
      } as WithFieldOrder<CairoCustomEnum>,
    },
    Premium: {
      fieldOrder: [
        "token",
        "token_amount",
        "token_distribution",
        "creator_fee",
      ],
      token: "",
      token_amount: 0,
      token_distribution: [0],
      creator_fee: 0,
    },
    Token: {
      fieldOrder: [
        "token",
        "name",
        "symbol",
        "token_data_type",
        "is_registered",
      ],
      token: "",
      name: "",
      symbol: "",
      token_data_type: {
        fieldOrder: ["erc20", "erc721"],
        ...new CairoCustomEnum({
          erc20: { fieldOrder: ["token_amount"], token_amount: 0 },
          erc721: undefined,
        }),
      } as WithFieldOrder<CairoCustomEnum>,
      is_registered: false,
    },
    TokenValue: {
      fieldOrder: ["name", "symbol", "token_data_type", "is_registered"],
      name: "",
      symbol: "",
      token_data_type: {
        fieldOrder: ["erc20", "erc721"],
        ...new CairoCustomEnum({
          erc20: { fieldOrder: ["token_amount"], token_amount: 0 },
          erc721: undefined,
        }),
      } as WithFieldOrder<CairoCustomEnum>,
      is_registered: false,
    },
    Tournament: {
      fieldOrder: [
        "tournament_id",
        "name",
        "description",
        "creator",
        "registration_start_time",
        "registration_end_time",
        "start_time",
        "end_time",
        "submission_period",
        "winners_count",
        "gated_type",
        "entry_premium",
      ],
      tournament_id: 0,
      name: 0,
      description: "",
      creator: "",
      registration_start_time: 0,
      registration_end_time: 0,
      start_time: 0,
      end_time: 0,
      submission_period: 0,
      winners_count: 0,
      gated_type: {
        fieldOrder: ["Some", "None"],
        ...new CairoOption(CairoOptionVariant.None),
      } as WithFieldOrder<CairoOption<GatedTypeEnum>>,
      entry_premium: {
        fieldOrder: ["Some", "None"],
        ...new CairoOption(CairoOptionVariant.None),
      } as WithFieldOrder<CairoOption<Premium>>,
    },
    TournamentConfig: {
      fieldOrder: [
        "contract",
        "eth",
        "lords",
        "loot_survivor",
        "oracle",
        "golden_token",
        "blobert",
        "safe_mode",
        "test_mode",
      ],
      contract: "",
      eth: "",
      lords: "",
      loot_survivor: "",
      oracle: "",
      golden_token: "",
      blobert: "",
      safe_mode: false,
      test_mode: false,
    },
    TournamentConfigValue: {
      fieldOrder: [
        "eth",
        "lords",
        "loot_survivor",
        "oracle",
        "golden_token",
        "blobert",
        "safe_mode",
        "test_mode",
      ],
      eth: "",
      lords: "",
      loot_survivor: "",
      oracle: "",
      golden_token: "",
      blobert: "",
      safe_mode: false,
      test_mode: false,
    },
    TournamentEntries: {
      fieldOrder: [
        "tournament_id",
        "entry_count",
        "premiums_formatted",
        "distribute_called",
      ],
      tournament_id: 0,
      entry_count: 0,
      premiums_formatted: false,
      distribute_called: false,
    },
    TournamentEntriesAddress: {
      fieldOrder: ["tournament_id", "address", "entry_count"],
      tournament_id: 0,
      address: "",
      entry_count: 0,
    },
    TournamentEntriesAddressValue: {
      fieldOrder: ["entry_count"],
      entry_count: 0,
    },
    TournamentEntriesValue: {
      fieldOrder: ["entry_count", "premiums_formatted", "distribute_called"],
      entry_count: 0,
      premiums_formatted: false,
      distribute_called: false,
    },
    TournamentEntryAddresses: {
      fieldOrder: ["tournament_id", "addresses"],
      tournament_id: 0,
      addresses: [""],
    },
    TournamentEntryAddressesValue: {
      fieldOrder: ["addresses"],
      addresses: [""],
    },
    TournamentGame: {
      fieldOrder: ["tournament_id", "game_id", "address", "status"],
      tournament_id: 0,
      game_id: 0,
      address: "",
      status: EntryStatus.Started,
    },
    TournamentGameValue: {
      fieldOrder: ["address", "status"],
      address: "",
      status: EntryStatus.Started,
    },
    TournamentPrize: {
      fieldOrder: [
        "tournament_id",
        "prize_key",
        "token",
        "token_data_type",
        "payout_position",
        "claimed",
      ],
      tournament_id: 0,
      prize_key: 0,
      token: "",
      token_data_type: {
        fieldOrder: ["erc20", "erc721"],
        ...new CairoCustomEnum({
          erc20: { fieldOrder: ["token_amount"], token_amount: 0 },
          erc721: undefined,
        }),
      } as WithFieldOrder<CairoCustomEnum>,
      payout_position: 0,
      claimed: false,
    },
    TournamentPrizeValue: {
      fieldOrder: ["token", "token_data_type", "payout_position", "claimed"],
      token: "",
      token_data_type: {
        fieldOrder: ["erc20", "erc721"],
        ...new CairoCustomEnum({
          erc20: { fieldOrder: ["token_amount"], token_amount: 0 },
          erc721: undefined,
        }),
      } as WithFieldOrder<CairoCustomEnum>,
      payout_position: 0,
      claimed: false,
    },
    TournamentScores: {
      fieldOrder: ["tournament_id", "top_score_ids"],
      tournament_id: 0,
      top_score_ids: [0],
    },
    TournamentScoresValue: {
      fieldOrder: ["top_score_ids"],
      top_score_ids: [0],
    },
    TournamentStartsAddress: {
      fieldOrder: ["tournament_id", "address", "start_count"],
      tournament_id: 0,
      address: "",
      start_count: 0,
    },
    TournamentStartsAddressValue: {
      fieldOrder: ["start_count"],
      start_count: 0,
    },
    TournamentTotals: {
      fieldOrder: ["contract", "total_tournaments", "total_prizes"],
      contract: "",
      total_tournaments: 0,
      total_prizes: 0,
    },
    TournamentTotalsValue: {
      fieldOrder: ["total_tournaments", "total_prizes"],
      total_tournaments: 0,
      total_prizes: 0,
    },
    TournamentValue: {
      fieldOrder: [
        "name",
        "description",
        "creator",
        "registration_start_time",
        "registration_end_time",
        "start_time",
        "end_time",
        "submission_period",
        "winners_count",
        "gated_type",
        "entry_premium",
      ],
      name: 0,
      description: "",
      creator: "",
      registration_start_time: 0,
      registration_end_time: 0,
      start_time: 0,
      end_time: 0,
      submission_period: 0,
      winners_count: 0,
      gated_type: {
        fieldOrder: ["Some", "None"],
        ...new CairoOption(CairoOptionVariant.None),
      } as WithFieldOrder<CairoOption<GatedTypeEnum>>,
      entry_premium: {
        fieldOrder: ["Some", "None"],
        ...new CairoOption(CairoOptionVariant.None),
      } as WithFieldOrder<CairoOption<Premium>>,
    },
  },
};

export enum Models {
  Adventurer = "ls_tournaments_v0-Adventurer",
  AdventurerMetaModel = "ls_tournaments_v0-AdventurerMetaModel",
  AdventurerMetaModelValue = "ls_tournaments_v0-AdventurerMetaModelValue",
  AdventurerMetadataStorage = "ls_tournaments_v0-AdventurerMetadataStorage",
  AdventurerModel = "ls_tournaments_v0-AdventurerModel",
  AdventurerModelValue = "ls_tournaments_v0-AdventurerModelValue",
  Bag = "ls_tournaments_v0-Bag",
  BagModel = "ls_tournaments_v0-BagModel",
  BagModelValue = "ls_tournaments_v0-BagModelValue",
  Contracts = "ls_tournaments_v0-Contracts",
  ContractsValue = "ls_tournaments_v0-ContractsValue",
  Equipment = "ls_tournaments_v0-Equipment",
  FreeGameAvailableModel = "ls_tournaments_v0-FreeGameAvailableModel",
  FreeGameAvailableModelValue = "ls_tournaments_v0-FreeGameAvailableModelValue",
  GameCountModel = "ls_tournaments_v0-GameCountModel",
  GameCountModelValue = "ls_tournaments_v0-GameCountModelValue",
  Item = "ls_tournaments_v0-Item",
  Stats = "ls_tournaments_v0-Stats",
  ERC20Data = "ls_tournaments_v0-ERC20Data",
  ERC721Data = "ls_tournaments_v0-ERC721Data",
  EntryCriteria = "ls_tournaments_v0-EntryCriteria",
  EntryStatus = "ls_tournaments_v0-EntryStatus",
  FreeGameTokenType = "ls_tournaments_v0-FreeGameTokenType",
  GatedEntryType = "ls_tournaments_v0-GatedEntryType",
  GatedToken = "ls_tournaments_v0-GatedToken",
  GatedType = "ls_tournaments_v0-GatedType",
  Premium = "ls_tournaments_v0-Premium",
  Token = "ls_tournaments_v0-Token",
  TokenDataType = "ls_tournaments_v0-TokenDataType",
  TokenValue = "ls_tournaments_v0-TokenValue",
  Tournament = "ls_tournaments_v0-Tournament",
  TournamentConfig = "ls_tournaments_v0-TournamentConfig",
  TournamentConfigValue = "ls_tournaments_v0-TournamentConfigValue",
  TournamentEntries = "ls_tournaments_v0-TournamentEntries",
  TournamentEntriesAddress = "ls_tournaments_v0-TournamentEntriesAddress",
  TournamentEntriesAddressValue = "ls_tournaments_v0-TournamentEntriesAddressValue",
  TournamentEntriesValue = "ls_tournaments_v0-TournamentEntriesValue",
  TournamentEntryAddresses = "ls_tournaments_v0-TournamentEntryAddresses",
  TournamentEntryAddressesValue = "ls_tournaments_v0-TournamentEntryAddressesValue",
  TournamentGame = "ls_tournaments_v0-TournamentGame",
  TournamentGameValue = "ls_tournaments_v0-TournamentGameValue",
  TournamentPrize = "ls_tournaments_v0-TournamentPrize",
  TournamentPrizeValue = "ls_tournaments_v0-TournamentPrizeValue",
  TournamentScores = "ls_tournaments_v0-TournamentScores",
  TournamentScoresValue = "ls_tournaments_v0-TournamentScoresValue",
  TournamentStartsAddress = "ls_tournaments_v0-TournamentStartsAddress",
  TournamentStartsAddressValue = "ls_tournaments_v0-TournamentStartsAddressValue",
  TournamentTotals = "ls_tournaments_v0-TournamentTotals",
  TournamentTotalsValue = "ls_tournaments_v0-TournamentTotalsValue",
  TournamentValue = "ls_tournaments_v0-TournamentValue",
}
