import { DojoProvider } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum, ByteArray } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const lords_mock_totalSupply = async () => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "lords_mock",
				entrypoint: "total_supply",
				calldata: [],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const lords_mock_balanceOf = async (account: string) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "lords_mock",
				entrypoint: "balance_of",
				calldata: [account],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const lords_mock_allowance = async (owner: string, spender: string) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "lords_mock",
				entrypoint: "allowance",
				calldata: [owner, spender],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const lords_mock_transfer = async (snAccount: Account | AccountInterface, recipient: string, amount: U256) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "lords_mock",
					entrypoint: "transfer",
					calldata: [recipient, amount],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const lords_mock_transferFrom = async (snAccount: Account | AccountInterface, sender: string, recipient: string, amount: U256) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "lords_mock",
					entrypoint: "transfer_from",
					calldata: [sender, recipient, amount],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const lords_mock_approve = async (snAccount: Account | AccountInterface, spender: string, amount: U256) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "lords_mock",
					entrypoint: "approve",
					calldata: [spender, amount],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const lords_mock_name = async () => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "lords_mock",
				entrypoint: "name",
				calldata: [],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const lords_mock_symbol = async () => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "lords_mock",
				entrypoint: "symbol",
				calldata: [],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const lords_mock_decimals = async () => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "lords_mock",
				entrypoint: "decimals",
				calldata: [],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const lords_mock_mint = async (snAccount: Account | AccountInterface, recipient: string, amount: U256) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "lords_mock",
					entrypoint: "mint",
					calldata: [recipient, amount],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_totalTournaments = async () => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "LSTournament",
				entrypoint: "total_tournaments",
				calldata: [],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_tournament = async (tournamentId: BigNumberish) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "LSTournament",
				entrypoint: "tournament",
				calldata: [tournamentId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_tournamentEntries = async (tournamentId: BigNumberish) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "LSTournament",
				entrypoint: "tournament_entries",
				calldata: [tournamentId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_topScores = async (tournamentId: BigNumberish) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "LSTournament",
				entrypoint: "top_scores",
				calldata: [tournamentId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_isTokenRegistered = async (token: string) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "LSTournament",
				entrypoint: "is_token_registered",
				calldata: [token],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_createTournament = async (snAccount: Account | AccountInterface, name: BigNumberish, description: ByteArray, registrationStartTime: BigNumberish, registrationEndTime: BigNumberish, startTime: BigNumberish, endTime: BigNumberish, submissionPeriod: BigNumberish, winnersCount: BigNumberish, gatedType: CairoOption<models.CairoCustomEnum>, entryPremium: CairoOption<models.CairoCustomEnum>) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "LSTournament",
					entrypoint: "create_tournament",
					calldata: [name, description, registrationStartTime, registrationEndTime, startTime, endTime, submissionPeriod, winnersCount, gatedType, entryPremium],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_enterTournament = async (snAccount: Account | AccountInterface, tournamentId: BigNumberish, gatedSubmissionType: CairoOption<models.CairoCustomEnum>) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "LSTournament",
					entrypoint: "enter_tournament",
					calldata: [tournamentId, gatedSubmissionType],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_startTournament = async (snAccount: Account | AccountInterface, tournamentId: BigNumberish, startAll: boolean, startCount: CairoOption<models.CairoCustomEnum>, clientRewardAddress: string, goldenTokenFreeGameTokenIds: Array<U256>, blobertFreeGameTokenIds: Array<U256>, weapon: BigNumberish, name: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "LSTournament",
					entrypoint: "start_tournament",
					calldata: [tournamentId, startAll, startCount, clientRewardAddress, goldenTokenFreeGameTokenIds, blobertFreeGameTokenIds, weapon, name],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_submitScores = async (snAccount: Account | AccountInterface, tournamentId: BigNumberish, gameIds: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "LSTournament",
					entrypoint: "submit_scores",
					calldata: [tournamentId, gameIds],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_addPrize = async (snAccount: Account | AccountInterface, tournamentId: BigNumberish, token: string, tokenDataType: CairoCustomEnum, position: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "LSTournament",
					entrypoint: "add_prize",
					calldata: [tournamentId, token, tokenDataType, position],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const LSTournament_distributePrizes = async (snAccount: Account | AccountInterface, tournamentId: BigNumberish, prizeKeys: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "LSTournament",
					entrypoint: "distribute_prizes",
					calldata: [tournamentId, prizeKeys],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_initializer = async (snAccount: Account | AccountInterface, ethAddress: string, lordsAddress: string, pragmaAddress: string) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "loot_survivor_mock",
					entrypoint: "initializer",
					calldata: [ethAddress, lordsAddress, pragmaAddress],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_balanceOf = async (account: string) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "loot_survivor_mock",
				entrypoint: "balance_of",
				calldata: [account],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_ownerOf = async (tokenId: U256) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "loot_survivor_mock",
				entrypoint: "owner_of",
				calldata: [tokenId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_safeTransferFrom = async (snAccount: Account | AccountInterface, from: string, to: string, tokenId: U256, data: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "loot_survivor_mock",
					entrypoint: "safe_transfer_from",
					calldata: [from, to, tokenId, data],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_transferFrom = async (snAccount: Account | AccountInterface, from: string, to: string, tokenId: U256) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "loot_survivor_mock",
					entrypoint: "transfer_from",
					calldata: [from, to, tokenId],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_approve = async (snAccount: Account | AccountInterface, to: string, tokenId: U256) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "loot_survivor_mock",
					entrypoint: "approve",
					calldata: [to, tokenId],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_setApprovalForAll = async (snAccount: Account | AccountInterface, operator: string, approved: boolean) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "loot_survivor_mock",
					entrypoint: "set_approval_for_all",
					calldata: [operator, approved],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_getApproved = async (tokenId: U256) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "loot_survivor_mock",
				entrypoint: "get_approved",
				calldata: [tokenId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_isApprovedForAll = async (owner: string, operator: string) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "loot_survivor_mock",
				entrypoint: "is_approved_for_all",
				calldata: [owner, operator],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_supportsInterface = async (interfaceId: BigNumberish) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "loot_survivor_mock",
				entrypoint: "supports_interface",
				calldata: [interfaceId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_name = async () => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "loot_survivor_mock",
				entrypoint: "name",
				calldata: [],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_symbol = async () => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "loot_survivor_mock",
				entrypoint: "symbol",
				calldata: [],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_tokenUri = async (tokenId: U256) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "loot_survivor_mock",
				entrypoint: "token_uri",
				calldata: [tokenId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_getAdventurer = async (adventurerId: BigNumberish) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "loot_survivor_mock",
				entrypoint: "get_adventurer",
				calldata: [adventurerId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_getAdventurerMeta = async (adventurerId: BigNumberish) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "loot_survivor_mock",
				entrypoint: "get_adventurer_meta",
				calldata: [adventurerId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_getBag = async (adventurerId: BigNumberish) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "loot_survivor_mock",
				entrypoint: "get_bag",
				calldata: [adventurerId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_getCostToPlay = async () => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "loot_survivor_mock",
				entrypoint: "get_cost_to_play",
				calldata: [],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_freeGameAvailable = async (freeGameType: models.FreeGameTokenType, tokenId: BigNumberish) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "loot_survivor_mock",
				entrypoint: "free_game_available",
				calldata: [freeGameType, tokenId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_newGame = async (snAccount: Account | AccountInterface, clientRewardAddress: string, weapon: BigNumberish, name: BigNumberish, goldenTokenId: BigNumberish, delayReveal: boolean, customRenderer: string, launchTournamentWinnerTokenId: BigNumberish, mintTo: string) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "loot_survivor_mock",
					entrypoint: "new_game",
					calldata: [clientRewardAddress, weapon, name, goldenTokenId, delayReveal, customRenderer, launchTournamentWinnerTokenId, mintTo],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_setAdventurer = async (snAccount: Account | AccountInterface, adventurerId: BigNumberish, adventurer: models.Adventurer) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "loot_survivor_mock",
					entrypoint: "set_adventurer",
					calldata: [adventurerId, adventurer],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_setAdventurerMeta = async (snAccount: Account | AccountInterface, adventurerId: BigNumberish, adventurerMeta: models.AdventurerMetadataStorage) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "loot_survivor_mock",
					entrypoint: "set_adventurer_meta",
					calldata: [adventurerId, adventurerMeta],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_setBag = async (snAccount: Account | AccountInterface, adventurerId: BigNumberish, bag: models.Bag) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "loot_survivor_mock",
					entrypoint: "set_bag",
					calldata: [adventurerId, bag],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const loot_survivor_mock_setFreeGameAvailable = async (freeGameType: models.FreeGameTokenType, tokenId: BigNumberish) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "loot_survivor_mock",
				entrypoint: "set_free_game_available",
				calldata: [freeGameType, tokenId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const pragma_mock_getDataMedian = async (dataType: models.DataType) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "pragma_mock",
				entrypoint: "get_data_median",
				calldata: [dataType],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const erc20_mock_mint = async (snAccount: Account | AccountInterface, recipient: string, amount: U256) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "erc20_mock",
					entrypoint: "mint",
					calldata: [recipient, amount],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const erc20_mock_totalSupply = async () => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "erc20_mock",
				entrypoint: "total_supply",
				calldata: [],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const erc20_mock_balanceOf = async (account: string) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "erc20_mock",
				entrypoint: "balance_of",
				calldata: [account],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const erc20_mock_allowance = async (owner: string, spender: string) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "erc20_mock",
				entrypoint: "allowance",
				calldata: [owner, spender],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const erc20_mock_transfer = async (snAccount: Account | AccountInterface, recipient: string, amount: U256) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "erc20_mock",
					entrypoint: "transfer",
					calldata: [recipient, amount],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const erc20_mock_transferFrom = async (snAccount: Account | AccountInterface, sender: string, recipient: string, amount: U256) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "erc20_mock",
					entrypoint: "transfer_from",
					calldata: [sender, recipient, amount],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const erc20_mock_approve = async (snAccount: Account | AccountInterface, spender: string, amount: U256) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "erc20_mock",
					entrypoint: "approve",
					calldata: [spender, amount],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const erc20_mock_name = async () => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "erc20_mock",
				entrypoint: "name",
				calldata: [],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const erc20_mock_symbol = async () => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "erc20_mock",
				entrypoint: "symbol",
				calldata: [],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const erc20_mock_decimals = async () => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "erc20_mock",
				entrypoint: "decimals",
				calldata: [],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const erc721_mock_mint = async (snAccount: Account | AccountInterface, recipient: string, tokenId: U256) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "erc721_mock",
					entrypoint: "mint",
					calldata: [recipient, tokenId],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const erc721_mock_balanceOf = async (account: string) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "erc721_mock",
				entrypoint: "balance_of",
				calldata: [account],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const erc721_mock_ownerOf = async (tokenId: U256) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "erc721_mock",
				entrypoint: "owner_of",
				calldata: [tokenId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const erc721_mock_safeTransferFrom = async (snAccount: Account | AccountInterface, from: string, to: string, tokenId: U256, data: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "erc721_mock",
					entrypoint: "safe_transfer_from",
					calldata: [from, to, tokenId, data],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const erc721_mock_transferFrom = async (snAccount: Account | AccountInterface, from: string, to: string, tokenId: U256) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "erc721_mock",
					entrypoint: "transfer_from",
					calldata: [from, to, tokenId],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const erc721_mock_approve = async (snAccount: Account | AccountInterface, to: string, tokenId: U256) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "erc721_mock",
					entrypoint: "approve",
					calldata: [to, tokenId],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const erc721_mock_setApprovalForAll = async (snAccount: Account | AccountInterface, operator: string, approved: boolean) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "erc721_mock",
					entrypoint: "set_approval_for_all",
					calldata: [operator, approved],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const erc721_mock_getApproved = async (tokenId: U256) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "erc721_mock",
				entrypoint: "get_approved",
				calldata: [tokenId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const erc721_mock_isApprovedForAll = async (owner: string, operator: string) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "erc721_mock",
				entrypoint: "is_approved_for_all",
				calldata: [owner, operator],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const erc721_mock_supportsInterface = async (interfaceId: BigNumberish) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "erc721_mock",
				entrypoint: "supports_interface",
				calldata: [interfaceId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const erc721_mock_name = async () => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "erc721_mock",
				entrypoint: "name",
				calldata: [],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const erc721_mock_symbol = async () => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "erc721_mock",
				entrypoint: "symbol",
				calldata: [],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const erc721_mock_tokenUri = async (tokenId: U256) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "erc721_mock",
				entrypoint: "token_uri",
				calldata: [tokenId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const tournament_mock_initializer = async (snAccount: Account | AccountInterface, ethAddress: string, lordsAddress: string, lootSurvivorAddress: string, oracleAddress: string, goldenToken: string, blobert: string, safeMode: boolean, testMode: boolean, testErc20: string, testErc721: string) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "tournament_mock",
					entrypoint: "initializer",
					calldata: [ethAddress, lordsAddress, lootSurvivorAddress, oracleAddress, goldenToken, blobert, safeMode, testMode, testErc20, testErc721],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const tournament_mock_totalTournaments = async () => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "tournament_mock",
				entrypoint: "total_tournaments",
				calldata: [],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const tournament_mock_tournament = async (tournamentId: BigNumberish) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "tournament_mock",
				entrypoint: "tournament",
				calldata: [tournamentId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const tournament_mock_tournamentEntries = async (tournamentId: BigNumberish) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "tournament_mock",
				entrypoint: "tournament_entries",
				calldata: [tournamentId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const tournament_mock_topScores = async (tournamentId: BigNumberish) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "tournament_mock",
				entrypoint: "top_scores",
				calldata: [tournamentId],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const tournament_mock_isTokenRegistered = async (token: string) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "tournament_mock",
				entrypoint: "is_token_registered",
				calldata: [token],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const tournament_mock_createTournament = async (snAccount: Account | AccountInterface, name: BigNumberish, description: ByteArray, registrationStartTime: BigNumberish, registrationEndTime: BigNumberish, startTime: BigNumberish, endTime: BigNumberish, submissionPeriod: BigNumberish, winnersCount: BigNumberish, gatedType: CairoOption<models.CairoCustomEnum>, entryPremium: CairoOption<models.CairoCustomEnum>) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "tournament_mock",
					entrypoint: "create_tournament",
					calldata: [name, description, registrationStartTime, registrationEndTime, startTime, endTime, submissionPeriod, winnersCount, gatedType, entryPremium],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const tournament_mock_enterTournament = async (snAccount: Account | AccountInterface, tournamentId: BigNumberish, gatedSubmissionType: CairoOption<models.CairoCustomEnum>) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "tournament_mock",
					entrypoint: "enter_tournament",
					calldata: [tournamentId, gatedSubmissionType],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const tournament_mock_startTournament = async (snAccount: Account | AccountInterface, tournamentId: BigNumberish, startAll: boolean, startCount: CairoOption<models.CairoCustomEnum>, clientRewardAddress: string, goldenTokenFreeGameTokenIds: Array<U256>, blobertFreeGameTokenIds: Array<U256>, weapon: BigNumberish, name: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "tournament_mock",
					entrypoint: "start_tournament",
					calldata: [tournamentId, startAll, startCount, clientRewardAddress, goldenTokenFreeGameTokenIds, blobertFreeGameTokenIds, weapon, name],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const tournament_mock_submitScores = async (snAccount: Account | AccountInterface, tournamentId: BigNumberish, gameIds: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "tournament_mock",
					entrypoint: "submit_scores",
					calldata: [tournamentId, gameIds],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const tournament_mock_addPrize = async (snAccount: Account | AccountInterface, tournamentId: BigNumberish, token: string, tokenDataType: CairoCustomEnum, position: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "tournament_mock",
					entrypoint: "add_prize",
					calldata: [tournamentId, token, tokenDataType, position],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const tournament_mock_distributePrizes = async (snAccount: Account | AccountInterface, tournamentId: BigNumberish, prizeKeys: Array<BigNumberish>) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "tournament_mock",
					entrypoint: "distribute_prizes",
					calldata: [tournamentId, prizeKeys],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const eth_mock_totalSupply = async () => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "eth_mock",
				entrypoint: "total_supply",
				calldata: [],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const eth_mock_balanceOf = async (account: string) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "eth_mock",
				entrypoint: "balance_of",
				calldata: [account],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const eth_mock_allowance = async (owner: string, spender: string) => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "eth_mock",
				entrypoint: "allowance",
				calldata: [owner, spender],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const eth_mock_transfer = async (snAccount: Account | AccountInterface, recipient: string, amount: U256) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "eth_mock",
					entrypoint: "transfer",
					calldata: [recipient, amount],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const eth_mock_transferFrom = async (snAccount: Account | AccountInterface, sender: string, recipient: string, amount: U256) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "eth_mock",
					entrypoint: "transfer_from",
					calldata: [sender, recipient, amount],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const eth_mock_approve = async (snAccount: Account | AccountInterface, spender: string, amount: U256) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "eth_mock",
					entrypoint: "approve",
					calldata: [spender, amount],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const eth_mock_name = async () => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "eth_mock",
				entrypoint: "name",
				calldata: [],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const eth_mock_symbol = async () => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "eth_mock",
				entrypoint: "symbol",
				calldata: [],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const eth_mock_decimals = async () => {
		try {
			return await provider.call("ls_tournaments_v0", {
				contractName: "eth_mock",
				entrypoint: "decimals",
				calldata: [],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const eth_mock_mint = async (snAccount: Account | AccountInterface, recipient: string, amount: U256) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "eth_mock",
					entrypoint: "mint",
					calldata: [recipient, amount],
				},
				"ls_tournaments_v0",
			);
		} catch (error) {
			console.error(error);
		}
	};

	return {
		lords_mock: {
			totalSupply: lords_mock_totalSupply,
			balanceOf: lords_mock_balanceOf,
			allowance: lords_mock_allowance,
			transfer: lords_mock_transfer,
			transferFrom: lords_mock_transferFrom,
			approve: lords_mock_approve,
			name: lords_mock_name,
			symbol: lords_mock_symbol,
			decimals: lords_mock_decimals,
			mint: lords_mock_mint,
		},
		LSTournament: {
			totalTournaments: LSTournament_totalTournaments,
			tournament: LSTournament_tournament,
			tournamentEntries: LSTournament_tournamentEntries,
			topScores: LSTournament_topScores,
			isTokenRegistered: LSTournament_isTokenRegistered,
			createTournament: LSTournament_createTournament,
			enterTournament: LSTournament_enterTournament,
			startTournament: LSTournament_startTournament,
			submitScores: LSTournament_submitScores,
			addPrize: LSTournament_addPrize,
			distributePrizes: LSTournament_distributePrizes,
		},
		loot_survivor_mock: {
			initializer: loot_survivor_mock_initializer,
			balanceOf: loot_survivor_mock_balanceOf,
			ownerOf: loot_survivor_mock_ownerOf,
			safeTransferFrom: loot_survivor_mock_safeTransferFrom,
			transferFrom: loot_survivor_mock_transferFrom,
			approve: loot_survivor_mock_approve,
			setApprovalForAll: loot_survivor_mock_setApprovalForAll,
			getApproved: loot_survivor_mock_getApproved,
			isApprovedForAll: loot_survivor_mock_isApprovedForAll,
			supportsInterface: loot_survivor_mock_supportsInterface,
			name: loot_survivor_mock_name,
			symbol: loot_survivor_mock_symbol,
			tokenUri: loot_survivor_mock_tokenUri,
			getAdventurer: loot_survivor_mock_getAdventurer,
			getAdventurerMeta: loot_survivor_mock_getAdventurerMeta,
			getBag: loot_survivor_mock_getBag,
			getCostToPlay: loot_survivor_mock_getCostToPlay,
			freeGameAvailable: loot_survivor_mock_freeGameAvailable,
			newGame: loot_survivor_mock_newGame,
			setAdventurer: loot_survivor_mock_setAdventurer,
			setAdventurerMeta: loot_survivor_mock_setAdventurerMeta,
			setBag: loot_survivor_mock_setBag,
			setFreeGameAvailable: loot_survivor_mock_setFreeGameAvailable,
		},
		pragma_mock: {
			getDataMedian: pragma_mock_getDataMedian,
		},
		erc20_mock: {
			mint: erc20_mock_mint,
			totalSupply: erc20_mock_totalSupply,
			balanceOf: erc20_mock_balanceOf,
			allowance: erc20_mock_allowance,
			transfer: erc20_mock_transfer,
			transferFrom: erc20_mock_transferFrom,
			approve: erc20_mock_approve,
			name: erc20_mock_name,
			symbol: erc20_mock_symbol,
			decimals: erc20_mock_decimals,
		},
		erc721_mock: {
			mint: erc721_mock_mint,
			balanceOf: erc721_mock_balanceOf,
			ownerOf: erc721_mock_ownerOf,
			safeTransferFrom: erc721_mock_safeTransferFrom,
			transferFrom: erc721_mock_transferFrom,
			approve: erc721_mock_approve,
			setApprovalForAll: erc721_mock_setApprovalForAll,
			getApproved: erc721_mock_getApproved,
			isApprovedForAll: erc721_mock_isApprovedForAll,
			supportsInterface: erc721_mock_supportsInterface,
			name: erc721_mock_name,
			symbol: erc721_mock_symbol,
			tokenUri: erc721_mock_tokenUri,
		},
		tournament_mock: {
			initializer: tournament_mock_initializer,
			totalTournaments: tournament_mock_totalTournaments,
			tournament: tournament_mock_tournament,
			tournamentEntries: tournament_mock_tournamentEntries,
			topScores: tournament_mock_topScores,
			isTokenRegistered: tournament_mock_isTokenRegistered,
			createTournament: tournament_mock_createTournament,
			enterTournament: tournament_mock_enterTournament,
			startTournament: tournament_mock_startTournament,
			submitScores: tournament_mock_submitScores,
			addPrize: tournament_mock_addPrize,
			distributePrizes: tournament_mock_distributePrizes,
		},
		eth_mock: {
			totalSupply: eth_mock_totalSupply,
			balanceOf: eth_mock_balanceOf,
			allowance: eth_mock_allowance,
			transfer: eth_mock_transfer,
			transferFrom: eth_mock_transferFrom,
			approve: eth_mock_approve,
			name: eth_mock_name,
			symbol: eth_mock_symbol,
			decimals: eth_mock_decimals,
			mint: eth_mock_mint,
		},
	};
}