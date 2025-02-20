import { motion } from "framer-motion";
import { getOrdinalSuffix } from "@/lib/utils";
import { useEkuboPrices } from "@/hooks/useEkuboPrices";
import {
  getErc20TokenSymbols,
  calculatePrizeValue,
  calculateTotalValue,
  countTotalNFTs,
} from "@/lib/utils/formatting";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface PrizeProps {
  position: number;
  prizes: Record<
    string,
    {
      type: "erc20" | "erc721";
      payout_position: string;
      address: string;
      value: bigint[] | bigint;
    }
  >;
}

const Prize = ({ position, prizes }: PrizeProps) => {
  const erc20Symbols = getErc20TokenSymbols(prizes);
  const { prices } = useEkuboPrices({ tokens: erc20Symbols });

  const totalPrizesValueUSD = calculateTotalValue(prizes, prices);
  const totalPrizeNFTs = countTotalNFTs(prizes);

  return (
    <HoverCard openDelay={50} closeDelay={0}>
      <HoverCardTrigger asChild>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: position * 0.1 }}
          className={`flex items-center gap-4 p-3 rounded-lg border border-retro-green/20 w-fit hover:cursor-pointer`}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-retro-green/20">
            <span className="font-astronaut text-lg text-retro-green">
              {position}
              <sup>{getOrdinalSuffix(position)}</sup>
            </span>
          </div>
          {totalPrizesValueUSD > 0 || totalPrizeNFTs > 0 ? (
            <div className="flex flex-row items-center gap-2 font-astronaut text-lg">
              {totalPrizesValueUSD > 0 && <span>${totalPrizesValueUSD}</span>}
              {totalPrizesValueUSD > 0 && totalPrizeNFTs > 0 && (
                <span className="text-retro-green/25">|</span>
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
        </motion.div>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-48 p-4 text-sm z-50"
        align="start"
        side="top"
        sideOffset={5}
      >
        <div className="space-y-2">
          <h4 className="font-medium font-astronaut">
            {position}
            <sup>{getOrdinalSuffix(position)}</sup> Prize
          </h4>
          <div className="space-y-3">
            {Object.entries(prizes).map(([symbol, prize]) => {
              const USDValue = calculatePrizeValue(prize, symbol, prices);
              return (
                <div key={symbol} className="flex justify-between items-center">
                  <span className="text-retro-green-dark">
                    {prize.type === "erc20"
                      ? `${prize.value} ${symbol}`
                      : `${(prize.value as bigint[]).length} NFT${
                          (prize.value as bigint[]).length === 1 ? "" : "s"
                        }`}
                  </span>
                  {prize.type === "erc20" && (
                    <span className="text-neutral-500">~${USDValue}</span>
                  )}
                </div>
              );
            })}
            {totalPrizesValueUSD > 0 && (
              <div className="pt-2 border-t border-retro-green/20">
                <div className="flex justify-between items-center">
                  <span className="font-astronaut">Total</span>
                  <span>${totalPrizesValueUSD}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default Prize;
