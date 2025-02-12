import React from "react";
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

  const isValidPrize = () => {
    if (!newPrize.tokenAddress || !newPrize.position) return false;

    if (newPrize.tokenType === "ERC20") {
      return !!newPrize.amount && newPrize.amount > 0;
    }

    if (newPrize.tokenType === "ERC721") {
      return !!newPrize.tokenId;
    }

    return false;
  };

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
                        newPrize.position
                      ) {
                        form.setValue("bonusPrizes", [
                          ...currentPrizes,
                          {
                            type: "ERC20",
                            tokenAddress: newPrize.tokenAddress,
                            amount: newPrize.amount,
                            position: newPrize.position,
                          },
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
                      // Reset new prize inputs and selected token
                      setNewPrize({ tokenAddress: "", tokenType: "" });
                      setSelectedToken(null);
                    }}
                  >
                    Add Prize
                  </Button>
                </div>

                {(form.watch("bonusPrizes") || []).length > 0 && (
                  <>
                    <div className="w-full h-0.5 bg-retro-green/25" />
                    <div className="space-y-2">
                      <FormLabel className="font-astronaut text-2xl">
                        Added Prizes
                      </FormLabel>
                      <div className="flex flex-row items-center gap-2">
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
