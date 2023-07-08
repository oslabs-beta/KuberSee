import React from "react";
import { render } from "react-dom";
import * as ReactDOM from "react-dom";
import App from "./Components/App/App.jsx";
// /Users/danielzhao/Documents/codesmith/osp/kubersee/client/Components/App/App.jsx
// client/Components/App
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />, document.getElementById("root"));
// root.render(<p>hello</p>);
