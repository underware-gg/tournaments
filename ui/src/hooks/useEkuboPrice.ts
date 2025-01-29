import { useState, useEffect } from "react";
import { useDojo } from "@/context/dojo";

interface EkuboPriceProps {
  token: string;
}

export const useEkuboPrice = ({ token }: EkuboPriceProps) => {
  const { selectedChainConfig } = useDojo();
  const [ekuboPrice, setEkuboPrice] = useState<bigint>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const result = await fetch(
          `${selectedChainConfig.ekuboPriceAPI!}/${token}/USDC/history?interval=60`
        );

        if (result) {
          const priceObject = await result.json();
          setEkuboPrice(priceObject.data[priceObject.data.length - 1].vwap);
        }
      } catch (error) {
        console.error("Error fetching VRF cost:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();
  }, [token]); // Include both dependencies

  return {
    ekuboPrice,
    isLoading,
  };
};
