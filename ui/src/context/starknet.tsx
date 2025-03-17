"use client";
import { useEffect, useState } from "react";
import { Chain } from "@starknet-react/chains";
import { jsonRpcProvider, StarknetConfig } from "@starknet-react/core";
import React from "react";
import { ChainId, CHAINS } from "@/dojo/setup/networks";
import {
  predeployedAccounts,
  PredeployedAccountsConnector,
} from "@dojoengine/predeployed-connector";
import { initializeController } from "@/dojo/setup/controllerSetup";

const getDefaultChainId = (): ChainId => {
  const envChainId = import.meta.env.VITE_CHAIN_ID as ChainId;

  if (envChainId && !isChainIdSupported(envChainId)) {
    throw new Error(`Unsupported chain ID in environment: ${envChainId}`);
  }

  return envChainId || ChainId.KATANA_LOCAL;
};

const isChainIdSupported = (chainId: ChainId): boolean => {
  return Object.keys(CHAINS).includes(chainId);
};

const controller =
  getDefaultChainId() !== ChainId.KATANA_LOCAL
    ? (() => {
        try {
          const chainRpcUrls: { rpcUrl: string }[] = Object.values(CHAINS)
            .filter((chain) => chain.chainId !== ChainId.KATANA_LOCAL)
            .map((chain) => ({
              rpcUrl: chain?.chain?.rpcUrls.default.http[0] ?? "",
            }));

          return initializeController(chainRpcUrls, getDefaultChainId());
        } catch (error) {
          console.error(
            `Failed to initialize controller for chain ${getDefaultChainId()}:`,
            error
          );
          return undefined;
        }
      })()
    : undefined;

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const provider = jsonRpcProvider({
    rpc: (chain: Chain) => {
      switch (chain) {
        case CHAINS[ChainId.SN_MAIN].chain:
          return {
            nodeUrl: CHAINS[ChainId.SN_MAIN].chain?.rpcUrls.default.http[0],
          };
        case CHAINS[ChainId.SN_SEPOLIA].chain:
          return {
            nodeUrl: CHAINS[ChainId.SN_SEPOLIA].chain?.rpcUrls.default.http[0],
          };
        case CHAINS[ChainId.WP_TOURNAMENTS].chain:
          return {
            nodeUrl:
              CHAINS[ChainId.WP_TOURNAMENTS].chain?.rpcUrls.default.http[0],
          };
        default:
          throw new Error(`Unsupported chain: ${chain.network}`);
      }
    },
  });

  const [pa, setPa] = useState<PredeployedAccountsConnector[]>([]);

  useEffect(() => {
    if (getDefaultChainId() === ChainId.KATANA_LOCAL) {
      predeployedAccounts({
        rpc: CHAINS[getDefaultChainId()]?.chain?.rpcUrls.default.http[0] ?? "",
        id: "katana",
        name: "Katana",
      }).then(setPa);
    }
  }, [getDefaultChainId()]);

  console.log(
    Object.values(CHAINS).map((chain) => chain.chain),
    [...[controller], ...pa],
    provider(CHAINS[getDefaultChainId()]?.chain!)
  );

  return (
    <StarknetConfig
      chains={Object.values(CHAINS).map((chain) => chain.chain!)}
      connectors={[...[controller!], ...pa]}
      provider={() => provider(CHAINS[getDefaultChainId()]?.chain!)}
    >
      {children}
    </StarknetConfig>
  );
}
