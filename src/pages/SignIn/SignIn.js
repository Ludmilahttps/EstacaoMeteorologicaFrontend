import React from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Form } from "./style"
import axios from "axios"
import { useState, useContext} from "react"
import { ThreeDots } from 'react-loader-spinner'
import { UserContext } from "../../UserContext.js"
 
function LogIn() {

    const { setInfo, setHistoric} = useContext(UserContext)
    const goTo =  useNavigate()
    const [userEmail, setEmail] = useState('')
    const [sentRequest, setSentRequest] = useState(false)
    const [userPassword, setPassword] = useState('')

    async function sendLogin(e) {
        e.preventDefault()

        setSentRequest(true)
        setHistoric([])

        const post = {
            email: userEmail,
            password: userPassword
        }

        try {
            const signIn = await axios.post(`${process.env.REACT_APP_API_URL}/sign-in`, post)
            console.log(signIn.status)

            if (signIn.status === 201 || signIn.status === 200) goTo('/home')

        } catch (error) {
            if (error.name === "AxiosError") alert("A senha ou o email está errado. Confira os dados!")
            setSentRequest(false)
        }
    }

    return (
        <Form>
            <img data-test="logout" src="../../assets/Laboleria.svg"></img>
            <p data-test="user-name">LaBoleria</p>
            <input data-test="email" type="email" name="email" placeholder="email" disabled={sentRequest} onChange={(e) => setEmail(e.currentTarget.value)}/>
            <input test="password" type="password" name="password" placeholder="senha" disabled={sentRequest} onChange={(e) => setPassword(e.currentTarget.value)}/>
            <button data-test="sign-in-submit" type='submit' disabled={sentRequest}  onClick={(e) => sendLogin(e)}>{sentRequest ? <ThreeDots height="18" width="30" color="white" ariaLabel="loading" wrapperStyle={{}} wrapperClassName=""/> : "LogIn" }</button>
            <Link data-test="signup-link" to="/cadastro">
                Don't have an account? Register
            </Link>
        </Form>
    )
}

export default LogIn