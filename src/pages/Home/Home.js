import React, { useContext, useEffect, useState } from 'react';
import { HistoricScreen, Feed, ControlPanel, ControlItem, Label, Input, Select, Button } from './style';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { UserContext } from "../../UserContext.js";
import { Chart } from "react-google-charts";
import axios from "axios";
import { format, parseISO } from 'date-fns';

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sentParams, setSentParams] = useState(null);

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${info.token}`
                    }
                };
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/stations`, config);
                setStations(response.data);
            } catch (error) {
                console.error("Error fetching stations: ", error);
                setError("Error fetching stations");
            }
        };

        fetchStations();
    }, [info.token]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${info.token}`
                }
            };

            const formattedStartDate = format(parseISO(startDate), 'yyyy/MM/dd');
            const formattedEndDate = format(parseISO(endDate), 'yyyy/MM/dd');

            const params = {
                formattedStartDate,
                formattedEndDate,
                station
            };

            setSentParams(params);

            console.log("Fetching data with params:", params);

            const responses = await Promise.all([
                axios.get(`${process.env.REACT_APP_API_URL}/dhtGet`, { params, ...config }),
                axios.get(`${process.env.REACT_APP_API_URL}/pluviometerGet`, { params, ...config }),
                axios.get(`${process.env.REACT_APP_API_URL}/anemometerGet`, { params, ...config }),
                axios.get(`${process.env.REACT_APP_API_URL}/bmpGet`, { params, ...config })
            ]);

            console.log('DHT Data:', responses[0].data);
            console.log('Pluviometer Data:', responses[1].data);
            console.log('Anemometer Data:', responses[2].data);
            console.log('BMP Data:', responses[3].data);

            setDhtData(responses[0].data);
            setPluviometerData(responses[1].data);
            setAnemometerData(responses[2].data);
            setBmpData(responses[3].data);

            calculateForecast(responses[0].data);
        } catch (error) {
            console.error("Error fetching data:", error.response || error.message || error);
            setError("Error fetching data: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
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
                <ControlPanel>
                    <ControlItem>
                        <Label>Data Inicial:</Label>
                        <Input 
                            type="date" 
                            value={startDate} 
                            onChange={e => setStartDate(e.target.value)} 
                        />
                    </ControlItem>
                    <ControlItem>
                        <Label>Data Final:</Label>
                        <Input 
                            type="date" 
                            value={endDate} 
                            onChange={e => setEndDate(e.target.value)} 
                        />
                    </ControlItem>
                    <ControlItem>
                        <Label>Estação:</Label>
                        <Select 
                            value={station} 
                            onChange={e => setStation(e.target.value)} 
                        >
                            <option value="">Selecione uma Estação</option>
                            {stations.map((station) => (
                                <option key={station.idstation} value={station.idstation}>
                                    {station.location}
                                </option>
                            ))}
                        </Select>
                    </ControlItem>
                    <Button onClick={handleFetchData}>Buscar Dados</Button>
                </ControlPanel>
                {loading && <p>Carregando...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {sentParams && (
                    <div>
                        <h3>Parâmetros Enviados:</h3>
                        <pre>{JSON.stringify(sentParams, null, 2)}</pre>
                    </div>
                )}
                {!loading && !error && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                        {dhtData.length > 0 && (
                            <Chart
                                width={'400px'}
                                height={'300px'}
                                chartType="LineChart"
                                data={formatDataForChart(dhtData, ['Time', 'Temperature', 'Humidity'])}
                                options={{
                                    title: 'Dados de Temperatura e Umidade',
                                    hAxis: { title: 'Time' },
                                    vAxis: { title: 'Values' },
                                    colors: ['#F49A23', '#0B928C']
                                }}
                            />
                        )}
                        {pluviometerData.length > 0 && (
                            <Chart
                                width={'400px'}
                                height={'300px'}
                                chartType="LineChart"
                                data={formatDataForChart(pluviometerData, ['Time', 'Rainfall'])}
                                options={{
                                    title: 'Dados de Pluviometria',
                                    hAxis: { title: 'Time' },
                                    vAxis: { title: 'Rainfall (mm)' },
                                    colors: ['#0B928C']
                                }}
                            />
                        )}
                        {anemometerData.length > 0 && (
                            <Chart
                                width={'400px'}
                                height={'300px'}
                                chartType="LineChart"
                                data={formatDataForChart(anemometerData, ['Time', 'WindSpeed'])}
                                options={{
                                    title: 'Dados de Velocidade do Vento',
                                    hAxis: { title: 'Time' },
                                    vAxis: { title: 'Wind Speed (m/s)' },
                                    colors: ['#193946']
                                }}
                            />
                        )}
                        {bmpData.length > 0 && (
                            <Chart
                                width={'400px'}
                                height={'300px'}
                                chartType="LineChart"
                                data={formatDataForChart(bmpData, ['Time', 'Pressure'])}
                                options={{
                                    title: 'Dados de Pressão',
                                    hAxis: { title: 'Time' },
                                    vAxis: { title: 'Pressure (hPa)' },
                                    colors: ['#F49A23']
                                }}
                            />
                        )}
                    </div>
                )}
                {forecast && (
                    <div style={{ marginTop: '20px', textAlign: 'center', fontFamily: 'Raleway, sans-serif' }}>
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
