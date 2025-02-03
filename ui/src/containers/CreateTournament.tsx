import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ARROW_LEFT, WEDGE_LEFT, WEDGE_RIGHT } from "@/components/Icons";
import TokenGameIcon from "@/components/icons/TokenGameIcon";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CHECK, X } from "@/components/Icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Details from "@/components/createTournament/Details";
import Schedule from "@/components/createTournament/Schedule";

export type TournamentFormData = z.infer<typeof formSchema>;

export interface StepProps {
  form: UseFormReturn<TournamentFormData>;
  onNext?: () => void;
  onPrev?: () => void;
}

const formSchema = z.object({
  // Schedule step
  startTime: z.date(),
  duration: z.number().min(1).max(90),
  type: z.enum(["fixed", "open"]),
  submissionPeriod: z.string(),

  // Details step
  game: z.string().min(2).max(50),
  settings: z.string(), // Changed to string for ID
  name: z.string().min(2).max(50),
  description: z.string().min(10).max(500),
  leaderboardSize: z.number().min(1).max(1000),

  // Other steps
  enableGating: z.boolean().default(false),
  enableEntryFees: z.boolean().default(false),
  enableBonusPrizes: z.boolean().default(false),
  gatingOptions: z
    .object({
      type: z.enum(["token", "tournament", "addresses"]).optional(),
      token: z
        .object({
          address: z.string(),
          entriesPerToken: z.number().min(1),
        })
        .optional(),
      tournament: z
        .object({
          id: z.string(),
          requirement: z.enum(["participated", "won"]),
        })
        .optional(),
      addresses: z.array(z.string()).default([]),
    })
    .optional(),
  entryFees: z
    .object({
      tokenAddress: z.string().optional(),
      amount: z.number().min(0).optional(),
      creatorFeePercentage: z.number().min(0).max(100).optional(),
      gameFeePercentage: z.number().min(0).max(100).optional(),
      prizeDistribution: z
        .array(
          z.object({
            position: z.number(),
            percentage: z.number().min(0).max(100),
          })
        )
        .optional(),
    })
    .optional(),
  bonusPrizes: z
    .array(
      z.object({
        type: z.enum(["ERC20", "NFT"]),
        tokenAddress: z.string(),
        amount: z.number().optional(),
        position: z.number(),
      })
    )
    .optional(),
});

