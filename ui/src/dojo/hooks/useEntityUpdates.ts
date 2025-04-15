import { useDojoStore } from "@/dojo/hooks/useDojoStore";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "@/context/dojo";
import useModel from "@/dojo/hooks/useModel";
import { TOURNAMENT_VERSION_KEY } from "@/lib/constants";
import { useMemo } from "react";
import { getModelsMapping } from "@/generated/models.gen";
import { PlatformMetrics } from "@/generated/models.gen";

export const useEntityUpdates = () => {
  const { namespace } = useDojo();
  const state = useDojoStore((state) => state);

  const platformMetricsEntityId = useMemo(
    () => getEntityIdFromKeys([BigInt(TOURNAMENT_VERSION_KEY)]),
    []
  );

  const platformMetricsModel = useModel(
    platformMetricsEntityId,
    getModelsMapping(namespace).PlatformMetrics
  ) as unknown as PlatformMetrics;

  const totalTournaments = platformMetricsModel?.total_tournaments ?? 0;

  const waitForTournamentCreation = async () => {
    await state.waitForEntityChange(platformMetricsEntityId, (entity) => {
      return (
        entity?.models?.[namespace]?.PlatformMetrics?.total_tournaments ==
        Number(totalTournaments) + 1
      );
    });
  };

  return {
    waitForTournamentCreation,
  };
};
