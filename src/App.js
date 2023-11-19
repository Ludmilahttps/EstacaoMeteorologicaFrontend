import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from 'react'
import GlobalStyle from './GlobalStyle'

import { UserContext } from './UserContext'
import Home from "./pages/Home/Home"
import NewClient from "./pages/NewClient/NewClient"
import NewOrder from "./pages/NewOrder/NewOrder"
import NewCake from "./pages/NewCake/NewCake"

function App() {

  const [info, setInfo] = useState({})
  const [historic, setHistoric] = useState([])

  return (
    <UserContext.Provider value={{ info, setInfo, historic, setHistoric }}>
      <BrowserRouter>
        <GlobalStyle />
        <Routes>
          <Route path="/" element={<  Home />} />
          <Route path="/novo-cliente" element={< NewClient  />} />
          <Route path="/novo-pedido" element={< NewOrder />} />
          <Route path="/novo-bolo" element={< NewCake />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
