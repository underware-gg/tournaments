import { Card } from "@/components/ui/card";
import { CairoCustomEnum } from "starknet";
import { Token, Tournament } from "@/generated/models.gen";
import { displayAddress, feltToString } from "@/lib/utils";
import { useDojo } from "@/context/dojo";
import { COIN, CHECK, TROPHY, CLOCK } from "@/components/Icons";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tournament as TournamentModel } from "@/generated/models.gen";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EntryRequirements = ({
  tournamentModel,
  tournamentsData,
  tokens,
}: {
  tournamentModel: TournamentModel;
  tournamentsData: Tournament[];
  tokens: Token[];
}) => {
  if (!tournamentModel?.entry_requirement?.isSome()) {
    return null;
  }
  const navigate = useNavigate();
  const { selectedChainConfig } = useDojo();

  const token = tokens.find(
    (token) =>
      token.address === tournamentModel.entry_requirement.Some?.variant.token
  );

  const activeVariant = tournamentModel.entry_requirement.Some?.activeVariant();

  const tournament: CairoCustomEnum =
    tournamentModel.entry_requirement.Some?.variant?.tournament;

  const tournamentVariant = tournament?.activeVariant();

  const allowlist = tournamentModel.entry_requirement.Some?.variant?.allowlist;

  const blockExplorerExists =
    selectedChainConfig.blockExplorerUrl !== undefined;

  return (
    <HoverCard openDelay={50} closeDelay={0}>
      <HoverCardTrigger asChild>
        <Card
          variant="outline"
          className="relative flex flex-row items-center justify-between w-36 h-full p-1 px-2 hover:cursor-pointer"
        >
          <span className="absolute left-0 -top-5 text-xs whitespace-nowrap uppercase text-brand-muted font-bold">
            Entry Requirements:
          </span>
          {activeVariant === "token" ? (
            <div className="text-brand flex flex-row items-center justify-center gap-1 w-full">
              <span className="w-8">
                <COIN />
              </span>
              <span className="text-xs">{token?.name}</span>
            </div>
          ) : activeVariant === "tournament" ? (
            <div className="flex flex-row items-center gap-1">
              <span className="w-6">
                <TROPHY />
              </span>
              <span className="capitalize">{tournament.activeVariant()}</span>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-center gap-1 w-full">
              <span className="w-8">
                <CHECK />
              </span>
              <span>Allowlist</span>
            </div>
          )}
        </Card>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 max-h-[150px] p-4 text-sm z-50 overflow-hidden"
        align="start"
        side="bottom"
        sideOffset={5}
      >
        <div className="flex flex-col gap-2 h-full">
          {activeVariant === "token" ? (
            <>
              <p className="text-muted-foreground">
                To enter this tournament you must hold:
              </p>
              <div className="flex items-center gap-2">
                <span className="w-8">
                  <COIN />
                </span>
                <span>{token?.name}</span>
                <span
                  className="text-brand-muted hover:cursor-pointer"
                  onClick={() => {
                    if (blockExplorerExists) {
                      window.open(
                        `${selectedChainConfig.blockExplorerUrl}nft-contract/${token?.address}`,
                        "_blank"
                      );
                    }
                  }}
                >
                  {displayAddress(token?.address ?? "0x0")}
                </span>
              </div>
            </>
          ) : activeVariant === "tournament" ? (
            <>
              <h4 className="text-lg">
                Tournament{" "}
                <span className="capitalize">{tournamentVariant}</span>
              </h4>
              <div className="h-[100px] flex flex-col gap-2 overflow-y-auto">
                {tournamentsData?.map((tournament, index) => {
                  const tournamentEnd = tournament.schedule.game.end;
                  const tournamentEnded =
                    BigInt(tournamentEnd) < BigInt(Date.now()) / 1000n;
                  return (
                    <div
                      key={index}
                      className="flex flex-row items-center gap-2"
                    >
                      <span>{feltToString(tournament.metadata.name)}</span>|
                      <div className="flex flex-row items-center gap-1">
                        <span className="w-4">
                          <CLOCK />
                        </span>
                        <span>{tournamentEnded ? "Ended" : "Active"}</span>
                      </div>
                      |
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => {
                          navigate(`/tournament/${Number(tournament.id)}`);
                        }}
                      >
                        View
                      </Button>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="h-[100px] flex flex-col gap-2 overflow-y-auto">
              {allowlist?.map((item: string, index: number) => (
                <div key={index}>
                  <span>{displayAddress(item)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default EntryRequirements;
