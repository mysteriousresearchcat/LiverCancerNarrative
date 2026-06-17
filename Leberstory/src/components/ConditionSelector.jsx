import React, { useState, createContext, useContext } from "react";

const ConditionPanelContext = createContext(null);

export const useConditionPanel = () => {
  const context = useContext(ConditionPanelContext);
  if (!context) {
    throw new Error("useConditionPanel must be used within ConditionSelectorProvider");
  }
  return context;
};

export const ConditionSelectorProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <ConditionPanelContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ConditionPanelContext.Provider>
  );
};

export const ConditionSelectorButton = () => {
  const { isOpen, setIsOpen } = useConditionPanel();

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="flex flex-col gap-1.5 p-2 hover:bg-white/10 rounded transition-colors"
      aria-label="Open conditions panel"
    >
      <span 
        className="w-5 h-0.5 transition-all origin-center"
        style={{
          backgroundColor: "var(--text)",
          transform: isOpen ? "rotate(45deg) translateY(11px)" : "rotate(0)",
        }}
      />
      <span 
        className="w-5 h-0.5 transition-all"
        style={{
          backgroundColor: "var(--text)",
          opacity: isOpen ? 0 : 1,
        }}
      />
      <span 
        className="w-5 h-0.5 transition-all origin-center"
        style={{
          backgroundColor: "var(--text)",
          transform: isOpen ? "rotate(-45deg) translateY(-11px)" : "rotate(0)",
        }}
      />
    </button>
  );
};

const ConditionSelector = ({ conditions, activeCondition, onSelect }) => {
  const { isOpen, setIsOpen } = useConditionPanel();

  const handleSelect = (condition) => {
    onSelect(condition);
    setIsOpen(false);
  };

  return (
    <>
      {/* Left Side Panel */}
      <div
        className="fixed left-0 top-0 h-screen z-40 transition-transform duration-300"
        style={{
          width: "280px",
          backgroundColor: `color-mix(in srgb, var(--bg) 95%, transparent)`,
          backdropFilter: "blur(8px)",
          borderRight: "1px solid",
          borderColor: `color-mix(in srgb, var(--nav-active) 40%, transparent)`,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div className="p-6 pt-24">
          <h2 
            className="text-sm font-semibold mb-4 opacity-75 uppercase tracking-wider"
            style={{ color: "var(--text)" }}
          >
            Select Condition
          </h2>
          
          <div className="space-y-2">
            {conditions.map((condition) => {
              const isActive = activeCondition.cond === condition.cond;
              return (
                <button
                  key={condition.cond}
                  onClick={() => handleSelect(condition)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all
                    ${
                      isActive
                        ? "bg-white/20 font-semibold"
                        : "hover:bg-white/10"
                    }
                  `}
                  style={{ color: "var(--text)" }}
                >
                  <div className="flex items-center justify-between">
                    <span>Condition {condition.cond}</span>
                    {isActive && <span>✓</span>}
                  </div>
                  <div className="text-xs opacity-60 mt-1">
                    Version {condition.version} • {condition.theme}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ConditionSelector;
