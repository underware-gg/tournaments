import { useSqlExecute } from "@/lib/dojo/hooks/useSqlExecute";
import { useMemo } from "react";
import { addAddressPadding, BigNumberish } from "starknet";

export const useGetGameNamespaces = () => {
  const query = useMemo(
    () => `
    SELECT namespace 
    FROM models 
    WHERE name = 'GameMetadata'
  `,
    []
  );
  const { data, loading, error } = useSqlExecute(query);
  return { data, loading, error };
};

export const useGetGamesMetadata = ({
  gameNamespaces,
}: {
  gameNamespaces: string[];
}) => {
  const query = useMemo(() => {
    if (!gameNamespaces?.length) return null;

    return gameNamespaces
      .map((namespace) => `SELECT * FROM "${namespace}-GameMetadata"`)
      .join("\nUNION ALL\n");
  }, [gameNamespaces]);

  const { data, loading, error } = useSqlExecute(query);
  return { data, loading, error };
};

export const useGetTournamentsCount = ({
  namespace,
}: {
  namespace: string;
}) => {
  const query = useMemo(
    () => `
    SELECT COUNT(*) as count 
    FROM '${namespace}-Tournament' m
  `,
    [namespace]
  );
  const { data, loading, error } = useSqlExecute(query);
  return { data: data?.[0]?.count, loading, error };
};

export const useGetUpcomingTournamentsCount = ({
  namespace,
  currentTime,
}: {
  namespace: string;
  currentTime: string;
}) => {
  const query = useMemo(
    () => `
    SELECT COUNT(*) as count 
    FROM '${namespace}-Tournament' m
    WHERE m.'schedule.game.start' > '${currentTime}'
  `,
    [namespace, currentTime]
  );
  const { data, loading, error } = useSqlExecute(query);
  return { data: data?.[0]?.count, loading, error };
};

export const useGetLiveTournamentsCount = ({
  namespace,
  currentTime,
}: {
  namespace: string;
  currentTime: string;
}) => {
  const query = useMemo(
    () => `
    SELECT COUNT(*) as count 
    FROM '${namespace}-Tournament' m
    WHERE (m.'schedule.game.start' <= '${currentTime}' AND m.'schedule.game.end' > '${currentTime}')
  `,
    [namespace, currentTime]
  );
  const { data, loading, error } = useSqlExecute(query);
  return { data: data?.[0]?.count, loading, error };
};

export const useGetEndedTournamentsCount = ({
  namespace,
  currentTime,
}: {
  namespace: string;
  currentTime: string;
}) => {
  const query = useMemo(
    () => `
    SELECT COUNT(*) as count 
    FROM '${namespace}-Tournament' m
    WHERE m.'schedule.game.end' <= '${currentTime}'
  `,
    [namespace, currentTime]
  );
  const { data, loading, error } = useSqlExecute(query);
  return { data: data?.[0]?.count, loading, error };
};

const getTournamentWhereClause = (status: string, currentTime: string) => {
  switch (status) {
    case "upcoming":
      return `WHERE t.'schedule.game.start' > '${currentTime}'`;
    case "live":
      return `WHERE t.'schedule.game.start' <= '${currentTime}' AND t.'schedule.game.end' > '${currentTime}'`;
    case "ended":
      return `WHERE t.'schedule.game.end' <= '${currentTime}'`;
    case "all":
      return "";
  }
};

const getSortClause = (sort: string) => {
  switch (sort) {
    case "start_time":
      return `ORDER BY t.'schedule.game.start' ASC`;
    case "end_time":
      return `ORDER BY t.'schedule.game.end' ASC`;
    case "pot_size":
      // You might need to adjust this based on your actual prize calculation
      return `ORDER BY entry_count DESC`;
    case "players":
      return `ORDER BY entry_count DESC`;
    case "winners":
      return `ORDER BY t.'winners_count' DESC`;
    default:
      return `ORDER BY t.'schedule.game.start' ASC`;
  }
};

