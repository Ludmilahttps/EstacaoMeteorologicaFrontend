import styled from "styled-components"

export const New = styled.div
    `
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-context: center;
    margin-top: 25%;
    flex-direction: column;
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 700;
    font-size: 26px;
    line-height: 31px;
    color: #D9304F;
    > p {
        margin: 10px;
    }
    > img {
        width: 102px;
        height: 164px;
        margin: -15px;
    }
    > input {
        width: 303px;
        height: 45px;
        box-sizing: border-box;
        background: #FFFFFF;
        border: 1px solid #D5D5D5;
        border-radius: 5px;
        margin: 3px;
        cursor: pointer;
    }
    > button {
        width: 303px;
        height: 45px;
        box-sizing: border-box;
        background: #D9304F;
        border-radius: 4.63636px;
        border: none;
        font-family: 'Raleway';
        font-style: normal;
        font-weight: 700;
        font-size: 20px;
        line-height: 23px;
        text-align: center;
        color: #FFFFFF;
        margin: 3px;
        cursor: pointer;
        align-items: center;
        justify-context: center;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    > a {
        width: 303px;
        height: 45px;
        box-sizing: border-box;
        font-family: 'Raleway';
        font-style: normal;
        font-weight: 700;
        font-size: 15px;
        line-height: 18px;
        text-align: center;
        text-decoration-line: underline;
        color: #fff;
        margin: 22px;
        cursor: pointer;
    }
`