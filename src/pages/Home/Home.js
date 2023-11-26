import React from 'react'
import { HistoricScreen, Feed, Transfers, Balance } from './style'
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { UserContext } from "../../UserContext.js"
import { useContext, useEffect, useState } from 'react'
import { Chart } from "react-google-charts"
import axios from "axios"

function Home() {
    const { info } = useContext(UserContext)
    const [sales, setSales] = useState("")
    const [ingredients, setIngredients] = useState("")
    const [cakes, setCakes] = useState("")
    const [dataBar, setDataBar] = useState([]);
    const [dataPie, setDataPie] = useState([]);

    useEffect(() => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${info.token}`
                }
            }
            const promise = axios.get(`${process.env.REACT_APP_API_URL}/graphyc/sales`, config);
            promise.then(res => setSales(res.data))
            console.log(sales)

            const promisee = axios.get(`${process.env.REACT_APP_API_URL}/graphyc/ingredients`, config);
            promisee.then(res => setIngredients(res.data))
            console.log(ingredients)

            const promiseee = axios.get(`${process.env.REACT_APP_API_URL}/graphyc/city`, config);
            promiseee.then(res => setCakes(res.data))
            console.log(cakes)


        } catch (error) {
            if (error.name === "AxiosError") alert("We couldn't find an account with this data!")
        }
    }, [info.token])

    useEffect(() => {
        // Função para transformar os dados de cakes no formato necessário para o gráfico de barras
        const transformData = () => {
            const chartData = [['City', 'Sobremesa', 'Bolo de Festa']];

            // Inicializa objetos para armazenar os totais por categoria e cidade
            const totals = {};

            cakes.forEach(({ city_name, category_name, total_cakes_sold }) => {
                const numericValue = parseFloat(total_cakes_sold);

                if (!isNaN(numericValue)) {
                    if (!totals[city_name]) {
                        totals[city_name] = {};
                    }

                    totals[city_name][category_name] = numericValue;
                }
            });

            // Converte os totais armazenados em objetos para linhas no gráfico
            for (const city in totals) {
                const row = [city];

                if (totals[city]['sobremesa']) {
                    row.push(totals[city]['sobremesa']);
                } else {
                    row.push(0);
                }

                if (totals[city]['bolo de festa']) {
                    row.push(totals[city]['bolo de festa']);
                } else {
                    row.push(0);
                }

                chartData.push(row);
            }

            setDataBar(chartData);
        };

        // Chama a função de transformação quando os dados de cakes são alterados
        if (cakes && cakes.length > 0) {
            transformData();
        }
    }, [cakes]);

    useEffect(() => {
        // Função para transformar os dados de ingredients no formato necessário para o gráfico de pizza
        const transformPieData = () => {
            const chartData = [['Ingredient', 'Quantity']];
    
            ingredients.forEach(({ name, quantity }) => {
                const numericQuantity = parseFloat(quantity) || 0;
    
                chartData.push([name, numericQuantity]);
            });
    
            console.log('Pie Chart Data:', chartData); // Adicionado console.log
    
            setDataPie(chartData);
        };
    
        // Chama a função de transformação quando os dados de ingredients são alterados
        if (ingredients && ingredients.length > 0) {
            transformPieData();
        }
    }, [ingredients]);
    
    

    const optionsBar = {
        title: 'Total Cakes Sold by City and Category',
        chartArea: { width: '50%' },
        hAxis: {
            title: 'City',
            minValue: 0,
        },
        vAxis: {
            title: 'Total Cakes Sold',
        },
        isStacked: true, // Adiciona barras empilhadas para cada categoria
    };

    const optionsPie = {
        title: 'Ingredients Distribution',
    };

    console.log(info.position)

    return (
        <HistoricScreen>
            <Header ></Header>
            <Feed>
                <>{info.position = 1 ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Chart
                        width={'400px'}
                        height={'300px'}
                        chartType="BarChart"
                        data={dataBar}
                        options={optionsBar}
                    />
                    <Chart
                        width={'400px'}
                        height={'300px'}
                        chartType="PieChart"
                        data={dataPie}
                        options={optionsPie}
                    />
                </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Chart
                            width={'400px'}
                            height={'300px'}
                            chartType="BarChart"
                            data={dataBar}
                            options={optionsBar}
                        />
                        <Chart
                            width={'400px'}
                            height={'300px'}
                            chartType="PieChart"
                            data={dataPie}
                            options={optionsPie}
                        />
                    </div>
                )}</>

            </Feed>
            <Footer />
        </HistoricScreen>
    )
}

export default Home