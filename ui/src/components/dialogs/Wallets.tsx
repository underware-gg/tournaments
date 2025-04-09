import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useConnect } from "@starknet-react/core";

interface WalletsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WalletsDialog = ({ open, onOpenChange }: WalletsDialogProps) => {
  const { connectors } = useConnect();
  console.log(connectors);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Wallets</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {connectors.map((connector) => (
            <div
              key={connector.id}
              onClick={() => null}
              className="flex flex-row items-center gap-5 h-16 border border-brand-muted rounded-md p-2 cursor-pointer"
            >
              <img
                src={
                  typeof connector.icon === "string"
                    ? connector.icon
                    : connector.icon?.dark
                }
                className="h-full"
              />

              <span className="text-brand">{connector.name}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletsDialog;
