import "./Main.css";
import axios from "axios";
import InteractiveCM from "../../components/icm/InteractiveCM";
import { useEffect, useState } from "react";
import * as d3 from "d3";

export default function Main() {
  const [file, setFile] = useState(null);
  const [sysMessage, setSysMessage] = useState(null);
  const [response, setResponse] = useState(null);
  const [isInfoComplete, setIsInfoComplete] = useState(false);
  const [labelTrue, setLabelTrue] = useState("");
  const [labelPred, setLabelPred] = useState("");
  const [classNames, setClassNames] = useState("");
  const [positive, setPositive] = useState("");
  const [csvData, setCSVData] = useState(null);

  useEffect(() => {
    if (labelTrue && labelPred && file && positive && classNames) {
      setIsInfoComplete(true);
    } else {
      setIsInfoComplete(false);
    }
  }, [labelTrue, labelPred, file, positive, classNames]);

  function handleFileChange(e) {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    console.log("File uploaded:", uploadedFile.name);
  }

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target.result;
        try {
          const parsedData = d3.csvParse(csvText);
          setCSVData(parsedData);
        } catch (error) {
          console.error("Error parsing CSV:", error);
          setSysMessage(
            "Failed to parse the CSV file. Please check the format."
          );
        }
      };
      reader.readAsText(file);
    }
  }, [file]);

  async function handlesendFile() {
    if (!file) {
      setSysMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "attributes",
      JSON.stringify({
        y_true: labelTrue,
        y_pred: labelPred,
        positive_class: positive,
        class_names: classNames,
      })
    );
    await axios
      .post("/api/upload", formData, {
        headers: {
          "content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setSysMessage(res.data.message);
        setResponse(res.data.metrics);
        console.log(res.data.metrics);
      })
      .catch((err) => {
        console.error(err);
        setSysMessage("Failed to upload the file!");
      });
  }
  useEffect(() => {
    if (csvData) {
      console.log("Parsed CSV Data:", csvData);
    }
  }, [csvData]);

  return (
    <div className="main-layout">
      <h1>Clarity Matrix</h1>
      <div className="formContainer">
        <section className="formSection">
          <label htmlFor="fileSelector">Please select your dataset:</label>
          <input
            id="fileSelector"
            type="file"
            accept=".csv"
            placeholder="Enter data path"
            onChange={handleFileChange}
          />
        </section>
        <section className="formSection">
          <label htmlFor="yTrue">Actual labels column name:</label>
          <input
            id="yTrue"
            type="text"
            placeholder={labelTrue ? "" : "Ground truth"}
            value={labelTrue}
            autoComplete="off"
            onChange={(e) => setLabelTrue(e.target.value)}
          />

          <label htmlFor="yPred">Predicted labels column name:</label>
          <input
            id="yPred"
            type="text"
            placeholder="Predicted"
            autoComplete="off"
            value={labelPred}
            onChange={(e) => setLabelPred(e.target.value)}
          />
        </section>

        <section className="formSection">
          <label htmlFor="positiveClass">Positive class:</label>
          <input
            id="positiveClass"
            type="text"
            placeholder="Positive class name"
            value={positive}
            autoComplete="off"
            onChange={(e) => setPositive(e.target.value)}
          />
          <label htmlFor="classNames">Class names:</label>
          <input
            id="classNames"
            type="text"
            placeholder="class names"
            value={classNames}
            autoComplete="off"
            onChange={(e) => setClassNames(e.target.value)}
          />
        </section>

        <section className="formSectionSubmit">
          <button
            type="button"
            onClick={handlesendFile}
            disabled={!isInfoComplete}
          >
            Send
          </button>
          <p> {sysMessage}</p>
        </section>
      </div>
      <div className="modelInfoContainer">
        <div className="model-metrics">
          <h2> Model Performance Metrics</h2>
          {response
            ? Object.keys(response).map((d, i) => {
                return (
                  <p key={`metric_${i}`}>{`${d} : ${response[d].toFixed(
                    2
                  )}`}</p>
                );
              })
            : ""}
        </div>
        <div className="visContainer">
          {isInfoComplete ? (
            <InteractiveCM
              cm_w={500}
              cm_h={500}
              cm_data={csvData}
              canvas_w={400}
              canvas_h={400}
              labels={classNames.split(",")}
            />
          ) : (
            "No visualization."
          )}
        </div>

        <div className="dataTable">
          {csvData ? (
            <table>
              <thead>
                <tr>
                  {Object.keys(csvData[0] || {}).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.slice(0, 10).map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, idx) => (
                      <td key={idx}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No CSV data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
