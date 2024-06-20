import { useState } from "react"
import { Container } from "./style.js"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function NewDataDHT() {
  const goTo = useNavigate()
  const [idStation, setIdStation] = useState("")
  const [temperatura, setTemperatura] = useState("")
  const [umidade, setUmidade] = useState("")

  async function sendLogin(e) {
    e.preventDefault()

    const post = {
      idStation: idStation,
      temperature: temperatura,
      humidity: umidade
    }

    try {
      const resp = await axios.post(`${process.env.REACT_APP_API_URL}/dht`, post)
      console.log(resp.status)
      goTo('/home')
      alert("Pedido registrado com sucesso");
    } catch (error) {
      if (error.name === "AxiosError") alert("Não foi possível cadastrar esse pedido, confira os dados");
    }
  }

  return (
    <>
      <Container>
        <h1>Cadastrar Dados do DHT</h1>
        <form onSubmit={sendLogin}>
          <input
            type="text"
            name="idStation"
            placeholder="ID da Estação"
            value={idStation}
            onChange={(e) => setIdStation(e.target.value)}
          />
          <input type="text" name="temperatura" placeholder="temperatura" value={temperatura} onChange={(e) => setTemperatura(e.target.value)} />
          <input type="text" name="umidade" placeholder="umidade" value={umidade} onChange={(e) => setUmidade(e.target.value)} />
          <button type="submit">cadastrar</button>
        </form>
      </Container>
    </>
  )
}