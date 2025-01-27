import { useMemo } from "react";
import { Connector, argent, braavos } from "@starknet-react/core";
import { DojoAppConfig, DojoChainConfig } from "@/dojo/config";

export const supportedConnectorIds = {
  CONTROLLER: "controller",
  PREDEPLOYED: "katana-0",
  ARGENT: "argent",
  BRAAVOS: "braavos",
};

export const checkCartridgeConnector = (connector?: Connector) => {
  return connector?.id === "controller";
};

export const getConnectorIcon = (connector: Connector): string | null => {
  if (!connector) return null;
  if (typeof connector.icon === "string") return connector.icon;
  return connector.icon?.dark ?? null;
};

export const useChainConnectors = (
  dojoAppConfig: DojoAppConfig,
  chainConfig: DojoChainConfig
) => {
  const connectorIds = useMemo<Connector[]>(() => {
    const result = (chainConfig?.connectorIds ?? []).reduce((acc, id) => {
      if (id == supportedConnectorIds.ARGENT) acc.push(argent());
      if (id == supportedConnectorIds.BRAAVOS) acc.push(braavos());
      if (id == supportedConnectorIds.CONTROLLER)
        acc.push(dojoAppConfig.controllerConnector!);
      return acc;
    }, [] as Connector[]);
    return result;
  }, [chainConfig]);

  return connectorIds;
};
