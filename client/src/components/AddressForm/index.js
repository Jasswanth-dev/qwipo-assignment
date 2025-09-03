import React, {useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api"

const CustomerForm = () => {
  const {customer_id, id} = useParams();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    customer_id, 
    address_details: "",
    city: "",
    state: "",
    pin_code: "" 
  });

  useEffect(() => {
    if (id) {
        API.get(`/api/customers/${customer_id}/addresses`)
            .then(response => {
              console.log(id)
                const addresses = response.data.data;
                console.log(addresses)
                const requiredAddress = addresses.find(each => each.id === parseInt(id))
                if (requiredAddress !== undefined){
                  setAddress(requiredAddress)
                }
            })
            .catch(error => {
                console.error('There was an error fetching the customers!', error);
            });
    }
  }, [customer_id, id]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id !== undefined && address.address_details !== "" && address.city !== "" && address.state !== "" && address.pin_code !== "") {
      API.put(`/api/addresses/${id}`, address)
        .then(response => {
            navigate(`/customer/details/${customer_id}`);
        })
        .catch(error => {
            console.log(error);
        });
    }else if (address.address_details !== "" && address.city !== "" && address.state !== "" && address.pin_code !== "") {
      API.post(`/api/customer/${customer_id}/addresses`, address)
        .then(response => {
            navigate(`/customer/details/${customer_id}`);
        })
        .catch(error => {
            console.log(error);
        });
    }
  };

  return (
    <div>
      <h2>Add a New Address</h2>
      <form onSubmit={handleSubmit}>

        <div>
          <label>Customer ID: </label>
          <input
            type="text"
            name="id"
            value={address.customer_id}
            readOnly
          />
        </div>

        <div>
          <label>Address: </label>
          <input
            type="text"
            name="address_details"
            value={address.address_details}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>State:</label>
          <input
            type="text"
            name="state"
            value={address.state}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Pincode:</label>
          <input
            type="text"
            name="pin_code"
            value={address.pin_code}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Add</button>
      </form>
    </div>
  );
};


export default CustomerForm;