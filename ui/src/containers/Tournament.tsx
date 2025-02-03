import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ARROW_LEFT, PLUS, TROPHY, CLOCK, FLAG } from "@/components/Icons";
import { useNavigate, useParams } from "react-router-dom";
import { tournaments } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import TokenGameIcon from "@/components/icons/TokenGameIcon";
import { motion } from "framer-motion";
import EntrantsTable from "@/components/tournament/EntrantsTable";

const Tournament = () => {
  const { id } = useParams<{ id: string }>();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const tournament = tournaments[Number(id)];

  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const isTextOverflowing =
          textRef.current.scrollWidth > textRef.current.clientWidth;
        setIsOverflowing(isTextOverflowing);
      }
    };

    checkOverflow();
    // Add resize listener to recheck on window resize
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [tournament.description]); // Recheck when description changes

  return (
    <div className="w-3/4 px-20 pt-20 mx-auto flex flex-col gap-5">
      <div className="flex flex-row justify-between">
        <Button variant="outline" onClick={() => navigate("/")}>
          <ARROW_LEFT />
          Back
        </Button>
        <div className="flex flex-row items-center gap-5">
          {/* <Button variant="outline">
            <PLUS /> Add Prizes
          </Button> */}
          <Button className="uppercase">
            <TROPHY /> Enter | ${tournament.fee}
          </Button>
        </div>
      </div>
      <div className="flex flex-row items-center h-14 justify-between">
        <div className="flex flex-row gap-5">
          <span className="font-astronaut text-4xl">{tournament.name}</span>
          <div className="flex flex-row items-center gap-4 text-retro-green-dark">
            <span>
              Pot: <span className="text-retro-green">${tournament.pot}</span>
            </span>
            {/* <span>
              Starts:{" "}
              <span className="text-retro-green">
                {tournament.startsIn} Hours
              </span>
            </span> */}
            {/* <span>
              Leaderboard: <span className="text-retro-green">Top 5</span>
            </span> */}
            <span>
              Duration: <span className="text-retro-green">24 Hours</span>
            </span>
            <span>
              Type: <span className="text-retro-green">{tournament.type}</span>
            </span>
          </div>
        </div>
      </div>
      <div className={`flex ${isExpanded ? "flex-col" : "flex-row"}`}>
        <div
          className={`
          relative overflow-hidden transition-[height] duration-300
          ${isExpanded ? "h-auto w-full" : "h-6 w-3/4"}
        `}
        >
          <p
            ref={textRef}
            className={`${
              isExpanded
                ? "whitespace-pre-wrap"
                : "overflow-hidden text-ellipsis whitespace-nowrap"
            }
    `}
          >
            {tournament.description}
          </p>
        </div>
        {isOverflowing && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="self-start text-retro-green hover:text-retro-green-dark font-bold"
          >
            {isExpanded ? "See Less" : "See More"}
          </button>
        )}
      </div>
      <div className="flex flex-row gap-5">
        <EntrantsTable />
        <Card
          variant="outline"
          borderColor="rgba(0, 218, 163, 1)"
          className="w-1/2 flex flex-col justify-between"
        >
          <div className="flex flex-row justify-between font-astronaut text-2xl h-8">
            <span>Structure</span>
          </div>
          <div className="w-full h-0.5 bg-retro-green/25" />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-row gap-10 items-center overflow-scroll">
              {tournament.games.map((game, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.2,
                  }}
                >
                  <div className="flex relative">
                    <motion.div
                      className="absolute top-0 left-[calc(100%)] flex flex-row items-center justify-between font-astronaut w-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.2 + 0.2,
                      }}
                    >
                      <div className="flex flex-row items-center">
                        <span className="w-6">
                          <TROPHY />
                        </span>
                        <span>20</span>
                      </div>
                    </motion.div>
                    <motion.div
                      className="absolute top-8 left-[calc(100%_-_8px)] w-[calc(100%_+_12px)] h-0.5 border-t-4 border-dotted border-retro-green-dark"
                      initial={{ width: 0 }}
                      animate={{ width: "calc(100% + 12px)" }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.2 + 0.3,
                        ease: "easeOut",
                      }}
                    />

                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: index * 0.2,
                      }}
                    >
                      <Card
                        variant="outline"
                        className="flex flex-col gap-2 w-24 items-center h-full hover:cursor-pointer"
                      >
                        <TokenGameIcon game={game} size={"md"} />
                        <div className="flex flex-row items-center justify-between font-astronaut">
                          <div className="flex flex-row items-center">
                            <span className="w-6">
                              <CLOCK />
                            </span>
                            <span>2H</span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
              {tournament.games.length > 0 && (
                <motion.div
                  className="w-24 flex flex-col gap-2 items-center"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: (tournament.games.length - 1) * 0.2 + 0.3,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                >
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
                      <span className="text-xs">00:00 AM</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </Card>
      </div>
      {/* <div className="flex flex-row gap-5">
        <Card
          variant="outline"
          borderColor="rgba(0, 218, 163, 1)"
          className="w-1/2 flex flex-col justify-between"
        >
          <div className="flex flex-row justify-between font-astronaut text-2xl h-8">
            <span>Prizes</span>
            <div className="flex flex-row items-center">
              <span className="w-6">
                <TROPHY />
              </span>
              : {5}
            </div>
          </div>
        </Card>
        <Card
          variant="outline"
          borderColor="rgba(0, 218, 163, 1)"
          className="w-1/2 flex flex-col justify-between"
        >
          <div className="flex flex-row justify-between font-astronaut text-2xl h-8">
            <span>Prizes</span>
            <div className="flex flex-row items-center">
              <span className="w-6">
                <TROPHY />
              </span>
              : {5}
            </div>
          </div>
        </Card>
      </div> */}
    </div>
  );
};

export default Tournament;
