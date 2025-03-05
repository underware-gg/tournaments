import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ARROW_LEFT, TROPHY, MONEY } from "@/components/Icons";
import { useNavigate, useParams } from "react-router-dom";
import EntrantsTable from "@/components/tournament/table/EntrantsTable";
import TournamentTimeline from "@/components/TournamentTimeline";
import { bigintToHex, feltToString, formatTime } from "@/lib/utils";
import { addAddressPadding } from "starknet";
import {
  useSubscribeGamesQuery,
  useSubscribeTournamentEntriesQuery,
  useGetGameCounterQuery,
  useGetTournamentQuery,
  useSubscribeTournamentQuery,
  useSubscribeScoresQuery,
  useGetScoresQuery,
} from "@/dojo/hooks/useSdkQueries";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import {
  Tournament as TournamentModel,
  Prize,
  Token,
  EntryCount,
  ModelsMapping,
  PrizeClaim,
  Leaderboard,
} from "@/generated/models.gen";
import { useDojoStore } from "@/dojo/hooks/useDojoStore";
import { useDojo } from "@/context/dojo";
import {
  calculateTotalValue,
  countTotalNFTs,
  extractEntryFeePrizes,
  getClaimablePrizes,
  getErc20TokenSymbols,
  groupPrizesByPositions,
  groupPrizesByTokens,
} from "@/lib/utils/formatting";
import useModel from "@/dojo/hooks/useModel";
import { useGameEndpoints } from "@/dojo/hooks/useGameEndpoints";
import { EnterTournamentDialog } from "@/components/dialogs/EnterTournament";
import ScoreTable from "@/components/tournament/table/ScoreTable";
import { TOURNAMENT_VERSION_KEY } from "@/lib/constants";
import { useEkuboPrices } from "@/hooks/useEkuboPrices";
import MyEntries from "@/components/tournament/MyEntries";
import TokenGameIcon from "@/components/icons/TokenGameIcon";
import EntryRequirements from "@/components/tournament/EntryRequirements";
import PrizesContainer from "@/components/tournament/prizes/PrizesContainer";
import { ClaimPrizesDialog } from "@/components/dialogs/ClaimPrizes";
import { SubmitScoresDialog } from "@/components/dialogs/SubmitScores";
import { useGetTournamentsCount } from "@/dojo/hooks/useSqlQueries";
import NotFound from "@/containers/NotFound";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useUIStore from "@/hooks/useUIStore";

