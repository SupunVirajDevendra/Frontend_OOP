import React, { useState } from "react";
import axios from "axios";
import { SimulationParameters } from "../models/models";
import styles from './InputForm.module.css';

const InputForm: React.FC<{
  initialParameters: SimulationParameters;
  onStartSimulation: (parameters: SimulationParameters) => void;
}> = ({ initialParameters, onStartSimulation }) => {
  const [parameters, setParameters] = useState<SimulationParameters>(initialParameters);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // New state for error message

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const numValue = Number(value);

    if (!isNaN(numValue) && numValue >= 0) {
      setParameters({ ...parameters, [name]: numValue });
      setErrorMessage(null);
    } else {
      setErrorMessage("Please enter a valid non-negative number for " + name);
    }
  };

  const startSimulation = async () => {
    if (
      parameters.totalTickets <= 0 ||
      parameters.ticketReleaseRate <= 0 ||
      parameters.customerRetrievalRate <= 0 ||
      parameters.maxTicketCapacity <= 0 ||
      parameters.numVendors <= 0 ||
      parameters.numCustomers <= 0
    ) {
      setErrorMessage("Please enter positive values for all parameters.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/simulation/start",
        parameters
      );

      onStartSimulation(parameters);
      console.log(response.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setErrorMessage(
            `Error: ${error.response.data.message || "Unknown error"
            }`
          );
        } else {
          setErrorMessage("Failed to start simulation: No response from server");
        }
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Simulation Parameters</h2>

      {errorMessage && <div className={styles.error}>{errorMessage}</div>}

      <div>
        <label className={styles.label} htmlFor="totalTickets">Total Tickets: </label>
        <input
          type="number"
          id="totalTickets"
          name="totalTickets"
          value={parameters.totalTickets}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div>
        <label className={styles.label} htmlFor="ticketReleaseRate">Ticket Release Rate (ms): </label>
        <input
          type="number"
          id="ticketReleaseRate"
          name="ticketReleaseRate"
          value={parameters.ticketReleaseRate}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div>
        <label className={styles.label} htmlFor="customerRetrievalRate">
          Customer Retrieval Rate (ms):{" "}
        </label>
        <input
          type="number"
          id="customerRetrievalRate"
          name="customerRetrievalRate"
          value={parameters.customerRetrievalRate}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div>
        <label className={styles.label} htmlFor="maxTicketCapacity">Max Ticket Capacity: </label>
        <input
          type="number"
          id="maxTicketCapacity"
          name="maxTicketCapacity"
          value={parameters.maxTicketCapacity}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div>
        <label className={styles.label} htmlFor="numVendors">Number of Vendors: </label>
        <input
          type="number"
          id="numVendors"
          name="numVendors"
          value={parameters.numVendors}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>
      <div>
        <label className={styles.label} htmlFor="numCustomers">Number of Customers: </label>
        <input
          type="number"
          id="numCustomers"
          name="numCustomers"
          value={parameters.numCustomers}
          onChange={handleInputChange}
          className={styles.input}
        />
      </div>

      <button onClick={startSimulation}>Start Simulation</button>
    </div>
  );
};

export default InputForm;