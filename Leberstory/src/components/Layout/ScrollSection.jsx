import React, { forwardRef } from "react";

const ScrollSection = forwardRef(({ id, children }, ref) => {
  return (
    <section
      id={id}
      ref={ref}
      className=" relative min-h-screen  overflow-hidden"
    >
      {children}
    </section>
  );
});

export default ScrollSection;
