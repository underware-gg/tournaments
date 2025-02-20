import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ARROW_LEFT, TROPHY } from "@/components/Icons";
import { useNavigate, useParams } from "react-router-dom";
import EntrantsTable from "@/components/tournament/table/EntrantsTable";
import TournamentTimeline from "@/components/TournamentTimeline";
import { bigintToHex, feltToString, formatTime } from "@/lib/utils";
import { addAddressPadding } from "starknet";
import {
  useGetTournamentDetailsQuery,
  useSubscribeGamesQuery,
  useSubscribeEntriesQuery,
  useGetGameCounterQuery,
} from "@/dojo/hooks/useSdkQueries";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import {
  Tournament as TournamentModel,
  Prize,
  Token,
  EntryCount,
  ModelsMapping,
} from "@/generated/models.gen";
import { useDojoStore } from "@/dojo/hooks/useDojoStore";
import { useDojo } from "@/context/dojo";
import {
  calculateTotalValue,
  countTotalNFTs,
  getErc20TokenSymbols,
  groupPrizesByPositions,
  groupPrizesByTokens,
} from "@/lib/utils/formatting";
import useModel from "@/dojo/hooks/useModel";
import { useGameNamespace } from "@/dojo/hooks/useGameNamespace";
import { EnterTournamentDialog } from "@/components/dialogs/EnterTournament";
import ScoreTable from "@/components/tournament/table/ScoreTable";
import { ChainId } from "@/dojo/config";
import { TOURNAMENT_VERSION_KEY } from "@/lib/constants";
import { useEkuboPrices } from "@/hooks/useEkuboPrices";
import MyEntries from "@/components/tournament/MyEntries";
import TokenGameIcon from "@/components/icons/TokenGameIcon";
import EntryRequirements from "@/components/tournament/EntryRequirements";
import PrizesContainer from "@/components/tournament/prizes/PrizesContainer";

