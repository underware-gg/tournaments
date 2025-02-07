import { Card } from "@/components/ui/card";
import Pagination from "@/components/table/Pagination";
import { USER } from "@/components/Icons";
import { participants } from "@/lib/constants";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const EntrantsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showParticipants, setShowParticipants] = useState(false);
  const entrants = participants.map((participant) => participant.name);
  const entrantsCount = entrants.length;
  return (
    <Card
      variant="outline"
      borderColor="rgba(0, 218, 163, 1)"
      className={`w-1/2 transition-all duration-300 ease-in-out ${
        showParticipants ? "h-[200px]" : "h-[60px]"
      }`}
    >
      <div className="flex flex-col justify-between">
        <div className="flex flex-row justify-between h-8">
          <span className="font-astronaut text-2xl">Entrants</span>
          {showParticipants && (
            <Pagination
              totalPages={10}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
          <div className="flex flex-row items-center gap-2">
            <span className="text-neutral-500">
              {showParticipants ? "Hide" : "Show Participants"}
            </span>
            <Switch
              checked={showParticipants}
              onCheckedChange={setShowParticipants}
            />
            <div className="flex flex-row items-center font-astronaut text-2xl">
              <span className="w-10">
                <USER />
              </span>
              : {entrantsCount}
            </div>
          </div>
        </div>
        <div
          className={`transition-all duration-300 delay-150 ease-in-out ${
            showParticipants ? "h-auto opacity-100" : "h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="w-full h-0.5 bg-retro-green/25 mt-2" />
          <div className="flex flex-col py-2">
            {participants.map((participant, index) => (
              <div key={index} className="flex flex-row items-center">
                <span className="w-6">
                  <USER />
                </span>
                {participant.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EntrantsTable;