const CreateTournament = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    shouldUnregister: false,
    defaultValues: {
      // Details step
      game: "",
      settings: "", // Just an ID string now
      name: "",
      description: "",
      leaderboardSize: 10,

      // Schedule step
      startTime: (() => {
        const now = new Date();
        now.setMinutes(Math.ceil(now.getMinutes() / 5) * 5);
        return now;
      })(),
      duration: 7,
      type: "fixed",
      submissionPeriod: "1",

      // Other steps
      enableGating: false,
      enableEntryFees: false,
      enableBonusPrizes: false,
      gatingOptions: {
        addresses: [],
      },
      entryFees: {
        creatorFeePercentage: 0,
        gameFeePercentage: 0,
      },
      bonusPrizes: [],
    },
  });

  // Add state for current step
  const [currentStep, setCurrentStep] = React.useState<
    "details" | "schedule" | "gating" | "fees" | "prizes"
  >("details");

  // Helper to determine if we can proceed to next step
  const canProceed = () => {
    const status = getSectionStatus(form);
    switch (currentStep) {
      case "details":
        return status.details.complete;
      case "schedule":
        return status.schedule.complete;
      case "gating":
        return status.gating.complete;
      case "fees":
        return status.fees.complete;
      case "prizes":
        return status.prizes.complete;
    }
  };

  // Navigation helpers
  const nextStep = () => {
    switch (currentStep) {
      case "details":
        setCurrentStep("schedule");
        break;
      case "schedule":
        setCurrentStep("gating");
        break;
      case "gating":
        setCurrentStep("fees");
        break;
      case "fees":
        setCurrentStep("prizes");
        break;
      case "prizes":
        form.handleSubmit(onSubmit)();
        break;
    }
  };

  const prevStep = () => {
    switch (currentStep) {
      case "schedule":
        setCurrentStep("details");
        break;
      case "gating":
        setCurrentStep("schedule");
        break;
      case "fees":
        setCurrentStep("gating");
        break;
      case "prizes":
        setCurrentStep("fees");
        break;
    }
  };

  // Render the current step's content
  const renderStep = () => (
    <>
      <div
        className={cn(
          "transition-all duration-300 transform",
          currentStep === "details"
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 absolute"
        )}
      >
        <Card
          variant="outline"
          className={`h-auto ${currentStep === "details" ? "block" : "hidden"}`}
        >
          <Details form={form} />
        </Card>
      </div>
      <div
        className={cn(
          "transition-all duration-300 transform",
          currentStep === "schedule"
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 absolute"
        )}
      >
        <Card
          variant="outline"
          className={`h-auto ${
            currentStep === "schedule" ? "block" : "hidden"
          }`}
        >
          <Schedule form={form} />
        </Card>
      </div>
      <Card
        variant="outline"
        className={`h-auto ${currentStep === "gating" ? "block" : "hidden"}`}
      >
        <FormField
          control={form.control}
          name="enableGating"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-2">
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
                  <GatingOptions />
                </>
              )}
            </FormItem>
          )}
        />
      </Card>
      <Card
        variant="outline"
        className={`h-auto ${currentStep === "fees" ? "block" : "hidden"}`}
      >
        <FormField
          control={form.control}
          name="enableEntryFees"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel className="text-2xl font-astronaut">
                    Entry Fees
                  </FormLabel>
                  <FormDescription>
                    Enable tournament entry fees
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>

              {field.value && (
                <>
                  <div className="w-full h-0.5 bg-retro-green/25" />
                  <div className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="entryFees.tokenAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Token Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ERC20 Token Address"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="entryFees.amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Entry Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="entryFees.creatorFeePercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Creator Fee (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="entryFees.gameFeePercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Game Fee (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </>
              )}
            </FormItem>
          )}
        />
      </Card>
      <Card
        variant="outline"
        className={`h-auto ${currentStep === "prizes" ? "block" : "hidden"}`}
      >
        <FormField
          control={form.control}
          name="enableBonusPrizes"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel className="text-2xl font-astronaut">
                    Bonus Prizes
                  </FormLabel>
                  <FormDescription>Enable additional prizes</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>

              {field.value && (
                <>
                  <div className="w-full h-0.5 bg-retro-green/25" />
                  <div className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="bonusPrizes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prize Details</FormLabel>
                          <div className="space-y-4">
                            {(field.value || []).map((prize, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-4 gap-4"
                              >
                                <Select
                                  value={prize.type}
                                  onValueChange={(value: "ERC20" | "NFT") => {
                                    const newPrizes = [...(field.value || [])];
                                    newPrizes[index] = {
                                      ...newPrizes[index],
                                      type: value,
                                    };
                                    field.onChange(newPrizes);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="ERC20">ERC20</SelectItem>
                                    <SelectItem value="NFT">NFT</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Input
                                  placeholder="Token Address"
                                  value={prize.tokenAddress}
                                  onChange={(e) => {
                                    const newPrizes = [...(field.value || [])];
                                    newPrizes[index] = {
                                      ...newPrizes[index],
                                      tokenAddress: e.target.value,
                                    };
                                    field.onChange(newPrizes);
                                  }}
                                />
                                <Input
                                  type="number"
                                  placeholder="Amount/ID"
                                  value={prize.amount}
                                  onChange={(e) => {
                                    const newPrizes = [...(field.value || [])];
                                    newPrizes[index] = {
                                      ...newPrizes[index],
                                      amount: Number(e.target.value),
                                    };
                                    field.onChange(newPrizes);
                                  }}
                                />
                                <Input
                                  type="number"
                                  placeholder="Position"
                                  value={prize.position}
                                  onChange={(e) => {
                                    const newPrizes = [...(field.value || [])];
                                    newPrizes[index] = {
                                      ...newPrizes[index],
                                      position: Number(e.target.value),
                                    };
                                    field.onChange(newPrizes);
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-2"
                            onClick={() => {
                              field.onChange([
                                ...(field.value || []),
                                {
                                  type: "ERC20",
                                  tokenAddress: "",
                                  amount: 0,
                                  position: 1,
                                },
                              ]);
                            }}
                          >
                            Add Prize
                          </Button>
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
            </FormItem>
          )}
        />
      </Card>
    </>
  );

  const [selectedTokenAddress, setSelectedTokenAddress] = React.useState("");
  const [selectedTournament, setSelectedTournament] = React.useState("");
  const [newAddress, setNewAddress] = React.useState("");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const GatingOptions = () => {
    return (
      <div className="space-y-4 p-4">
        <div className="flex gap-4">
          <Button
            variant={
              form.watch("gatingOptions.type") === "token"
                ? "default"
                : "outline"
            }
            onClick={() => form.setValue("gatingOptions.type", "token")}
          >
            Token Based
          </Button>
          <Button
            variant={
              form.watch("gatingOptions.type") === "tournament"
                ? "default"
                : "outline"
            }
            onClick={() => form.setValue("gatingOptions.type", "tournament")}
          >
            Tournament Based
          </Button>
          <Button
            variant={
              form.watch("gatingOptions.type") === "addresses"
                ? "default"
                : "outline"
            }
            onClick={() => form.setValue("gatingOptions.type", "addresses")}
          >
            Addresses
          </Button>
        </div>

        {form.watch("gatingOptions.type") === "token" && (
          <div className="flex flex-row items-center gap-5">
            <FormField
              control={form.control}
              name="gatingOptions.token.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-astronaut text-2xl">
                    Token
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Select Token</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Select Token</DialogTitle>
                          </DialogHeader>
                          {/* Add your token list here */}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gatingOptions.token.entriesPerToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-astronaut text-2xl">
                    Entries
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}

        {form.watch("gatingOptions.type") === "tournament" && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="gatingOptions.tournament.id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tournament</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        {...field}
                        readOnly
                        placeholder="Select a tournament"
                        value={selectedTournament}
                      />
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Select</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Select Tournament</DialogTitle>
                          </DialogHeader>
                          {/* Add your tournament list here */}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gatingOptions.tournament.requirement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirement</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="participated" />
                        <Label>Participated</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="won" />
                        <Label>Won</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}

        {form.watch("gatingOptions.type") === "addresses" && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="gatingOptions.addresses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Whitelisted Addresses</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter address"
                          value={newAddress}
                          onChange={(e) => setNewAddress(e.target.value)}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (newAddress) {
                              field.onChange([...field.value, newAddress]);
                              setNewAddress("");
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {field.value.map((address, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 border rounded"
                          >
                            <span className="truncate">{address}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newAddresses = [...field.value];
                                newAddresses.splice(index, 1);
                                field.onChange(newAddresses);
                              }}
                            >
                              <span className="h-4 w-4">
                                <X />
                              </span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    );
  };

  // Add a type for section status
  type SectionStatus = {
    complete: boolean;
    enabled: boolean;
  };

  const getSectionStatus = (form: any) => {
    // Helper function to safely check nested values
    const getValue = (path: string) => {
      const value = form.watch(path);
      return value !== undefined && value !== "" ? value : null;
    };

    return {
      details: {
        complete: !!(
          getValue("game") &&
          getValue("settings") &&
          getValue("name") &&
          getValue("description") &&
          getValue("leaderboardSize")
        ),
        enabled: true,
      },
      schedule: {
        complete:
          !!(getValue("startTime") && getValue("duration")) && getValue("type"),
        enabled: true,
      },

      gating: {
        complete:
          getValue("enableGating") === true
            ? !!(
                getValue("gatingOptions.type") &&
                ((getValue("gatingOptions.type") === "token" &&
                  getValue("gatingOptions.token.address") &&
                  getValue("gatingOptions.token.entriesPerToken")) ||
                  (getValue("gatingOptions.type") === "tournament" &&
                    getValue("gatingOptions.tournament.id") &&
                    getValue("gatingOptions.tournament.requirement")) ||
                  (getValue("gatingOptions.type") === "addresses" &&
                    Array.isArray(getValue("gatingOptions.addresses")) &&
                    getValue("gatingOptions.addresses").length > 0))
              )
            : true,
        enabled: getValue("enableGating") === true,
      },

      fees: {
        complete:
          getValue("enableEntryFees") === true
            ? !!(
                getValue("entryFees.tokenAddress") &&
                getValue("entryFees.amount") &&
                getValue("entryFees.amount") > 0
              )
            : true,
        enabled: getValue("enableEntryFees") === true,
      },

      prizes: {
        complete:
          getValue("enableBonusPrizes") === true
            ? !!(
                Array.isArray(getValue("bonusPrizes")) &&
                getValue("bonusPrizes").length > 0
              )
            : true,
        enabled: getValue("enableBonusPrizes") === true,
      },
    };
  };

  // Update the StatusIndicator component
  const StatusIndicator = ({ complete, enabled }: SectionStatus) => (
    <div className="w-5 h-5 text-muted-foreground">
      {enabled ? (
        complete ? (
          <CHECK />
        ) : (
          <X />
        )
      ) : (
        <span className="text-xs italic">Optional</span>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-5 h-[calc(100vh-80px)] w-3/4 mx-auto px-20 pt-20">
      <div className="space-y-5">
        <div className="flex flex-row justify-between items-center">
          <Button variant="outline" onClick={() => navigate("/")}>
            <ARROW_LEFT />
            Home
          </Button>

          <div className="flex flex-row gap-2">
            {currentStep !== "details" && (
              <Button variant="outline" onClick={() => prevStep()}>
                <ARROW_LEFT />
                Previous
              </Button>
            )}
            <Button
              type="button"
              disabled={!canProceed()}
              className="px-10"
              onClick={nextStep}
            >
              {currentStep === "prizes" ? "Create" : "Next"}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-astronaut text-4xl font-bold">
            Create Tournament
          </span>

          <div className="flex items-center gap-6">
            {Object.entries(getSectionStatus(form)).map(([section, status]) => (
              <div
                key={section}
                className={cn(
                  "flex items-center gap-2 cursor-pointer",
                  currentStep === section && "border-b-2 border-retro-green"
                )}
                onClick={() => setCurrentStep(section as any)}
              >
                {/* <StatusIndicator
                  complete={status.complete}
                  enabled={status.enabled}
                /> */}
                <span
                  className={cn(
                    "text-sm capitalize",
                    status.enabled
                      ? "text-foreground"
                      : "text-muted-foreground italic"
                  )}
                >
                  {section}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Form {...form}>
        <form className="flex flex-col gap-10 overflow-y-auto pb-10">
          {renderStep()}
        </form>
      </Form>
    </div>
  );
};

export default CreateTournament;
