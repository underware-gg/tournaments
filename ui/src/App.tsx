import Header from "@/components/Header";
import Overview from "@/containers/Overview";
import Tournament from "@/containers/Tournament";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen flex-col w-full">
      <Header />
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/tournament">
          <Route path=":id" element={<Tournament />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
