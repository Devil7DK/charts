import "./CustomReactTable.scss";

import PerfectScrollbar from "react-perfect-scrollbar";
import clsx from "clsx";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useMemo, useRef } from "react";
import {
  transformColumnDefinition,
  useHeaderHeight,
  useScrollbar,
} from "./CustomReactTableUtils";
import { CircularProgress } from "@mui/material";

/**
 * @typedef {Object} CustomReactTableColumnDefinition
 *
 * @property {string} dataField Data field name. Can be nested using dot notation.
 * @property {React.ReactNode} text Column header text
 */

/**
 * @typedef {Object} CustomReactTableGroupedColumnDefinition
 *
 * @property {string} text Column header text
 * @property {Array<CustomReactTableColumnDefinition>} columns Child columns
 */

/**
 * @typedef {Object} CustomReactTableClassNames
 *
 * @property {string} mainContainer Class name for the top level container
 * @property {string} tableContainer Class name for the table container
 * @property {string} table Class name for the table element
 */

/**
 * @typedef {Object} CustomReactTableProps
 *
 * @property {Array} data Data to be displayed in the table, all rows if not paginated or locally paginated and only the current page if remotely paginated
 * @property {Array<CustomReactTableColumnDefinition | CustomReactTableGroupedColumnDefinition>} columns Column definitions. Always pass a memoized array or keep the definition outside the component. Can be nested to show grouped columns.
 * @property {Partial<CustomReactTableClassNames> | undefined} classNames Custom class names to be added to the table
 * @property {boolean | undefined} loading Whether the table is loading or not
 * @property {boolean | undefined} banded Whether the table has banded rows or not
 * @property {boolean | undefined} bordered Whether the table has bordered rows or not
 * @property {boolean | undefined} autoHeaderHeight Whether the table should automatically calculate header height or not. Defaults to `true`.
 * @property {boolean | undefined} overlayCoverHeader Whether the loading overlay should cover the header or not. Defaults to `false` i.e. the overlay covers only the table body.
 */

/**
 * Custom table component that uses react-table and follows API similar to react-bootstrap-table-next
 *
 * @param {CustomReactTableProps} props
 * @returns {React.ReactElement}
 */
export const CustomReactTable = (props) => {
  const { theadRef, totalHeight, rowHeights } = useHeaderHeight(
    props.autoHeaderHeight !== false
  );
  const scrollbarRef = useScrollbar();

  const columns = useMemo(
    () => props.columns.map((item) => transformColumnDefinition(item)),
    []
  );

  const table = useReactTable({
    columns,
    data: props.data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className={clsx(
        "custom-react-table responsive-font rf-1",
        props.banded && "banded-rows",
        props.bordered && "bordered-rows",
        props.classNames?.mainContainer
      )}
    >
      <div
        className={clsx("table-container", props.classNames?.tableContainer)}
        style={{ "--total-header-height": `${totalHeight}px` }}
      >
        <PerfectScrollbar ref={scrollbarRef}>
          <table className={clsx(props.classNames?.table)}>
            <thead ref={theadRef}>
              {table.getHeaderGroups().map((headerGroup, headerGroupIndex) => (
                <tr
                  key={headerGroup.id}
                  style={
                    !props.autoHeaderHeight !== false
                      ? {
                          "--header-top": rowHeights[headerGroupIndex - 1]
                            ? `${rowHeights[headerGroupIndex - 1]}px`
                            : null,
                        }
                      : null
                  }
                >
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </PerfectScrollbar>
        {props.loading && (
          <div
            className={clsx(
              "loading-overlay",
              props.overlayCoverHeader && "cover-header"
            )}
          >
            <CircularProgress />
          </div>
        )}
      </div>
    </div>
  );
};
