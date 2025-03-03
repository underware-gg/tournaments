import { useAccount, useDisconnect } from "@starknet-react/core";
import { Button } from "@/components/ui/button";
import { CONTROLLER, PLUS, LOGOUT, PLAY } from "@/components/Icons";
import { displayAddress } from "@/lib/utils";
import {
  useControllerUsername,
  useControllerProfile,
} from "@/hooks/useController";
import { useNavigate, useLocation } from "react-router-dom";
import { useDojo } from "@/context/dojo";
import { ChainId } from "@/dojo/config";
import { useConnectToSelectedChain } from "@/dojo/hooks/useChain";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import useUIStore from "@/hooks/useUIStore";
import { getGames } from "@/assets/games";
import TokenGameIcon from "@/components/icons/TokenGameIcon";
import { SPACE_INVADER_LINE } from "@/components/Icons";
// import { ADMIN_ADDRESS } from "@/lib/constants";

const Header = () => {
  const { account } = useAccount();
  const { connect } = useConnectToSelectedChain();
  const { gameFilters, setGameFilters, gameData } = useUIStore();
  // const isAdmin = address === ADMIN_ADDRESS;

  const { disconnect } = useDisconnect();
  const { openProfile } = useControllerProfile();
  const { username } = useControllerUsername();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedChainConfig } = useDojo();

  const isMainnet = selectedChainConfig.chainId === ChainId.SN_MAIN;
  const isHomeScreen = location.pathname === "/";

  return (
    <div className="flex flex-row items-center justify-between px-5 sm:py-5 sm:px-10 h-[60px] sm:h-[80px]">
      {/* Hamburger menu for small screens */}
      {isHomeScreen && (
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="p-0 flex items-center justify-center"
              >
                <span className="flex items-center justify-center w-full h-full">
                  <SPACE_INVADER_LINE />
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col gap-4 py-4">
                <SheetClose asChild>
                  <div
                    className="text-3xl font-astronaut hover:cursor-pointer hover:text-primary-dark transition-colors duration-200"
                    onClick={() => navigate("/")}
                  >
                    Games
                  </div>
                </SheetClose>
                {Object.entries(getGames()).map(([key, game]) => {
                  const isDisabled = !gameData.find(
                    (game) => game.contract_address === key
                  );

                  // Create the button element
                  const buttonElement = (
                    <div className="relative w-full">
                      <Button
                        size={"xl"}
                        variant="outline"
                        className="justify-start w-full"
                        onClick={() => {
                          if (gameFilters.includes(key)) {
                            // Remove the key if it exists
                            setGameFilters(
                              gameFilters.filter((filter) => filter !== key)
                            );
                          } else {
                            // Add the key if it doesn't exist
                            setGameFilters([...gameFilters, key]);
                          }
                        }}
                        disabled={isDisabled}
                      >
                        <span className="flex flex-row items-center gap-2 font-astronaut">
                          <TokenGameIcon game={key} />
                          {game.name}
                        </span>
                      </Button>
                      {isDisabled && (
                        <div className="absolute top-1 right-2 flex items-center justify-center rounded-md">
                          <span className="text-xs font-astronaut uppercase">
                            Coming Soon
                          </span>
                        </div>
                      )}
                    </div>
                  );

                  // Only wrap with SheetClose if the button is not disabled
                  return isDisabled ? (
                    <div key={key}>{buttonElement}</div>
                  ) : (
                    <SheetClose asChild key={key}>
                      {buttonElement}
                    </SheetClose>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Logo - hidden on small screens */}
      <div
        className="hidden sm:flex text-4xl font-astronaut hover:cursor-pointer hover:text-primary-dark transition-colors duration-200"
        onClick={() => {
          navigate("/");
        }}
      >
        Budokan
      </div>

      <div className="flex flex-row items-center gap-2 ml-auto">
        {/* Navigation buttons - only visible on larger screens */}
        <div className="hidden sm:flex sm:flex-row sm:items-center sm:gap-2">
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
            // && isAdmin
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
        </div>

        {/* Connect button - visible on all screen sizes */}
        <Button
          onClick={() => {
            if (!account) {
              connect();
            }
          }}
          className="px-2"
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
                className="hidden sm:block hover:bg-primary-dark p-1"
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
