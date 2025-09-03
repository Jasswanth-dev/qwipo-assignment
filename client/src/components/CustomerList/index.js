// client/src/pages/CustomerListPage.js
import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'
import API from '../../api';
import Popup from 'reactjs-popup';
import "./index.css"

const CustomerListPage = () => {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('id')
    const [order, setOrder] = useState('asc')



    useEffect(() => {
        API.get(`/api/customers?search=${search}&sortBy=${sortBy}&sortby=${sortBy}&order=${order}`)
            .then(response => {
                setCustomers(response.data.data || []);
            })
            .catch(error => {
                console.error('There was an error fetching the customers!', error);
                setCustomers([]);
            });
    }, [search, sortBy, order]);

    const onDelete = (id, close) => {
        API.delete(`/api/customers/${id}`)
            .then(response => {
                console.log(response.data.message)
            })
            .catch(error => {
                console.error('There was an error deleting the customer!', error);
            });
        const newCustomersList = customers.filter(each => each.id !== id);
        setCustomers(newCustomersList);
        close();
    }


    return (
        <div className='bg-container'>
            <h1>Customers List</h1>
            <div className='pagination-container'>
                <Link to="/customer/new">
                    <button type='button' className='btn'>
                        Add Customer 
                    </button>
                </Link>
                <div className='pagination'>
                    <label htmlFor='search'>Search:</label>
                    <input id="search" type='text' value={search} onChange={e => setSearch(e.target.value)}/>
                    <label htmlFor='sortby'>sortby:</label>
                    <select id="sortBy" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="id">id</option>
                        <option value="first_name">First Name</option>
                        <option value="last_name">Last Name</option>
                    </select>
                    <label htmlFor='order'>Order</label>
                    <button id='order' type='button' onClick={() => {order === 'asc' ? setOrder('desc') : setOrder("asc")}}>{order === 'asc' ? "ASC" : "DESC"}</button>
                </div>
            </div>
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Customer ID</th>
                        <th>First Name</th>
                        <th>Customer Lastname</th>
                        <th>Phone Number</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.first_name}</td>
                            <td>{customer.last_name}</td>
                            <td>{customer.phone_number}</td>
                            <td>
                                <Link to={`/customer/details/${customer.id}`}>
                                    <button type='button' className='btn'>View</button>
                                </Link>

                                <Link to={`/customer/${customer.id}`}>
                                    <button type='button' className='btn edit-btn'>Edit</button>
                                </Link>
                                
                                <Popup
                                    trigger={<button className="btn delete-btn"> Delete </button>}
                                    modal
                                >
                                    {close => (
                                        <div className="modal">
                                            <div className="header"> Are you sure you want to delete the Customer </div>
                                            <div className="content">
                                                <span className='sub-heading'>Customer ID:</span> {`${customer.id}`},<br/>
                                                <span className='sub-heading'>First Name:</span> {`${customer.first_name}`},<br/>
                                                <span className='sub-heading'>Last Name:</span> {`${customer.last_name}`},<br/>
                                                <span className='sub-heading'>Phone Number:</span> {`${customer.phone_number}`},
                                            </div>
                                            <div className="actions">
                                                <button type='button' className='modal-btn' onClick={ () => onDelete(customer.id,close)}>
                                                    Delete
                                                </button>
                                                <button
                                                    type='button'
                                                    className="modal-btn"
                                                    onClick={close}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </Popup>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CustomerListPage;

