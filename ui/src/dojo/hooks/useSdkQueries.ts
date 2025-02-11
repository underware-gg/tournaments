import { useMemo } from "react";
import { useDojo } from "@/context/dojo";
import {
  useSdkGetEntities,
  TournamentGetQuery,
} from "@/lib/dojo/hooks/useSdkGet";
import {
  useSdkSubscribeEntities,
  TournamentSubQuery,
} from "@/lib/dojo/hooks/useSdkSub";
import { bigintToHex } from "@/lib/utils";
import { ParsedEntity, ToriiQueryBuilder, KeysClause } from "@dojoengine/sdk";
import { SchemaType } from "@/generated/models.gen";
import { addAddressPadding, BigNumberish } from "starknet";

export const useGetTokensQuery = () => {
  const { nameSpace } = useDojo();
  const query = new ToriiQueryBuilder()
    .withClause(KeysClause(["tournaments-Token"], [undefined]).build())
    .withEntityModels(["tournaments-Token"])
    .withLimit(100)
    .includeHashedKeys();

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useGetTournamentCountsQuery = (key: bigint) => {
  const { nameSpace } = useDojo();
  const query = {};
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  const entity = useMemo(
    () => (Array.isArray(entities) ? entities[0] : entities),
    [entities]
  );
  return { entity, isLoading, refetch };
};

export const useGetPrizeCountsQuery = (key: bigint) => {
  const { nameSpace } = useDojo();
  const query = {};
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  const entity = useMemo(
    () => (Array.isArray(entities) ? entities[0] : entities),
    [entities]
  );
  return { entity, isLoading, refetch };
};

export const useGetUpcomingTournamentsQuery = (
  currentTime: string,
  limit: number,
  offset: number
) => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        Tournament: {
          $: {
            where: {
              "schedule.game.start": { $gt: addAddressPadding(currentTime) },
            },
          },
        },
      },
    }),
    [currentTime]
  );

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
    orderBy: [
      {
        model: `${nameSpace}-Tournament`,
        member: "schedule.game.start",
        direction: "Asc",
      },
    ],
    limit: limit,
    offset: offset,
  });
  return { entities, isLoading, refetch };
};

export const useGetTournamentDetailsQuery = (tournamentId: BigNumberish) => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        Tournament: {
          $: {
            where: {
              id: { $eq: addAddressPadding(tournamentId) },
            },
          },
        },
        Prize: {
          $: {
            where: {
              tournament_id: { $eq: addAddressPadding(tournamentId) },
            },
          },
        },
      },
    }),
    [tournamentId]
  );

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useGetTournamentDetailsInListQuery = (
  tournamentIds: BigNumberish[]
) => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        Prize: {
          $: {
            where: {
              tournament_id: { $in: tournamentIds },
            },
          },
        },
        TournamentEntries: {
          $: {
            where: {
              tournament_id: { $in: tournamentIds },
            },
          },
        },
      },
    }),
    [tournamentIds]
  );

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useSubscribeTournamentsQuery = () => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentSubQuery>(
    () => ({
      [nameSpace]: {
        Tournament: [],
      },
    }),
    []
  );
  const { entities, isSubscribed } = useSdkSubscribeEntities({
    query,
  });
  return { entities, isSubscribed };
};

export const useSubscribeTokensQuery = () => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentSubQuery>(
    () => ({
      [nameSpace]: {
        Token: [],
      },
    }),
    []
  );
  const { entities, isSubscribed } = useSdkSubscribeEntities({
    query,
  });
  return { entities, isSubscribed };
};
