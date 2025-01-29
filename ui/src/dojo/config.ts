import { StarknetDomain } from "starknet";
import { Connector } from "@starknet-react/core";
import { Chain, mainnet, NativeCurrency } from "@starknet-react/chains";
import {
  LOCAL_KATANA,
  LOCAL_RELAY,
  KATANA_CLASS_HASH,
  KATANA_ETH_CONTRACT_ADDRESS,
} from "@dojoengine/core";
import { DojoManifest } from "@/hooks/useDojoSystem";
import tournament_manifest_dev from "../../../contracts/manifest_dev.json";
import tournament_manifest_slot from "../../../contracts/manifest_slot.json";
import tournament_manifest_mainnet from "../../../contracts/manifest_mainnet.json";
import { initializeController } from "@/dojo/setup/controllerSetup";
import { supportedConnectorIds } from "@/lib/connectors";
import { stringToFelt, cleanObject } from "@/lib/utils";

export interface ContractInterfaces {
  [contractName: string]: string[];
}

export interface DojoAppConfig {
  nameSpace: string;
  contractInterfaces: ContractInterfaces;
  supportedChainIds: ChainId[];
  initialChainId: ChainId;
  starknetDomain: StarknetDomain;
  manifests: { [chain_id: string]: DojoManifest | undefined };
  controllerConnector?: Connector;
}

export enum ChainId {
  KATANA_LOCAL = "KATANA_LOCAL",
  WP_LS_TOURNAMENTS_KATANA = "WP_LS_TOURNAMENTS_KATANA",
  SN_MAIN = "SN_MAIN",
}

// TODO: fix for running between katana and mainnet
const supportedChainIds: ChainId[] = [
  ChainId.KATANA_LOCAL,
  ChainId.WP_LS_TOURNAMENTS_KATANA,
  ChainId.SN_MAIN,
];

