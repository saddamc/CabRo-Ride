import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateProfileMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetDriverDetailsQuery, useUpdateDriverDetailsMutation } from "@/redux/features/auth/Driver/deletedriver.api";
import { Edit, Save, Star, User, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function DriverProfile() {
  const { data: userInfo, isLoading: isUserInfoLoading } = useUserInfoQuery(undefined);
  const { data: driverDetails, isLoading: isDriverLoading } = useGetDriverDetailsQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [updateDriverDetails, { isLoading: isUpdatingDriver }] = useUpdateDriverDetailsMutation();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);

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
        vehicleType: driverDetails.vehicleType.color || '', // maybe use color or something else
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
        make: vehicleFormData.make,
        model: vehicleFormData.model,
        year: parseInt(vehicleFormData.year),
        plateNumber: vehicleFormData.licensePlate,
      };
      await updateDriverDetails(vehicleData).unwrap();

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setEditMode(false);
    } catch {
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile.",
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
      make: userInfo?.vehicle?.make || '',
      model: userInfo?.vehicle?.model || '',
      year: userInfo?.vehicle?.year || '',
      licensePlate: userInfo?.vehicle?.licensePlate || '',
      vehicleType: userInfo?.vehicle?.vehicleType || '',
    });
    setEditMode(false);
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
                        : 'August 2023'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 w-full">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">Total Rides</div>
                    <div className="font-medium">{driverDetails?.earnings?.totalTrips || 0}</div>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">Rating</div>
                    <div className="font-medium flex items-center justify-center">
                      {driverDetails?.rating?.average || 0}
                      <Star className="h-4 w-4 text-yellow-500 ml-1 fill-current" />
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">Vehicle Status</div>
                    <div className="font-medium text-green-600">
                      {driverDetails?.status || 'Active'}
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
                    !editMode ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditMode(true)}
                        className="flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                          className="flex items-center"
                          disabled={isUpdating || isUpdatingDriver}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveProfile}
                          className="flex items-center"
                          disabled={isUpdating || isUpdatingDriver}
                        >
                          {isUpdating || isUpdatingDriver ? (
                            <>
                              <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </>
                          )}
                        </Button>
                      </div>
                    )
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
                          {editMode ? (
                            <Input
                              id="name"
                              name="name"
                              value={personalFormData.name}
                              onChange={handlePersonalInputChange}
                              className="mt-1"
                              disabled={isUpdating}
                            />
                          ) : (
                            <div className="p-2 mt-1 bg-gray-50 rounded">{personalFormData.name}</div>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          {editMode ? (
                            <Input
                              id="email"
                              name="email"
                              value={personalFormData.email}
                              onChange={handlePersonalInputChange}
                              className="mt-1"
                              disabled={isUpdating}
                            />
                          ) : (
                            <div className="p-2 mt-1 bg-gray-50 rounded">{personalFormData.email}</div>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        {editMode ? (
                          <Input
                            id="phone"
                            name="phone"
                            value={personalFormData.phone}
                            onChange={handlePersonalInputChange}
                            className="mt-1"
                            disabled={isUpdating}
                          />
                        ) : (
                          <div className="p-2 mt-1 bg-gray-50 rounded">{personalFormData.phone || 'Not provided'}</div>
                        )}
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
                  {!isUserInfoLoading && (
                    !editMode ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditMode(true)}
                        className="flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Vehicle
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                          className="flex items-center"
                          disabled={isUpdating || isUpdatingDriver}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveProfile}
                          className="flex items-center"
                          disabled={isUpdating || isUpdatingDriver}
                        >
                          {isUpdating || isUpdatingDriver ? (
                            <>
                              <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </>
                          )}
                        </Button>
                      </div>
                    )
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
                          <Label htmlFor="make">Make</Label>
                          {editMode ? (
                            <Input
                              id="make"
                              name="make"
                              value={vehicleFormData.make}
                              onChange={handleVehicleInputChange}
                              className="mt-1"
                              disabled={isUpdatingDriver}
                            />
                          ) : (
                            <div className="p-2 mt-1 bg-gray-50 rounded">{vehicleFormData.make || 'Not provided'}</div>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="model">Model</Label>
                          {editMode ? (
                            <Input
                              id="model"
                              name="model"
                              value={vehicleFormData.model}
                              onChange={handleVehicleInputChange}
                              className="mt-1"
                              disabled={isUpdatingDriver}
                            />
                          ) : (
                            <div className="p-2 mt-1 bg-gray-50 rounded">{vehicleFormData.model || 'Not provided'}</div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="year">Year</Label>
                          {editMode ? (
                            <Input
                              id="year"
                              name="year"
                              value={vehicleFormData.year}
                              onChange={handleVehicleInputChange}
                              className="mt-1"
                              disabled={isUpdatingDriver}
                            />
                          ) : (
                            <div className="p-2 mt-1 bg-gray-50 rounded">{vehicleFormData.year || 'Not provided'}</div>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="licensePlate">License Plate</Label>
                          {editMode ? (
                            <Input
                              id="licensePlate"
                              name="licensePlate"
                              value={vehicleFormData.licensePlate}
                              onChange={handleVehicleInputChange}
                              className="mt-1"
                              disabled={isUpdatingDriver}
                            />
                          ) : (
                            <div className="p-2 mt-1 bg-gray-50 rounded">{vehicleFormData.licensePlate || 'Not provided'}</div>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="vehicleType">Vehicle Type</Label>
                        {editMode ? (
                          <Input
                            id="vehicleType"
                            name="vehicleType"
                            value={vehicleFormData.vehicleType}
                            onChange={handleVehicleInputChange}
                            className="mt-1"
                            disabled={isUpdatingDriver}
                          />
                        ) : (
                          <div className="p-2 mt-1 bg-gray-50 rounded">{vehicleFormData.vehicleType || 'Not provided'}</div>
                        )}
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