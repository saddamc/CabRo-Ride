import type { ILocation } from "@/redux/features/ride/ride.api";

// Sample location data for Bangladesh
const mockLocations: ILocation[] = [
  {
    id: "banani-1",
    name: "Banani Road 11",
    address: "Banani Road 11, Dhaka, Bangladesh",
    coordinates: [90.4043, 23.7937] as [number, number],
    type: "road"
  },
  {
    id: "banani-2",
    name: "Banani DOHS",
    address: "Banani DOHS, Dhaka, Bangladesh",
    coordinates: [90.3982, 23.7985] as [number, number],
    type: "area"
  },
  {
    id: "dhanmondi-1",
    name: "Dhanmondi Lake",
    address: "Dhanmondi Lake, Dhaka, Bangladesh",
    coordinates: [90.3796, 23.7461] as [number, number],
    type: "landmark"
  },
  {
    id: "gulshan-1",
    name: "Gulshan Avenue",
    address: "Gulshan Avenue, Dhaka, Bangladesh",
    coordinates: [90.4152, 23.7925] as [number, number],
    type: "road"
  },
  {
    id: "gulshan-2",
    name: "Gulshan Circle 2",
    address: "Gulshan Circle 2, Dhaka, Bangladesh",
    coordinates: [90.4131, 23.7943] as [number, number],
    type: "landmark"
  },
  {
    id: "uttara-1",
    name: "Uttara Sector 13",
    address: "Uttara Sector 13, Dhaka, Bangladesh",
    coordinates: [90.3983, 23.8728] as [number, number],
    type: "area"
  },
  {
    id: "mohakhali-1",
    name: "Mohakhali Bus Terminal",
    address: "Mohakhali Bus Terminal, Dhaka, Bangladesh",
    coordinates: [90.3953, 23.7786] as [number, number],
    type: "transport"
  },
  {
    id: "mirpur-1",
    name: "Mirpur 10 Circle",
    address: "Mirpur 10 Circle, Dhaka, Bangladesh",
    coordinates: [90.3664, 23.8072] as [number, number],
    type: "landmark"
  },
  {
    id: "airport-1",
    name: "Dhaka Airport (DAC)",
    address: "Hazrat Shahjalal International Airport, Dhaka, Bangladesh",
    coordinates: [90.4125, 23.8498] as [number, number],
    type: "airport"
  },
  {
    id: "tejgaon-1",
    name: "Tejgaon Industrial Area",
    address: "Tejgaon Industrial Area, Dhaka, Bangladesh",
    coordinates: [90.3945, 23.7697] as [number, number],
    type: "area"
  },
  {
    id: "bashundhara-1",
    name: "Bashundhara City Shopping Mall",
    address: "Bashundhara City Shopping Mall, Panthpath, Dhaka, Bangladesh",
    coordinates: [90.3910, 23.7513] as [number, number],
    type: "shopping"
  },
  {
    id: "chittagong-1",
    name: "Chittagong City",
    address: "Chittagong, Bangladesh",
    coordinates: [91.8313, 22.3569] as [number, number],
    type: "city"
  },
  {
    id: "sylhet-1",
    name: "Sylhet City",
    address: "Sylhet, Bangladesh",
    coordinates: [91.8687, 24.8949] as [number, number],
    type: "city"
  },
  {
    id: "coxs-bazar-1",
    name: "Cox's Bazar Beach",
    address: "Cox's Bazar Beach, Bangladesh",
    coordinates: [91.9847, 21.4272] as [number, number],
    type: "beach"
  },
];

/**
 * Search for locations based on a query string
 * @param query Search query string
 * @returns Array of matching location objects
 */
export function searchLocations(query: string): ILocation[] {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return mockLocations.filter(location => 
    location.name.toLowerCase().includes(lowerQuery) || 
    location.address.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get location information based on coordinates
 * @param lat Latitude
 * @param lng Longitude
 * @returns The closest location or a generated one based on coordinates
 */
export function reverseGeocode(lat: number, lng: number): ILocation {
  // Find the closest location in our mock data
  const closest = mockLocations.reduce((prev, curr) => {
    const prevDist = Math.pow(prev.coordinates[1] - lat, 2) + Math.pow(prev.coordinates[0] - lng, 2);
    const currDist = Math.pow(curr.coordinates[1] - lat, 2) + Math.pow(curr.coordinates[0] - lng, 2);
    return prevDist < currDist ? prev : curr;
  });

  // If it's very close, return the closest one
  const distance = Math.sqrt(
    Math.pow(closest.coordinates[1] - lat, 2) + Math.pow(closest.coordinates[0] - lng, 2)
  );
  
  if (distance < 0.01) {
    return closest;
  }
  
  // Otherwise generate a new location based on coordinates
  return {
    id: `location-${lat.toFixed(4)}-${lng.toFixed(4)}`,
    name: `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    address: `Near ${closest.address}`,
    coordinates: [lng, lat] as [number, number],
    type: "custom"
  };
}