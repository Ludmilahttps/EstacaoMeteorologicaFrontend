import axios from "axios";
import 'chart.js/auto';
import { format, parseISO } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { UserContext } from "../../UserContext.js";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { Button, ControlItem, ControlPanel, Feed, HistoricScreen, Input, Label, Select } from './style';

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

            const responses = await Promise.all([
                axios.get(`${process.env.REACT_APP_API_URL}/dhtGet`, { params, ...config }),
                axios.get(`${process.env.REACT_APP_API_URL}/pluviometerGet`, { params, ...config }),
                axios.get(`${process.env.REACT_APP_API_URL}/anemometerGet`, { params, ...config }),
                axios.get(`${process.env.REACT_APP_API_URL}/bmpGet`, { params, ...config })
            ]);

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
        return {
            labels: data.map(entry => format(parseISO(entry.timestamp), 'yyyy-MM-dd HH:mm:ss')),
            datasets: labels.map((label, index) => ({
                label,
                data: data.map(entry => entry[label.toLowerCase()]),
                borderColor: ['#F49A23', '#0B928C', '#193946', '#F49A23'][index],
                backgroundColor: ['rgba(244, 154, 35, 0.2)', 'rgba(11, 146, 140, 0.2)', 'rgba(25, 57, 70, 0.2)', 'rgba(244, 154, 35, 0.2)'][index],
                fill: true,
            })),
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
                {!loading && !error && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                        {dhtData.length > 0 && (
                            <div style={{ width: '45%', margin: '20px' }}>
                                <Line
                                    data={formatDataForChart(dhtData, ['Temperature', 'Humidity'])}
                                    options={{
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Dados de Temperatura e Umidade'
                                            }
                                        },
                                        scales: {
                                            x: { title: { display: true, text: 'Tempo' } },
                                            y: { title: { display: true, text: 'Humidade (%) - Temperatura (°C)' } }
                                        }
                                    }}
                                />
                            </div>
                        )}
                        {pluviometerData.length > 0 && (
                            <div style={{ width: '45%', margin: '20px' }}>
                                <Line
                                    data={formatDataForChart(pluviometerData, ['Rainfall'])}
                                    options={{
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Dados de Pluviometria'
                                            }
                                        },
                                        scales: {
                                            x: { title: { display: true, text: 'Tempo' } },
                                            y: { title: { display: true, text: 'Quantidade de Chuva (mm)' } }
                                        }
                                    }}
                                />
                            </div>
                        )}
                        {anemometerData.length > 0 && (
                            <div style={{ width: '45%', margin: '20px' }}>
                                <Line
                                    data={formatDataForChart(anemometerData, ['WindSpeed'])}
                                    options={{
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Dados de Velocidade do Vento'
                                            }
                                        },
                                        scales: {
                                            x: { title: { display: true, text: 'Tempo' } },
                                            y: { title: { display: true, text: 'Velocidade do Vento (m/s)' } }
                                        }
                                    }}
                                />
                            </div>
                        )}
                        {bmpData.length > 0 && (
                            <div style={{ width: '45%', margin: '20px' }}>
                                <Line
                                    data={formatDataForChart(bmpData, ['Pressure'])}
                                    options={{
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Dados de Pressão'
                                            }
                                        },
                                        scales: {
                                            x: { title: { display: true, text: 'Tempo' } },
                                            y: { title: { display: true, text: 'Pressão (hPa)' } }
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </Feed>
            <Footer />
        </HistoricScreen>
    );
}

export default Home;
