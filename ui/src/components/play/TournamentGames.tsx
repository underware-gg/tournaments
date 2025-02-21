import { useGetTournamentLeaderboard } from "@/dojo/hooks/useSqlQueries";
import { useDojo } from "@/context/dojo";
import { ChainId } from "@/dojo/config";
import { Tournament } from "@/generated/models.gen";
import { useGameNamespace } from "@/dojo/hooks/useGameNamespace";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSystemCalls } from "@/dojo/hooks/useSystemCalls";
import { useAccount } from "@starknet-react/core";

interface TournamentGamesProps {
  tournament: Tournament;
}

const TournamentGames = ({ tournament }: TournamentGamesProps) => {
  const { address } = useAccount();
  const { nameSpace, selectedChainConfig } = useDojo();
  const isSepolia = selectedChainConfig.chainId === ChainId.SN_SEPOLIA;
  const [currentPage, _setCurrentPage] = useState(1);
  const [scores, setScores] = useState<Record<string, number>>({});
  const { endGame } = useSystemCalls();

  const tournamentId = tournament.id;
  const { gameNamespace } = useGameNamespace(tournament.game_config.address);

  const { data: leaderboard } = useGetTournamentLeaderboard({
    namespace: nameSpace,
    tournamentId: tournamentId,
    gameNamespace: gameNamespace ?? "",
    isSepolia: isSepolia,
    limit: 10,
    offset: (currentPage - 1) * 5,
  });

  const handleScoreChange = (id: string, value: string) => {
    setScores((prev) => ({
      ...prev,
      [id]: Number(value),
    }));
  };

  return (
    <div className="flex flex-col gap-5">
      {leaderboard?.map((entry, index) => (
        <div key={index} className="flex flex-row items-center gap-10">
          <div className="flex flex-row items-center gap-2">
            <p className="text-retro-green-dark">Game</p>
            <p>{Number(entry?.game_token_id).toString()}</p>
          </div>
          <div className="flex flex-row items-center gap-2">
            {entry?.score === 0 ? (
              <Input
                type="number"
                value={scores[entry?.game_token_id?.toString() ?? ""]}
                onChange={(e) =>
                  handleScoreChange(
                    entry?.game_token_id?.toString() ?? "",
                    e.target.value
                  )
                }
                placeholder="Enter XP"
              />
            ) : (
              <p>
                {entry?.score}
                XP
              </p>
            )}
            <Button
              onClick={() =>
                endGame(
                  entry?.game_token_id?.toString() ?? "",
                  scores[entry?.game_token_id?.toString() ?? ""]
                )
              }
              disabled={entry?.score > 0 || !address}
            >
              End Game
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TournamentGames;
