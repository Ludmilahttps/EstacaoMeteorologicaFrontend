import React from 'react'
import styled from "styled-components"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useState, useContext } from "react"
import { UserContext } from "../UserContext.js"

function Header() {
    const { info } = useContext(UserContext)
    const GoTo = useNavigate()
    const [userEmail, setEmail] = useState('')
    const [sentRequest, setSentRequest] = useState(false)
    const [userPassword, setPassword] = useState('')

    async function deleteDatabase(e) {
        e.preventDefault()
        setSentRequest(true)

        try {
            console.log(process.env.REACT_APP_API_URL)
            const aux = await axios.delete(`${process.env.REACT_APP_API_URL}/delete`)
            setSentRequest(false)
            console.log(aux)
            if (aux.status == 200) alert("database deleted")
        } catch (error) {
            alert(error)
            setSentRequest(false)
        }
    }

    async function insertDatabase(e) {
        e.preventDefault()
        setSentRequest(true)

        try {
            console.log(process.env.REACT_APP_API_URL)
            const aux = await axios.post(`${process.env.REACT_APP_API_URL}/insert`)
            setSentRequest(false)
            console.log(aux)
            if (aux.status !== 201) return alert("insert ok")
        } catch (error) {
            alert(error)
            setSentRequest(false)
        }
    }

    async function updateDatabase(e) {
        e.preventDefault()
        setSentRequest(true)

        try {
            console.log(process.env.REACT_APP_API_URL)
            const aux = await axios.put(`${process.env.REACT_APP_API_URL}/update`)
            setSentRequest(false)
            console.log(aux)
            if (aux.status !== 201) alert("update ok")
        } catch (error) {
            alert(error)
            setSentRequest(false)
        }
    }

    return (
        <Head data-test="header">
            <Logo data-test="logout" src="../../assets/EstacaoMeteorologica.svg" />
            <p data-test="user-name">Estação Meteorológica UFSC-Aru</p>
            <Boo>
                <Button disabled={sentRequest} onClick={(e) => updateDatabase(e)}>
                    <ion-icon name="sync-outline"></ion-icon>
                </Button>
                <Button disabled={sentRequest} onClick={(e) => insertDatabase(e)}>
                    <ion-icon name="trending-up-outline"></ion-icon>
                </Button>
                <Button disabled={sentRequest} onClick={(e) => deleteDatabase(e)}>
                    <ion-icon name="trending-down-outline"></ion-icon>
                </Button>
            </Boo>
        </Head>
    )
}

export default Header

export const Head = styled.div
    `
    width: 100%;
    height: 70px;
    position: fixed;
    top: 0; left: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    padding-left: 15px;
    padding-right: 15px;
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 700;
    font-size: 26px;
    line-height: 21px;
    color: #193946;
`

export const Logo = styled.img
    `
    width: 80px;
    height: 80px;
    margin-left: 15px;
    margin-right: 10px;
`

export const Button = styled.div`
    width: 50px;
    height: 50px;
    cursor: pointer;
    opacity: '1';
    pointer-events: 'auto';
`

export const Boo = styled.div
    `
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 25px;
    margin-left: 50%;
`