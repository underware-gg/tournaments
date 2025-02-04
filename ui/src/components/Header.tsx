import { useAccount, useDisconnect } from "@starknet-react/core";
import { Button } from "@/components/ui/button";
import { CONTROLLER, PLUS, LOGOUT } from "@/components/Icons";
import { displayAddress } from "@/lib/utils";
import {
  useControllerUsername,
  useControllerProfile,
  useConnectController,
} from "@/hooks/useController";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { account } = useAccount();
  const { connectController } = useConnectController();
  const { disconnect } = useDisconnect();
  const { openProfile } = useControllerProfile();
  const { username } = useControllerUsername();
  const navigate = useNavigate();
  return (
    <div className="flex flex-row items-center justify-between py-5 px-10 h-[80px]">
      <div className="flex text-4xl font-astronaut">Stark_Cup</div>
      <div className="flex flex-row items-center gap-2">
        <Button
          onClick={() => {
            navigate("/create-tournament");
          }}
        >
          <span className="flex flex-row items-center gap-2">
            <PLUS />
            Create Tournament
          </span>
        </Button>
        <Button
          onClick={() => {
            if (!account) {
              connectController();
            }
          }}
        >
          <span className="flex flex-row items-center gap-2">
            <CONTROLLER />
            <span
              onClick={() => {
                if (account) {
                  openProfile();
                }
              }}
            >
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
            {account && (
              <span
                className="hover:bg-retro-green-dark p-1"
                onClick={() => {
                  disconnect();
                }}
              >
                <LOGOUT />
              </span>
            )}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Header;
