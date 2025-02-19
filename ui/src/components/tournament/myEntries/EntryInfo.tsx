import { HoverCardContent } from "@/components/ui/hover-card";

interface EntryInfoProps {
  entryNumber: string;
}

const EntryInfo = ({ entryNumber }: EntryInfoProps) => {
  return (
    <HoverCardContent
      className="w-80 p-4 text-sm z-50"
      align="start"
      side="top"
      sideOffset={5}
      alignOffset={-80}
    >
      <div className="space-y-2">
        <h4 className="font-medium">Entry #{entryNumber}</h4>
        <p className="text-muted-foreground">Game Settings</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Entry Number: {entryNumber}</li>
          <li>More details can be added here</li>
          <li>And here</li>
        </ul>
      </div>
    </HoverCardContent>
  );
};

export default EntryInfo;
