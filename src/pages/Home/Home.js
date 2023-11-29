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
            const chartData = [['Cidade', 'Sobremesa', 'Bolo de Festa', 'Bolo Simples']];

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

                if (totals[city]['bolo simples']) {
                    row.push(totals[city]['bolo simples']);
                } else {
                    row.push(0);
                }

                chartData.push(row);
            }

            setDataBar(chartData);
        };
        if (cakes && cakes.length > 0) {
            transformData();
        }

    }, [cakes]);

    useEffect(() => {
        const transformPieData = () => {
            const chartData = [['Ingrediente', 'Quantidade']];

            ingredients.forEach(({ ingredient_name, total_quantity }) => {
                // Verifica se ingredient_name e total_quantity são definidos antes de adicionar ao gráfico
                if (ingredient_name && total_quantity) {
                    const numericQuantity = parseFloat(total_quantity) || 0;
                    chartData.push([ingredient_name, numericQuantity]);
                }
            });
            setDataPie(chartData);
        };

        if (ingredients && ingredients.length > 0) {
            transformPieData();
        }

    }, [ingredients]);

    const dataSales = [['funcionário', 'Total de vendas']];

    if (Array.isArray(sales)) {
      sales.forEach(({ employee_name, total_sales }) => {
        dataSales.push([employee_name, parseInt(total_sales)]);
      });
    } else {
      console.error('Não temos vendas cadastradas no ultimo mes:', sales);
    }
    

    const optionsSales = {
        title: 'Total de vendas por Funcionário',
        chartArea: { width: '50%' },
        hAxis: {
            title: 'Employee',
            minValue: 0,
        },
        vAxis: {
            title: 'Total Sales',
        },
    };

    const optionsBar = {
        title: 'Total de Bolos vendidos por Cidade e Categoria',
        chartArea: { width: '50%' },
        hAxis: {
            title: 'Total de Bolos vendidos',
            minValue: 0,
        },
        vAxis: {
            title: 'Cidades',
        },
        isStacked: true, // Adiciona barras empilhadas para cada categoria
    };

    const optionsPie = {
        title: 'Quantidade de ingredientes usados esse mes',
    };

    console.log(info.positionID)

    return (
        <HistoricScreen>
            <Header ></Header>
            <Feed>
                <>{info.positionID == 1 ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Chart
                            width={'400px'}
                            height={'300px'}
                            chartType="BarChart"
                            data={dataSales}
                            options={optionsSales}
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