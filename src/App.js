import "./App.scss";

import React from "react";

import * as Charts from "./charts";
import { Link, Route, Routes } from "react-router-dom";

export const App = () => {
  return (
    <>
      <div className="navbar">
        {Object.entries(Charts).map(([key]) => (
          <Link key={key} to={`/${key}`}>
            {key}
          </Link>
        ))}
      </div>
      <div className="content">
        <Routes>
          {Object.entries(Charts).map(([key, Component]) => (
            <Route key={key} path={`/${key}`} element={<Component />} />
          ))}
        </Routes>
      </div>
    </>
  );
};
