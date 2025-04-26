import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
}

export default App;
