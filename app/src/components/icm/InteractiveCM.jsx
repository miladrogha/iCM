import * as d3 from "d3";
import "./InteractiveCM.css";
import { useEffect, useState, useRef } from "react";
import * as metrics from "../../utilities/evaluation_metrics.js";

export default function InteractiveCM({
  cm_w,
  cm_h,
  cm_data,
  canvas_w,
  canvas_h,
  labels,
}) {
  // const [loadingData, setLoadingData] = useState(true); // State variable to store CSV data
  // const [csvData, setCsvData] = useState(null); // State variable to store CSV data
  // const [results, setResults] = useState(null);
  const svgRef = useRef(null); // Ref for the SVG container

  // useEffect(() => {
  //   if (cm_data && cm_data.length > 0) {
  //     setLoadingData(false);
  //   }
  // }, [cm_data]);

  // useEffect(() => {
  //   // Load the CSV file and store data in state
  //   async function loadData() {
  //     try {
  //       const data = await d3.csv(cm_data); // Adjust path to your CSV file
  //       console.log(data);
  //       setCsvData(data); // Store CSV data in the state variable
  //       setLoadingData(false);
  //     } catch (error) {
  //       console.error("Error loading the CSV data:", error);
  //     }
  //   }
  //   loadData();
  // }, []);

  // useEffect(() => {
  //   if (!loadingData && cm_data.length > 0) {
  //     const tp = [];
  //     const tn = [];
  //     const fp = [];
  //     const fn = [];

  //     cm_data.forEach((d) => {
  //       if (d.label === d.pred) {
  //         if (d.label === "DLB") {
  //           tp.push(d);
  //         } else {
  //           tn.push(d);
  //         }
  //       } else {
  //         if (d.label === "DLB") {
  //           fn.push(d);
  //         } else {
  //           fp.push(d);
  //         }
  //       }
  //     });

  //     setResults({ tp, tn, fp, fn });
  //   }
  // }, [cm_data, loadingData]);

  const tp = [];
  const tn = [];
  const fp = [];
  const fn = [];

  cm_data.forEach((d) => {
    if (d.label === d.pred) {
      if (d.label === "DLB") {
        tp.push(d);
      } else {
        tn.push(d);
      }
    } else {
      if (d.label === "DLB") {
        fn.push(d);
      } else {
        fp.push(d);
      }
    }
  });

  // useEffect(() => {
  //   d3.select(svgRef.current).selectAll("*").remove();
  //   // Horizontal offset
  //   const gx = canvas_w - cm_w;
  //   const gy = canvas_h - cm_h;
  //   //center of the canvas
  //   // const ox = canvas_w / 2;
  //   // const oy = canvas_h / 2;

  //   // Define the SVG dimensions and create an SVG container
  //   const svgContainer = d3
  //     .select(svgRef.current)
  //     .attr("width", canvas_w)
  //     .attr("height", canvas_h);

  //   // Groups
  //   const annot = svgContainer.append("g").attr("name", "annot"); // Annotation group for "Actual" and "Prediction" labels
  //   const legend = svgContainer.append("g").attr("name", "legend"); // Legend at the bottom
  //   const quadrants = svgContainer.append("g").attr("name", "quadrants"); // quadrants
  //   const dataPoints = svgContainer.append("g").attr("name", "dataPoints"); // Datapoints
  //   const hoverInfo = svgContainer.append("g").attr("name", "infoContainer"); // Info container when hover on quadrants
  //   if (!loadingData && cm_data.length > 0 && results) {
  //     // "Actual" label, rotated and positioned on the left side
  //     annot
  //       .append("text")
  //       .attr("x", 20) // Position slightly inside the SVG
  //       .attr("y", canvas_h / 2) // Center vertically
  //       .attr("text-anchor", "middle")
  //       .attr("font-size", 18)
  //       .attr("font-weight", "bold")
  //       .text("Actual")
  //       .attr("fill", "black")
  //       .attr("transform", `rotate(-90, 20, ${canvas_h / 2})`);

  //     // "Prediction" label at the top
  //     annot
  //       .append("text")
  //       .attr("x", cm_w / 2 + gx / 2) // Center horizontally
  //       .attr("y", 30) // Position near the top
  //       .attr("text-anchor", "middle")
  //       .attr("font-size", 18)
  //       .attr("font-weight", "bold")
  //       .text("Prediction")
  //       .attr("fill", "black");

  //     // Class labels (adjust these based on your class names)
  //     labels.map((d, i) =>
  //       annot
  //         .append("text")
  //         .attr("x", ((2 * i + 1) * cm_w) / 4 + gx / 2)
  //         .attr("y", cm_h + gy / 2 + 15) // Position below the quadrants
  //         .attr("text-anchor", "middle")
  //         .attr("font-size", 14)
  //         .text(`${d}`)
  //     );

  //     labels.map((d, i) =>
  //       annot
  //         .append("text")
  //         .attr("x", d3.min([gx / 2, 10]))
  //         .attr("y", ((2 * i + 1) * cm_h) / 4 + gy / 2) // Position below the quadrants
  //         .attr("text-anchor", "start")
  //         .attr("font-size", 14)
  //         .text(`${d}`)
  //     );

  //     legend
  //       .append("circle")
  //       .attr("cx", gx)
  //       .attr("cy", cm_h + 90)
  //       .attr("r", 7)
  //       .attr("fill", "indianred");

  //     legend
  //       .append("text")
  //       .attr("x", gx + 15)
  //       .attr("y", cm_h + 95)
  //       .attr("text-anchor", "start")
  //       .attr("font-size", 14)
  //       .text("Match (Pred = Actual)");

  //     legend
  //       .append("circle")
  //       .attr("cx", canvas_w / 2 + gx / 2)
  //       .attr("cy", cm_h + 90)
  //       .attr("r", 7)
  //       .attr("fill", "steelblue");

  //     legend
  //       .append("text")
  //       .attr("x", canvas_w / 2 + gx / 2 + 15)
  //       .attr("y", cm_h + 95)
  //       .attr("text-anchor", "start")
  //       .attr("font-size", 14)
  //       .text("Mismatch (Pred ≠ Actual)");

  //     const randomCircularOffset = () => {
  //       const radius = d3.randomUniform(0, cm_w / 5)(); // Random radius up to 50
  //       const angle = d3.randomUniform(0, 2 * Math.PI)(); // Random angle in radians
  //       return {
  //         dx: radius * Math.cos(angle),
  //         dy: radius * Math.sin(angle),
  //       };
  //     };
  //     // Coordination generator function
  //     function getCoord(d) {
  //       const { dx, dy } = randomCircularOffset();

  //       if (d.label === d.pred) {
  //         if (d.label === "DLB") {
  //           return { x: cm_w / 4 + gx / 2 + dx, y: cm_h / 4 + gy / 2 + dy };
  //         } else {
  //           return {
  //             x: (3 * cm_w) / 4 + gx / 2 + dx,
  //             y: (3 * cm_h) / 4 + gy / 2 + dy,
  //           };
  //         }
  //       } else {
  //         if (d.label === "DLB") {
  //           //False Negative
  //           return {
  //             x: (3 / 4) * cm_w + gx / 2 + dx,
  //             y: (1 / 4) * cm_h + gy / 2 + dy,
  //           };
  //         } else {
  //           return {
  //             x: (1 / 4) * cm_w + gx / 2 + dx,
  //             y: (3 / 4) * cm_h + gy / 2 + dy,
  //           };
  //         }
  //       }
  //     }

  //     var rectData = [
  //       {
  //         x: gx / 2,
  //         y: gy / 2,
  //         width: cm_w / 2,
  //         height: cm_h / 2,
  //         name: "tp",
  //       },
  //       {
  //         x: gx / 2,
  //         y: (cm_h + gy) / 2,
  //         width: cm_w / 2,
  //         height: cm_h / 2,
  //         name: "fp",
  //       },
  //       {
  //         x: (cm_w + gx) / 2,
  //         y: gy / 2,
  //         width: cm_w / 2,
  //         height: cm_h / 2,
  //         name: "fn",
  //       },
  //       {
  //         x: (cm_w + gx) / 2,
  //         y: (cm_h + gy) / 2,
  //         width: cm_w / 2,
  //         height: cm_h / 2,
  //         name: "tn",
  //       },
  //     ];

  //     function getDataType(d_label, d_pred) {
  //       const matchChecker = d_label === d_pred;
  //       if (matchChecker) {
  //         if (d_label === "DLB") {
  //           return "tp";
  //         } else {
  //           return "tn";
  //         }
  //       } else {
  //         if (d_label === "DLB") {
  //           return "fn";
  //         } else {
  //           return "fp";
  //         }
  //       }
  //     }

  //     quadrants
  //       .selectAll("rect")
  //       .data(rectData)
  //       .enter()
  //       .append("rect")
  //       .attr("x", (d) => d.x)
  //       .attr("y", (d) => d.y)
  //       .attr("name", (d) => d.name)
  //       .attr("width", (d) => d.width)
  //       .attr("height", (d) => d.height)
  //       .attr("fill", "white")
  //       .attr("stroke", "gray")
  //       .attr("stroke-width", 0.5);

  //     const tooltip = d3.select("#tooltip");
  //     dataPoints
  //       .selectAll("circle")
  //       .data(cm_data)
  //       .enter()
  //       .append("circle")
  //       .attr("stroke", "white")
  //       .attr("stroke-width", 1)
  //       .attr("r", 7)
  //       .attr("cx", (cm_w + gx) / 2)
  //       .attr("cy", (cm_h + gy) / 2)
  //       .attr("fill", (d) => (d.pred === d.label ? "indianred" : "steelblue"))
  //       .attr("fill-opacity", 0.0)
  //       .attr("dtype", (d) => getDataType(d.label, d.pred))
  //       .on("mouseover", function (event, d) {
  //         // Enlarge the hovered data point and change its color
  //         d3.select(this)
  //           .attr("r", 10)
  //           .attr("fill", "orange")
  //           .attr("fill-opacity", 0.7);

  //         // Show tooltip with detailed information
  //         tooltip
  //           .style("opacity", 0.8)
  //           .style("text-align", "left")
  //           .html(
  //             `<b>Text: </b> ${d.text.slice(2, -3)}<br><b>Label: </b> ${
  //               d.label
  //             }<br><b>Prediction: </b> ${d.pred}`
  //           )
  //           .style("left", `${event.pageX + 15}px`)
  //           .style("top", `${event.pageY + 15}px`);

  //         // Determine fill color based on whether prediction matches label
  //         const isMatch = d.pred === d.label;
  //         const fillColor = isMatch ? "indianred" : "steelblue";
  //         // Highlight the corresponding rectangle in 'quadrants' based on 'type' of the data point
  //         quadrants
  //           .selectAll("rect")
  //           .filter((rect) => rect.name === d3.select(this).attr("dtype")) // Select rectangle where `name` matches `type` of data point
  //           .attr("stroke-width", 2)
  //           .attr("fill", fillColor); // Apply the determined fill color
  //       })
  //       .on("mousemove", function (event) {
  //         tooltip
  //           .style("left", `${event.pageX + 10}px`)
  //           .style("top", `${event.pageY + 10}px`);
  //       })
  //       .on("mouseout", function (event, d) {
  //         d3.select(this)
  //           .attr("r", 7)
  //           .attr("fill", (d) =>
  //             d.pred === d.label ? "indianred" : "steelblue"
  //           )
  //           .attr("fill-opacity", 0.4);
  //         tooltip.style("opacity", 0);
  //         //clear fill
  //         quadrants
  //           .selectAll("rect")
  //           .filter((rect) => rect.name === d3.select(this).attr("dtype"))
  //           .attr("fill", "none")
  //           .attr("stroke-width", 0.5);
  //       })
  //       .transition()
  //       .duration(500)
  //       .delay((d, i) => i * 10) // Delay each point's animation
  //       .ease(d3.easeCircle)
  //       .attr("cx", (d) => getCoord(d).x)
  //       .attr("cy", (d) => getCoord(d).y)
  //       .attr("fill-opacity", 0.4); // Color from CSV or default to white;
  //   } else {
  //     // "Actual" label, rotated and positioned on the left side
  //     annot
  //       .append("text")
  //       .attr("x", 20) // Position slightly inside the SVG
  //       .attr("y", canvas_h / 2) // Center vertically
  //       .attr("text-anchor", "middle")
  //       .attr("font-size", 18)
  //       .attr("font-weight", "bold")
  //       .text("LOADING")
  //       .attr("fill", "black");
  //   }
  // }, [canvas_h, cm_data, canvas_w, cm_h, labels, loadingData, results, cm_w]); // Only re-run this effect if cm_data changes
  d3.select(svgRef.current).selectAll("*").remove();
  // Horizontal offset
  const gx = canvas_w - cm_w;
  const gy = canvas_h - cm_h;
  //center of the canvas
  // const ox = canvas_w / 2;
  // const oy = canvas_h / 2;

  // Define the SVG dimensions and create an SVG container
  const svgContainer = d3
    .select(svgRef.current)
    .attr("width", canvas_w)
    .attr("height", canvas_h);

  // Groups
  const annot = svgContainer.append("g").attr("name", "annot"); // Annotation group for "Actual" and "Prediction" labels
  const legend = svgContainer.append("g").attr("name", "legend"); // Legend at the bottom
  const quadrants = svgContainer.append("g").attr("name", "quadrants"); // quadrants
  const dataPoints = svgContainer.append("g").attr("name", "dataPoints"); // Datapoints
  const hoverInfo = svgContainer.append("g").attr("name", "infoContainer"); // Info container when hover on quadrants
  // "Actual" label, rotated and positioned on the left side
  annot
    .append("text")
    .attr("x", 20) // Position slightly inside the SVG
    .attr("y", canvas_h / 2) // Center vertically
    .attr("text-anchor", "middle")
    .attr("font-size", 18)
    .attr("font-weight", "bold")
    .text("Actual")
    .attr("fill", "black")
    .attr("transform", `rotate(-90, 20, ${canvas_h / 2})`);

  // "Prediction" label at the top
  annot
    .append("text")
    .attr("x", cm_w / 2 + gx / 2) // Center horizontally
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
      .attr("x", ((2 * i + 1) * cm_w) / 4 + gx / 2)
      .attr("y", cm_h + gy / 2 + 15) // Position below the quadrants
      .attr("text-anchor", "middle")
      .attr("font-size", 14)
      .text(`${d}`)
  );

  labels.map((d, i) =>
    annot
      .append("text")
      .attr("x", d3.min([gx / 2, 10]))
      .attr("y", ((2 * i + 1) * cm_h) / 4 + gy / 2) // Position below the quadrants
      .attr("text-anchor", "start")
      .attr("font-size", 14)
      .text(`${d}`)
  );

  legend
    .append("circle")
    .attr("cx", gx)
    .attr("cy", cm_h + 90)
    .attr("r", 7)
    .attr("fill", "indianred");

  legend
    .append("text")
    .attr("x", gx + 15)
    .attr("y", cm_h + 95)
    .attr("text-anchor", "start")
    .attr("font-size", 14)
    .text("Match (Pred = Actual)");

  legend
    .append("circle")
    .attr("cx", canvas_w / 2 + gx / 2)
    .attr("cy", cm_h + 90)
    .attr("r", 7)
    .attr("fill", "steelblue");

  legend
    .append("text")
    .attr("x", canvas_w / 2 + gx / 2 + 15)
    .attr("y", cm_h + 95)
    .attr("text-anchor", "start")
    .attr("font-size", 14)
    .text("Mismatch (Pred ≠ Actual)");

  const randomCircularOffset = () => {
    const radius = d3.randomUniform(0, cm_w / 5)(); // Random radius up to 50
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
        return { x: cm_w / 4 + gx / 2 + dx, y: cm_h / 4 + gy / 2 + dy };
      } else {
        return {
          x: (3 * cm_w) / 4 + gx / 2 + dx,
          y: (3 * cm_h) / 4 + gy / 2 + dy,
        };
      }
    } else {
      if (d.label === "DLB") {
        //False Negative
        return {
          x: (3 / 4) * cm_w + gx / 2 + dx,
          y: (1 / 4) * cm_h + gy / 2 + dy,
        };
      } else {
        return {
          x: (1 / 4) * cm_w + gx / 2 + dx,
          y: (3 / 4) * cm_h + gy / 2 + dy,
        };
      }
    }
  }

  var rectData = [
    {
      x: gx / 2,
      y: gy / 2,
      width: cm_w / 2,
      height: cm_h / 2,
      name: "tp",
    },
    {
      x: gx / 2,
      y: (cm_h + gy) / 2,
      width: cm_w / 2,
      height: cm_h / 2,
      name: "fp",
    },
    {
      x: (cm_w + gx) / 2,
      y: gy / 2,
      width: cm_w / 2,
      height: cm_h / 2,
      name: "fn",
    },
    {
      x: (cm_w + gx) / 2,
      y: (cm_h + gy) / 2,
      width: cm_w / 2,
      height: cm_h / 2,
      name: "tn",
    },
  ];

  function getDataType(d_label, d_pred) {
    const matchChecker = d_label === d_pred;
    if (matchChecker) {
      if (d_label === "DLB") {
        return "tp";
      } else {
        return "tn";
      }
    } else {
      if (d_label === "DLB") {
        return "fn";
      } else {
        return "fp";
      }
    }
  }

  quadrants
    .selectAll("rect")
    .data(rectData)
    .enter()
    .append("rect")
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    .attr("name", (d) => d.name)
    .attr("width", (d) => d.width)
    .attr("height", (d) => d.height)
    .attr("fill", "white")
    .attr("stroke", "gray")
    .attr("stroke-width", 0.5);

  const tooltip = d3.select("#tooltip");
  dataPoints
    .selectAll("circle")
    .data(cm_data)
    .enter()
    .append("circle")
    .attr("stroke", "white")
    .attr("stroke-width", 1)
    .attr("r", 7)
    .attr("cx", (cm_w + gx) / 2)
    .attr("cy", (cm_h + gy) / 2)
    .attr("fill", (d) => (d.pred === d.label ? "indianred" : "steelblue"))
    .attr("fill-opacity", 0.0)
    .attr("dtype", (d) => getDataType(d.label, d.pred))
    .on("mouseover", function (event, d) {
      // Enlarge the hovered data point and change its color
      d3.select(this)
        .attr("r", 10)
        .attr("fill", "orange")
        .attr("fill-opacity", 0.7);

      // Show tooltip with detailed information
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

      // Determine fill color based on whether prediction matches label
      const isMatch = d.pred === d.label;
      const fillColor = isMatch ? "indianred" : "steelblue";
      // Highlight the corresponding rectangle in 'quadrants' based on 'type' of the data point
      quadrants
        .selectAll("rect")
        .filter((rect) => rect.name === d3.select(this).attr("dtype")) // Select rectangle where `name` matches `type` of data point
        .attr("stroke-width", 2)
        .attr("fill", fillColor); // Apply the determined fill color
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY + 10}px`);
    })
    .on("mouseout", function (event, d) {
      d3.select(this)
        .attr("r", 7)
        .attr("fill", (d) => (d.pred === d.label ? "indianred" : "steelblue"))
        .attr("fill-opacity", 0.4);
      tooltip.style("opacity", 0);
      //clear fill
      quadrants
        .selectAll("rect")
        .filter((rect) => rect.name === d3.select(this).attr("dtype"))
        .attr("fill", "none")
        .attr("stroke-width", 0.5);
    })
    .transition()
    .duration(500)
    .delay((d, i) => i * 10) // Delay each point's animation
    .ease(d3.easeCircle)
    .attr("cx", (d) => getCoord(d).x)
    .attr("cy", (d) => getCoord(d).y)
    .attr("fill-opacity", 0.4); // Color from CSV or default to white;

  return (
    <div className="cmContainer">
      <svg ref={svgRef} />
      <h3>Interactive Confusion Matrix</h3>
      <div
        id="tooltip"
        style={{
          position: "absolute",
          opacity: 0,
          background: "rgba(230, 230, 230, 0.8)",
          padding: "5px",
          borderRadius: "14px",
        }}
      />
    </div>
  );
}
