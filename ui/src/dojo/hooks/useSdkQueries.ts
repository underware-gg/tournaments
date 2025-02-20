import { useMemo } from "react";
import { useSdkGetEntities } from "@/lib/dojo/hooks/useSdkGet";
import { useSdkSubscribeEntities } from "@/lib/dojo/hooks/useSdkSub";
import { ToriiQueryBuilder, KeysClause, ClauseBuilder } from "@dojoengine/sdk";
import { ModelsMapping } from "@/generated/models.gen";
import { addAddressPadding, BigNumberish } from "starknet";

export const useGetTokensQuery = () => {
  const query = new ToriiQueryBuilder()
    .withClause(KeysClause([ModelsMapping.Token], []).build())
    .withEntityModels([ModelsMapping.Token])
    .includeHashedKeys();

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useGetMetricsQuery = (key: string) => {
  const query = new ToriiQueryBuilder().withClause(
    KeysClause([ModelsMapping.PlatformMetrics, ModelsMapping.PrizeMetrics], [])
      .where(ModelsMapping.PlatformMetrics, "key", "Eq", addAddressPadding(key))
      .build()
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

export const useGetUpcomingTournamentsQuery = (
  currentTime: string,
  limit: number,
  offset: number
) => {
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
    .addOrderBy(ModelsMapping.Tournament, "schedule.game.start", "Asc")
    .includeHashedKeys();

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useGetLiveTournamentsQuery = (
  currentTime: string,
  limit: number,
  offset: number
) => {
  const query = new ToriiQueryBuilder()
    .withClause(
      new ClauseBuilder()
        .compose()
        .and([
          new ClauseBuilder().where(
            ModelsMapping.Tournament,
            "schedule.game.start",
            "Lte",
            addAddressPadding(currentTime)
          ),
          new ClauseBuilder().where(
            ModelsMapping.Tournament,
            "schedule.game.end",
            "Gt",
            addAddressPadding(currentTime)
          ),
        ])
        .build()
    )
    .withLimit(limit)
    .withOffset(offset)
    .addOrderBy(ModelsMapping.Tournament, "schedule.game.start", "Asc")
    .includeHashedKeys();

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useGetEndedTournamentsQuery = (
  currentTime: string,
  limit: number,
  offset: number
) => {
  const query = new ToriiQueryBuilder()
    .withClause(
      KeysClause([ModelsMapping.Tournament], [])
        .where(
          ModelsMapping.Tournament,
          "schedule.game.end",
          "Lte",
          addAddressPadding(currentTime)
        )
        .build()
    )
    .withLimit(limit)
    .withOffset(offset)
    .addOrderBy(ModelsMapping.Tournament, "schedule.game.end", "Desc")
    .includeHashedKeys();

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useGetTournamentDetailsQuery = (tournamentId: BigNumberish) => {
  const query = new ToriiQueryBuilder()
    .withClause(
      new ClauseBuilder()
        .compose()
        .or([
          new ClauseBuilder().where(
            ModelsMapping.Tournament,
            "id",
            "Eq",
            addAddressPadding(tournamentId)
          ),
          new ClauseBuilder().where(
            ModelsMapping.Prize,
            "tournament_id",
            "Eq",
            addAddressPadding(tournamentId)
          ),
        ])
        .build()
    )
    .includeHashedKeys();

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useGetTournamentDetailsInListQuery = (
  tournamentIds: BigNumberish[]
) => {
  const query = new ToriiQueryBuilder()
    .withClause(
      KeysClause([ModelsMapping.Prize], [])
        .where(ModelsMapping.Prize, "tournament_id", "In", tournamentIds)
        .build()
    )
    .includeHashedKeys();

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
  const query = new ToriiQueryBuilder()
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
            "entry_number",
            "Gt",
            0
          ),
        ])
        .build()
    )
    .withLimit(limit)
    .withOffset(offset)
    .includeHashedKeys();
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
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
  const query = new ToriiQueryBuilder()
    .withClause(
      KeysClause([ModelsMapping.Registration], [])
        .where(ModelsMapping.Registration, "entry_number", "Gt", 0)
        .build()
    )
    .withLimit(limit)
    .withOffset(offset)
    .includeHashedKeys();
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useGetRegistrationsInTokenListQuery = ({
  tokenIds,
}: {
  tokenIds: BigNumberish[];
}) => {
  const query = new ToriiQueryBuilder()
    .withClause(
      KeysClause([ModelsMapping.Registration], [])
        .where(ModelsMapping.Registration, "game_token_id", "In", tokenIds)
        .build()
    )
    .includeHashedKeys();

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
  const query = new ToriiQueryBuilder()
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
    .includeHashedKeys();

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
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
  const query = new ToriiQueryBuilder()
    .withClause(
      KeysClause([`${namespace}-Score`], [])
        .where(`${namespace}-Score`, "token_id", "In", gameIds)
        .build()
    )
    .includeHashedKeys();

  const sepoliaQuery = new ToriiQueryBuilder()
    .withClause(
      KeysClause([`ds-Score`], [])
        .where(`ds-Score`, "token_id", "In", gameIds)
        .build()
    )
    .includeHashedKeys();
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query: isSepolia ? sepoliaQuery : query,
  });
  return { entities, isLoading, refetch };
};

export const useGetGameMetadataInListQuery = ({
  namespace,
  gameIds,
  isSepolia,
}: {
  namespace: string;
  gameIds: BigNumberish[];
  isSepolia: boolean;
}) => {
  const query = new ToriiQueryBuilder()
    .withClause(
      KeysClause([`${namespace}-TokenMetadata`], [])
        .where(`${namespace}-TokenMetadata`, "token_id", "In", gameIds)
        .build()
    )
    .includeHashedKeys();

  const sepoliaQuery = new ToriiQueryBuilder()
    .withClause(
      KeysClause([`ds-TokenMetadata`], [])
        .where(`ds-TokenMetadata`, "token_id", "In", gameIds)
        .build()
    )
    .includeHashedKeys();
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query: isSepolia ? sepoliaQuery : query,
  });
  return { entities, isLoading, refetch };
};

