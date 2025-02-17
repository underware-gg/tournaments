import { useState, useEffect } from "react";
import { useProvider } from "@starknet-react/core";
import { ByteArray, byteArray } from "starknet";

export const useGameNamespace = (gameAddress: string) => {
  const { provider } = useProvider();
  const [gameNamespace, setGameNamespace] = useState<string | null>(null);

  const getGameNamespace = async () => {
    const gameNamespace = await provider.callContract({
      contractAddress: gameAddress,
      entrypoint: "namespace",
      calldata: [],
    });
    const gameNamespaceByteArray: ByteArray = {
      data: gameNamespace.slice(0, -2),
      pending_word: gameNamespace[gameNamespace.length - 2],
      pending_word_len: gameNamespace[gameNamespace.length - 1],
    };
    setGameNamespace(byteArray.stringFromByteArray(gameNamespaceByteArray));
  };

  useEffect(() => {
    getGameNamespace();
  }, [provider]);

  return { gameNamespace };
};
