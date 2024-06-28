import React, { useContext, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { HistoricScreen, Feed, ControlPanel, ControlItem, Label, Input, Select, Button } from './style';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { UserContext } from "../../UserContext.js";
import axios from "axios";
import { format, parseISO } from 'date-fns';
import 'chart.js/auto';

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [weatherForecast, setWeatherForecast] = useState(null);

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
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                idStation: station
            };

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

            // Fetch weather forecast
            const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
                params: {
                    q: 'City,Country', // replace with actual city and country
                    appid: 'YOUR_API_KEY', // replace with your OpenWeatherMap API key
                    units: 'metric'
                }
            });
            setWeatherForecast(weatherResponse.data);

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

    const createChartData = (data, label, yAxisLabel) => {
        return {
            labels: data.map(d => d.timestamp),
            datasets: [
                {
                    label: yAxisLabel,
                    data: data.map(d => d.value),
                    borderColor: 'rgba(75,192,192,1)',
                    backgroundColor: 'rgba(75,192,192,0.2)',
                    fill: true
                }
            ]
        };
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
                <div>
                    {dhtData.length > 0 && <Line data={createChartData(dhtData, 'DHT11 Sensor', 'Temperature/Humidity')} />}
                    {pluviometerData.length > 0 && <Line data={createChartData(pluviometerData, 'Pluviometer', 'Rainfall')} />}
                    {anemometerData.length > 0 && <Line data={createChartData(anemometerData, 'Anemometer', 'Wind Speed')} />}
                    {bmpData.length > 0 && <Line data={createChartData(bmpData, 'BMP Sensor', 'Pressure')} />}
                </div>
                {weatherForecast && (
                    <div>
                        <h2>Previsão do Tempo</h2>
                        {weatherForecast.list.slice(0, 5).map((forecast, index) => (
                            <div key={index}>
                                <p>{new Date(forecast.dt_txt).toLocaleString()}</p>
                                <p>Temperatura: {forecast.main.temp} °C</p>
                                <p>Condição: {forecast.weather[0].description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Feed>
            <Footer />
        </HistoricScreen>
    );
}

export default Home;
