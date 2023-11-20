import React from 'react'
import { HistoricScreen, Feed, Transfers, Balance } from './style'
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { UserContext } from "../../UserContext.js"
import { useContext, useEffect } from 'react'
import axios from "axios"

function Home() {
    const { info, historic, setHistoric } = useContext(UserContext)

    useEffect(() => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${info.token}`
                }
            }
            const promise = axios.get(`${process.env.REACT_APP_API_URL}/post`, config);
            promise.then(res => setHistoric(res.data))

        } catch (error) {
            if (error.name === "AxiosError") alert("We couldn't find an account with this data!")
        }
    }, [])

    let sale = 0;

    for (let i = 0; i < historic.length; i++) {
        if (historic[i].type === 'enter') {
            sale = sale + Number(historic[i].value);
        } else {
            sale = sale - Number(historic[i].value);
        }
    }

    

    return (
        <HistoricScreen>
            <Header/>
            <>{historic.length ? (
                <Feed>
                    <Transfers >
                        {historic.map((transf) =>
                            <section>
                                <h1>{transf.date}</h1>
                                <h2  data-test="registry-name" >{transf.description}</h2>
                                {transf.type === 'enter' ? <h3 data-test="registry-amount">{transf.value}</h3> : <h4 data-test="registry-amount">{transf.value}</h4>}
                            </section>
                        )}
                    </Transfers>
                    <Balance>
                        <p>BALANCE</p>
                        {sale < 0 ? <h3 data-test="total-amount">{sale}</h3> : <h4 data-test="total-amount">{sale}</h4>}

                    </Balance>
                </Feed>
            ) : <h1>There are no entry or exit records</h1>}</>
            <Footer />
        </HistoricScreen>
    )
}

export default Home