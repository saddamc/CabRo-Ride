import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUpdateProfileMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useApplyDriverMutation } from "@/redux/features/driver/driver.api";
import { useGetRideHistoryQuery } from "@/redux/features/ride-api";
import { Bell, Clock, CreditCard, Edit, Home, MapPin, Save, Star, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function RiderProfile() {
  const { data: userInfo, isLoading: isUserInfoLoading } = useUserInfoQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [applyDriver, { isLoading: isApplying }] = useApplyDriverMutation();
  const { data: rideHistory } = useGetRideHistoryQuery({ limit: 100 });
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    isOnline: false,
  });
  // Driver application form state
  const [driverApplicationData, setDriverApplicationData] = useState({
    vehicleType: 'CAR' as 'CAR' | 'BIKE',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    licensePlate: '',
    licenseNumber: '',
    driverLicense: '',
    vehicleRegistration: '',
    insurance: '',
    experience: '',
    references: '',
  });
  
  useEffect(() => {
    if (userInfo?.data) {
      setFormData({
        name: userInfo.data.name || '',
        email: userInfo.data.email || '',
        phone: userInfo.data.phone || '',
        address: userInfo.data.address || '',
        emergencyContact: userInfo.data.emergencyContact || '',
        isOnline: userInfo.data.isOnline || false,
      });
    }
  }, [userInfo]);

  // Calculate real stats from ride history
  const completedRides = rideHistory?.grouped?.completed || [];
  const totalRides = rideHistory?.total || 0;

  // Calculate average rating from completed rides
  const averageRating = completedRides.length > 0
    ? completedRides.reduce((sum: number, ride: any) => sum + (ride.rating?.riderRating || 0), 0) / completedRides.length
    : 0;
  
  
  // Mock saved places
  const mockSavedPlaces = [
    { id: 'place-1', name: 'Home', address: '123 Residential St, Apt 4B', icon: <Home className="h-4 w-4" /> },
    { id: 'place-2', name: 'Work', address: '456 Office Building, Suite 700', icon: <Clock className="h-4 w-4" /> },
    { id: 'place-3', name: 'Gym', address: 'Fitness Center, 789 Workout Ave', icon: <MapPin className="h-4 w-4" /> }
  ];
  
  // Mock payment methods
  const mockPaymentMethods = [
    { id: 'pm-1', type: 'Credit Card', last4: '4567', brand: 'Visa', expires: '12/27', default: true },
    { id: 'pm-2', type: 'Credit Card', last4: '8901', brand: 'Mastercard', expires: '09/26', default: false },
    { id: 'pm-3', type: 'Digital Wallet', name: 'PayPal', email: 'user@example.com', default: false }
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleDriverApplicationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDriverApplicationData(prev => ({ ...prev, [name]: value }));
  };

  const handleDriverApplicationSubmit = async () => {
    try {
      const applicationData = {
        licenseNumber: driverApplicationData.licenseNumber,
        vehicleType: {
          category: driverApplicationData.vehicleType,
          make: driverApplicationData.vehicleType, // Using category as make for now - can be improved later
          model: driverApplicationData.vehicleModel,
          year: parseInt(driverApplicationData.vehicleYear),
          plateNumber: driverApplicationData.licensePlate,
          color: driverApplicationData.vehicleColor,
        },
        location: {
          coordinates: [90.4125, 23.7928] as [number, number], // Default to Gulshan, Dhaka
          address: "Dhaka, Bangladesh",
          lastUpdated: new Date(),
        },
      };

      await applyDriver(applicationData).unwrap();

      toast.success("Application Submitted!", {
        description: "Your driver application has been submitted successfully. We'll review it and get back to you soon.",
      });

      // Reset form
      setDriverApplicationData({
        vehicleType: 'CAR',
        vehicleModel: '',
        vehicleYear: '',
        vehicleColor: '',
        licensePlate: '',
        licenseNumber: '',
        driverLicense: '',
        vehicleRegistration: '',
        insurance: '',
        experience: '',
        references: '',
      });
    } catch (error: any) {
      toast.error("Application Failed", {
        description: error?.data?.message || "There was an error submitting your application. Please try again.",
      });
    }
  };
  
  const handleSaveProfile = async () => {
    try {
      const profileData = {
        ...formData,
        _id: userInfo?.data?._id || '',
      };
      await updateProfile(profileData).unwrap();
      toast.success("Profile Updated", {
        description: "Your profile has been updated successfully.",
      });
      setIsEditModalOpen(false);
    } catch {
      toast.error("Update Failed", {
        description: "There was a problem updating your profile.",
      });
    }
  };
  
  const handleCancelEdit = () => {
    // Reset form data
    setFormData({
      name: userInfo?.data?.name || '',
      email: userInfo?.data?.email || '',
      phone: userInfo?.data?.phone || '',
      address: userInfo?.data?.address || '',
      emergencyContact: userInfo?.data?.emergencyContact || '',
    });
    setIsEditModalOpen(false);
  };
  
  
  return (
    <div className="container mx-auto py-6 rounded-2xl bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-500">Manage your account details and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile sidebar */}
        <div className="md:col-span-1">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                {isUserInfoLoading ? (
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
                    <h2 className="text-xl font-bold">{userInfo?.data?.name || 'User Name'}</h2>
                    <p className="text-gray-500">{userInfo?.data?.email || 'user@example.com'}</p>
                    
                    <div className="mt-2 mb-4 space-y-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        Rider
                      </span>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${userInfo?.data?.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-xs text-gray-600">
                          {userInfo?.data?.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="text-center mb-6 w-full">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Member Since</div>
                    <div className="font-medium">
                      {userInfo?.data?.createdAt 
                        ? new Date(userInfo.data.createdAt).toLocaleDateString() 
                        : 'August 2023'}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">Total Rides</div>
                    <div className="font-medium">{totalRides}</div>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">Rating</div>
                    <div className="font-medium flex items-center justify-center">
                      {averageRating.toFixed(1)}
                      <Star className="h-4 w-4 text-yellow-500 ml-1 fill-current" />
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
              <TabsTrigger value="account" className="text-blue-600 bg-blue-50 hover:bg-blue-100 data-[state=active]:bg-blue-200 data-[state=active]:text-blue-700">Account</TabsTrigger>
              <TabsTrigger value="history" className="text-green-600 bg-green-50 hover:bg-green-100 data-[state=active]:bg-green-200 data-[state=active]:text-green-700">Ride History</TabsTrigger>
              <TabsTrigger value="rides" className="text-purple-600 bg-purple-50 hover:bg-purple-100 data-[state=active]:bg-purple-200 data-[state=active]:text-purple-700">Apply Driver</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Manage your personal details</CardDescription>
                  </div>
                  {!isUserInfoLoading && (
                    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white/60 backdrop-blur-lg border border-gray-200 dark:bg-gray-900/60 dark:border-gray-700 text-white">
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
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1"
                                disabled={isUpdating}
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email Address</Label>
                              <Input
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
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
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="mt-1"
                                disabled={isUpdating}
                              />
                            </div>
                            <div>
                              <Label htmlFor="address">Address</Label>
                              <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="mt-1"
                                disabled={isUpdating}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="emergencyContact">Emergency Contact</Label>
                            <Input
                              id="emergencyContact"
                              name="emergencyContact"
                              value={formData.emergencyContact}
                              onChange={handleInputChange}
                              className="mt-1"
                              placeholder="Name: Contact Number"
                              disabled={isUpdating}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="isOnline"
                              name="isOnline"
                              checked={formData.isOnline}
                              onChange={(e) => setFormData(prev => ({ ...prev, isOnline: e.target.checked }))}
                              disabled={isUpdating}
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <Label htmlFor="isOnline">Set Online Status</Label>
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
        
                  <Dialog open={isChangePasswordModalOpen} onOpenChange={setIsChangePasswordModalOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>Enter your current password and set a new one</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            className="mt-1"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsChangePasswordModalOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button>
                            Change Password
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                          <div className="p-2 mt-1 bg-gray-50 rounded">{formData.name}</div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <div className="p-2 mt-1 bg-gray-50 rounded">{formData.email}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="p-2 mt-1 bg-gray-50 rounded">{formData.phone || 'Not provided'}</div>
                        </div>
                        <div>
                          <Label htmlFor="address">Address</Label>
                          <div className="p-2 mt-1 bg-gray-50 rounded">{formData.address || 'Not provided'}</div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="emergencyContact">Emergency Contact</Label>
                        <div className="p-2 mt-1 bg-gray-50 rounded">
                          {formData.emergencyContact || 'Not provided'}
                        </div>
                        {!formData.emergencyContact && (
                          <p className="text-xs text-amber-600 mt-1">
                            Adding an emergency contact is recommended for your safety
                          </p>
                        )}
                      </div>
                    
                      <Separator className="my-6" />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Account Security</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Password</h4>
                              <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setIsChangePasswordModalOpen(true)}>
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
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Ride History</CardTitle>
                  <CardDescription>View your past rides and ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  {completedRides.length > 0 ? (
                    <div className="space-y-4">
                      {completedRides.slice(0, 3).map((ride: any) => (
                        <div key={ride._id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">{new Date(ride.createdAt).toLocaleDateString()}</div>
                            <div className="text-sm text-gray-500">{ride.distance?.estimated?.toFixed(1)} km • ৳{ride.fare?.totalFare?.toFixed(2)}</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/rider/details-history/${ride._id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      ))}
                      <div className="text-center pt-4">
                        <Button variant="outline" onClick={() => navigate('/rider/history')}>
                          View All Rides
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">No rides completed yet.</p>
                      <Button onClick={() => navigate('/rider/history')}>
                        View Ride History
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rides">
              <Card className="border-0 shadow-sm bg-purple-50">
                <CardHeader>
                  <CardTitle>Apply to Become a Driver</CardTitle>
                  <CardDescription>Fill out the form below to apply for a driver position</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => { e.preventDefault(); handleDriverApplicationSubmit(); }} className="space-y-6">
                    {/* Vehicle Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Vehicle Information</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="driver-vehicleType">Vehicle Type *</Label>
                          <select
                            id="driver-vehicleType"
                            name="vehicleType"
                            value={driverApplicationData.vehicleType}
                            onChange={handleDriverApplicationInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                          >
                            <option value="CAR">Car</option>
                            <option value="BIKE">Bike</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="driver-vehicleModel">Vehicle Model *</Label>
                          <Input
                            id="driver-vehicleModel"
                            name="vehicleModel"
                            value={driverApplicationData.vehicleModel}
                            onChange={handleDriverApplicationInputChange}
                            placeholder="e.g., Camry"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="driver-vehicleYear">Vehicle Year *</Label>
                          <Input
                            id="driver-vehicleYear"
                            name="vehicleYear"
                            value={driverApplicationData.vehicleYear}
                            onChange={handleDriverApplicationInputChange}
                            placeholder="e.g., 2020"
                            type="number"
                            min="1990"
                            max={new Date().getFullYear() + 1}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="driver-vehicleColor">Vehicle Color *</Label>
                          <Input
                            id="driver-vehicleColor"
                            name="vehicleColor"
                            value={driverApplicationData.vehicleColor}
                            onChange={handleDriverApplicationInputChange}
                            placeholder="e.g., White"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="driver-licenseNumber">License Number *</Label>
                          <Input
                            id="driver-licenseNumber"
                            name="licenseNumber"
                            value={driverApplicationData.licenseNumber}
                            onChange={handleDriverApplicationInputChange}
                            placeholder="POI655555"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="driver-licensePlate">Number Plate *</Label>
                          <Input
                            id="driver-licensePlate"
                            name="licensePlate"
                            value={driverApplicationData.licensePlate}
                            onChange={handleDriverApplicationInputChange}
                            placeholder="e.g., ABC-1234"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Documents Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Required Documents</h3>
                      <p className="text-sm text-gray-600">Please provide links or upload your documents</p>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="driver-driverLicense">Driver's License *</Label>
                          <Input
                            id="driver-driverLicense"
                            name="driverLicense"
                            value={driverApplicationData.driverLicense}
                            onChange={handleDriverApplicationInputChange}
                            placeholder="Upload or enter document URL"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="driver-vehicleRegistration">Vehicle Registration *</Label>
                          <Input
                            id="driver-vehicleRegistration"
                            name="vehicleRegistration"
                            value={driverApplicationData.vehicleRegistration}
                            onChange={handleDriverApplicationInputChange}
                            placeholder="Upload or enter document URL"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="driver-insurance">Insurance Document *</Label>
                          <Input
                            id="driver-insurance"
                            name="insurance"
                            value={driverApplicationData.insurance}
                            onChange={handleDriverApplicationInputChange}
                            placeholder="Upload or enter document URL"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>

                      <div>
                        <Label htmlFor="driver-experience">Driving Experience (Optional)</Label>
                        <textarea
                          id="driver-experience"
                          name="experience"
                          value={driverApplicationData.experience}
                          onChange={handleDriverApplicationInputChange}
                          placeholder="Describe your driving experience, years of service, etc."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <Label htmlFor="driver-references">References (Optional)</Label>
                        <textarea
                          id="driver-references"
                          name="references"
                          value={driverApplicationData.references}
                          onChange={handleDriverApplicationInputChange}
                          placeholder="Contact information for professional references"
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" className="bg-blue-500 hover:bg-blue-600 cursor-pointer" disabled={isApplying}>
                        {isApplying ? (
                          <>
                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                            Submitting...
                          </>
                        ) : (
                          "Submit Application"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <div className="space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Saved Places</CardTitle>
                    <CardDescription>Frequently visited locations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockSavedPlaces.map((place) => (
                        <div key={place.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-primary/10">
                              {place.icon}
                            </div>
                            <div>
                              <div className="font-medium">{place.name}</div>
                              <div className="text-sm text-gray-500">{place.address}</div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <Button variant="outline" className="w-full">
                        Add New Place
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment options</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockPaymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-primary/10">
                              <CreditCard className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              {method.type === 'Credit Card' ? (
                                <>
                                  <div className="font-medium">{method.brand} •••• {method.last4}</div>
                                  <div className="text-sm text-gray-500">Expires {method.expires}</div>
                                </>
                              ) : (
                                <>
                                  <div className="font-medium">{method.name}</div>
                                  <div className="text-sm text-gray-500">{method.email}</div>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center">
                            {method.default && (
                              <span className="mr-3 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                Default
                              </span>
                            )}
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <Button variant="outline" className="w-full">
                        Add Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how we contact you</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Bell className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Push Notifications</div>
                            <div className="text-sm text-gray-500">Receive alerts on your device</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Bell className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Email Notifications</div>
                            <div className="text-sm text-gray-500">Receive updates via email</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Bell className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">SMS Notifications</div>
                            <div className="text-sm text-gray-500">Receive updates via text message</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Bell className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Marketing Communications</div>
                            <div className="text-sm text-gray-500">Receive promotions and offers</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}