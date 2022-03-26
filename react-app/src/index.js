import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./App";
import { WalletContextProvider } from "./WalletContext";

ReactDOM.render(
  <React.StrictMode>
    <WalletContextProvider>
      <App />
    </WalletContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
