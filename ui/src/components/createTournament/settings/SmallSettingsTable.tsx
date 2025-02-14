import {
  getGameSettingsConfig,
  GameType,
} from "@/components/createTournament/settings/types";

const SmallSettingsTable = ({
  game,
  settingId,
}: {
  game: GameType;
  settingId: string;
}) => {
  const setting = getGameSettingsConfig()[
    game as keyof ReturnType<typeof getGameSettingsConfig>
  ]?.find((s) => s.id === settingId);

  if (!setting?.settings?.length) {
    return (
      <div className="border border-retro-green-dark rounded-lg p-4">
        <div className="flex flex-col items-center justify-center text-center gap-2 text-muted-foreground">
          <div className="text-sm">No settings available for this game yet</div>
          <div className="text-xs">Default configuration will be used</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-2 overflow-x-auto">
      {setting.settings.map((item, index) => (
        <div
          key={index}
          className="border border-retro-green-dark rounded-lg p-3 bg-background hover:bg-retro-green/10 transition-colors flex-shrink-0"
        >
          <div className="flex items-center gap-3">
            <img
              src={`/icons/${game}/${item.icon}`}
              alt={item.label}
              className="w-5 h-5 text-retro-green"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{item.label}</span>
              <span className="text-xs text-muted-foreground">
                {item.value}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SmallSettingsTable;
