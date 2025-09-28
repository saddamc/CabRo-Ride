import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { IDriver, ILocation } from '@/redux/features/ride-api';
// import type { IDriver, ILocation } from '@/redux/features/ride/rideapi';
import { Car, Clock, MapPin, Navigation } from 'lucide-react';

interface DriverStatusProps {
  bookingPhase: string;
  pickupLocation: ILocation | null;
  dropoffLocation: ILocation | null;
  matchedDriver: IDriver | null;
  isMapExpanded: boolean;
  onToggleMap: () => void;
  onCompleteRide?: () => void;
}

export default function DriverStatus({
  bookingPhase,
  pickupLocation,
  dropoffLocation,
  matchedDriver,
  isMapExpanded,
  onToggleMap,
  onCompleteRide
}: DriverStatusProps) {
  const renderFindingDriver = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
        <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h2 className="text-xl font-bold mb-2 text-center">Finding your driver</h2>
      <p className="text-gray-500 text-center mb-6">
        Please wait while we connect you with a nearby driver...
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div className="bg-blue-600 h-2 rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: '70%' }}></div>
      </div>
      <p className="text-sm text-gray-500">This usually takes less than 60 seconds</p>
      {/* <p className="text-xs text-gray-400 mt-4 text-center">
        Use the cancel button below to cancel this ride request
      </p> */}
    </div>
  );

  const renderDriverAssigned = () => (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your driver is coming</h2>
          <Button variant="ghost" size="sm" onClick={onToggleMap}>
            {isMapExpanded ? 'Hide Map' : 'Show Map'}
          </Button>
        </div>

        <div className="flex items-center mb-4">
          <div className="h-16 w-16 bg-gray-100 rounded-full mr-4 overflow-hidden">
            {matchedDriver?.profileImage ? (
              <img
                src={matchedDriver.profileImage}
                alt={matchedDriver.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-2xl font-bold">
                {matchedDriver?.name?.charAt(0) || 'D'}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg">{matchedDriver?.name}</h3>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="mr-2">{matchedDriver?.rating}</span>
              <span className="text-gray-500">
                {matchedDriver?.vehicleInfo?.make} {matchedDriver?.vehicleInfo?.model}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              {matchedDriver?.vehicleInfo?.color} • {matchedDriver?.vehicleInfo?.licensePlate}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg flex items-center mb-4">
          <Clock className="text-blue-600 mr-3" size={20} />
          <div>
            <p className="text-sm text-blue-700">Arriving in</p>
            <p className="font-bold">{matchedDriver?.estimatedArrival || 5} minutes</p>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" className="flex-1 mr-2">Call Driver</Button>
          <Button variant="outline" className="flex-1">Message</Button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium mb-3">Trip details</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-10 flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <MapPin size={16} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pickup</p>
              <p className="font-medium">{pickupLocation?.name}</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                <Navigation size={16} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Destination</p>
              <p className="font-medium">{dropoffLocation?.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInProgress = () => (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Ride in progress</h2>
          <Button variant="ghost" size="sm" onClick={onToggleMap}>
            {isMapExpanded ? 'Hide Map' : 'Show Map'}
          </Button>
        </div>

        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <div className="flex items-center mb-2">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <Car className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-bold">On the way to destination</p>
              <p className="text-sm text-green-700">Enjoy your ride!</p>
            </div>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2 mt-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '40%' }}></div>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ride details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Driver</span>
                <span className="font-medium">{matchedDriver?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Vehicle</span>
                <span className="font-medium">
                  {matchedDriver?.vehicleInfo?.make} {matchedDriver?.vehicleInfo?.model}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">License Plate</span>
                <span className="font-medium">
                  {matchedDriver?.vehicleInfo?.licensePlate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-medium text-green-600">In Progress</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-10 flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <MapPin size={16} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pickup</p>
              <p className="font-medium">{pickupLocation?.name}</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                <Navigation size={16} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Destination</p>
              <p className="font-medium">{dropoffLocation?.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompleted = () => (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Ride Completed</h2>
        <p className="text-gray-500 mb-6">Thanks for riding with us!</p>

        <Card className="mb-6 text-left">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Trip Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Pickup</span>
                <span className="font-medium">{pickupLocation?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dropoff</span>
                <span className="font-medium">{dropoffLocation?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Driver</span>
                <span className="font-medium">{matchedDriver?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Vehicle</span>
                <span className="font-medium">
                  {matchedDriver?.vehicleInfo?.make} {matchedDriver?.vehicleInfo?.model}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total fare</span>
                <span>$25.50</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Rate your trip</h3>
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} className="text-2xl text-yellow-400">★</button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mb-4">How was your ride with {matchedDriver?.name}?</p>
        </div>

        <Button className="w-full" onClick={onCompleteRide}>
          Done
        </Button>
      </div>
    </div>
  );

  switch (bookingPhase) {
    case 'finding_driver':
      return renderFindingDriver();
    case 'driver_assigned':
      return renderDriverAssigned();
    case 'in_progress':
      return renderInProgress();
    case 'completed':
      return renderCompleted();
    default:
      return null;
  }
}