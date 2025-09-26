import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Clock, DollarSign } from 'lucide-react';

interface RideSelectionProps {
  selectedRideType: string;
  rideDetails: {
    fare: number;
    distance: number;
    estimatedTime: number;
  } | null;
  isMapExpanded: boolean;
  onRideTypeChange: (rideType: string) => void;
  onToggleMap: () => void;
}

// Consistent ride types with new pricing rates
const rideTypes = [
  {
    id: 'regular',
    name: 'Economy',
    basePrice: 150,
    perKm: 50,
    image: '/car-regular.png',
    multiplier: 1,
    // time: '15 min',
    description: 'Affordable rides for everyday travel'
  },
  {
    id: 'premium',
    name: 'Premium',
    basePrice: 200,
    perKm: 75,
    image: '/car-premium.png',
    multiplier: 1.5,
    // time: '12 min',
    description: 'Newer cars with extra comfort'
  },
  {
    id: 'luxury',
    name: 'Luxury',
    basePrice: 300,
    perKm: 120,
    image: '/car-luxury.png',
    multiplier: 2,
    // time: '10 min',
    description: 'High-end cars with professional drivers'
  },
];

export default function RideSelection({
  selectedRideType,
  rideDetails,
  isMapExpanded,
  onRideTypeChange,
  onToggleMap
}: RideSelectionProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white font-bold">Choose your ride</h2>
          <Button className='text-white cursor-pointer' variant="ghost" size="sm" onClick={onToggleMap}>
            {isMapExpanded ? 'Hide Map' : 'Show Map'}
          </Button>
        </div>

        {/* Ride details */}
        {rideDetails && (
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>{Math.round(rideDetails.estimatedTime)} min</span>
            </div>
            <div>
              {(rideDetails.distance / 1000).toFixed(2)} km
            </div>
            <div className="flex items-center">
              <DollarSign size={16} className="mr-1" />
              <span>৳{(() => {
                // Calculate real-time price based on selected ride type and actual distance
                const selectedRide = rideTypes.find(ride => ride.id === selectedRideType);
                if (selectedRide && rideDetails) {
                  const distanceKm = rideDetails.distance / 1000;
                  const totalPrice = selectedRide.basePrice + (distanceKm * selectedRide.perKm);
                  return totalPrice.toFixed(2);
                }
                return '0.00';
              })()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Ride types */}
      <div className="p-4">
        <div className="space-y-4">
          {rideTypes.map((ride) => {
            // Calculate real-time price based on distance and ride type
            let displayPrice;
            if (rideDetails) {
              const distanceKm = rideDetails.distance / 1000;
              displayPrice = (ride.basePrice + (distanceKm * ride.perKm)).toFixed(2);
            } else {
              displayPrice = ride.basePrice.toString();
            }
            
            return (
              <div
                key={ride.id}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-all",
                  selectedRideType === ride.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
                )}
                onClick={() => {
                  onRideTypeChange(ride.id);
                  // Price remains stable - no recalculation needed
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={cn(
                      "w-14 h-14 rounded-full mr-4 overflow-hidden flex items-center justify-center",
                      selectedRideType === ride.id ? "bg-blue-100" : "bg-gray-100"
                    )}>
                      <img 
                        src={ride.image} 
                        alt={ride.name} 
                        className="h-10 w-10 object-contain"
                      />
                    </div>
                    <div>
                      <p className={cn(
                        "font-semibold text-lg",
                        selectedRideType === ride.id ? "text-blue-600" : "text-gray-800 dark:text-white"
                      )}>
                        {ride.name}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                        {/* <span>{ride.time}</span> */}
                        <span>•</span>
                        <span className={cn(
                          "font-medium",
                          selectedRideType === ride.id ? "text-blue-600" : "text-gray-700 dark:text-gray-300"
                        )}>
                          ৳{displayPrice}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{ride.description}</div>
                    </div>
                  </div>
                  
                  <input
                    type="radio"
                    checked={selectedRideType === ride.id}
                    onChange={() => {}}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}