import { useAccount } from "@starknet-react/core";
import { useDojoStore } from "@/dojo/hooks/useDojoStore";
import { useDojo } from "@/context/dojo";
import { v4 as uuidv4 } from "uuid";
import {
  Tournament,
  Prize,
  Token,
  EntryFee,
  QualificationProof,
} from "@/generated/models.gen";
import { Account, BigNumberish, CairoOption, CallData } from "starknet";
import { useToast } from "@/hooks/useToast";
import { useOptimisticUpdates } from "@/dojo/hooks/useOptimisticUpdates";
import { feltToString } from "@/lib/utils";
import { useTournamentContracts } from "@/dojo/hooks/useTournamentContracts";
import { ChainId } from "@/dojo/config";

export function selectTournament(client: any, isMainnet: boolean): any {
  return isMainnet ? client["LSTournament"] : client["tournament_mock"];
}

export const useSystemCalls = () => {
  const state = useDojoStore((state) => state);

  const { client, selectedChainConfig } = useDojo();
  const { account, address } = useAccount();
  const { toast } = useToast();
  const {
    applyTournamentEntryUpdate,
    applyTournamentSubmitScoresUpdate,
    applyTournamentPrizeUpdate,
    applyTournamentCreateAndAddPrizesUpdate,
  } = useOptimisticUpdates();
  const { tournamentAddress } = useTournamentContracts();

  const isMainnet = selectedChainConfig.chainId === ChainId.SN_MAIN;

  // Tournament

  const approveAndEnterTournament = async (
    entryFeeToken: CairoOption<EntryFee>,
    tournamentId: BigNumberish,
    tournamentName: string,
    newEntryCount: BigNumberish,
    newEntryAddressCount: BigNumberish,
    player_name: BigNumberish,
    player_address: BigNumberish,
    qualification: CairoOption<QualificationProof>
  ) => {
    const { wait, revert, confirm } = applyTournamentEntryUpdate(
      tournamentId,
      newEntryCount,
      newEntryAddressCount,
      address
    );

    try {
      let calls = [];
      if (entryFeeToken.isSome()) {
        calls.push({
          contractAddress: entryFeeToken.Some?.token_address!,
          entrypoint: "approve",
          calldata: CallData.compile([
            tournamentId,
            entryFeeToken.Some?.amount!,
            "0",
          ]),
        });
      }
      calls.push({
        contractAddress: tournamentAddress,
        entrypoint: "enter_tournament",
        calldata: CallData.compile([
          tournamentId,
          player_name,
          player_address,
          qualification,
        ]),
      });

      const tx = await (account as Account)?.execute(calls);

      await wait();

      if (tx) {
        toast({
          title: "Entered Tournament!",
          description: `Entered tournament ${tournamentName}`,
        });
      }
    } catch (error) {
      revert();
      console.error("Error executing enter tournament:", error);
      throw error;
    } finally {
      confirm();
    }
  };

  const submitScores = async (
    tournamentId: BigNumberish,
    tournamentName: string,
    gameIds: Array<BigNumberish>
  ) => {
    const { wait, revert, confirm } = applyTournamentSubmitScoresUpdate(
      tournamentId,
      gameIds
    );

    try {
      const resolvedClient = await client;
      const tournamentContract = selectTournament(resolvedClient, isMainnet);
      const tx = isMainnet
        ? await tournamentContract.submitScores(account!, tournamentId, gameIds)
        : tournamentContract.submitScores(account!, tournamentId, gameIds);

      await wait();

      if (tx) {
        toast({
          title: "Submitted Scores!",
          description: `Submitted scores for tournament ${tournamentName}`,
        });
      }
    } catch (error) {
      revert();
      console.error("Error executing create tournament:", error);
      throw error;
    } finally {
      confirm();
    }
  };

  const approveAndAddPrize = async (
    tournamentId: BigNumberish,
    tournamentName: string,
    prize: Prize,
    prizeKey: BigNumberish,
    showToast: boolean
  ) => {
    toast({
      title: "Adding Prize...",
      description: `Adding prize for tournament ${tournamentName}`,
    });

    const { wait, revert, confirm } = applyTournamentPrizeUpdate(
      tournamentId,
      prizeKey,
      prize.token_address,
      prize.token_type,
      prize.payout_position
    );

    try {
      let calls = [];
      calls.push({
        contractAddress: prize.token_address,
        entrypoint: "approve",
        calldata: CallData.compile([
          tournamentAddress,
          prize.token_type.activeVariant() === "erc20"
            ? prize.token_type.variant.erc20?.token_amount!
            : prize.token_type.variant.erc721?.token_id!,
          "0",
        ]),
      });
      calls.push({
        contractAddress: tournamentAddress,
        entrypoint: "add_prize",
        calldata: CallData.compile([
          tournamentId,
          prize.token_address,
          prize.token_type,
          prize.payout_position,
        ]),
      });

      const tx = await (account as Account)?.execute(calls);

      await wait();

      if (showToast && tx) {
        toast({
          title: "Added Prize!",
          description: `Added prize for tournament ${tournamentName}`,
        });
      }
    } catch (error) {
      revert();
      console.error("Error executing add prize:", error);
      throw error;
    } finally {
      confirm();
    }
  };

  const createTournamentAndApproveAndAddPrizes = async (
    tournament: Tournament,
    prizes: Prize[]
  ) => {
    const { wait, revert, confirm } = applyTournamentCreateAndAddPrizesUpdate(
      tournament,
      prizes
    );

    try {
      let calls = [];
      const createCall = {
        contractAddress: tournamentAddress,
        entrypoint: "create_tournament",
        calldata: [
          tournament.metadata,
          tournament.schedule,
          tournament.game_config,
          tournament.entry_fee,
          tournament.entry_requirement,
        ],
      };
      calls.push(createCall);
      for (const prize of prizes) {
        const approvePrizeCall = {
          contractAddress: prize.token_address,
          entrypoint: "approve",
          calldata: CallData.compile([
            tournamentAddress,
            prize.token_type.activeVariant() === "erc20"
              ? prize.token_type.variant.erc20?.token_amount!
              : prize.token_type.variant.erc721?.token_id!,
            "0",
          ]),
        };
        calls.push(approvePrizeCall);
        const addPrizesCall = {
          contractAddress: tournamentAddress,
          entrypoint: "add_prize",
          calldata: [
            prize.tournament_id,
            prize.token_address,
            prize.token_type,
            prize.payout_position,
          ],
        };
        calls.push(addPrizesCall);
      }

      const tx = await (account as Account)?.execute(calls);

      await wait();

      if (tx) {
        toast({
          title: "Created Tournament!",
          description: `Created tournament ${feltToString(
            tournament.metadata.name
          )}`,
        });
      }
    } catch (error) {
      revert();
      console.error("Error executing create tournament:", error);
      throw error;
    } finally {
      confirm();
    }
  };

  const distributePrizes = async (
    tournamentId: BigNumberish,
    tournamentName: string,
    prizeKeys: Array<BigNumberish>
  ) => {
    const transactionId = uuidv4();

    try {
      const resolvedClient = await client;
      const tournamentContract = selectTournament(resolvedClient, isMainnet);
      const tx = isMainnet
        ? await tournamentContract.distributePrizes(
            account!,
            tournamentId,
            prizeKeys
          )
        : tournamentContract.distributePrizes(
            account!,
            tournamentId,
            prizeKeys
          );

      if (tx) {
        toast({
          title: "Distributed Prizes!",
          description: `Distributed prizes for tournament ${tournamentName}`,
        });
      }
    } catch (error) {
      state.revertOptimisticUpdate(transactionId);
      console.error("Error executing distribute prizes:", error);
      throw error;
    } finally {
      state.confirmTransaction(transactionId);
    }
  };

  // Game

  const endGame = async (gameId: BigNumberish, score: BigNumberish) => {
    try {
      const resolvedClient = await client;
      resolvedClient.game_mock.endGame(account!, gameId, score);
    } catch (error) {
      console.error("Error executing end game:", error);
      throw error;
    }
  };

  const getBalanceGeneral = async (tokenAddress: string) => {
    const result = await (account as Account)?.callContract({
      contractAddress: tokenAddress,
      entrypoint: "balance_of",
      calldata: [address!],
    });
    console.log(result);
    return BigInt(result[0]);
  };

  const approveERC20Multiple = async (tokens: Token[]) => {
    const summedCalls = Object.values(
      tokens.reduce((acc: { [key: string]: any }, token) => {
        const tokenAddress = token.address;
        if (!acc[tokenAddress]) {
          acc[tokenAddress] = {
            contractAddress: tokenAddress,
            entrypoint: "approve",
            calldata: CallData.compile([
              tournamentAddress,
              token.token_type.variant.erc20?.token_amount!,
              "0",
            ]),
            totalAmount: BigInt(
              token.token_type.variant.erc20?.token_amount! || 0
            ),
          };
        } else {
          // Sum the amounts for the same token
          acc[tokenAddress].totalAmount += BigInt(
            token.token_type.variant.erc20?.token_amount! || 0
          );
          // Update calldata with new total
          acc[tokenAddress].calldata = CallData.compile([
            tournamentAddress,
            acc[tokenAddress].totalAmount.toString(),
            "0",
          ]);
        }
        return acc;
      }, {})
    ).map(({ contractAddress, entrypoint, calldata }) => ({
      contractAddress,
      entrypoint,
      calldata,
    }));
    console.log(summedCalls);
    await (account as Account)?.execute(summedCalls);
  };

  const approveERC721Multiple = async (tokens: Token[]) => {
    let calls = [];
    for (const token of tokens) {
      calls.push({
        contractAddress: token.address,
        entrypoint: "approve",
        calldata: CallData.compile([
          tournamentAddress,
          token.token_type.variant.erc721?.token_id!,
          "0",
        ]),
      });
    }
    await (account as Account)?.execute(calls);
  };

  return {
    approveAndEnterTournament,
    submitScores,
    approveAndAddPrize,
    createTournamentAndApproveAndAddPrizes,
    distributePrizes,
    endGame,
    getBalanceGeneral,
    approveERC20Multiple,
    approveERC721Multiple,
  };
};
