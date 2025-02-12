import Header from "@/components/Header";
import Overview from "@/containers/Overview";
import Tournament from "@/containers/Tournament";
import CreateTournament from "@/containers/CreateTournament";
import RegisterToken from "@/containers/RegisterToken";
import { Routes, Route } from "react-router-dom";
import { useGetTokensQuery } from "@/dojo/hooks/useSdkQueries";
import { useGetUpcomingTournamentsCount } from "@/dojo/hooks/useSqlQueries";
import { addAddressPadding } from "starknet";
import { bigintToHex } from "@/lib/utils";

function App() {
  useGetTokensQuery();

  const currentTime = Math.floor(Date.now() / 1000);
  const formattedTime = addAddressPadding(bigintToHex(currentTime));

  useGetUpcomingTournamentsCount(formattedTime);

  return (
    <div className="min-h-screen flex-col w-full">
      <Header />
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/tournament">
          <Route path=":id" element={<Tournament />} />
        </Route>
        <Route path="/create-tournament" element={<CreateTournament />} />
        <Route path="/register-token" element={<RegisterToken />} />
      </Routes>
    </div>
  );
}

export default App;
