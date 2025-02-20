import { Card } from "@/components/ui/card";
import { feltToString, formatTime } from "@/lib/utils";
import TokenGameIcon from "@/components/icons/TokenGameIcon";
import { USER } from "@/components/Icons";
import { useNavigate } from "react-router-dom";
import { Tournament, Token } from "@/generated/models.gen";
import { useDojoStore } from "@/dojo/hooks/useDojoStore";
import { useDojo } from "@/context/dojo";
import {
  groupPrizesByTokens,
  getErc20TokenSymbols,
  calculateTotalValue,
  countTotalNFTs,
} from "@/lib/utils/formatting";
import { useEkuboPrices } from "@/hooks/useEkuboPrices";

interface TournamentCardProps {
  tournament: Tournament;
  index: number;
  status: "live" | "upcoming" | "ended";
  prizes: any[];
  entryCount: number;
}

export const TournamentCard = ({
  tournament,
  index,
  status,
  prizes,
  entryCount,
}: TournamentCardProps) => {
  const { nameSpace } = useDojo();
  const navigate = useNavigate();
  const state = useDojoStore.getState();

  // token entities
  const tokenModels = state.getEntitiesByModel(nameSpace, "Token");
  const tokens = tokenModels.map(
    (model) => model.models[nameSpace].Token
  ) as Token[];

  const groupedPrizes = groupPrizesByTokens(prizes ?? [], tokens);

  const erc20TokenSymbols = getErc20TokenSymbols(groupedPrizes);
  const { prices } = useEkuboPrices({ tokens: erc20TokenSymbols });
  const totalPrizesValueUSD = calculateTotalValue(groupedPrizes, prices);

  const totalPrizeNFTs = countTotalNFTs(groupedPrizes);

  const registrationType = tournament?.schedule.registration.isNone()
    ? "Open"
    : "Fixed";

  const startDate = new Date(Number(tournament.schedule.game.start) * 1000);
  const endDate = new Date(Number(tournament.schedule.game.end) * 1000);
  const currentDate = new Date();
  const startsIn = formatTime(
    (startDate.getTime() - currentDate.getTime()) / 1000
  );
  const endsIn = formatTime((endDate.getTime() - startDate.getTime()) / 1000);

  const gameAddress = tournament.game_config.address;

  const hasEntryFee = tournament?.entry_fee.isSome();

  const entryFee = tournament?.entry_fee.isSome()
    ? Number(BigInt(tournament?.entry_fee.Some?.amount!) / 10n ** 18n)
    : "Free";

  console.log(groupedPrizes);

  return (
    <Card
      variant="outline"
      interactive={true}
      borderColor="rgba(0, 218, 163, 1)"
      onClick={() => {
        navigate(`/tournament/${Number(tournament.id).toString()}`);
      }}
      className="animate-in fade-in zoom-in duration-300 ease-out"
    >
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between font-astronaut text-xl">
            <p>{feltToString(tournament?.metadata?.name!)}</p>
            <div className="flex flex-row items-center">
              <span className="w-6">
                <USER />
              </span>
              : {entryCount}
            </div>
          </div>
          <div className="w-full h-0.5 bg-retro-green/25" />
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col w-1/2">
            <div className="flex flex-row gap-2">
              <span className="text-retro-green-dark">Registration:</span>
              <span>{registrationType}</span>
            </div>
            <div className="flex flex-row gap-2">
              {status === "upcoming" ? (
                <>
                  <span className="text-retro-green-dark">Starts In:</span>
                  <span>{startsIn}</span>
                </>
              ) : (
                <>
                  <span className="text-retro-green-dark">Ends In:</span>
                  <span>{endsIn}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-row -space-x-2 w-1/2 justify-end px-2">
            <TokenGameIcon key={index} game={gameAddress} size={"md"} />
            {/* {tournament.games.slice(0, 3).map((game, index) => {
              // If this is the 3rd item and there are more games
              if (index === 2 && tournament.games.length > 3) {
                return (
                  <span
                    key={index}
                    className="relative inline-flex items-center justify-center"
                  >
                    <span className={"text-retro-green/25 size-10"}>
                      <TOKEN />
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center rounded-full text-retro-green font-astronaut">
                      +{tournament.games.length - 2}
                    </div>
                  </span>
                );
              }
              // Regular token icon for first 2 items
              return <TokenGameIcon key={index} game={game} size={"md"} />;
            })} */}
          </div>
        </div>
        <div className="flex flex-row items-center justify-between w-3/4 mx-auto">
          <div className="flex flex-row items-center gap-2">
            <span className="text-retro-green-dark">Fee:</span>
            <span>{hasEntryFee ? `$${entryFee}` : "FREE"}</span>
          </div>
          <div className="flex flex-row items-center gap-2">
            <span className="text-retro-green-dark">Pot:</span>
            {totalPrizesValueUSD > 0 || totalPrizeNFTs > 0 ? (
              <div className="flex flex-row items-center gap-2">
                {totalPrizesValueUSD > 0 && <span>${totalPrizesValueUSD}</span>}
                {totalPrizeNFTs > 0 && (
                  <span>
                    {totalPrizeNFTs} NFT{totalPrizeNFTs === 1 ? "" : "s"}
                  </span>
                )}
              </div>
            ) : (
              <span>No Prizes</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
