import React from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Form } from "./style"
import axios from "axios"
import { useState, useContext} from "react"
import { ThreeDots } from 'react-loader-spinner'
import { UserContext } from "../../UserContext.js"
 
function LogIn() {
    const { info, setInfo } = useContext(UserContext)
    const goTo =  useNavigate()
    const [userEmail, setEmail] = useState('')
    const [userCpf, setCpf] = useState('')
    const [sentRequest, setSentRequest] = useState(false)
    const [userPassword, setPassword] = useState('')

    async function sendLogin(e) {
        e.preventDefault()

        setSentRequest(true)
        setInfo({})

        const post = {
            cpf: userCpf,
            password: userPassword
        }

        try {
            const signIn = await axios.post(`${process.env.REACT_APP_API_URL}/sign-in`, post)
            console.log(signIn.status)
            console.log(signIn.data.position.positionid)
            const id = signIn.data.id
            const position = parseInt(signIn.data.position.positionid, 10);
            console.log(position)

            const positionID = +signIn.data.position.positionid;

            // Acessando o valor de position diretamente
            const positionValue = signIn.data.position;

            // Agora você pode fazer o que quiser com positionId e positionValue
            console.log('Position ID:', positionID);
            console.log('Valor de Position:', positionValue);

            const token = signIn.data.token.replace("Bearer ", "")

            if (signIn.status === 201 || signIn.status === 200) {
                setInfo({ id, positionID,  token })
                console.log(info)
                goTo('/home')
            }

        } catch (error) {
            if (error.name === "AxiosError") alert("A senha ou o email está errado. Confira os dados!")
            setSentRequest(false)
        }

    }

    return (
        <Form>
            <img data-test="logout" src="../../assets/EstacaoMeteorologica.svg"></img>
            <p data-test="user-name">Estação Meteorógica UFSC-Aru </p>
            <input data-test="cpf" type="text" name="cpf" placeholder="CPF" disabled={sentRequest} onChange={(e) => setCpf(e.currentTarget.value)}/>
            <input data-test="password" type="password" name="password" placeholder="senha" disabled={sentRequest} onChange={(e) => setPassword(e.currentTarget.value)}/>
            <button data-test="sign-in-submit" type='submit' disabled={sentRequest}  onClick={(e) => sendLogin(e)}>{sentRequest ? <ThreeDots height="18" width="30" color="white" ariaLabel="loading" wrapperStyle={{}} wrapperClassName=""/> : "LogIn" }</button>
            {/* <Link data-test="signup-link" to="/cadastro">
                Don't have an account? Register
            </Link> */}
        </Form>
    )
}

export default LogIn