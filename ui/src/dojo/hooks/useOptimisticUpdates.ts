import { BigNumberish, CairoOption } from "starknet";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojoStore } from "@/dojo/hooks/useDojoStore";
import { v4 as uuidv4 } from "uuid";
import { useDojo } from "@/context/dojo";
import { Tournament, Prize, TokenTypeEnum } from "@/generated/models.gen";
import Tournament from "@/containers/Tournament";

const applyModelUpdate = <T extends { [key: string]: any }>(
  draft: any,
  entityId: string,
  nameSpace: string,
  modelName: string,
  data: T
) => {
  if (!draft.entities[entityId]) {
    // Case 1: Entity doesn't exist
    draft.entities[entityId] = {
      entityId,
      models: {
        [nameSpace]: {
          [modelName]: data,
        },
      },
    };
  } else if (!draft.entities[entityId]?.models?.[nameSpace]?.[modelName]) {
    // Case 2: Model doesn't exist in entity
    draft.entities[entityId].models[nameSpace] = {
      ...draft.entities[entityId].models[nameSpace],
      [modelName]: data,
    };
  } else {
    // Case 3: Model exists, update it
    draft.entities[entityId].models[nameSpace][modelName] = {
      ...draft.entities[entityId].models[nameSpace][modelName],
      ...data,
    };
  }
};

