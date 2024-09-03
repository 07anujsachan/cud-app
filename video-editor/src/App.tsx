// import "./App.css";
import { Button } from "./components/ui/button";
import Home from "./Home";

function App() {
  return (
    <>
      <header className="flex justify-between p-8">
        <h1 className="text-3xl font-bold">Personalize.Ai</h1>
        <Button>Try it for Free</Button>
      </header>
      <div className=" bg-slate-200 h-screen">
        <Home />
      </div>
    </>
  );
}

export default App;
