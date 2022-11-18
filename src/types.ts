export type DagNode = {
  id: string;
  parentIds?: Array<string>;
};
export type DagType = DagNode[];
export type Option = {
  name: string;
  data?: DagType;
  spline?: any; // d3 function
  areArrowsShown?: boolean;
  layering?: any; // d3 function
};
export type DataChoice = {
  name: string;
  data: DagType;
};

export type CurrentDataState = {
  name: string;
  data: DagType;
};