export const useGetTournaments = ({
  namespace,
  currentTime,
  gameFilters,
  status,
  sortBy = "start_time",
  offset = 0,
  limit = 5,
  active = false,
}: {
  namespace: string;
  gameFilters: string[];
  status: string;
  currentTime?: string;
  sortBy?: string;
  offset?: number;
  limit?: number;
  active?: boolean;
}) => {
  const query = useMemo(
    () =>
      active
        ? `
    SELECT 
    t.*,
    CASE 
        WHEN COUNT(p.tournament_id) = 0 THEN NULL
        ELSE GROUP_CONCAT(
            json_object(
                'prizeId', p.id,
                'position', p.payout_position,
                'tokenType', p.token_type,
                'tokenAddress', p.token_address,
                'amount', CASE 
                    WHEN p.token_type = 'erc20' THEN p."token_type.erc20.amount"
                    WHEN p.token_type = 'erc721' THEN p."token_type.erc721.id"
                    ELSE NULL 
                END,
                'isValid', CASE 
                    WHEN p.token_type = 'erc20' AND p."token_type.erc20.amount" IS NOT NULL THEN 1
                    WHEN p.token_type = 'erc721' AND p."token_type.erc721.id" IS NOT NULL THEN 1
                    ELSE 0
                END
            ),
            '|'
        )
    END as prizes,
    COALESCE(e.count, 0) as entry_count
    FROM '${namespace}-Tournament' as t
    LEFT JOIN '${namespace}-Prize' p ON t.id = p.tournament_id
    LEFT JOIN '${namespace}-EntryCount' e ON t.id = e.tournament_id
    ${getTournamentWhereClause(status, currentTime ?? "")}
        ${
          gameFilters.length > 0
            ? `AND t.'game_config.address' IN (${gameFilters
                .map((address) => `'${address}'`)
                .join(",")})`
            : ""
        }
    GROUP BY t.id
    ${getSortClause(sortBy)}
    LIMIT ${limit}
    OFFSET ${offset}
  `
        : null,
    [namespace, currentTime, gameFilters, status, sortBy, offset, limit, active]
  );
  const { data, loading, error, refetch } = useSqlExecute(query);
  return { data, loading, error, refetch };
};

export const useGetMyTournaments = ({
  namespace,
  address,
  gameAddresses,
  gameFilters,
  active = false,
  offset = 0,
  limit = 5,
}: {
  namespace: string;
  address: string | null;
  gameAddresses: string[];
  gameFilters: string[];
  active?: boolean;
  offset?: number;
  limit?: number;
}) => {
  const gameAddressesKey = useMemo(
    () => JSON.stringify(gameAddresses),
    [gameAddresses]
  );
  const gameFiltersKey = useMemo(
    () => JSON.stringify(gameFilters),
    [gameFilters]
  );
  const query = useMemo(
    () =>
      address && active
        ? `
    WITH account_tokens AS (
      SELECT 
        token_id,
        '0x' || substr('000000000000000000000000' || substr(substr(token_id, 1, instr(token_id, ':') - 1), 3), -64) as parsed_game_address,
        substr(token_id, instr(token_id, ':') + 1) as parsed_token_id
      FROM token_balances
      WHERE account_address = "${address}" 
        AND contract_address IN (${gameAddresses
          .map((addr) => `"${addr}"`)
          .join(",")})
    ),
    registered_tournaments AS (
      SELECT DISTINCT r.tournament_id, a.parsed_game_address
      FROM '${namespace}-Registration' r
      JOIN account_tokens a ON r.game_token_id = a.parsed_token_id
    )
    SELECT 
      t.*,
      CASE 
        WHEN COUNT(p.tournament_id) = 0 THEN NULL
        ELSE GROUP_CONCAT(
          json_object(
            'prizeId', p.id,
            'position', p.payout_position,
            'tokenType', p.token_type,
            'tokenAddress', p.token_address,
            'amount', CASE 
              WHEN p.token_type = 'erc20' THEN p."token_type.erc20.amount"
              WHEN p.token_type = 'erc721' THEN p."token_type.erc721.id"
              ELSE NULL 
            END,
            'isValid', CASE 
              WHEN p.token_type = 'erc20' AND p."token_type.erc20.amount" IS NOT NULL THEN 1
              WHEN p.token_type = 'erc721' AND p."token_type.erc721.id" IS NOT NULL THEN 1
              ELSE 0
            END
          ),
          '|'
        )
      END as prizes,
      COALESCE(e.count, 0) as entry_count
    FROM registered_tournaments rt
    JOIN '${namespace}-Tournament' t 
      ON rt.tournament_id = t.id
        AND rt.parsed_game_address = t.'game_config.address'
    LEFT JOIN '${namespace}-Prize' p ON t.id = p.tournament_id
    LEFT JOIN '${namespace}-EntryCount' e ON t.id = e.tournament_id
    ${
      gameFilters.length > 0
        ? `WHERE t.'game_config.address' IN (${gameFilters
            .map((address) => `'${address}'`)
            .join(",")})`
        : ""
    }
    GROUP BY t.id
    ORDER BY t.'schedule.game.start' ASC
    LIMIT ${limit}
    OFFSET ${offset}
    `
        : null,
    [
      namespace,
      address,
      gameAddressesKey,
      gameFiltersKey,
      offset,
      limit,
      active,
    ]
  );
  const { data, loading, error, refetch } = useSqlExecute(query);
  return { data, loading, error, refetch };
};

