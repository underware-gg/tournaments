import { useSqlExecute } from "@/lib/dojo/hooks/useSqlExecute";
import { useMemo } from "react";

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
  return { data: data, loading, error };
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
  return { data: data, loading, error };
};
