import { useState, useContext} from "react"
import { Container } from "./style"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../UserContext.js"

export default function NewExit() {
  const { info } = useContext(UserContext)
  const goTo = useNavigate()
  const [value, setValue] = useState("")
  const [description, setDescription] = useState("")

  async function sendLogin(e) {
    e.preventDefault()

    const post = {
      value: value,
      description: description,
      type: "exit"
    }

    const config = {
      headers: {
        Authorization: `Bearer ${info.token}`
      }
    }

    try {
      const signIn = await axios.post(`${process.env.REACT_APP_API_URL}/post`, post, config)
      console.log(signIn.status)
      goTo('/home')

    } catch (error) {
      if (error.name === "AxiosError") alert("We couldn't find an account with this data!")
      //setSentRequest(false)
    }
  }

  return (
    <>
      <Container>
          <h1>New exit</h1>
        <form onSubmit={sendLogin}>
          <input data-test="registry-amount-input" type="number" name="value" placeholder="value" value={value} onChange={(e) => setValue(e.target.value)}/>
          <input data-test="registry-name-input" type="text" name="description" placeholder="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <button data-test="registry-save" type="submit">save</button>
        </form>
      </Container>
    </>
  )
}