import React from 'react'
import { Link, useNavigate } from "react-router-dom"
import { New } from "./style"
import axios from "axios"
import { ThreeDots } from 'react-loader-spinner'
import { useState } from "react"

function NewAccount() {

    const goTo = useNavigate()
    const [userEmail, setEmail] = useState('')
    const [userName, setName] = useState('')
    const [userPassword, setPassword] = useState('')
    const [userCpf, setCpf] = useState('')
    const [userConfirmPassword, setConfirmPassword] = useState('')
    const [position, setPosition] = useState('')
    const [sentRequest, setSentRequest] = useState(false)

    const positionOptions = [
        { label: 'administrador', value: "1" },
        { label: 'professor', value: "2" },
        { label: 'aluno', value: "3" },
      ];

    async function sendLogin(e) {
        e.preventDefault()
        setSentRequest(true)

        if (userPassword !== userConfirmPassword) {
            alert("The passwords must be the same!")
            return setSentRequest(false)
        }

        const post = {
            cpf: userCpf,
            email: userEmail,
            name: userName,
            position: parseInt(position),
            password: userPassword
        }
        console.log(post)
        try {
            console.log(process.env.REACT_APP_API_URL)
            const aux = await axios.post(`${process.env.REACT_APP_API_URL}/sign-up`, post)
            setSentRequest(false)
            console.log(aux)
            if (aux.status !== 201) return
            goTo("/")
        } catch (error) {
            alert(error)
            setSentRequest(false)
        }
    }

    return (
        <New>
            <img data-test="logout" src="../../assets/EstacaoMeteorologica.svg" alt="Estação Meteorológica UFSC-Aru" />
            <p data-test="user-name">Estação Meteorológica UFSC-Aru</p>
            <form onSubmit={sendLogin}>
                <input data-test="email" type="email" name="email" placeholder="email" disabled={sentRequest} onChange={(e) => setEmail(e.target.value)} required />
                <input data-test="name" type="text" name="name" placeholder="name" disabled={sentRequest} onChange={(e) => setName(e.target.value)} required />
                <input data-test="cpf" type="text" name="cpf" placeholder="cpf" disabled={sentRequest} onChange={(e) => setCpf(e.target.value)} required />
                <input type="text" name="position" placeholder="position" value={position} onChange={(e) => setPosition(e.target.value)} list="positions" required />
                <datalist id="positions">
                    {positionOptions.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}
                </datalist>
                <input data-test="password" type="password" name="password" placeholder="password" disabled={sentRequest} onChange={(e) => setPassword(e.target.value)} required />
                <input data-test="conf-password" type="password" name="confirm-password" placeholder="password confirm" disabled={sentRequest} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <button data-test="sign-up-submit" type="submit" disabled={sentRequest}>
                    {sentRequest ? <ThreeDots height="18" width="30" color="white" ariaLabel="loading" /> : "Register"}
                </button>
            </form>
            <Link to="/">Already have an account? LogIn</Link>
        </New>
    );
    // return (
    //     <New>
    //         <img data-test="logout" src="../../assets/EstacaoMeteorologica.svg"></img>
    //         <p data-test="user-name">Estação Meteorológica UFSC-Aru</p>
    //         <input data-test="email" type="email" name="email" placeholder="email" disabled={sentRequest} onChange={(e) => setEmail(e.currentTarget.value)} />
    //         <input data-test="name" type="name" name="name" placeholder="name" disabled={sentRequest} onChange={(e) => setName(e.currentTarget.value)} />
    //         <input data-test="cpf" type="cpf" name="cpf" placeholder="cpf" disabled={sentRequest} onChange={(e) => setCpf(e.currentTarget.value)} />
            
            
    //         <input type="text" name="position" placeholder="position" value={position} onChange={(e) => setPosition(e.target.value)} list="positions" />
    //         <datalist id="positions">{positionOptions.map(option => (<option key={option.label} value={option.value} />))}</datalist>
            
    //         <input data-test="password" type="password" name="password" placeholder="password" disabled={sentRequest} onChange={(e) => setPassword(e.currentTarget.value)} />
    //         <input data-test="conf-password" type="password" name="password" placeholder="password confirm" disabled={sentRequest} onChange={(e) => setConfirmPassword(e.currentTarget.value)} />
    //         <button data-test="sign-up-submit" type='submit' disabled={sentRequest} onClick={(e) => sendLogin(e)}>{sentRequest ? <ThreeDots height="18" width="30" color="white" ariaLabel="loading" wrapperStyle={{}} wrapperClassName="" /> : "Register"}</button>
    //         <Link to="/">
    //             Already have an account? LogIn
    //         </Link>
    //     </New>
    // )
}

export default NewAccount