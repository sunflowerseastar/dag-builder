import { useEffect, useState } from "react";
import cx from "classnames";

import Dag from "./Dag";
import { Editor } from "./Editor";
import { isAcyclic, removeNodeFromDag, toggleParentId } from "./utilities";

import dag1 from "./data/dag.json";
import diamond from "./data/diamond.json";
import ex from "./data/ex.json";
import grafo from "./data/grafo.json";

import { CurrentDataState, DataChoice, Option } from "./types";

const dataChoices: DataChoice[] = [
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

type SelectionGroupProps = {
  heading: string;
  options: Option[];
  selection: string;
  setSelection: Function;
};
const SelectionGroup: React.FC<SelectionGroupProps> = ({
  heading,
  options,
  selection,
  setSelection,
}) => (
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
  const [selectedSpacing, setSelectedSpacing] = useState<string>(
    spacingChoices[0].name
  );
  const currentSpacing = spacingChoices.find(
    ({ name }) => name === selectedSpacing
  );

  const defaultSplineChoice = splineChoices[0];
  const [selectedSpline, setSelectedSpline] = useState<string>(
    defaultSplineChoice.name
  );
  const currentSpline = splineChoices.find(
    ({ name }) => name === selectedSpline
  );

  const [selectedLayering, setSelectedLayering] = useState<string>(
    layeringChoices[0].name
  );
  const currentLayering = layeringChoices.find(
    ({ name }) => name === selectedLayering
  );

  /*
   * "selected" data and "current" data are slightly different:
   *   - selected is when a user chooses a default example dataset (static)
   *   - current is the DAG as the user is editing it (dynamic)
   */
  const defaultCurrentData = dataChoices[0];
  const [selectedData, setSelectedData] = useState<string>(
    defaultCurrentData.name
  );

  const [currentData, setCurrentData] = useState<CurrentDataState>(
    dataChoices.find(({ name }) => name === selectedData) || defaultCurrentData
  );

  useEffect(() => {
    // when a user chooses a new dataset example, clobber the "current" data
    const currentSelectedData = dataChoices.find(
      ({ name }) => name === selectedData
    );
    if (currentSelectedData) {
      setCurrentData(currentSelectedData);
    }
  }, [selectedData]);

  const [isEditorOpen, setIsEditorOpen] = useState(true);

  const addNode = () => {
    if (!currentData) return;
    const nextId =
      Math.max(...currentData.data.map(({ id }) => parseInt(id))) + 1;
    setCurrentData((prevData) => ({
      ...prevData,
      data: [...prevData.data, { id: nextId.toString() }],
    }));
  };

  const removeNode = (id: string) => {
    setCurrentData((prevData) => ({
      ...prevData,
      data: removeNodeFromDag(prevData.data, id),
    }));
  };

  const toggleConnection = (id: string, pid: string) => {
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

  const isDagReady =
    !!currentData.data &&
    !!currentLayering?.layering &&
    !!currentSpacing?.name &&
    !!currentSpline?.spline;

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

          {isDagReady && (
            <Dag
              areArrowsShown={currentSpline.areArrowsShown}
              data={currentData.data}
              layering={currentLayering?.layering}
              spacing={currentSpacing?.name}
              spline={currentSpline?.spline}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
