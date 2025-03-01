import { motion } from "framer-motion";
import { getOrdinalSuffix } from "@/lib/utils";
import {
  calculatePrizeValue,
  calculateTotalValue,
  countTotalNFTs,
} from "@/lib/utils/formatting";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { TokenPrices } from "@/hooks/useEkuboPrices";
import { TokenPrizes } from "@/lib/types";
import { getTokenLogoUrl } from "@/lib/tokensMeta";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PrizeProps {
  position: number;
  prizes: TokenPrizes;
  prices: TokenPrices;
}

const Prize = ({ position, prizes, prices }: PrizeProps) => {
  const totalPrizesValueUSD = calculateTotalValue(prizes, prices);
  const totalPrizeNFTs = countTotalNFTs(prizes);
  const [isMobileDialogOpen, setIsMobileDialogOpen] = useState(false);

  // Function to render prize details content
  const renderPrizeDetails = () => (
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
              {prize.type === "erc20" ? (
                <div className="flex flex-row gap-1 items-center">
                  <span>{`${Number(prize.value) / 10 ** 18}`}</span>
                  <img
                    src={getTokenLogoUrl(prize.address)}
                    className="w-6 h-6"
                  />
                </div>
              ) : (
                `${(prize.value as bigint[]).length} NFT${
                  (prize.value as bigint[]).length === 1 ? "" : "s"
                }`
              )}
              {prize.type === "erc20" && (
                <span className="text-neutral-500">
                  ~${USDValue.toFixed(2)}
                </span>
              )}
            </div>
          );
        })}
        {totalPrizesValueUSD > 0 && (
          <div className="pt-2 border-t border-primary/20">
            <div className="flex justify-between items-center">
              <span className="font-astronaut">Total</span>
              <span>${totalPrizesValueUSD.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop hover card (hidden on mobile) */}
      <div className="hidden sm:block">
        <HoverCard openDelay={50} closeDelay={0}>
          <HoverCardTrigger asChild>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: position * 0.1 }}
              className="flex items-center gap-4 p-2 sm:p-3 rounded-lg border border-primary/20 w-fit hover:cursor-pointer hover:bg-primary/25 hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/20">
                <span className="font-astronaut sm:text-lg text-primary">
                  {position}
                  <sup>{getOrdinalSuffix(position)}</sup>
                </span>
              </div>
              {totalPrizesValueUSD > 0 || totalPrizeNFTs > 0 ? (
                <div className="flex flex-row items-center gap-2 font-astronaut sm:text-lg">
                  {totalPrizesValueUSD > 0 && (
                    <span>${totalPrizesValueUSD.toFixed(2)}</span>
                  )}
                  {totalPrizesValueUSD > 0 && totalPrizeNFTs > 0 && (
                    <span className="text-primary/25">|</span>
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
            align="center"
            side="top"
            sideOffset={5}
          >
            {renderPrizeDetails()}
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Mobile clickable element (hidden on desktop) */}
      <motion.div
        className="sm:hidden flex items-center gap-4 p-2 rounded-lg border border-primary/20 w-fit hover:cursor-pointer hover:bg-primary/25 hover:border-primary/30 transition-all duration-200"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: position * 0.1 }}
        onClick={() => setIsMobileDialogOpen(true)}
      >
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20">
          <span className="font-astronaut text-primary">
            {position}
            <sup>{getOrdinalSuffix(position)}</sup>
          </span>
        </div>
        {totalPrizesValueUSD > 0 || totalPrizeNFTs > 0 ? (
          <div className="flex flex-row items-center gap-2 font-astronaut">
            {totalPrizesValueUSD > 0 && (
              <span>${totalPrizesValueUSD.toFixed(2)}</span>
            )}
            {totalPrizesValueUSD > 0 && totalPrizeNFTs > 0 && (
              <span className="text-primary/25">|</span>
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

      {/* Mobile dialog for prize details */}
      <Dialog open={isMobileDialogOpen} onOpenChange={setIsMobileDialogOpen}>
        <DialogContent className="sm:hidden bg-black border border-primary p-4 rounded-lg max-w-[90vw] mx-auto">
          {renderPrizeDetails()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Prize;
