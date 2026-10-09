import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api"
});

export const getCustomer = (id) =>
    API.get(`/customers/${id}`);

export const addCustomer = (customer) =>
    API.post("/customers", customer);

export const addReading = (meterId, reading) =>
    API.post(`/readings/${meterId}`, reading);

export const getBills = () =>
    API.get("/bills");

export const getCustomerBills = (customerId) =>
    API.get(`/bills/customer/${customerId}`);

export const getAboveAverageCustomers = () =>
    API.get("/customers/above-average");