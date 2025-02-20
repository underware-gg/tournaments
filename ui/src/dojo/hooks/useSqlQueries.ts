import { useSqlExecute } from "@/lib/dojo/hooks/useSqlExecute";
import { useMemo } from "react";
import { addAddressPadding, BigNumberish } from "starknet";

export const useGetUpcomingTournamentsCount = (currentTime: string) => {
  const query = useMemo(
    () => `
    SELECT COUNT(*) as count 
    FROM 'tournaments-Tournament' m
    WHERE m.'schedule.game.start' > '${currentTime}'
  `,
    [currentTime]
  );
  const { data, loading, error } = useSqlExecute(query);
  return { data: data?.[0]?.count, loading, error };
};

export const useGetLiveTournamentsCount = (currentTime: string) => {
  const query = useMemo(
    () => `
    SELECT COUNT(*) as count 
    FROM 'tournaments-Tournament' m
    WHERE (m.'schedule.game.start' <= '${currentTime}' AND m.'schedule.game.end' > '${currentTime}')
  `,
    [currentTime]
  );
  const { data, loading, error } = useSqlExecute(query);
  return { data: data?.[0]?.count, loading, error };
};

export const useGetEndedTournamentsCount = (currentTime: string) => {
  const query = useMemo(
    () => `
    SELECT COUNT(*) as count 
    FROM 'tournaments-Tournament' m
    WHERE m.'schedule.game.end' <= '${currentTime}'
  `,
    [currentTime]
  );
  const { data, loading, error } = useSqlExecute(query);
  return { data: data?.[0]?.count, loading, error };
};

export const useGetUpcomingTournaments = ({
  currentTime,
  offset = 0,
  limit = 5,
}: {
  currentTime: string;
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
    END as prizes
    FROM "tournaments-Tournament" as t
    LEFT JOIN "tournaments-Prize" p ON t.id = p.tournament_id
    WHERE t.'schedule.game.start' > '${currentTime}'
    GROUP BY t.id
    ORDER BY t.'schedule.game.start' ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `,
    [currentTime, offset, limit]
  );
  const { data, loading, error } = useSqlExecute(query);
  return { data, loading, error };
};

export const useGetTokenOwnerQuery = (
  tokenAddress: string,
  tokenIds: string[]
) => {
  const tokenIdsKey = useMemo(() => JSON.stringify(tokenIds), [tokenIds]);
  const query = useMemo(
    () => `
    SELECT account_address
    FROM [token_balances]
    WHERE token_id IN (
      ${tokenIds.map((id) => `"${tokenAddress}:${id}"`).join(",")}
    )
  `,
    [tokenAddress, tokenIdsKey]
  );
  const { data, loading, error } = useSqlExecute(query);
  return { data, loading, error };
};

export const useGetAccountTokenIds = (
  address: string,
  gameAddresses: string[]
) => {
  const gameAddressesKey = useMemo(
    () => JSON.stringify(gameAddresses),
    [gameAddresses]
  );
  const query = useMemo(
    () => `
    SELECT *
    FROM [token_balances]
    WHERE (account_address = "${address}" AND contract_address IN (${gameAddresses
      .map((address) => `"${address}"`)
      .join(",")}))
    LIMIT 1000;
  `,
    [address, gameAddressesKey]
  );
  const { data, loading, error } = useSqlExecute(query);
  return { data, loading, error };
};

export const useGetTournamentEntrants = ({
  tournamentId,
  gameNamespace,
  isSepolia = false,
  offset = 0,
  limit = 5,
}: {
  tournamentId: BigNumberish;
  gameNamespace: string;
  isSepolia?: boolean;
  offset?: number;
  limit?: number;
}) => {
  const query = useMemo(
    () => `
    SELECT 
    r.tournament_id,
    r.entry_number,
    r.game_token_id,
    r.has_submitted,
    m.player_name,
    m."lifecycle.mint"
    FROM "tournaments-Registration" r
    LEFT JOIN "${gameNamespace}-TokenMetadata" m ON r.game_token_id = m.token_id
    WHERE r.tournament_id = "${addAddressPadding(tournamentId)}"
    ORDER BY r.entry_number DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `,
    [tournamentId, offset, limit, gameNamespace]
  );
  const sepoliaQuery = useMemo(
    () => `
    SELECT 
    r.tournament_id,
    r.entry_number,
    r.game_token_id,
    r.has_submitted,
    m.player_name,
    m."lifecycle.mint"
    FROM "tournaments-Registration" r
    LEFT JOIN "ds-TokenMetadata" m ON r.game_token_id = m.token_id
    WHERE r.tournament_id = "${addAddressPadding(tournamentId)}"
    ORDER BY r.entry_number DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `,
    [tournamentId, offset, limit]
  );
  const { data, loading, error } = useSqlExecute(
    isSepolia ? sepoliaQuery : query
  );
  return { data, loading, error };
};

export const useGetTournamentLeaderboard = ({
  tournamentId,
  gameNamespace,
  isSepolia = false,
  offset = 0,
  limit = 5,
}: {
  tournamentId: BigNumberish;
  gameNamespace: string;
  isSepolia?: boolean;
  offset?: number;
  limit?: number;
}) => {
  const query = useMemo(
    () => `
    SELECT 
    r.tournament_id,
    r.entry_number,
    r.game_token_id,
    r.has_submitted,
    COALESCE(s.score, 0) as score,
    m.player_name,
    m."lifecycle.mint"
    FROM "tournaments-Registration" r
    LEFT JOIN "${gameNamespace}-Score" s ON r.game_token_id = s.game_id
    LEFT JOIN "${gameNamespace}-TokenMetadata" m ON r.game_token_id = m.token_id
    WHERE r.tournament_id = "${addAddressPadding(tournamentId)}"
    ORDER BY s.score DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `,
    [tournamentId, offset, limit, gameNamespace]
  );
  const sepoliaQuery = useMemo(
    () => `
    SELECT 
    r.tournament_id,
    r.entry_number,
    r.game_token_id,
    r.has_submitted,
    COALESCE(s.hero_xp, 0) as score,
    m.player_name,
    m."lifecycle.mint"
    FROM "tournaments-Registration" r
    LEFT JOIN "ds-Game" s ON r.game_token_id = s.game_id
    LEFT JOIN "ds-TokenMetadata" m ON r.game_token_id = m.token_id
    WHERE r.tournament_id = "${addAddressPadding(tournamentId)}"
    ORDER BY s.hero_xp DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `,
    [tournamentId, offset, limit]
  );
  const { data, loading, error } = useSqlExecute(
    isSepolia ? sepoliaQuery : query
  );
  return { data, loading, error };
};