export const useGetTokenOwnerQuery = (
  tokenAddress: string,
  tokenIds: string[]
) => {
  const tokenIdsKey = useMemo(() => JSON.stringify(tokenIds), [tokenIds]);
  const query = useMemo(
    () =>
      tokenIds.length > 0
        ? `
    SELECT account_address
    FROM [token_balances]
    WHERE token_id IN (
      ${tokenIds.map((id) => `"${tokenAddress}:${id}"`).join(",")}
    )
  `
        : null,
    [tokenAddress, tokenIdsKey]
  );
  const { data, loading, error } = useSqlExecute(query);
  return { data, loading, error };
};

export const useGetAccountTokenIds = (
  address: string | null,
  gameAddresses: string[]
) => {
  const gameAddressesKey = useMemo(
    () => JSON.stringify(gameAddresses),
    [gameAddresses]
  );
  const query = useMemo(
    () =>
      address
        ? `
    SELECT tb.*, t.metadata
    FROM token_balances tb
    LEFT JOIN tokens t ON tb.token_id = t.id
    WHERE (tb.account_address = "${address}" AND tb.contract_address IN (${gameAddresses
            .map((address) => `"${address}"`)
            .join(",")}));
  `
        : null,
    [address, gameAddressesKey]
  );
  const { data, loading, error } = useSqlExecute(query);
  return { data, loading, error };
};

export const useGetTournamentEntrants = ({
  namespace,
  tournamentId,
  gameNamespace,
  gameAddress,
  offset = 0,
  limit = 5,
}: {
  namespace: string;
  tournamentId: BigNumberish;
  gameNamespace: string;
  gameAddress: string;
  offset?: number;
  limit?: number;
}) => {
  const isValidInput = useMemo(() => {
    return Boolean(
      namespace &&
        tournamentId &&
        gameNamespace &&
        typeof offset === "number" &&
        typeof limit === "number"
    );
  }, [namespace, tournamentId, gameNamespace, offset, limit]);

  const query = useMemo(
    () =>
      isValidInput
        ? `
    SELECT 
    r.tournament_id,
    r.entry_number,
    r.game_token_id,
    r.has_submitted,
    m.player_name,
    m."lifecycle.mint",
    t.account_address
    FROM '${namespace}-Registration' r
    LEFT JOIN '${gameNamespace}-TokenMetadata' m 
      ON r.game_token_id = m.token_id
    LEFT JOIN token_balances t 
      ON (${gameAddress} || ':' || r.game_token_id) = t.token_id
    WHERE r.tournament_id = "${addAddressPadding(tournamentId)}"
    ORDER BY r.entry_number DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `
        : null,
    [isValidInput, namespace, tournamentId, offset, limit, gameNamespace]
  );
  const { data, loading, error, refetch } = useSqlExecute(query);
  return { data, loading, error, refetch };
};

export const useGetTournamentLeaderboard = ({
  namespace,
  tournamentId,
  gameNamespace,
  gameScoreModel,
  gameScoreAttribute,
  gameAddress,
  offset = 0,
  limit = 5,
}: {
  namespace: string;
  tournamentId: BigNumberish;
  gameNamespace: string;
  gameScoreModel: string;
  gameScoreAttribute: string;
  gameAddress: string;
  offset?: number;
  limit?: number;
}) => {
  const isValidInput = useMemo(() => {
    return Boolean(
      namespace &&
        tournamentId &&
        gameNamespace &&
        gameScoreModel &&
        gameScoreAttribute &&
        typeof offset === "number" &&
        typeof limit === "number"
    );
  }, [
    namespace,
    tournamentId,
    gameNamespace,
    gameScoreModel,
    gameScoreAttribute,
    offset,
    limit,
  ]);

  const query = useMemo(
    () =>
      isValidInput
        ? `
    SELECT 
    r.tournament_id,
    r.entry_number,
    r.game_token_id,
    r.has_submitted,
    COALESCE(s.${gameScoreAttribute}, 0) as score,
    m.player_name,
    m."lifecycle.mint",
    t2.metadata,
    '${gameAddress}' || ':' || r.game_token_id as token_balance_id,
    t.account_address
    FROM '${namespace}-Registration' r
    LEFT JOIN '${gameNamespace}-${gameScoreModel}' s 
      ON r.game_token_id = s.game_id
    LEFT JOIN '${gameNamespace}-TokenMetadata' m 
      ON r.game_token_id = m.token_id
    LEFT JOIN token_balances t 
      ON token_balance_id = t.token_id
    LEFT JOIN tokens t2 ON t.token_id = t2.id
    WHERE r.tournament_id = "${addAddressPadding(tournamentId)}"
    ORDER BY s.${gameScoreAttribute} DESC, r.entry_number ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `
        : null,
    [
      isValidInput,
      namespace,
      tournamentId,
      offset,
      limit,
      gameNamespace,
      gameScoreModel,
      gameScoreAttribute,
    ]
  );
  const { data, loading, error } = useSqlExecute(query);
  return { data, loading, error };
};
