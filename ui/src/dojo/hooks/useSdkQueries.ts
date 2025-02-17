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
import { SchemaType, ModelsMapping } from "@/generated/models.gen";
import { addAddressPadding, BigNumberish } from "starknet";

export const useGetTokensQuery = () => {
  const { nameSpace } = useDojo();
  const query = new ToriiQueryBuilder()
    .withClause(KeysClause([ModelsMapping.Token], []).build())
    .withEntityModels([ModelsMapping.Token])
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
  const query = new ToriiQueryBuilder()
    .withClause(
      KeysClause([ModelsMapping.Tournament], [])
        .where(
          ModelsMapping.Tournament,
          "schedule.game.start",
          "Gt",
          addAddressPadding(currentTime)
        )
        .build()
    )
    .withLimit(limit)
    .withOffset(offset)
    .includeHashedKeys();

  // console.log(
  //   convertQueryToClause({
  //     [nameSpace]: {
  //       Tournament: {
  //         $: {
  //           where: {
  //             "schedule.game.start": { $gt: addAddressPadding(currentTime) },
  //           },
  //         },
  //       },
  //     },
  //   })
  // );
  // const query = useMemo<TournamentGetQuery>(
  //   () => ({
  //     [nameSpace]: {
  //       Tournament: {
  //         $: {
  //           where: {
  //             "schedule.game.start": { $gt: addAddressPadding(currentTime) },
  //           },
  //         },
  //       },
  //     },
  //   }),
  //   [currentTime]
  // );

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

export const useGetLiveTournamentsQuery = (
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
              And: [
                {
                  "schedule.game.start": {
                    $lte: addAddressPadding(currentTime),
                  },
                },
                {
                  "schedule.game.end": { $gt: addAddressPadding(currentTime) },
                },
              ],
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
  const tournamentIdsKey = useMemo(
    () => JSON.stringify(tournamentIds),
    [tournamentIds]
  );
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
      },
    }),
    [nameSpace, tournamentIdsKey]
  );

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useGetTournamentRegistrationsQuery = ({
  tournamentId,
  limit,
  offset,
}: {
  tournamentId: BigNumberish;
  limit: number;
  offset: number;
}) => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        Registration: {
          $: {
            where: {
              And: [
                {
                  tournament_id: { $eq: addAddressPadding(tournamentId) },
                },
                {
                  entry_number: { $gt: 0 },
                },
              ],
            },
          },
        },
      },
    }),
    [nameSpace, tournamentId]
  );
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
    limit,
    offset,
  });
  return { entities, isLoading, refetch };
};

export const useGetAllRegistrationsQuery = ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}) => {
  const { nameSpace } = useDojo();
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        Registration: {
          $: {
            where: {
              entry_number: { $gt: 0 },
            },
          },
        },
      },
    }),
    [nameSpace]
  );
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
    limit,
    offset,
  });
  return { entities, isLoading, refetch };
};

export const useGetRegistrationsInTokenListQuery = ({
  tokenIds,
  limit,
  offset,
}: {
  tokenIds: BigNumberish[];
  limit: number;
  offset: number;
}) => {
  const { nameSpace } = useDojo();
  const tokenIdsKey = useMemo(() => JSON.stringify(tokenIds), [tokenIds]);
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        Registration: {
          $: {
            where: {
              token_id: { $in: tokenIds },
            },
          },
        },
      },
    }),
    [nameSpace, tokenIdsKey]
  );

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
    limit,
    offset,
  });
  return { entities, isLoading, refetch };
};

export const useGetGameScoresInListQuery = ({
  namespace,
  gameIds,
  isSepolia,
}: {
  namespace: string;
  gameIds: BigNumberish[];
  isSepolia: boolean;
}) => {
  const gameIdsKey = useMemo(() => JSON.stringify(gameIds), [gameIds]);
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [namespace]: {
        Score: {
          $: {
            where: {
              game_id: { $in: gameIds },
            },
          },
        },
        TokenMetadata: {
          $: {
            where: {
              token_id: { $in: gameIds },
            },
          },
        },
      },
    }),
    [namespace, gameIdsKey]
  );
  const sepoliaQuery = useMemo<TournamentGetQuery>(
    () => ({
      ds: {
        Game: {
          $: {
            where: {
              game_id: { $in: gameIds },
            },
          },
        },
      },
    }),
    [gameIds]
  );
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query: isSepolia ? sepoliaQuery : query,
  });
  return { entities, isLoading, refetch };
};

export const useGetGameMetadataInListQuery = ({
  nameSpace,
  gameIds,
}: {
  nameSpace: string;
  gameIds: BigNumberish[];
}) => {
  const gameIdsKey = useMemo(() => JSON.stringify(gameIds), [gameIds]);
  const query = useMemo<TournamentGetQuery>(
    () => ({
      [nameSpace]: {
        Game: {
          $: {
            where: {
              game_id: { $in: gameIds },
            },
          },
        },
      },
    }),
    [nameSpace, gameIdsKey]
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

export const useSubscribeGamesQuery = ({
  nameSpace,
  isSepolia,
}: {
  nameSpace: string;
  isSepolia: boolean;
}) => {
  const query = useMemo<TournamentSubQuery>(
    () => ({
      [nameSpace]: {
        Score: [],
        TokenMetadata: [],
      },
    }),
    [nameSpace]
  );
  const sepoliaQuery = useMemo(
    () => ({
      ds: {
        Game: [],
        TokenMetadata: [],
      },
    }),
    [nameSpace]
  );
  const { entities, isSubscribed } = useSdkSubscribeEntities({
    query: isSepolia ? sepoliaQuery : query,
  });
  return { entities, isSubscribed };
};
