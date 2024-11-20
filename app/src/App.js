import "./App.css";
import InteractiveCM from "./components/icm/InteractiveCM";

function App() {
  return (
    <div className="App">
      <InteractiveCM
        cm_h={500}
        cm_w={500}
        canvas_w={600}
        canvas_h={600}
        cm_data={"/data/data.csv"}
        labels={["DLB", "None"]}
      />
    </div>
  );
}

export default App;
