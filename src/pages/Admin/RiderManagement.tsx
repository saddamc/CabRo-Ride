import ConfirmationModal from "@/components/modal/ConfirmationModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useActivateUserMutation, useBlockUserMutation, useGetAllUsersQuery, useSuspendUserMutation } from "@/redux/features/auth/User/user.api";
import { Filter, Loader2, MoreHorizontal, Search, User, UserCheck, Users, UserX } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export interface IRider {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  totalRides: number;
  joinedDate: string;
  lastActive: string;
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

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'BLOCKED', label: 'Blocked' },
  ];
  
  // API Mutations and Queries
  const { data: usersData, isLoading: isLoadingUsers, error, refetch } = useGetAllUsersQuery({ role: 'rider' });
  console.log("Users query:", { usersData, isLoadingUsers, error }); // Debug log for query
  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const [activateUser, { isLoading: isActivating }] = useActivateUserMutation();
  const [suspendUser, { isLoading: isSuspending }] = useSuspendUserMutation();
  //  const { data: ridesData, isLoading, error } = useGetAllRideQuery({
  //    page: currentPage,
  //    limit: 12
  //  }); 
  console.log("Users Data:", usersData);
  console.log("filter", usersData?.data?.filter(user => user.role !== 'driver'));
  
  // Convert API user data to UI format
  const riders: IRider[] = useMemo(() => {
    return usersData?.data?.filter(user => user.role !== 'driver').map(user => {
      console.log('User object:', user); // Debug log to check structure
      return {
        id: user._id || '',
        name: user.name || 'Unknown',
        phone: user.phone || 'No phone',
        email: user.email || 'No email',
        status: user.isActive === 'ACTIVE' ? 'active' : user.isActive === 'INACTIVE' ? 'inactive' : user.isActive === 'BLOCKED' ? 'suspended' : 'active',
        totalRides: user.totalRides ?? 0, // Use API value if available
        joinedDate: user.joinedDate || user.createdAt || '2025-01-01', // Prefer API value
        lastActive: user.lastActive || user.updatedAt || '2025-09-25' // Prefer API value
      };
    }) || [];
  }, [usersData]);

  // Filter riders
  const filteredRiders = riders.filter(rider => {
    // Filter by status
    if (statusFilter !== 'all' && rider.status !== statusFilter) return false;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        rider.name.toLowerCase().includes(term) ||
        rider.phone.includes(term) ||
        rider.email.toLowerCase().includes(term)
      );
    }
    
    return true;
  });
  
  const openConfirmModal = (rider: { id: string; name: string; status: string }) => {
    const currentStatus = rider.status === 'active' ? 'ACTIVE' : rider.status === 'inactive' ? 'INACTIVE' : 'BLOCKED';
    setConfirmModal({
      isOpen: true,
      riderId: rider.id,
      riderName: rider.name,
      currentStatus,
      selectedStatus: currentStatus as 'ACTIVE' | 'INACTIVE' | 'BLOCKED'
    });
  };

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

  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  // Calculate stats
  const stats = useMemo(() => {
    const total = riders.length;
    const active = riders.filter(r => r.status === 'active').length;
    const inactive = riders.filter(r => r.status === 'inactive').length;
    const suspended = riders.filter(r => r.status === 'suspended').length;
    return { total, active, inactive, suspended };
  }, [riders]);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="bg-white text-black py-8 px-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">👥 Rider Management</h1>
          <p className="text-gray-600 text-lg">Monitor and manage all rider accounts on your platform</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">Total Riders</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
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
                  <p className="text-3xl font-bold text-green-600">{stats.active}</p>
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
                  <p className="text-3xl font-bold text-yellow-600">{stats.inactive}</p>
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
                  <p className="text-3xl font-bold text-red-600">{stats.suspended}</p>
                </div>
                <div className="bg-red-200 p-3 rounded-full">
                  <UserX className="h-8 w-8 text-red-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
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
                <SelectContent>
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
              Showing {filteredRiders.length} of {usersData?.meta?.total || riders.length} riders
            </CardDescription>
            {isLoadingUsers && (
              <div className="flex items-center mt-2">
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-gray-600" />
                <span className="text-gray-600">Loading rider data...</span>
              </div>
            )}
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
                  {filteredRiders.map((rider) => (
                    <TableRow key={rider.id} className="border-gray-200 hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{rider.name}</div>
                            <div className="text-sm text-gray-500">{rider.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">{rider.phone}</div>
                      </TableCell>
                      <TableCell>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block capitalize ${getStatusColor(rider.status)}`}>
                          {rider.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-900">{rider.totalRides}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">
                          {new Date(rider.joinedDate).toLocaleDateString()}
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
                              onClick={() => openConfirmModal({ id: rider.id, name: rider.name, status: rider.status })}
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

            {filteredRiders.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No riders found</h3>
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
      </div>
      
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title="Change Rider Status"
        description="This will update the rider's account status on the platform."
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
    </div>
  );
}