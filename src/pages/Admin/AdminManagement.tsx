import ConfirmationModal from "@/components/modal/ConfirmationModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useActivateUserMutation, useBlockUserMutation, useGetAllUsersQuery, useSuspendUserMutation } from "@/redux/features/auth/User/user.api";
import { Filter, Loader2, MoreHorizontal, Search, User } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export interface IAdmin {
    id: string;
    name: string;
    phone: string;
    email: string;
    status: 'active' | 'inactive' | 'suspended';
    joinedDate: string;
    lastActive: string;
    role: string;
  }

export default function AdminManagement() {
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState('all');
  
  // Confirmation Modal States
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    adminId: string;
    adminName: string;
    currentStatus: string;
    selectedStatus: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  }>({
    isOpen: false,
    adminId: '',
    adminName: '',
    currentStatus: 'ACTIVE',
    selectedStatus: 'ACTIVE'
  });

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'BLOCKED', label: 'Blocked' },
  ];

  // API Mutations and Queries
  const { data: usersData, isLoading: isLoadingUsers, error, refetch } = useGetAllUsersQuery({});
  console.log("Admins query:", { usersData, isLoadingUsers, error });
  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const [activateUser, { isLoading: isActivating }] = useActivateUserMutation();
  const [suspendUser, { isLoading: isSuspending }] = useSuspendUserMutation();
  const { data: currentUser } = useUserInfoQuery(undefined);
  
  // Convert API user data to UI format
  const admins: IAdmin[] = useMemo(() => {
    return usersData?.data?.filter(user => user.role === 'admin' || user.role === 'super_admin').map(user => {
      console.log('Admin user object:', user); // Debug log to check structure
      return {
        id: user._id || '',
        name: user.name || 'Unknown',
        phone: user.phone || 'N/A',
        email: user.email || 'No email',
        status: user.isActive === 'ACTIVE' ? 'active' : user.isActive === 'INACTIVE' ? 'inactive' : user.isActive === 'BLOCKED' ? 'suspended' : 'active',
        joinedDate: user.createdAt || '2025-01-01', // Prefer API value
        lastActive: user.updatedAt || '2025-09-25', // Not available in this API
        role: user.role || 'admin'
      };
    }) || [];
  }, [usersData]);
  
  // Filter admins
  const filteredAdmins = admins.filter(admin => {
    // Filter by status
    if (statusFilter !== 'all' && admin.status !== statusFilter) return false;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        admin.name.toLowerCase().includes(term) ||
        admin.phone.includes(term) ||
        admin.email.toLowerCase().includes(term)
      );
    }

    return true;
  });
  
  const openConfirmModal = (admin: { id: string; name: string; status: string }) => {
    const currentStatus = admin.status === 'active' ? 'ACTIVE' : admin.status === 'inactive' ? 'INACTIVE' : 'BLOCKED';
    setConfirmModal({
      isOpen: true,
      adminId: admin.id,
      adminName: admin.name,
      currentStatus,
      selectedStatus: currentStatus as 'ACTIVE' | 'INACTIVE' | 'BLOCKED'
    });
  };

  const handleConfirmAction = async () => {
    try {
      const { selectedStatus, adminId } = confirmModal;

      if (selectedStatus === 'BLOCKED') {
        await blockUser(adminId).unwrap();
        toast.success("Admin blocked successfully");
      } else if (selectedStatus === 'ACTIVE') {
        await activateUser(adminId).unwrap();
        toast.success("Admin activated successfully");
      } else if (selectedStatus === 'INACTIVE') {
        await suspendUser(adminId).unwrap();
        toast.success("Admin suspended successfully");
      }

      // Close modal and refresh data
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
      // Refresh the data
      refetch();
    } catch (error) {
      console.error("Error performing admin action:", error);
      toast.error("Failed to update admin status. Please try again.");
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
  
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="bg-white text-black py-8 px-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">👑 Admin Management</h1>
          <p className="text-gray-600 text-lg">Monitor and manage all admin accounts on your platform</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoadingUsers && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-gray-600" />
            <p className="ml-2 text-gray-600">Loading admin data...</p>
          </div>
        )}
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
      
        {/* Admins Table */}
        <Card className="border-gray-200 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900">All Admins</CardTitle>
            <CardDescription className="text-gray-600">
              Showing {filteredAdmins.length} of {admins.length} admins
            </CardDescription>
            {isLoadingUsers && (
              <div className="flex items-center mt-2">
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-gray-600" />
                <span className="text-gray-600">Loading admin data...</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="text-gray-700">Admin</TableHead>
                    <TableHead className="text-gray-700">Role</TableHead>
                    <TableHead className="text-gray-700">Contact</TableHead>
                    <TableHead className="text-gray-700">Status</TableHead>
                    <TableHead className="text-gray-700">Joined Date</TableHead>
                    <TableHead className="text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.map((admin) => (
                    <TableRow key={admin.id} className="border-gray-200 hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{admin.name}</div>
                            <div className="text-sm text-gray-500">{admin.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block capitalize ${
                          admin.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">{admin.phone}</div>
                      </TableCell>
                      <TableCell>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block capitalize ${getStatusColor(admin.status)}`}>
                          {admin.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">
                          {new Date(admin.joinedDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="relative">
                        {currentUser?.data?.role === 'super_admin' || admin.role === 'admin' ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-gray-800 text-white border-gray-600">
                              <DropdownMenuItem
                                onClick={() => openConfirmModal({ id: admin.id, name: admin.name, status: admin.status })}
                                className="text-white hover:bg-gray-700 cursor-pointer"
                              >
                                <User className="mr-2 h-4 w-4" />
                                Change Status
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <span className="text-gray-400 text-sm">No actions available</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredAdmins.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No admins found</h3>
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
        title="Change Admin Status"
        description="This will update the admin's account status on the platform."
        selectedStatus={confirmModal.selectedStatus}
        statusOptions={statusOptions}
        onStatusChange={(status) => setConfirmModal(prev => ({ ...prev, selectedStatus: status as 'ACTIVE' | 'INACTIVE' | 'BLOCKED' }))}
        isLoading={
          confirmModal.selectedStatus === 'BLOCKED' ? isBlocking :
          confirmModal.selectedStatus === 'ACTIVE' ? isActivating :
          isSuspending
        }
        targetName={confirmModal.adminName}
      />
    </div>
  );
}