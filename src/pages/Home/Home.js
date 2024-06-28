import React, { useContext, useEffect, useState } from 'react';
import { HistoricScreen, Feed, ControlPanel, ControlItem, Label, Input, Select, Button } from './style';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { UserContext } from "../../UserContext.js";
import axios from "axios";
import { format, parseISO } from 'date-fns';
import { Line } from 'react-chartjs-2';
import * as tf from '@tensorflow/tfjs';

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

            // Realize análise e previsão do tempo aqui
            const weatherForecast = forecastWeather(responses[0].data);
            console.log('Weather Forecast:', weatherForecast);

        } catch (error) {
            console.error("Error fetching data:", error.response || error.message || error);
            setError("Error fetching data: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const forecastWeather = (dhtData) => {
        // Exemplo básico de previsão com TensorFlow.js
        const temperatureData = dhtData.map(d => d.temperature);
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
        model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

        const xs = tf.tensor1d(temperatureData.slice(0, -1));
        const ys = tf.tensor1d(temperatureData.slice(1));

        model.fit(xs, ys, { epochs: 10 }).then(() => {
            const input = tf.tensor1d([temperatureData[temperatureData.length - 1]]);
            const prediction = model.predict(input).dataSync();
            console.log("Next temperature prediction: ", prediction[0]);
        });
    };

    const handleFetchData = () => {
        if (startDate && endDate && station) {
            fetchData();
        } else {
            alert("Por favor, preencha todas as informações para buscar os dados.");
        }
    };

    // Preparando dados para gráficos
    const prepareChartData = (data, key) => {
        return {
            labels: data.map(d => format(parseISO(d.date), 'dd/MM/yyyy')),
            datasets: [{
                label: key,
                data: data.map(d => d[key]),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
            }]
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
                    <h2>Temperature</h2>
                    <Line data={prepareChartData(dhtData, 'temperature')} />
                </div>
                <div>
                    <h2>Humidity</h2>
                    <Line data={prepareChartData(dhtData, 'humidity')} />
                </div>
                <div>
                    <h2>Rainfall</h2>
                    <Line data={prepareChartData(pluviometerData, 'rainfall')} />
                </div>
                <div>
                    <h2>Wind Speed</h2>
                    <Line data={prepareChartData(anemometerData, 'windspeed')} />
                </div>
                <div>
                    <h2>Pressure</h2>
                    <Line data={prepareChartData(bmpData, 'pressure')} />
                </div>
            </Feed>
            <Footer />
        </HistoricScreen>
    );
}

export default Home;