const validateChainConfig = (
  config: DojoChainConfig,
  chainId: ChainId
): void => {
  const required = ["rpcUrl", "chainId", "name"];
  const missing = required.filter(
    (key) => !config[key as keyof DojoChainConfig]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required chain config for ${chainId}: ${missing.join(", ")}`
    );
  }
};

const getDefaultChainId = (): ChainId => {
  const envChainId = import.meta.env.VITE_CHAIN_ID as ChainId;

  if (envChainId && !isChainIdSupported(envChainId)) {
    throw new Error(`Unsupported chain ID in environment: ${envChainId}`);
  }

  return envChainId || ChainId.KATANA_LOCAL;
};

export const isChainIdSupported = (chainId: ChainId): boolean => {
  return Object.keys(dojoContextConfig).includes(chainId);
};

export const getDojoChainConfig = (
  chainId: ChainId
): DojoChainConfig | null => {
  if (!isChainIdSupported(chainId)) {
    return null;
  }
  let result = { ...dojoContextConfig[chainId] };
  //
  // derive starknet Chain
  if (!result.chain) {
    result.chain = {
      id: BigInt(stringToFelt(result.chainId!)),
      name: result.name,
      network: result.network ?? "katana",
      testnet: result.testnet ?? true,
      nativeCurrency: result.nativeCurrency,
      rpcUrls: {
        default: { http: [] },
        public: { http: [] },
      },
      explorers: result.explorers,
    } as Chain;
  }
  //
  // override env (default chain only)
  if (chainId == getDefaultChainId()) {
    result = {
      ...result,
      ...cleanObject(envChainConfig),
    };
  }
  //
  // use Cartridge RPCs
  if (result.rpcUrl) {
    result.chain!.rpcUrls.default.http = [result.rpcUrl];
    result.chain!.rpcUrls.public.http = [result.rpcUrl];
  }

  return result;
};

export const getStarknetProviderChains = (
  supportedChainIds: ChainId[]
): Chain[] => {
  return supportedChainIds.reduce<Chain[]>((acc, chainId) => {
    const dojoChainConfig = getDojoChainConfig(chainId);
    if (dojoChainConfig?.chain) {
      acc.push(dojoChainConfig.chain);
    }
    return acc;
  }, []);
};

const manifests: Record<ChainId, DojoManifest> = {
  [ChainId.KATANA_LOCAL]: tournament_manifest_dev as DojoManifest,
  [ChainId.WP_LS_TOURNAMENTS_KATANA]: tournament_manifest_slot as DojoManifest,
  [ChainId.SN_MAIN]: tournament_manifest_mainnet as DojoManifest,
};

const NAMESPACE = "ls_tournaments_v0";

let katanaContractInterfaces: ContractInterfaces = {
  tournament_mock: ["ITournamentMock"],
  erc20_mock: ["IERC20Mock"],
  erc721_mock: ["IERC721Mock"],
  eth_mock: ["IETHMock"],
  lords_mock: ["ILordsMock"],
  loot_survivor_mock: ["ILootSurvivorMock"],
  pragma_mock: ["IPragmaMock"],
};

let mainnetContractInterfaces: ContractInterfaces = {
  ls_tournament: ["ILSTournament"],
};

const CONTRACT_INTERFACES: Record<ChainId, ContractInterfaces> = {
  [ChainId.KATANA_LOCAL]: katanaContractInterfaces,
  [ChainId.WP_LS_TOURNAMENTS_KATANA]: katanaContractInterfaces,
  [ChainId.SN_MAIN]: mainnetContractInterfaces,
};

//
// currencies
//
const ETH_KATANA: NativeCurrency = {
  address: KATANA_ETH_CONTRACT_ADDRESS,
  name: "Ether",
  symbol: "ETH",
  decimals: 18,
};

//
// explorers
//
type ChainExplorers = {
  [key: string]: string[];
};
const WORLD_EXPLORER: ChainExplorers = {
  worlds: ["https://worlds.dev"],
};

//
// chain config
//
export type DojoChainConfig = {
  chain?: Chain;
  chainId?: ChainId;
  name?: string;
  rpcUrl?: string;
  toriiUrl?: string;
  relayUrl?: string;
  blastRpc?: string;
  blockExplorerUrl?: string;
  ekuboPriceAPI?: string;
  masterAddress?: string;
  masterPrivateKey?: string;
  accountClassHash?: string;
  ethAddress?: string;
  lordsAddress?: string;
  clientRewardAddress?: string[];
  connectorIds?: string[];
  // starknet Chain
  network?: string;
  testnet?: boolean;
  nativeCurrency?: NativeCurrency;
  explorers?: ChainExplorers;
};

const localKatanaConfig: DojoChainConfig = {
  chain: undefined, // derive from this
  chainId: ChainId.KATANA_LOCAL,
  name: "Katana Local",
  rpcUrl: LOCAL_KATANA,
  toriiUrl: "http://0.0.0.0:8080", //LOCAL_TORII,
  relayUrl: LOCAL_RELAY,
  blastRpc: undefined,
  blockExplorerUrl: undefined,
  ekuboPriceAPI: undefined,
  // masterAddress: KATANA_PREFUNDED_ADDRESS,
  // masterPrivateKey: KATANA_PREFUNDED_PRIVATE_KEY,
  masterAddress:
    "0x127fd5f1fe78a71f8bcd1fec63e3fe2f0486b6ecd5c86a0466c3a21fa5cfcec",
  masterPrivateKey:
    "0xc5b2fcab997346f3ea1c00b002ecf6f382c5f9c9659a3894eb783c5320f912",
  accountClassHash: KATANA_CLASS_HASH,
  ethAddress: KATANA_ETH_CONTRACT_ADDRESS,
  lordsAddress: "0x0",
  clientRewardAddress: [
    "0x036cE487952f25878a0158bA4A0C2Eb5eb66f0282567163a4B893A0EA5847D2d",
  ],
  connectorIds: [supportedConnectorIds.PREDEPLOYED],
  // starknet Chain
  nativeCurrency: ETH_KATANA,
  explorers: WORLD_EXPLORER,
} as const;

const slotKatanaConfig: DojoChainConfig = {
  chain: undefined, // derive from this
  chainId: ChainId.WP_LS_TOURNAMENTS_KATANA,
  name: "Katana Slot",
  rpcUrl: "https://api.cartridge.gg/x/ls-tournaments-katana/katana",
  toriiUrl: "https://api.cartridge.gg/x/ls-tournaments-katana/torii",
  relayUrl: undefined,
  blastRpc: undefined,
  blockExplorerUrl: undefined,
  ekuboPriceAPI: undefined,
  // masterAddress: KATANA_PREFUNDED_ADDRESS,
  // masterPrivateKey: KATANA_PREFUNDED_PRIVATE_KEY,
  masterAddress:
    "0x6677fe62ee39c7b07401f754138502bab7fac99d2d3c5d37df7d1c6fab10819",
  masterPrivateKey:
    "0x3e3979c1ed728490308054fe357a9f49cf67f80f9721f44cc57235129e090f4",
  accountClassHash: KATANA_CLASS_HASH,
  ethAddress: KATANA_ETH_CONTRACT_ADDRESS,
  lordsAddress: "0x0",
  clientRewardAddress: [
    "0x036cE487952f25878a0158bA4A0C2Eb5eb66f0282567163a4B893A0EA5847D2d",
  ],
  connectorIds: [supportedConnectorIds.CONTROLLER],
  // starknet Chain
  nativeCurrency: ETH_KATANA,
  explorers: WORLD_EXPLORER,
};

const snMainnetConfig: DojoChainConfig = {
  chain: { ...mainnet },
  chainId: ChainId.SN_MAIN,
  name: "Mainnet",
  rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet",
  toriiUrl: "https://api.cartridge.gg/x/ls-tournaments/torii",
  relayUrl: undefined,
  blastRpc:
    "https://starknet-mainnet.blastapi.io/5ef61753-e7c1-4593-bc62-97fdf96f8de5",
  blockExplorerUrl: "https://voyager.online/",
  ekuboPriceAPI: "https://mainnet-api.ekubo.org/price",
  masterAddress: undefined,
  masterPrivateKey: undefined,
  accountClassHash: undefined,
  ethAddress: mainnet.nativeCurrency.address,
  lordsAddress:
    "0x0124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49",
  clientRewardAddress: [
    "0x036cE487952f25878a0158bA4A0C2Eb5eb66f0282567163a4B893A0EA5847D2d",
    "0x0616E6a5F9b1f86a0Ece6E965B2f3b27E3D784be79Cb2F6304D92Db100C7D29E",
    "0x049FB4281D13E1f5f488540Cd051e1507149E99CC2E22635101041Ec5E4e4557",
    "0x02CD97240DB3f679De98A729aE91EB996cAb9Fd92a9A578Df11a72F49bE1c356",
    "0x03F7F4E5a23A712787F0C100f02934c4A88606B7F0C880c2FD43e817E6275d83",
  ],
  connectorIds: [
    supportedConnectorIds.CONTROLLER,
    supportedConnectorIds.ARGENT,
    supportedConnectorIds.BRAAVOS,
  ],
} as const;

// environment overrides, will be applied over default chain only
export const envChainConfig: DojoChainConfig = {
  chain: undefined,
  chainId: undefined,
  name: undefined,
  rpcUrl: import.meta.env.VITE_NODE_URL || undefined,
  toriiUrl: import.meta.env.VITE_TORII || undefined,
  relayUrl: import.meta.env.VITE_RELAY_URL || undefined,
  masterAddress: import.meta.env.VITE_MASTER_ADDRESS || undefined,
  masterPrivateKey: import.meta.env.VITE_MASTER_PRIVATE_KEY || undefined,
  accountClassHash: undefined,
  ethAddress: undefined,
  lordsAddress: undefined,
  connectorIds: undefined,
};

export const dojoContextConfig: Record<ChainId, DojoChainConfig> = {
  [ChainId.KATANA_LOCAL]: localKatanaConfig,
  [ChainId.WP_LS_TOURNAMENTS_KATANA]: slotKatanaConfig,
  [ChainId.SN_MAIN]: snMainnetConfig,
};

//------------------------

export const makeDojoAppConfig = (): DojoAppConfig => {
  const initialChainId = getDefaultChainId();

  // Validate chain configuration before creating app config
  const chainConfig = dojoContextConfig[initialChainId];
  validateChainConfig(chainConfig, initialChainId);

  // Initialize controller with error handling
  const controller =
    initialChainId !== ChainId.KATANA_LOCAL
      ? (() => {
          try {
            return initializeController(
              manifests[initialChainId],
              chainConfig.rpcUrl!,
              initialChainId,
              chainConfig
            );
          } catch (error) {
            console.error(
              `Failed to initialize controller for chain ${initialChainId}:`,
              error
            );
            return undefined;
          }
        })()
      : undefined;

  return {
    manifests,
    supportedChainIds,
    initialChainId,
    nameSpace: NAMESPACE,
    contractInterfaces: CONTRACT_INTERFACES[initialChainId],
    starknetDomain: {
      name: "Tournament",
      version: "0.1.0",
      chainId: initialChainId,
      revision: "1",
    },
    controllerConnector: controller,
  };
};
