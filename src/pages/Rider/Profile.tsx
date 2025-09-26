import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateProfileMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { Bell, Car, Clock, CreditCard, Edit, Home, MapPin, Save, Star, User, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function RiderProfile() {
  const { data: userInfo, isLoading: isUserInfoLoading } = useUserInfoQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
  });
  
  useEffect(() => {
    if (userInfo?.data) {
      setFormData({
        name: userInfo.data.name || '',
        email: userInfo.data.email || '',
        phone: userInfo.data.phone || '',
        address: userInfo.data.address || '',
        emergencyContact: userInfo.data.emergencyContact || '',
      });
    }
  }, [userInfo]);
  
  // Mock data for ride history
  const mockRideHistory = [
    {
      id: 'ride-001',
      date: '2023-09-24',
      time: '14:35',
      from: 'Downtown Office',
      to: 'Home Address',
      driver: 'John Smith',
      vehicleInfo: 'Toyota Camry (ABC-1234)',
      fare: 24.50,
      status: 'completed',
      rating: 5
    },
    {
      id: 'ride-002',
      date: '2023-09-22',
      time: '09:15',
      from: 'Home Address',
      to: 'Downtown Office',
      driver: 'Sarah Johnson',
      vehicleInfo: 'Honda Civic (XYZ-5678)',
      fare: 22.75,
      status: 'completed',
      rating: 4
    },
    {
      id: 'ride-003',
      date: '2023-09-20',
      time: '18:45',
      from: 'Shopping Mall',
      to: 'Home Address',
      driver: 'Michael Chen',
      vehicleInfo: 'Nissan Altima (DEF-9012)',
      fare: 32.25,
      status: 'completed',
      rating: 5
    },
  ];
  
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
  
  const handleSaveProfile = async () => {
    try {
      const profileData = {
        ...formData,
        _id: userInfo?.data?._id || '',
      };
      await updateProfile(profileData).unwrap();
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
    setFormData({
      name: userInfo?.data?.name || '',
      email: userInfo?.data?.email || '',
      phone: userInfo?.data?.phone || '',
      address: userInfo?.data?.address || '',
      emergencyContact: userInfo?.data?.emergencyContact || '',
    });
    setEditMode(false);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">Completed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs">Cancelled</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">{status}</span>;
    }
  };
  
  return (
    <div className="container mx-auto py-6 bg-white">
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
                    
                    <div className="mt-2 mb-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        Rider
                      </span>
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
                    <div className="font-medium">42</div>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">Rating</div>
                    <div className="font-medium flex items-center justify-center">
                      4.9
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
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="rides">Ride History</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Manage your personal details</CardDescription>
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
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleCancelEdit}
                          className="flex items-center"
                          disabled={isUpdating}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleSaveProfile}
                          className="flex items-center"
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
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
                              value={formData.name} 
                              onChange={handleInputChange} 
                              className="mt-1"
                              disabled={isUpdating}
                            />
                          ) : (
                            <div className="p-2 mt-1 bg-gray-50 rounded">{formData.name}</div>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          {editMode ? (
                            <Input 
                              id="email" 
                              name="email"
                              value={formData.email} 
                              onChange={handleInputChange} 
                              className="mt-1"
                              disabled={isUpdating}
                            />
                          ) : (
                            <div className="p-2 mt-1 bg-gray-50 rounded">{formData.email}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          {editMode ? (
                            <Input 
                              id="phone" 
                              name="phone"
                              value={formData.phone} 
                              onChange={handleInputChange} 
                              className="mt-1"
                              disabled={isUpdating}
                            />
                          ) : (
                            <div className="p-2 mt-1 bg-gray-50 rounded">{formData.phone || 'Not provided'}</div>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="address">Address</Label>
                          {editMode ? (
                            <Input 
                              id="address" 
                              name="address"
                              value={formData.address} 
                              onChange={handleInputChange} 
                              className="mt-1"
                              disabled={isUpdating}
                            />
                          ) : (
                            <div className="p-2 mt-1 bg-gray-50 rounded">{formData.address || 'Not provided'}</div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="emergencyContact">Emergency Contact</Label>
                        {editMode ? (
                          <Input 
                            id="emergencyContact" 
                            name="emergencyContact"
                            value={formData.emergencyContact} 
                            onChange={handleInputChange} 
                            className="mt-1"
                            placeholder="Name: Contact Number"
                            disabled={isUpdating}
                          />
                        ) : (
                          <div className="p-2 mt-1 bg-gray-50 rounded">
                            {formData.emergencyContact || 'Not provided'}
                          </div>
                        )}
                        {!editMode && !formData.emergencyContact && (
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
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="rides">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Ride History</CardTitle>
                  <CardDescription>Your recent rides and trips</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockRideHistory.map((ride) => (
                      <div key={ride.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-medium">{ride.date} • {ride.time}</div>
                            <div className="flex items-center gap-1 text-sm">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} 
                                  className={`h-3 w-3 ${i < ride.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                              <span className="text-gray-500 ml-1">({ride.rating}/5)</span>
                            </div>
                          </div>
                          <div>
                            {getStatusBadge(ride.status)}
                          </div>
                        </div>
                        
                        <div className="flex gap-4 mb-4">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <div className="w-0.5 h-12 bg-gray-200"></div>
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          </div>
                          <div className="flex-1 space-y-3">
                            <div>
                              <div className="text-sm text-gray-500">From</div>
                              <div>{ride.from}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">To</div>
                              <div>{ride.to}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between pt-3 border-t text-sm">
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-gray-500" />
                            <span>{ride.vehicleInfo}</span>
                          </div>
                          <div className="font-medium">
                            ${ride.fare.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-center">
                      <Button variant="outline">View All Rides</Button>
                    </div>
                  </div>
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