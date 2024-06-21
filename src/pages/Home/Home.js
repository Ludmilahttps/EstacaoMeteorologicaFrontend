import React, { useContext, useEffect, useState } from 'react';
import { HistoricScreen, Feed } from './style';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { UserContext } from "../../UserContext.js";
import { Chart } from "react-google-charts";
import axios from "axios";

function Home() {
    const { info } = useContext(UserContext);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [station, setStation] = useState("");
    const [sensorData, setSensorData] = useState([]);
    const [dataBar, setDataBar] = useState([]);
    const [dataPie, setDataPie] = useState([]);
    const [forecast, setForecast] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get(`/dhtGet`, {
                params: {
                    startDate: startDate,
                    endDate: endDate,
                    station: station
                }
            });
            setSensorData(response.data);
            // Process the data to generate chart data
            processChartData(response.data);
            // Calculate forecast based on the data
            calculateForecast(response.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const processChartData = (data) => {
        // Transform the sensor data to the format required by the charts
        // Assuming data is an array of objects with timestamp and sensor readings
        const chartData = [['Time', 'Temperature', 'Humidity']];
        data.forEach(({ timestamp, temperature, humidity }) => {
            chartData.push([new Date(timestamp), temperature, humidity]);
        });
        setDataBar(chartData);
    };

    const calculateForecast = (data) => {
        // Implement a simple forecast calculation based on the sensor data
        if (data.length > 0) {
            const lastEntry = data[data.length - 1];
            setForecast({
                temperature: lastEntry.temperature + Math.random() * 2 - 1, // Simple random fluctuation
                humidity: lastEntry.humidity + Math.random() * 2 - 1
            });
        }
    };

    const handleFetchData = () => {
        if (startDate && endDate && station) {
            fetchData();
        } else {
            alert("Por favor, preencha todas as informações para buscar os dados.");
        }
    };

    const optionsBar = {
        title: 'Dados dos Sensores',
        chartArea: { width: '50%' },
        hAxis: {
            title: 'Time',
            minValue: 0,
        },
        vAxis: {
            title: 'Values',
        },
    };

    return (
        <HistoricScreen>
            <Header />
            <Feed>
                <div style={{ margin: '20px 0' }}>
                    <label>
                        Data Inicial:
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </label>
                    <label>
                        Data Final:
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </label>
                    <label>
                        Estação:
                        <input type="text" value={station} onChange={e => setStation(e.target.value)} />
                    </label>
                    <button onClick={handleFetchData}>Buscar Dados</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Chart
                        width={'400px'}
                        height={'300px'}
                        chartType="BarChart"
                        data={dataBar}
                        options={optionsBar}
                    />
                </div>
                {forecast && (
                    <div>
                        <h3>Previsão do Tempo</h3>
                        <p>Temperatura: {forecast.temperature.toFixed(2)}°C</p>
                        <p>Umidade: {forecast.humidity.toFixed(2)}%</p>
                    </div>
                )}
            </Feed>
            <Footer />
        </HistoricScreen>
    );
}

export default Home;
