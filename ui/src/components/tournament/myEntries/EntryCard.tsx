import TokenGameIcon from "@/components/icons/TokenGameIcon";
import { HoverCardTrigger } from "@/components/ui/hover-card";
import { Card } from "@/components/ui/card";
import { HoverCard } from "@/components/ui/hover-card";
import { INFO } from "@/components/Icons";
import EntryInfo from "@/components/tournament/myEntries/EntryInfo";
import { feltToString } from "@/lib/utils";
import { TokenMetadata } from "@/generated/models.gen";
import { BigNumberish } from "starknet";
import { Button } from "@/components/ui/button";

interface EntryCardProps {
  gameAddress: string;
  mergedEntry: {
    metadata: TokenMetadata | null;
    tournament_id?: BigNumberish | undefined;
    game_token_id?: BigNumberish | undefined;
    entry_number?: BigNumberish | undefined;
    has_submitted?: boolean | undefined;
    fieldOrder?: string[] | undefined;
  };
}

const EntryCard = ({ gameAddress, mergedEntry }: EntryCardProps) => {
  const currentDate = BigInt(new Date().getTime()) / 1000n;
  const isActive =
    !!mergedEntry.metadata?.lifecycle.start.Some &&
    BigInt(mergedEntry.metadata?.lifecycle.start.Some) < currentDate;

  return (
    <Card
      variant="outline"
      className="flex-none flex flex-col items-center gap-2 h-[120px] w-[80px] p-1 pt-5 relative group"
    >
      <TokenGameIcon game={gameAddress} size={"sm"} />
      <div className="absolute top-1 left-1 text-xs">
        #{mergedEntry.entry_number?.toString()}
      </div>
      <HoverCard openDelay={50} closeDelay={0}>
        <HoverCardTrigger asChild>
          <div className="absolute top-0 right-0 text-retro-green-dark hover:cursor-pointer w-5 h-5 z-20">
            <INFO />
          </div>
        </HoverCardTrigger>
        <EntryInfo entryNumber={mergedEntry.entry_number?.toString() ?? ""} />
      </HoverCard>
      <p className="text-xs overflow-x-hidden text-ellipsis whitespace-nowrap text-retro-green-dark">
        {feltToString(mergedEntry.metadata?.player_name ?? "")}
      </p>
      {isActive && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            size="sm"
            onClick={() => {
              console.log("Play clicked for entry:", mergedEntry.entry_number);
            }}
          >
            PLAY
          </Button>
        </div>
      )}
      <div className="absolute flex flex-row items-center justify-between bottom-1 w-full px-2">
        {isActive ? (
          <>
            <p className="text-[10px] text-neutral-500">Score:</p>
            <p className="text-xs text-retro-green">100</p>
          </>
        ) : (
          <>
            <p className="text-xs text-neutral-500">Not Active</p>
          </>
        )}
      </div>
    </Card>
  );
};

export default EntryCard;
