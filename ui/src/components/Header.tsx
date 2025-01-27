import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { Button } from "@/components/ui/button";
import { CONTROLLER, PLUS } from "@/components/Icons";

const Header = () => {
  const { account } = useAccount();
  const { connector } = useConnect();
  const { disconnect } = useDisconnect();
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
        <Button>
          <span className="flex flex-row items-center gap-2">
            <CONTROLLER />
            Connect
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Header;
