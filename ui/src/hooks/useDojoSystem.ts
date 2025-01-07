import { useMemo } from "react";
import { useDojo } from "@/DojoContext";
import { getContractByName } from "@dojoengine/core";
import { Manifest } from "@dojoengine/core";

export type DojoManifest = Manifest & any;

export const useDojoSystem = (systemName: string) => {
  const { manifest, nameSpace } = useDojo();
  return useSystem(nameSpace, systemName, manifest);
};

const useSystem = (
  nameSpace: string,
  systemName: string,
  manifest: DojoManifest
) => {
  const { contractAddress, abi } = useMemo(() => {
    const contract = manifest
      ? getContractByName(manifest, nameSpace, systemName)
      : null;
    return {
      contractAddress: contract?.address ?? null,
      abi: contract?.abi ?? null,
    };
  }, [systemName, manifest]);
  return {
    contractAddress,
    abi,
  };
};
