export const toggleParentId = (dag, id, pid) =>
  dag.map((obj) =>
    obj.id === id
      ? {
          ...obj,
          parentIds:
            obj.parentIds && obj.parentIds.includes(pid)
              ? obj.parentIds.filter((z) => z !== pid)
              : [...(obj.parentIds || []), pid],
        }
      : obj
  );

export const isAcyclic = (dag) => {
  if (!dag.length) {
    // all the leaves were removed: the graph is acyclical
    return true;
  } else {
    // try to find a leaf
    const leafIndex = dag.findIndex(
      (node) => !node.parentIds || !node.parentIds.length
    );

    if (leafIndex < 0) {
      // no leaf found: the graph is cyclical
      return false;
    } else {
      // leaf is found: remove it and recurse
      const idToRemove = parseInt(dag[leafIndex].id);
      let newDag = dag.map((node) => ({
        ...node,
        parentIds: node.parentIds
          ? node.parentIds.filter((pid) => parseInt(pid) !== idToRemove)
          : [],
      }));
      newDag.splice(leafIndex, 1);
      return isAcyclic(newDag);
    }
  }
};

export const removeNodeFromDag = (dag, id) => {
  const dagIdIndex = dag.findIndex(({ id: nodeId }) => nodeId === id);
  let newDag = dag.map((node) => ({
    ...node,
    parentIds: node.parentIds ? node.parentIds.filter((pid) => pid !== id) : [],
  }));
  newDag.splice(dagIdIndex, 1);
  return newDag;
};
