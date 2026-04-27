import React, { forwardRef } from "react";

const SplitPanel = forwardRef(
  ({ left, right, className = "", panelClassName = "", leftClassName = "", rightClassName = "" }, ref) => {
  const leftCount = React.Children.count(left);
  const rightCount = React.Children.count(right);

  return (
    <div
      ref={ref}
      className={`split-panel absolute inset-0 flex flex-col lg:flex-row p-10 lg:p-20 items-center justify-center ${className}`}
    >
      <div
        className={`split-panel__column w-full min-w-0 flex items-center justify-center p-10 lg:p-20 ${panelClassName} ${
          leftCount > 1 ? "flex-row gap-10" : "flex-col gap-10"
        } ${leftClassName}`}
      >
        {left}
      </div>

      <div
        className={`split-panel__column w-full min-w-0 flex items-center justify-center p-10 lg:p-20 ${panelClassName} ${
          rightCount > 1 ? "flex-row gap-10" : "flex-col gap-10"
        } ${rightClassName}`}
      >
        {right}
      </div>
    </div>
  );
  }
);

export default SplitPanel;
