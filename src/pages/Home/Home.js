import React from 'react'
import { HistoricScreen, Feed, Transfers, Balance } from './style'
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { UserContext } from "../../UserContext.js"
import { useContext, useEffect, useState } from 'react'
import axios from "axios"
import { Chart } from "react-google-charts";

function Home() {
    const { info, order ,setOrders} = useContext(UserContext)

    useEffect(() => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${info.token}`
                }
            }
            // const promise = axios.get(`${process.env.REACT_APP_API_URL}/orders/${info.id}`, config);
            // promise.then(res => setOrders(res.data))
            console.log(info.id)
        } catch (error) {
            if (error.name === "AxiosError") alert("We couldn't find an account with this data!")
        }
    }, [])

    const [dataa, setDataa] = useState([
        ['Linguagens', 'Quantidade'],
        ['React', 100],
        ['Angula', 80],
        ['Vue', 50],
      ])
      const [options, setOptions] = useState({
        title: 'Gráfico de Pizza'
      })
      const [dataBar, setDataBar] = useState([
        ['Cidades', '2010 População', '2000 População'],
        ['New York City, NY', 8175000, 8008000],
        ['Los Angeles, CA', 3792000, 3694000],
        ['Chicago, IL', 2695000, 2896000],
        ['Houston, TX', 2099000, 1953000],
        ['Philadelphia, PA', 1526000, 1517000],
      ])
      const [optionsBar, setOptionsBar] = useState({
        title: 'Gráfico de Barra'
      });

    return (
        <HistoricScreen>
            <Header ></Header>
            <Feed>
            <Chart
            width={'500px'}
            height={'300px'}
            chartType="PieChart"
            data={dataa}
            options={options}
          />
          <Chart
            width={'500px'}
            height={'300px'}
            chartType="BarChart"
            data={dataBar}
            options={optionsBar}
          />
            </Feed>
            <Footer />
        </HistoricScreen>
    )
}

export default Home