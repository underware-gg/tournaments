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
import { displayAddress } from "@/lib/utils";
import { tournaments } from "@/lib/constants";
import TokenGameIcon from "@/components/icons/TokenGameIcon";
import { Search } from "lucide-react";
import TokenDialog from "@/components/dialogs/Token";
import { Token } from "@/generated/models.gen";
import { useDojo } from "@/context/dojo";
import { useGetTournaments } from "@/dojo/hooks/useSqlQueries";

const EntryRequirements = ({ form }: StepProps) => {
  const { nameSpace } = useDojo();
  const [newAddress, setNewAddress] = React.useState("");
  const [tournamentSearchQuery, setTournamentSearchQuery] = useState("");
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const { data: newTournaments } = useGetTournaments({
    namespace: nameSpace,
    gameFilters: [],
    offset: 0,
    limit: 100,
  });

  console.log(newTournaments);

  const filteredTournaments = tournaments.filter((tournament) =>
    tournament.name.toLowerCase().includes(tournamentSearchQuery.toLowerCase())
  );

  const handleGatingTypeChange = (
    type: "token" | "tournament" | "addresses"
  ) => {
    form.setValue("gatingOptions.type", type);

    // Clear all values first
    form.setValue("gatingOptions.token", undefined);
    form.setValue("gatingOptions.tournament.requirement", "participated");
    form.setValue("gatingOptions.tournament.ids", []);
    form.setValue("gatingOptions.addresses", []);

    // No need to reset the selected type's values since they were just cleared
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
                        name="gatingOptions.tournament.ids"
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
                                  {(field.value || []).map((id) => {
                                    const tournament = tournaments.find(
                                      (t) => t.id === id
                                    );
                                    return tournament ? (
                                      <div
                                        key={id}
                                        className="inline-flex items-center gap-2 p-2 border border-retro-green-dark rounded w-fit"
                                      >
                                        <span>
                                          {tournament.name} - {tournament.id}
                                        </span>
                                        <span
                                          className="h-4 w-4 hover:cursor-pointer"
                                          onClick={() => {
                                            field.onChange(
                                              field.value.filter(
                                                (v) => v !== id
                                              )
                                            );
                                          }}
                                        >
                                          <X />
                                        </span>
                                      </div>
                                    ) : null;
                                  })}
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
                                      <div className="px-4 pb-4">
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
                                      </div>
                                    </DialogHeader>

                                    {/* Tournament list */}
                                    <div className="flex-1 overflow-y-auto">
                                      {filteredTournaments.length > 0 ? (
                                        filteredTournaments.map(
                                          (tournament, index) => (
                                            <DialogClose asChild key={index}>
                                              <div
                                                className="flex flex-row gap-5 border-b border-retro-green-dark px-4 py-2 hover:bg-retro-green/20 hover:cursor-pointer"
                                                onClick={() => {
                                                  if (
                                                    !(
                                                      field.value || []
                                                    ).includes(tournament.id)
                                                  ) {
                                                    field.onChange([
                                                      ...(field.value || []),
                                                      tournament.id,
                                                    ]);
                                                  }
                                                }}
                                              >
                                                <span className="font-astronaut">
                                                  {tournament.name}
                                                </span>
                                                <div className="flex flex-row">
                                                  <span className="w-6 h-6">
                                                    <USER />
                                                  </span>
                                                  {tournament.players}
                                                </div>
                                                <div className="flex flex-row items-center">
                                                  {tournament.games.map(
                                                    (game, index) => (
                                                      <span key={index}>
                                                        <TokenGameIcon
                                                          size="xs"
                                                          game={game}
                                                        />
                                                      </span>
                                                    )
                                                  )}
                                                </div>
                                                <div>${tournament.pot}</div>
                                                <div className="flex flex-row items-center">
                                                  <span className="w-5 h-5">
                                                    <TROPHY />
                                                  </span>
                                                  5
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
