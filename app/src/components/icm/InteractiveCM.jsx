import * as d3 from "d3";
import "./InteractiveCM.css";
import { useEffect, useState, useRef } from "react";

export default function InteractiveCM({ w, h, cw, ch, labels }) {
  const [csvData, setCsvData] = useState([]); // State variable to store CSV data
  const svgRef = useRef(null); // Ref for the SVG container

  useEffect(() => {
    // Load the CSV file and store data in state
    async function loadData() {
      try {
        const data = await d3.csv("/data/data.csv"); // Adjust path to your CSV file
        setCsvData(data); // Store CSV data in the state variable
      } catch (error) {
        console.error("Error loading the CSV data:", error);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (csvData.length > 0) {
      // Clear any existing SVG elements to avoid duplicates
      d3.select(svgRef.current).selectAll("*").remove();
      // Horizontal offset
      const gx = cw - w;
      const gy = ch - h;
      //center of the canvas
      const ox = cw / 2;
      const oy = ch / 2;

      // Define the SVG dimensions and create an SVG container
      const svgContainer = d3
        .select(svgRef.current)
        .attr("width", cw)
        .attr("height", ch);

      // Annotation group for "Actual" and "Prediction" labels
      const annot = svgContainer.append("g").attr("name", "annot");

      // "Actual" label, rotated and positioned on the left side
      annot
        .append("text")
        .attr("x", 20) // Position slightly inside the SVG
        .attr("y", ch / 2) // Center vertically
        .attr("text-anchor", "middle")
        .attr("font-size", 18)
        .attr("font-weight", "bold")
        .text("Actual")
        .attr("fill", "black")
        .attr("transform", `rotate(-90, 20, ${ch / 2})`);

      // "Prediction" label at the top
      annot
        .append("text")
        .attr("x", w / 2 + gx / 2) // Center horizontally
        .attr("y", 30) // Position near the top
        .attr("text-anchor", "middle")
        .attr("font-size", 18)
        .attr("font-weight", "bold")
        .text("Prediction")
        .attr("fill", "black");

      // Class labels (adjust these based on your class names)
      labels.map((d, i) =>
        annot
          .append("text")
          .attr("x", ((2 * i + 1) * w) / 4 + gx / 2)
          .attr("y", h + gy / 2 + 15) // Position below the quadrants
          .attr("text-anchor", "middle")
          .attr("font-size", 14)
          .text(`${d}`)
      );

      labels.map((d, i) =>
        annot
          .append("text")
          .attr("x", d3.min([gx / 2, 10]))
          .attr("y", ((2 * i + 1) * h) / 4 + gy / 2) // Position below the quadrants
          .attr("text-anchor", "start")
          .attr("font-size", 14)
          .text(`${d}`)
      );

      // Legend at the bottom
      const legend = svgContainer.append("g").attr("name", "legend");

      legend
        .append("circle")
        .attr("cx", gx)
        .attr("cy", h + 90)
        .attr("r", 7)
        .attr("fill", "indianred");

      legend
        .append("text")
        .attr("x", gx + 15)
        .attr("y", h + 95)
        .attr("text-anchor", "start")
        .attr("font-size", 14)
        .text("Match (Pred = Actual)");

      legend
        .append("circle")
        .attr("cx", cw / 2 + gx / 2)
        .attr("cy", h + 90)
        .attr("r", 7)
        .attr("fill", "steelblue");

      legend
        .append("text")
        .attr("x", cw / 2 + gx / 2 + 15)
        .attr("y", h + 95)
        .attr("text-anchor", "start")
        .attr("font-size", 14)
        .text("Mismatch (Pred ≠ Actual)");

      const randomCircularOffset = () => {
        const radius = d3.randomUniform(0, 80)(); // Random radius up to 50
        const angle = d3.randomUniform(0, 2 * Math.PI)(); // Random angle in radians
        return {
          dx: radius * Math.cos(angle),
          dy: radius * Math.sin(angle),
        };
      };
      // Coordination generator function
      function getCoord(d) {
        const { dx, dy } = randomCircularOffset();

        if (d.label === d.pred) {
          if (d.label === "DLB") {
            return { x: w / 4 + gx / 2 + dx, y: h / 4 + gy / 2 + dy };
          } else {
            return {
              x: (3 * w) / 4 + gx / 2 + dx,
              y: (3 * h) / 4 + gy / 2 + dy,
            };
          }
        } else {
          if (d.label === "DLB") {
            //False Negative
            return {
              x: (3 / 4) * w + gx / 2 + dx,
              y: (1 / 4) * h + gy / 2 + dy,
            };
          } else {
            return {
              x: (1 / 4) * w + gx / 2 + dx,
              y: (3 / 4) * h + gy / 2 + dy,
            };
          }
        }
      }

      var rectData = [
        { x: gx / 2, y: gy / 2, width: w / 2, height: h / 2 },
        { x: gx / 2, y: (h + gy) / 2, width: w / 2, height: h / 2 },
        { x: (w + gx) / 2, y: (h + gy) / 2, width: w / 2, height: h / 2 },
        { x: (w + gx) / 2, y: gy / 2, width: w / 2, height: h / 2 },
      ];
      var quarters = svgContainer.append("g").attr("name", "quarters");

      quarters
        .selectAll("rect")
        .data(rectData)
        .enter()
        .append("rect")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .attr("width", (d) => d.width)
        .attr("height", (d) => d.height)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("stroke-width", 0.5)
        .on("mouseEnter", () => {});

      const dataPoints = svgContainer.append("g").attr("name", "dataPoints");
      const tooltip = d3.select("#tooltip");
      dataPoints
        .selectAll("circle")
        .data(csvData)
        .enter()
        .append("circle")
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("r", 7)
        .attr("cx", (w + gx) / 2)
        .attr("cy", (h + gy) / 2)
        .attr("fill", (d) => (d.pred === d.label ? "indianred" : "steelblue"))
        .attr("fill-opacity", 0.4)
        .on("mouseover", function (event, d) {
          d3.select(this)
            .attr("r", 10)
            .attr("fill", "orange")
            .attr("fill-opacity", 0.7);
          tooltip
            .style("opacity", 0.8)
            .style("text-align", "left")
            .html(
              `<b>Text: </b> ${d.text.slice(2, -3)}<br><b>Label: </b> ${
                d.label
              }<br><b>Prediction: </b> ${d.pred}`
            )
            .style("left", `${event.pageX + 15}px`)
            .style("top", `${event.pageY + 15}px`);
        })
        .on("mousemove", function (event) {
          tooltip
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY + 10}px`);
        })
        .on("mouseout", function () {
          d3.select(this)
            .attr("r", 7)
            .attr("fill", (d) =>
              d.pred === d.label ? "indianred" : "steelblue"
            )
            .attr("fill-opacity", 0.4);

          tooltip.style("opacity", 0);
        })
        .transition()
        .duration(500)
        .delay((d, i) => i * 10) // Delay each point's animation
        .ease(d3.easeCircle)
        .attr("cx", (d) => getCoord(d).x)
        .attr("cy", (d) => getCoord(d).y)
        .attr("fill-opacity", 0.4); // Color from CSV or default to white;
    }
  }, [csvData]); // Only re-run this effect if csvData changes

  return (
    <div className="cmContainer">
      <svg ref={svgRef} />
      <p>Interactive Confusion Matrix</p>
      <div
        id="tooltip"
        style={{
          position: "absolute",
          opacity: 0,
          background: "rgba(230, 230, 230, 0.8)",
          padding: "5px",
          borderRadius: "14px",
        }}
      ></div>
    </div>
  );
}
