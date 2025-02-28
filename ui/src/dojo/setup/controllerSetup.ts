import { Connector } from "@starknet-react/core";
import { ControllerConnector } from "@cartridge/connector";
import { DojoManifest } from "@/dojo/hooks/useDojoSystem";
import { ChainId } from "@/dojo/config";
import { stringToFelt } from "@/lib/utils";
import { SessionPolicies } from "@cartridge/controller";

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

export const initializeController = (
  manifest: DojoManifest,
  rpcUrl: string,
  defaultChainId: string
): Connector => {
  const policies = _makeControllerPolicies(manifest);

  return new ControllerConnector({
    chains: [{ rpcUrl: rpcUrl }],
    defaultChainId: stringToFelt(defaultChainId).toString(),
    theme: "loot-survivor",
    colorMode: "dark",
    policies,
    slot:
      defaultChainId == ChainId.SN_MAIN ? "pg-mainnet-tokens" : "tournaments",
  }) as never as Connector;
};
