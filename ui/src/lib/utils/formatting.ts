import { TournamentFormData } from "@/containers/CreateTournament";
import { bigintToHex, stringToFelt } from "@/lib/utils";
import { addAddressPadding } from "starknet";

interface TournamentMetadata {
  name: string;
  description: string;
}

interface Schedule {
  registration: Option<Period>;
  game: Period;
  submission_period: number;
}

interface Period {
  start: number;
  end: number;
}

interface GameConfig {
  address: string;
  settings_id: number;
  prize_spots: number;
}

interface ProcessedTournament {
  tournament_id: string;
  creator: string;
  metadata: TournamentMetadata;
  start_time: string;
  registration_start_time: string;
  registration_end_time: string;
  end_time: string;
  submission_period: string;
  winners_count: number;
  gated_type: string;
  entry_premium: string;
}

interface ProcessedPrize {
  prize_key: string;
  token: string;
  token_data_type: string;
  tournament_id: string;
  payout_position: number;
  claimed: boolean;
}

const SECONDS_IN_DAY = 86400;

export const processTournamentData = (
  formData: TournamentFormData,
  address: string,
  tournamentCount: number
): ProcessedTournament => {
  const currentTime = Number(BigInt(new Date().getTime()) / 1000n + 60n);
  const startTimestamp = Math.floor(
    formData.startTime.getTime() / 1000 -
      formData.startTime.getTimezoneOffset() * 60
  );

  // End time is start time + duration in days
  const endTimestamp = startTimestamp + formData.duration * SECONDS_IN_DAY;

  return {
    tournament_id: addAddressPadding(bigintToHex(BigInt(tournamentCount) + 1n)),
    creator: addAddressPadding(address),
    metadata: {
      name: addAddressPadding(bigintToHex(stringToFelt(formData.name))),
      description: formData.description,
    },
    start_time: addAddressPadding(bigintToHex(startTimestamp)),
    registration_start_time: addAddressPadding(
      bigintToHex(Math.floor(currentTime - new Date().getTimezoneOffset() * 60))
    ),
    registration_end_time: addAddressPadding(bigintToHex(startTimestamp)),
    end_time: addAddressPadding(bigintToHex(endTimestamp)),
    submission_period: addAddressPadding(
      bigintToHex(formData.submissionPeriod)
    ),
    winners_count: formData.leaderboardSize,
    gated_type: processGatingType(formData),
    entry_premium: processEntryFees(formData),
  };
};

export const processPrizes = (
  formData: TournamentFormData,
  tournamentCount: number,
  prizeCount: number
): ProcessedPrize[] => {
  if (!formData.enableBonusPrizes || !formData.bonusPrizes?.length) {
    return [];
  }

  return formData.bonusPrizes.map((prize, index) => ({
    prize_key: addAddressPadding(
      bigintToHex(BigInt(prizeCount) + BigInt(index) + 1n)
    ),
    token: prize.tokenAddress,
    token_data_type: prize.type === "ERC20" ? "erc20" : "erc721",
    tournament_id: addAddressPadding(bigintToHex(BigInt(tournamentCount) + 1n)),
    payout_position: prize.position,
    claimed: false,
  }));
};

// Add other helper functions for processing specific parts...
