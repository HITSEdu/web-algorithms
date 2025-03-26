import React from 'react';
import './App.css';
import Canvas from "./components/canvas/Canvas";
import Header from "./components/header/Header";

function App() {
  return (
      <div className="App">
          <Header/>
          <Canvas/>
      </div>
  );
}

export default App;
