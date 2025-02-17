import { useAccount, useDisconnect } from "@starknet-react/core";
import { Button } from "@/components/ui/button";
import { CONTROLLER, PLUS, LOGOUT, PLAY } from "@/components/Icons";
import { displayAddress } from "@/lib/utils";
import {
  useControllerUsername,
  useControllerProfile,
  useConnectController,
} from "@/hooks/useController";
import { useNavigate, useLocation } from "react-router-dom";
import { useDojo } from "@/context/dojo";
import { ChainId } from "@/dojo/config";

const Header = () => {
  const { account } = useAccount();
  const { connectController } = useConnectController();
  const { disconnect } = useDisconnect();
  const { openProfile } = useControllerProfile();
  const { username } = useControllerUsername();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedChainConfig } = useDojo();

  const isMainnet = selectedChainConfig.chainId === ChainId.SN_MAIN;

  return (
    <div className="flex flex-row items-center justify-between py-5 px-10 h-[80px]">
      <div className="flex text-4xl font-astronaut">Budokan</div>
      <div className="flex flex-row items-center gap-2">
        {!isMainnet && location.pathname !== "/play" && (
          <Button
            onClick={() => {
              navigate("/play");
            }}
          >
            <span className="flex flex-row items-center gap-2">
              <PLAY />
              Play
            </span>
          </Button>
        )}
        {!isMainnet && location.pathname !== "/register-token" && (
          <Button
            onClick={() => {
              navigate("/register-token");
            }}
          >
            <span className="flex flex-row items-center gap-2">
              <PLUS />
              Register Token
            </span>
          </Button>
        )}
        {location.pathname !== "/create-tournament" && (
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
        )}
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
