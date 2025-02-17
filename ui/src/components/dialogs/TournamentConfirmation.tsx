import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TournamentFormData } from "@/containers/CreateTournament";
import { format } from "date-fns";
import TokenGameIcon from "@/components/icons/TokenGameIcon";
import { ALERT } from "@/components/Icons";
import { useAccount } from "@starknet-react/core";
import { useConnectController } from "@/hooks/useController";
interface TournamentConfirmationProps {
  formData: TournamentFormData;
  onConfirm: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TournamentConfirmation = ({
  formData,
  onConfirm,
  open,
  onOpenChange,
}: TournamentConfirmationProps) => {
  const { address } = useAccount();
  const { connectController } = useConnectController();
  // Helper function to safely check array length
  const hasBonusPrizes =
    formData.bonusPrizes && formData.bonusPrizes.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-row gap-2 items-center">
              <span className="w-8 h-8">
                <ALERT />
              </span>
              Confirm Tournament Details
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto p-6 pt-2 max-h-[60vh]">
          <div className="space-y-6">
            {/* Details Section */}
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Tournament Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Name:</span>
                <span>{formData.name}</span>
                <span className="text-muted-foreground">Description:</span>
                <span className="whitespace-pre-wrap">
                  {formData.description}
                </span>
                <span className="text-muted-foreground">Game:</span>
                <div className="flex flex-row items-center gap-2">
                  <TokenGameIcon game={formData.game} />
                  <span>{formData.game}</span>
                </div>
                <span className="text-muted-foreground">Settings:</span>
                <span>{formData.settings}</span>
                <span className="text-muted-foreground">Leaderboard Size:</span>
                <span>{formData.leaderboardSize}</span>
              </div>
            </div>

            {/* Schedule Section */}
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Schedule</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Start Time:</span>
                <span>{format(formData.startTime, "PPP p")}</span>
                <span className="text-muted-foreground">Duration:</span>
                <span>{formData.duration} days</span>
                <span className="text-muted-foreground">
                  Registration Type:
                </span>
                <span className="capitalize">{formData.type}</span>
              </div>
            </div>

            {/* Entry Requirements */}
            {formData.enableGating && formData.gatingOptions && (
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Entry Requirements</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="capitalize">
                    {formData.gatingOptions.type}
                  </span>
                  {/* Add more gating details based on type */}
                </div>
              </div>
            )}

            {/* Entry Fees */}
            {formData.enableEntryFees && formData.entryFees && (
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Entry Fees</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Token:</span>
                  <span>{formData.entryFees.tokenAddress}</span>
                  <span className="text-muted-foreground">Amount:</span>
                  <span>${formData.entryFees.amount}</span>
                  <span className="text-muted-foreground">Creator Fee:</span>
                  <span>{formData.entryFees.creatorFeePercentage}%</span>
                  <span className="text-muted-foreground">Game Fee:</span>
                  <span>{formData.entryFees.gameFeePercentage}%</span>
                  <span className="text-muted-foreground">Distribution:</span>
                  <div className="flex flex-row gap-2 overflow-x-auto">
                    {formData.entryFees.prizeDistribution?.map(
                      (distribution, index) => (
                        <div key={index} className="flex flex-row gap-2">
                          <span>{distribution.position}:</span>
                          <span>{distribution.percentage}%</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bonus Prizes */}
            {formData.enableBonusPrizes && hasBonusPrizes && (
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Bonus Prizes</h3>
                <div className="space-y-2">
                  {formData.bonusPrizes?.map((prize, index) => (
                    <div key={index} className="text-sm">
                      <span>Position {prize.position}: </span>
                      {prize.type === "ERC20" ? (
                        <span>{prize.amount} tokens</span>
                      ) : (
                        <span>NFT ID: {prize.tokenId}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {address ? (
            <DialogClose asChild>
              <Button onClick={onConfirm}>Confirm & Create</Button>
            </DialogClose>
          ) : (
            <Button onClick={() => connectController()}>Connect Wallet</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TournamentConfirmation;
