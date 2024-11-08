import "./App.css";
import InteractiveCM from "./components/icm/InteractiveCM";

function App() {
  return (
    <div className="App">
      <InteractiveCM
        h={500}
        w={500}
        cw={600}
        ch={600}
        labels={["DLB", "None"]}
      />
    </div>
  );
}

export default App;
