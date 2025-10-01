import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateProfileMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api";

import { useGetDriverDetailsQuery, useGetDriverEarningsQuery, useUpdateDriverDocMutation } from "@/redux/features/driver/driver.api";
import { Edit, Save, Star, Truck, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function DriverProfile() {
  const { data: userInfo, isLoading: isUserInfoLoading } = useUserInfoQuery(undefined);
  const { data: driverDetails, isLoading: isDriverLoading } = useGetDriverDetailsQuery();
  // console.log("driver:", driverDetails)
  const { data: earningsData } = useGetDriverEarningsQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [updateDriverDetails, { isLoading: isUpdatingDriver }] = useUpdateDriverDocMutation();
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleModalKey, setVehicleModalKey] = useState(0);

  // Form state for personal info
  const [personalFormData, setPersonalFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Form state for vehicle info
  const [vehicleFormData, setVehicleFormData] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    vehicleType: '',
  });

  useEffect(() => {
    if (userInfo?.data) {
      setPersonalFormData({
        name: userInfo.data.name || '',
        email: userInfo.data.email || '',
        phone: userInfo.data.phone || '',
      });
    }
    if (driverDetails?.vehicleType) {
      setVehicleFormData({
        make: driverDetails.vehicleType.make || '',
        model: driverDetails.vehicleType.model || '',
        year: driverDetails.vehicleType.year?.toString() || '',
        licensePlate: driverDetails.vehicleType.plateNumber || '',
        vehicleType: driverDetails.vehicleType.category || '',
      });
    }
  }, [userInfo, driverDetails]);

  const handlePersonalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVehicleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicleFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      // Update personal info
      const personalData = {
        ...personalFormData,
        _id: userInfo?.data?._id || '',
      };
      await updateProfile(personalData).unwrap();

      // Update vehicle info
      const vehicleData = {
        vehicleType: {
          category: vehicleFormData.vehicleType as 'CAR' | 'BIKE',
          make: vehicleFormData.make,
          model: vehicleFormData.model,
          year: parseInt(vehicleFormData.year),
          plateNumber: vehicleFormData.licensePlate,
        }
      };
      await updateDriverDetails(vehicleData).unwrap();

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditModalOpen(false);
    } catch {
      toast({
        title: "Update Failed",
        description: "There was a problem updating your vehicle.",
        variant: "destructive",
      });
    }
  };


  const handleCancelEdit = () => {
    // Reset form data
    setPersonalFormData({
      name: userInfo?.data?.name || '',
      email: userInfo?.data?.email || '',
      phone: userInfo?.data?.phone || '',
    });
    setVehicleFormData({
      make: driverDetails?.vehicleType?.make || '',
      model: driverDetails?.vehicleType?.model || '',
      year: driverDetails?.vehicleType?.year?.toString() || '',
      licensePlate: driverDetails?.vehicleType?.plateNumber || '',
      vehicleType: driverDetails?.vehicleType?.category || '',
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="container mx-auto py-6 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Driver Profile</h1>
        <p className="text-gray-500">Manage your account details and vehicle information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile sidebar */}
        <div className="md:col-span-1">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                {isUserInfoLoading || isDriverLoading ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-primary"></div>
                    </div>
                    <div className="w-2/3 h-6 bg-gray-200 animate-pulse rounded"></div>
                    <div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">{userInfo?.data?.name || 'Driver Name'}</h2>
                    <p className="text-gray-500">{userInfo?.data?.email || 'driver@example.com'}</p>

                    <div className="mt-2 mb-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        Driver
                      </span>
                    </div>
                  </>
                )}

                <div className="text-center mb-6 w-full">
                  <div className="bg-gray-50 p-3 rounded-lg">
                     <div className="text-sm text-gray-500 mb-1">Member Since</div>
                     <div className="font-medium">
                       {driverDetails?.createdAt
                         ? new Date(driverDetails.createdAt).toLocaleDateString()
                         : 'Not available'}
                     </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-4 w-full">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">Total Rides</div>
                    <div className="font-medium">{earningsData?.totalTrips || 0}</div>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">Rating</div>
                    <div className="font-medium flex items-center justify-center">
                      {earningsData?.averageRating !== null && earningsData?.averageRating !== undefined ? (
                        <>
                          {earningsData.averageRating}
                          <Star className="h-4 w-4 text-yellow-500 ml-1 fill-current" />
                          {earningsData.totalCompletedRides > 0 && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({earningsData.totalCompletedRides})
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-500">Not rated</span>
                      )}
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">Availability</div>
                    <div className="font-medium text-green-600 capitalize">
                      {driverDetails?.data?.availability || 'offline'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <div className="md:col-span-2">
          <Tabs defaultValue="account">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Manage your personal details</CardDescription>
                  </div>
                  {!(isUserInfoLoading || isDriverLoading) && (
                    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent key={vehicleModalKey} className="bg-white/60 backdrop-blur-lg border border-gray-200 dark:bg-gray-900/60 dark:border-gray-700 text-white">
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                          <DialogDescription>Update your personal details</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name">Full Name</Label>
                              <Input
                                id="name"
                                name="name"
                                value={personalFormData.name}
                                onChange={handlePersonalInputChange}
                                className="mt-1"
                                disabled={isUpdating}
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email Address</Label>
                              <Input
                                id="email"
                                name="email"
                                value={personalFormData.email}
                                onChange={handlePersonalInputChange}
                                className="mt-1"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                name="phone"
                                value={personalFormData.phone}
                                onChange={handlePersonalInputChange}
                                className="mt-1"
                                disabled={isUpdating}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={handleCancelEdit}
                              disabled={isUpdating}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSaveProfile}
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <>
                                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardHeader>
                <CardContent>
                  {isUserInfoLoading ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="w-1/3 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                          <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                        <div>
                          <div className="w-1/3 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                          <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <div className="p-2 mt-1 bg-gray-50 rounded">{personalFormData.name}</div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <div className="p-2 mt-1 bg-gray-50 rounded">{personalFormData.email}</div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="p-2 mt-1 bg-gray-50 rounded">{personalFormData.phone || 'Not provided'}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vehicle">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Vehicle Information</CardTitle>
                    <CardDescription>Manage your vehicle details</CardDescription>
                  </div>
                  {!(isUserInfoLoading || isDriverLoading) && (
                    <Dialog open={isVehicleModalOpen} onOpenChange={(open) => {
                      if (open) {
                        // Reset form data to current driver details when opening
                        setVehicleFormData({
                          make: driverDetails?.vehicleType?.make || '',
                          model: driverDetails?.vehicleType?.model || '',
                          year: driverDetails?.vehicleType?.year?.toString() || '',
                          licensePlate: driverDetails?.vehicleType?.plateNumber || '',
                          vehicleType: driverDetails?.vehicleType?.category || '',
                        });
                        setVehicleModalKey(Date.now());
                      }
                      setIsVehicleModalOpen(open);
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Truck className="h-4 w-4 mr-2" />
                          Update License Number
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white/60 backdrop-blur-lg border border-gray-200 dark:bg-gray-900/60 dark:border-gray-700 text-white">
                        <DialogHeader>
                          <DialogTitle>Update Vehicle</DialogTitle>
                          <DialogDescription>Update your vehicle details</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="make">Make</Label>
                              <Input
                                id="make"
                                name="make"
                                defaultValue={vehicleFormData.make}
                                onChange={handleVehicleInputChange}
                                className="mt-1"
                                disabled={isUpdatingDriver}
                              />
                            </div>
                            <div>
                              <Label htmlFor="model">Model</Label>
                              <Input
                                id="model"
                                name="model"
                                defaultValue={vehicleFormData.model}
                                onChange={handleVehicleInputChange}
                                className="mt-1"
                                disabled={isUpdatingDriver}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="year">Year</Label>
                              <Input
                                id="year"
                                name="year"
                                defaultValue={vehicleFormData.year}
                                onChange={handleVehicleInputChange}
                                className="mt-1"
                                disabled={isUpdatingDriver}
                              />
                            </div>
                            <div>
                              <Label htmlFor="licensePlate">License Plate</Label>
                              <Input
                                id="licensePlate"
                                name="licensePlate"
                                defaultValue={vehicleFormData.licensePlate}
                                onChange={handleVehicleInputChange}
                                className="mt-1"
                                disabled={isUpdatingDriver}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="vehicleType">Vehicle Type</Label>
                            <Input
                              id="vehicleType"
                              name="vehicleType"
                              defaultValue={vehicleFormData.vehicleType}
                              onChange={handleVehicleInputChange}
                              className="mt-1"
                              disabled={isUpdatingDriver}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsVehicleModalOpen(false)}
                              disabled={isUpdatingDriver}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={async () => {
                                try {
                                  const vehicleData = {
                                    vehicleType: {
                                      category: vehicleFormData.vehicleType as 'CAR' | 'BIKE',
                                      make: vehicleFormData.make,
                                      model: vehicleFormData.model,
                                      year: parseInt(vehicleFormData.year),
                                      plateNumber: vehicleFormData.licensePlate,
                                    }
                                  };
                                  await updateDriverDetails(vehicleData).unwrap();
                                  toast({
                                    title: "Vehicle Updated",
                                    description: "Your vehicle has been updated successfully.",
                                  });
                                  setIsVehicleModalOpen(false);
                                } catch {
                                  toast({
                                    title: "Update Failed",
                                    description: "There was a problem updating your profile.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              disabled={isUpdatingDriver}
                            >
                              {isUpdatingDriver ? (
                                <>
                                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <Save className="h-4 w-4 mr-2" />
                                  Update
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardHeader>
                <CardContent>
                  {isUserInfoLoading ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="w-1/3 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                          <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                        <div>
                          <div className="w-1/3 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                          <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="licenseNumber">License Number</Label>
                          <div className="p-2 mt-1 bg-gray-50 rounded">{driverDetails?.data?.licenseNumber || 'N/A'}</div>
                        </div>
                        <div>
                          <Label htmlFor="model">Model</Label>
                          <div className="p-2 mt-1 bg-gray-50 rounded">{driverDetails?.data?.vehicleType?.model || 'N/A'}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="year">Year</Label>
                          <div className="p-2 mt-1 bg-gray-50 rounded">{driverDetails?.data?.vehicleType?.year || 'N/A'}</div>
                        </div>
                        <div>
                          <Label htmlFor="licensePlate">License Plate</Label>
                          <div className="p-2 mt-1 bg-gray-50 rounded">{driverDetails?.data?.vehicleType?.plateNumber || 'N/A'}</div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="vehicleType">Vehicle Type</Label>
                        <div className="p-2 mt-1 bg-gray-50 rounded">{driverDetails?.data?.vehicleType?.category || 'N/A'}</div>
                      </div>

                      <div>
                        <Label htmlFor="availability">Availability</Label>
                        <div className="p-2 mt-1 bg-gray-50 rounded">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            driverDetails?.data?.availability === 'online' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {driverDetails?.data?.availability || 'N/A'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="status">Status</Label>
                        <div className="p-2 mt-1 bg-gray-50 rounded">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            driverDetails?.data?.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {driverDetails?.data?.status || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>Manage your password and security settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Password</h4>
                        <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Set Up
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}