import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetRideByIdQuery } from "@/redux/features/rides/ride.api";
import { ArrowLeft, Calendar, Car, CheckCircle, Clock, DollarSign, MapPin, Navigation, Phone, Star, Timer, User, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DetailsHistory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  console.log('DetailsHistory - Ride ID:', id);
  
  // Force refetch and skip cache to ensure we get fresh data
  const { data: ride, isLoading, error, refetch } = useGetRideByIdQuery(id || "", {
    refetchOnMountOrArgChange: true,
    skip: !id || id.length < 5
  });
  
  // Effect to verify token and refetch on mount
  useEffect(() => {
    // Check if token exists and is valid
    const token = localStorage.getItem('accessToken');
    if (token) {
      console.log('DetailsHistory - Token verification:', token.substring(0, 10) + '...');
      // Refetch after a small delay to ensure auth state is properly initialized
      const timer = setTimeout(() => {
        refetch();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [refetch]);
  // More detailed logging to help debug
  console.log('DetailsHistory - API Response:', { 
    rideExists: !!ride,
    isLoading, 
    error: error ? JSON.stringify(error) : null,
    authHeader: localStorage.getItem('accessToken') ? 'Token exists' : 'No token' 
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading ride details...</p>
          <p className="text-muted-foreground mt-2">This may take a moment...</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => refetch()}
          >
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="container mx-auto py-8 px-4 bg-background">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="mb-4 text-xl font-semibold">Failed to load ride details</p>
          <p className="text-muted-foreground mb-6">Please check if the ride exists or try again later.</p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/rider/history')}
              className="bg-primary hover:bg-primary-dark"
            >
              Back to Ride History
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-primary text-primary hover:bg-primary/10"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'requested': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/rider/history')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to History
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Ride Details</h1>
          <p className="text-muted-foreground">Ride ID: {ride._id.slice(-8)}</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-6">
        <Badge className={`${getStatusColor(ride.status)} text-sm px-3 py-1`}>
          {ride.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Ride Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Ride Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Requested</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{formatDateTime(ride.createdAt).date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{formatDateTime(ride.createdAt).time}</span>
                </div>
              </div>

              {ride.timestamps.completed && (
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">{formatDateTime(ride.timestamps.completed).date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{formatDateTime(ride.timestamps.completed).time}</span>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <p className="text-sm text-gray-600 mb-2">Distance & Duration</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">{ride.distance?.estimated?.toFixed(1)} km</span>
                  <p className="text-xs text-gray-600">Estimated Distance</p>
                </div>
                {ride.distance?.actual && (
                  <div>
                    <span className="font-medium">{ride.distance.actual.toFixed(1)} km</span>
                    <p className="text-xs text-gray-600">Actual Distance</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <span className="font-medium">{ride.duration?.estimated ? `${Math.round(ride.duration.estimated)} min` : 'N/A'}</span>
                  <p className="text-xs text-gray-600">Estimated Duration</p>
                </div>
                {ride.duration?.actual && (
                  <div>
                    <span className="font-medium">{Math.round(ride.duration.actual)} min</span>
                    <p className="text-xs text-gray-600">Actual Duration</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Driver Information */}
        {ride.driver && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Driver Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-lg">{ride.driver?.name}</p>
                <div className="flex items-center gap-1 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{ride.driver?.phone}</span>
                </div>
                {ride.driver.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-transparent" />
                    <span className="font-medium">{ride.driver.rating}</span>
                  </div>
                )}
              </div>

              {ride.driver.vehicleType && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Vehicle Details</p>
                    <p className="font-medium">
                      {ride.driver.vehicleType.make} {ride.driver.vehicleType.model}
                    </p>
                    <p className="text-sm text-gray-600">
                      {ride.driver.vehicleType.plateNumber} • {ride.driver.vehicleType.color}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Locations */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Route Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="rounded-full p-2 bg-green-100">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
                <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                <div className="rounded-full p-2 bg-red-100">
                  <MapPin className="h-4 w-4 text-red-600" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Pickup Location</p>
                  <p className="font-medium">{ride.pickupLocation.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Destination</p>
                  <p className="font-medium">{ride.destinationLocation.address}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ride Timeline */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Ride Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ride.timestamps.requested && (
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Ride Requested</p>
                    <p className="text-xs text-gray-600">{formatDateTime(ride.timestamps.requested).date} at {formatDateTime(ride.timestamps.requested).time}</p>
                  </div>
                </div>
              )}

              {ride.timestamps.accepted && (
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Driver Accepted</p>
                    <p className="text-xs text-gray-600">{formatDateTime(ride.timestamps.accepted).date} at {formatDateTime(ride.timestamps.accepted).time}</p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              )}

              {ride.timestamps.driverArrived && (
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Driver Arrived</p>
                    <p className="text-xs text-gray-600">{formatDateTime(ride.timestamps.driverArrived).date} at {formatDateTime(ride.timestamps.driverArrived).time}</p>
                  </div>
                  <Navigation className="h-4 w-4 text-blue-600" />
                </div>
              )}

              {ride.timestamps.pickedUp && (
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-purple-500"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Ride Started</p>
                    <p className="text-xs text-gray-600">{formatDateTime(ride.timestamps.pickedUp).date} at {formatDateTime(ride.timestamps.pickedUp).time}</p>
                  </div>
                  <Car className="h-4 w-4 text-purple-500" />
                </div>
              )}

              {ride.timestamps.completed && (
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-green-600"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Ride Completed</p>
                    <p className="text-xs text-gray-600">{formatDateTime(ride.timestamps.completed).date} at {formatDateTime(ride.timestamps.completed).time}</p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              )}

              {ride.timestamps.cancelled && (
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Ride Cancelled</p>
                    <p className="text-xs text-gray-600">{formatDateTime(ride.timestamps.cancelled).date} at {formatDateTime(ride.timestamps.cancelled).time}</p>
                  </div>
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Base Fare</p>
                <p className="font-medium">৳{ride.fare?.baseFare?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Distance Fare</p>
                <p className="font-medium">৳{ride.fare?.distanceFare?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time Fare</p>
                <p className="font-medium">৳{ride.fare?.timeFare?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Fare</p>
                <p className="font-bold text-lg">৳{ride.fare?.totalFare?.toFixed(2)}</p>
              </div>
            </div>

            {(ride.transactionId || ride.payment?.transactionId) && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {ride.transactionId || ride.payment?.transactionId || 'N/A'}
                  </p>
                </div>
              </>
            )}

            {ride.paymentMethod && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium capitalize">{ride.paymentMethod || 'Cash'}</p>
                </div>
              </>
            )}

            {ride.paymentStatus && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className={`font-medium capitalize ${
                    ride.paymentStatus === 'completed' ? 'text-green-600' :
                    ride.paymentStatus === 'pending' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {ride.paymentStatus || 'Pending'}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Ratings */}
        {(ride.rating?.riderRating || ride.rating?.driverRating) && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Ratings & Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {ride.rating.driverRating && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Your Rating for Driver</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= ride.rating!.driverRating!
                                ? 'fill-yellow-400 text-yellow-600'
                                : 'text-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{ride.rating.driverRating}/5</span>
                    </div>
                    {ride.rating.driverFeedback && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        "{ride.rating.driverFeedback}"
                      </p>
                    )}
                  </div>
                )}

                {ride.rating.riderRating && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Driver's Rating for You</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= ride.rating!.riderRating!
                                ? 'fill-yellow-400 text-yellow-600'
                                : 'text-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{ride.rating.riderRating}/5</span>
                    </div>
                    {ride.rating.riderFeedback && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        "{ride.rating.riderFeedback}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Support Actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Support & Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2 justify-center"
                onClick={() => navigate('/ride', {
                  state: {
                    pickup: ride.pickupLocation,
                    destination: ride.destinationLocation
                  }
                })}
              >
                <ArrowLeft className="h-4 w-4" />
                Rebook Similar Ride
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-2 justify-center"
                onClick={() => window.open('tel:+8801234567890', '_self')}
              >
                <Phone className="h-4 w-4" />
                Call Support
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-2 justify-center"
                onClick={() => navigate('/rider/history')}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to History
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-700 mb-2">Need more help?</p>
              <p className="text-sm text-gray-600">
                For billing issues, lost items, or other concerns, contact our support team.
                Reference Ride ID: <span className="font-mono bg-gray-100 px-1 rounded text-black">{ride._id.slice(-8)}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetailsHistory;