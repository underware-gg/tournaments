import { QUESTION, TROPHY } from "@/components/Icons";
import { Card } from "@/components/ui/card";
import PrizeDisplay from "@/components/tournament/prizes/Prize";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { TokenPrices } from "@/hooks/useEkuboPrices";
import { PositionPrizes } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface PrizesContainerProps {
  prizesExist: boolean;
  lowestPrizePosition: number;
  groupedPrizes: PositionPrizes;
  totalPrizesValueUSD: number;
  totalPrizeNFTs: number;
  prices: TokenPrices;
  pricesLoading: boolean;
  allPricesFound: boolean;
}

const PrizesContainer = ({
  prizesExist,
  lowestPrizePosition,
  groupedPrizes,
  totalPrizesValueUSD,
  totalPrizeNFTs,
  prices,
  pricesLoading,
  allPricesFound,
}: PrizesContainerProps) => {
  const [showPrizes, setShowPrizes] = useState(false);

  useEffect(() => {
    setShowPrizes(prizesExist);
  }, [prizesExist]);

  return (
    <Card
      variant="outline"
      className={`w-full transition-all duration-300 ease-in-out ${
        showPrizes ? "h-full" : "h-[45px] sm:h-[60px]"
      }`}
    >
      <div className="flex flex-col">
        <div className="flex flex-row justify-between h-6 sm:h-8">
          <div className="flex flex-row items-center gap-2">
            <span className="font-astronaut text-lg sm:text-2xl">Prizes</span>
            {pricesLoading ? (
              <Skeleton className="h-6 w-24 bg-primary/10" />
            ) : (
              <>
                {allPricesFound ? (
                  totalPrizesValueUSD > 0 && (
                    <span className="font-astronaut text-md sm:text-xl text-primary-dark">
                      ${totalPrizesValueUSD.toFixed(2)}
                    </span>
                  )
                ) : (
                  <span className="w-8">
                    <QUESTION />
                  </span>
                )}
                {totalPrizeNFTs > 0 && (
                  <span className="font-astronaut text-xl text-primary-dark">
                    {totalPrizeNFTs} NFT{totalPrizeNFTs === 1 ? "" : "s"}
                  </span>
                )}
              </>
            )}
          </div>
          <div className="flex flex-row items-center gap-2">
            {prizesExist ? (
              <>
                <span className="text-sm sm:text-base text-neutral-500">
                  {showPrizes ? "Hide" : "Show Prizes"}
                </span>
                <Switch
                  checked={showPrizes}
                  onCheckedChange={setShowPrizes}
                  className="h-4 sm:h-6"
                />
              </>
            ) : (
              <span className="text-neutral-500">No Prizes Added</span>
            )}
            <div className="flex flex-row items-center font-astronaut text-lg sm:text-2xl">
              <span className="w-6 sm:w-8">
                <TROPHY />
              </span>
              : {lowestPrizePosition}
            </div>
          </div>
        </div>
        <div
          className={`transition-all duration-300 delay-150 ease-in-out ${
            showPrizes ? "h-auto opacity-100" : "h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="w-full h-0.5 bg-primary/25 mt-2" />
          <div className="p-2 sm:p-4">
            {prizesExist && (
              <div className="flex flex-row gap-3 overflow-x-auto">
                {pricesLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg border border-primary/20 w-fit hover:cursor-pointer"
                    >
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <Skeleton className="h-6 w-full bg-primary/10" />
                    </div>
                  ))
                ) : (
                  <>
                    {Object.entries(groupedPrizes)
                      .sort(
                        (a, b) =>
                          Number(a[1].payout_position) -
                          Number(b[1].payout_position)
                      )
                      .map(([position, prizes], index) => (
                        <PrizeDisplay
                          key={index}
                          position={Number(position)}
                          prizes={prizes}
                          prices={prices}
                        />
                      ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PrizesContainer;
