import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from 'react'
import GlobalStyle from './GlobalStyle'

import { UserContext } from './UserContext'
import SignIn from "./pages/SignIn/SignIn"
import SignUp from "./pages/SignUp/SignUp"
import Home from "./pages/Home/Home"
import NewDHT from "./pages/NewDht/NewDht"
import NewPluviometer from "./pages/NewPuviometer/newPluviometer"
import NewAnemometer from "./pages/NewAnemometer/NewAnemometer"
import UpdateEmail from "./pages/email/UpdateEmail"
import NewBmp from "./pages/NewBmp/newDataBmp"

function App() {


  const [info, setInfo] = useState({})
  const [historic, setHistoric] = useState([])

  return (
    <UserContext.Provider value={{ info, setInfo, historic, setHistoric }}>
      <BrowserRouter>
        <GlobalStyle />
        <Routes>
          <Route path="/" element={< SignIn />} />
          <Route path="/cadastro" element={< SignUp />} />
          <Route path="/home" element={<  Home />} />
          <Route path="/novo-dado-dht" element={< NewDHT />} />
          <Route path="/novo-dado-pluviometro" element={< NewPluviometer />} />
          <Route path="/novo-dado-anemometro" element={< NewAnemometer />} />
          <Route path="/atualizar-email" element={< UpdateEmail />} />
          <Route path="/nono-dado-bmp" element={< NewBmp />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
