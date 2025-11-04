import React from "react";
import { Routes, Route } from "react-router-dom";

import "./style/App.css";
import NavBar from "./Components/NavBar";
import AddTask from "./components/AddTask";
import List from "./components/List";
import UpdateTask from "./components/UpdateTask";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Protected from "./components/Protected";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Protected><List /></Protected>} />
        <Route path="/add" element={<Protected><AddTask /></Protected>} />
        <Route path="/update/:id" element={<Protected><UpdateTask /></Protected>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      
    </>
  );
}

export default App;
