import { Button } from "@/components/ui/button";
import { StepProps } from "@/containers/CreateTournament";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AmountInput from "@/components/createTournament/inputs/Amount";
import { Switch } from "@/components/ui/switch";
import TokenDialog from "@/components/dialogs/Token";
import { Slider } from "@/components/ui/slider";
import React from "react";
import { Token } from "@/generated/models.gen";

const EntryFees = ({ form }: StepProps) => {
  const [selectedToken, setSelectedToken] = React.useState<Token | null>(null);

  const PREDEFINED_PERCENTAGES = [
    { value: 0, label: "0%" },
    { value: 1, label: "1%" },
    { value: 5, label: "5%" },
    { value: 10, label: "10%" },
  ];

  // Add local state for distribution weight
  const [distributionWeight, setDistributionWeight] = React.useState(1);

  // Helper function to calculate weighted distribution with whole number rounding
  const calculateDistribution = (
    positions: number,
    weight: number,
    creatorFee: number,
    gameFee: number
  ) => {
    const availablePercentage = 100 - creatorFee - gameFee;

    // First calculate raw percentages
    const rawDistributions: number[] = [];
    for (let i = 0; i < positions; i++) {
      const share = availablePercentage * Math.pow(1 - i / positions, weight);
      rawDistributions.push(share);
    }

    // Normalize to get percentages
    const total = rawDistributions.reduce((a, b) => a + b, 0);
    const normalizedDistributions = rawDistributions.map(
      (d) => (d * availablePercentage) / total
    );

    // Round down to whole numbers
    const roundedDistributions = normalizedDistributions.map((d) =>
      Math.floor(d)
    );

    // Calculate the remaining points to distribute (should be less than positions)
    const remainingPoints =
      availablePercentage - roundedDistributions.reduce((a, b) => a + b, 0);

    // Distribute remaining points based on decimal parts
    const decimalParts = normalizedDistributions.map((d, i) => ({
      index: i,
      decimal: d - Math.floor(d),
    }));

    // Sort by decimal part descending
    decimalParts.sort((a, b) => b.decimal - a.decimal);

    // Add one point to each position with highest decimal until we reach 100%
    for (let i = 0; i < remainingPoints; i++) {
      roundedDistributions[decimalParts[i].index]++;
    }

    return roundedDistributions;
  };

  // Update the total calculation display
  const getTotalDistribution = () => {
    const creatorFee = form.watch("entryFees.creatorFeePercentage") || 0;
    const gameFee = form.watch("entryFees.gameFeePercentage") || 0;
    const prizeDistribution =
      form
        .watch("entryFees.prizeDistribution")
        ?.reduce((sum, pos) => sum + (pos.percentage || 0), 0) || 0;

    return creatorFee + gameFee + prizeDistribution;
  };

  return (
    <FormField
      control={form.control}
      name="enableEntryFees"
      render={({ field }) => (
        <FormItem className="flex flex-col p-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-5">
              <FormLabel className="text-2xl font-astronaut">
                Entry Fees
              </FormLabel>
              <FormDescription>Enable tournament entry fees</FormDescription>
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
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="entryFees.tokenAddress"
                    render={({ field: tokenField }) => (
                      <FormItem>
                        <FormControl>
                          <TokenDialog
                            selectedToken={selectedToken}
                            onSelect={(token) => {
                              setSelectedToken(token);
                              tokenField.onChange(token.address);
                            }}
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
                        <FormControl>
                          <AmountInput
                            value={field.value || 0}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full h-0.5 bg-retro-green/25" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="entryFees.creatorFeePercentage"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-center gap-5">
                          <FormLabel className="font-astronaut text-lg">
                            Creator Fee (%)
                          </FormLabel>
                          <FormDescription>
                            Fee provided to the tournament creator
                          </FormDescription>
                        </div>
                        <FormControl>
                          <div className="div flex flex-row gap-2">
                            <div className="flex flex-row gap-2">
                              {PREDEFINED_PERCENTAGES.map(
                                ({ value, label }) => (
                                  <Button
                                    key={value}
                                    type="button"
                                    variant={
                                      field.value === value
                                        ? "default"
                                        : "outline"
                                    }
                                    className="px-2"
                                    onClick={() => {
                                      field.onChange(value);
                                    }}
                                  >
                                    {label}
                                  </Button>
                                )
                              )}
                            </div>
                            <Input
                              type="number"
                              placeholder="0"
                              className="w-[80px] p-1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="entryFees.gameFeePercentage"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-center gap-5">
                          <FormLabel className="font-astronaut text-lg">
                            Game Fee (%)
                          </FormLabel>
                          <FormDescription>
                            Fee provided to the game creator
                          </FormDescription>
                        </div>
                        <FormControl>
                          <div className="div flex flex-row gap-2">
                            <div className="flex flex-row gap-2">
                              {PREDEFINED_PERCENTAGES.map(
                                ({ value, label }) => (
                                  <Button
                                    type="button"
                                    variant={
                                      field.value === value
                                        ? "default"
                                        : "outline"
                                    }
                                    className="px-2"
                                    onClick={() => {
                                      field.onChange(value);
                                    }}
                                  >
                                    {label}
                                  </Button>
                                )
                              )}
                            </div>
                            <Input
                              type="number"
                              placeholder="0"
                              className="w-[80px] p-1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full h-0.5 bg-retro-green/25" />
                <div className="space-y-4">
                  <div className="flex flex-row items-center gap-5">
                    <FormLabel className="font-astronaut text-2xl">
                      Prize Distribution
                    </FormLabel>
                    <FormDescription>
                      Set prize percentages for each position
                    </FormDescription>
                  </div>

                  <div className="space-y-2">
                    <FormLabel>Distribution Weight</FormLabel>
                    <div className="flex flex-row items-center gap-4">
                      <Slider
                        min={0}
                        max={5}
                        step={0.1}
                        value={[distributionWeight]}
                        onValueChange={([value]) => {
                          setDistributionWeight(value);
                          const creatorFee =
                            form.watch("entryFees.creatorFeePercentage") || 0;
                          const gameFee =
                            form.watch("entryFees.gameFeePercentage") || 0;
                          const distributions = calculateDistribution(
                            form.watch("leaderboardSize"),
                            value,
                            creatorFee,
                            gameFee
                          );
                          form.setValue(
                            "entryFees.prizeDistribution",
                            distributions.map((percentage, index) => ({
                              position: index + 1,
                              percentage,
                            }))
                          );
                        }}
                        className="w-[200px]"
                      />
                      <span className="w-12 text-center">
                        {distributionWeight.toFixed(1)}
                      </span>
                      <div className="flex flex-row gap-2 items-center justify-between text-sm text-muted-foreground">
                        <span>Total: {getTotalDistribution()}%</span>
                        {getTotalDistribution() !== 100 && (
                          <span className="text-destructive">
                            Total must equal 100%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-2/3">
                    <div className="flex flex-row gap-4 overflow-x-auto">
                      {Array.from({
                        length: form.watch("leaderboardSize"),
                      }).map((_, index) => (
                        <FormField
                          key={index}
                          control={form.control}
                          name={`entryFees.prizeDistribution.${index}.percentage`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Position {index + 1}</FormLabel>
                              <FormControl>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    {...field}
                                    min="0"
                                    max="100"
                                    className="w-[80px]"
                                    onChange={(e) => {
                                      const value = Number(e.target.value);
                                      field.onChange(value);
                                    }}
                                  />
                                  <span>%</span>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </FormItem>
      )}
    />
  );
};

export default EntryFees;