const Tournament = () => {
  const { id } = useParams<{ id: string }>();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { nameSpace } = useDojo();
  const state = useDojoStore.getState();
  const { gameData } = useUIStore();
  const [enterDialogOpen, setEnterDialogOpen] = useState(false);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [submitScoresDialogOpen, setSubmitScoresDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tournamentExists, setTournamentExists] = useState(false);
  const [allPricesFound, setAllPricesFound] = useState(true);

  const { data: tournamentsCount } = useGetTournamentsCount({
    namespace: nameSpace,
  });

  useEffect(() => {
    let timeoutId: number;

    const checkTournament = async () => {
      const tournamentId = Number(id || 0);

      // If we have the tournament count, we can check immediately
      if (tournamentsCount !== undefined) {
        setTournamentExists(tournamentId <= tournamentsCount);
        setLoading(false);
      } else {
        // Set a timeout to consider the tournament as "not found" if data doesn't load within 5 seconds
        timeoutId = window.setTimeout(() => {
          setTournamentExists(false);
          setLoading(false);
        }, 5000);
      }
    };

    checkTournament();

    // Clean up the timeout if the component unmounts or dependencies change
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [id, tournamentsCount]);

  useGetTournamentQuery(addAddressPadding(bigintToHex(id!)));
  useSubscribeTournamentQuery(addAddressPadding(bigintToHex(id!)));

  const tournamentEntityId = useMemo(
    () => getEntityIdFromKeys([BigInt(id!)]),
    [id]
  );

  const tournamentModel = state.getEntity(tournamentEntityId)?.models[nameSpace]
    ?.Tournament as TournamentModel;

  const entryCountModel = useModel(
    tournamentEntityId,
    ModelsMapping.EntryCount
  ) as unknown as EntryCount;

  const leaderboardModel = useModel(
    tournamentEntityId,
    ModelsMapping.Leaderboard
  ) as unknown as Leaderboard;

  const leaderboardSize = Number(tournamentModel?.game_config.prize_spots);

  const totalSubmissions = leaderboardModel?.token_ids.length ?? 0;

  const tournamentPrizes = state.getEntitiesByModel(nameSpace, "Prize");

  const prizes: Prize[] = (tournamentPrizes
    ?.filter(
      (detail) =>
        detail.models?.[nameSpace]?.Prize?.tournament_id === Number(id)
    )
    .map((detail) => detail.models[nameSpace].Prize) ??
    []) as unknown as Prize[];

  const entryFeePrizes = extractEntryFeePrizes(
    tournamentModel?.id,
    tournamentModel?.entry_fee,
    entryCountModel?.count ?? 0
  );

  const allPrizes = [...entryFeePrizes, ...prizes];

  const tournamentClaimedPrizes = state.getEntitiesByModel(
    nameSpace,
    "PrizeClaim"
  );

  const claimedPrizes: PrizeClaim[] = (tournamentClaimedPrizes
    ?.filter(
      (detail) =>
        detail.models?.[nameSpace]?.PrizeClaim?.tournament_id === Number(id)
    )
    .map((detail) => detail.models[nameSpace].PrizeClaim) ??
    []) as unknown as PrizeClaim[];

  const { claimablePrizes, claimablePrizeTypes } = getClaimablePrizes(
    allPrizes,
    claimedPrizes,
    totalSubmissions
  );

  const allClaimed = claimablePrizes.length === 0;

  const tokenModels = state.getEntitiesByModel(nameSpace, "Token");
  const tokens = tokenModels.map(
    (model) => model.models[nameSpace].Token
  ) as Token[];

  const { gameNamespace, gameScoreModel, gameScoreAttribute } =
    useGameEndpoints(tournamentModel?.game_config?.address);

  console.log(gameScoreModel, gameScoreAttribute);

  const gameAddress = tournamentModel?.game_config?.address;
  const gameName = gameData.find(
    (game) => game.contract_address === gameAddress
  )?.name;

  // subscribe and fetch game scores
  useSubscribeScoresQuery(gameNamespace ?? "", gameScoreModel ?? "");
  useGetScoresQuery(gameNamespace ?? "", gameScoreModel ?? "");

  const { entity: gameCounterEntity } = useGetGameCounterQuery({
    key: addAddressPadding(BigInt(TOURNAMENT_VERSION_KEY)),
    nameSpace: gameNamespace ?? "",
  });

  const gameCount = gameCounterEntity?.GameCounter?.count ?? 0;

  useSubscribeTournamentEntriesQuery({
    tournamentId: addAddressPadding(bigintToHex(id!)),
  });

  useSubscribeGamesQuery({
    gameNamespace: gameNamespace ?? "",
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
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [tournamentModel?.metadata.description]);

  const groupedByTokensPrizes = groupPrizesByTokens(allPrizes, tokens);

  const erc20TokenSymbols = getErc20TokenSymbols(groupedByTokensPrizes);

  const durationSeconds = Number(
    BigInt(tournamentModel?.schedule?.game?.end ?? 0n) -
      BigInt(tournamentModel?.schedule?.game?.start ?? 0n)
  );

  const registrationType = tournamentModel?.schedule.registration.isNone()
    ? "open"
    : "fixed";

  const groupedPrizes = groupPrizesByPositions(allPrizes, tokens);

  const lowestPrizePosition =
    Object.keys(groupedPrizes).length > 0
      ? Math.max(...Object.keys(groupedPrizes).map(Number))
      : 0;

  const hasEntryFee = tournamentModel?.entry_fee.isSome();

  const entryFeeToken = tournamentModel?.entry_fee.Some?.token_address;
  const entryFeeTokenSymbol = tokens.find(
    (t) => t.address === entryFeeToken
  )?.symbol;

  const { prices, isLoading: pricesLoading } = useEkuboPrices({
    tokens: [...erc20TokenSymbols, entryFeeTokenSymbol ?? ""],
  });

  useEffect(() => {
    const allPricesExist = Object.keys(prizes).every(
      (symbol) => prices[symbol] !== undefined
    );

    setAllPricesFound(allPricesExist);
  }, [prices, prizes]);

  const totalPrizesValueUSD = calculateTotalValue(
    groupedByTokensPrizes,
    prices,
    allPricesFound
  );

  const totalPrizeNFTs = countTotalNFTs(groupedByTokensPrizes);

  const entryFeePrice = prices[entryFeeTokenSymbol ?? ""];

  const entryFee = tournamentModel?.entry_fee.isSome()
    ? (
        Number(BigInt(tournamentModel?.entry_fee.Some?.amount!) / 10n ** 18n) *
        Number(entryFeePrice)
      ).toFixed(2)
    : "Free";

  const isStarted =
    Number(tournamentModel?.schedule.game.start) <
    Number(BigInt(Date.now()) / 1000n);

  const isEnded =
    Number(tournamentModel?.schedule.game.end) <
    Number(BigInt(Date.now()) / 1000n);

  const isSubmitted =
    Number(
      BigInt(tournamentModel?.schedule.game.end ?? 0n) +
        BigInt(tournamentModel?.schedule.submission_duration ?? 0n)
    ) < Number(BigInt(Date.now()) / 1000n);

  // const isSubmitted = false;

  const startsIn =
    Number(tournamentModel?.schedule.game.start) -
    Number(BigInt(Date.now()) / 1000n);
  const endsIn =
    Number(tournamentModel?.schedule.game.end) -
    Number(BigInt(Date.now()) / 1000n);
  const submissionEndsIn =
    Number(
      BigInt(tournamentModel?.schedule.game.end ?? 0n) +
        BigInt(tournamentModel?.schedule.submission_duration ?? 0n)
    ) - Number(BigInt(Date.now()) / 1000n);

  const status = useMemo(() => {
    if (isEnded) return "ended";
    if (isStarted) return "live";
    return "upcoming";
  }, [isStarted, isEnded]);

  const hasPrizes = Object.keys(groupedPrizes).length > 0;

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-black/20 backdrop-blur-sm z-50">
        <div className="relative w-16 h-16">
          <div className="absolute w-full h-full border-4 border-primary rounded-full animate-ping opacity-75"></div>
          <div className="absolute w-full h-full border-4 border-primary-dark rounded-full animate-pulse"></div>
        </div>
        <span className="font-astronaut text-2xl text-primary-dark animate-pulse">
          Loading tournament...
        </span>
      </div>
    );
  }

  if (!tournamentExists) {
    return <NotFound message={`Tournament not found: ${id}`} />;
  }

  return (
    <div className="sm:w-3/4 sm:mx-auto flex flex-col gap-5">
      <div className="flex flex-row justify-between">
        <Button
          variant="outline"
          className="px-2"
          onClick={() => navigate("/")}
        >
          <ARROW_LEFT />
          <span className="hidden sm:block">Back</span>
        </Button>
        <div className="flex flex-row items-center gap-5">
          <span className="text-primary uppercase font-astronaut text-lg sm:text-2xl">
            {status}
          </span>
          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center cursor-pointer">
                <TokenGameIcon game={gameAddress} size={"md"} />
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="center"
              sideOffset={5}
              className="bg-black text-neutral-500 border border-primary-dark px-2 py-1 rounded text-sm z-50"
            >
              {gameName ? feltToString(gameName) : "Unknown"}
            </TooltipContent>
          </Tooltip>
          {/* <Button variant="outline">
            <PLUS /> Add Prizes
          </Button> */}
          <EntryRequirements tournamentModel={tournamentModel} />
          {(registrationType === "fixed" && !isStarted) ||
          (registrationType === "open" && !isEnded) ? (
            <Button
              className="uppercase p-2 sm:p-4"
              onClick={() => setEnterDialogOpen(true)}
            >
              <TROPHY />
              <span className="hidden sm:block">Enter | </span>
              <span className="font-bold text-xs sm:text-base">
                {hasEntryFee ? `$${entryFee}` : "Free"}
              </span>
            </Button>
          ) : isEnded && !isSubmitted ? (
            <Button
              className="uppercase"
              onClick={() => setSubmitScoresDialogOpen(true)}
            >
              <TROPHY />
              {` Submit Scores`}
            </Button>
          ) : isSubmitted ? (
            <Button
              className="uppercase"
              onClick={() => setClaimDialogOpen(true)}
              disabled={allClaimed}
            >
              <MONEY />
              {allClaimed ? (
                <span className="hidden sm:block">Prizes Claimed</span>
              ) : (
                <>
                  <span className="hidden sm:block">Send Prizes |</span>
                  <span className="font-bold">{claimablePrizes.length}</span>
                </>
              )}
            </Button>
          ) : (
            <></>
          )}
          <EnterTournamentDialog
            open={enterDialogOpen}
            onOpenChange={setEnterDialogOpen}
            hasEntryFee={hasEntryFee}
            entryFee={entryFee}
            tournamentModel={tournamentModel}
            entryCountModel={entryCountModel}
            gameCount={gameCount}
            tokens={tokens}
          />
          <SubmitScoresDialog
            open={submitScoresDialogOpen}
            onOpenChange={setSubmitScoresDialogOpen}
            tournamentModel={tournamentModel}
            nameSpace={nameSpace}
            gameNamespace={gameNamespace ?? ""}
            gameScoreModel={gameScoreModel ?? ""}
            gameScoreAttribute={gameScoreAttribute ?? ""}
            gameAddress={tournamentModel?.game_config?.address}
            leaderboard={leaderboardModel}
          />
          <ClaimPrizesDialog
            open={claimDialogOpen}
            onOpenChange={setClaimDialogOpen}
            tournamentModel={tournamentModel}
            claimablePrizes={claimablePrizes}
            claimablePrizeTypes={claimablePrizeTypes}
            prices={prices}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="flex flex-row items-center h-8 sm:h-12 justify-between">
          <div className="flex flex-row gap-5">
            <span className="font-astronaut text-xl sm:text-4xl">
              {feltToString(tournamentModel?.metadata?.name ?? "")}
            </span>
            <div className="flex flex-row items-center gap-4 text-primary-dark">
              <div className="flex flex-row gap-2">
                <span className="hidden sm:block">Winners:</span>
                <span className="text-primary">Top {leaderboardSize}</span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="hidden sm:block">Registration:</span>
                <span className="text-primary">
                  {registrationType.charAt(0).toUpperCase() +
                    registrationType.slice(1)}
                </span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex flex-row">
            {!isStarted ? (
              <div>
                <span className="text-primary-dark">Starts In: </span>
                <span className="text-primary">{formatTime(startsIn)}</span>
              </div>
            ) : !isEnded ? (
              <div>
                <span className="text-primary-dark">Ends In: </span>
                <span className="text-primary">{formatTime(endsIn)}</span>
              </div>
            ) : !isSubmitted ? (
              <div>
                <span className="text-primary-dark">Submission Ends In: </span>
                <span className="text-primary">
                  {formatTime(submissionEndsIn)}
                </span>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div
          className={`flex ${
            isExpanded ? "flex-col" : "flex-row items-center"
          }`}
        >
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
                  ? "whitespace-pre-wrap text-xs sm:text-base"
                  : "overflow-hidden text-ellipsis whitespace-nowrap text-xs sm:text-base"
              }`}
            >
              {tournamentModel?.metadata?.description}
            </p>
          </div>
          {isOverflowing && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="self-start text-primary hover:text-primary-dark font-bold text-sm sm:text-base"
            >
              {isExpanded ? "See Less" : "See More"}
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-5 sm:gap-10">
        <div className="flex flex-col sm:flex-row sm:h-[150px] gap-5">
          <div className="sm:w-1/2 flex justify-center items-center pt-4 sm:pt-0">
            <TournamentTimeline
              type={registrationType}
              createdTime={Number(tournamentModel?.created_at ?? 0)}
              startTime={Number(tournamentModel?.schedule.game.start ?? 0)}
              duration={durationSeconds ?? 0}
              submissionPeriod={Number(
                tournamentModel?.schedule.submission_duration ?? 0
              )}
              pulse={true}
            />
          </div>
          <div className="sm:w-1/2">
            <PrizesContainer
              prizesExist={hasPrizes}
              lowestPrizePosition={lowestPrizePosition}
              groupedPrizes={groupedPrizes}
              totalPrizesValueUSD={totalPrizesValueUSD}
              totalPrizeNFTs={totalPrizeNFTs}
              prices={prices}
              pricesLoading={pricesLoading}
              allPricesFound={allPricesFound}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-5">
          {!isStarted ? (
            <EntrantsTable
              tournamentId={tournamentModel?.id}
              entryCount={entryCountModel ? Number(entryCountModel.count) : 0}
              gameAddress={tournamentModel?.game_config?.address}
              gameNamespace={gameNamespace ?? ""}
            />
          ) : isStarted ? (
            <ScoreTable
              tournamentId={tournamentModel?.id}
              entryCount={entryCountModel ? Number(entryCountModel.count) : 0}
              gameAddress={tournamentModel?.game_config?.address}
              gameNamespace={gameNamespace ?? ""}
              gameScoreModel={gameScoreModel ?? ""}
              gameScoreAttribute={gameScoreAttribute ?? ""}
              isEnded={isEnded}
            />
          ) : (
            <></>
          )}
          <MyEntries
            tournamentId={tournamentModel?.id}
            gameAddress={tournamentModel?.game_config?.address}
            gameNamespace={gameNamespace ?? ""}
            gameScoreModel={gameScoreModel ?? ""}
            gameScoreAttribute={gameScoreAttribute ?? ""}
          />
        </div>
      </div>
    </div>
  );
};

export default Tournament;
