import { Button } from "@/components/ui/button";
import {
  ARROW_LEFT,
  PLUS,
  TROPHY,
  USER,
  CLOCK,
  FLAG,
} from "@/components/Icons";
import { useNavigate, useParams } from "react-router-dom";
import { tournaments, participants } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import TokenGameIcon from "@/components/icons/TokenGameIcon";

const Tournament = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tournament = tournaments[Number(id)];
  return (
    <div className="w-3/4 p-20 mx-auto flex flex-col justify-between">
      <div className="flex flex-row">
        <Button variant="outline" onClick={() => navigate("/")}>
          <ARROW_LEFT />
          Back
        </Button>
      </div>
      <div className="flex flex-row items-center h-20 justify-between">
        <div className="flex flex-row gap-5">
          <span className="font-astronaut text-4xl">{tournament.name}</span>
          <div className="flex flex-row items-center gap-4 text-retro-green-dark">
            <span>
              Pot: <span className="text-retro-green">${tournament.pot}</span>
            </span>
            <span>
              Starts In:{" "}
              <span className="text-retro-green">
                {tournament.startsIn} Hours
              </span>
            </span>
          </div>
        </div>
        <div className="flex flex-row items-center gap-5">
          <Button>
            <PLUS /> Add Prizes
          </Button>
          <Button className="uppercase">
            <TROPHY /> Enter | ${tournament.fee}
          </Button>
        </div>
      </div>
      <div className="h-16 py-4">
        <span>{tournament.description}</span>
      </div>
      <div className="flex flex-row gap-5">
        <Card
          variant="outline"
          borderColor="rgba(0, 218, 163, 1)"
          className="w-1/2"
        >
          <div className="flex flex-col justify-between">
            <div className="flex flex-row justify-between font-astronaut text-2xl h-8">
              <span>Entrants</span>
              <div className="flex flex-row items-center">
                <span className="w-6">
                  <USER />
                </span>
                : {tournament.players}
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
        <Card
          variant="outline"
          borderColor="rgba(0, 218, 163, 1)"
          className="w-1/2 flex flex-col justify-between"
        >
          <div className="flex flex-row justify-between font-astronaut text-2xl h-8">
            <span>Structure</span>
            {/* <div className="flex flex-row items-center">
              <span className="w-6">
                <TROPHY />
              </span>
              : {tournament.pot}
            </div> */}
          </div>
          <div className="w-full h-0.5 bg-retro-green/25" />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-row gap-10 items-center overflow-scroll">
              {tournament.games.map((game, index) => (
                <>
                  <div key={index} className="flex  relative">
                    <div className="absolute top-8 left-[calc(100%_-_8px)] w-[calc(100%_+_12px)] h-0.5 border-t-4 border-dotted border-retro-green-dark" />

                    <div className="flex flex-col gap-2 w-24">
                      <TokenGameIcon game={game} size={"lg"} />
                      <div className="flex flex-row items-center justify-between font-astronaut">
                        <div className="flex flex-row items-center">
                          <span className="w-6">
                            <CLOCK />
                          </span>
                          <span>2H</span>
                        </div>
                        <div className="flex flex-row items-center">
                          <span className="w-6">
                            <TROPHY />
                          </span>
                          <span>20</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index == tournament.games.length - 1 && (
                    <div className="w-24 z-10 flex flex-col gap-2 items-center">
                      <Card
                        variant="outline"
                        className="p-2 text-retro-green-dark border-2 border-retro-green-dark h-14 w-14 flex items-center justify-center"
                      >
                        <span className="w-10">
                          <FLAG />
                        </span>
                      </Card>
                      <div className="flex flex-row items-center justify-center gap-2 font-astronaut">
                        <div className="flex flex-col items-center">
                          <span className="text-xs">21/04</span>
                          <span className="text-xs">00:00AM</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Tournament;
