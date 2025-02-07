import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getTokenLogoUrl } from "@/lib/tokensMeta";
import { useDojo } from "@/context/dojo";
import { useDojoStore } from "@/dojo/hooks/useDojoStore";
import { Token } from "@/generated/models.gen";

interface TokenDialogProps {
  selectedToken: Token | null;
  onSelect: (token: Token) => void;
}

const TokenDialog = ({ selectedToken, onSelect }: TokenDialogProps) => {
  const [tokenSearchQuery, setTokenSearchQuery] = useState("");
  const { nameSpace } = useDojo();
  const tokens = useDojoStore
    .getState()
    .getEntitiesByModel(nameSpace, "Token")
    .map((token) => token.models[nameSpace].Token as Token);

  const filteredTokens = tokens.filter((token) =>
    token.name.toLowerCase().includes(tokenSearchQuery.toLowerCase())
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          {selectedToken ? (
            <div className="flex items-center gap-2">
              <img
                src={getTokenLogoUrl(selectedToken.address)}
                className="w-6 h-6"
                alt="Token logo"
              />
              <span className="font-bold">{selectedToken.name}</span>
              <span className="text-sm text-neutral-500 uppercase">
                {selectedToken.symbol}
              </span>
            </div>
          ) : (
            "Select Token"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[600px] flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="p-4">Select Token</DialogTitle>
          <div className="px-4 pb-4">
            <div className="flex items-center border rounded border-retro-green-dark bg-background">
              <Search className="w-4 h-4 ml-3 text-muted-foreground" />
              <Input
                placeholder="Search tokens..."
                value={tokenSearchQuery}
                onChange={(e) => setTokenSearchQuery(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          {filteredTokens.map((token, index) => (
            <DialogClose asChild key={index}>
              <div
                className={`w-full flex flex-row items-center justify-between hover:bg-retro-green/20 hover:cursor-pointer px-5 py-2 ${
                  selectedToken?.address === token.address
                    ? "bg-terminal-green/75 text-terminal-black"
                    : ""
                }`}
                onClick={() => onSelect(token)}
              >
                <div className="flex flex-row gap-5 items-center">
                  <img
                    src={getTokenLogoUrl(token.address)}
                    className="w-8 h-8"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold">{token.name}</span>
                    <span className="uppercase text-neutral-500">
                      {token.symbol}
                    </span>
                  </div>
                </div>
                <span className="uppercase text-neutral-500">
                  {token.token_type.activeVariant()}
                </span>
              </div>
            </DialogClose>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenDialog;
