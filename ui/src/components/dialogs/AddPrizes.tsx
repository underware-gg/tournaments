import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import TokenDialog from "@/components/dialogs/Token";
import AmountInput from "@/components/createTournament/inputs/Amount";
import { bigintToHex, calculateDistribution } from "@/lib/utils";
import { NewPrize } from "@/lib/types";
import { Prize, Token } from "@/generated/models.gen";
import { useSystemCalls } from "@/dojo/hooks/useSystemCalls";
import { addAddressPadding, BigNumberish } from "starknet";
import { TOURNAMENT_VERSION_KEY } from "@/lib/constants";
import { CairoCustomEnum } from "starknet";
import { useGetMetricsQuery } from "@/dojo/hooks/useSdkQueries";
import { getTokenLogoUrl } from "@/lib/tokensMeta";
import { X } from "@/components/Icons";
export function AddPrizesDialog({
  open,
  onOpenChange,
  tournamentId,
  tournamentName,
  leaderboardSize,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournamentId: BigNumberish;
  tournamentName: string;
  leaderboardSize: number;
}) {
  const { approveAndAddPrizes } = useSystemCalls();
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [newPrize, setNewPrize] = useState<NewPrize>({
    tokenAddress: "",
    tokenType: "",
  });
  const [currentPrizes, setCurrentPrizes] = useState<NewPrize[]>([]);
  const [distributionWeight, setDistributionWeight] = useState(1);
  const [prizeDistributions, setPrizeDistributions] = useState<
    { position: number; percentage: number }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { entity: metricsEntity } = useGetMetricsQuery(
    addAddressPadding(TOURNAMENT_VERSION_KEY)
  );

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
    if (open && leaderboardSize) {
      // Initialize distributions when dialog opens
      const distributions = calculateDistribution(
        leaderboardSize,
        distributionWeight
      );
      setPrizeDistributions(
        distributions.map((percentage, index) => ({
          position: index + 1,
          percentage,
        }))
      );
    }
  }, [open, leaderboardSize]);

  const prizeCount = metricsEntity?.PrizeMetrics?.total_prizes ?? 0;

  const handleAddPrizes = async () => {
    if (
      newPrize.tokenType === "ERC20" &&
      newPrize.amount &&
      totalDistributionPercentage === 100
    ) {
      setCurrentPrizes([
        ...currentPrizes,
        ...prizeDistributions.map((prize) => ({
          tokenType: "ERC20" as const,
          tokenAddress: newPrize.tokenAddress,
          amount: ((newPrize.amount ?? 0) * prize.percentage) / 100,
          position: prize.position,
        })),
      ]);
    } else if (
      newPrize.tokenType === "ERC721" &&
      newPrize.tokenId &&
      newPrize.position
    ) {
      setCurrentPrizes([
        ...currentPrizes,
        {
          tokenType: "ERC721",
          tokenAddress: newPrize.tokenAddress,
          tokenId: newPrize.tokenId,
          position: newPrize.position,
        },
      ]);
    }
  };

  const submitPrizes = async () => {
    setIsSubmitting(true);
    try {
      let prizesToAdd: Prize[] = [];

      if (
        newPrize.tokenType === "ERC20" &&
        newPrize.amount &&
        totalDistributionPercentage === 100
      ) {
        prizesToAdd = prizeDistributions.map((prize) => ({
          id: Number(prizeCount) + 1,
          tournament_id: tournamentId,
          token_address: newPrize.tokenAddress,
          token_type: new CairoCustomEnum({
            erc20: {
              amount: addAddressPadding(
                bigintToHex((newPrize.amount ?? 0) * prize.percentage * 100)
              ),
            },
            erc721: undefined,
          }),
          payout_position: prize.position,
          claimed: false,
        }));
      } else if (
        newPrize.tokenType === "ERC721" &&
        newPrize.tokenId &&
        newPrize.position
      ) {
        prizesToAdd = prizeDistributions.map((prize) => ({
          id: Number(prizeCount) + 1,
          tournament_id: tournamentId,
          token_address: newPrize.tokenAddress,
          token_type: new CairoCustomEnum({
            erc20: {
              amount: addAddressPadding(
                bigintToHex(newPrize.tokenId! * 10 ** 18)
              ),
            },
            erc721: undefined,
          }),
          payout_position: prize.position,
          claimed: false,
        }));
      }

      await approveAndAddPrizes(
        tournamentId,
        tournamentName,
        prizesToAdd,
        true
      );

      // Reset form
      setNewPrize({ tokenAddress: "", tokenType: "" });
      setSelectedToken(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add prizes:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add Prizes to Tournament</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4 overflow-y-auto pr-2">
          {/* Token Selection */}
          <div className="flex items-center gap-4">
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
          </div>

          {newPrize.tokenAddress && (
            <>
              {/* Amount/Token ID Input */}
              <div className="flex items-center gap-4">
                <span className="min-w-[100px]">
                  {isERC20 ? "Amount" : "Token ID"}
                </span>
                {isERC20 ? (
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
                  <div className="flex items-center gap-4">
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
                    <Input
                      type="number"
                      placeholder="Position"
                      min={1}
                      max={leaderboardSize}
                      value={newPrize.position || ""}
                      onChange={(e) =>
                        setNewPrize((prev) => ({
                          ...prev,
                          position: Number(e.target.value),
                        }))
                      }
                      className="w-[100px]"
                    />
                  </div>
                )}
              </div>

              {/* Distribution Settings (for ERC20 only) */}
              {isERC20 && (
                <>
                  <div className="space-y-2">
                    <span className="min-w-[100px]">Distribution</span>
                    <div className="flex flex-row items-center gap-4">
                      <Slider
                        min={0}
                        max={5}
                        step={0.1}
                        value={[distributionWeight]}
                        onValueChange={([value]) => {
                          setDistributionWeight(value);
                          const distributions = calculateDistribution(
                            leaderboardSize,
                            value
                          );
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

                  <div className="w-full overflow-hidden">
                    <div className="flex flex-row gap-4 overflow-x-auto pb-2">
                      {Array.from({
                        length: leaderboardSize,
                      }).map((_, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-2 flex-shrink-0"
                        >
                          <span>Position {index + 1}</span>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              className="w-[60px]"
                              onChange={(e) => {
                                const value = Number(e.target.value);
                                const newDistributions = [
                                  ...prizeDistributions,
                                ];
                                newDistributions[index] = {
                                  position: index + 1,
                                  percentage: value,
                                };
                                setPrizeDistributions(newDistributions);
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
                </>
              )}
            </>
          )}
        </div>

        <DialogFooter className="flex flex-row justify-between w-full overflow-hidden">
          <div className="w-2/3 overflow-hidden">
            <div className="flex flex-row gap-2 overflow-x-auto pb-2">
              {currentPrizes.map((prize, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-background/50 border border-primary-dark/50 rounded flex-shrink-0 whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-500 uppercase">
                      {prize.position}
                    </span>
                    <img
                      src={getTokenLogoUrl(prize.tokenAddress)}
                      className="w-6 h-6"
                      alt="Token logo"
                    />
                    <span className="font-bold">{selectedToken?.name}</span>
                    <span className="text-sm text-neutral-500 uppercase">
                      {selectedToken?.symbol}
                    </span>
                  </div>
                  {prize.tokenType === "ERC20" ? (
                    <span>${prize.amount}</span>
                  ) : (
                    <span>#{prize.tokenId}</span>
                  )}
                  <span
                    className="w-6 h-6 text-primary-dark cursor-pointer"
                    onClick={() => {
                      const newPrizes = [...currentPrizes];
                      newPrizes.splice(index, 1);
                      setCurrentPrizes(newPrizes);
                    }}
                  >
                    <X />
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/3 flex justify-end items-center gap-2">
            <Button
              type="button"
              disabled={!isValidPrize() || isSubmitting}
              onClick={handleAddPrizes}
            >
              {isSubmitting ? "Adding..." : "Add Prize"}
            </Button>
            {currentPrizes.length > 0 && (
              <Button type="button" variant="outline" onClick={submitPrizes}>
                Submit
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
