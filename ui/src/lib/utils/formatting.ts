import { TournamentFormData } from "@/containers/CreateTournament";
import { bigintToHex, stringToFelt } from "@/lib/utils";
import {
  addAddressPadding,
  CairoOption,
  CairoOptionVariant,
  CairoCustomEnum,
} from "starknet";
import { Prize, Tournament, Token } from "@/generated/models.gen";
import Games from "@/assets/games";

const SECONDS_IN_DAY = 86400;
const SECONDS_IN_HOUR = 3600;

export const processTournamentData = (
  formData: TournamentFormData,
  address: string,
  tournamentCount: number
): Tournament => {
  const startTimestamp = Math.floor(
    formData.startTime.getTime() / 1000 -
      formData.startTime.getTimezoneOffset() * 60
  );

  const currentTime = Number(BigInt(new Date().getTime()) / 1000n + 60n);

  // End time is start time + duration in days
  const endTimestamp = startTimestamp + formData.duration * SECONDS_IN_DAY;

  const gameAddress = Games[formData.game].address;

  // Process entry requirement based on type and requirement
  let entryRequirement;
  if (formData.enableGating && formData.gatingOptions?.type) {
    switch (formData.gatingOptions.type) {
      case "token":
        entryRequirement = new CairoCustomEnum({
          token: formData.gatingOptions.token,
        });
        break;
      case "tournament":
        entryRequirement = new CairoCustomEnum({
          tournament: {
            winners:
              formData.gatingOptions.tournament?.requirement === "won"
                ? formData.gatingOptions.tournament.ids
                : [],
            participants:
              formData.gatingOptions.tournament?.requirement === "participated"
                ? formData.gatingOptions.tournament.ids
                : [],
          },
        });
        break;
      case "addresses":
        entryRequirement = new CairoCustomEnum({
          allowlist: formData.gatingOptions.addresses,
        });
        break;
    }
  }

  return {
    id: tournamentCount + 1,
    creator: addAddressPadding(address),
    metadata: {
      name: addAddressPadding(bigintToHex(stringToFelt(formData.name))),
      description: formData.description,
    },
    schedule: {
      registration:
        formData.type === "fixed"
          ? new CairoOption(CairoOptionVariant.Some, {
              start: currentTime,
              end: startTimestamp,
            })
          : new CairoOption(CairoOptionVariant.None),
      game: {
        start: startTimestamp,
        end: endTimestamp,
      },
      submission_period: Number(formData.submissionPeriod) * SECONDS_IN_HOUR,
    },
    game_config: {
      address: addAddressPadding(gameAddress),
      settings_id: 0,
      prize_spots: formData.leaderboardSize,
    },
    entry_fee: formData.enableEntryFees
      ? new CairoOption(CairoOptionVariant.Some, {
          token_address: formData.entryFees?.tokenAddress!,
          amount: addAddressPadding(
            bigintToHex(formData.entryFees?.amount! * 10 ** 18)
          ),
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
        })
      : new CairoOption(CairoOptionVariant.None),
    entry_requirement: formData.enableGating
      ? new CairoOption(CairoOptionVariant.Some, entryRequirement)
      : new CairoOption(CairoOptionVariant.None),
  };
};

export const processPrizes = (
  formData: TournamentFormData,
  tournamentCount: number,
  prizeCount: number
): Prize[] => {
  if (!formData.enableBonusPrizes || !formData.bonusPrizes?.length) {
    return [];
  }

  return formData.bonusPrizes.map((prize, index) => ({
    id: prizeCount + 1,
    tournament_id: tournamentCount + 1,
    token_address: prize.tokenAddress,
    token_type:
      prize.type === "ERC20"
        ? new CairoCustomEnum({
            erc20: {
              amount: addAddressPadding(bigintToHex(prize.amount! * 10 ** 18)),
            },
          })
        : new CairoCustomEnum({
            erc721: {
              token_id: addAddressPadding(
                bigintToHex(prize.tokenId! * 10 ** 18)
              ),
            },
          }),
    payout_position: prize.position,
    claimed: false,
  }));
};

export const groupPrizes = (prizes: Prize[], tokens: Token[]) =>
  prizes.reduce(
    (acc, prize) => {
      const position = prize.payout_position.toString();
      if (!acc[position]) {
        acc[position] = {
          payout_position: position,
          tokens: {} as Record<
            string,
            {
              type: "erc20" | "erc721";
              values: string[];
              address: string;
            }
          >,
        };
      }

      const tokenModel = tokens.find((t) => t.address === prize.token_address);

      const tokenSymbol = tokenModel?.symbol!;
      if (!acc[position].tokens[tokenSymbol]) {
        acc[position].tokens[tokenSymbol] = {
          type: prize.token_type.variant.erc721 ? "erc721" : "erc20",
          values: [],
          address: prize.token_address,
        };
      }

      if (prize.token_type.activeVariant() === "erc721") {
        acc[position].tokens[tokenSymbol].values.push(
          `#${Number(prize.token_type.variant.erc721.token_id!).toString()}`
        );
      } else if (prize.token_type.activeVariant() === "erc20") {
        acc[position].tokens[tokenSymbol].values.push(
          (
            BigInt(prize.token_type.variant.erc20.amount) /
            10n ** 18n
          ).toString()
        );
      }

      return acc;
    },
    {} as Record<
      string,
      {
        payout_position: string;
        tokens: Record<
          string,
          {
            type: "erc20" | "erc721";
            values: string[];
            address: string;
          }
        >;
      }
    >
  );

// Add other helper functions for processing specific parts...
