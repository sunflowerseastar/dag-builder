import { useState } from "react";
import "./style.css";

import Dag from "./Dag.js";
import data from "./data.json";

function App() {
  const splineChoices = [
    { name: "Linear", spline: window.d3.curveLinear },
    { name: "Catmull-Rom", spline: window.d3.curveCatmullRom },
    { name: "Step Before", spline: window.d3.curveStepBefore },
  ];
  const [selectedSpline, setSelectedSpline] = useState(splineChoices[0].name);
  const currentSpline = splineChoices.find(
    ({ name }) => name === selectedSpline
  );

  const dataChoices = [
    { name: "data1", data: data},
    { name: "data2", data: data},
  ];
  const [selectedData, setSelectedData] = useState(dataChoices[0].name);
  const currentData = dataChoices.find(
    ({ name }) => name === selectedData
  );

  return (
    <div className="app">
      <header>
        <div>
        <p>Spline:</p>
        <select
          value={selectedSpline}
          onChange={(e) => setSelectedSpline(e.target.value)}
        >
          {splineChoices.map((x) => (
            <option key={x.name} value={x.name}>
              {x.name}
            </option>
          ))}
        </select>
        </div>
        <div>
        <p>Data:</p>
        <select
          value={selectedData}
          onChange={(e) => setSelectedData(e.target.value)}
        >
          {dataChoices.map((x) => (
            <option key={x.name} value={x.name}>
              {x.name}
            </option>
          ))}
        </select>
        </div>
      </header>

      <Dag spline={currentSpline.spline} data={data}></Dag>
    </div>
  );
}

export default App;
