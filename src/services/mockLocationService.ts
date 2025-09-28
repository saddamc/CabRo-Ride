
import type { ILocation } from "@/redux/features/ride-api";


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
  {
    id: "custom-location-1",
    name: "Varradi, windy wash Gate, kanchkura",
    address: "Varradi, windy wash Gate, Kanchkura, uttar khan, Dhaka",
    coordinates: [90.4591, 23.8675] as [number, number],
    type: "landmark"
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
    (location.name?.toLowerCase().includes(lowerQuery) || false) || 
    (location.address?.toLowerCase().includes(lowerQuery) || false)
  );
}

/**
 * Get location information based on coordinates
 * @param lat Latitude
 * @param lng Longitude
 * @returns The closest location or a generated one based on coordinates
 */
/**
 * Calculate distance between two points using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in meters
 */
export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

export function reverseGeocode(lat: number, lng: number): ILocation {
  // Find the closest location in our mock data
  const closest = mockLocations.reduce((prev, curr) => {
    const prevDist = Math.pow(prev.coordinates[1] - lat, 2) + Math.pow(prev.coordinates[0] - lng, 2);
    const currDist = Math.pow(curr.coordinates[1] - lat, 2) + Math.pow(curr.coordinates[0] - lng, 2);
    return prevDist < currDist ? prev : curr;
  });

  // Calculate distance in degrees (rough approximation)
  const distance = Math.sqrt(
    Math.pow(closest.coordinates[1] - lat, 2) + Math.pow(closest.coordinates[0] - lng, 2)
  );

  // If within ~50 meters (approximately 0.00045 degrees), return the closest stored location
  if (distance < 0.0005) {
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