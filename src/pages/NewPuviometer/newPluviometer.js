import { useState, useContext } from "react";
import { Container } from "./style.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext.js";

export default function NewOrder() {
  const goTo = useNavigate();
  const [idStation, setIdStation] = useState("");
  const [rainfall, setRainfall] = useState("");

  const { info } = useContext(UserContext);

  async function sendLogin(e) {
    e.preventDefault();

    const post = {
      idStation: idStation.trim(),
      rainfall: rainfall.trim(),
    };

    console.log(post);
    try {
      const newPluviometer = await axios.post(`${process.env.REACT_APP_API_URL}/pluviometer`, post);
      console.log(newPluviometer.data);
      goTo('/home');
      alert("Pedido registrado com sucesso");
    } catch (error) {
      if (error.name === "AxiosError") alert("Não foi possível cadastrar esse pedido, confira os dados");
    }
  }

  return (
    <Container>
      <h1>Inserir Dados Pluviometro</h1>
      <form onSubmit={sendLogin}>
        <input
          type="text"
          name="idStation"
          placeholder="ID da Estação"
          value={idStation}
          onChange={(e) => setIdStation(e.target.value)}
        />
        <input
          type="text"
          name="rainfall"
          placeholder="Precipitação (mm)"
          value={rainfall}
          onChange={(e) => setRainfall(e.target.value)}
        />
        <button type="submit">Registrar</button>
      </form>
    </Container>
  );
}
