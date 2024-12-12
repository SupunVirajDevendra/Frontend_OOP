export interface SimulationParameters {
    totalTickets: number;
    ticketReleaseRate: number; // in milliseconds
    customerRetrievalRate: number; // in milliseconds
    maxTicketCapacity: number;
    numVendors: number;
    numCustomers: number;
  }
  
  export interface SimulationDetails {
    executionTime: number;
    vendorTicketsAdded: Record<number, number>; // Vendor ID to count
    customerTicketsRetrieved: Record<number, number>; // Customer ID to count
    ticketsRemaining: number;
  }