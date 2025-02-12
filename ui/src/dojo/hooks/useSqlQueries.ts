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
