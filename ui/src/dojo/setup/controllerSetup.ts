import { Connector } from "@starknet-react/core";
import { ControllerConnector } from "@cartridge/connector";
import { ChainId } from "@/dojo/config";
import { stringToFelt } from "@/lib/utils";

export const initializeController = (
  chainRpcUrls: { rpcUrl: string }[],
  defaultChainId: string
): Connector => {
  return new ControllerConnector({
    chains: chainRpcUrls,
    defaultChainId: stringToFelt(defaultChainId).toString(),
    preset: "budokan",
    slot:
      defaultChainId == ChainId.SN_MAIN ? "pg-mainnet-tokens" : "tournaments",
    tokens: {
      erc20: [
        "0x0124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49",
      ],
    },
  }) as never as Connector;
};
