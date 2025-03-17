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
  const chains: Chain[] = useMemo(
    () => getStarknetProviderChains(dojoAppConfig.supportedChainIds),
    [dojoAppConfig]
  );

  const provider = jsonRpcProvider({
    rpc: (chain: Chain) => {
      switch (chain) {
        case chains[2]:
          return { nodeUrl: chains[2].rpcUrls.default.http[0] };
        case chains[3]:
          return { nodeUrl: chains[3].rpcUrls.default.http[0] };
        case chains[1]:
          return { nodeUrl: chains[1].rpcUrls.default.http[0] };
        default:
          throw new Error(`Unsupported chain: ${chain.network}`);
      }
    },
  });

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

  console.log(
    chains,
    [...chainConnectors, ...pa],
    provider(selectedChainConfig?.chain!)
  );

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
