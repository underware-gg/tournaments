import {
  getGameSettingsConfig,
  GameType,
} from "@/components/createTournament/settings/types";

const SettingsTable = <T extends GameType>({
  game,
  settingId,
}: {
  game: T;
  settingId: string;
}) => {
  const setting = getGameSettingsConfig()[game]?.find(
    (s) => s.id === settingId
  );

  // If game doesn't exist in config or has no settings
  if (!setting?.settings?.length) {
    return (
      <div className="border border-retro-green-dark rounded-lg overflow-hidden w-3/4 p-4">
        <div className="flex flex-col items-center justify-center text-center gap-2 text-muted-foreground">
          <div className="text-sm">No settings available for this game yet</div>
          <div className="text-xs">Default configuration will be used</div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-retro-green-dark rounded-lg overflow-hidden w-3/4">
      <table className="w-full">
        <tbody className="divide-y divide-retro-green-dark">
          {setting.settings.map((item) => (
            <tr
              key={item.key}
              className="hover:bg-retro-green/5 transition-colors"
            >
              <td className="p-2 pl-4">
                <img
                  src={`/icons/${game}/${item.icon}`}
                  alt={item.label}
                  className="w-6 h-6 text-retro-green"
                />
              </td>
              <td className="p-2 text-sm font-medium">{item.label}</td>
              <td className="p-2 pr-4 text-sm text-muted-foreground text-right">
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SettingsTable;
