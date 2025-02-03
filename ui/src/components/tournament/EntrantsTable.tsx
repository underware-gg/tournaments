import { Card } from "@/components/ui/card";
import Pagination from "@/components/table/Pagination";
import { USER } from "@/components/Icons";
import { participants } from "@/lib/constants";
import { useState } from "react";

const EntrantsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const entrants = participants.map((participant) => participant.name);
  const entrantsCount = entrants.length;
  return (
    <Card
      variant="outline"
      borderColor="rgba(0, 218, 163, 1)"
      className="w-1/2"
    >
      <div className="flex flex-col justify-between">
        <div className="flex flex-row justify-between font-astronaut text-2xl h-8">
          <span>Entrants</span>
          <Pagination
            totalPages={10}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          <div className="flex flex-row items-center">
            <span className="w-6">
              <USER />
            </span>
            : {entrantsCount}
          </div>
        </div>
        <div className="w-full h-0.5 bg-retro-green/25" />
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
    </Card>
  );
};

export default EntrantsTable;
