import React from 'react'
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { useContext} from "react"
import { UserContext } from "../UserContext.js"

function Header() {
    const { info } = useContext(UserContext)
    const GoTo= useNavigate()
    console.log(info)

    return (
        <Head data-test="header">
            <LogoImg data-test="logout" src="../../assets/Laboleria.svg"/>
            <p data-test="user-name">LaBoleria</p>
        </Head>
    )
}

export default Header

export const Head = styled.div
    `
    width: 100%;
    height: 78px;
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
    line-height: 31px;
    color: #D9304F;
`

export const LogoImg = styled.img
    `
    width: 52px;
    height: 64px;
    margin-left: 15px;
    margin-right: 10px;
`