import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useChangePasswordMutation } from "@/redux/features/auth/auth.api";
import { useGetAllUsersQuery, useUpdateUserMutation } from "@/redux/features/auth/User/user.api";
import { Edit, Save, User, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminProfile() {
  const { data: users, isLoading: isUsersLoading } = useGetAllUsersQuery({ role: 'admin' });
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);

  // Assume only one admin user (the first in the list)
  const adminUser = users && users.length > 0 ? users[0] : null;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

    // ChangePassword form state
    const [passwordData, setPasswordData] = useState({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

  useEffect(() => {
    if (adminUser) {
      setFormData({
        name: adminUser.name || '',
        email: adminUser.email || '',
        phone: adminUser.phone || '',
      });
    }
  }, [adminUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      if (!adminUser) return;
      await updateUser({ id: adminUser.id, data: formData }).unwrap();
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
    if (adminUser) {
      setFormData({
        name: adminUser.name || '',
        email: adminUser.email || '',
        phone: adminUser.phone || '',
      });
    }
    setEditMode(false);
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setPasswordData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleChangePassword = async () => {
      // Validate passwords match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("Passwords don't match", {
          description: "Please make sure your new password and confirmation match.",
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
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setIsChangePasswordModalOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error("Password Change Failed", {
          description: error?.data?.message || "There was an error changing your password.",
        });
      }
    };

  return (
    <div className="container mx-auto py-6 bg-white text-black min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Profile</h1>
        <p className="text-gray-500">Manage your account details and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile sidebar */}
        <div className="md:col-span-1">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                {isUsersLoading ? (
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
                    <h2 className="text-xl font-bold">{adminUser?.name || 'Admin Name'}</h2>
                    <p className="text-gray-500">{adminUser?.email || 'admin@example.com'}</p>

                    <div className="mt-2 mb-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        Admin
                      </span>
                    </div>
                  </>
                )}

                <div className="text-center mb-6 w-full">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Member Since</div>
                    <div className="font-medium">
                      {adminUser?.createdAt
                        ? new Date(adminUser.createdAt).toLocaleDateString()
                        : 'August 2023'}
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
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Manage your personal details</CardDescription>
                  </div>
                  {!isUsersLoading && (
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
                  {isUsersLoading ? (
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

                      <Separator className="my-6" />

                      <div>
                        <h3 className="text-lg font-medium mb-4">Account Security</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Password</h4>
                              <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                            </div>
                            {/* changePassword */}
                            <Dialog open={isChangePasswordModalOpen} onOpenChange={setIsChangePasswordModalOpen}>
                    <DialogContent className="bg-white/60 backdrop-blur-lg border border-gray-200 dark:bg-gray-900/60 dark:border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-white">Change Password</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-300">Enter your current password and set a new one</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="oldPassword" className="text-gray-900 dark:text-white">Current Password</Label>
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
                          <Label htmlFor="newPassword" className="text-gray-900 dark:text-white">New Password</Label>
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
                          <Label htmlFor="confirmPassword" className="text-gray-900 dark:text-white">Confirm New Password</Label>
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
                            onClick={() => setIsChangePasswordModalOpen(false)}
                            disabled={isChangingPassword}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleChangePassword}
                            disabled={isChangingPassword || !passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                            className="bg-white border-black  hover:bg-black hover:text-white"
                          >
                            {isChangingPassword ? (
                              <>
                                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                                Changing...
                              </>
                            ) : (
                              'Change Password'
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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

            <TabsContent value="security">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your security preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Login Alerts</h4>
                        <p className="text-sm text-gray-500">Get notified of new logins</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Session Timeout</h4>
                        <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
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