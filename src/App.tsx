import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import SimulationDisplay from './components/SimulationDisplay';
import { SimulationParameters, SimulationDetails } from './models/models';
import 'axios';
import './App.css';

const App: React.FC = () => {
  const [simulationParameters, setSimulationParameters] = useState<SimulationParameters>({
    totalTickets: 100,
    ticketReleaseRate: 1000,
    customerRetrievalRate: 2000,
    maxTicketCapacity: 50,
    numVendors: 3,
    numCustomers: 5,
  });

  const [simulationDetails, setSimulationDetails] = useState<SimulationDetails | null>(null);

  const handleStartSimulation = (parameters: SimulationParameters) => {
    setSimulationParameters(parameters);
    setSimulationDetails(null); // Reset details on new simulation start
  };

  const handleStopSimulation = (details: SimulationDetails) => {
    setSimulationDetails(details);
  };

  useEffect(() => {
    let eventSource: EventSource | null = null;

    if (simulationParameters.totalTickets > 0) {
      eventSource = new EventSource(
        `http://localhost:8080/api/simulation/details`
      );

      eventSource.onmessage = (event) => {
        const newDetails: SimulationDetails = JSON.parse(event.data);
        setSimulationDetails((prevDetails) => ({
          ...prevDetails, // Preserve existing details
          ...newDetails,   // Overwrite with new details
        }));
      };

      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource?.close();
      };
    }

    return () => {
      eventSource?.close();
    };
  }, [simulationParameters]);

  return (
    <div className="App">
      <h1>Ticket Simulation</h1>
      <InputForm
        initialParameters={simulationParameters}
        onStartSimulation={handleStartSimulation}
      />
      <SimulationDisplay
        onStopSimulation={handleStopSimulation}
        simulationDetails={simulationDetails} // Pass the current details
      />
    </div>
  );
};

export default App;