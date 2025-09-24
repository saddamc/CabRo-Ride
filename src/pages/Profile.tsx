
import SingleImageUploader from '@/components/SingleImageUploader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateProfileMutation, useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { AlertCircle, Camera, Car, Mail, MapPin, Phone, Save, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Profile() {
  const { data: userInfo, isLoading, error } = useUserInfoQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    profilePicture: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    if (userInfo?.data) {
      setFormData({
        name: userInfo.data.name || '',
        email: userInfo.data.email || '',
        phone: userInfo.data.phone || '',
        address: userInfo.data.address || '',
        role: userInfo.data.role || '',
        profilePicture: userInfo.data.profilePicture || ''
      });
      
      if (userInfo.data.profilePicture) {
        setUploadedImage(userInfo.data.profilePicture);
      }
    }
  }, [userInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (file: File | null) => {
    if (file) {
      // For demonstration purposes, we're creating a temporary URL
      // In a real app, you would upload the file to your server
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setFormData(prev => ({
        ...prev,
        profilePicture: imageUrl
      }));
    } else {
      setUploadedImage(null);
      setFormData(prev => ({
        ...prev,
        profilePicture: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        profilePicture: uploadedImage || formData.profilePicture
      };
      
      const result = await updateProfile(dataToSubmit).unwrap();
      if (result.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error((error as { data?: { message?: string } })?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (userInfo?.data) {
      setFormData({
        name: userInfo.data.name || '',
        email: userInfo.data.email || '',
        phone: userInfo.data.phone || '',
        address: userInfo.data.address || '',
        role: userInfo.data.role || '',
        profilePicture: userInfo.data.profilePicture || ''
      });
      
      if (userInfo.data.profilePicture) {
        setUploadedImage(userInfo.data.profilePicture);
      } else {
        setUploadedImage(null);
      }
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-6">
        <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load profile information. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="md:col-span-1 border-0 shadow-md">
            <CardHeader className="text-center pb-0">
              <div className="flex flex-col items-center">
                <div className="relative mb-6 group">
                  {isEditing ? (
                    <SingleImageUploader 
                      onChange={handleImageUpload}
                    />
                  ) : (
                    <div className="relative">
                      <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-lg">
                        <AvatarImage 
                          src={userInfo?.data?.profilePicture || ''} 
                          alt={userInfo?.data?.name || 'User'} 
                        />
                        <AvatarFallback className="bg-primary text-4xl">
                          {userInfo?.data?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="absolute bottom-0 right-0 rounded-full"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-center pt-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {userInfo?.data?.name || 'User'}
              </h2>
              
              <Badge variant="outline" className="capitalize mb-4">
                {userInfo?.data?.role || 'User'}
              </Badge>
              
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-md">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium">
                    {userInfo?.data?.rating || '4.9'}
                  </span>
                </div>
                
                <Badge variant={userInfo?.data?.isVerified ? "success" : "secondary"}>
                  {userInfo?.data?.isVerified ? 'Verified' : 'Pending'}
                </Badge>
              </div>

              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2 justify-center">
                  <Mail className="w-4 h-4" />
                  <span>{userInfo?.data?.email}</span>
                </div>
                
                {userInfo?.data?.phone && (
                  <div className="flex items-center gap-2 justify-center">
                    <Phone className="w-4 h-4" />
                    <span>{userInfo.data.phone}</span>
                  </div>
                )}
                
                {userInfo?.data?.address && (
                  <div className="flex items-center gap-2 justify-center">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-2">{userInfo.data.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card className="md:col-span-2 border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h3>
              {!isEditing ? (
                <Button 
                  onClick={() => setIsEditing(true)}
                  variant="default"
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isUpdating}
                    variant="default"
                  >
                    {isUpdating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 rounded-full border-current border-t-transparent animate-spin"></div>
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-1" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Enter your full name"
                        className="pl-10"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Enter your email"
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="+8801XXXXXXXXX"
                        className="pl-10"
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role
                    </label>
                    <div className="relative">
                      <Select
                        value={formData.role}
                        onValueChange={(value) => handleSelectChange(value, 'role')}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="pl-10 capitalize">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rider" className="capitalize">Rider</SelectItem>
                          <SelectItem value="driver" className="capitalize">Driver</SelectItem>
                          <SelectItem value="admin" className="capitalize">Admin</SelectItem>
                          <SelectItem value="super_admin" className="capitalize">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <Textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      placeholder="Enter your address"
                      className="pl-10 resize-none"
                    />
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
