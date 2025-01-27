import type { FunctionComponent, ImgHTMLAttributes } from "react";
import lootSurvivor from "./loot-survivor.png";
import darkShuffle from "./dark-shuffle.png";
import zkube from "./zkube.png";
import dopeWars from "./dope-wars.png";

export interface Game {
  name: string;
  Icon: FunctionComponent<ImgHTMLAttributes<HTMLImageElement>>;
}

export const games: Record<string, Game> = {
  lootSurvivor: {
    name: "Loot Survivor",
    Icon: function LootSurvivorIcon(
      props: ImgHTMLAttributes<HTMLImageElement>
    ) {
      return <img src={lootSurvivor} {...props} />;
    },
  },
  darkShuffle: {
    name: "Dark Shuffle",
    Icon: function DarkShuffleIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
      return <img src={darkShuffle} {...props} />;
    },
  },
  zkube: {
    name: "zKube",
    Icon: function ZkubeIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
      return <img src={zkube} {...props} />;
    },
  },
  dopeWars: {
    name: "Dope Wars",
    Icon: function DopeWarsIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
      return <img src={dopeWars} {...props} />;
    },
  },
};

export default games;
