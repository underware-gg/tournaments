import { motion } from "framer-motion";
import { getOrdinalSuffix } from "@/lib/utils";
import { useEkuboPrices } from "@/hooks/useEkuboPrices";
import {
  getErc20TokenSymbols,
  calculateTotalValue,
  countTotalNFTs,
} from "@/lib/utils/formatting";

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
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: position * 0.1 }}
      className={`flex items-center gap-4 p-3 rounded-lg border border-retro-green/20 w-fit`}
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
      {/* {index === 0 && (
        <div className="text-2xl text-retro-green">
          <TROPHY />
        </div>
      )} */}
    </motion.div>
  );
};

export default Prize;
