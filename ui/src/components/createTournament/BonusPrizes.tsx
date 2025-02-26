import React, { useEffect, useMemo } from "react";
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
import { getTokenLogoUrl } from "@/lib/tokensMeta";
import { Token } from "@/generated/models.gen";
import { X } from "@/components/Icons";
import { Slider } from "@/components/ui/slider";
import { calculateDistribution } from "@/lib/utils";

interface NewPrize {
  tokenAddress: string;
  tokenType: "ERC20" | "ERC721" | "";
  amount?: number;
  tokenId?: number;
  position?: number;
}

const BonusPrizes = ({ form }: StepProps) => {
  const [selectedToken, setSelectedToken] = React.useState<Token | null>(null);
  const [newPrize, setNewPrize] = React.useState<NewPrize>({
    tokenAddress: "",
    tokenType: "",
  });
  const [distributionWeight, setDistributionWeight] = React.useState(1);
  const [prizeDistributions, setPrizeDistributions] = React.useState<
    { position: number; percentage: number }[]
  >([]);

  const totalDistributionPercentage = useMemo(() => {
    return (
      prizeDistributions.reduce((sum, pos) => sum + (pos.percentage || 0), 0) ||
      0
    );
  }, [prizeDistributions]);

  const isValidPrize = () => {
    if (!newPrize.tokenAddress) return false;

    if (newPrize.tokenType === "ERC20") {
      return !!newPrize.amount && totalDistributionPercentage === 100;
    }

    if (newPrize.tokenType === "ERC721") {
      return !!newPrize.tokenId && !!newPrize.position;
    }

    return false;
  };

  const isERC20 = newPrize.tokenType === "ERC20";

  useEffect(() => {
    const distributions = calculateDistribution(
      form.watch("leaderboardSize"),
      distributionWeight
    );
    setPrizeDistributions(
      distributions.map((percentage, index) => ({
        position: index + 1,
        percentage,
      }))
    );
  }, []);

  return (
    <FormField
      control={form.control}
      name="enableBonusPrizes"
      render={({ field }) => (
        <FormItem className="flex flex-col p-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-5">
              <FormLabel className="text-2xl font-astronaut">
                Bonus Prizes
              </FormLabel>
              <FormDescription>Enable additional prizes</FormDescription>
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
              <div className="flex flex-col gap-5 px-4">
                <div className="flex flex-row justify-between items-center pt-4 px-4">
                  {/* New Prize Input Section */}
                  <div className="flex items-center gap-4 p-4">
                    <TokenDialog
                      selectedToken={selectedToken}
                      onSelect={(token) => {
                        setSelectedToken(token);
                        setNewPrize((prev) => ({
                          ...prev,
                          tokenAddress: token.address,
                          tokenType:
                            token.token_type.activeVariant() === "erc20"
                              ? "ERC20"
                              : "ERC721",
                          // Reset other values when token changes
                          amount: undefined,
                          tokenId: undefined,
                          position: undefined,
                        }));
                      }}
                    />

                    {newPrize.tokenAddress && (
                      <>
                        <div className="flex items-center gap-4">
                          {newPrize.tokenType === "ERC20" ? (
                            <AmountInput
                              value={newPrize.amount || 0}
                              onChange={(value) =>
                                setNewPrize((prev) => ({
                                  ...prev,
                                  amount: value,
                                }))
                              }
                            />
                          ) : (
                            <Input
                              type="number"
                              placeholder="Token ID"
                              value={newPrize.tokenId || ""}
                              onChange={(e) =>
                                setNewPrize((prev) => ({
                                  ...prev,
                                  tokenId: Number(e.target.value),
                                }))
                              }
                              className="w-[150px]"
                            />
                          )}
                          {!isERC20 && (
                            <Input
                              type="number"
                              placeholder="Position"
                              min={1}
                              max={form.watch("leaderboardSize")}
                              value={newPrize.position || ""}
                              onChange={(e) =>
                                setNewPrize((prev) => ({
                                  ...prev,
                                  position: Number(e.target.value),
                                }))
                              }
                              className="w-[100px]"
                            />
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <Button
                    type="button"
                    disabled={!isValidPrize()}
                    onClick={() => {
                      const currentPrizes = form.watch("bonusPrizes") || [];
                      if (
                        newPrize.tokenType === "ERC20" &&
                        newPrize.amount &&
                        totalDistributionPercentage === 100
                      ) {
                        form.setValue("bonusPrizes", [
                          ...currentPrizes,
                          ...prizeDistributions.map((prize) => ({
                            type: "ERC20" as const,
                            tokenAddress: newPrize.tokenAddress,
                            amount:
                              ((newPrize.amount ?? 0) * prize.percentage) / 100,
                            position: prize.position,
                          })),
                        ]);
                      } else if (
                        newPrize.tokenType === "ERC721" &&
                        newPrize.tokenId &&
                        newPrize.position
                      ) {
                        form.setValue("bonusPrizes", [
                          ...currentPrizes,
                          {
                            type: "ERC721",
                            tokenAddress: newPrize.tokenAddress,
                            tokenId: newPrize.tokenId,
                            position: newPrize.position,
                          },
                        ]);
                      }
                      setNewPrize({ tokenAddress: "", tokenType: "" });
                      setSelectedToken(null);
                    }}
                  >
                    Add Prize
                  </Button>
                </div>

                {isERC20 && (
                  <div className="flex flex-col gap-4">
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
                            const distributions = calculateDistribution(
                              form.watch("leaderboardSize"),
                              value
                            );
                            console.log(form.watch("leaderboardSize"));
                            setPrizeDistributions(
                              distributions.map((percentage, index) => ({
                                position: index + 1,
                                percentage,
                              }))
                            );
                          }}
                          className="w-[200px] h-10"
                        />
                        <span className="w-12 text-center">
                          {distributionWeight.toFixed(1)}
                        </span>
                        <div className="flex flex-row gap-2 items-center justify-between text-sm text-muted-foreground">
                          <span>Total: {totalDistributionPercentage}%</span>
                          {totalDistributionPercentage !== 100 && (
                            <span className="text-destructive">
                              Total must equal 100%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row gap-4 overflow-x-auto">
                      {Array.from({
                        length: form.watch("leaderboardSize"),
                      }).map((_, index) => (
                        <div key={index} className="flex flex-col gap-2">
                          <span>Position {index + 1}</span>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              className="w-[80px]"
                              onChange={(e) => {
                                const value = Number(e.target.value);
                                setPrizeDistributions((prev) => [
                                  ...prev,
                                  { position: index + 1, percentage: value },
                                ]);
                              }}
                              value={
                                prizeDistributions[index]?.percentage || ""
                              }
                            />
                            <span>%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(form.watch("bonusPrizes") || []).length > 0 && (
                  <>
                    <div className="w-full h-0.5 bg-retro-green/25" />
                    <div className="space-y-2">
                      <FormLabel className="font-astronaut text-2xl">
                        Added Prizes
                      </FormLabel>
                      <div className="flex flex-row items-center gap-2 overflow-x-auto">
                        {(form.watch("bonusPrizes") || []).map(
                          (prize, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-4 p-4 bg-background/50 border border-retro-green-dark/50 rounded"
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={getTokenLogoUrl(prize.tokenAddress)}
                                  className="w-6 h-6"
                                  alt="Token logo"
                                />
                                <span className="font-bold">
                                  {selectedToken?.name}
                                </span>
                                <span className="text-sm text-neutral-500 uppercase">
                                  {selectedToken?.symbol}
                                </span>
                              </div>
                              {prize.type === "ERC20" ? (
                                <span>
                                  ${prize.amount} (Position {prize.position})
                                </span>
                              ) : (
                                <span>
                                  #{prize.tokenId} (Position {prize.position})
                                </span>
                              )}
                              <span
                                className="w-6 h-6 text-retro-green-dark cursor-pointer"
                                onClick={() => {
                                  const newPrizes = [
                                    ...(form.watch("bonusPrizes") || []),
                                  ];
                                  newPrizes.splice(index, 1);
                                  form.setValue("bonusPrizes", newPrizes);
                                }}
                              >
                                <X />
                              </span>
                            </div>
                          )
                        )}
                      </div>
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

export default BonusPrizes;
