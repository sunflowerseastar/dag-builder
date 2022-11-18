import React from "react";
import cx from "classnames";

import { isAcyclic, toggleParentId } from "./utilities";

import { CurrentDataState } from "./types";

interface EditorProps {
  addNode: React.MouseEventHandler;
  currentData: CurrentDataState;
  isEditorOpen: boolean;
  removeNode: Function;
  setIsEditorOpen: Function;
  toggleConnection: Function;
}
export const Editor: React.FC<EditorProps> = ({
  addNode,
  currentData,
  isEditorOpen,
  removeNode,
  setIsEditorOpen,
  toggleConnection,
}) => {
  const ids = Object.keys(currentData.data);
  return (
    <div className={cx("editor", { isEditorOpen })}>
      <button className="tab" onClick={() => setIsEditorOpen(!isEditorOpen)} />
      <div className="editor-pane">
        {currentData.data &&
          currentData.data.map(({ id, parentIds = [] }) => (
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
                          toggleParentId(currentData.data, id, possibleParentId)
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
