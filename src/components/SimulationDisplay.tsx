import React, { useState, useEffect } from "react";
import axios from "axios";
import { SimulationDetails } from "../models/models";

type SimulationStatus = "idle" | "running" | "stopped";

interface SimulationState {
  status: SimulationStatus;
  details: SimulationDetails | null;
}

const SimulationDisplay: React.FC<{
  onStopSimulation: (details: SimulationDetails) => void;
  simulationDetails: SimulationDetails | null;
}> = ({ onStopSimulation, simulationDetails }) => {

  const [simulationState, setSimulationState] = useState<SimulationState>({
    status: "idle",
    details: null,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (simulationDetails) {
      setSimulationState({ status: "stopped", details: simulationDetails })
    }
  }, [simulationDetails])

  const stopSimulation = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/simulation/stop"
      );
      setSimulationState({ status: "stopped", details: response.data });
      onStopSimulation(response.data);
      setError(null); // Clear any previous errors
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(`Failed to stop simulation: ${error.response.data.message || "Unknown error"}`);
      } else {
        setError("Failed to stop simulation");
      }
    }
  };

  const fetchSimulationDetails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/simulation/details"
      );
      setSimulationState({ status: "stopped", details: response.data });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(
          `Failed to fetch details: ${error.response.data.message || "Unknown error"
          }`
        );
      } else {
        setError("Failed to fetch simulation details");
      }
    }
  };

  return (
    <div>
      <h2>Simulation Details</h2>
      <button onClick={stopSimulation} disabled={simulationState.status !== "running"}>
        Stop Simulation
      </button>
      <button
        onClick={fetchSimulationDetails}
        disabled={simulationState.status === "running"}
      >
        {simulationState.details
          ? "Refresh Details"
          : "Fetch Simulation Details"}
      </button>

      {/* Display error message if present */}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {simulationState.details && (
        <div>

          <table>
            <thead><br></br>
              <tr>
                <th>Vendor ID</th>
                <th>Tickets Added</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(simulationState.details.vendorTicketsAdded).map(
                ([vendorId, count]) => (
                  <tr key={vendorId}>
                    <td>{vendorId}</td>
                    <td>{count}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          <table>
            <thead><br></br>
              <tr>
                <th>Customer ID</th>
                <th>Tickets Retrieved</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(
                simulationState.details.customerTicketsRetrieved
              ).map(([customerId, count]) => (
                <tr key={customerId}>
                  <td>{customerId}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Tickets Remaining: {simulationState.details.ticketsRemaining}</h4>
        </div>
      )}
    </div>
  );
};

export default SimulationDisplay;