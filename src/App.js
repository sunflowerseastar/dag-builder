import { useEffect, useState } from "react";
import cx from "classnames";

import Dag from "./Dag.js";
import { Editor } from "./Editor.js";
import { isAcyclic, removeNodeFromDag, toggleParentId } from "./utilities.js";

import dag1 from "./data/dag.json";
import diamond from "./data/diamond.json";
import ex from "./data/ex.json";
import grafo from "./data/grafo.json";

const dataChoices = [
  { name: "Diamond", data: diamond },
  { name: "Multi", data: dag1 },
  { name: "Cross", data: ex },
  { name: "Extended", data: grafo },
];
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

  const [selectedSpline, setSelectedSpline] = useState(splineChoices[0].name);
  const currentSpline = splineChoices.find(
    ({ name }) => name === selectedSpline
  );

  const [selectedLayering, setSelectedLayering] = useState(
    layeringChoices[0].name
  );
  const currentLayering = layeringChoices.find(
    ({ name }) => name === selectedLayering
  );

  const [selectedData, setSelectedData] = useState(dataChoices[0].name);

  const [currentData, setCurrentData] = useState(
    dataChoices.find(({ name }) => name === selectedData)
  );

  useEffect(() => {
    setCurrentData(dataChoices.find(({ name }) => name === selectedData));
  }, [selectedData]);

  const [isEditorOpen, setIsEditorOpen] = useState(true);

  const addNode = () => {
    const nextId = Math.max(...currentData.data.map(({ id }) => id)) + 1;
    setCurrentData((prevData) => ({
      ...prevData,
      data: [...prevData.data, { id: nextId.toString() }],
    }));
  };

  const removeNode = (id) => {
    setCurrentData((prevData) => ({
      ...prevData,
      data: removeNodeFromDag(prevData.data, id),
    }));
  };

  const toggleConnection = (id, pid) => {
    const potentialNewGraph = toggleParentId(currentData.data, id, pid);
    if (isAcyclic(potentialNewGraph)) {
      setCurrentData((prevData) => ({
        ...prevData,
        data: toggleParentId(prevData.data, id, pid),
      }));
    } else {
      console.log("cyclical");
    }
  };

  return (
    <div className="app">
      <header>
        <div className="header-inner">
          <SelectionGroup
            heading="Spline"
            options={splineChoices}
            selection={selectedSpline}
            setSelection={setSelectedSpline}
          />
          <SelectionGroup
            heading="Spacing"
            options={spacingChoices}
            selection={selectedSpacing}
            setSelection={setSelectedSpacing}
          />
          <SelectionGroup
            heading="Layering"
            options={layeringChoices}
            selection={selectedLayering}
            setSelection={setSelectedLayering}
          />
          <SelectionGroup
            heading="Dataset"
            options={dataChoices}
            selection={selectedData}
            setSelection={setSelectedData}
          />
        </div>
      </header>

      <div className="main-container">
        <div className={cx("main", { isEditorOpen })}>
          <Editor
            addNode={addNode}
            currentData={currentData}
            isEditorOpen={isEditorOpen}
            removeNode={removeNode}
            setIsEditorOpen={setIsEditorOpen}
            toggleConnection={toggleConnection}
          />

          {currentData.data && (
            <Dag
              areArrowsShown={currentSpline.areArrowsShown}
              data={currentData.data}
              layering={currentLayering.layering}
              spacing={currentSpacing.name}
              spline={currentSpline.spline}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
