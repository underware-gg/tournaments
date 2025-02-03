export const GameSettings = {
  lootSurvivor: [
    {
      id: "lootSurvivor_standard",
      name: "Standard",
      description: "Classic Loot Survivor rules",
    },
  ],
  darkShuffle: [
    {
      id: "darkShuffle_standard",
      name: "Classic",
      description: "Classic Dark Shuffle rules",
    },
  ],
  dopeWars: [
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
  // Add more games as needed
} as const;

export const GameSettingsConfig = {
  dopeWars: [
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
  lootSurvivor: [
    {
      id: "lootSurvivor_standard",
      settings: [
        // ... Loot Survivor settings
      ],
    },
  ],
} as const;

// Create type helpers
export type GameType = keyof typeof GameSettingsConfig;
