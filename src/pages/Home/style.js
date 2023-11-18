import styled from "styled-components"

export const HistoricScreen = styled.div
`
    background-color: #FFF;
    display: flex;
    position: fixed;
    flex-direction: column;
    width: 100%;
    height: 80%;
    left: 0;
    padding: 0;
    border-radius: 5px;
    border: 25px solid #F2ACBF;
    display: flex;
    align-items: center;
    justify-context: center;
    > h1 {
        font-family: 'Lexend Deca';
        font-size: 23px;
        color: #D9304F;
        margin-top: 17px;
        margin-bottom: 17px;
    }
`
export const Feed= styled.div
`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-context: center;
    flex-direction: column;
`

export const Transfers= styled.div
`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-context: center;
    flex-direction: column;
    padding: 15px;
    > section{
        width: 100%;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        > h1{
            font-family: 'Raleway';
            font-weight: 400;
            font-size: 22px;
            line-height: 22px;
            color: #C6C6C0;
            padding: 5px;
        }
        > h2{
            font-family: 'Raleway';
            font-weight: 400;
            font-size: 22px;
            line-height: 22px;
            color: #000000;
        }
        > h3{
            font-family: 'Raleway';
            font-weight: 400;
            font-size: 22px;
            line-height: 22px;
            text-align: right;
            color: #03AC00;
        }
        > h4{
            font-family: 'Raleway';
            font-weight: 400;
            font-size: 22px;
            line-height: 22px;
            text-align: right;
            color: #C70000;
        }
    }
`

export const Balance= styled.div
`
    width: 100%;
    bottom: 0;
    left: 0;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 35px;
    padding-right: 35px;
    padding-bottom: 10px;
    > p{
        font-family: 'Raleway';
        font-weight: 700;
        font-size: 22px;
        line-height: 20px;
        color: #000000;
    }
    > h3{
        font-family: 'Raleway';
        font-weight: 400;
        font-size: 22px;
        line-height: 20px;
        text-align: right;
        color: #C70000;
    }
    > h4{
        font-family: 'Raleway';
        font-weight: 400;
        font-size: 22px;
        line-height: 20px;
        text-align: right;
        color:#03AC00;
    }
`