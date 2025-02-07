import type { FunctionComponent, ImgHTMLAttributes } from "react";
import lootSurvivor from "./loot-survivor.png";
import darkShuffle from "./dark-shuffle.png";
import zkube from "./zkube.png";
import dopeWars from "./dope-wars.png";
import jokersOfNeon from "./jokers-of-neon.png";

export interface Game {
  address: string;
  name: string;
  Icon: FunctionComponent<ImgHTMLAttributes<HTMLImageElement>>;
}

export const games: Record<string, Game> = {
  lootSurvivor: {
    address:
      "0x75bd3616602ebec162c920492e4d042155fd0d199f1ed44edcb2eec120feb3d",
    name: "Loot Survivor",
    Icon: function LootSurvivorIcon(
      props: ImgHTMLAttributes<HTMLImageElement>
    ) {
      return <img src={lootSurvivor} {...props} />;
    },
  },
  darkShuffle: {
    address:
      "0x75bd3616602ebec162c920492e4d042155fd0d199f1ed44edcb2eec120feb3d",
    name: "Dark Shuffle",
    Icon: function DarkShuffleIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
      return <img src={darkShuffle} {...props} />;
    },
  },
  zkube: {
    address:
      "0x75bd3616602ebec162c920492e4d042155fd0d199f1ed44edcb2eec120feb3d",
    name: "zKube",
    Icon: function ZkubeIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
      return <img src={zkube} {...props} />;
    },
  },
  dopeWars: {
    address:
      "0x75bd3616602ebec162c920492e4d042155fd0d199f1ed44edcb2eec120feb3d",
    name: "Dope Wars",
    Icon: function DopeWarsIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
      return <img src={dopeWars} {...props} />;
    },
  },
  jokersOfNeon: {
    address:
      "0x75bd3616602ebec162c920492e4d042155fd0d199f1ed44edcb2eec120feb3d",
    name: "Jokers of Neon",
    Icon: function JokersOfNeonIcon(
      props: ImgHTMLAttributes<HTMLImageElement>
    ) {
      return <img src={jokersOfNeon} {...props} />;
    },
  },
};

export default games;
