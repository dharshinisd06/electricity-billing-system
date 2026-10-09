import { useState } from "react";

import {
    getCustomer,
    addCustomer,
    addReading,
    getBills,
    getCustomerBills,
    getAboveAverageCustomers
} from "./api";

import "./App.css";

function App() {

    // =====================================================
    // CUSTOMER
    // =====================================================

    const [customerId, setCustomerId] = useState("");
    const [customer, setCustomer] = useState(null);

    const [newCustomer, setNewCustomer] = useState({
        name: "",
        address: "",
        phone: "",
        email: ""
    });

    // =====================================================
    // READING
    // =====================================================

    const [reading, setReading] = useState({
        meterId: "",
        readingDate: "",
        previousReading: "",
        currentReading: ""
    });

    // =====================================================
    // BILLS
    // =====================================================

    const [bills, setBills] = useState([]);
    const [latestBill, setLatestBill] = useState(null);

    // =====================================================
    // ABOVE AVERAGE CUSTOMERS
    // =====================================================

    const [aboveAverageCustomers, setAboveAverageCustomers] =
        useState([]);

    // =====================================================
    // MESSAGE
    // =====================================================

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    // =====================================================
    // SHOW MESSAGE
    // =====================================================

    const showMessage = (text, type = "success") => {

        setMessage(text);
        setMessageType(type);

        setTimeout(() => {
            setMessage("");
        }, 3500);
    };

    // =====================================================
    // GET CUSTOMER
    // =====================================================

    const handleGetCustomer = async () => {

        if (!customerId) {

            showMessage(
                "Please enter a customer ID.",
                "error"
            );

            return;
        }

        try {

            const response =
                await getCustomer(customerId);

            setCustomer(response.data);

            showMessage(
                "Customer found successfully."
            );

        } catch (error) {

            console.error(
                "Get Customer Error:",
                error
            );

            setCustomer(null);

            showMessage(
                error.response?.data?.message ||
                "Customer not found.",
                "error"
            );
        }
    };

    // =====================================================
    // ADD CUSTOMER
    // =====================================================

    const handleAddCustomer = async () => {

        if (!newCustomer.name || !newCustomer.email) {

            showMessage(
                "Name and email are required.",
                "error"
            );

            return;
        }

        try {

            const response =
                await addCustomer(newCustomer);

            setCustomer(response.data);

            setNewCustomer({
                name: "",
                address: "",
                phone: "",
                email: ""
            });

            showMessage(
                "Customer added successfully."
            );

        } catch (error) {

            console.error(
                "Add Customer Error:",
                error
            );

            showMessage(
                error.response?.data?.message ||
                "Failed to add customer.",
                "error"
            );
        }
    };

    // =====================================================
    // ADD READING + GENERATE BILL
    // =====================================================

    const handleAddReading = async () => {

        if (
            !reading.meterId ||
            !reading.readingDate ||
            reading.previousReading === "" ||
            reading.currentReading === ""
        ) {

            showMessage(
                "Please fill all reading details.",
                "error"
            );

            return;
        }

        try {

            const previous =
                Number(reading.previousReading);

            const current =
                Number(reading.currentReading);

            // Validate reading

            if (current < previous) {

                showMessage(
                    "Current reading cannot be less than previous reading.",
                    "error"
                );

                return;
            }

            // Calculate units

            const unitsConsumed =
                current - previous;

            // Reading object sent to backend

            const readingData = {

                readingDate:
                    reading.readingDate,

                previousReading:
                    previous,

                currentReading:
                    current,

                unitsConsumed:
                    unitsConsumed
            };

            console.log(
                "Sending Reading:",
                readingData
            );

            // =================================================
            // STEP 1
            // Save reading
            // =================================================

            await addReading(
                reading.meterId,
                readingData
            );

            console.log(
                "✅ Reading inserted successfully"
            );

            // =================================================
            // STEP 2
            // MySQL trigger automatically generates bill
            // =================================================

            console.log(
                "🔥 MySQL trigger should now have generated the bill."
            );

            // =================================================
            // STEP 3
            // Fetch updated bills
            // =================================================

            const billResponse =
                await getBills();

            const updatedBills =
                billResponse.data;

            console.log(
                "Updated Bills:",
                updatedBills
            );

            // =================================================
            // STEP 4
            // Update bills table
            // =================================================

            setBills(updatedBills);

            // =================================================
            // STEP 5
            // Find the newly generated bill
            // =================================================

            if (updatedBills.length > 0) {

                const latest =
                    updatedBills.reduce(
                        (latestBill, currentBill) => {

                            if (!latestBill) {
                                return currentBill;
                            }

                            return (
                                Number(currentBill.billId) >
                                Number(latestBill.billId)
                            )
                                ? currentBill
                                : latestBill;

                        },
                        null
                    );

                console.log(
                    "🎉 Latest Generated Bill:",
                    latest
                );

                setLatestBill(latest);
            }

            // =================================================
            // STEP 6
            // Clear form
            // =================================================

            setReading({

                meterId: "",
                readingDate: "",
                previousReading: "",
                currentReading: ""

            });

            // =================================================
            // STEP 7
            // Success
            // =================================================

            showMessage(
                "Reading added successfully. Bill generated automatically."
            );

        } catch (error) {

            console.error(
                "Add Reading Error:",
                error
            );

            showMessage(
                error.response?.data?.message ||
                error.message ||
                "Failed to add reading or generate bill.",
                "error"
            );
        }
    };

    // =====================================================
    // GET ALL BILLS
    // =====================================================

    const handleGetBills = async () => {

        try {

            const response =
                await getBills();

            console.log(
                "All Bills:",
                response.data
            );

            setBills(response.data);

            showMessage(
                "All bills loaded successfully."
            );

        } catch (error) {

            console.error(
                "Get Bills Error:",
                error
            );

            showMessage(
                "Failed to load bills.",
                "error"
            );
        }
    };

    // =====================================================
    // GET CUSTOMER BILLS
    // =====================================================

    const handleGetCustomerBills = async () => {

        if (!customerId) {

            showMessage(
                "Please enter a customer ID.",
                "error"
            );

            return;
        }

        try {

            const response =
                await getCustomerBills(customerId);

            console.log(
                "Customer Bills:",
                response.data
            );

            setBills(response.data);

            showMessage(
                "Customer bills loaded successfully."
            );

        } catch (error) {

            console.error(
                "Customer Bills Error:",
                error
            );

            setBills([]);

            showMessage(
                "Failed to load customer bills.",
                "error"
            );
        }
    };

    // =====================================================
    // ABOVE AVERAGE CUSTOMERS
    // =====================================================

    const handleAboveAverage = async () => {

        try {

            const response =
                await getAboveAverageCustomers();

            console.log(
                "Above Average Customers:",
                response.data
            );

            setAboveAverageCustomers(
                response.data
            );

            if (
                !response.data ||
                response.data.length === 0
            ) {

                showMessage(
                    "No customers are above average consumption."
                );

                return;
            }

            showMessage(
                `${response.data.length} customer(s) consume above average.`
            );

        } catch (error) {

            console.error(
                "Above Average Error:",
                error
            );

            setAboveAverageCustomers([]);

            showMessage(
                "Failed to find above-average customers.",
                "error"
            );
        }
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="app">

            {/* =================================================
                TOP BAR
            ================================================= */}

            <header className="topbar">

                <div className="brand">

                    <div className="brand-icon">
                        ⚡
                    </div>

                    <div>

                        <h2>
                            Electra
                        </h2>

                        <span>
                            Electricity Billing System
                        </span>

                    </div>

                </div>

                <div className="api-status">

                    <span className="status-dot"></span>

                    API Connected

                </div>

            </header>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="container">


                {/* =================================================
                    HERO
                ================================================= */}

                <section className="hero">

                    <div>

                        <p className="eyebrow">
                            BILLING MANAGEMENT
                        </p>

                        <h1>
                            Manage electricity
                            <br />
                            <span>
                                customers & bills.
                            </span>
                        </h1>

                        <p className="hero-text">

                            Manage customers, record meter
                            readings, and generate electricity
                            bills through a simple REST-based
                            system.

                        </p>

                    </div>


                    <div className="hero-card">

                        <div className="hero-card-icon">
                            ⚡
                        </div>

                        <div>

                            <strong>
                                Automatic Billing
                            </strong>

                            <p>
                                Bills are generated automatically
                                when a reading is entered.
                            </p>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    STAT CARDS
                ================================================= */}

                <section className="stats">

                    <div className="stat-card">

                        <div className="stat-icon blue">
                            👤
                        </div>

                        <div>

                            <span>
                                Customers
                            </span>

                            <strong>
                                Manage
                            </strong>

                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon purple">
                            ⚡
                        </div>

                        <div>

                            <span>
                                Readings
                            </span>

                            <strong>
                                Record
                            </strong>

                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon green">
                            ₹
                        </div>

                        <div>

                            <span>
                                Bills
                            </span>

                            <strong>
                                Generate
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    MESSAGE
                ================================================= */}

                {message && (

                    <div
                        className={`notification ${messageType}`}
                    >

                        <span>
                            {messageType === "error"
                                ? "⚠"
                                : "✓"}
                        </span>

                        {message}

                    </div>

                )}


                {/* =================================================
                    CUSTOMER MANAGEMENT
                ================================================= */}

                <section className="section-card">


                    <div className="section-header">

                        <div>

                            <p className="section-number">
                                01
                            </p>

                            <h2>
                                Customer Management
                            </h2>

                            <p>
                                Search existing customers or
                                add a new customer.
                            </p>

                        </div>


                        <div className="section-badge">
                            CUSTOMER
                        </div>

                    </div>


                    <div className="divider"></div>


                    {/* FIND CUSTOMER */}

                    <div className="form-block">

                        <h3>
                            Find Customer
                        </h3>


                        <div className="form-row">


                            <div className="input-group">

                                <label>
                                    Customer ID
                                </label>

                                <input
                                    type="number"
                                    placeholder="Enter customer ID"
                                    value={customerId}
                                    onChange={(e) =>
                                        setCustomerId(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            <button
                                className="primary-btn"
                                onClick={handleGetCustomer}
                            >
                                Search Customer
                            </button>


                            <button
                                className="secondary-btn"
                                onClick={handleGetCustomerBills}
                            >
                                View Bills
                            </button>

                        </div>

                    </div>


                    {/* CUSTOMER RESULT */}

                    {customer && (

                        <div className="customer-result">

                            <div className="customer-avatar">

                                {customer.name
                                    ?.charAt(0)
                                    ?.toUpperCase()}

                            </div>


                            <div className="customer-info">

                                <h3>
                                    {customer.name}
                                </h3>


                                <div className="customer-details">

                                    <span>
                                        ID: #{customer.customerId}
                                    </span>

                                    <span>
                                        📍 {customer.address || "—"}
                                    </span>

                                    <span>
                                        📞 {customer.phone || "—"}
                                    </span>

                                    <span>
                                        ✉ {customer.email || "—"}
                                    </span>

                                </div>

                            </div>


                            <span className="active-badge">
                                ACTIVE
                            </span>

                        </div>

                    )}


                    {/* ADD CUSTOMER */}

                    <div className="form-block add-customer">

                        <h3>
                            Add New Customer
                        </h3>


                        <div className="input-grid">


                            <div className="input-group">

                                <label>
                                    Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Customer name"
                                    value={newCustomer.name}
                                    onChange={(e) =>
                                        setNewCustomer({
                                            ...newCustomer,
                                            name: e.target.value
                                        })
                                    }
                                />

                            </div>


                            <div className="input-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    placeholder="customer@email.com"
                                    value={newCustomer.email}
                                    onChange={(e) =>
                                        setNewCustomer({
                                            ...newCustomer,
                                            email: e.target.value
                                        })
                                    }
                                />

                            </div>


                            <div className="input-group">

                                <label>
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    placeholder="Phone number"
                                    value={newCustomer.phone}
                                    onChange={(e) =>
                                        setNewCustomer({
                                            ...newCustomer,
                                            phone: e.target.value
                                        })
                                    }
                                />

                            </div>


                            <div className="input-group">

                                <label>
                                    Address
                                </label>

                                <input
                                    type="text"
                                    placeholder="Customer address"
                                    value={newCustomer.address}
                                    onChange={(e) =>
                                        setNewCustomer({
                                            ...newCustomer,
                                            address: e.target.value
                                        })
                                    }
                                />

                            </div>

                        </div>


                        <button
                            className="primary-btn"
                            onClick={handleAddCustomer}
                        >
                            + Add Customer
                        </button>

                    </div>


                    {/* CONSUMPTION ANALYSIS */}

                    <div className="analysis-box">

                        <div>

                            <strong>
                                Consumption Analysis
                            </strong>

                            <p>
                                Find customers consuming more
                                electricity than the average.
                            </p>

                        </div>


                        <button
                            className="outline-btn"
                            onClick={handleAboveAverage}
                        >
                            Check Above Average →
                        </button>

                    </div>


                    {/* ABOVE AVERAGE CUSTOMERS */}

                    {aboveAverageCustomers.length > 0 && (

                        <div className="above-average-box">


                            <div className="above-average-header">

                                <div>

                                    <h3>
                                        Above Average Consumers
                                    </h3>

                                    <p>
                                        Customers whose electricity
                                        consumption is higher than
                                        the overall average.
                                    </p>

                                </div>


                                <span className="count-badge">

                                    {aboveAverageCustomers.length}
                                    {" "}
                                    Customers

                                </span>

                            </div>


                            <div className="above-average-list">

                                {aboveAverageCustomers.map(
                                    (customer) => (

                                        <div
                                            className="above-average-customer"
                                            key={customer.customerId}
                                        >

                                            <div className="customer-avatar small">

                                                {customer.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase()}

                                            </div>


                                            <div className="above-average-info">

                                                <strong>
                                                    {customer.name}
                                                </strong>

                                                <span>
                                                    Customer ID:
                                                    {" "}
                                                    #{customer.customerId}
                                                </span>

                                                <span>
                                                    Address:
                                                    {" "}
                                                    {customer.address || "—"}
                                                </span>

                                            </div>


                                            <span className="above-average-label">
                                                ABOVE AVERAGE
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}

                </section>


                {/* =================================================
                    METER READING
                ================================================= */}

                <section className="section-card">


                    <div className="section-header">

                        <div>

                            <p className="section-number">
                                02
                            </p>

                            <h2>
                                Meter Reading
                            </h2>

                            <p>
                                Enter the latest electricity
                                meter reading.
                            </p>

                        </div>


                        <div className="section-badge">
                            READING
                        </div>

                    </div>


                    <div className="divider"></div>


                    <div className="input-grid">


                        {/* METER ID */}

                        <div className="input-group">

                            <label>
                                Meter ID
                            </label>

                            <input
                                type="number"
                                placeholder="Example: 1"
                                value={reading.meterId}
                                onChange={(e) =>
                                    setReading({
                                        ...reading,
                                        meterId: e.target.value
                                    })
                                }
                            />

                        </div>


                        {/* READING DATE */}

                        <div className="input-group">

                            <label>
                                Reading Date
                            </label>

                            <input
                                type="date"
                                value={reading.readingDate}
                                onChange={(e) =>
                                    setReading({
                                        ...reading,
                                        readingDate: e.target.value
                                    })
                                }
                            />

                        </div>


                        {/* PREVIOUS READING */}

                        <div className="input-group">

                            <label>
                                Previous Reading
                            </label>

                            <input
                                type="number"
                                placeholder="Example: 100"
                                value={reading.previousReading}
                                onChange={(e) =>
                                    setReading({
                                        ...reading,
                                        previousReading: e.target.value
                                    })
                                }
                            />

                        </div>


                        {/* CURRENT READING */}

                        <div className="input-group">

                            <label>
                                Current Reading
                            </label>

                            <input
                                type="number"
                                placeholder="Example: 250"
                                value={reading.currentReading}
                                onChange={(e) =>
                                    setReading({
                                        ...reading,
                                        currentReading: e.target.value
                                    })
                                }
                            />

                        </div>

                    </div>


                    {/* UNITS PREVIEW */}

                    {reading.previousReading !== "" &&
                        reading.currentReading !== "" && (

                            <div className="units-preview">

                                <div>

                                    <span>
                                        Units Consumed
                                    </span>

                                    <strong>

                                        {Math.max(
                                            0,
                                            Number(
                                                reading.currentReading
                                            ) -
                                            Number(
                                                reading.previousReading
                                            )
                                        )}

                                        {" "}kWh

                                    </strong>

                                </div>


                                <span className="auto-badge">
                                    AUTO CALCULATED
                                </span>

                            </div>

                        )}


                    {/* READING BUTTON */}

                    <div className="reading-action">

                        <button
                            className="primary-btn large-btn"
                            onClick={handleAddReading}
                        >
                            ⚡ Add Reading & Generate Bill
                        </button>


                        <p>
                            The MySQL trigger automatically
                            generates the bill after the reading
                            is inserted.
                        </p>

                    </div>


                    {/* =================================================
                        GENERATED BILL
                    ================================================= */}

                    {latestBill && (

                        <div className="generated-bill">

                            <div className="generated-bill-header">

                                <div>

                                    <span className="generated-label">
                                        BILL GENERATED
                                    </span>

                                    <h3>
                                        Electricity Bill
                                    </h3>

                                </div>


                                <span className="status-badge unpaid">

                                    {latestBill.status ||
                                        "UNPAID"}

                                </span>

                            </div>


                            <div className="generated-bill-details">


                                <div>

                                    <span>
                                        Bill ID
                                    </span>

                                    <strong>
                                        #{latestBill.billId}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Billing Month
                                    </span>

                                    <strong>
                                        {latestBill.billingMonth ||
                                            "—"}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Units Consumed
                                    </span>

                                    <strong>
                                        {latestBill.unitsConsumed ??
                                            "—"} kWh
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Bill Amount
                                    </span>

                                    <strong className="generated-amount">

                                        ₹
                                        {latestBill.billAmount ??
                                            "0.00"}

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Due Date
                                    </span>

                                    <strong>
                                        {latestBill.dueDate ||
                                            "—"}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    )}

                </section>


                {/* =================================================
                    BILLS
                ================================================= */}

                <section className="section-card">


                    <div className="section-header">

                        <div>

                            <p className="section-number">
                                03
                            </p>

                            <h2>
                                Electricity Bills
                            </h2>

                            <p>
                                View generated electricity bills.
                            </p>

                        </div>


                        <div className="section-badge">
                            BILLS
                        </div>

                    </div>


                    <div className="divider"></div>


                    <div className="bill-actions">


                        <button
                            className="primary-btn"
                            onClick={handleGetBills}
                        >
                            View All Bills
                        </button>


                        <button
                            className="secondary-btn"
                            onClick={handleGetCustomerBills}
                        >
                            Customer Bills
                        </button>

                    </div>


                    {/* BILL TABLE */}

                    {bills.length > 0 ? (

                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Bill ID
                                        </th>

                                        <th>
                                            Customer
                                        </th>

                                        <th>
                                            Meter
                                        </th>

                                        <th>
                                            Month
                                        </th>

                                        <th>
                                            Units
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Due Date
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {bills.map((bill) => (

                                        <tr
                                            key={bill.billId}
                                        >

                                            <td>
                                                #{bill.billId}
                                            </td>


                                            <td>

                                                {bill.customerId ||
                                                    bill.customer?.customerId ||
                                                    "—"}

                                            </td>


                                            <td>

                                                {bill.meterId ||
                                                    bill.meter?.meterId ||
                                                    "—"}

                                            </td>


                                            <td>

                                                {bill.billingMonth ||
                                                    "—"}

                                            </td>


                                            <td>

                                                {bill.unitsConsumed ??
                                                    "—"} kWh

                                            </td>


                                            <td className="amount">

                                                ₹
                                                {bill.billAmount ??
                                                    "0.00"}

                                            </td>


                                            <td>

                                                {bill.dueDate ||
                                                    "—"}

                                            </td>


                                            <td>

                                                <span
                                                    className={`status-badge ${
                                                        bill.status
                                                            ?.toLowerCase() ===
                                                        "paid"
                                                            ? "paid"
                                                            : "unpaid"
                                                    }`}
                                                >

                                                    {bill.status ||
                                                        "UNPAID"}

                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    ) : (

                        <div className="empty-state">

                            <div className="empty-icon">
                                ₹
                            </div>

                            <h3>
                                No bills to display
                            </h3>

                            <p>
                                Click "View All Bills" or search
                                for a customer's bills.
                            </p>

                        </div>

                    )}

                </section>

            </main>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="footer">

                <div>

                    <strong>
                        ⚡ Electra
                    </strong>

                    <span>
                        Electricity Billing System
                    </span>

                </div>


                <p>
                    Spring Boot · MySQL · React
                </p>

            </footer>

        </div>
    );
}

export default App;