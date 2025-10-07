/* eslint-disable @typescript-eslint/no-explicit-any */
import SetOnlineModal from "@/components/modal/setOnline";
import UpdateDriverProfileModal from "@/components/modal/UpdateVehicleMakeModal";
import ActiveRideManagement from "@/components/modules/Driver/ActiveRideManagement";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetDriverDetailsQuery, useGetDriverEarningsQuery, useSetOnlineOfflineMutation, useUpdateDriverDocMutation } from "@/redux/features/driver/driver.api";

import { useAcceptRideMutation, useGetActiveRideQuery, useGetAvailableRidesQuery } from "@/redux/features/rides/ride.api";
import {
  Car, Check, Clock,
  DollarSign, Loader2, Mail,
  MapPin, Phone, Shield, Star,
  User, X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";


export default function DriverDashboard() {
  const location = useLocation();
  const { data: userInfo } = useUserInfoQuery(undefined);
  const { data: availableRides, isLoading: isLoadingRides, refetch: refetchAvailableRides } = useGetAvailableRidesQuery();
  const { data: driverDetails, refetch: refetchDriverDetails } = useGetDriverDetailsQuery();
  const { data: activeRide, refetch: refetchActiveRide } = useGetActiveRideQuery();
  // console.log("driver Details✅", driverDetails)
  const { data: driverEarnings } = useGetDriverEarningsQuery();

  // Auto-refetch available rides on mount and every 15 seconds
  const refetchInterval = useRef<NodeJS.Timeout | null>(null);
  const activeRideInterval = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    refetchAvailableRides(); // Initial fetch
    if (refetchInterval.current) clearInterval(refetchInterval.current);
    refetchInterval.current = setInterval(() => {
      refetchAvailableRides();
    }, 15000); // 15 seconds
    return () => {
      if (refetchInterval.current) clearInterval(refetchInterval.current);
    };
  }, [refetchAvailableRides]);

  // Auto-refetch active ride on mount and every 10 seconds
  useEffect(() => {
    refetchActiveRide(); // Initial fetch
    if (activeRideInterval.current) clearInterval(activeRideInterval.current);
    activeRideInterval.current = setInterval(() => {
      refetchActiveRide();
    }, 10000); // 10 seconds
    return () => {
      if (activeRideInterval.current) clearInterval(activeRideInterval.current);
    };
  }, [refetchActiveRide]);
  
  console.log("Active Ride:", activeRide ?? "Loading...");
  console.log("Active Ride status:", activeRide?.status);
  console.log("Payment status:", activeRide?.status === 'payment_completed' ? "PAYMENT IS COMPLETED!" : "Not in payment_completed state");
  
  const [toggleDriverStatus, { isLoading: isTogglingStatus }] = useSetOnlineOfflineMutation();

  // Local state for availability status since server might not return it initially
  const [localAvailability, setLocalAvailability] = useState<string>("offline");
  
  const [acceptRide, { isLoading: isAccepting }] = useAcceptRideMutation();
  const [updateDriverDoc, { isLoading: isUpdating }] = useUpdateDriverDocMutation();

  console.log("Driver Details:", driverDetails ?? "Loading...");

  const handleAcceptRide = async (rideId: string) => {
    try {
      await acceptRide({ id: rideId }).unwrap();
      toast.success("Ride accepted! You have successfully accepted this ride.");
      // Refetch available rides after accepting
      refetchAvailableRides();
    } catch (error) {
      console.error("Error accepting ride:", error);
      toast.error("Failed to accept ride. Could not accept this ride. It may have been taken by another driver.");
      // Optionally refetch in case of error (to update list)
      refetchAvailableRides();
    }
  };

  const handleRejectRide = () => {
    toast.info("Ride rejected. You have rejected this ride request.");
  };

  const handleToggleStatus = async () => {
    try {
      // Toggle the current availability status locally first for immediate UI feedback
      const newLocalStatus = localAvailability === "online" ? "offline" : "online";
      const newApiStatus = newLocalStatus === "online" ? true : false;

      // Update local state immediately for instant UI feedback
      setLocalAvailability(newLocalStatus);

      await toggleDriverStatus({ isOnline: newApiStatus }).unwrap();

      // Refetch to sync with server (in case of discrepancies)
      const refetchedData = await refetchDriverDetails();

      // If server returns different status, update local state to match server
      if (refetchedData.data?.availability && refetchedData.data.availability !== newLocalStatus) {
        setLocalAvailability(refetchedData.data.availability);
      }

      toast.success(`Status updated successfully. You are now ${newLocalStatus}`);
    } catch (error) {
      console.error("Error toggling driver status:", error);
      // Revert local state on error
      setLocalAvailability(localAvailability === "online" ? "offline" : "online");

      toast.error("Failed to update status. Could not update your availability status. Please try again.");
    }
  };

  // Sync local availability with server data when it changes
  const availability = (driverDetails as any)?.data?.availability;
  const isOnline = (driverDetails as any)?.data?.isOnline;

  useEffect(() => {
    // If the driver has an active ride, especially a completed one, keep their status as online
    // to prevent showing "offline" right after completing a ride
    if (activeRide) {
      if (activeRide.status === 'completed') {
        console.log("Driver has a completed active ride - keeping status as online");
        setLocalAvailability("online");
        return;
      } else if (activeRide.status !== 'cancelled') {
        // For any active ride that's not cancelled, stay online
        setLocalAvailability("online");
        return;
      }
    }

    // Fall back to server-provided availability
    if (availability) {
      setLocalAvailability(availability);
    } else if (isOnline !== undefined) {
      // Fall back to isOnline if availability is not provided
      setLocalAvailability(isOnline ? "online" : "offline");
    }
  }, [availability, isOnline, activeRide]);

  // Handle scrolling to available rides section when navigated with anchor
  useEffect(() => {
    if (location.hash === '#available-rides') {
      setTimeout(() => {
        const element = document.getElementById('available-rides');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500); // Small delay to ensure the component is fully rendered
    }
  }, [location.hash]);

  // ✅ Safe defaults
  const driverStats = {
    totalRides: driverDetails?.stats?.totalRides ?? 0,
    completedToday: driverDetails?.stats?.completedToday ?? 0,
    totalEarnings: driverDetails?.earnings?.totalEarnings ?? 0,
    rating: typeof driverDetails?.rating === 'object' ? driverDetails.rating.average ?? 0 : driverDetails?.rating ?? 0,
    vehicleInfo: (driverDetails as any)?.data?.vehicleInfo ?? {
      make: "Unknown",
      model: "Unknown",
      year: 2022,
      plateNumber: "N/A",
      color: "Unknown",
    },
    // Use local availability state for immediate UI updates
    availability: localAvailability,
  };

  // Check if driver profile needs completing
  const needsProfileCompletion = driverDetails && (
    driverDetails?.data?.vehicleType?.make === "PENDING" || 
    driverDetails?.data?.vehicleType?.model === "PENDING" || 
    driverDetails?.data?.vehicleType?.plateNumber === "PENDING" ||
    driverDetails?.data?.vehicleType?.plateNumber?.startsWith("TEMP-") ||
    driverDetails?.data?.licenseNumber?.startsWith("PENDING-")
  );

  return (
    <div className="container mx-auto py-6 bg-white min-h-screen text-black">
      {/* Driver Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {needsProfileCompletion ? (
          // Profile needs completion - show the completion card
          <Card className="lg:col-span-2 border-0 shadow-md">
            <CardHeader className="bg-amber-50 border-b border-amber-100">
              <CardTitle className="flex items-center gap-2">
                <span className="text-amber-600">⚠️</span>
                <span>Complete Your Profile</span>
              </CardTitle>
              <CardDescription className="text-amber-700">
                Please update your profile information to start accepting rides. Your profile contains temporary or pending information.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Required Information:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  {driverDetails?.data?.vehicleType?.make === "PENDING" && (
                    <li>Vehicle Type (CAR, BIKE)</li>
                  )}
                  {driverDetails?.data?.vehicleType?.model === "PENDING" && (
                    <li>Vehicle model</li>
                  )}
                  {(driverDetails?.data?.vehicleType?.plateNumber === "PENDING" || 
                   driverDetails?.data?.vehicleType?.plateNumber?.startsWith("TEMP-")) && (
                    <li>License plate number</li>
                  )}
                  {driverDetails?.data?.licenseNumber?.startsWith("PENDING-") && (
                    <li>Driver license number</li>
                  )}
                </ul>
              </div>
              
              <UpdateDriverProfileModal
                driverData={driverDetails?.data}
                isLoading={isUpdating}
                onConfirm={async (data) => {
                  try {
                    console.log("Submitting driver profile update:", data);
                    await updateDriverDoc(data).unwrap();
                    toast.success("Profile updated successfully!");
                    refetchDriverDetails(); // Refetch to update the UI
                  } catch (error) {
                    console.error("Error updating profile:", error);
                    toast.error("Failed to update profile. Please try again.");
                  }
                }}
              >
                <Button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white" 
                disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Car className="h-4 w-4" />
                      Complete Your Profile
                    </>
                  )}
                </Button>
              </UpdateDriverProfileModal>
            </CardContent>
          </Card>
        ) : (
          // Profile is complete - show driver statistics
          <Card className="lg:col-span-2 border-0 shadow-md">
            <CardHeader>
              <CardTitle>Driver Statistics</CardTitle>
              <CardDescription>Your performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Total Rides</span>
                  </div>
                  <p className="text-2xl font-bold">{driverEarnings?.totalTrips}</p>
                </div>

                <div className="bg-green-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Today's Earnings</span>
                  </div>
                  <p className="text-2xl font-bold">&#2547; {driverEarnings?.todayEarnings || 0}</p>
                </div>

                <div className="bg-blue-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">Total Earnings</span>
                  </div>
                  <p className="text-2xl font-bold">&#2547; {driverEarnings?.totalEarnings || 0}</p>
                </div>

                <div className="bg-yellow-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium">Rating</span>
                  </div>
                  <p className="text-2xl font-bold">{driverEarnings?.averageRating || 0}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {(activeRide && activeRide.status !== 'completed') || driverDetails?.data?.activeRide ? (
                  <Button
                    disabled
                    className="flex items-center gap-2 bg-[#f56803] hover:bg-blue-700"
                  >
                    <Car className="h-4 w-4" />
                    Busy (Active Ride)
                  </Button>
                ) : (
                  <SetOnlineModal
                    isOnline={driverStats.availability === "online"}
                    isLoading={isTogglingStatus}
                    onConfirm={handleToggleStatus}
                  >
                    <Button
                      disabled={isTogglingStatus}
                      className={`flex items-center gap-2 ${
                        driverStats.availability === "online"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {isTogglingStatus ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : driverStats.availability === "online" ? (
                        <>
                          <Car className="h-4 w-4 " />
                          Online
                        </>
                      ) : (
                        <>
                          <Car className="h-4 w-4" />
                          Offline
                        </>
                      )}
                    </Button>
                  </SetOnlineModal>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 rounded-full bg-gray-100">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {driverDetails?.data?.vehicleType?.make === "PENDING" ? (
                    <span className="text-amber-500">Vehicle Make Required</span>
                  ) : driverDetails?.data?.vehicleType?.make || "Not Specified"}
                  <h1 className="text-sm">
                    {driverDetails?.data?.vehicleType?.model === "PENDING" ? (
                      <span className="text-amber-500">Model Required</span>
                    ) : driverDetails?.data?.vehicleType?.model || "Not Specified"}
                  </h1>
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">{driverDetails?.data?.vehicleType?.year}</span>
                  {driverDetails?.data?.vehicleType?.color && driverDetails?.data?.vehicleType?.color !== "PENDING" ? (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600 font-medium uppercase">
                      {driverDetails?.data?.vehicleType?.color}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-600 font-medium">
                      Color Required
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 mb-4">
              <div className="font-medium mb-2">License Plate</div>
              {driverDetails?.data?.vehicleType?.plateNumber && 
               driverDetails?.data?.vehicleType?.plateNumber.startsWith("TEMP-") ? (
                <div className="text-xl font-mono tracking-wider text-center py-2 px-3 border-2 border-dashed border-amber-300 bg-amber-50 rounded">
                  <span className="text-amber-600">Temporary Plate</span>
                  <div className="text-xs text-amber-500 mt-1">Please update with your real plate number</div>
                </div>
              ) : driverDetails?.data?.vehicleType?.plateNumber === "PENDING" || 
                 driverDetails?.data?.vehicleType?.plateNumber === "N/A" ? (
                <div className="text-xl font-mono tracking-wider text-center py-2 px-3 border-2 border-dashed border-amber-300 bg-amber-50 rounded">
                  <span className="text-amber-600">Plate Number Required</span>
                  <div className="text-xs text-amber-500 mt-1">Please update your profile</div>
                </div>
              ) : (
                <div className="text-xl font-mono tracking-wider text-center py-1 px-3 border-2 border-dashed border-gray-300 rounded">
                  {driverDetails?.data?.vehicleType?.plateNumber}
                </div>
              )}
            </div>

            {/* License number section */}
            <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 mb-4">
              <div className="font-medium mb-2">Driver License</div>
              {driverDetails?.data?.licenseNumber && 
               driverDetails?.data?.licenseNumber.startsWith("PENDING-") ? (
                <div className="text-md font-mono tracking-wider text-center py-2 px-3 border-2 border-dashed border-amber-300 bg-amber-50 rounded">
                  <span className="text-amber-600">License Number Required</span>
                  <div className="text-xs text-amber-500 mt-1">Please update with your real license number</div>
                </div>
              ) : driverDetails?.data?.licenseNumber === "PENDING" ? (
                <div className="text-md font-mono tracking-wider text-center py-2 px-3 border-2 border-dashed border-amber-300 bg-amber-50 rounded">
                  <span className="text-amber-600">License Number Required</span>
                  <div className="text-xs text-amber-500 mt-1">Please update your profile</div>
                </div>
              ) : (
                <div className="text-md font-mono tracking-wider text-center py-1 px-3 border-2 border-dashed border-gray-300 rounded">
                  {driverDetails?.data?.licenseNumber || "Not provided"}
                </div>
              )}
            </div>

            {/* Document Status Section */}
            <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 mb-4">
              <div className="font-medium mb-2">Document Status</div>
              <div className="grid grid-cols-1 gap-2">
                <div className={`flex items-center justify-between p-2 rounded ${
                  driverDetails?.data?.documents?.licenseImage ? "bg-green-50" : "bg-amber-50"
                }`}>
                  <span>Driver's License</span>
                  {driverDetails?.data?.documents?.licenseImage ? (
                    <span className="text-green-600 text-sm">✓ Uploaded</span>
                  ) : (
                    <span className="text-amber-600 text-sm">Not uploaded</span>
                  )}
                </div>
                
                <div className={`flex items-center justify-between p-2 rounded ${
                  driverDetails?.data?.documents?.vehicleRegistration ? "bg-green-50" : "bg-amber-50"
                }`}>
                  <span>Vehicle Registration</span>
                  {driverDetails?.data?.documents?.vehicleRegistration ? (
                    <span className="text-green-600 text-sm">✓ Uploaded</span>
                  ) : (
                    <span className="text-amber-600 text-sm">Not uploaded</span>
                  )}
                </div>
                
                <div className={`flex items-center justify-between p-2 rounded ${
                  driverDetails?.data?.documents?.insurance ? "bg-green-50" : "bg-amber-50"
                }`}>
                  <span>Insurance Document</span>
                  {driverDetails?.data?.documents?.insurance ? (
                    <span className="text-green-600 text-sm">✓ Uploaded</span>
                  ) : (
                    <span className="text-amber-600 text-sm">Not uploaded</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <span>Driver since {driverDetails?.data?.createdAt 
                  ? new Date(driverDetails.data.createdAt).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})
                  : "July 2025"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{userInfo?.data?.email || "Email not available"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                {userInfo?.data?.phone ? (
                  <span>{userInfo.data.phone}</span>
                ) : (
                  <span className="text-amber-600">Phone number not provided</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-gray-500" />
                {driverDetails?.data?.status === "approved" ? (
                  <span className="text-green-600 font-medium">Verified driver</span>
                ) : driverDetails?.data?.status === "pending" ? (
                  <span className="text-amber-600 font-medium">Pending verification</span>
                ) : driverDetails?.data?.status === "suspended" ? (
                  <span className="text-red-600 font-medium">Account suspended</span>
                ) : driverDetails?.data?.status === "rejected" ? (
                  <span className="text-red-600 font-medium">Verification rejected</span>
                ) : (
                  <span className="text-gray-600 font-medium">Status unknown</span>
                )}
              </div>
              
              {driverDetails?.data?.additionalInfo?.experience && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-1">Driving Experience</p>
                  <p className="text-sm text-gray-600">{driverDetails.data.additionalInfo.experience}</p>
                </div>
              )}
              
              {driverDetails?.data?.additionalInfo?.references && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-1">References</p>
                  <p className="text-sm text-gray-600">{driverDetails.data.additionalInfo.references}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Ride Management */}
      <ActiveRideManagement ride={activeRide ?? null} />

      {/* Available Rides */}
      {driverDetails?.data?.status === "approved" && 
       (localAvailability === "online" || driverDetails?.data?.availability === "online") &&
       ( <Card id="available-rides" className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Available Rides</CardTitle>
            <CardDescription>Rides waiting for drivers to accept</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingRides ? (
              <div className="text-center py-6">
                <p className="text-gray-500">Loading available rides...</p>
              </div>
            ) : availableRides && availableRides.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {availableRides.map((ride: any) => (
                  <div key={ride._id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap md:flex-nowrap items-start gap-4">
                      <div className="md:w-1/4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-gray-500" />
                          <span className="font-medium">
                            {ride?.timestamps?.requested
                              ? new Date(ride.timestamps.requested).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                              : "N/A"}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          ID: {ride?._id?.slice(-6) ?? "N/A"}
                        </div>
                      </div>

                      <div className="md:w-1/2">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="flex flex-col items-center">
                            <div className="rounded-full p-1.5 bg-green-100">
                              <MapPin className="h-3 w-3 text-green-600" />
                            </div>
                            <div className="w-0.5 h-8 bg-gray-300 my-1"></div>
                            <div className="rounded-full p-1.5 bg-red-100">
                              <MapPin className="h-3 w-3 text-red-500" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="mb-2">
                              <div className="text-sm text-gray-500">Pickup</div>
                              <div className="font-medium">{ride?.pickupLocation?.address ?? "N/A"}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Destination</div>
                              <div className="font-medium">{ride?.destinationLocation?.address ?? "N/A"}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:w-1/4">
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-right">
                            <div className="font-medium">{ride?.rider?.name ?? "Unknown Rider"}</div>
                            <div className="text-sm text-gray-500">
                              {(ride?.distance?.estimated ?? 0).toFixed(1)} km
                            </div>
                            <div className="text-lg font-bold text-primary">
                              ৳{Math.round(ride?.fare?.totalFare ?? 0)}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={handleRejectRide}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptRide(ride._id)}
                              disabled={isAccepting}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {isAccepting ? (
                                <>Accepting...</>
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  Accept
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No available rides at the moment</p>
                <Button variant="outline" className="mt-4" onClick={() => refetchAvailableRides()}>
                  Refresh
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}