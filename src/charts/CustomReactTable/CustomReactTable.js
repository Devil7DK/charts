import "./CustomReactTable.scss";

import PerfectScrollbar from "react-perfect-scrollbar";
import clsx from "clsx";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useMemo, useRef, useCallback } from "react";
import {
  transformColumnDefinition,
  useHeaderHeight,
  useScrollbar,
} from "./CustomReactTableUtils";
import { CircularProgress } from "@mui/material";

import { CustomPagination } from "./CustomPagination";
import { useDependentState } from "../../utils/CommonHooks";
import _ from "lodash";

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
 * @property {number | undefined} dataSize Total number of data rows if the table is remotely paginated. Defaults to the length of the data array.
 * @property {number | undefined} currentPage Current page number if the pagination is enabled. Defaults to `1`.
 * @property {(currentPage: number) => void | undefined} onPageChange Function to be called when the page is changed. Defaults to `undefined`.
 * @property {number | undefined} [sizePerPage=25] Number of rows per page. Defaults to `25`.
 * @property {boolean | undefined} [remote=false] Whether the table data is remotely handled or not. Defaults to `false`.
 * @property {boolean | import("./CustomPagination").CustomPaginationProps | undefined} [pagination=false] Whether the table is paginated or not. If `true`, uses default pagination component. If an object, passes the props to the pagination component. Defaults to `false`.
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

  const [currentPage, setCurrentPage] = useDependentState(
    () => props.currentPage || 1,
    [props.currentPage]
  );

  const columns = useMemo(
    () => props.columns.map((item) => transformColumnDefinition(item)),
    []
  );

  const table = useReactTable({
    columns,
    data: props.data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: props.sizePerPage,
      },
    },
    manualPagination: props.remote,
  });

  const tableState = table.getState();

  const handlePageChange = useCallback(
    (currentPage) => {
      if (props.onPageChange) {
        props.onPageChange(currentPage);
      }

      setCurrentPage(currentPage);
    },
    [props.onPageChange]
  );

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
      {props.pagination && (
        <div className="pagination-container">
          <div></div>
          <div>
            <CustomPagination
              {...(typeof props.pagination === "object"
                ? props.pagination
                : {})}
              dataSize={props.dataSize || props.data.length}
              sizePerPage={tableState.pagination.pageSize}
              currentPage={tableState.pagination.pageIndex + 1}
              onPageChange={handlePageChange}
              alwaysShowAllBtns
            />
          </div>
        </div>
      )}
    </div>
  );
};

CustomReactTable.defaultProps = {
  banded: false,
  bordered: false,
  autoHeaderHeight: true,
  overlayCoverHeader: false,
  dataSize: null,
  currentPage: 1,
  onPageChange: null,
  sizePerPage: 25,
  remote: false,
  pagination: false,
};
