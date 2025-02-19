import { Button } from "@/components/ui/button";
import { ARROW_LEFT } from "@/components/Icons";
import { useNavigate } from "react-router-dom";
import { useGetAllRegistrationsQuery } from "@/dojo/hooks/useSdkQueries";
import { useSystemCalls } from "@/dojo/hooks/useSystemCalls";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { useGetGameScoresInListQuery } from "@/dojo/hooks/useSdkQueries";
import { bigintToHex } from "@/lib/utils";
import { addAddressPadding } from "starknet";
import { useDojo } from "@/context/dojo";

const Play = () => {
  const navigate = useNavigate();
  const { endGame } = useSystemCalls();
  const { nameSpace } = useDojo();
  const { entities } = useGetAllRegistrationsQuery({
    limit: 10,
    offset: 0,
  });
  const [scores, setScores] = useState<Record<string, number>>({});

  const gameIds = useMemo(() => {
    if (!entities) return [];
    return entities
      .filter((entity) => entity?.Registration?.game_token_id != null)
      .map((entity) =>
        addAddressPadding(
          bigintToHex(entity?.Registration?.game_token_id ?? 0n)
        )
      );
  }, [entities]);

  const { entities: currentScoreEntities } = useGetGameScoresInListQuery({
    namespace: nameSpace,
    gameIds,
    isSepolia: false,
  });

  const currentScores = useMemo(() => {
    if (!currentScoreEntities) return {};
    return currentScoreEntities.reduce(
      (acc: Record<string, number>, entity) => {
        if (entity?.Score?.game_id) {
          acc[entity.Score.game_id.toString()] = Number(entity.Score.score);
        }
        return acc;
      },
      {}
    );
  }, [currentScoreEntities]);

  const handleScoreChange = (id: string, value: string) => {
    setScores((prev) => ({
      ...prev,
      [id]: Number(value),
    }));
  };

  return (
    <div className="flex flex-col gap-5 h-[calc(100vh-80px)] w-3/4 mx-auto px-20 pt-20">
      <div className="space-y-5">
        <div className="flex flex-row justify-between items-center">
          <Button variant="outline" onClick={() => navigate("/")}>
            <ARROW_LEFT />
            Home
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        {entities?.map((entity, index) => (
          <div key={index} className="flex flex-row items-center gap-10">
            <div className="flex flex-row items-center gap-2">
              <p className="text-retro-green-dark">Tournament</p>
              <p>{entity?.Registration?.tournament_id?.toString()}</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-retro-green-dark">Game</p>
              <p>{entity?.Registration?.game_token_id?.toString()}</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              {!currentScores[
                entity?.Registration?.game_token_id?.toString() ?? ""
              ] ? (
                <Input
                  type="number"
                  value={
                    scores[
                      entity?.Registration?.game_token_id?.toString() ?? ""
                    ]
                  }
                  onChange={(e) =>
                    handleScoreChange(
                      entity?.Registration?.game_token_id?.toString() ?? "",
                      e.target.value
                    )
                  }
                  placeholder="Enter XP"
                />
              ) : (
                <p>
                  {
                    currentScores[
                      entity?.Registration?.game_token_id?.toString() ?? ""
                    ]
                  }
                  XP
                </p>
              )}
              <Button
                onClick={() =>
                  endGame(
                    entity?.Registration?.game_token_id?.toString() ?? "",
                    scores[
                      entity?.Registration?.game_token_id?.toString() ?? ""
                    ]
                  )
                }
                disabled={
                  !!currentScores[
                    entity?.Registration?.game_token_id?.toString() ?? ""
                  ]
                }
              >
                End Game
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Play;
