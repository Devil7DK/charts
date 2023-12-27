import "./CustomPagination.scss";

import clsx from "clsx";
import PropTypes from "prop-types";
import React, { useCallback, useMemo } from "react";

/**
 * @typedef {CustomPaginationPage} CustomPaginationPageButtonProps
 *
 * @property {(page: number | string) => void} onPageChange Function to be called when a page is clicked
 */

/**
 * @typedef {Object} CustomPaginationPage
 *
 * @property {ReactNode} page Page number
 * @property {boolean} active Whether the page is active or not
 * @property {boolean} disabled Whether the page is disabled or not
 * @property {string} title Title for the page button
 * @property {string} className Class name for the page button
 */

/**
 * Page button component for custom pagination
 *
 * @param {CustomPaginationPageButtonProps} props
 * @returns React.ReactElement
 */
export const PageButton = (props) => {
  const handleClick = (e) => {
    e.preventDefault();
    props.onPageChange(props.page);
  };

  return (
    <li
      className={clsx(
        {
          active: props.active,
          disabled: props.disabled,
          "page-item": true,
        },
        props.className
      )}
      title={props.title}
    >
      <a href="#" onClick={handleClick} className="page-link">
        {props.page}
      </a>
    </li>
  );
};

PageButton.propTypes = {
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  active: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
};

/**
 * @typedef {Object} CustomPaginationProps
 *
 * @property {(page:number) => void} onPageChange - Function to be called when a page is clicked
 * @property {number} currentPage - The current active page
 * @property {number} dataSize - The total number of items in the dataset
 * @property {number} sizePerPage - The number of items per page
 * @property {number} [pageStartIndex=1] - The starting index of page numbering
 * @property {function?} pageButtonRenderer - Function to render a custom page button
 * @property {boolean} [disablePageTitle=false] - Flag to disable page title in the rendered buttons
 * @property {string} [firstPageText="<<"] - Text for the "First Page" button
 * @property {string} [prePageText="<"] - Text for the "Previous Page" button
 * @property {string} [nextPageText=">"] - Text for the "Next Page" button
 * @property {string} [lastPageText=">>"] - Text for the "Last Page" button
 * @property {boolean} [alwaysShowAllBtns=false] - Flag to always show all navigation buttons
 * @property {number} [paginationSize=5] - The number of visible page buttons in the pagination bar
 * @property {boolean} [withFirstAndLast=true] - Flag to include "First Page" and "Last Page" buttons
 */

/**
 * Custom pagination component for mimicking react-bootstrap-table-next pagination
 *
 * @param {CustomPaginationProps} props
 * @returns {React.ReactElement}
 */
