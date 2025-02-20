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
import { useGameNamespace } from "@/dojo/hooks/useGameNamespace";
import { useGetGameSettingsQuery } from "@/dojo/hooks/useSdkQueries";
import { feltToString } from "@/lib/utils";
import { Settings, SettingsDetails } from "@/generated/models.gen";
import { useMemo } from "react";

interface GameSettingsFieldProps {
  form: UseFormReturn<any>;
  field: ControllerRenderProps<any, any>;
}

const GameSettingsField = ({ form, field }: GameSettingsFieldProps) => {
  // const gameSettings = getGameSettings();
  const { gameNamespace } = useGameNamespace(form.watch("game"));
  const { entities: gameSettingsEntities } = useGetGameSettingsQuery(
    gameNamespace ?? ""
  );

  const mergedGameSettings = useMemo(() => {
    if (!gameSettingsEntities) return {};

    return gameSettingsEntities.reduce(
      (acc, entity) => {
        const details = entity.SettingsDetails as SettingsDetails;
        const settings = entity.Settings as Settings;
        const detailsId = details.id.toString();

        // If this details ID doesn't exist yet, create it
        if (!acc[detailsId]) {
          acc[detailsId] = {
            ...details,
            hasSettings: false,
            settings: [],
          };
        }

        // If we have settings, add them to the array and set hasSettings to true
        if (settings) {
          acc[detailsId].settings.push(settings);
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
  }, [gameSettingsEntities, form.watch("game")]);

  return (
    <FormItem>
      <div className="flex flex-row items-center gap-5">
        <FormLabel className="font-astronaut text-2xl">Settings</FormLabel>
        <FormDescription>Select the game settings</FormDescription>
      </div>
      <FormControl>
        <div className="flex flex-col gap-4">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <h3 className="font-astronaut text-lg">
                  {feltToString(mergedGameSettings[field.value]?.name ?? "")}
                </h3>
                <p className="text-sm text-retro-green-dark">
                  {mergedGameSettings[field.value]?.description}
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={!form.watch("game")}>
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
