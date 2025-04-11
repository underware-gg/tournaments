import { useState, useEffect } from "react";
import { useProvider } from "@starknet-react/core";

export const useTokenUri = (tokenAddresses: string[]) => {
  const { provider } = useProvider();
  const [tokenUris, setTokenUris] = useState<string[]>([]);

  useEffect(() => {
    const fetchTokenUri = async () => {
      try {
        const tokenUris = await Promise.all(
          tokenAddresses.map(async (tokenAddress) => {
            const tokenUri = await provider.callContract({
              contractAddress: tokenAddress,
              entrypoint: "tokenURI",
              calldata: [],
            });
            return tokenUri.toString();
          })
        );
        setTokenUris(tokenUris);
      } catch (error) {
        console.error("Error fetching token URI:", error);
      }
    };

    fetchTokenUri();
  }, [tokenAddresses, provider]);

  return tokenUris;
};
