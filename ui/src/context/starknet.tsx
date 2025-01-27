"use client";
import { useMemo, useEffect, useState } from "react";
import { Chain } from "@starknet-react/chains";
import { jsonRpcProvider, StarknetConfig } from "@starknet-react/core";
import React from "react";
import { useChainConnectors } from "../lib/connectors";
import {
  DojoAppConfig,
  dojoContextConfig,
  getDojoChainConfig,
  ChainId,
  getStarknetProviderChains,
} from "@/dojo/config";
import {
  predeployedAccounts,
  PredeployedAccountsConnector,
} from "@dojoengine/predeployed-connector";

export function StarknetProvider({
  children,
  dojoAppConfig,
}: {
  children: React.ReactNode;
  dojoAppConfig: DojoAppConfig;
}) {
  function rpc(chain: Chain) {
    const nodeUrl = chain.rpcUrls.default.http[0];
    return {
      nodeUrl,
    };
  }
  const provider = jsonRpcProvider({ rpc });

  const chains: Chain[] = useMemo(
    () => getStarknetProviderChains(dojoAppConfig.supportedChainIds),
    [dojoAppConfig]
  );

  const selectedChainId = useMemo(
    () => dojoAppConfig.initialChainId,
    [dojoAppConfig]
  );

  const selectedChainConfig = useMemo(
    () => getDojoChainConfig(selectedChainId),
    [dojoContextConfig, selectedChainId]
  );

  const chainConnectors = useChainConnectors(
    dojoAppConfig,
    selectedChainConfig!
  );

  const [pa, setPa] = useState<PredeployedAccountsConnector[]>([]);

  useEffect(() => {
    if (selectedChainId === ChainId.KATANA_LOCAL) {
      predeployedAccounts({
        rpc: selectedChainConfig?.rpcUrl as string,
        id: "katana",
        name: "Katana",
      }).then(setPa);
    }
  }, [selectedChainConfig?.rpcUrl]);

  return (
    <StarknetConfig
      autoConnect
      chains={chains}
      connectors={[...chainConnectors, ...pa]}
      provider={() => provider(selectedChainConfig?.chain!)}
    >
      {children}
    </StarknetConfig>
  );
}
