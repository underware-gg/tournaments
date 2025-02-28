import { useState, useEffect, useMemo } from "react";
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
import { Tournament, EntryCount, Token } from "@/generated/models.gen";
import { stringToFelt, feltToString, indexAddress } from "@/lib/utils";
import {
  CairoOption,
  CairoOptionVariant,
  addAddressPadding,
  BigNumberish,
} from "starknet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConnectToSelectedChain } from "@/dojo/hooks/useChain";
import { useGetUsernames } from "@/hooks/useController";
import { CHECK, X } from "@/components/Icons";

interface EnterTournamentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasEntryFee?: boolean;
  entryFee?: string;
  tournamentModel: Tournament;
  entryCountModel: EntryCount;
  gameCount: BigNumberish;
  tokens: Token[];
}

export function EnterTournamentDialog({
  open,
  onOpenChange,
  hasEntryFee,
  entryFee,
  tournamentModel,
  entryCountModel,
  gameCount,
  tokens,
}: EnterTournamentDialogProps) {
  const { address } = useAccount();
  const { connect } = useConnectToSelectedChain();
  const { approveAndEnterTournament, getBalanceGeneral } = useSystemCalls();
  const [playerName, setPlayerName] = useState("");
  const [balance, setBalance] = useState<BigNumberish>(0);

  const handleEnterTournament = () => {
    if (!playerName.trim()) return;

    approveAndEnterTournament(
      tournamentModel?.entry_fee,
      tournamentModel?.id,
      feltToString(tournamentModel?.metadata.name),
      entryCountModel?.count,
      stringToFelt(playerName.trim()),
      addAddressPadding(address!),
      new CairoOption(CairoOptionVariant.None),
      gameCount
    );

    setPlayerName("");
  };

  const ownerAddresses = useMemo(() => {
    return [address ?? "0x0"];
  }, [address]);

  const { usernames } = useGetUsernames(ownerAddresses);

  const accountUsername = usernames?.get(indexAddress(address ?? ""));

  useEffect(() => {
    if (!open) {
      setPlayerName("");
    } else if (accountUsername) {
      setPlayerName(accountUsername);
    }
  }, [open]);

  const entryToken = tournamentModel?.entry_fee?.Some?.token_address;
  const entryAmount = tournamentModel?.entry_fee?.Some?.amount;

  const getBalance = async () => {
    const balance = await getBalanceGeneral(entryToken ?? "");
    setBalance(balance);
  };

  useEffect(() => {
    if (entryToken && address) {
      getBalance();
    }
  }, [entryToken, address, getBalance]);

  const hasBalance = BigInt(balance) >= BigInt(entryAmount ?? 0n);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Tournament</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {hasEntryFee && (
            <div className="flex flex-col gap-2">
              <span className="text-lg">Entry Fee</span>
              <div className="flex flex-row items-center justify-center gap-2">
                <div className="flex flex-row items-center gap-1">
                  <span>{Number(entryAmount) / 10 ** 18}</span>
                  <span>
                    {
                      tokens.find((token) => token.address === entryToken)
                        ?.symbol
                    }
                  </span>
                </div>
                <span className="text-neutral-400">~${entryFee}</span>
                {address &&
                  (hasBalance ? (
                    <span className="w-8 h-8">
                      <CHECK />
                    </span>
                  ) : (
                    <span className="w-8 h-8">
                      <X />
                    </span>
                  ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="playerName" className="text-lg">
              Player Name
            </Label>
            <div className="flex flex-col gap-4">
              {accountUsername && (
                <div className="flex flex-row justify-center gap-2">
                  <span className="text-retro-green-dark">Default:</span>
                  <span className="text-retro-green">{accountUsername}</span>
                </div>
              )}
              <Input
                id="playerName"
                placeholder="Enter your player name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {address ? (
            <DialogClose asChild>
              <Button disabled={!hasBalance} onClick={handleEnterTournament}>
                Confirm & Create
              </Button>
            </DialogClose>
          ) : (
            <Button onClick={() => connect()}>Connect Wallet</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
