import {
  dataChoices,
  layeringChoices,
  spacingChoices,
  splineChoices,
  useDagContext,
} from "./hooks/useDag";

import { Option } from "./types";

type SelectionGroupProps = {
  heading: string;
  options: Option[];
  activeIndex: number;
  setActiveIndex: Function;
};
const SelectionGroup: React.FC<SelectionGroupProps> = ({
  heading,
  options,
  activeIndex,
  setActiveIndex,
}) => (
  <div>
    <p>{heading}:</p>
    {options.map((option, i) => (
      <button
        key={option.name}
        value={option.name}
        className={activeIndex === i ? "active" : ""}
        onClick={() => setActiveIndex(i)}
      >
        {option.name}
      </button>
    ))}
  </div>
);

const Header = () => {
  const {
    actions: {
      setActiveDataIndex,
      setActiveLayeringIndex,
      setActiveSpacingIndex,
      setActiveSplineIndex,
    },
    activeDataIndex,
    activeLayeringIndex,
    activeSpacingIndex,
    activeSplineIndex,
  } = useDagContext();

  return (
    <header>
      <div className="header-inner">
        <SelectionGroup
          heading="Layering"
          options={layeringChoices}
          activeIndex={activeLayeringIndex}
          setActiveIndex={setActiveLayeringIndex}
        />
        <SelectionGroup
          heading="Spline"
          options={splineChoices}
          activeIndex={activeSplineIndex}
          setActiveIndex={setActiveSplineIndex}
        />
        <SelectionGroup
          heading="Spacing"
          options={spacingChoices}
          activeIndex={activeSpacingIndex}
          setActiveIndex={setActiveSpacingIndex}
        />
        <SelectionGroup
          heading="Data"
          options={dataChoices}
          activeIndex={activeDataIndex}
          setActiveIndex={setActiveDataIndex}
        />
      </div>
    </header>
  );
};

export default Header;
