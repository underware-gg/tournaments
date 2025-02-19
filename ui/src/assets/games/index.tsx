import type { FunctionComponent, ImgHTMLAttributes } from "react";
import lootSurvivor from "./loot-survivor.png";
import darkShuffle from "./dark-shuffle.png";
import zkube from "./zkube.png";
import dopeWars from "./dope-wars.png";
import jokersOfNeon from "./jokers-of-neon.png";
import { ChainId } from "@/dojo/config";
import { useDojo } from "@/context/dojo";

export interface Game {
  name: string;
  Icon: FunctionComponent<ImgHTMLAttributes<HTMLImageElement>>;
}

export const getGames = (): Record<string, Game> => {
  const { selectedChainConfig } = useDojo();
  const isSepolia = selectedChainConfig.chainId === ChainId.SN_SEPOLIA;
  const isLocalKatana = selectedChainConfig.chainId === ChainId.KATANA_LOCAL;
  if (isLocalKatana) {
    return {
      "0x032ffff023e926e396e56e3a5cb3ce6ef68cb6f620e95dc38db12781fbc9425f": {
        name: "Loot Survivor",
        Icon: function LootSurvivorIcon(
          props: ImgHTMLAttributes<HTMLImageElement>
        ) {
          return <img src={lootSurvivor} {...props} />;
        },
      },
    };
  } else if (isSepolia) {
    return {
      "0x0711a2ed50ba5442259950cf741b81f66f17b9b751e44d0368a87926a3233e3e": {
        name: "Dark Shuffle",
        Icon: function DarkShuffleIcon(
          props: ImgHTMLAttributes<HTMLImageElement>
        ) {
          return <img src={darkShuffle} {...props} />;
        },
      },
    };
  } else {
    return {
      "0x02f3f1675be75c1c9424d777cc79f60f29c9e24cf08775a4bb90f3d44812781c": {
        name: "Loot Survivor",
        Icon: function LootSurvivorIcon(
          props: ImgHTMLAttributes<HTMLImageElement>
        ) {
          return <img src={lootSurvivor} {...props} />;
        },
      },
      "0x075bd3616602ebec162c920492e4d032155fd0d199f1ed44edcb2eec120feb3d": {
        name: "Dark Shuffle",
        Icon: function DarkShuffleIcon(
          props: ImgHTMLAttributes<HTMLImageElement>
        ) {
          return <img src={darkShuffle} {...props} />;
        },
      },
      "0x075bd3616602ebec142c920492e4d042155fd0d199f1ed44edcb2eec120feb3d": {
        name: "zKube",
        Icon: function ZkubeIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
          return <img src={zkube} {...props} />;
        },
      },
      "0x075bd3616652ebec162c920492e4d042155fd0d199f1ed44edcb2eec120feb3d": {
        name: "Dope Wars",
        Icon: function DopeWarsIcon(
          props: ImgHTMLAttributes<HTMLImageElement>
        ) {
          return <img src={dopeWars} {...props} />;
        },
      },
      "0x075bd3616302ebec162c920492e4d042155fd0d199f1ed44edcb2eec120feb3d": {
        name: "Jokers of Neon",
        Icon: function JokersOfNeonIcon(
          props: ImgHTMLAttributes<HTMLImageElement>
        ) {
          return <img src={jokersOfNeon} {...props} />;
        },
      },
    };
  }
};
