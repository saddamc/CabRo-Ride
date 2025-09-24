import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Car, Clock, DollarSign } from 'lucide-react';

interface RideSelectionProps {
  selectedRideType: string;
  rideDetails: {
    fare: number;
    distance: number;
    estimatedTime: number;
  } | null;
  isMapExpanded: boolean;
  onRideTypeChange: (rideType: string) => void;
  onCalculateFare: () => void;
  onToggleMap: () => void;
}

const rideTypes = [
  { id: 'regular', name: 'Economy', price: '৳120', image: '/car-regular.png', multiplier: 1, time: '15 min' },
  { id: 'premium', name: 'Premium', price: '৳180', image: '/car-premium.png', multiplier: 1.5, time: '12 min' },
  { id: 'luxury', name: 'Luxury', price: '৳280', image: '/car-luxury.png', multiplier: 2.3, time: '10 min' },
];

export default function RideSelection({
  selectedRideType,
  rideDetails,
  isMapExpanded,
  onRideTypeChange,
  onCalculateFare,
  onToggleMap
}: RideSelectionProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Choose your ride</h2>
          <Button variant="ghost" size="sm" onClick={onToggleMap}>
            {isMapExpanded ? 'Hide Map' : 'Show Map'}
          </Button>
        </div>

        {/* Ride details */}
        {rideDetails && (
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>{Math.ceil(rideDetails.estimatedTime)} min</span>
            </div>
            <div>
              {(rideDetails.distance / 1000).toFixed(1)} km
            </div>
            <div className="flex items-center">
              <DollarSign size={16} className="mr-1" />
              <span>৳{Math.round(rideDetails.fare)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Ride types */}
      <div className="p-4">
        <div className="space-y-3">
          {rideTypes.map((ride) => (
            <div
              key={ride.id}
              className={cn(
                "border rounded-lg p-3 cursor-pointer transition-all",
                selectedRideType === ride.id
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "hover:bg-gray-50"
              )}
              onClick={() => {
                onRideTypeChange(ride.id);
                onCalculateFare();
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full mr-3 overflow-hidden flex items-center justify-center">
                    <Car size={24} />
                  </div>
                  <div>
                    <p className="font-medium">{ride.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{ride.time}</span>
                      <span>•</span>
                      <span className="font-medium">
                        {rideDetails
                          ? `৳${Math.round(rideDetails.fare * ride.multiplier)}`
                          : ride.price}
                      </span>
                    </div>
                  </div>
                </div>
                <input
                  type="radio"
                  checked={selectedRideType === ride.id}
                  onChange={() => {}}
                  className="h-4 w-4 text-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}