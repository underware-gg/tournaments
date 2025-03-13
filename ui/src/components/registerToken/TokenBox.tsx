import { useState } from "react";
import { Button } from "@/components/ui/button";
import { displayAddress } from "@/lib/utils";

interface TokenBoxProps {
  title: string;
  contractAddress: string;
  standard: string;
  balance: number;
  onMint: () => Promise<void>;
  onCopy: (address: string, standard: string) => void;
  isCopied: boolean;
  variant?: "erc20" | "erc721";
  disabled?: boolean;
}

const TokenBox = ({
  title,
  contractAddress,
  standard,
  balance,
  onMint,
  onCopy,
  isCopied,
  variant,
  disabled,
}: TokenBoxProps) => {
  const [tokenId, setTokenId] = useState(0);
  return (
    <div className="flex flex-col gap-2 items-center justify-center border border-brand bg-black p-2">
      <p className="text-lg">{title}</p>
      <div className="relative flex flex-row items-center gap-2">
        <p className="text-lg">Address: {displayAddress(contractAddress)}</p>
        {isCopied && (
          <span className="absolute top-[-20px] right-0 uppercase">
            Copied!
          </span>
        )}
        <Button size="xs" onClick={() => onCopy(contractAddress, standard)}>
          Copy
        </Button>
      </div>
      <p className="text-lg">Balance: {balance}</p>
      <div className="flex flex-row gap-2">
        {variant === "erc721" && (
          <input
            type="number"
            value={tokenId}
            className="text-lg p-1 w-16 h-10 bg-terminal-black border border-terminal-green/75"
            onChange={(e) => setTokenId(parseInt(e.target.value))}
          />
        )}
        <Button
          disabled={disabled}
          onClick={async () => {
            onMint();
          }}
        >
          Mint
        </Button>
      </div>
    </div>
  );
};

export default TokenBox;
