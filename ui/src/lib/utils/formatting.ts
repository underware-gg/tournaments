import { TournamentFormData } from "@/containers/CreateTournament";
import { bigintToHex, stringToFelt } from "@/lib/utils";
import {
  addAddressPadding,
  CairoOption,
  CairoOptionVariant,
  CairoCustomEnum,
} from "starknet";
import { Prize, Tournament } from "@/generated/models.gen";

const SECONDS_IN_DAY = 86400;

export const processTournamentData = (
  formData: TournamentFormData,
  address: string,
  tournamentCount: bigint
): Tournament => {
  const startTimestamp = Math.floor(
    formData.startTime.getTime() / 1000 -
      formData.startTime.getTimezoneOffset() * 60
  );

  // End time is start time + duration in days
  const endTimestamp = startTimestamp + formData.duration * SECONDS_IN_DAY;

  return {
    id: BigInt(tournamentCount) + 1n,
    creator: addAddressPadding(address),
    metadata: {
      name: addAddressPadding(bigintToHex(stringToFelt(formData.name))),
      description: formData.description,
    },
    schedule: {
      registration: new CairoOption(CairoOptionVariant.Some, {
        start: startTimestamp,
        end: startTimestamp,
      }),
      game: {
        start: startTimestamp,
        end: endTimestamp,
      },
      submission_period: formData.submissionPeriod,
    },
    game_config: {
      address: formData.game,
      settings_id: formData.settings,
      prize_spots: formData.leaderboardSize,
    },
    entry_fee: new CairoOption(CairoOptionVariant.Some, {
      token_address: formData.entryFees?.tokenAddress!,
      amount: formData.entryFees?.amount!,
      distribution: formData.entryFees?.prizeDistribution?.map(
        (prize) => prize.percentage
      )!,
      tournament_creator_share: new CairoOption(
        CairoOptionVariant.Some,
        formData.entryFees?.creatorFeePercentage
      ),
      game_creator_share: new CairoOption(
        CairoOptionVariant.Some,
        formData.entryFees?.gameFeePercentage
      ),
    }),
    entry_requirement: new CairoOption(
      CairoOptionVariant.Some,
      new CairoCustomEnum({
        token: formData.gatingOptions?.token,
        tournament: {
          winners: formData.gatingOptions?.tournament?.ids,
          participants: formData.gatingOptions?.tournament?.ids,
        },
        allowlist: formData.gatingOptions?.addresses,
      })
    ),
  };
};

export const processPrizes = (
  formData: TournamentFormData,
  tournamentCount: bigint,
  prizeCount: bigint
): Prize[] => {
  if (!formData.enableBonusPrizes || !formData.bonusPrizes?.length) {
    return [];
  }

  return formData.bonusPrizes.map((prize, index) => ({
    id: BigInt(prizeCount) + 1n,
    tournament_id: BigInt(tournamentCount) + 1n,
    token_address: prize.tokenAddress,
    token_type:
      prize.type === "ERC20"
        ? new CairoCustomEnum({
            erc20: {
              amount: prize.amount,
            },
            erc721: undefined,
          })
        : new CairoCustomEnum({
            erc20: {
              amount: prize.tokenId,
            },
            erc721: undefined,
          }),
    payout_position: prize.position,
    claimed: false,
  }));
};

// Add other helper functions for processing specific parts...
