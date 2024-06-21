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
    border: 25px solid #F49A23;
    display: flex;
    align-items: center;
    justify-context: center;
    > h1 {
        font-family: 'Lexend Deca';
        font-size: 23px;
        color: #193946;
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

// export const Chart= styled.div
// `
//     width: 100%;
//     height: 100%;
//     display: flex;
//     align-items: center;
//     justify-context: center;
//     flex-direction: column;
//     padding: 15px;
// }
// `

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

export const ControlPanel = styled.div`
    margin: 20px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    background-color: #193946;
    padding: 10px;
    color: white;
    font-family: 'Raleway', sans-serif;
`

export const ControlItem = styled.div`
    margin-bottom: 15px;
`

export const Label = styled.label`
    margin-right: 10px;
    font-size: 16px;
`

export const Input = styled.input`
    padding: 5px;
    font-size: 16px;
    font-family: 'Raleway', sans-serif;
    border: none;
    border-radius: 4px;
`

export const Select = styled.select`
    padding: 5px;
    font-size: 16px;
    font-family: 'Raleway', sans-serif;
    border: none;
    border-radius: 4px;
`

export const Button = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    font-family: 'Raleway', sans-serif;
    cursor: pointer;
    background-color: #F49A23;
    border: none;
    border-radius: 4px;
    color: white;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0B928C;
    }
`