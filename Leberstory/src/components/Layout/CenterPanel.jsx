import React, { forwardRef } from "react";

const CenterPanel = forwardRef(({ children }, ref) => {
  return (
    <div
      ref={ref}
      className="absolute inset-0 flex flex-col lg:flex-row lg:p-20 p-10 items-center justify-center"
    >
      {children}
    </div>
  );
});

export default CenterPanel;
