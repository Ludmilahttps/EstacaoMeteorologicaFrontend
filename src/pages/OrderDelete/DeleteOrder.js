import { useState, useContext } from "react";
import { HistoricScreen } from "./style.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext.js";

export default function NewOrder() {
  const goTo = useNavigate();
  const [idStation, setIdStation] = useState("");
  const [pressure, setPressure] = useState("");
  const [temperature, setTemperature] = useState("");
  const [altitude, setAltitude] = useState("");

  const { info } = useContext(UserContext);

  async function sendOrder(e) {
    e.preventDefault();

    const post = {
      idStation: idStation.trim(),
      pressure: pressure.trim(),
      temperature: temperature.trim(),
      altitude: altitude.trim(),
      employeeid: info.id
    };

    console.log(post);
    try {
      const newOrder = await axios.post(`${process.env.REACT_APP_API_URL}/orders`, post);
      console.log(newOrder.data);
      goTo('/home');
      alert("Pedido registrado com sucesso");
    } catch (error) {
      if (error.name === "AxiosError") alert("Não foi possível cadastrar esse pedido, confira os dados");
    }
  }

  return (
    <HistoricScreen>
      <h1>Novo Pedido</h1>
      <form onSubmit={sendOrder}>
        <input
          type="text"
          name="idStation"
          placeholder="ID da Estação"
          value={idStation}
          onChange={(e) => setIdStation(e.target.value)}
        />
        <input
          type="text"
          name="pressure"
          placeholder="Pressão"
          value={pressure}
          onChange={(e) => setPressure(e.target.value)}
        />
        <input
          type="text"
          name="temperature"
          placeholder="Temperatura"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
        />
        <input
          type="text"
          name="altitude"
          placeholder="Altitude"
          value={altitude}
          onChange={(e) => setAltitude(e.target.value)}
        />
        <button type="submit">Registrar</button>
      </form>
    </HistoricScreen>
  );
}
