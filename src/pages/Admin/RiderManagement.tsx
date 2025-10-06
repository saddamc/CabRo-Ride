/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import DriverStatusModal from "@/components/modal/DriverStatusModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActivateUserMutation, useBlockUserMutation, useGetAllUsersQuery, useSuspendUserMutation } from "@/redux/features/auth/User/user.api";
import { useApprovedDriverMutation, useGetAllDriversQuery, useSuspendDriverMutation } from "@/redux/features/driver/driver.api";
import { Filter, Loader2, MoreHorizontal, Search, User, UserCheck, Users, UserX } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export interface IUser {
    id: string;
    name: string;
    phone: string;
    email: string;
    status: 'active' | 'inactive' | 'suspended' | 'pending' | 'approved' | 'rejected';
    totalRides: number;
    joinedDate: string;
    lastActive: string;
    role: string;
    profilePicture?: string;
  }

export default function RiderManagement() {
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState('all');
  
  // Confirmation Modal States
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    riderId: string;
    riderName: string;
    currentStatus: string;
    selectedStatus: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  }>({
    isOpen: false,
    riderId: '',
    riderName: '',
    currentStatus: 'ACTIVE',
    selectedStatus: 'ACTIVE'
  });

  // Driver status modal state
  const [driverStatusModal, setDriverStatusModal] = useState<{
    isOpen: boolean;
    driverId: string;
    driverName: string;
    actionType: 'approve' | 'reject' | 'suspend' | 'reactivate';
  }>({
    isOpen: false,
    driverId: '',
    driverName: '',
    actionType: 'approve'
  });

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'BLOCKED', label: 'Blocked' },
  ];

  // Driver status options removed in favor of direct action buttons

  
  // API Mutations and Queries
  const { data: usersData, isLoading: isLoadingUsers, error, refetch } = useGetAllUsersQuery({});
  console.log("Users query:", { usersData, isLoadingUsers, error }); // Debug log for query
  const { data: driversData, isLoading: isLoadingDrivers, error: driversError, refetch: refetchDrivers } = useGetAllDriversQuery({});
  console.log("Drivers query:", { driversData, isLoadingDrivers, driversError }); // Debug log for query
  // const driverData = driversData?.data || [];
  // console.log("Drivers Data:", driverData);
  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const [activateUser, { isLoading: isActivating }] = useActivateUserMutation();
  const [suspendUser, { isLoading: isSuspending }] = useSuspendUserMutation();
  const [approveDriver] = useApprovedDriverMutation();
  const [suspendDriver] = useSuspendDriverMutation();
  //  const { data: ridesData, isLoading, error } = useGetAllRideQuery({
  //    page: currentPage,
  //    limit: 12
  //  }); 
  console.log("Users Data:", usersData);
  console.log("filter", usersData?.data?.filter(user => user.role !== 'driver'));
  
  // Convert API user data to UI format
  const users: IUser[] = useMemo(() => {
    return usersData?.data?.filter(user => user.role === 'rider' || user.role === 'driver').map(user => {
      console.log('User object:', user); // Debug log to check structure
      return {
        id: user._id || '',
        name: user.name || 'Unknown',
        phone: user.phone || 'No phone',
        email: user.email || 'No email',
        status: user.role === 'driver' ? ((user as any).driver?.status || user.status || 'pending') : (user.isActive === 'ACTIVE' ? 'active' : user.isActive === 'INACTIVE' ? 'inactive' : user.isActive === 'BLOCKED' ? 'suspended' : 'active'),
        totalRides: user.totalRides ?? 0, // Use API value if available
        joinedDate: user.joinedDate || user.createdAt || '2025-01-01', // Prefer API value
        lastActive: user.lastActive || user.updatedAt || '2025-09-25', // Prefer API value
        role: user.role || 'rider',
        profilePicture: user.profilePicture,
      };
    }) || [];
  }, [usersData]);

  // Filtering is now done directly in the component render
  
  const openConfirmModal = (user: { id: string; name: string; status: string }) => {
    const currentStatus = user.status === 'active' ? 'ACTIVE' : user.status === 'inactive' ? 'INACTIVE' : 'BLOCKED';
    setConfirmModal({
      isOpen: true,
      riderId: user.id,
      riderName: user.name,
      currentStatus,
      selectedStatus: currentStatus as 'ACTIVE' | 'INACTIVE' | 'BLOCKED'
    });
  };

  // We now use direct buttons instead of a modal for driver actions


  const handleConfirmAction = async () => {
    try {
      const { selectedStatus, riderId } = confirmModal;

      if (selectedStatus === 'BLOCKED') {
        await blockUser(riderId).unwrap();
        toast.success("Rider blocked successfully");
      } else if (selectedStatus === 'ACTIVE') {
        await activateUser(riderId).unwrap();
        toast.success("Rider activated successfully");
      } else if (selectedStatus === 'INACTIVE') {
        await suspendUser(riderId).unwrap();
        toast.success("Rider suspended successfully");
      }

      // Close modal and refresh data
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
      // Refresh the data
      refetch();
    } catch (error) {
      console.error("Error performing rider action:", error);
      toast.error("Failed to update rider status. Please try again.");
    }
  };

  // Driver status changes are now handled with direct action buttons


  // Driver status actions handler
  const openDriverStatusModal = (driver: { id: string; name: string; }, actionType: 'approve' | 'reject' | 'suspend' | 'reactivate') => {
    setDriverStatusModal({
      isOpen: true,
      driverId: driver.id,
      driverName: driver.name || 'Driver',
      actionType
    });
  };

  const handleDriverStatusAction = async () => {
    try {
      const { driverId, actionType } = driverStatusModal;
      
      switch (actionType) {
        case 'approve':
          await approveDriver({ id: driverId }).unwrap();
          toast.success("Driver approved successfully");
          break;
        case 'reject':
          // The API requires transitions for rejection
          await approveDriver({ id: driverId }).unwrap(); 
          toast.success("Driver rejected successfully");
          break;
        case 'suspend':
          await suspendDriver({ id: driverId }).unwrap();
          toast.success("Driver suspended successfully");
          break;
        case 'reactivate':
          await suspendDriver({ id: driverId }).unwrap(); // Use suspendDriver to toggle back to approved
          toast.success("Driver reactivated successfully");
          break;
      }
      
      // Close modal and refresh data
      setDriverStatusModal(prev => ({ ...prev, isOpen: false }));
      refetchDrivers();
    } catch (error) {
      console.error("Error performing driver action:", error);
      toast.error("Failed to update driver status. Please try again.");
    }
  };

  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColorDriver = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
    case "suspended":
      return "bg-red-100 text-red-800";
    case "approved":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

  
  // Stats are now directly calculated in the UI

  return (
    <div className="min-h-screen bg-white/30 text-black">
      {/* Header */}
      <div className="bg-white text-black py-8 px-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">👥 User Management</h1>
          <p className="text-gray-600 text-lg">Monitor and manage all rider and driver accounts on your platform</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="riders" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="riders" className="bg-cyan-300">Riders</TabsTrigger>
            <TabsTrigger value="drivers" className="bg-orange-300">Drivers</TabsTrigger>
          </TabsList>

          <TabsContent value="riders">
            <Card className="border-0 shadow-sm bg-cyan-50">
              <CardHeader>
                <CardTitle className="text-gray-900">Rider Management</CardTitle>
                <CardDescription className="text-gray-600">
                  View and manage rider accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Stats Cards for Riders */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <Card className="bg-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700 font-medium">Total Riders</p>
                          <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.role === 'rider').length}</p>
                        </div>
                        <div className="bg-gray-200 p-3 rounded-full">
                          <Users className="h-8 w-8 text-gray-700" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700 font-medium">Active Riders</p>
                          <p className="text-3xl font-bold text-green-600">{users.filter(u => u.role === 'rider' && u.status === 'active').length}</p>
                        </div>
                        <div className="bg-green-200 p-3 rounded-full">
                          <UserCheck className="h-8 w-8 text-green-700" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700 font-medium">Inactive Riders</p>
                          <p className="text-3xl font-bold text-yellow-600">{users.filter(u => u.role === 'rider' && u.status === 'inactive').length}</p>
                        </div>
                        <div className="bg-yellow-200 p-3 rounded-full">
                          <User className="h-8 w-8 text-yellow-700" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700 font-medium">Suspended</p>
                          <p className="text-3xl font-bold text-red-600">{users.filter(u => u.role === 'rider' && u.status === 'suspended').length}</p>
                        </div>
                        <div className="bg-red-200 p-3 rounded-full">
                          <UserX className="h-8 w-8 text-red-700" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {isLoadingUsers && (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-gray-600" />
                    <p className="ml-2 text-gray-600">Loading rider data...</p>
                  </div>
                )}

                {/* Filters and Search for Riders */}
                <Card className="mb-6 border-gray-200 bg-white">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          placeholder="Search by name, email, phone..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-white border-gray-300 text-black"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-48 bg-white border-gray-300 text-black">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black">
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Riders Table */}
                <Card className="border-gray-200 bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-gray-900">All Riders</CardTitle>
                    <CardDescription className="text-gray-600">
                      Showing {users.filter(u => u.role === 'rider').filter(u =>
                        statusFilter === 'all' || u.status === statusFilter
                      ).filter(u =>
                        !searchTerm ||
                        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.phone.includes(searchTerm)
                      ).length} of {users.filter(u => u.role === 'rider').length} riders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-200">
                            <TableHead className="text-gray-700">Rider</TableHead>
                            <TableHead className="text-gray-700">Contact</TableHead>
                            <TableHead className="text-gray-700">Status</TableHead>
                            <TableHead className="text-gray-700">Total Rides</TableHead>
                            <TableHead className="text-gray-700">Joined Date</TableHead>
                            <TableHead className="text-gray-700">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.filter(u => u.role === 'rider').filter(u =>
                            statusFilter === 'all' || u.status === statusFilter
                          ).filter(u =>
                            !searchTerm ||
                            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            u.phone.includes(searchTerm)
                          ).map((user) => (
                            <TableRow key={user.id} className="border-gray-200 hover:bg-gray-50">
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {user.profilePicture ? (
                                    <img
                                      src={user.profilePicture}
                                      alt="Profile"
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                      <User className="h-5 w-5 text-gray-600" />
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-medium text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-gray-900">{user.phone}</div>
                              </TableCell>
                              <TableCell>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block capitalize ${getStatusColor(user.status)}`}>
                                  {user.status}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-gray-900">{user.totalRides}</div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-gray-900">
                                  {new Date(user.joinedDate).toLocaleDateString()}
                                </div>
                              </TableCell>
                              <TableCell className="relative">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <span className="sr-only">Open menu</span>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-gray-800 text-white border-gray-600">
                                    <DropdownMenuItem
                                      onClick={() => openConfirmModal({ id: user.id, name: user.name, status: user.status })}
                                      className="text-white hover:bg-gray-700 cursor-pointer"
                                    >
                                      <User className="mr-2 h-4 w-4" />
                                      Change Status
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {users.filter(u => u.role === 'rider').filter(u =>
                      statusFilter === 'all' || u.status === statusFilter
                    ).filter(u =>
                      !searchTerm ||
                      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      u.phone.includes(searchTerm)
                    ).length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          No riders found
                        </h3>
                        <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                        <Button
                          onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('all');
                          }}
                          variant="outline"
                          className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Clear Filters
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drivers">
            <Card className="border-0 shadow-sm bg-orange-50">
              <CardHeader>
                <CardTitle className="text-gray-900">Driver Management</CardTitle>
                <CardDescription className="text-gray-600">
                  View and manage driver accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Driver Sub-tabs */}
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="pending" className="bg-yellow-300">Pending Approval</TabsTrigger>
                    <TabsTrigger value="approved" className="bg-green-300">Approved Drivers</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pending">
                    {/* Stats Cards for Pending Drivers */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                      <Card className="bg-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-700 font-medium">Pending Drivers</p>
                              <p className="text-3xl font-bold text-yellow-600">{(driversData as any)?.filter((u: any) => u.status === 'pending' || u.status === 'rejected').length || 0}</p>
                            </div>
                            <div className="bg-yellow-200 p-3 rounded-full">
                              <User className="h-8 w-8 text-yellow-700" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Pending Drivers Table */}
                    <Card className="border-gray-200 bg-white">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-gray-900">Pending Driver Approvals</CardTitle>
                        <CardDescription className="text-gray-600">
                          Drivers waiting for approval - approve or reject their applications
                        </CardDescription>
                      </CardHeader>
                      {/* Pending Driver */}
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-gray-200">
                                <TableHead className="text-gray-700">Driver</TableHead>
                                <TableHead className="text-gray-700">Contact</TableHead>
                                <TableHead className="text-gray-700">Joined Date</TableHead>
                                <TableHead className="text-gray-700">Status</TableHead>
                                <TableHead className="text-gray-700">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(driversData as any)?.filter((driver: any) => driver.status === 'pending' || driver.status === 'rejected').map((driver: any) => (
                                <TableRow key={driver._id} className="border-gray-200 hover:bg-gray-50">
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      {driver.user?.profilePicture ? (
                                        <img
                                          src={driver.user.profilePicture}
                                          alt="Profile"
                                          className="w-10 h-10 rounded-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                          <User className="h-5 w-5 text-gray-600" />
                                        </div>
                                      )}
                                      <div>
                                        <div className="font-medium text-gray-900">{driver.user?.name || 'Unknown'}</div>
                                        <div className="text-sm text-gray-500">{driver.user?.email || 'No email'}</div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm text-gray-900">
                                      {new Date(driver.createdAt || '2025-01-01').toLocaleDateString()}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm text-gray-900">{driver.user?.phone || 'No phone'}</div>
                                  </TableCell>
                                  <TableCell>
                                    <div className={`px-2 py-1  rounded-full font-medium inline-block capitalize ${getStatusColorDriver(driver.status)}`}>
                                  {driver.status}
                                </div>
                                  </TableCell>
                                  
                                  <TableCell className="relative">
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => openDriverStatusModal({ 
                                          id: driver._id, 
                                          name: driver.user?.name || 'Driver' 
                                        }, 'approve')}
                                      >
                                        <UserCheck className="h-4 w-4 mr-1" />
                                        Approve
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-red-600 text-red-600 hover:bg-red-50"
                                        onClick={() => openDriverStatusModal({ 
                                          id: driver._id, 
                                          name: driver.user?.name || 'Driver' 
                                        }, 'reject')}
                                      >
                                        <UserX className="h-4 w-4 mr-1" />
                                        Reject
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {(driversData as any)?.filter((driver: any) => driver.status === 'pending' || driver.status === 'rejected').length === 0 && (
                          <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                              <Users className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              No pending drivers
                            </h3>
                            <p className="text-gray-600">All driver applications have been reviewed</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="approved">
                    {/* Stats Cards for Approved Drivers */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                      <Card className="bg-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-700 font-medium">Approved Drivers</p>
                              <p className="text-3xl font-bold text-green-600">{(driversData as any)?.filter((u: any) => u.status === 'approved' || u.status === 'suspended').length || 0}</p>
                            </div>
                            <div className="bg-green-200 p-3 rounded-full">
                              <UserCheck className="h-8 w-8 text-green-700" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-700 font-medium">Suspended Drivers</p>
                              <p className="text-3xl font-bold text-red-600">{(driversData as any)?.filter((u: any) => u.status === 'suspended').length || 0}</p>
                            </div>
                            <div className="bg-red-200 p-3 rounded-full">
                              <UserX className="h-8 w-8 text-red-700" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Approved Drivers Table */}
                    <Card className="border-gray-200 bg-white">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-gray-900">Approved Drivers</CardTitle>
                        <CardDescription className="text-gray-600">
                          Manage approved driver accounts - suspend drivers if needed
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-gray-200">
                                <TableHead className="text-gray-700">Driver</TableHead>
                                <TableHead className="text-gray-700">Contact</TableHead>
                                <TableHead className="text-gray-700">Status</TableHead>
                                <TableHead className="text-gray-700">Total Rides</TableHead>
                                <TableHead className="text-gray-700">Joined Date</TableHead>
                                <TableHead className="text-gray-700">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(driversData as any)?.filter((driver: any) => driver.status === 'approved' || driver.status === 'suspended').map((driver: any) => (
                                <TableRow key={driver._id} className="border-gray-200 hover:bg-gray-50">
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      {driver.user?.profilePicture ? (
                                        <img
                                          src={driver.user.profilePicture}
                                          alt="Profile"
                                          className="w-10 h-10 rounded-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                          <User className="h-5 w-5 text-gray-600" />
                                        </div>
                                      )}
                                      <div>
                                        <div className="font-medium text-gray-900">{driver.user?.name || 'Unknown'}</div>
                                        <div className="text-sm text-gray-500">{driver.user?.email || 'No email'}</div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm text-gray-900">{driver.user?.phone || 'No phone'}</div>
                                  </TableCell>
                                  <TableCell>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block capitalize ${getStatusColorDriver(driver.status)}`}>
                                      {driver.status}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-gray-900">{typeof driver.totalRides === 'number' ? driver.totalRides : (driver.stats?.totalRides ?? 0)}</div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm text-gray-900">
                                      {new Date(driver.createdAt || '2025-01-01').toLocaleDateString()}
                                    </div>
                                  </TableCell>
                                  <TableCell className="relative">
                                    {driver.status === "approved" ? (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-red-600 text-red-600 hover:bg-red-50"
                                        onClick={() => openDriverStatusModal({ 
                                          id: driver._id, 
                                          name: driver.user?.name || 'Driver' 
                                        }, 'suspend')}
                                      >
                                        <UserX className="h-4 w-4 mr-1" />
                                        Suspend Driver
                                      </Button>
                                    ) : driver.status === "suspended" ? (
                                      <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => openDriverStatusModal({ 
                                          id: driver._id, 
                                          name: driver.user?.name || 'Driver' 
                                        }, 'reactivate')}
                                      >
                                        <UserCheck className="h-4 w-4 mr-1" />
                                        Reactivate
                                      </Button>
                                    ) : (
                                      <span className="text-gray-400">No action</span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {(driversData as any)?.filter((driver: any) => driver.status === 'approved' || driver.status === 'suspended').length === 0 && (
                          <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                              <Users className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              No approved drivers
                            </h3>
                            <p className="text-gray-600">No drivers have been approved yet</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title="Change User Status"
        description="This will update the user's account status on the platform."
        selectedStatus={confirmModal.selectedStatus}
        statusOptions={statusOptions}
        onStatusChange={(status) => setConfirmModal(prev => ({ ...prev, selectedStatus: status as 'ACTIVE' | 'INACTIVE' | 'BLOCKED' }))}
        isLoading={
          confirmModal.selectedStatus === 'BLOCKED' ? isBlocking :
          confirmModal.selectedStatus === 'ACTIVE' ? isActivating :
          isSuspending
        }
        targetName={confirmModal.riderName}
      />

      {/* Driver Status Modal */}
      <DriverStatusModal
        isOpen={driverStatusModal.isOpen}
        onClose={() => setDriverStatusModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleDriverStatusAction}
        driverName={driverStatusModal.driverName}
        actionType={driverStatusModal.actionType}
        isLoading={false}
      />
    </div>
  );
}