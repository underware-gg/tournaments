import Header from "@/components/Header";
import GameFilters from "@/containers/GameFilters";

function App() {
  return (
    <div className="min-h-screen flex-col w-full">
      <Header />
      <div className="flex flex-row p-20 gap-5">
        <GameFilters />
        <div className="flex flex-col w-4/5">Hello</div>
      </div>
    </div>
  );
}

export default App;