export const useGetTournamentLeaderboardQuery = ({
  tournamentId,
  namespace,
  isSepolia,
  limit = 5,
  offset = 0,
}: {
  tournamentId: BigNumberish;
  namespace: string;
  isSepolia: boolean;
  limit?: number;
  offset?: number;
}) => {
  const scoreNamespace = isSepolia ? `ds-Score` : `${namespace}-Score`;

  const query = new ToriiQueryBuilder()
    .withClause(
      new ClauseBuilder()
        .compose()
        .and([
          // Get registrations for tournament
          new ClauseBuilder().where(
            ModelsMapping.Registration,
            "tournament_id",
            "Eq",
            addAddressPadding(tournamentId)
          ),
          new ClauseBuilder().where(
            ModelsMapping.Registration,
            "entry_number",
            "Gt",
            0
          ),
          // Join with scores
          new ClauseBuilder().where(
            scoreNamespace as `${string}-${string}`,
            "token_id",
            "Eq",
            "Registration.game_token_id"
          ),
        ])
        .build()
    )
    .addOrderBy(scoreNamespace, "score", "Desc")
    .withLimit(limit)
    .withOffset(offset)
    .includeHashedKeys();

  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
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
  const query = new ToriiQueryBuilder()
    .withClause(
      KeysClause([`${nameSpace}-GameCounter`], [])
        .where(`${nameSpace}-GameCounter`, "key", "Eq", addAddressPadding(key))
        .build()
    )
    .includeHashedKeys();
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
  const query = new ToriiQueryBuilder()
    .withClause(
      KeysClause(
        [`${namespace}-SettingsDetails`, `${namespace}-Settings`],
        []
      ).build()
    )
    .withEntityModels([`${namespace}-SettingsDetails`, `${namespace}-Settings`])
    .addOrderBy(`${namespace}-SettingsDetails`, "id", "Asc")
    .includeHashedKeys();
  const { entities, isLoading, refetch } = useSdkGetEntities({
    query,
  });
  return { entities, isLoading, refetch };
};

export const useSubscribeTournamentsQuery = () => {
  const query = new ToriiQueryBuilder()
    .withClause(KeysClause([ModelsMapping.Tournament], [undefined]).build())
    .includeHashedKeys();
  const { entities, isSubscribed } = useSdkSubscribeEntities({
    query,
  });
  return { entities, isSubscribed };
};

export const useSubscribeTokensQuery = () => {
  const query = new ToriiQueryBuilder()
    .withClause(KeysClause([ModelsMapping.Token], [undefined]).build())
    .withEntityModels([ModelsMapping.Token])
    .includeHashedKeys();
  const { entities, isSubscribed } = useSdkSubscribeEntities({
    query,
  });
  return { entities, isSubscribed };
};

export const useSubscribeEntriesQuery = () => {
  const query = new ToriiQueryBuilder()
    .withClause(
      KeysClause(
        [ModelsMapping.EntryCount, ModelsMapping.Registration],
        [undefined]
      ).build()
    )
    .includeHashedKeys();
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
  const query = new ToriiQueryBuilder()
    .withClause(
      KeysClause(
        [`${nameSpace}-Game`, `${nameSpace}-TokenMetadata`],
        [undefined]
      ).build()
    )
    .withEntityModels([`${nameSpace}-Game`, `${nameSpace}-TokenMetadata`])
    .includeHashedKeys();
  const sepoliaQuery = new ToriiQueryBuilder()
    .withClause(
      KeysClause([`ds-Game`, `ds-TokenMetadata`], [undefined]).build()
    )
    .withEntityModels([`ds-Game`, `ds-TokenMetadata`])
    .includeHashedKeys();
  const { entities, isSubscribed } = useSdkSubscribeEntities({
    query: isSepolia ? sepoliaQuery : query,
  });
  return { entities, isSubscribed };
};
