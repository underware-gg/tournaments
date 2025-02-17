import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useSystemCalls } from "@/dojo/hooks/useSystemCalls";
import { useAccount } from "@starknet-react/core";
import { Tournament, EntryCount } from "@/generated/models.gen";
import { stringToFelt, feltToString } from "@/lib/utils";
import { CairoOption, CairoOptionVariant } from "starknet";
import { addAddressPadding } from "starknet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EnterTournamentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasEntryFee?: boolean;
  entryFee?: number | "Free";
  tournamentModel: Tournament;
  entryCountModel: EntryCount;
}

export function EnterTournamentDialog({
  open,
  onOpenChange,
  hasEntryFee,
  entryFee,
  tournamentModel,
  entryCountModel,
}: EnterTournamentDialogProps) {
  const { address } = useAccount();
  const { approveAndEnterTournament } = useSystemCalls();
  const [playerName, setPlayerName] = useState("");

  const handleEnterTournament = () => {
    if (!playerName.trim()) return;

    approveAndEnterTournament(
      tournamentModel?.entry_fee,
      tournamentModel?.id,
      feltToString(tournamentModel?.metadata.name),
      entryCountModel?.count,
      0,
      stringToFelt(playerName.trim()),
      addAddressPadding(address!),
      new CairoOption(CairoOptionVariant.None)
    );

    setPlayerName("");
  };

  // Reset player name when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setPlayerName("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Tournament</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {hasEntryFee && <p>Entry Fee: ${entryFee}</p>}

          <div className="space-y-2">
            <Label htmlFor="playerName">Player Name</Label>
            <Input
              id="playerName"
              placeholder="Enter your player name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={handleEnterTournament}
              disabled={!playerName.trim()}
            >
              Enter
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
