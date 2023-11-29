import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { HistoricScreen, Feed } from './style.js';
import { UserContext } from '../../UserContext.js';
import './DeleteOrder.css'; 

function DeleteOrder() {
    const { info } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${info.token}`,
            },
          };
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders`, config);
          setOrders(response.data);
        } catch (error) {
          if (error.name === 'AxiosError') {
            alert("We couldn't find an account with this data!");
          }
        }
      };
  
      fetchData();
    }, [info.token]);
  
    const handleDeleteOrder = async (orderId) => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${info.token}`,
          },
        };
  
        setLoading(true);
        await axios.delete(`${process.env.REACT_APP_API_URL}/orders/${orderId}`, config);
        // Atualizar a lista de pedidos após a exclusão
        const updatedOrders = orders.filter((order) => order.orderId !== orderId);
        setOrders(updatedOrders);
      } catch (error) {
        if (error.name === 'AxiosError') {
          alert('Error deleting the order. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
  
    return (
        <HistoricScreen>
          <Feed>
            <div className="order-table-container">
              <table className="order-table">
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Cliente</th>
                    <th>Bolo</th>
                    <th>Quantidade</th>
                    <th>Preço Total</th>
                    <th>Data do pedido</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.orderId}>
                      <td>{order.orderId}</td>
                      <td>{order.client.name}</td>
                      <td>{order.cake.name}</td>
                      <td>{order.quantity}</td>
                      <td>{order.totalPrice}</td>
                      <td>{new Date(order.createdat).toLocaleString()}</td>
                        <button
                          onClick={() => handleDeleteOrder(order.orderId)}
                          disabled={loading}
                          className="delete-button"
                        >
                          <p>X</p>
                        </button>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Feed>
        </HistoricScreen>
      );
    }
  
  export default DeleteOrder;
  
