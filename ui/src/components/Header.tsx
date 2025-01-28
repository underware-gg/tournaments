import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { Button } from "@/components/ui/button";
import { CONTROLLER, PLUS } from "@/components/Icons";
import { displayAddress } from "@/lib/utils";
import {
  useControllerUsername,
  useControllerProfile,
  isControllerAccount,
} from "@/hooks/useController";

const Header = () => {
  const { account } = useAccount();
  const { connect, connector } = useConnect();
  const { disconnect } = useDisconnect();
  const { openProfile } = useControllerProfile();
  const { username } = useControllerUsername();
  return (
    <div className="flex flex-row items-center justify-between py-5 px-10">
      <div className="flex text-4xl font-astronaut">Stark_Cup</div>
      <div className="flex flex-row items-center gap-2">
        <Button>
          <span className="flex flex-row items-center gap-2">
            <PLUS />
            Create Tournament
          </span>
        </Button>
        <Button
          onClick={() => {
            if (account) {
              openProfile();
            } else {
              connect();
            }
          }}
        >
          <span className="flex flex-row items-center gap-2">
            <CONTROLLER />
            {account ? (
              username ? (
                <span className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[100px]">
                  {username}
                </span>
              ) : (
                displayAddress(account.address)
              )
            ) : (
              "Connect"
            )}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Header;
