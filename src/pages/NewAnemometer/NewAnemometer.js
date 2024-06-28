import { useState, useContext } from "react";
import { Container } from "./style.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext.js";

export default function NewOrder() {
  const goTo = useNavigate();
  const [idStation, setIdStation] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [windDirection, setWindDirection] = useState("");
  const [windAngle, setWindAngle] = useState("");

  const { info } = useContext(UserContext);

  async function sendOrder(e) {
    e.preventDefault();

    const post = {
      idStation: idStation.trim(),
      windSpeed: windSpeed.trim(),
      windDirection: windDirection.trim(),
      windAngle: windAngle.trim(),
    };

    console.log(post);
    try {
      const newAnemometer = await axios.post(`${process.env.REACT_APP_API_URL}/anemometer `, post);
      console.log(newAnemometer.data);
      goTo('/home');
      alert("Dado registrado com sucesso");
    } catch (error) {
      if (error.name === "AxiosError") alert("Não foi possível cadastrar esse pedido, confira os dados");
    }
  }

  return (
    <Container>
      <h1>Inserir Dados Anemometro</h1>
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
          name="windSpeed"
          placeholder="Velocidade do Vento"
          value={windSpeed}
          onChange={(e) => setWindSpeed(e.target.value)}
        />
        <input
          type="text"
          name="windDirection"
          placeholder="Direção do Vento"
          value={windDirection}
          onChange={(e) => setWindDirection(e.target.value)}
        />
        <input
          type="text"
          name="windAngle"
          placeholder="Ângulo do Vento"
          value={windAngle}
          onChange={(e) => setWindAngle(e.target.value)}
        />
        <button type="submit">Registrar</button>
      </form>
    </Container>
  );
}
