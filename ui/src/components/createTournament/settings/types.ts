import { useDojo } from "@/context/dojo";
import { ChainId } from "@/dojo/config";

export const getGameSettings = () => {
  const { selectedChainConfig } = useDojo();
  const isSepolia = selectedChainConfig.chainId === ChainId.SN_SEPOLIA;
  if (isSepolia) {
    return {
      "0x0711a2ed50ba5442259950cf741b81f66f17b9b751e44d0368a87926a3233e3e": [
        {
          id: "darkShuffle_standard",
          name: "Classic",
          description: "Classic Dark Shuffle rules",
        },
      ],
    };
  } else {
    return {
      "0x075bd3616602ebec162c920492e4d042155fd0d199f1ed44edcb2eec120feb3d": [
        {
          id: "lootSurvivor_standard",
          name: "Standard",
          description: "Classic Loot Survivor rules",
        },
      ],
      "0x075bd3616602ebec162c920492e4d032155fd0d199f1ed44edcb2eec120feb3d": [
        {
          id: "darkShuffle_standard",
          name: "Classic",
          description: "Classic Dark Shuffle rules",
        },
      ],
      "0x075bd3616652ebec162c920492e4d042155fd0d199f1ed44edcb2eec120feb3d": [
        {
          id: "dopeWars_standard",
          name: "Classic",
          description: "Classic Dope Wars rules",
        },
        {
          id: "dopeWars_hard",
          name: "Hard",
          description: "Classic Dope Wars rules",
        },
      ],
    };
  }
};

export const getGameSettingsConfig = () => {
  const { selectedChainConfig } = useDojo();
  const isSepolia = selectedChainConfig.chainId === ChainId.SN_SEPOLIA;
  if (isSepolia) {
    return {
      "0x0711a2ed50ba5442259950cf741b81f66f17b9b751e44d0368a87926a3233e3e": [
        {
          id: "darkShuffle_standard",
          settings: [
            // ... Loot Survivor settings
          ],
        },
      ],
    };
  } else {
    return {
      "0x075bd3616652ebec162c920492e4d042155fd0d199f1ed44edcb2eec120feb3d": [
        {
          id: "dopeWars_standard",
          settings: [
            {
              key: "initialCash",
              label: "Initial Cash",
              value: "$2,000",
              icon: "Dollars.svg",
            },
            {
              key: "initialHealth",
              label: "Initial Health",
              value: "100",
              icon: "Heart Half.svg",
            },
            {
              key: "maxTurns",
              label: "Max Turns",
              value: "30",
              icon: "Watch.svg",
            },
            {
              key: "maxTurns",
              label: "Max Turns",
              value: "30",
              icon: "Watch.svg",
            },
            {
              key: "maxTurns",
              label: "Max Turns",
              value: "30",
              icon: "Watch.svg",
            },
            {
              key: "maxTurns",
              label: "Max Turns",
              value: "30",
              icon: "Watch.svg",
            },
            {
              key: "maxTurns",
              label: "Max Turns",
              value: "30",
              icon: "Watch.svg",
            },
            // ... other settings
          ],
        },
        {
          id: "dopeWars_hard",
          settings: [
            {
              key: "initialCash",
              label: "Initial Cash",
              value: "$2,000",
              icon: "Dollars.svg",
            },
            {
              key: "initialHealth",
              label: "Initial Health",
              value: "100",
              icon: "Heart Half.svg",
            },
            {
              key: "maxTurns",
              label: "Max Turns",
              value: "30",
              icon: "Watch.svg",
            },
            // ... other settings
          ],
        },
        // Can add more setting configurations for Dope Wars
      ],
      "0x075bd3616602ebec162c920492e4d042155fd0d199f1ed44edcb2eec120feb3d": [
        {
          id: "lootSurvivor_standard",
          settings: [
            // ... Loot Survivor settings
          ],
        },
      ],
    };
  }
};

// Create type helpers
export type GameType = keyof ReturnType<typeof getGameSettingsConfig>;
