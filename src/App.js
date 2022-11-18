import { useState } from "react";
import "./style.css";

import Dag from "./Dag.js";

import dag1 from "./data/dag.json";
import diamond from "./data/diamond.json";
import en from "./data/en.json";
import ex from "./data/ex.json";
import grafo from "./data/grafo.json";

const SelectionGroup = ({ heading, options, selection, setSelection }) => (
  <div>
    <p>{heading}:</p>
    {options.map((option) => (
      <button
        key={option.name}
        value={option.name}
        className={selection === option.name ? "active" : ""}
        onClick={() => setSelection(option.name)}
      >
        {option.name}
      </button>
    ))}
  </div>
);

function App() {
  const spacingChoices = [{ name: "Default" }, { name: "Compact" }];
  const [selectedSpacing, setSelectedSpacing] = useState(
    spacingChoices[0].name
  );
  const currentSpacing = spacingChoices.find(
    ({ name }) => name === selectedSpacing
  );

  const splineChoices = [
    { name: "Linear", spline: window.d3.curveLinear, areArrowsShown: true },
    {
      name: "Catmull-Rom",
      spline: window.d3.curveCatmullRom,
      areArrowsShown: true,
    },
    {
      name: "Step Before",
      spline: window.d3.curveStepBefore,
      areArrowsShown: false,
    },
  ];
  const [selectedSpline, setSelectedSpline] = useState(splineChoices[0].name);
  const currentSpline = splineChoices.find(
    ({ name }) => name === selectedSpline
  );

  const layeringChoices = [
    {
      name: "Simplex",
      layering: window.d3.layeringSimplex(),
    },
    {
      name: "LongestPath",
      layering: window.d3.layeringLongestPath(),
    },
    {
      name: "Coffman-Graham",
      layering: window.d3.layeringCoffmanGraham(),
    },
  ];
  const [selectedLayering, setSelectedLayering] = useState(
    layeringChoices[0].name
  );
  const currentLayering = layeringChoices.find(
    ({ name }) => name === selectedLayering
  );

  const dataChoices = [
    { name: "example 2", data: en },
    { name: "example 3", data: diamond },
    { name: "example 4", data: dag1 },
    { name: "example 5", data: ex },
    { name: "example 6", data: grafo },
  ];
  const [selectedData, setSelectedData] = useState(dataChoices[0].name);
  const currentData = dataChoices.find(({ name }) => name === selectedData);

  return (
    <div className="app">
      <header>
        <div className="header-inner">
          <SelectionGroup
            heading="spline"
            options={splineChoices}
            selection={selectedSpline}
            setSelection={setSelectedSpline}
          />
          <SelectionGroup
            heading="spacing"
            options={spacingChoices}
            selection={selectedSpacing}
            setSelection={setSelectedSpacing}
          />
          <SelectionGroup
            heading="layering"
            options={layeringChoices}
            selection={selectedLayering}
            setSelection={setSelectedLayering}
          />
          <SelectionGroup
            heading="dataset"
            options={dataChoices}
            selection={selectedData}
            setSelection={setSelectedData}
          />
        </div>
      </header>

      <Dag
        areArrowsShown={currentSpline.areArrowsShown}
        data={currentData.data}
        layering={currentLayering.layering}
        spacing={currentSpacing.name}
        spline={currentSpline.spline}
      ></Dag>
    </div>
  );
}

export default App;
