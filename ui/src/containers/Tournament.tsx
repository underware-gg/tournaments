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
import { useSystemCalls } from "@/dojo/hooks/useSystemCalls";
import { ClaimPrizesDialog } from "@/components/dialogs/ClaimPrizesDialog";

const Tournament = () => {
  const { id } = useParams<{ id: string }>();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { nameSpace, selectedChainConfig } = useDojo();
  const state = useDojoStore.getState();
  const [enterDialogOpen, setEnterDialogOpen] = useState(false);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const { submitScores } = useSystemCalls();

  const isSepolia = selectedChainConfig.chainId === ChainId.SN_SEPOLIA;

  useGetTournamentQuery(addAddressPadding(bigintToHex(id!)));

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

  const { gameNamespace } = useGameNamespace(
    tournamentModel?.game_config?.address
  );

  const { entity: gameCounterEntity } = useGetGameCounterQuery({
    key: addAddressPadding(BigInt(TOURNAMENT_VERSION_KEY)),
    nameSpace: gameNamespace ?? "",
  });

  const gameCount = gameCounterEntity?.GameCounter?.count ?? 0;

  useSubscribeTournamentEntriesQuery({
    tournamentId: addAddressPadding(bigintToHex(id!)),
  });

  useSubscribeGamesQuery({
    nameSpace: gameNamespace ?? "",
    gameNamespace: gameNamespace ?? "",
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

  const totalPrizesValueUSD = calculateTotalValue(
    groupedByTokensPrizes,
    prices
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

  if (!tournamentModel) {
    return (
      <div className="w-3/4 h-full m-auto flex items-center justify-center">
        <span className="font-astronaut text-2xl">Loading tournament...</span>
      </div>
    );
  }

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
          {(registrationType === "fixed" && !isStarted) ||
          (registrationType === "open" && !isEnded) ? (
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
          ) : isEnded && !isSubmitted ? (
            <Button
              className="uppercase"
              onClick={() =>
                submitScores(
                  tournamentModel?.id,
                  feltToString(tournamentModel?.metadata.name),
                  [1, 2, 3]
                )
              }
            >
              <TROPHY />
              {` Submit Scores | `}
              <span className="font-bold">5</span>
            </Button>
          ) : isSubmitted ? (
            <Button
              className="uppercase"
              onClick={() => setClaimDialogOpen(true)}
              disabled={allClaimed}
            >
              <MONEY />
              {allClaimed ? (
                "Prizes Claimed"
              ) : (
                <>
                  Send Prizes |
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
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center h-12 justify-between">
          <div className="flex flex-row gap-5">
            <span className="font-astronaut text-4xl">
              {feltToString(tournamentModel.metadata.name)}
            </span>
            <div className="flex flex-row items-center gap-4 text-retro-green-dark">
              <div className="flex flex-row gap-2">
                <span>Winners:</span>
                <span className="text-retro-green">Top {leaderboardSize}</span>
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
            {!isStarted ? (
              <div>
                <span className="text-retro-green-dark">Starts In: </span>
                <span className="text-retro-green">{formatTime(startsIn)}</span>
              </div>
            ) : !isEnded ? (
              <div>
                <span className="text-retro-green-dark">Ends In: </span>
                <span className="text-retro-green">{formatTime(endsIn)}</span>
              </div>
            ) : !isSubmitted ? (
              <div>
                <span className="text-retro-green-dark">
                  Submission Ends In:{" "}
                </span>
                <span className="text-retro-green">
                  {formatTime(submissionEndsIn)}
                </span>
              </div>
            ) : (
              <></>
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
              prizesExist={hasPrizes}
              lowestPrizePosition={lowestPrizePosition}
              groupedPrizes={groupedPrizes}
              totalPrizesValueUSD={totalPrizesValueUSD}
              totalPrizeNFTs={totalPrizeNFTs}
              prices={prices}
              pricesLoading={pricesLoading}
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
          ) : isStarted ? (
            <ScoreTable
              tournamentId={tournamentModel?.id}
              entryCount={entryCountModel ? Number(entryCountModel.count) : 0}
              gameAddress={tournamentModel?.game_config?.address}
              gameNamespace={gameNamespace ?? ""}
              isEnded={isEnded}
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
