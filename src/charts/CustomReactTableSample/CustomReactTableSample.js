import React, { useMemo, useState, useEffect } from "react";

import { CustomReactTable } from "../CustomReactTable/CustomReactTable";
import SampleData from "./CustomReactTableSample.json";

const columns = [
  {
    dataField: "date",
    text: "Date",
  },
  {
    dataField: "sku",
    text: "SKU",
  },
  {
    dataField: "brand",
    text: "Brand",
  },
  {
    text: "Name",
    columns: [
      {
        dataField: "productNameGeneric",
        text: "Generic Product Name",
      },
      {
        dataField: "productNameBrand",
        text: "Brand Product Name",
      },
    ],
  },
  {
    dataField: "price",
    text: "Price",
  },
  {
    dataField: "quantity",
    text: "Quantity",
  },
];

export const CustomReactTableSample = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  return (
    <CustomReactTable
      data={SampleData}
      columns={columns}
      loading={loading}
      currentPage={currentPage}
      pagination
      banded
      bordered
    />
  );
};
