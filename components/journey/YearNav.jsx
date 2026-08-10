/**
 * YearNav — renders the year navigation for the Chronicles section.
 *
 * Desktop: two-column sidebar (left side of the grid).
 * Mobile:  horizontal sticky pill bar (above the cards).
 *
 * Props:
 *   milestones      – array of milestone objects
 *   activeIndex     – currently highlighted milestone index
 *   onYearClick(i)  – called when a year button is clicked
 *   yearButtonRefs  – ref array so the parent can auto-scroll the mobile bar
 *   desktopOnly     – if true, only renders the two-column desktop sidebar
 *                     (mobile pill bar is handled by the parent)
 */
const YearNav = ({ milestones, activeIndex, onYearClick, yearButtonRefs, desktopOnly = false }) => {
  const uniqueYears = [];
  const yearToFirstIndex = {};
  milestones.forEach((milestone, index) => {
    if (!yearToFirstIndex.hasOwnProperty(milestone.year)) {
      yearToFirstIndex[milestone.year] = index;
      uniqueYears.push(milestone.year);
    }
  });

  const activeYear = milestones[activeIndex]?.year;
  const half = Math.ceil(uniqueYears.length / 2);

  const buttonClass = (year) =>
    `w-full text-left py-1.5 sm:py-2 px-1 sm:px-2 transition-all duration-300 group border-l-2 ${
      activeYear === year
        ? "border-primary"
        : "border-transparent hover:border-white/20"
    }`;

  const labelClass = (year) =>
    `text-xs sm:text-sm md:text-base font-display transition-all duration-300 whitespace-nowrap ${
      activeYear === year
        ? "text-primary"
        : "text-white/40 group-hover:text-white/60"
    }`;

  return (
    <>
      {/* ── Mobile: horizontal sticky pill bar (skipped when desktopOnly) ── */}
      {!desktopOnly && (
        <div className="lg:hidden sticky top-18 z-40 -mx-4 px-4 sm:-mx-6 sm:px-6 pb-2 mb-4 bg-black/90 backdrop-blur-md border-b border-white/10">
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {uniqueYears.map((year, uIdx) => {
              const firstIndex = yearToFirstIndex[year];
              const isActive = activeYear === year;
              return (
                <button
                  key={year}
                  ref={(el) => {
                    if (yearButtonRefs) yearButtonRefs.current[uIdx] = el;
                  }}
                  onClick={() => onYearClick(firstIndex)}
                  className={`shrink-0 px-3 py-1.5 text-xs font-display transition-all duration-300 border-b-2 ${
                    isActive
                      ? "text-primary border-primary"
                      : "text-white/60 border-transparent hover:text-white hover:border-white/30"
                  }`}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Desktop: two-column year list ───────────────────────────────── */}
      <div className={`${desktopOnly ? "block" : "hidden lg:block"} h-fit pt-2 shrink-0`}>
        <div className="flex gap-x-1 sm:gap-x-3">
          {/* First column */}
          <div className="flex flex-col">
            {uniqueYears.slice(0, half).map((year) => {
              const firstIndex = yearToFirstIndex[year];
              return (
                <button
                  key={year}
                  onClick={() => onYearClick(firstIndex)}
                  className={buttonClass(year)}
                >
                  <div className={labelClass(year)}>{year}</div>
                </button>
              );
            })}
          </div>

          {/* Second column */}
          <div className="flex flex-col">
            {uniqueYears.slice(half).map((year) => {
              const firstIndex = yearToFirstIndex[year];
              return (
                <button
                  key={year}
                  onClick={() => onYearClick(firstIndex)}
                  className={buttonClass(year)}
                >
                  <div className={labelClass(year)}>{year}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default YearNav;
