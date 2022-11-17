import { useEffect } from "react";
import "./App.css";

import Dag from './Dag.js'

function App() {
  useEffect(() => {
    console.log("hi");
  }, []);
  return (
    <div className="App">
      <h1>dag builder</h1>
      <Dag></Dag>
    </div>
  );
}

export default App;
