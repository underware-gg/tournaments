import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SettingsCarousel from "./SettingsCarousel";
import SmallSettingsTable from "./SmallSettingsTable";
import { UseFormReturn, ControllerRenderProps } from "react-hook-form";
import { useGameEndpoints } from "@/dojo/hooks/useGameEndpoints";
import { useGetGameSettings } from "@/dojo/hooks/useSqlQueries";
import { feltToString } from "@/lib/utils";
import { Settings, SettingsDetails } from "@/generated/models.gen";
import { useMemo } from "react";

interface GameSettingsFieldProps {
  form: UseFormReturn<any>;
  field: ControllerRenderProps<any, any>;
}

const GameSettingsField = ({ form, field }: GameSettingsFieldProps) => {
  const { gameNamespace, gameSettingsModel } = useGameEndpoints(
    form.watch("game")
  );

  const { data: rawSettings } = useGetGameSettings({
    namespace: gameNamespace ?? "",
    settingsModel: gameSettingsModel ?? "",
    active: true,
  });

  const { data: settingsDetails } = useGetGameSettings({
    namespace: gameNamespace ?? "",
    settingsModel: "GameSettingsMetadata",
    active: gameNamespace === "ds_v1_2_0",
  });

  const settings = rawSettings?.map((setting) =>
    Object.entries(setting).reduce((acc, [key, value]) => {
      if (!key.includes("internal") && !key.includes("settings_id")) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>)
  );

  const mergedGameSettings = useMemo(() => {
    if (!settingsDetails) return {};

    return settingsDetails.reduce(
      (acc, setting) => {
        const detailsId = setting.settings_id.toString();

        // If this details ID doesn't exist yet, create it
        if (!acc[detailsId]) {
          acc[detailsId] = {
            ...setting,
            hasSettings: false,
            settings: [],
          };
        }

        // If we have settings, add them to the array and set hasSettings to true
        if (settings) {
          acc[detailsId].settings.push(...settings);
          acc[detailsId].hasSettings = true;
        }

        return acc;
      },
      {} as Record<
        string,
        SettingsDetails & {
          hasSettings: boolean;
          settings: Settings[];
        }
      >
    );
  }, [settingsDetails, settings, form.watch("game")]);

  const hasSettings = mergedGameSettings[field.value]?.hasSettings ?? false;

  return (
    <FormItem>
      <div className="flex flex-row items-center gap-5">
        <FormLabel className="font-brand text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl">
          Settings
        </FormLabel>
        <FormDescription className="sm:text-xs xl:text-sm 3xl:text-base">
          Select the game settings
        </FormDescription>
      </div>
      <FormControl>
        <div className="flex flex-col gap-4">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <h3 className="font-brand text-lg">
                  {hasSettings
                    ? feltToString(mergedGameSettings[field.value]?.name ?? "")
                    : "Default"}
                </h3>
                <p className="text-sm text-brand-muted">
                  {hasSettings
                    ? mergedGameSettings[field.value]?.description
                    : "No settings available"}
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={!form.watch("game") || !hasSettings}
                  >
                    Select Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Game Settings</DialogTitle>
                  </DialogHeader>
                  {form.watch("game") && (
                    <SettingsCarousel
                      game={form.watch("game")}
                      settings={mergedGameSettings}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <SmallSettingsTable
              hasSettings={
                mergedGameSettings[field.value]?.hasSettings ?? false
              }
              settings={mergedGameSettings[field.value]?.settings ?? []}
            />
          </div>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default GameSettingsField;
