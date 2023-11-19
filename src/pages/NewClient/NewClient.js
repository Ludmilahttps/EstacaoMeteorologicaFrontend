import { useState } from "react"
import { Container } from "./style.js"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function NewEnter() {
  const goTo = useNavigate()
  const [value, setValue] = useState("")
  const [description, setDescription] = useState("")
  const [phone, setPhone] = useState("")

  async function sendLogin(e) {
    e.preventDefault()

    const post = {
      name: value,
      address: description,
      phone: phone
    }

    try {
      const signIn = await axios.post(`${process.env.REACT_APP_API_URL}/clients`, post)
      console.log(signIn.status)
      goTo('/')

    } catch (error) {
      if (error.name === "AxiosError") alert("We couldn't find an account with this data!")
    }
  }

  return (
    <>
      <Container>
        <h1>Novo Cliente</h1>
        <form onSubmit={sendLogin}>
          <input type="text" name="nome" placeholder="nome" value={value} onChange={(e) => setValue(e.target.value)} />
          <input type="text" name="address" placeholder="endereço" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="number" name="phone" placeholder="telefone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button type="submit">cadastrar</button>
        </form>
      </Container>
    </>
  )
}