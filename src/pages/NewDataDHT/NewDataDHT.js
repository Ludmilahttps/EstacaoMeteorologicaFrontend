import { useState } from "react"
import { Container } from "./style.js"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function NewDataDHT() {
  const goTo = useNavigate()
  const [data, setData] = useState("")
  const [temperatura, setTemperatura] = useState("")
  const [umidade, setUmidade] = useState("")

  async function sendLogin(e) {
    e.preventDefault()

    const post = {
      data: data,
      temperatura: temperatura,
      umidade: umidade
    }

    try {
      const resp = await axios.post(`${process.env.REACT_APP_API_URL}/dht`, post)
      console.log(resp.status)
      goTo('/home')

    } catch (error) {
      if (error.name === "AxiosError") alert("não foi possivel cadastrar o novos dados do DHT!")
    }
  }

  return (
    <>
      <Container>
        <h1>Novo Cliente</h1>
        <form onSubmit={sendLogin}>
          <input type="text" name="data" placeholder="data" value={value} onChange={(e) => setData(e.target.value)} />
          <input type="text" name="temperatura" placeholder="temperatura" value={temperatura} onChange={(e) => setTemperatura(e.target.value)} />
          <input type="text" name="umidade" placeholder="umidade" value={umidade} onChange={(e) => setUmidade(e.target.value)} />
          <button type="submit">cadastrar</button>
        </form>
      </Container>
    </>
  )
}