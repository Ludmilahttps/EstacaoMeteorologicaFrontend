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
    const [dhtData, setDhtData] = useState([]);
    const [pluviometerData, setPluviometerData] = useState([]);
    const [anemometerData, setAnemometerData] = useState([]);
    const [bmpData, setBmpData] = useState([]);
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
            const responses = await Promise.all([
                axios.get("/dhtGet", { params: { startDate, endDate, station } }),
                axios.get("/pluviometerGet", { params: { startDate, endDate, station } }),
                axios.get("/anemometerGet", { params: { startDate, endDate, station } }),
                axios.get("/bmpGet", { params: { startDate, endDate, station } })
            ]);

            setDhtData(responses[0].data);
            setPluviometerData(responses[1].data);
            setAnemometerData(responses[2].data);
            setBmpData(responses[3].data);

            calculateForecast(responses[0].data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const handleFetchData = () => {
        if (startDate && endDate && station) {
            fetchData();
        } else {
            alert("Por favor, preencha todas as informações para buscar os dados.");
        }
    };

    const calculateForecast = (dhtData) => {
        if (dhtData.length > 0) {
            const lastEntry = dhtData[dhtData.length - 1];
            setForecast({
                temperature: lastEntry.temperature + Math.random() * 2 - 1,
                humidity: lastEntry.humidity + Math.random() * 2 - 1
            });
        }
    };

    const formatDataForChart = (data, labels) => {
        const chartData = [labels];
        data.forEach(entry => {
            const row = [new Date(entry.timestamp), ...labels.slice(1).map(label => entry[label.toLowerCase()])];
            chartData.push(row);
        });
        return chartData;
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
                    <button 
                        onClick={handleFetchData} 
                        style={{ padding: '10px 20px', fontSize: '16px', fontFamily: 'Arial, sans-serif', cursor: 'pointer' }}
                    >
                        Buscar Dados
                    </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    <Chart
                        width={'400px'}
                        height={'300px'}
                        chartType="LineChart"
                        data={formatDataForChart(dhtData, ['Time', 'Temperature', 'Humidity'])}
                        options={{
                            title: 'Dados de Temperatura e Umidade',
                            hAxis: { title: 'Time' },
                            vAxis: { title: 'Values' },
                        }}
                    />
                    <Chart
                        width={'400px'}
                        height={'300px'}
                        chartType="LineChart"
                        data={formatDataForChart(pluviometerData, ['Time', 'Rainfall'])}
                        options={{
                            title: 'Dados de Pluviometria',
                            hAxis: { title: 'Time' },
                            vAxis: { title: 'Rainfall (mm)' },
                        }}
                    />
                    <Chart
                        width={'400px'}
                        height={'300px'}
                        chartType="LineChart"
                        data={formatDataForChart(anemometerData, ['Time', 'WindSpeed'])}
                        options={{
                            title: 'Dados de Velocidade do Vento',
                            hAxis: { title: 'Time' },
                            vAxis: { title: 'Wind Speed (m/s)' },
                        }}
                    />
                    <Chart
                        width={'400px'}
                        height={'300px'}
                        chartType="LineChart"
                        data={formatDataForChart(bmpData, ['Time', 'Pressure'])}
                        options={{
                            title: 'Dados de Pressão',
                            hAxis: { title: 'Time' },
                            vAxis: { title: 'Pressure (hPa)' },
                        }}
                    />
                </div>
                {forecast && (
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
