import { useCallback, useEffect, useState, useRef } from "react";
import { BigNumberish } from "starknet";
import { QueryType } from "@dojoengine/sdk";
import { useDojo } from "@/context/dojo";
import { SchemaType } from "@/generated/models.gen";
import { useDojoStore } from "@/dojo/hooks/useDojoStore";
import { OrderBy } from "@dojoengine/torii-wasm";

export type TournamentGetQuery = QueryType<SchemaType>;

export type EntityResult = {
  entityId: BigNumberish;
} & Partial<SchemaType["tournaments"]>;

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
  enabled?: boolean;
};

export const useSdkGetEntities = ({
  query,
  limit = 100,
  offset = 0,
  orderBy = [],
  enabled = true,
}: UseSdkGetEntitiesProps): UseSdkGetEntitiesResult => {
  const { sdk, nameSpace } = useDojo();

  const [isLoading, setIsLoading] = useState(false);
  const [entities, setEntities] = useState<EntityResult[] | null>(null);
  const { setEntities: setStoreEntities } = useDojoStore.getState();

  // Add a mount ref
  const isMounted = useRef(false);

  const fetchEntities = useCallback(async () => {
    try {
      console.log(query);
      setIsLoading(true);
      const response = await sdk.getEntities({
        query,
      });
      console.log(response);
    } catch (error) {
      console.error("useSdkGetEntities() exception:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sdk, query, orderBy, limit, offset, nameSpace, setStoreEntities]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;

      if (enabled) {
        fetchEntities();
      } else {
        setIsLoading(false);
      }
    }
  }, [enabled, fetchEntities]);

  return {
    entities,
    isLoading,
    refetch: fetchEntities,
  };
};

//
// Single Entity fetch
// (use only when fetching with a keys)
export const useSdkGetEntity = (
  props: UseSdkGetEntitiesProps
): UseSdkGetEntityResult => {
  const { isLoading, refetch } = useSdkGetEntities({
    ...props,
    limit: 1,
  });
  return {
    isLoading,
    refetch,
  };
};
