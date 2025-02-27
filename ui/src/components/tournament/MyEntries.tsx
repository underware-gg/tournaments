import { Card } from "@/components/ui/card";
import { DOLLAR } from "@/components/Icons";
import { useGetAccountTokenIds } from "@/dojo/hooks/useSqlQueries";
import {
  useGetGameMetadataInListQuery,
  useGetRegistrationsForTournamentInTokenListQuery,
} from "@/dojo/hooks/useSdkQueries";
import { indexAddress } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { BigNumberish, addAddressPadding } from "starknet";
import { bigintToHex } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import EntryCard from "@/components/tournament/myEntries/EntryCard";
import { TokenMetadata } from "@/generated/models.gen";
import { useDojoStore } from "@/dojo/hooks/useDojoStore";

interface MyEntriesProps {
  tournamentId: BigNumberish;
  gameAddress: string;
  gameNamespace: string;
  gameScoreModel: string;
  gameScoreAttribute: string;
}

const MyEntries = ({
  tournamentId,
  gameAddress,
  gameNamespace,
  gameScoreModel,
  gameScoreAttribute,
}: MyEntriesProps) => {
  const { address } = useAccount();
  const state = useDojoStore.getState();
  const [showMyEntries, setShowMyEntries] = useState(false);

  const queryAddress = useMemo(() => {
    if (!address || address === "0x0") return null;
    return indexAddress(address);
  }, [address]);

  const queryGameAddress = useMemo(() => {
    if (!gameAddress || gameAddress === "0x0") return null;
    return indexAddress(gameAddress);
  }, [gameAddress]);

  const { data: ownedTokens } = useGetAccountTokenIds(queryAddress, [
    queryGameAddress ?? "0x0",
  ]);

  console.log(ownedTokens);

  const ownedTokenIds = useMemo(() => {
    return ownedTokens
      ?.map((token) => {
        const parts = token.token_id?.split(":");
        return parts?.[1] ?? null;
      })
      .filter(Boolean);
  }, [ownedTokens]);

  const { entities: myRegistrations } =
    useGetRegistrationsForTournamentInTokenListQuery({
      tournamentId: addAddressPadding(bigintToHex(tournamentId)),
      tokenIds: ownedTokenIds ?? [],
      limit: 1000,
      offset: 0,
    });

  const myEntriesCount = useMemo(() => {
    return myRegistrations?.length ?? 0;
  }, [myRegistrations]);

  const tokenIds = useMemo(
    () =>
      myRegistrations?.map((registration) =>
        addAddressPadding(
          bigintToHex(registration?.Registration?.game_token_id ?? 0n)
        )
      ),
    [myRegistrations]
  );

  const { entities: metadata } = useGetGameMetadataInListQuery({
    gameNamespace: gameNamespace ?? "",
    gameIds: tokenIds ?? [],
  });

  const entities = state.getEntities();

  const scoreEntities = entities.filter(
    (entity) => (entity.models as any)?.[gameNamespace]?.[gameScoreModel]
  );

  const mergedEntries = useMemo(() => {
    if (!myRegistrations || !metadata) return [];

    return myRegistrations.map((registration) => {
      const gameTokenId = registration?.Registration?.game_token_id ?? 0n;

      // Find matching metadata for this token
      const gameMetadata = metadata.find(
        (m) => m?.TokenMetadata?.token_id === gameTokenId
      );

      // Find matching score for this token
      const score = scoreEntities.find(
        (s) =>
          (s?.models as any)?.[gameNamespace]?.[gameScoreModel]?.game_id ===
          gameTokenId
      );

      // Find token metadata for this token
      const tokenMetadata = ownedTokens?.find(
        (t) =>
          t.token_id ===
          `${indexAddress(gameAddress)}:${addAddressPadding(
            bigintToHex(gameTokenId)
          )}`
      )?.metadata;

      return {
        ...registration.Registration,
        gameMetadata: gameMetadata?.TokenMetadata as TokenMetadata | null,
        tokenMetadata: tokenMetadata as string | null,
        score:
          (score?.models as any)?.[gameNamespace]?.[gameScoreModel]?.[
            gameScoreAttribute
          ] ?? 0,
      };
    });
  }, [myRegistrations, metadata, address]);

  useEffect(() => {
    if (address) {
      setShowMyEntries(myEntriesCount > 0);
    } else {
      setShowMyEntries(false);
    }
  }, [address, myEntriesCount]);

  return (
    <Card
      variant="outline"
      className={`sm:w-1/2 transition-all duration-300 ease-in-out ${
        showMyEntries ? "h-[200px]" : "h-[45px] sm:h-[60px]"
      }`}
    >
      <div className="flex flex-col justify-between">
        <div className="flex flex-row justify-between h-6 sm:h-8">
          <span className="font-astronaut text-lg sm:text-2xl">My Entries</span>
          <div className="flex flex-row items-center gap-2">
            {address ? (
              myEntriesCount > 0 ? (
                <>
                  <span className="text-neutral-500">
                    {showMyEntries ? "Hide" : "Show Entries"}
                  </span>
                  <Switch
                    checked={showMyEntries}
                    onCheckedChange={setShowMyEntries}
                    className="h-4 sm:h-6"
                  />
                </>
              ) : (
                <span className="text-neutral-500">No Entries</span>
              )
            ) : (
              <span className="text-neutral-500">No Account Connected</span>
            )}
            <div className="flex flex-row items-center font-astronaut text-lg sm:text-2xl">
              <span className="w-8">
                <DOLLAR />
              </span>
              : {myEntriesCount}
            </div>
          </div>
        </div>
        <div
          className={`transition-all duration-300 delay-150 ease-in-out ${
            showMyEntries ? "h-auto opacity-100" : "h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="w-full h-0.5 bg-retro-green/25 mt-2" />
          <div className="p-2 h-auto">
            <div className="flex flex-row gap-5 overflow-x-auto">
              {mergedEntries?.map((mergedEntry, index) => (
                <EntryCard
                  key={index}
                  gameAddress={gameAddress}
                  mergedEntry={mergedEntry}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MyEntries;
