import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "react-dom";
import * as ReactDOM from "react-dom/client";
import App from "./Components/App/App.jsx";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
  // <App />
  // document.getElementById('root')
);
