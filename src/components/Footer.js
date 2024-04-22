import React from 'react'
import styled from "styled-components"
import { Link } from 'react-router-dom'

function Footer() {

    return (
        <Foot  data-test="menu">
            <Link data-test="new-income" to="/novo-cliente">
                <ion-icon name="people-outline"></ion-icon>
                <p>Novo Cliente</p>
            </Link>
            <Link data-test="new-expense" to="/novo-pedido">
                <ion-icon name="receipt-outline"></ion-icon>
                <p>Novo Pedido</p>
            </Link>
            <Link data-test="new-expense" to="/novo-bolo">
                <ion-icon name="sparkles-outline"></ion-icon>
                <p>Novo Bolo</p>
            </Link>
            <Link to="/atualizar-email">
                <ion-icon name="people-outline"></ion-icon>
                <p>Atualizar email</p>
            </Link>
            <Link to="/deletar-pedido">
                <ion-icon name="receipt-outline"></ion-icon>
                <p>Deletar pedido</p>
            </Link>
        </Foot>
    )
}

export default Footer

export const Foot = styled.footer
    `
    position: fixed;
    width: 100%;
    bottom: 0; 
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 35px;
    padding-right: 35px;
    > a {
        width: 40%;
        height: 114px;
        background-color: #0B928C;
        border-radius: 5px;
        text-decoration: none;
        text-align: center;
        color: #FFF;
        display: flex;
        flex-direction: column;
        justify-context: center;
        align-items: flex-start;
        margin: 15px;
        > ion-icon{
            width: 30px;
            height: 30px;
            margin: 10px;
        }
        > p{
            width: 10%;
            font-family: 'Raleway';
            font-style: normal;
            font-weight: 700;
            font-size: 17px;
            line-height: 20px;
            margin: 10px;
        }
    }
`