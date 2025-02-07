import { motion } from "framer-motion";
import { getOrdinalSuffix } from "@/lib/utils";
import { Prize as PrizeModel } from "@/generated/models.gen";
import { TROPHY } from "@/components/Icons";
import { useEkuboPrices } from "@/hooks/useEkuboPrices";

interface PrizeProps {
  index: number;
  prize: PrizeModel;
}

const Prize = ({ index, prize }: PrizeProps) => {
  const { prices } = useEkuboPrices({
    tokens: ["LORDS"],
  });
  console.log(prices);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex items-center gap-4 p-3 rounded-lg border border-retro-green/20 w-fit`}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-retro-green/20">
        <span className="font-astronaut text-lg text-retro-green">
          {prize.payout_position.toString()}
          <sup>{getOrdinalSuffix(Number(prize.payout_position))}</sup>
        </span>
      </div>
      <div className="flex">
        <div className="font-astronaut text-lg text-retro-green">
          $
          {Number(
            Number(BigInt(prize.token_type.unwrap().amount) / 10n ** 18n) *
              Number(prices[0] ?? 0)
          ).toFixed(2)}{" "}
          {/* {prize.token_type.activeVariant()} */}
        </div>
      </div>
      {index === 0 && (
        <div className="text-2xl text-retro-green">
          <TROPHY />
        </div>
      )}
    </motion.div>
  );
};

export default Prize;
