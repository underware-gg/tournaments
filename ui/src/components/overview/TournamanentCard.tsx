import { Card } from "@/components/ui/card";
import { feltToString, formatTime } from "@/lib/utils";
import TokenGameIcon from "@/components/icons/TokenGameIcon";
import { USER } from "@/components/Icons";
import { useNavigate } from "react-router-dom";
import { Tournament, Token, Prize } from "@/generated/models.gen";
import { useDojoStore } from "@/dojo/hooks/useDojoStore";
import { useDojo } from "@/context/dojo";
import {
  groupPrizesByTokens,
  getErc20TokenSymbols,
  calculateTotalValue,
  countTotalNFTs,
  extractEntryFeePrizes,
} from "@/lib/utils/formatting";
import { useEkuboPrices } from "@/hooks/useEkuboPrices";
import { TabType } from "@/components/overview/TournamentTabs";
import { Skeleton } from "@/components/ui/skeleton";

interface TournamentCardProps {
  tournament: Tournament;
  index: number;
  status: TabType;
  prizes: Prize[] | null;
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

  const entryFeeToken = tournament?.entry_fee.Some?.token_address;
  const entryFeeTokenSymbol = tokens.find(
    (t) => t.address === entryFeeToken
  )?.symbol;

  const entryFeePrizes = extractEntryFeePrizes(
    tournament?.id,
    tournament?.entry_fee,
    entryCount
  );

  const allPrizes = [...entryFeePrizes, ...(prizes ?? [])];

  const groupedPrizes = groupPrizesByTokens(allPrizes, tokens);

  const erc20TokenSymbols = getErc20TokenSymbols(groupedPrizes);
  const { prices, isLoading: pricesLoading } = useEkuboPrices({
    tokens: [...erc20TokenSymbols, entryFeeTokenSymbol ?? ""],
  });

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
  const endsInSeconds = (endDate.getTime() - currentDate.getTime()) / 1000;
  const endsIn = endsInSeconds > 0 ? formatTime(endsInSeconds) : "Ended ";

  const gameAddress = tournament.game_config.address;

  const hasEntryFee = tournament?.entry_fee.isSome();

  const entryFee = tournament?.entry_fee.isSome()
    ? (
        Number(BigInt(tournament?.entry_fee.Some?.amount!) / 10n ** 18n) *
        Number(prices[entryFeeTokenSymbol ?? ""])
      ).toFixed(2)
    : "Free";

  if (
    tournament.game_config.address ===
    "0x06f32edb41a707fc6e368b37dd74890b1a518f5fba6b7fef7061ef72afc27336"
  ) {
    return (
      <Card
        variant="outline"
        className="animate-in fade-in zoom-in duration-300 ease-out"
      >
        <div className="flex flex-col justify-center items-center h-full">
          <span className="font-astronaut text-2xl">Game not recognized</span>
        </div>
      </Card>
    );
  }

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
          </div>
        </div>
        <div className="flex flex-row items-center justify-between w-3/4 mx-auto">
          <div className="flex flex-row items-center gap-2">
            <span className="text-retro-green-dark">Fee:</span>
            {pricesLoading ? (
              <Skeleton className="h-6 w-16 bg-retro-green/20" />
            ) : (
              <span>{hasEntryFee ? `$${entryFee}` : "FREE"}</span>
            )}
          </div>
          <div className="flex flex-row items-center gap-2">
            <span className="text-retro-green-dark">Pot:</span>
            {pricesLoading ? (
              <Skeleton className="h-6 w-16 bg-retro-green/20" />
            ) : totalPrizesValueUSD > 0 || totalPrizeNFTs > 0 ? (
              <div className="flex flex-row items-center gap-2">
                {totalPrizesValueUSD > 0 && (
                  <span>${totalPrizesValueUSD.toFixed(2)}</span>
                )}
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
