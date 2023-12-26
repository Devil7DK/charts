import { createColumnHelper } from "@tanstack/react-table";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const columnHelper = createColumnHelper();

/**
 * Transforms column definition of CustomReactTable to react-table column definition
 *
 * @param {import("./CustomReactTable").CustomReactTableColumnDefinition | import("./CustomReactTable").CustomReactTableGroupedColumnDefinition} columnDefinition
 * @returns {import("@tanstack/react-table").Column}
 */
export const transformColumnDefinition = (columnDefinition) => {
  if (Object.prototype.hasOwnProperty.call(columnDefinition, "columns")) {
    return columnHelper.group({
      header: columnDefinition.text,
      columns: columnDefinition.columns.map(transformColumnDefinition),
    });
  } else {
    if (!columnDefinition.dataField) {
      return columnHelper.display({
        header: columnDefinition.text,
      });
    } else {
      /** @type {import("@tanstack/react-table").IdentifiedColumnDef<unknown,unknown>} */
      const column = {
        header: columnDefinition.text,
      };

      return columnHelper.accessor(columnDefinition.dataField, column);
    }
  }
};

/**
 * Custom hook to update scrollbar when window is resized to be used with react-perfect-scrollbar
 *
 * @returns {React.RefObject<PerfectScrollbar>}
 */
export const useScrollbar = () => {
  /** @type {React.RefObject<PerfectScrollbar>} */
  const scrollbarRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (scrollbarRef.current) {
        scrollbarRef.current.updateScroll();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return scrollbarRef;
};

/**
 * Custom hook to calculate and return header heights to be used for setting the scrollbar, overlay margin and sticky header positions
 *
 * @param {boolean} enabled Whether the hook is enabled or not. If not enabled, returns null for all values
 */
export const useHeaderHeight = (enabled) => {
  /** @type {React.RefObject<HTMLTableSectionElement>} */
  const theadRef = useRef(null);

  const [value, setValue] = useState({ totalHeight: null, rowHeights: [] });

  useLayoutEffect(() => {
    if (enabled && theadRef.current) {
      const updateHeights = (e) => {
        if (e) {
          console.log("Resize event", e);
        }

        const rowHeights = Array.from(
          theadRef.current.querySelectorAll("tr")
        ).map((row) => row.clientHeight);

        setValue({
          totalHeight: rowHeights.reduce((a, b) => a + b, 0),
          rowHeights,
        });
      };

      updateHeights();

      const observer = new ResizeObserver(updateHeights);

      observer.observe(theadRef.current);

      return () => {
        observer.disconnect();
      };
    } else {
      setValue({ totalHeight: null, rowHeights: [] });
    }
  }, [enabled]);

  return {
    theadRef,
    ...value,
  };
};
