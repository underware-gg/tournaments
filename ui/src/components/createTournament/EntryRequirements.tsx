import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { StepProps } from "@/containers/CreateTournament";
import { TROPHY, USER, X } from "@/components/Icons";
import { displayAddress, feltToString } from "@/lib/utils";
import TokenGameIcon from "@/components/icons/TokenGameIcon";
import { Search } from "lucide-react";
import TokenDialog from "@/components/dialogs/Token";
import { Token } from "@/generated/models.gen";
import { useDojo } from "@/context/dojo";
import {
  useGetTournaments,
  useGetTournamentsCount,
} from "@/dojo/hooks/useSqlQueries";
import { processTournamentFromSql } from "@/lib/utils/formatting";
import { processPrizesFromSql } from "@/lib/utils/formatting";
import { getGames } from "@/assets/games";
import Pagination from "@/components/table/Pagination";

const EntryRequirements = ({ form }: StepProps) => {
  const { nameSpace } = useDojo();
  const [newAddress, setNewAddress] = React.useState("");
  const [tournamentSearchQuery, setTournamentSearchQuery] = useState("");
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [gameFilters, setGameFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const games = getGames();

  const { data: tournaments } = useGetTournaments({
    namespace: nameSpace,
    gameFilters: gameFilters,
    limit: 10,
    offset: (currentPage - 1) * 10,
    status: "all",
    active: true,
  });

  const { data: tournamentsCount } = useGetTournamentsCount({
    namespace: nameSpace,
  });

  const tournamentsData = tournaments.map((tournament) => {
    const processedTournament = processTournamentFromSql(tournament);
    const processedPrizes = processPrizesFromSql(
      tournament.prizes,
      tournament.id
    );
    return {
      tournament: processedTournament,
      prizes: processedPrizes,
      entryCount: Number(tournament.entry_count),
    };
  });

  const handleGatingTypeChange = (
    type: "token" | "tournament" | "addresses"
  ) => {
    form.setValue("gatingOptions.type", type);

    form.setValue("gatingOptions.token", undefined);
    form.setValue("gatingOptions.tournament.requirement", "participated");
    form.setValue("gatingOptions.tournament.tournaments", []);
    form.setValue("gatingOptions.addresses", []);
  };

  return (
    <FormField
      control={form.control}
      name="enableGating"
      render={({ field }) => (
        <FormItem className="flex flex-col p-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-5">
              <FormLabel className="text-2xl font-astronaut">
                Entry Requirements
              </FormLabel>
              <FormDescription>
                Enable participation restrictions
              </FormDescription>
            </div>
            <FormControl>
              <div className="flex flex-row items-center gap-2">
                <span className="uppercase text-neutral-500 font-bold">
                  Optional
                </span>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            </FormControl>
          </div>

          {field.value && (
            <>
              <div className="w-full h-0.5 bg-retro-green/25" />
              <div className="space-y-4 p-4">
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={
                      form.watch("gatingOptions.type") === "token"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleGatingTypeChange("token")}
                  >
                    Token Gating
                  </Button>
                  <Button
                    type="button"
                    variant={
                      form.watch("gatingOptions.type") === "tournament"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleGatingTypeChange("tournament")}
                  >
                    Tournaments
                  </Button>
                  <Button
                    type="button"
                    variant={
                      form.watch("gatingOptions.type") === "addresses"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleGatingTypeChange("addresses")}
                  >
                    Whitelisted Addresses
                  </Button>
                </div>

                {form.watch("gatingOptions.type") === "token" && (
                  <>
                    <div className="w-full h-0.5 bg-retro-green/25" />
                    <div className="flex flex-row items-center gap-5">
                      <FormField
                        control={form.control}
                        name="gatingOptions.token"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex flex-row items-center gap-5">
                                <TokenDialog
                                  selectedToken={selectedToken}
                                  onSelect={(token) => {
                                    setSelectedToken(token);
                                    field.onChange(token.address);
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                {form.watch("gatingOptions.type") === "tournament" && (
                  <>
                    <div className="w-full h-0.5 bg-retro-green/25" />
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="gatingOptions.tournament.requirement"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex flex-row items-center gap-5">
                              <FormLabel className="font-astronaut text-2xl">
                                Requirement
                              </FormLabel>
                              <FormDescription>
                                Choose whether previous tournaments must have
                                been won or only participated in
                              </FormDescription>
                            </div>
                            <FormControl>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant={
                                    field.value === "participated"
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() => field.onChange("participated")}
                                >
                                  Participated
                                </Button>
                                <Button
                                  type="button"
                                  variant={
                                    field.value === "won"
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() => field.onChange("won")}
                                >
                                  Won
                                </Button>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <div className="w-full h-0.5 bg-retro-green/25" />
                      <FormField
                        control={form.control}
                        name="gatingOptions.tournament.tournaments"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex flex-row items-center gap-5">
                              <FormLabel className="font-astronaut text-2xl">
                                Tournaments
                              </FormLabel>
                              <FormDescription>Add tournaments</FormDescription>
                            </div>
                            <FormControl>
                              <div className="flex gap-2">
                                <div className="flex flex-wrap gap-2">
                                  {(field.value || []).map(
                                    (selectedTournament) => {
                                      return (
                                        <div
                                          key={selectedTournament.id}
                                          className="inline-flex items-center gap-2 p-2 border border-retro-green-dark rounded w-fit"
                                        >
                                          <span>
                                            {feltToString(
                                              selectedTournament.metadata.name
                                            )}{" "}
                                            -{" "}
                                            {Number(
                                              selectedTournament.id
                                            ).toString()}
                                          </span>
                                          <span
                                            className="h-4 w-4 hover:cursor-pointer"
                                            onClick={() => {
                                              field.onChange(
                                                field.value.filter(
                                                  (v) =>
                                                    v !== selectedTournament
                                                )
                                              );
                                            }}
                                          >
                                            <X />
                                          </span>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>

                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      type="button"
                                      disabled={
                                        !form.watch(
                                          "gatingOptions.tournament.requirement"
                                        )
                                      }
                                    >
                                      {!form.watch(
                                        "gatingOptions.tournament.requirement"
                                      )
                                        ? "Select requirement first"
                                        : "Select"}
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="h-[600px] flex flex-col gap-0 p-0">
                                    <DialogHeader className="flex-shrink-0">
                                      <DialogTitle className="p-4">
                                        Select Tournament
                                      </DialogTitle>
                                      {/* Search input */}
                                      <div className="px-4 pb-2 flex flex-col gap-2">
                                        <div className="flex items-center border rounded border-retro-green-dark bg-background">
                                          <Search className="w-4 h-4 ml-3 text-muted-foreground" />
                                          <Input
                                            placeholder="Search tournaments..."
                                            value={tournamentSearchQuery}
                                            onChange={(e) =>
                                              setTournamentSearchQuery(
                                                e.target.value
                                              )
                                            }
                                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                          />
                                        </div>
                                        <div className="flex flex-row gap-2">
                                          {Object.entries(games).map(
                                            ([key, game]) => (
                                              <div
                                                key={key}
                                                className={`h-8 ${
                                                  gameFilters.includes(key)
                                                    ? "bg-retro-green-dark text-black"
                                                    : "bg-black"
                                                } border border-neutral-500 px-2 flex items-center gap-2 cursor-pointer`}
                                                onClick={() => {
                                                  if (
                                                    gameFilters.includes(key)
                                                  ) {
                                                    setGameFilters(
                                                      gameFilters.filter(
                                                        (g) => g !== key
                                                      )
                                                    );
                                                  } else {
                                                    setGameFilters([
                                                      ...gameFilters,
                                                      key,
                                                    ]);
                                                  }
                                                }}
                                              >
                                                {game.name}
                                                <span className="flex items-center justify-center">
                                                  <TokenGameIcon
                                                    size="xs"
                                                    game={key}
                                                  />
                                                </span>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </DialogHeader>

                                    {/* Tournament list */}
                                    <div className="flex-1 overflow-y-auto border-t border-retro-green-dark">
                                      {tournamentsData?.length > 0 ? (
                                        tournamentsData.map(
                                          (tournament, index) => (
                                            <DialogClose asChild key={index}>
                                              <div
                                                className="flex flex-row justify-between border-b border-retro-green-dark px-4 py-2 hover:bg-retro-green/20 hover:cursor-pointer"
                                                onClick={() => {
                                                  if (
                                                    !(
                                                      field.value || []
                                                    ).includes(
                                                      tournament.tournament
                                                    )
                                                  ) {
                                                    field.onChange([
                                                      ...(field.value || []),
                                                      tournament.tournament,
                                                    ]);
                                                  }
                                                }}
                                              >
                                                <span className="font-astronaut">
                                                  {feltToString(
                                                    tournament.tournament
                                                      .metadata.name
                                                  )}
                                                </span>
                                                <span className="font-astronaut">
                                                  #
                                                  {Number(
                                                    tournament.tournament.id
                                                  ).toString()}
                                                </span>
                                                <div className="flex flex-row">
                                                  <span className="w-6 h-6">
                                                    <USER />
                                                  </span>
                                                  {tournament.entryCount}
                                                </div>
                                                <div className="relative group flex items-center justify-center">
                                                  <TokenGameIcon
                                                    size="xs"
                                                    game={
                                                      tournament.tournament
                                                        .game_config.address
                                                    }
                                                  />
                                                  <span className="pointer-events-none absolute bottom-[calc(100%+2px)] left-1/2 transform -translate-x-1/2 bg-black text-neutral-500 border border-retro-green-dark px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity w-fit z-50">
                                                    {
                                                      games[
                                                        tournament.tournament
                                                          .game_config.address
                                                      ].name
                                                    }
                                                  </span>
                                                </div>
                                                {/* <div>${tournament.pot}</div> */}
                                                <div className="flex flex-row items-center">
                                                  <span className="w-5 h-5">
                                                    <TROPHY />
                                                  </span>
                                                  {Number(
                                                    tournament.tournament
                                                      .game_config.prize_spots
                                                  ).toString()}
                                                </div>
                                              </div>
                                            </DialogClose>
                                          )
                                        )
                                      ) : (
                                        <div className="flex items-center justify-center h-32 text-muted-foreground">
                                          No tournaments found
                                        </div>
                                      )}
                                    </div>
                                    <div className="px-4 pb-2 flex justify-center">
                                      <Pagination
                                        totalPages={Math.ceil(
                                          tournamentsCount / 10
                                        )}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                      />
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                {form.watch("gatingOptions.type") === "addresses" && (
                  <>
                    <div className="w-full h-0.5 bg-retro-green/25" />
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="gatingOptions.addresses"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex flex-row items-center gap-2">
                              <FormLabel className="font-astronaut text-2xl">
                                Whitelisted Addresses
                              </FormLabel>
                              <FormDescription>
                                Add addresses that are allowed to participate in
                                the tournament
                              </FormDescription>
                            </div>
                            <FormControl>
                              <div className="flex flex-col gap-5">
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Enter address"
                                    value={newAddress}
                                    onChange={(e) =>
                                      setNewAddress(e.target.value)
                                    }
                                  />
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      if (newAddress) {
                                        field.onChange([
                                          ...field.value,
                                          newAddress,
                                        ]);
                                        setNewAddress("");
                                      }
                                    }}
                                  >
                                    Add
                                  </Button>
                                </div>
                                {field.value.length > 0 && (
                                  <>
                                    <div className="w-full h-0.5 bg-retro-green/25" />
                                    <div className="flex flex-row gap-2 overflow-x-auto">
                                      {field.value.map((address, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center justify-between p-2 border border-neutral-500 rounded w-fit"
                                        >
                                          <span className="truncate">
                                            {displayAddress(address)}
                                          </span>
                                          <span
                                            className="h-4 w-4 hover:cursor-pointer"
                                            onClick={() => {
                                              const newAddresses = [
                                                ...field.value,
                                              ];
                                              newAddresses.splice(index, 1);
                                              field.onChange(newAddresses);
                                            }}
                                          >
                                            <X />
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </FormItem>
      )}
    />
  );
};

export default EntryRequirements;
