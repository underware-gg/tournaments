import { Card } from "@/components/ui/card";
import { CairoCustomEnum } from "starknet";
import { useDojoStore } from "@/dojo/hooks/useDojoStore";
import { Token } from "@/generated/models.gen";
import { bigintToHex, displayAddress } from "@/lib/utils";
import { addAddressPadding } from "starknet";
import { ChainId } from "@/dojo/config";
import { useDojo } from "@/context/dojo";
import { COIN } from "@/components/Icons";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tournament as TournamentModel } from "@/generated/models.gen";

const EntryRequirements = ({
  tournamentModel,
}: {
  tournamentModel: TournamentModel;
}) => {
  if (!tournamentModel.entry_requirement.isSome()) {
    return null;
  }

  const { selectedChainConfig, nameSpace } = useDojo();

  const isSepolia = selectedChainConfig.chainId === ChainId.SN_SEPOLIA;

  const sepoliaTokens = [
    {
      address:
        "0x064fd80fcb41d00214430574a0aa19d21cc5d6452aeb4996f31b6e9ba4f466a0",
      is_registered: true,
      name: "Lords",
      symbol: "LORDS",
      token_type: new CairoCustomEnum({
        erc20: {
          amount: addAddressPadding(bigintToHex(BigInt(1))),
        },
      }),
    },
  ];

  const tokens = isSepolia
    ? sepoliaTokens
    : useDojoStore
        .getState()
        .getEntitiesByModel(nameSpace, "Token")
        .map((token) => token.models[nameSpace].Token as Token);

  const token = tokens.find(
    (token) =>
      token.address === tournamentModel.entry_requirement.Some?.variant.token
  );

  const activeVariant = tournamentModel.entry_requirement.Some?.activeVariant();

  const blockExplorerExists =
    selectedChainConfig.blockExplorerUrl !== undefined;

  return (
    <HoverCard openDelay={50} closeDelay={0}>
      <HoverCardTrigger asChild>
        <Card
          variant="outline"
          className="relative flex flex-row items-center justify-between w-36 h-full p-1 hover:cursor-pointer"
        >
          <span className="absolute left-0 -top-5 text-xs whitespace-nowrap uppercase text-retro-green-dark font-bold">
            Entry Requirement:
          </span>
          {activeVariant === "token" ? (
            <div className="text-retro-green flex flex-row items-center justify-center gap-1 w-full">
              <span className="w-8">
                <COIN />
              </span>
              <span className="text-xs">{token?.name}</span>
            </div>
          ) : activeVariant === "tournament" ? (
            "NFT"
          ) : (
            "NFT"
          )}
        </Card>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 p-4 text-sm z-50"
        align="start"
        side="bottom"
        sideOffset={5}
      >
        <div className="space-y-2">
          <h4 className="font-medium">
            {activeVariant === "token"
              ? "Token Requirements"
              : "NFT Requirements"}
          </h4>
          {activeVariant === "token" ? (
            <>
              <p className="text-muted-foreground">
                To enter this tournament, you need:
              </p>
              <div className="flex items-center gap-2">
                <span className="w-8">
                  <COIN />
                </span>
                <span>{token?.name}</span>
                <span
                  className="text-retro-green-dark hover:cursor-pointer"
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
              {/* Add more token details as needed */}
            </>
          ) : (
            <p className="text-muted-foreground">
              NFT requirement details here
            </p>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default EntryRequirements;
