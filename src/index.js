import 'react-perfect-scrollbar/dist/css/styles.css';

import React from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { HashRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <App />
  </HashRouter>
);
