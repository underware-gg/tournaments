import { useMemo } from "react";
import { useSdkGetEntities } from "@/lib/dojo/hooks/useSdkGet";
import { useSdkSubscribeEntities } from "@/lib/dojo/hooks/useSdkSub";
import {
  ToriiQueryBuilder,
  KeysClause,
  ClauseBuilder,
  MemberClause,
  AndComposeClause,
} from "@dojoengine/sdk";
import { ModelsMapping } from "@/generated/models.gen";
import { addAddressPadding, BigNumberish } from "starknet";

export const useGetTokensQuery = () => {
  const query = useMemo(
    () =>
      new ToriiQueryBuilder()
        .withClause(KeysClause([ModelsMapping.Token], []).build())
        .withEntityModels([ModelsMapping.Token])
        .includeHashedKeys(),
    []
  );

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useGetMetricsQuery = (key: string) => {
  const query = useMemo(
    () =>
      new ToriiQueryBuilder()
        .withClause(
          KeysClause(
            [ModelsMapping.PlatformMetrics, ModelsMapping.PrizeMetrics],
            []
          )
            .where(
              ModelsMapping.PlatformMetrics,
              "key",
              "Eq",
              addAddressPadding(key)
            )
            .build()
        )
        .withEntityModels([
          ModelsMapping.PlatformMetrics,
          ModelsMapping.PrizeMetrics,
        ])
        .includeHashedKeys(),
    [key]
  );
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  const entity = useMemo(
    () => (Array.isArray(entities) ? entities[0] : entities),
    [entities]
  );
  return { entity, isLoading, refetch };
};

export const useGetTournamentQuery = (tournamentId: BigNumberish) => {
  const query = useMemo(
    () =>
      new ToriiQueryBuilder()
        .withClause(
          AndComposeClause([
            KeysClause(
              [
                ModelsMapping.Tournament,
                ModelsMapping.EntryCount,
                ModelsMapping.Prize,
              ],
              []
            ),
            MemberClause(
              ModelsMapping.Tournament,
              "id",
              "Eq",
              addAddressPadding(tournamentId)
            ),
            MemberClause(
              ModelsMapping.EntryCount,
              "tournament_id",
              "Eq",
              addAddressPadding(tournamentId)
            ),
            MemberClause(
              ModelsMapping.Prize,
              "tournament_id",
              "Eq",
              addAddressPadding(tournamentId)
            ),
          ]).build()
        )
        .withEntityModels([
          ModelsMapping.Tournament,
          ModelsMapping.EntryCount,
          ModelsMapping.Prize,
        ])
        .includeHashedKeys(),
    [tournamentId]
  );

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useGetRegistrationsForTournamentInTokenListQuery = ({
  tournamentId,
  tokenIds,
  limit,
  offset,
}: {
  tournamentId: BigNumberish;
  tokenIds: BigNumberish[];
  limit: number;
  offset: number;
}) => {
  const query = useMemo(
    () =>
      new ToriiQueryBuilder()
        .withClause(
          new ClauseBuilder()
            .compose()
            .and([
              new ClauseBuilder().where(
                ModelsMapping.Registration,
                "tournament_id",
                "Eq",
                addAddressPadding(tournamentId)
              ),
              new ClauseBuilder().where(
                ModelsMapping.Registration,
                "game_token_id",
                "In",
                tokenIds
              ),
              new ClauseBuilder().where(
                ModelsMapping.Registration,
                "entry_number",
                "Gt",
                0
              ),
            ])
            .build()
        )
        .withLimit(limit)
        .withOffset(offset)
        .addOrderBy(ModelsMapping.Registration, "entry_number", "Asc")
        .withEntityModels([ModelsMapping.Registration])
        .includeHashedKeys(),
    [tournamentId, tokenIds, limit, offset]
  );

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useGetGameMetadataInListQuery = ({
  gameNamespace,
  gameIds,
  isSepolia,
}: {
  gameNamespace: string;
  gameIds: BigNumberish[];
  isSepolia: boolean;
}) => {
  const query = useMemo(
    () =>
      new ToriiQueryBuilder()
        .withClause(
          KeysClause([`${gameNamespace}-TokenMetadata`], [])
            .where(`${gameNamespace}-TokenMetadata`, "token_id", "In", gameIds)
            .build()
        )
        .withEntityModels([`${gameNamespace}-TokenMetadata`])
        .includeHashedKeys(),
    [gameNamespace, gameIds]
  );

  const sepoliaQuery = useMemo(
    () =>
      new ToriiQueryBuilder()
        .withClause(
          KeysClause([`${gameNamespace}-TokenMetadata`], [])
            .where(`${gameNamespace}-TokenMetadata`, "token_id", "In", gameIds)
            .build()
        )
        .withEntityModels([`${gameNamespace}-TokenMetadata`])
        .includeHashedKeys(),
    [gameNamespace, gameIds]
  );

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query: isSepolia ? sepoliaQuery : query,
  });
  return { entities, isLoading, refetch };
};

export const useGetGameCounterQuery = ({
  key,
  nameSpace,
}: {
  key: string;
  nameSpace: string;
}) => {
  const query = useMemo(
    () =>
      new ToriiQueryBuilder()
        .withClause(
          KeysClause([`${nameSpace}-GameCounter`], [])
            .where(
              `${nameSpace}-GameCounter`,
              "key",
              "Eq",
              addAddressPadding(key)
            )
            .build()
        )
        .withEntityModels([`${nameSpace}-GameCounter`])
        .includeHashedKeys(),
    [nameSpace, key]
  );

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  const entity = useMemo(
    () => (Array.isArray(entities) ? entities[0] : entities),
    [entities]
  );
  return { entity, isLoading, refetch };
};

export const useGetGameSettingsQuery = (namespace: string) => {
  const query = useMemo(
    () =>
      new ToriiQueryBuilder()
        .withClause(
          KeysClause(
            [`${namespace}-SettingsDetails`, `${namespace}-Settings`],
            []
          ).build()
        )
        .withEntityModels([
          `${namespace}-SettingsDetails`,
          `${namespace}-Settings`,
        ])
        .addOrderBy(`${namespace}-SettingsDetails`, "id", "Asc")
        .includeHashedKeys(),
    [namespace]
  );

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useSubscribeTournamentsQuery = () => {
  const query = useMemo(
    () =>
      new ToriiQueryBuilder()
        .withClause(KeysClause([ModelsMapping.Tournament], [undefined]).build())
        .withEntityModels([ModelsMapping.Tournament])
        .includeHashedKeys(),
    []
  );

  const { entities, isSubscribed } = useSdkSubscribeEntities({
    query,
  });
  return { entities, isSubscribed };
};

export const useSubscribeTokensQuery = () => {
  const query = useMemo(
    () =>
      new ToriiQueryBuilder()
        .withClause(KeysClause([ModelsMapping.Token], [undefined]).build())
        .withEntityModels([ModelsMapping.Token])
        .includeHashedKeys(),
    []
  );

  const { entities, isSubscribed } = useSdkSubscribeEntities({
    query,
  });
  return { entities, isSubscribed };
};

export const useSubscribeEntriesQuery = () => {
  const query = useMemo(
    () =>
      new ToriiQueryBuilder()
        .withClause(
          KeysClause(
            [ModelsMapping.EntryCount, ModelsMapping.Registration],
            []
          ).build()
        )
        .withEntityModels([
          ModelsMapping.EntryCount,
          ModelsMapping.Registration,
        ])
        .includeHashedKeys(),
    []
  );

  const { entities, isSubscribed } = useSdkSubscribeEntities({
    query,
  });
  return { entities, isSubscribed };
};

export const useSubscribeGamesQuery = ({
  nameSpace,
  gameNamespace,
  isSepolia,
}: {
  nameSpace: string;
  gameNamespace: string;
  isSepolia: boolean;
}) => {
  const query = useMemo(
    () =>
      new ToriiQueryBuilder()
        .withClause(
          KeysClause(
            [`${nameSpace}-Game`, `${nameSpace}-TokenMetadata`],
            []
          ).build()
        )
        .withEntityModels([`${nameSpace}-Game`, `${nameSpace}-TokenMetadata`])
        .includeHashedKeys(),
    [nameSpace, gameNamespace, isSepolia]
  );
  const sepoliaQuery = useMemo(
    () =>
      new ToriiQueryBuilder()
        .withClause(
          KeysClause(
            [`${gameNamespace}-Game`, `${gameNamespace}-TokenMetadata`],
            [undefined]
          ).build()
        )
        .withEntityModels([
          `${gameNamespace}-Game`,
          `${gameNamespace}-TokenMetadata`,
        ])
        .includeHashedKeys(),
    [gameNamespace, isSepolia]
  );
  const { entities, isSubscribed } = useSdkSubscribeEntities({
    query: isSepolia ? sepoliaQuery : query,
  });
  return { entities, isSubscribed };
};
