import React from "react";
import cx from "classnames";

import { isAcyclic, toggleParentId } from "./utilities";
import { useDagContext } from "./hooks/useDag";

interface EditorProps {
  isEditorOpen: boolean;
  setIsEditorOpen: Function;
}
export const Editor: React.FC<EditorProps> = ({
  isEditorOpen,
  setIsEditorOpen,
}) => {
  const {
    actions: { addNode, removeNode, toggleConnection },
    dagData,
  } = useDagContext();

  const ids = dagData.map(({ id }) => id);

  return (
    <div className={cx("editor", { isEditorOpen })}>
      <button className="tab" onClick={() => setIsEditorOpen(!isEditorOpen)} />
      <div className="editor-pane">
        {dagData &&
          dagData.map(({ id, parentIds = [] }) => (
            <div key={id} className="node">
              <div className="node-id">
                <button
                  className="button-remove"
                  onClick={() => removeNode(id)}
                >
                  X
                </button>
                <span key={id}>{id}</span>
              </div>
              <div className="pids">
                {ids.map((possibleParentId) => (
                  <button
                    key={possibleParentId}
                    onClick={() => toggleConnection(id, possibleParentId)}
                    className={cx("button-pid", {
                      disabled:
                        possibleParentId === id ||
                        !isAcyclic(
                          toggleParentId(dagData, id, possibleParentId)
                        ),
                      connected: parentIds.includes(possibleParentId),
                    })}
                  >
                    {possibleParentId}
                  </button>
                ))}
              </div>
            </div>
          ))}
        <div className="node-add">
          <button className="button-add" onClick={addNode}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};
