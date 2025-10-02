/* eslint-disable @typescript-eslint/no-explicit-any */
import SetOnlineModal from "@/components/modal/setOnline";
import ActiveRideManagement from "@/components/modules/Driver/ActiveRideManagement";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetDriverDetailsQuery, useGetDriverEarningsQuery, useSetOnlineOfflineMutation } from "@/redux/features/driver/driver.api";

import { useAcceptRideMutation, useGetActiveRideQuery, useGetAvailableRidesQuery } from "@/redux/features/rides/ride.api";
import {
  Car, Check, Clock,
  DollarSign, Loader2, Mail,
  MapPin, Phone, Shield, Star,
  User, X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  // console.log("Driver Earnings:", driverEarnings);
  // console.log("User Info:", userInfo ?? "Loading...");
  // console.log("Available Rides:", availableRides ?? "Loading...");
  // console.log("Driver Details:", driverDetails ?? "Loading...");
  // console.log("Driver Availability:", driverDetails?.availability ?? "undefined");
  // console.log("Driver isOnline:", driverDetails?.isOnline ?? "undefined");
  // console.log("Full driverDetails object:", JSON.stringify(driverDetails, null, 2));
  console.log("Active Ride:", activeRide ?? "Loading...");
  console.log("Active Ride status:", activeRide?.status);
  console.log("Payment status:", activeRide?.status === 'payment_completed' ? "PAYMENT IS COMPLETED!" : "Not in payment_completed state");
  const [toggleDriverStatus, { isLoading: isTogglingStatus }] = useSetOnlineOfflineMutation();

  // Local state for availability status since server might not return it initially
  const [localAvailability, setLocalAvailability] = useState<string>("offline");
  // console.log("Toggling Status:", isTogglingStatus);
  const [acceptRide, { isLoading: isAccepting }] = useAcceptRideMutation();

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

      // console.log("Setting local status to:", newLocalStatus);
      // console.log("Sending isOnline:", newApiStatus, "to API");

      // Update local state immediately for instant UI feedback
      setLocalAvailability(newLocalStatus);

      await toggleDriverStatus({ isOnline: newApiStatus }).unwrap();

      // Refetch to sync with server (in case of discrepancies)
      const refetchedData = await refetchDriverDetails();
      // console.log("Refetched data:", refetchedData.data);

      // If server returns different status, update local state to match server
      if (refetchedData.data?.availability && refetchedData.data.availability !== newLocalStatus) {
        // console.log("Server returned different status, updating local state to match");
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

  return (
    <div className="container mx-auto py-6 bg-white min-h-screen text-black">
      {/* Driver Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
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
                  {/* <Currency className="h-5 w-5 text-blue-600" /> */}
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

              <Button variant="outline" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Set Destination
              </Button>

              <Button asChild variant="secondary" className="flex items-center gap-2">
                <Link to="/driver/wallet">
                  <DollarSign className="h-4 w-4" />
                  Wallet
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

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
                  {driverDetails?.data?.vehicleType?.make} 
                  <h1 className="text-sm">{driverDetails?.data?.vehicleType?.model}</h1>
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">{driverDetails?.data?.vehicleType?.year}</span>
                  {driverDetails?.data?.vehicleType?.color && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600 font-medium uppercase">
                      {driverDetails?.data?.vehicleType?.color}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 mb-4">
              <div className="font-medium mb-2">License Plate</div>
              <div className="text-xl font-mono tracking-wider text-center py-1 px-3 border-2 border-dashed border-gray-300 rounded">
                {driverDetails?.data?.vehicleType?.plateNumber ?? "N/A"}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <span>Driver since July 2025</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{userInfo?.data?.email ?? "driver@example.com"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{userInfo?.data?.phone ?? "+1 (555) 987-6543"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">Verified driver</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Cards */}
      {/* (same as your code, no change needed) */}

      {/* Active Ride Management */}
      <ActiveRideManagement ride={activeRide ?? null} />

      {/* Available Rides */}
      <Card id="available-rides" className="border-0 shadow-md">
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
    </div>
  );
}
