import { useState } from "react";
import cx from "classnames";

import { DagProvider } from "./hooks/useDag";
import Dag from "./Dag";
import Header from "./Header";
import { Editor } from "./Editor";

function App() {
  const [isEditorOpen, setIsEditorOpen] = useState(true);

  return (
    <DagProvider>
      <div className="app">
        <Header />

        <div className="main-container">
          <div className={cx("main", { isEditorOpen })}>
            <Editor
              isEditorOpen={isEditorOpen}
              setIsEditorOpen={setIsEditorOpen}
            />

            <Dag />
          </div>
        </div>
      </div>
    </DagProvider>
  );
}

export default App;
