import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useChangePasswordMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import { useUpdateUserMutation } from "@/redux/features/auth/User/user.api";

import {
  useGetDriverDetailsQuery,
  useGetDriverEarningsQuery,
  useUpdateDriverDocMutation,
} from "@/redux/features/driver/driver.api";
import { Edit, Save, Star, Truck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast as sonnerToast, toast } from "sonner";

export default function DriverProfile() {
  const { data: userInfo, isLoading: isUserInfoLoading } =
    useUserInfoQuery(undefined);
  const { data: driverDetails, isLoading: isDriverLoading } =
    useGetDriverDetailsQuery();
  // console.log("driver:", driverDetails)
  const { data: earningsData } = useGetDriverEarningsQuery();
  const [updateDriverDetails, { isLoading: isUpdatingDriver }] =
    useUpdateDriverDocMutation();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleModalKey, setVehicleModalKey] = useState(0);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  // ChangePassword form state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Form state for personal info
  const [personalFormData, setPersonalFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Form state for vehicle info
  const [vehicleFormData, setVehicleFormData] = useState({
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    vehicleType: "",
  });

  useEffect(() => {
    if (userInfo?.data) {
      setPersonalFormData({
        name: userInfo.data.name || "",
        email: userInfo.data.email || "",
        phone: userInfo.data.phone || "",
      });
    }
    if (driverDetails?.vehicleType) {
      setVehicleFormData({
        make: driverDetails.vehicleType.make || "",
        model: driverDetails.vehicleType.model || "",
        year: driverDetails.vehicleType.year?.toString() || "",
        licensePlate: driverDetails.vehicleType.plateNumber || "",
        vehicleType: driverDetails.vehicleType.category || "",
      });
    }
  }, [userInfo, driverDetails]);

  const handlePersonalInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPersonalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVehicleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicleFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      // Update user information using useUpdateUserMutation
      const userUpdatePayload = {
        id: userInfo?.data?._id || "",
        data: {
          name: personalFormData.name,
          email: personalFormData.email,
          phone: personalFormData.phone,
        },
      };

      await updateUser(userUpdatePayload).unwrap();

      sonnerToast.success("Profile updated successfully.");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Profile update failed:", error);
      sonnerToast.error("Failed to update profile information.");
    }
  };

  const handleCancelEdit = () => {
    // Reset form data
    setPersonalFormData({
      name: userInfo?.data?.name || "",
      email: userInfo?.data?.email || "",
      phone: userInfo?.data?.phone || "",
    });
    setVehicleFormData({
      make: driverDetails?.vehicleType?.make || "",
      model: driverDetails?.vehicleType?.model || "",
      year: driverDetails?.vehicleType?.year?.toString() || "",
      licensePlate: driverDetails?.vehicleType?.plateNumber || "",
      vehicleType: driverDetails?.vehicleType?.category || "",
    });
    setIsEditModalOpen(false);
  };

  // step -2 changePassword
  const handleChangePassword = async () => {
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match", {
        description:
          "Please make sure your new password and confirmation match.",
      });
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 6) {
      toast.error("Password too short", {
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();

      toast.success("Password Changed", {
        description: "Your password has been updated successfully.",
      });

      // Reset form and close modal
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangePasswordModalOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Password Change Failed", {
        description:
          error?.data?.message || "There was an error changing your password.",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 bg-white text-black">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Driver Profile</h1>
        <p className="text-muted-foreground">
          Manage your account details and vehicle information
        </p>
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
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                      {userInfo?.data?.profilePicture ? (
                        <img
                          src={userInfo.data.profilePicture}
                          alt="Profile"
                          className="h-24 w-24 object-cover rounded-full border border-gray-200"
                        />
                      ) : (
                        <User className="h-12 w-12 text-primary" />
                      )}
                    </div>
                    <h2 className="text-xl font-bold">
                      {userInfo?.data?.name || "Driver Name"}
                    </h2>
                    <p className="text-gray-500">
                      {userInfo?.data?.email || "driver@example.com"}
                    </p>

                    <div className="mt-2 mb-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        Driver
                      </span>
                    </div>
                  </>
                )}

                <div className="text-center mb-6 w-full">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">
                      Member Since
                    </div>
                    <div className="font-medium">
                      {userInfo?.data?.createdAt
                        ? new Date(userInfo.data.createdAt).toLocaleDateString()
                        : "August 2023"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 w-full">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">
                      Total Rides
                    </div>
                    <div className="font-medium">
                      {earningsData?.totalTrips || 0}
                    </div>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">Rating</div>
                    <div className="font-medium flex items-center justify-center">
                      {earningsData?.averageRating !== null &&
                      earningsData?.averageRating !== undefined ? (
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
                    <div className="text-sm text-gray-500 mb-1">
                      Availability
                    </div>
                    <div className="font-medium text-green-600 capitalize">
                      {driverDetails?.data?.availability || "offline"}
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
                    <CardDescription>
                      Manage your personal details
                    </CardDescription>
                  </div>
                  {!(isUserInfoLoading || isDriverLoading) && (
                    <Dialog
                      open={isEditModalOpen}
                      onOpenChange={setIsEditModalOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        key={vehicleModalKey}
                        className="bg-white/60 backdrop-blur-lg border border-gray-200 dark:bg-gray-900/60 dark:border-gray-700"
                      >
                        <DialogHeader>
                          <DialogTitle className="text-gray-900 dark:text-white">
                            Edit Profile
                          </DialogTitle>
                          <DialogDescription className="text-gray-600 dark:text-gray-300">
                            Update your personal details
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label
                                htmlFor="name"
                                className="text-gray-900 dark:text-white"
                              >
                                Full Name
                              </Label>
                              <Input
                                id="name"
                                name="name"
                                value={personalFormData.name}
                                onChange={handlePersonalInputChange}
                                className="mt-1 text-gray-900 dark:text-white"
                                disabled={isUpdatingDriver || isUpdatingUser}
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="email"
                                className="text-gray-900 dark:text-white"
                              >
                                Email Address
                              </Label>
                              <Input
                                id="email"
                                name="email"
                                value={personalFormData.email}
                                onChange={handlePersonalInputChange}
                                className="mt-1 text-gray-900 dark:text-white"
                                disabled
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label
                                htmlFor="phone"
                                className="text-gray-900 dark:text-white"
                              >
                                Phone Number
                              </Label>
                              <Input
                                id="phone"
                                name="phone"
                                value={personalFormData.phone}
                                onChange={handlePersonalInputChange}
                                className="mt-1 text-gray-900 dark:text-white"
                                disabled={isUpdatingDriver || isUpdatingUser}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={handleCancelEdit}
                              disabled={isUpdatingDriver || isUpdatingUser}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSaveProfile}
                              className="bg-white border-black  hover:bg-black hover:text-white"
                              disabled={isUpdatingDriver || isUpdatingUser}
                            >
                              {isUpdatingDriver || isUpdatingUser ? (
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
                          <div className="p-2 mt-1 bg-gray-50 rounded">
                            {personalFormData.name}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <div className="p-2 mt-1 bg-gray-50 rounded">
                            {personalFormData.email}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="p-2 mt-1 bg-gray-50 rounded">
                          {personalFormData.phone || "Not provided"}
                        </div>
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
                    <CardDescription>
                      Manage your vehicle details
                    </CardDescription>
                  </div>
                  {!(isUserInfoLoading || isDriverLoading) && (
                    <Dialog
                      open={isVehicleModalOpen}
                      onOpenChange={(open) => {
                        if (open) {
                          setVehicleFormData({
                            make: driverDetails?.data?.vehicleType?.make || "",
                            model:
                              driverDetails?.data?.vehicleType?.model || "",
                            year:
                              driverDetails?.data?.vehicleType?.year?.toString() ||
                              "",
                            licensePlate:
                              driverDetails?.data?.vehicleType?.plateNumber ||
                              "",
                            vehicleType:
                              driverDetails?.data?.vehicleType?.category || "",
                          });
                          setVehicleModalKey(Date.now());

                          sonnerToast.success("Vehicle Edit Ready.");
                          // toast({
                          //   title: "Vehicle Edit Ready",
                          //   description: "You can now edit your vehicle information.",
                          // });
                        }
                        setIsVehicleModalOpen(open);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          <Truck className="h-4 w-4 mr-2" />
                          Update Driver Doc
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white/60 backdrop-blur-lg border border-gray-200 dark:bg-gray-900/60 dark:border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-gray-900 dark:text-white">
                            Update Vehicle
                          </DialogTitle>
                          <DialogDescription className="text-gray-600 dark:text-gray-300">
                            Update your vehicle details
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label
                                htmlFor="make"
                                className="text-gray-900 dark:text-white"
                              >
                                Make
                              </Label>
                              <Input
                                id="make"
                                name="make"
                                value={vehicleFormData.make}
                                onChange={handleVehicleInputChange}
                                className="mt-1 text-gray-900 dark:text-white"
                                disabled={isUpdatingDriver}
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="model"
                                className="text-gray-900 dark:text-white"
                              >
                                Model
                              </Label>
                              <Input
                                id="model"
                                name="model"
                                value={vehicleFormData.model}
                                onChange={handleVehicleInputChange}
                                className="mt-1 text-gray-900 dark:text-white"
                                disabled={isUpdatingDriver}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label
                                htmlFor="year"
                                className="text-gray-900 dark:text-white"
                              >
                                Year
                              </Label>
                              <Input
                                id="year"
                                name="year"
                                value={vehicleFormData.year}
                                onChange={handleVehicleInputChange}
                                className="mt-1 text-gray-900 dark:text-white"
                                disabled={isUpdatingDriver}
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="licensePlate"
                                className="text-gray-900 dark:text-white"
                              >
                                License Plate
                              </Label>
                              <Input
                                id="licensePlate"
                                name="licensePlate"
                                value={vehicleFormData.licensePlate}
                                onChange={handleVehicleInputChange}
                                className="mt-1 text-gray-900 dark:text-white"
                                disabled={isUpdatingDriver}
                              />
                            </div>
                          </div>
                          <div>
                            <Label
                              htmlFor="vehicleType"
                              className="text-gray-900 dark:text-white"
                            >
                              Vehicle Type
                            </Label>
                            <Input
                              id="vehicleType"
                              name="vehicleType"
                              value={vehicleFormData.vehicleType}
                              onChange={handleVehicleInputChange}
                              className="mt-1 text-gray-900 dark:text-white"
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
                                    category: vehicleFormData.vehicleType as
                                      | "CAR"
                                      | "BIKE",
                                    make: vehicleFormData.make,
                                    model: vehicleFormData.model,
                                    year: parseInt(vehicleFormData.year),
                                    plateNumber: vehicleFormData.licensePlate,
                                    // add color if you have it
                                  };
                                  await updateDriverDetails(
                                    vehicleData
                                  ).unwrap();
                                  sonnerToast.success(
                                    "Vehicle updated successfully."
                                  );
                                  setIsVehicleModalOpen(false);
                                } catch (error) {
                                  console.error(
                                    "Vehicle update failed:",
                                    error
                                  );
                                  sonnerToast.error("Vehicle update failed.");
                                }
                              }}
                              disabled={isUpdatingDriver}
                              className="bg-white border-black  hover:bg-black hover:text-white"
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
                          <div className="p-2 mt-1 bg-gray-50 rounded">
                            {driverDetails?.data?.licenseNumber || "N/A"}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="model">Model</Label>
                          <div className="p-2 mt-1 bg-gray-50 rounded">
                            {driverDetails?.data?.vehicleType?.model || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="year">Year</Label>
                          <div className="p-2 mt-1 bg-gray-50 rounded">
                            {driverDetails?.data?.vehicleType?.year || "N/A"}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="licensePlate">License Plate</Label>
                          <div className="p-2 mt-1 bg-gray-50 rounded">
                            {driverDetails?.data?.vehicleType?.plateNumber ||
                              "N/A"}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="vehicleType">Vehicle Type</Label>
                        <div className="p-2 mt-1 bg-gray-50 rounded">
                          {driverDetails?.data?.vehicleType?.category || "N/A"}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="availability">Availability</Label>
                        <div className="p-2 mt-1 bg-gray-50 rounded">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              driverDetails?.data?.availability === "online"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {driverDetails?.data?.availability || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="status">Status</Label>
                        <div className="p-2 mt-1 bg-gray-50 rounded">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              driverDetails?.data?.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {driverDetails?.data?.status || "N/A"}
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
                  <CardDescription>
                    Manage your password and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Password</h4>
                        <p className="text-sm text-gray-500">
                          Last changed 30 days ago
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsChangePasswordModalOpen(true)}
                      >
                        Change Password
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">
                          Two-Factor Authentication
                        </h4>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Set Up
                      </Button>
                    </div>
                  </div>

                  <Dialog
                    open={isChangePasswordModalOpen}
                    onOpenChange={setIsChangePasswordModalOpen}
                  >
                    <Dialog
                      open={isChangePasswordModalOpen}
                      onOpenChange={setIsChangePasswordModalOpen}
                    >
                      <DialogContent className="bg-white/60 backdrop-blur-lg border border-gray-200 dark:bg-gray-900/60 dark:border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-gray-900 dark:text-white">
                            Change Password
                          </DialogTitle>
                          <DialogDescription className="text-gray-600 dark:text-gray-300">
                            Enter your current password and set a new one
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label
                              htmlFor="oldPassword"
                              className="text-gray-900 dark:text-white"
                            >
                              Current Password
                            </Label>
                            <Input
                              id="oldPassword"
                              name="oldPassword"
                              type="password"
                              value={passwordData.oldPassword}
                              onChange={handlePasswordInputChange}
                              className="mt-1 text-gray-900 dark:text-white"
                              placeholder="Enter your current password"
                              disabled={isChangingPassword}
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="newPassword"
                              className="text-gray-900 dark:text-white"
                            >
                              New Password
                            </Label>
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type="password"
                              value={passwordData.newPassword}
                              onChange={handlePasswordInputChange}
                              className="mt-1 text-gray-900 dark:text-white"
                              placeholder="Enter your new password"
                              disabled={isChangingPassword}
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="confirmPassword"
                              className="text-gray-900 dark:text-white"
                            >
                              Confirm New Password
                            </Label>
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordInputChange}
                              className="mt-1 text-gray-900 dark:text-white"
                              placeholder="Confirm your new password"
                              disabled={isChangingPassword}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() =>
                                setIsChangePasswordModalOpen(false)
                              }
                              disabled={isChangingPassword}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="bg-white border-black  hover:bg-black hover:text-white"
                              onClick={handleChangePassword}
                              disabled={
                                isChangingPassword ||
                                !passwordData.oldPassword ||
                                !passwordData.newPassword ||
                                !passwordData.confirmPassword
                              }
                            >
                              {isChangingPassword ? (
                                <>
                                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                                  Changing...
                                </>
                              ) : (
                                <>
                                  <Save className="h-4 w-4 mr-2" />
                                  Change Password
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </Dialog>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
