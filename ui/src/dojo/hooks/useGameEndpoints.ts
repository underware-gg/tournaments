import { useState, useEffect } from "react";
import { useProvider } from "@starknet-react/core";
import { ByteArray, byteArray } from "starknet";
import { feltToString } from "@/lib/utils";

export const useGameEndpoints = (gameAddress: string) => {
  const { provider } = useProvider();
  const [gameNamespace, setGameNamespace] = useState<string | null>(null);
  const [gameScoreModel, setGameScoreModel] = useState<string | null>(null);
  const [gameScoreAttribute, setGameScoreAttribute] = useState<string | null>(
    null
  );

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

  const getGameScoreData = async () => {
    const gameScoreData = await provider.callContract({
      contractAddress: gameAddress,
      entrypoint: "score_model_and_attribute",
      calldata: [],
    });
    const gameScoreModel = feltToString(gameScoreData[0]);
    const gameScoreAttribute = feltToString(gameScoreData[1]);
    setGameScoreModel(gameScoreModel);
    setGameScoreAttribute(gameScoreAttribute);
  };

  useEffect(() => {
    if (gameAddress) {
      getGameNamespace();
      getGameScoreData();
    }
  }, [provider, gameAddress]);

  return { gameNamespace, gameScoreModel, gameScoreAttribute };
};
