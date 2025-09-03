import {useState, useEffect} from 'react';
import { useParams, Link} from "react-router-dom";
import API from '../../api';
import Popup from 'reactjs-popup';
import './index.css';

const CustomerDetails = () => {
    const {id} = useParams();
    const [addresses, setAddresses] = useState([]);
    const [customer, setCustomer] = useState({
        id,
        first_name: "",
        last_name: "",
        phone_number: ""
    })
    
    
    useEffect(() => {
        API.get(`/api/customers/${id}`)
            .then(response => {
                setCustomer(response.data.data);
            })
            .catch(error => {
                console.error('There was an error fetching the customers!', error);
            });
        API.get(`/api/customers/${id}/addresses`)
            .then(response => {
                console.log(response.data.data);
                setAddresses(response.data.data);
                
            })
            .catch(error => {
                console.error('There was an error fetching the customers!', error);
            });
    },[id]);

    const onDelete = (id, close) => {
        API.delete(`/api/addresses/${id}`)
            .then(response => {
                console.log(response.data.message)
            })
            .catch(error => {
                console.error('There was an error deleting the customer!', error);
            });
        const newAddressesList = () => addresses.filter(each => each.id !== id);
        setAddresses(newAddressesList)
        close();
    }

    return (
        <div className='bg-container'>
            <h1>Customer Details</h1>
            <p>Customer ID: {`${customer.id}`}</p>
            <p>First Name: {`${customer.first_name}`}</p>
            <p>Last Name: {`${customer.last_name}`}</p>
            <p>Mobile Number: {`${customer.phone_number}`}</p>
            <Link to={`/customer/${id}/address/new`}>
                <button type="button">
                    Add New Address
                </button>
            </Link>
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Address ID</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Pincode</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {addresses.map(address => (
                        <tr key={address.id}>
                            <td>{address.id}</td>
                            <td>{address.address_details}</td>
                            <td>{address.city}</td>
                            <td>{address.state}</td>
                            <td>{address.pin_code}</td>
                            <td>
                                <Link to={`/customer/${address.customer_id}/address/${address.id}`}>
                                    <button type='button' className='btn edit-btn'>Edit</button>
                                </Link>
                                
                                <Popup
                                    trigger={<button className="btn delete-btn"> Delete </button>}
                                    modal
                                >
                                    {close => (
                                        <div className="modal">
                                            <div className="header"> Are you sure you want to delete the Customer Address </div>
                                            <div className="content">
                                                <span className='sub-heading'>Customer ID:</span> {`${address.customer_id}`},<br/>
                                                <span className='sub-heading'>Address:</span> {`${address.address_details}`},<br/>
                                                <span className='sub-heading'>City:</span> {`${address.city}`},<br/>
                                                <span className='sub-heading'>State:</span> {`${address.state}`},
                                                <span className='sub-heading'>Pincode:</span> {`${address.pin_code}`},
                                            </div>
                                            <div className="actions">
                                                <button type='button' className='modal-btn' onClick={ () => onDelete(address.id,close)}>
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
    )
}

export default CustomerDetails