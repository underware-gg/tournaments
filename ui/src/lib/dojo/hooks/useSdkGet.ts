import { useCallback, useEffect, useState, useMemo } from "react";
import { BigNumberish } from "starknet";
import { QueryType, ParsedEntity } from "@dojoengine/sdk";
import { useDojo } from "@/context/dojo";
import { SchemaType } from "@/generated/models.gen";
import { useDojoStore } from "@/dojo/hooks/useDojoStore";
import { OrderBy } from "@dojoengine/torii-wasm";

export type TournamentGetQuery = QueryType<SchemaType>;

export type EntityResult = {
  entityId: BigNumberish;
} & Partial<SchemaType["tournament"]>;

export type UseSdkGetEntitiesResult = {
  entities: EntityResult[] | null;
  isLoading: boolean;
  refetch: () => void;
};
export type UseSdkGetEntityResult = {
  isLoading: boolean;
  refetch: () => void;
};

export type UseSdkGetEntitiesProps = {
  query: any;
  limit?: number;
  offset?: number;
  orderBy?: OrderBy[];
};

export const useSdkGetEntities = ({
  query,
  limit = 100,
  offset = 0,
  orderBy = [],
}: UseSdkGetEntitiesProps): UseSdkGetEntitiesResult => {
  const { sdk, nameSpace } = useDojo();

  const [isLoading, setIsLoading] = useState(false);
  const [entities, setEntities] = useState<EntityResult[] | null>(null);
  const { setEntities: setStoreEntities } = useDojoStore.getState();

  const orderByKey = useMemo(() => JSON.stringify(orderBy), [orderBy]);

  const fetchEntities = useCallback(async () => {
    setIsLoading(true);
    console.log("orderBy", orderBy);
    console.log("query", query);
    try {
      await sdk.getEntities({
        query,
        callback: (resp) => {
          if (resp.error) {
            console.error("useSdkGetEntities() error:", resp.error.message);
            return;
          }
          if (resp.data) {
            console.log(resp.data);
            setStoreEntities(resp.data as ParsedEntity<SchemaType>[]);
            setEntities(
              resp.data.map(
                (e: any) =>
                  ({
                    entityId: e.entityId,
                    ...e.models[nameSpace],
                  } as any)
              )
            );
          }
        },
        orderBy,
        limit,
        offset,
      });
    } catch (error) {
      console.error("useSdkGetEntities() exception:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sdk, query, orderByKey, limit, offset]);

  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);

  return {
    entities,
    isLoading,
    refetch: fetchEntities,
  };
};