export const useOptimisticUpdates = () => {
  const state = useDojoStore.getState();
  const { nameSpace } = useDojo();

  const applyTournamentEntryUpdate = (
    tournamentId: BigNumberish,
    newEntryCount: BigNumberish,
    newEntryAddressCount: BigNumberish,
    accountAddress?: string
  ) => {
    const entriesEntityId = getEntityIdFromKeys([BigInt(tournamentId)]);
    const entriesAddressEntityId = getEntityIdFromKeys([
      BigInt(tournamentId),
      BigInt(accountAddress ?? "0x0"),
    ]);

    const transactionId = uuidv4();

    state.applyOptimisticUpdate(transactionId, (draft) => {
      applyModelUpdate(draft, entriesEntityId, nameSpace, "TournamentEntries", {
        tournament_id: tournamentId,
        entry_count: newEntryCount,
      });
      applyModelUpdate(
        draft,
        entriesAddressEntityId,
        nameSpace,
        "TournamentEntriesAddress",
        {
          tournament_id: tournamentId,
          address: accountAddress,
          entry_count: newEntryCount,
        }
      );
    });

    const waitForEntityChanges = async () => {
      const entriesPromise = await state.waitForEntityChange(
        entriesEntityId,
        (entity) => {
          return (
            entity?.models?.[nameSpace]?.TournamentEntries?.entry_count ==
            newEntryCount
          );
        }
      );

      const addressPromise = await state.waitForEntityChange(
        entriesAddressEntityId,
        (entity) => {
          return (
            entity?.models?.[nameSpace]?.TournamentEntriesAddress
              ?.entry_count == newEntryAddressCount
          );
        }
      );

      return await Promise.all([entriesPromise, addressPromise]);
    };

    return {
      transactionId,
      wait: () => waitForEntityChanges(),
      revert: () => state.revertOptimisticUpdate(transactionId),
      confirm: () => state.confirmTransaction(transactionId),
    };
  };

  const applyTournamentStartUpdate = (
    tournamentId: BigNumberish,
    newAddressStartCount: BigNumberish,
    accountAddress?: string
  ) => {
    const startsAddressEntityId = getEntityIdFromKeys([
      BigInt(tournamentId),
      BigInt(accountAddress ?? "0x0"),
    ]);
    const transactionId = uuidv4();

    console.log(startsAddressEntityId, nameSpace, "TournamentStartsAddress", {
      tournament_id: tournamentId,
      address: accountAddress,
      start_count: newAddressStartCount,
    });

    state.applyOptimisticUpdate(transactionId, (draft) => {
      applyModelUpdate(
        draft,
        startsAddressEntityId,
        nameSpace,
        "TournamentStartsAddress",
        {
          tournament_id: tournamentId,
          address: accountAddress,
          start_count: newAddressStartCount,
        }
      );
    });

    const waitForStartsEntityChange = async () => {
      return await state.waitForEntityChange(
        startsAddressEntityId,
        (entity) => {
          return (
            entity?.models?.[nameSpace]?.TournamentStartsAddress?.start_count ==
            newAddressStartCount
          );
        }
      );
    };

    return {
      transactionId,
      wait: () => waitForStartsEntityChange(),
      revert: () => state.revertOptimisticUpdate(transactionId),
      confirm: () => state.confirmTransaction(transactionId),
    };
  };

  const applyTournamentCreateUpdate = (tournament: Tournament) => {
    const entityId = getEntityIdFromKeys([BigInt(tournament.id)]);
    const transactionId = uuidv4();

    state.applyOptimisticUpdate(transactionId, (draft) => {
      applyModelUpdate(draft, entityId, nameSpace, "Tournament", tournament);
    });

    const waitForPrizeEntityChange = async () => {
      return await state.waitForEntityChange(entityId, (entity) => {
        return (
          (entity?.models?.[nameSpace]?.Tournament as Tournament) == tournament
        );
      });
    };

    return {
      transactionId,
      wait: () => waitForPrizeEntityChange(),
      revert: () => state.revertOptimisticUpdate(transactionId),
      confirm: () => state.confirmTransaction(transactionId),
    };
  };

  const applyTournamentSubmitScoresUpdate = (
    tournamentId: BigNumberish,
    gameIds: BigNumberish[]
  ) => {
    const entityId = getEntityIdFromKeys([BigInt(tournamentId)]);
    const transactionId = uuidv4();

    state.applyOptimisticUpdate(transactionId, (draft) => {
      applyModelUpdate(draft, entityId, nameSpace, "TournamentScores", {
        tournament_id: tournamentId,
        top_score_ids: gameIds,
      });
    });

    const waitForPrizeEntityChange = async () => {
      return await state.waitForEntityChange(entityId, (entity) => {
        return (
          entity?.models?.[nameSpace]?.TournamentScores?.top_score_ids ==
          gameIds
        );
      });
    };

    return {
      transactionId,
      wait: () => waitForPrizeEntityChange(),
      revert: () => state.revertOptimisticUpdate(transactionId),
      confirm: () => state.confirmTransaction(transactionId),
    };
  };

  const applyTournamentPrizeUpdate = (
    tournamentId: BigNumberish,
    prize: Prize
  ) => {
    const entityId = getEntityIdFromKeys([
      BigInt(tournamentId),
      BigInt(prize.id),
    ]);
    const transactionId = uuidv4();

    state.applyOptimisticUpdate(transactionId, (draft) => {
      applyModelUpdate(draft, entityId, nameSpace, "Prize", prize);
    });

    const waitForPrizeEntityChange = async () => {
      return await state.waitForEntityChange(entityId, (entity) => {
        return (entity?.models?.[nameSpace]?.Prize as Prize) == prize;
      });
    };

    return {
      transactionId,
      wait: () => waitForPrizeEntityChange(),
      revert: () => state.revertOptimisticUpdate(transactionId),
      confirm: () => state.confirmTransaction(transactionId),
    };
  };

  const applyTournamentCreateAndAddPrizesUpdate = (
    tournament: Tournament,
    prizes: Prize[]
  ) => {
    const entityId = getEntityIdFromKeys([BigInt(tournament.id)]);
    const transactionId = uuidv4();

    state.applyOptimisticUpdate(transactionId, (draft) => {
      applyModelUpdate(draft, entityId, nameSpace, "Tournament", tournament);
      for (const prize of prizes) {
        const entityPrizeId = getEntityIdFromKeys([
          BigInt(tournament.id),
          BigInt(prize.id),
        ]);
        applyModelUpdate(draft, entityPrizeId, nameSpace, "Prize", prize);
      }
    });

    const waitForEntityChanges = async () => {
      const tournamentPromise = state.waitForEntityChange(
        entityId,
        (entity) => {
          return (
            (entity?.models?.[nameSpace]?.Tournament as Tournament)?.id ===
            tournament.id
          );
        }
      );

      const prizePromises = prizes.map((prize) => {
        const prizesEntityId = getEntityIdFromKeys([
          BigInt(tournament.id),
          BigInt(prize.id),
        ]);
        return state.waitForEntityChange(prizesEntityId, (entity) => {
          return (entity?.models?.[nameSpace]?.Prize as Prize)?.id == prize.id;
        });
      });

      return await Promise.all([tournamentPromise, ...prizePromises]);
    };

    return {
      transactionId,
      wait: () => waitForEntityChanges(),
      revert: () => state.revertOptimisticUpdate(transactionId),
      confirm: () => state.confirmTransaction(transactionId),
    };
  };

  return {
    applyTournamentEntryUpdate,
    applyTournamentStartUpdate,
    applyTournamentCreateUpdate,
    applyTournamentSubmitScoresUpdate,
    applyTournamentPrizeUpdate,
    applyTournamentCreateAndAddPrizesUpdate,
  };
};
