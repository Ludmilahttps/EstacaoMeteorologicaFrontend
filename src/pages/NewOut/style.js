import styled from "styled-components"

export const Container = styled.div
`
height: 100%;
width: 326px;
margin-top: 25px;
display: flex;
flex-direction: column;
>h1{
    font-weight: 700;
    font-size: 26px;
    color: #ffffff;
}
>form{
    >input{
        width: 326px;
        height: 58px;
        background: #ffffff;
        border-radius: 5px;
        border-style: none;
        margin-top: 15px;
        padding-left: 15px;
        box-sizing: border-box;
        font-size: 20px;
        font-family: "Raleway";
        /* Chrome, Safari, Edge, Opera */
        ::-webkit-outer-spin-button,
        ::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
        }
        /* Firefox */
        [type="number"] {
        -moz-appearance: textfield;
        }
        ::placeholder {
        font-family: "Raleway";
        font-size: 20px;
        color: #4f4f4f;
        }
        :focus::placeholder {
        color: transparent;
        }
    }
    > button{
        width: 326px;
        height: 46px;
        border-style: none;
        background: #a328d6;
        border-radius: 5px;
        border-style: none;
        margin-top: 15px;
        font-family: "Raleway";
        font-weight: 700;
        font-size: 20px;
        color: #ffffff;
    }
    }
`