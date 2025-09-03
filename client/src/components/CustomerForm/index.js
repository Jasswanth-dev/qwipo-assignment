import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from '../../api';

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: ""
  });

  useEffect(() => {
    if (id) {
        API.get(`/api/customers/${id}`)
            .then(response => {
                const customer = response.data.data
                console.log(customer)
                const existingCustomerData = {
                    firstName: customer.first_name,
                    lastName: customer.last_name,
                    phoneNumber: customer.phone_number
                }
                setCustomerData(existingCustomerData)
            })
            .catch(error => {
                console.error('There was an error fetching the customers!', error);
            });
    }
  }, [id]);

  const handleChange = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (id !== undefined && customerData.firstName !== "" && customerData.lastName !== "" && customerData.phoneNumber !== "") {
      API.put(`/api/customers/${id}`, {
            first_name: customerData.firstName,
            last_name: customerData.lastName,
            phone_number: customerData.phoneNumber,
        })
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
    } else if (customerData.firstName !== "" && customerData.lastName !== "" && customerData.phoneNumber !== "") {
      API.post(`/api/customers`, {
            first_name: customerData.firstName,
            last_name: customerData.lastName,
            phone_number: customerData.phoneNumber,
        })
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
        setCustomerData({
            firstName: "",
            lastName: "",
            phoneNumber: ""
        })
    }

    navigate("/");
  };

  return (
    <div>
      <h2>{id ? "Edit Customer" : "Create Customer"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name: </label>
          <input
            type="text"
            name="firstName"
            value={customerData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Last Name: </label>
          <input
            type="text"
            name="lastName"
            value={customerData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Mobile Number </label>
          <input
            type="text"
            name="phoneNumber"
            value={customerData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">{id ? "Update" : "Create"}</button>
      </form>
    </div>
  );
}


export default CustomerForm