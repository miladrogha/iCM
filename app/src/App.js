import "./App.css";
import Main from "./pages/main/Main";
function App() {
  return (
    <div className="App">
      {/* <div className="App-header"></div> */}
      <div className="App-mainBody">
        <Main />
      </div>
    </div>
  );
}

export default App;

// useEffect(() => {
//   axios
//     .get("http://127.0.0.1:5000/api/data")
//     .then((response) => {
//       setData(response.data); // Save data from response
//     })
//     .catch((err) => {
//       setError(err.message); // Handle errors
//     });
// }, []);

//<InteractiveCM
//   cm_h={500}
//   cm_w={500}
//   canvas_w={600}
//   canvas_h={600}
//   cm_data={"/data/data.csv"}
//   labels={["DLB", "None"]}
//
// />
