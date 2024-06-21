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
    const [stations, setStations] = useState([]);
    const [sensorType, setSensorType] = useState("dht"); // Default to DHT sensor
    const [sensorData, setSensorData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [forecast, setForecast] = useState(null);

    useEffect(() => {
        // Fetch the list of stations
        const fetchStations = async () => {
            try {
                const response = await axios.get(`/stations`);
                setStations(response.data);
            } catch (error) {
                console.error("Error fetching stations: ", error);
            }
        };

        fetchStations();
    }, []);

    const fetchData = async () => {
        try {
            const endpointMap = {
                dht: "/dhtGet",
                pluviometer: "/pluviometerGet",
                anemometer: "/anemometerGet",
                bmp: "/bmpGet"
            };

            const response = await axios.get(endpointMap[sensorType], {
                params: {
                    startDate: startDate,
                    endDate: endDate,
                    station: station
                }
            });
            setSensorData(response.data);
            processChartData(response.data);
            calculateForecast(response.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const processChartData = (data) => {
        const chartDataMap = {
            dht: [['Time', 'Temperature', 'Humidity']],
            pluviometer: [['Time', 'Rainfall']],
            anemometer: [['Time', 'Wind Speed']],
            bmp: [['Time', 'Pressure']]
        };

        data.forEach((entry) => {
            const timestamp = new Date(entry.timestamp);
            if (sensorType === "dht") {
                chartDataMap.dht.push([timestamp, entry.temperature, entry.humidity]);
            } else if (sensorType === "pluviometer") {
                chartDataMap.pluviometer.push([timestamp, entry.rainfall]);
            } else if (sensorType === "anemometer") {
                chartDataMap.anemometer.push([timestamp, entry.windSpeed]);
            } else if (sensorType === "bmp") {
                chartDataMap.bmp.push([timestamp, entry.pressure]);
            }
        });

        setChartData(chartDataMap[sensorType]);
    };

    const calculateForecast = (data) => {
        if (data.length > 0) {
            const lastEntry = data[data.length - 1];
            if (sensorType === "dht") {
                setForecast({
                    temperature: lastEntry.temperature + Math.random() * 2 - 1,
                    humidity: lastEntry.humidity + Math.random() * 2 - 1
                });
            }
        }
    };

    const handleFetchData = () => {
        if (startDate && endDate && station) {
            fetchData();
        } else {
            alert("Por favor, preencha todas as informações para buscar os dados.");
        }
    };

    const chartOptionsMap = {
        dht: {
            title: 'Dados de Temperatura e Umidade',
            hAxis: { title: 'Time' },
            vAxis: { title: 'Values' },
        },
        pluviometer: {
            title: 'Dados de Pluviometria',
            hAxis: { title: 'Time' },
            vAxis: { title: 'Rainfall (mm)' },
        },
        anemometer: {
            title: 'Dados de Velocidade do Vento',
            hAxis: { title: 'Time' },
            vAxis: { title: 'Wind Speed (m/s)' },
        },
        bmp: {
            title: 'Dados de Pressão',
            hAxis: { title: 'Time' },
            vAxis: { title: 'Pressure (hPa)' },
        }
    };

    return (
        <HistoricScreen>
            <Header />
            <Feed>
                <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ marginRight: '10px', fontSize: '16px', fontFamily: 'Arial, sans-serif' }}>
                            Data Inicial:
                        </label>
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={e => setStartDate(e.target.value)} 
                            style={{ padding: '5px', fontSize: '16px', fontFamily: 'Arial, sans-serif' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ marginRight: '10px', fontSize: '16px', fontFamily: 'Arial, sans-serif' }}>
                            Data Final:
                        </label>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={e => setEndDate(e.target.value)} 
                            style={{ padding: '5px', fontSize: '16px', fontFamily: 'Arial, sans-serif' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ marginRight: '10px', fontSize: '16px', fontFamily: 'Arial, sans-serif' }}>
                            Estação:
                        </label>
                        <select 
                            value={station} 
                            onChange={e => setStation(e.target.value)} 
                            style={{ padding: '5px', fontSize: '16px', fontFamily: 'Arial, sans-serif' }}
                        >
                            <option value="">Selecione uma Estação</option>
                            {stations.map((station) => (
                                <option key={station.id} value={station.id}>
                                    {station.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ marginRight: '10px', fontSize: '16px', fontFamily: 'Arial, sans-serif' }}>
                            Tipo de Sensor:
                        </label>
                        <select 
                            value={sensorType} 
                            onChange={e => setSensorType(e.target.value)} 
                            style={{ padding: '5px', fontSize: '16px', fontFamily: 'Arial, sans-serif' }}
                        >
                            <option value="dht">DHT11</option>
                            <option value="pluviometer">Pluviômetro</option>
                            <option value="anemometer">Anemômetro</option>
                            <option value="bmp">BMP280</option>
                        </select>
                    </div>
                    <button 
                        onClick={handleFetchData} 
                        style={{ padding: '10px 20px', fontSize: '16px', fontFamily: 'Arial, sans-serif', cursor: 'pointer' }}
                    >
                        Buscar Dados
                    </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Chart
                        width={'400px'}
                        height={'300px'}
                        chartType="LineChart"
                        data={chartData}
                        options={chartOptionsMap[sensorType]}
                    />
                </div>
                {forecast && sensorType === "dht" && (
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
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
