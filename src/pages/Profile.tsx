import { useUpdateProfileMutation, useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { Camera, Car, Mail, MapPin, Phone, Save, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Profile() {
  const { data: userInfo, isLoading } = useUserInfoQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userInfo?.data) {
      setFormData({
        name: userInfo.data.name || '',
        email: userInfo.data.email || '',
        phone: userInfo.data.phone || '',
        address: userInfo.data.address || '',
        role: userInfo.data.role || ''
      });
    }
  }, [userInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await updateProfile(formData).unwrap();
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
        role: userInfo.data.role || ''
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">My Profile</h1>
            <p className="text-slate-600 dark:text-slate-300">Manage your account information and preferences</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-xl dark:bg-slate-900/90 rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                    {userInfo?.data?.profilePicture ? (
                      <img
                        src={userInfo.data.profilePicture}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-1/2 translate-x-16 w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center shadow-lg transition-colors">
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  {userInfo?.data?.name || 'User'}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4 capitalize">
                  {userInfo?.data?.role || 'User'}
                </p>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {userInfo?.data?.rating || '4.9'}
                    </span>
                  </div>
                  <span className="text-slate-400">•</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    userInfo?.data?.isVerified
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {userInfo?.data?.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{userInfo?.data?.email}</span>
                  </div>
                  {userInfo?.data?.phone && (
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{userInfo.data.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/90 backdrop-blur-xl dark:bg-slate-900/90 rounded-3xl shadow-2xl border border-white/20 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Personal Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <X className="w-4 h-4 inline mr-1" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isUpdating}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdating ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                            Saving...
                          </div>
                        ) : (
                          <>
                            <Save className="w-4 h-4 inline mr-1" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-800 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-800 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-800 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
                          placeholder="+8801XXXXXXXXX"
                        />
                      </div>
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Role
                      </label>
                      <div className="relative">
                        <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-800 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors capitalize"
                        >
                          <option value="rider">Rider</option>
                          <option value="driver">Driver</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-800 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors resize-none"
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
