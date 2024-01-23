import "./ArrowBreadcrumb.scss";

import React from "react";

/**
 * @typedef {Object} ArrowBreadcrumbItem
 *
 * @property {ReactNode} text
 * @property {boolean} isActive
 * @property {(e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: ArrowBreadcrumbItem) => void} onClick
 */

/**
 * @typedef {Object} ArrowBreadcrumbProps
 *
 * @property {ArrowBreadcrumbItem[]} items
 * @property {string} [className]
 * @property {string} [style]
 */

/**
 * @param {ArrowBreadcrumbProps} props
 */
export const ArrowBreadcrumb = (props) => {
    return (
        <ol className="arrow-breadcrumb">
            {props.items.map((item, index) => (
                <li
                    key={index}
                    className={`arrow-breadcrumb-item ${item.isActive ? "active" : ""}`}
                    onClick={(e) => item.onClick(e, item)}
                >
                    <div>{item.text}</div>
                </li>
            ))}
        </ol>
    );
};
