import { useState, useContext } from "react"
import { Container } from "./style.js"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../UserContext.js"

export default function NewOrder() {
  const goTo = useNavigate()
  const [client, setClient] = useState("")
  const [cake, setCake] = useState("")
  const [value, setValue] = useState("")

  const { info } = useContext(UserContext)

  async function sendLogin(e) {
    e.preventDefault()

    // "clientId": "1",
    // "cakeId": "1",
    // "quantity": "1"

    const post = {
      clientid: client,
      cakeid: cake,
      quantity: value,
      employeeid: info.id
    }

    console.log(post)
    let priceTotal = 0
    try {
      const newOrder = await axios.post(`${process.env.REACT_APP_API_URL}/orders`, post)
      console.log(newOrder.data)
      if (newOrder.data && newOrder.data.totalprice !== undefined) {
        priceTotal = newOrder.data.totalprice;
        goTo('/home');
        alert("O valor total da compra foi de: R$ " + priceTotal  + ",00");
      }
    } catch (error) {
      if (error.name === "AxiosError") alert("Não foi possível cadastrar esse pedido, confira os dados")
    }
  }

  return (
    <>
      <Container>
        <h1>Novo Pedido</h1>
        <form onSubmit={sendLogin}>
          <input type="number" name="ClientId" placeholder="id cliente" value={client} onChange={(e) => setClient(e.target.value)}/>
          <input type="number" name="CakeId" placeholder="id bolo" value={cake} onChange={(e) => setCake(e.target.value)} />
          <input type="number" name="Value" placeholder="quantidade" value={value} onChange={(e) => setValue(e.target.value)} />
          <button type="submit">Registrar</button>
        </form>
      </Container>
    </>
  )
}