const Tournament = () => {
  const { id } = useParams<{ id: string }>();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { nameSpace, selectedChainConfig } = useDojo();
  const state = useDojoStore.getState();
  const [enterDialogOpen, setEnterDialogOpen] = useState(false);

  const isSepolia = selectedChainConfig.chainId === ChainId.SN_SEPOLIA;
  // const tournament = tournaments[Number(id)];

  const { entities: tournamentDetails } = useGetTournamentDetailsQuery(
    addAddressPadding(bigintToHex(id!))
  );

  const tournamentEntityId = useMemo(
    () => getEntityIdFromKeys([BigInt(id!)]),
    [id]
  );

  const prizes: Prize[] = (tournamentDetails
    ?.filter((detail) => detail.Prize)
    .map((detail) => detail.Prize) ?? []) as unknown as Prize[];

  const tournamentModel = state.getEntity(tournamentEntityId)?.models[nameSpace]
    .Tournament as TournamentModel;
  const tokenModels = state.getEntitiesByModel(nameSpace, "Token");
  const tokens = tokenModels.map(
    (model) => model.models[nameSpace].Token
  ) as Token[];

  // entry count model
  const entryCountModel = useModel(
    tournamentEntityId,
    ModelsMapping.EntryCount
  ) as unknown as EntryCount;

  const { gameNamespace } = useGameNamespace(
    tournamentModel?.game_config?.address
  );

  const { entity: gameCounterEntity } = useGetGameCounterQuery({
    key: addAddressPadding(BigInt(TOURNAMENT_VERSION_KEY)),
    nameSpace: gameNamespace ?? "",
  });

  const gameCount = gameCounterEntity?.GameCounter?.count ?? 0;

  useSubscribeEntriesQuery();

  useSubscribeGamesQuery({
    nameSpace: gameNamespace ?? "",
    isSepolia: isSepolia,
  });

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
  }, [tournamentModel?.metadata.description]); // Recheck when description changes

  const groupedByTokensPrizes = groupPrizesByTokens(prizes, tokens);

  const erc20TokenSymbols = getErc20TokenSymbols(groupedByTokensPrizes);
  const { prices } = useEkuboPrices({ tokens: erc20TokenSymbols });
  const totalPrizesValueUSD = calculateTotalValue(
    groupedByTokensPrizes,
    prices
  );

  const totalPrizeNFTs = countTotalNFTs(groupedByTokensPrizes);

  if (!tournamentModel) {
    return (
      <div className="w-3/4 h-full m-auto flex items-center justify-center">
        <span className="font-astronaut text-2xl">Loading tournament...</span>
      </div>
    );
  }

  const durationSeconds = Number(
    BigInt(tournamentModel?.schedule.game.end) -
      BigInt(tournamentModel?.schedule.game.start)
  );

  const registrationType = tournamentModel?.schedule.registration.isNone()
    ? "open"
    : "fixed";

  const groupedPrizes = groupPrizesByPositions(prizes, tokens);
  const lowestPrizePosition =
    Object.keys(groupedPrizes).length > 0
      ? Math.max(...Object.keys(groupedPrizes).map(Number))
      : 0;

  const hasEntryFee = tournamentModel?.entry_fee.isSome();

  const entryFee = tournamentModel?.entry_fee.isSome()
    ? Number(BigInt(tournamentModel?.entry_fee.Some?.amount!) / 10n ** 18n)
    : "Free";

  const isStarted =
    Number(tournamentModel?.schedule.game.start) <
    Number(BigInt(Date.now()) / 1000n);

  const isEnded =
    Number(tournamentModel?.schedule.game.end) <
    Number(BigInt(Date.now()) / 1000n);

  const startsIn =
    Number(tournamentModel?.schedule.game.start) -
    Number(BigInt(Date.now()) / 1000n);
  const endsIn =
    Number(tournamentModel?.schedule.game.end) -
    Number(BigInt(Date.now()) / 1000n);

  const status = useMemo(() => {
    if (isEnded) return "ended";
    if (isStarted) return "live";
    return "upcoming";
  }, [isStarted, isEnded]);

  return (
    <div className="w-3/4 px-20 pt-20 mx-auto flex flex-col gap-5">
      <div className="flex flex-row justify-between">
        <Button variant="outline" onClick={() => navigate("/")}>
          <ARROW_LEFT />
          Back
        </Button>
        <div className="flex flex-row items-center gap-5">
          <span className="text-retro-green uppercase font-astronaut text-2xl">
            {status}
          </span>
          <TokenGameIcon
            game={tournamentModel?.game_config?.address}
            size={"md"}
          />
          {/* <Button variant="outline">
            <PLUS /> Add Prizes
          </Button> */}
          <EntryRequirements tournamentModel={tournamentModel} />
          {((registrationType === "fixed" && !isStarted) ||
            (registrationType === "open" && !isEnded)) && (
            <Button
              className="uppercase"
              onClick={() => setEnterDialogOpen(true)}
            >
              <TROPHY />
              {` Enter | `}
              <span className="font-bold">
                {hasEntryFee ? `$${entryFee}` : "Free"}
              </span>
            </Button>
          )}
          <EnterTournamentDialog
            open={enterDialogOpen}
            onOpenChange={setEnterDialogOpen}
            hasEntryFee={hasEntryFee}
            entryFee={entryFee}
            tournamentModel={tournamentModel}
            entryCountModel={entryCountModel}
            gameCount={gameCount}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center h-12 justify-between">
          <div className="flex flex-row gap-5">
            <span className="font-astronaut text-4xl">
              {feltToString(tournamentModel.metadata.name)}
            </span>
            <div className="flex flex-row items-center gap-4 text-retro-green-dark">
              <div className="flex flex-row gap-2">
                <span>Pot:</span>
                <span className="text-retro-green">
                  {totalPrizesValueUSD > 0 || totalPrizeNFTs > 0 ? (
                    <div className="flex flex-row items-center gap-2">
                      {totalPrizesValueUSD > 0 && (
                        <span>${totalPrizesValueUSD}</span>
                      )}
                      {totalPrizeNFTs > 0 && (
                        <span>
                          {totalPrizeNFTs} NFT{totalPrizeNFTs === 1 ? "" : "s"}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span>No Prizes</span>
                  )}
                </span>
              </div>
              <div className="flex flex-row gap-2">
                <span>Winners:</span>
                <span className="text-retro-green">Top 5</span>
              </div>
              <div className="flex flex-row gap-2">
                <span>Duration:</span>
                <span className="text-retro-green">
                  {formatTime(durationSeconds)}
                </span>
              </div>
              <div className="flex flex-row gap-2">
                <span>Registration:</span>
                <span className="text-retro-green">
                  {registrationType.charAt(0).toUpperCase() +
                    registrationType.slice(1)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            {isStarted ? (
              <div>
                <span className="text-retro-green-dark">Ends In: </span>
                <span className="text-retro-green">{formatTime(endsIn)}</span>
              </div>
            ) : (
              <div>
                <span className="text-retro-green-dark">Starts In: </span>
                <span className="text-retro-green">{formatTime(startsIn)}</span>
              </div>
            )}
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
              }`}
            >
              {tournamentModel?.metadata?.description}
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
      </div>
      <div className="flex flex-col gap-10">
        <div className="flex flex-row h-[150px] gap-5">
          <div className="w-1/2 flex justify-center items-center">
            <TournamentTimeline
              type={registrationType}
              createdTime={Number(tournamentModel?.created_at)}
              startTime={Number(tournamentModel?.schedule.game.start)}
              duration={durationSeconds}
              submissionPeriod={Number(
                tournamentModel?.schedule.submission_duration
              )}
              pulse={true}
            />
          </div>
          <div className="w-1/2">
            <PrizesContainer
              prizesExist={prizes.length > 0}
              lowestPrizePosition={lowestPrizePosition}
              groupedPrizes={groupedPrizes}
            />
          </div>
        </div>
        <div className="flex flex-row gap-5">
          {registrationType === "fixed" && !isStarted ? (
            <EntrantsTable
              tournamentId={tournamentModel?.id}
              entryCount={entryCountModel ? Number(entryCountModel.count) : 0}
              gameAddress={tournamentModel?.game_config?.address}
              gameNamespace={gameNamespace ?? ""}
            />
          ) : isStarted && !isEnded ? (
            <ScoreTable
              tournamentId={tournamentModel?.id}
              entryCount={entryCountModel ? Number(entryCountModel.count) : 0}
              gameAddress={tournamentModel?.game_config?.address}
              gameNamespace={gameNamespace ?? ""}
            />
          ) : (
            <></>
          )}
          <MyEntries
            tournamentId={tournamentModel?.id}
            gameAddress={tournamentModel?.game_config?.address}
            gameNamespace={gameNamespace ?? ""}
            isSepolia={isSepolia}
          />
        </div>
      </div>
    </div>
  );
};

export default Tournament;
