import { useState, useContext } from "react"
import { Container } from "./style.js"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../UserContext.js"

export default function UpdateEmail() {
  const goTo = useNavigate()
  const { info } = useContext(UserContext)
  const [email, setEmail] = useState("")

  async function sendLogin(e) {
    e.preventDefault()

    const post = {
      email: email,
      id_employee: info.id
    }

    try {
      const signIn = await axios.put(`${process.env.REACT_APP_API_URL}/update`, post)
      console.log(signIn.status)
      goTo('/home')

    } catch (error) {
      console.log(error)
      if (error.name === "AxiosError") alert("Não foi possível cadastrar esse bolo, confira os dados")
    }
  }

  return (
    <>
      <Container>
        <h1>Novo Bolo</h1>
        <form onSubmit={sendLogin}>
          <input type="text" name="name" placeholder="novo email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button data-test="registry-save" type="submit">save</button>
        </form>
      </Container>
    </>
  )
}