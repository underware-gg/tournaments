import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { WEDGE_LEFT, WEDGE_RIGHT } from "@/components/Icons";
import {
  getGameSettings,
  GameType,
} from "@/components/createTournament/settings/types";
import SettingsTable from "@/components/createTournament/settings/SettingsTable";
import TokenGameIcon from "@/components/icons/TokenGameIcon";

interface SettingsCarouselProps {
  game: GameType;
  settings: ReturnType<typeof getGameSettings>[keyof ReturnType<
    typeof getGameSettings
  >];
  value: string;
  onChange: (value: string) => void;
}

const SettingsCarousel = ({
  game,
  settings,
  value,
  onChange,
}: SettingsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(() => {
    if (!settings?.length) return 0;
    return Math.max(
      0,
      settings.findIndex((s) => s.id === value)
    );
  });
  // If no settings available, show fallback UI
  if (!settings?.length) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center text-center gap-2 text-muted-foreground">
          <TokenGameIcon size="lg" game={game} />
          <div className="text-sm">No settings available for this game yet</div>
          <div className="text-xs">Default configuration will be used</div>
        </div>
      </div>
    );
  }

  const currentSetting = settings[currentIndex];

  console.log(settings);

  return (
    <div className="space-y-4">
      <div className="relative px-6 min-h-[200px]">
        <div className="flex flex-col items-center w-full">
          <TokenGameIcon size="lg" game={game} />
          <h3 className="text-2xl font-astronaut">{currentSetting.name}</h3>
          <p className="text-muted-foreground">{currentSetting.description}</p>

          {/* Add the settings table */}
          <SettingsTable game={game} settingId={currentSetting.id} />
        </div>

        <div className="absolute -inset-x-4 top-1/2 flex justify-between -translate-y-1/2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="h-8 w-8 rounded-full"
          >
            <WEDGE_LEFT />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentIndex((i) => Math.min(settings.length - 1, i + 1))
            }
            disabled={currentIndex === settings.length - 1}
            className="h-8 w-8 rounded-full"
          >
            <WEDGE_RIGHT />
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          {settings.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full",
                i === currentIndex ? "bg-retro-green" : "bg-muted"
              )}
            />
          ))}
        </div>
        <Button
          onClick={() => {
            onChange(currentSetting.id);
            // Close dialog
            const dialogClose = document.querySelector("[data-dialog-close]");
            if (dialogClose instanceof HTMLElement) {
              dialogClose.click();
            }
          }}
        >
          Select
        </Button>
      </div>
    </div>
  );
};

export default SettingsCarousel;
