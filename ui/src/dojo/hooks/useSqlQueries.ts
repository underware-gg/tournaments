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

export const useGetTournaments = ({
  namespace,
  gameFilters,
  offset = 0,
  limit = 5,
}: {
  namespace: string;
  gameFilters: string[];
  offset?: number;
  limit?: number;
}) => {
  const query = useMemo(
    () => `
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
  `,
    [namespace, gameFilters, offset, limit]
  );
  const { data, loading, error, refetch } = useSqlExecute(query);
  return { data, loading, error, refetch };
};

export const useGetUpcomingTournaments = ({
  namespace,
  currentTime,
  gameFilters,
  offset = 0,
  limit = 5,
}: {
  namespace: string;
  currentTime: string;
  gameFilters: string[];
  offset?: number;
  limit?: number;
}) => {
  const query = useMemo(
    () => `
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
    WHERE t.'schedule.game.start' > '${currentTime}'
        ${
          gameFilters.length > 0
            ? `AND t.'game_config.address' IN (${gameFilters
                .map((address) => `'${address}'`)
                .join(",")})`
            : ""
        }
    GROUP BY t.id
    ORDER BY t.'schedule.game.start' ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `,
    [namespace, currentTime, gameFilters, offset, limit]
  );
  const { data, loading, error, refetch } = useSqlExecute(query);
  return { data, loading, error, refetch };
};

export const useGetLiveTournaments = ({
  namespace,
  currentTime,
  gameFilters,
  offset = 0,
  limit = 5,
}: {
  namespace: string;
  currentTime: string;
  gameFilters: string[];
  offset?: number;
  limit?: number;
}) => {
  const query = useMemo(
    () => `
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
    WHERE t.'schedule.game.start' <= '${currentTime}' AND t.'schedule.game.end' > '${currentTime}'
        ${
          gameFilters.length > 0
            ? `AND t.'game_config.address' IN (${gameFilters
                .map((address) => `'${address}'`)
                .join(",")})`
            : ""
        }
    GROUP BY t.id
    ORDER BY t.'schedule.game.start' ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `,
    [namespace, currentTime, gameFilters, offset, limit]
  );
  const { data, loading, error, refetch } = useSqlExecute(query);
  return { data, loading, error, refetch };
};

export const useGetEndedTournaments = ({
  namespace,
  currentTime,
  gameFilters,
  offset = 0,
  limit = 5,
}: {
  namespace: string;
  currentTime: string;
  gameFilters: string[];
  offset?: number;
  limit?: number;
}) => {
  const query = useMemo(
    () => `
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
    WHERE t.'schedule.game.end' <= '${currentTime}'
        ${
          gameFilters.length > 0
            ? `AND t.'game_config.address' IN (${gameFilters
                .map((address) => `'${address}'`)
                .join(",")})`
            : ""
        }
    GROUP BY t.id
    ORDER BY t.'schedule.game.start' ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `,
    [namespace, currentTime, gameFilters, offset, limit]
  );
  const { data, loading, error, refetch } = useSqlExecute(query);
  return { data, loading, error, refetch };
};

export const useGetTournamentsInList = ({
  namespace,
  tournamentIds,
  gameFilters,
  offset = 0,
  limit = 5,
}: {
  namespace: string;
  tournamentIds: string[];
  gameFilters: string[];
  offset?: number;
  limit?: number;
}) => {
  const query = useMemo(
    () => `
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
    WHERE t.id IN (${tournamentIds.map((id) => `"${id}"`).join(",")})
        ${
          gameFilters.length > 0
            ? `AND t.'game_config.address' IN (${gameFilters
                .map((address) => `'${address}'`)
                .join(",")})`
            : ""
        }
    GROUP BY t.id
    ORDER BY t.'schedule.game.start' ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `,
    [namespace, tournamentIds, gameFilters, offset, limit]
  );
  const { data, loading, error, refetch } = useSqlExecute(query);
  return { data, loading, error, refetch };
};

export const useGetMyTournaments = ({
  namespace,
  address,
  gameAddresses,
  gameFilters,
  offset = 0,
  limit = 5,
}: {
  namespace: string;
  address: string | null;
  gameAddresses: string[];
  gameFilters: string[];
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
      address
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
    [namespace, address, gameAddressesKey, gameFiltersKey, offset, limit]
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
    SELECT *
    FROM [token_balances]
    WHERE (account_address = "${address}" AND contract_address IN (${gameAddresses
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
  isDS = false,
  offset = 0,
  limit = 5,
}: {
  namespace: string;
  tournamentId: BigNumberish;
  gameNamespace: string;
  gameAddress: string;
  isDS?: boolean;
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

  const dsQuery = useMemo(
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
    '${gameAddress}' || ':' || r.game_token_id as token_balance_id,
    t.account_address
    FROM '${namespace}-Registration' r
    LEFT JOIN '${gameNamespace}-TokenMetadata' m 
      ON r.game_token_id = m.token_id
    LEFT JOIN token_balances t 
      ON token_balance_id = t.token_id
    WHERE r.tournament_id = "${addAddressPadding(tournamentId)}"
    ORDER BY r.entry_number DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `
        : null,
    [isValidInput, namespace, tournamentId, offset, limit, gameNamespace]
  );
  const { data, loading, error, refetch } = useSqlExecute(
    isDS ? dsQuery : query
  );
  return { data, loading, error, refetch };
};

export const useGetTournamentLeaderboard = ({
  namespace,
  tournamentId,
  gameNamespace,
  gameAddress,
  isDS = false,
  offset = 0,
  limit = 5,
}: {
  namespace: string;
  tournamentId: BigNumberish;
  gameNamespace: string;
  gameAddress: string;
  isDS?: boolean;
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
    COALESCE(s.score, 0) as score,
    m.player_name,
    m."lifecycle.mint",
    '${gameAddress}' || ':' || r.game_token_id as token_balance_id,
    t.account_address
    FROM '${namespace}-Registration' r
    LEFT JOIN '${gameNamespace}-Score' s 
      ON r.game_token_id = s.game_id
    LEFT JOIN '${gameNamespace}-TokenMetadata' m 
      ON r.game_token_id = m.token_id
    LEFT JOIN token_balances t 
      ON token_balance_id = t.token_id
    WHERE r.tournament_id = "${addAddressPadding(tournamentId)}"
    ORDER BY s.score DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `
        : null,
    [isValidInput, namespace, tournamentId, offset, limit, gameNamespace]
  );
  const dsQuery = useMemo(
    () =>
      isValidInput
        ? `
    SELECT 
    r.tournament_id,
    r.entry_number,
    r.game_token_id,
    r.has_submitted,
    COALESCE(s.hero_xp, 0) as score,
    m.player_name,
    m."lifecycle.mint",
    '${gameAddress}' || ':' || r.game_token_id as token_balance_id,
    t.account_address
    FROM '${namespace}-Registration' r
    LEFT JOIN '${gameNamespace}-Game' s 
      ON r.game_token_id = s.game_id
    LEFT JOIN '${gameNamespace}-TokenMetadata' m 
      ON r.game_token_id = m.token_id
    LEFT JOIN token_balances t 
      ON token_balance_id = t.token_id
    WHERE r.tournament_id = "${addAddressPadding(tournamentId)}"
    ORDER BY s.hero_xp DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `
        : null,
    [isValidInput, namespace, tournamentId, offset, limit, gameNamespace]
  );
  const { data, loading, error } = useSqlExecute(isDS ? dsQuery : query);
  return { data, loading, error };
};