export const CustomPagination = (props) => {
  const totalPages = useMemo(
    () => Math.ceil(props.dataSize / props.sizePerPage),
    [props.dataSize, props.sizePerPage]
  );
  const lastPage = useMemo(
    () => props.pageStartIndex + totalPages - 1,
    [props.pageStartIndex, totalPages]
  );

  const handleChangePage = useCallback(
    (newPage) => {
      let page;

      if (newPage === props.prePageText) {
        page =
          props.currentPage - 1 < props.pageStartIndex
            ? props.pageStartIndex
            : props.currentPage - 1;
      } else if (newPage === props.nextPageText) {
        page =
          props.currentPage + 1 > lastPage ? lastPage : props.currentPage + 1;
      } else if (newPage === props.lastPageText) {
        page = lastPage;
      } else if (newPage === props.firstPageText) {
        page = props.pageStartIndex;
      } else {
        page = parseInt(newPage, 10);
      }

      if (page !== props.currentPage) {
        props.onPageChange(page);
      }
    },
    [
      lastPage,
      props.currentPage,
      props.prePageText,
      props.nextPageText,
      props.lastPageText,
      props.firstPageText,
      props.pageStartIndex,
      props.onPageChange,
    ]
  );

  const pages = useMemo(() => {
    /** @type {CustomPaginationPage[]} */
    let pages = [];
    let endPage = totalPages;
    if (endPage <= 0) return [];

    let startPage = Math.max(
      props.currentPage - Math.floor(props.paginationSize / 2),
      props.pageStartIndex
    );
    endPage = startPage + props.paginationSize - 1;

    if (endPage > lastPage) {
      endPage = lastPage;
      startPage = endPage - props.paginationSize + 1;
    }

    if (props.alwaysShowAllBtns) {
      if (props.withFirstAndLast) {
        pages = [props.firstPageText, props.prePageText];
      } else {
        pages = [props.prePageText];
      }
    }

    if (
      startPage !== props.pageStartIndex &&
      totalPages > props.paginationSize &&
      props.withFirstAndLast &&
      pages.length === 0
    ) {
      pages = [props.firstPageText, props.prePageText];
    } else if (totalPages > 1 && pages.length === 0) {
      pages = [props.prePageText];
    }

    for (let i = startPage; i <= endPage; i += 1) {
      if (i >= props.pageStartIndex) pages.push(i);
    }

    if (props.alwaysShowAllBtns || (endPage <= lastPage && pages.length > 1)) {
      pages.push(props.nextPageText);
    }
    if (
      (endPage !== lastPage && props.withFirstAndLast) ||
      (props.withFirstAndLast && props.alwaysShowAllBtns)
    ) {
      pages.push(props.lastPageText);
    }

    const disablePageTitle = props.disablePageTitle || false;

    const isStart = (page) =>
      props.currentPage === props.pageStartIndex &&
      (page === props.firstPageText || page === props.prePageText);
    const isEnd = (page) =>
      props.currentPage === lastPage &&
      (page === props.nextPageText || page === props.lastPageText);

    return pages
      .filter((page) => {
        if (props.alwaysShowAllBtns) {
          return true;
        }
        return !(isStart(page) || isEnd(page));
      })
      .map((page) => {
        let title;
        const active = page === props.currentPage;
        const disabled = isStart(page) || isEnd(page);

        if (page === props.nextPageText) {
          title = props.nextPageTitle;
        } else if (page === props.prePageText) {
          title = props.prePageTitle;
        } else if (page === props.firstPageText) {
          title = props.firstPageTitle;
        } else if (page === props.lastPageText) {
          title = props.lastPageTitle;
        } else {
          title = `${page}`;
        }

        const pageResult = { page, active, disabled };

        if (!disablePageTitle) {
          pageResult.title = title;
        }

        return pageResult;
      });
  }, [
    totalPages,
    lastPage,
    props.disablePageTitle,
    props.alwaysShowAllBtns,
    props.currentPage,
    props.pageStartIndex,
    props.firstPageText,
    props.prePageText,
    props.nextPageText,
    props.lastPageText,
    props.nextPageTitle,
    props.prePageTitle,
    props.firstPageTitle,
    props.lastPageTitle,
    props.paginationSize,
    props.withFirstAndLast,
  ]);

  if (totalPages === 1 && hidePageListOnlyOnePage) {
    return null;
  }

  return (
    <ul className="custom-pagination">
      {pages.map((pageProps) => {
        if (props.pageButtonRenderer) {
          return props.pageButtonRenderer({
            ...pageProps,
            onPageChange: handleChangePage,
          });
        }

        return (
          <PageButton
            key={pageProps.page}
            {...pageProps}
            onPageChange={handleChangePage}
          />
        );
      })}
    </ul>
  );
};

CustomPagination.propTypes = {
  onPageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  dataSize: PropTypes.number.isRequired,
  sizePerPage: PropTypes.number.isRequired,
  pageStartIndex: PropTypes.number,
  pageButtonRenderer: PropTypes.func,
  disablePageTitle: PropTypes.bool,
  firstPageText: PropTypes.string,
  prePageText: PropTypes.string,
  nextPageText: PropTypes.string,
  lastPageText: PropTypes.string,
  alwaysShowAllBtns: PropTypes.bool,
  paginationSize: PropTypes.number,
  withFirstAndLast: PropTypes.bool,
};

CustomPagination.defaultProps = {
  pageButtonRenderer: null,
  pageStartIndex: 1,
  disablePageTitle: false,
  firstPageText: "<<",
  prePageText: "<",
  nextPageText: ">",
  lastPageText: ">>",
  alwaysShowAllBtns: false,
  paginationSize: 5,
  withFirstAndLast: true,
};
