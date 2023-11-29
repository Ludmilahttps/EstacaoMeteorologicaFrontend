import { useState } from "react"
import { Container } from "./style.js"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function NewCake() {
  const goTo = useNavigate()
  const [value, setValue] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [categoria, setCategoria] = useState("")

  const categoryOptions = [
    { label: '1. Sobremesa', value: 1 },
    { label: '2. Bolo simples', value: 2 },
    { label: '3. Bolo de festa', value: 3 },
  ];

  async function sendLogin(e) {
    e.preventDefault()

    // "name": "bolo de banana",
    // "price": "27",
    // "description": "bolo feito com banana e calda dde chocolate",
    // "image": "https://google.com"

    const post = {
      name: name,
      price: value,
      description: description,
      image: image,
      categoryid: categoria
    }
    console.log(categoria)

    try {
      const signIn = await axios.post(`${process.env.REACT_APP_API_URL}/cakes`, post)
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
          <input type="text" name="name" placeholder="nome do bolo" value={name} onChange={(e) => setName(e.target.value)}/>
          <input type="number" name="number" placeholder="preço" value={value} onChange={(e) => setValue(e.target.value)} />
          <input type="text" name="description" placeholder="descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="text" name="image" placeholder="link imagem" value={image} onChange={(e) => setImage(e.target.value)} />
          <input type="text" name="categoria" placeholder="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} list="categorias" />
          <datalist id="categorias">{categoryOptions.map(option => (<option key={option.value} value={option.value} />))}</datalist>
          <button data-test="registry-save" type="submit">save</button>
        </form>
      </Container>
    </>
  )
}