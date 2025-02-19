import { useState, useEffect } from "react";
import { useDojo } from "@/context/dojo";

export function useSqlExecute(query: string) {
  const { selectedChainConfig } = useDojo();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(
          `${selectedChainConfig.toriiUrl}/sql?query=${encodedQuery}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to execute query");
        }

        setData(result);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return {
    data,
    loading,
    error,
  };
}
