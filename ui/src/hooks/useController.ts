import { useCallback, useRef, useMemo, useState, useEffect } from "react";
import { useAccount, useConnect, Connector } from "@starknet-react/core";
import { SessionPolicies, lookupAddresses } from "@cartridge/controller";
import { ControllerConnector } from "@cartridge/connector";
import { ContractInterfaces, DojoChainConfig, ChainId } from "@/dojo/config";
import { DojoManifest } from "@/hooks/useDojoSystem";
import { supportedConnectorIds } from "@/lib/connectors";
import { stringToFelt } from "@/lib/utils";

// sync from here:
// https://github.com/cartridge-gg/controller/blob/main/packages/account-wasm/src/constants.rs
export const CONTROLLER_CLASS_HASH =
  "0x05f0f2ae9301e0468ca3f9218dadd43a448a71acc66b6ef1a5570bb56cf10c6f";

const exclusions = ["dojo_init", "upgrade"];

const toTitleCase = (str: string): string => {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const _makeControllerPolicies = (manifest: DojoManifest): SessionPolicies => {
  const policies: SessionPolicies = { contracts: {} };
  // contracts
  manifest?.contracts?.forEach((contract: any) => {
    if (!policies.contracts) policies.contracts = {};
    policies.contracts[contract.address] = {
      methods: contract.systems
        .filter((system: string) => !exclusions.includes(system))
        .map((system: string) => ({
          name: toTitleCase(system), // You'll need to implement toTitleCase
          entrypoint: system,
          description: `${contract.tag}::${system}()`,
        })),
    };
  });

  return policies;
};

export const makeControllerConnector = (
  manifest: DojoManifest,
  rpcUrl: string,
  defaultChainId: string,
  dojoChainConfig: DojoChainConfig
  // namespace: string
): Connector => {
  const policies = _makeControllerPolicies(manifest);

  const connector = new ControllerConnector({
    chains: [{ rpcUrl: rpcUrl }],
    defaultChainId:
      defaultChainId == ChainId.SN_MAIN
        ? stringToFelt(defaultChainId).toString()
        : defaultChainId == ChainId.WP_LS_TOURNAMENTS_KATANA
        ? "WP_LS-TOURNAMENTS-KATANA"
        : defaultChainId,
    theme: "loot-survivor",
    colorMode: "dark",
    policies,
    // namespace,
    slot:
      defaultChainId == ChainId.SN_MAIN
        ? "ls-tournament-tokens"
        : "ls-tournaments-katana",
    tokens: {
      erc20: [dojoChainConfig.lordsAddress!],
    },
  }) as never as Connector;
  return connector;
};

export const useControllerConnector = (
  manifest: DojoManifest,
  rpcUrl: string,
  namespace: string,
  contractInterfaces: ContractInterfaces,
  defaultChainId: string,
  dojoChainConfig: DojoChainConfig
) => {
  const connectorRef = useRef<any>(undefined);
  const controller = useCallback(() => {
    if (!connectorRef.current) {
      connectorRef.current = makeControllerConnector(
        manifest,
        rpcUrl,
        defaultChainId,
        dojoChainConfig
        // namespace
      );
    }
    return connectorRef.current;
  }, [manifest, rpcUrl, namespace, contractInterfaces]);
  return {
    controller,
  };
};

export const useControllerMenu = () => {
  const { account } = useAccount();
  const controllerConnector = useConnectedController();
  const openMenu = async () => {
    if (account) {
      await controllerConnector?.controller.openSettings();
    }
  };
  return {
    openMenu,
  };
};

export const useControllerProfile = () => {
  const { account } = useAccount();
  const controllerConnector = useConnectedController();
  const openProfile = async () => {
    if (account) {
      await controllerConnector?.controller.openProfile();
    }
  };
  return {
    openProfile,
  };
};

export const useConnectedController = () => {
  const { connector } = useConnect();

  const controllerConnector = useMemo(
    () =>
      connector?.id == supportedConnectorIds.CONTROLLER
        ? (connector as unknown as ControllerConnector)
        : undefined,
    [connector]
  );
  return controllerConnector;
};

export const useControllerUsername = () => {
  const { connector } = useConnect();
  const [username, setUsername] = useState<string | undefined>(undefined);
  const isController = isControllerAccount();

  const getUsername = useCallback(async () => {
    if (!connector) return;
    if (!isController) return;
    const username = await (
      connector as unknown as ControllerConnector
    ).username();
    setUsername(username || "");
  }, [connector, isController]);

  useEffect(() => {
    getUsername();
  }, [connector]);

  return {
    username,
  };
};

export const useGetUsernames = (addresses: string[]) => {
  const [usernames, setUsernames] = useState<Map<string, string> | undefined>(
    undefined
  );

  const fetchUsernames = useCallback(async () => {
    if (!addresses.length) return;
    const addressMap = await lookupAddresses(addresses);
    setUsernames(addressMap);
  }, [addresses]);

  useEffect(() => {
    fetchUsernames();
  }, [addresses]);

  return {
    usernames,
    refetch: fetchUsernames,
  };
};

export const isControllerAccount = () => {
  const { connector } = useConnect();
  return connector?.id == supportedConnectorIds.CONTROLLER;
};

// export const useControllerAccount = (contractAddress: BigNumberish) => {
//   const { classHash, isDeployed } = useContractClassHash(contractAddress);
//   const isControllerAccount = useMemo(
//     () => classHash && bigintEquals(classHash, CONTROLLER_CLASS_HASH),
//     [classHash]
//   );
//   const isKatanaAccount = useMemo(
//     () => classHash && bigintEquals(classHash, KATANA_CLASS_HASH),
//     [classHash]
//   );
//   return {
//     classHash,
//     isDeployed,
//     isControllerAccount,
//     isKatanaAccount,
//   };
// };
