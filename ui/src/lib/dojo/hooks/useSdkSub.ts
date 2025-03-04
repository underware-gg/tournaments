import { useEffect, useMemo, useState } from "react";
import { BigNumberish } from "starknet";
import { SubscriptionQueryType, ParsedEntity } from "@dojoengine/sdk";
import { useDojo } from "@/context/dojo";
import { SchemaType } from "@/generated/models.gen";
import { useDojoStore } from "@/dojo/hooks/useDojoStore";
import { NAMESPACE } from "@/lib/constants";

export type TournamentSubQuery = SubscriptionQueryType<SchemaType>;

export type EntityResult = {
  entityId: BigNumberish;
} & Partial<SchemaType[typeof NAMESPACE]>;

export type UseSdkSubEntitiesResult = {
  entities: EntityResult[] | null;
  isSubscribed: boolean;
};

export type UseSdkSubEntitiesProps = {
  query: any;
  logging?: boolean;
  enabled?: boolean;
};

export const useSdkSubscribeEntities = ({
  query,
  enabled = true,
}: UseSdkSubEntitiesProps): UseSdkSubEntitiesResult => {
  const { sdk, nameSpace } = useDojo();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [entities, setEntities] = useState<EntityResult[] | null>(null);
  const state = useDojoStore.getState();

  const memoizedQuery = useMemo(() => query, [JSON.stringify(query)]);

  useEffect(() => {
    let _unsubscribe: (() => void) | undefined;

    const _subscribe = async () => {
      console.log(memoizedQuery);
      const [_initialEntities, subscription] = await sdk.subscribeEntityQuery({
        query: memoizedQuery,
        callback: (response) => {
          if (response.error) {
            console.error(
              "useSdkSubscribeEntities() error:",
              response.error.message
            );
          } else if (
            response.data &&
            (response.data[0] as Partial<ParsedEntity<SchemaType>>).entityId !==
              "0x0"
          ) {
            console.log(
              "useSdkSubscribeEntities() response.data:",
              response.data
            );
            response.data.forEach((entity) => {
              state.updateEntity(entity as Partial<ParsedEntity<SchemaType>>);
            });
            setEntities(
              response.data.map(
                (e: any) =>
                  ({
                    entityId: e.entityId,
                    ...e.models[nameSpace],
                  } as EntityResult)
              )
            );
          }
        },
      });
      setIsSubscribed(true);
      _unsubscribe = () => subscription.cancel();
    };

    setIsSubscribed(false);
    if (enabled) {
      _subscribe();
    } else {
      setEntities(null);
    }

    // umnount
    return () => {
      setIsSubscribed(false);
      _unsubscribe?.();
      _unsubscribe = undefined;
    };
  }, [sdk, memoizedQuery, enabled]);

  return {
    entities,
    isSubscribed,
  };
};
