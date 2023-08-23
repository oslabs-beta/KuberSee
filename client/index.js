import React from "react";
import { BrowserRouter } from "react-router-dom";
import * as ReactDOM from "react-dom/client";
import App from "./Components/App/App.tsx";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  // {/* </React.StrictMode> */}
  // <App />
  // document.getElementById('root')
);
