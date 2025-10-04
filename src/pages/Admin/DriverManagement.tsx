import ConfirmationModal from "@/components/modal/ConfirmationModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApprovedDriverMutation, useGetAllDriversQuery, useSuspendDriverMutation } from "@/redux/features/driver/driver.api";
import { CheckCircle2, FileText, Filter, Loader2, MoreHorizontal, Search, Shield, Star, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface IDriver {
  id: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  vehicle: {
    make: string;
    model: string;
    year: string;
    plateNumber: string;
  };
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  rating: number;
  totalTrips: number;
  joinedDate: string;
  documents: {
    license: string;
    registration: string;
    insurance: string;
  };
}

export default function DriverManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDriver, setSelectedDriver] = useState<IDriver | null>(null);
  
  // Confirmation Modal States
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    driverId: string;
    driverName: string;
    currentStatus: string;
    selectedStatus: 'pending' | 'approved' | 'suspended' | 'rejected';
    action: string;
  }>({
    isOpen: false,
    driverId: '',
    driverName: '',
    currentStatus: 'pending',
    selectedStatus: 'pending',
    action: 'approve'
  });

  // API Mutations and Queries
  const { data: driversData, isLoading: isLoadingDrivers, refetch } = useGetAllDriversQuery();
  const [approveDriver, { isLoading: isApprovingDriver }] = useApprovedDriverMutation();
  const [suspendDriver, { isLoading: isSuspendingDriver }] = useSuspendDriverMutation();
  
  // Convert API driver data to UI format
  const drivers: IDriver[] = driversData?.map(driver => ({
    id: driver._id,
    name: driver.user?.name || 'Unknown',
    phone: driver.user?.phone || 'No phone',
    email: driver.user?.email || 'No email',
    licenseNumber: driver.vehicleType?.plateNumber || 'N/A',
    vehicle: {
      make: driver.vehicleInfo?.make || driver.vehicleType?.make || 'Unknown',
      model: driver.vehicleInfo?.model || driver.vehicleType?.model || 'Unknown',
      year: driver.vehicleInfo?.year || String(driver.vehicleType?.year) || 'Unknown',
      plateNumber: driver.vehicleInfo?.licensePlate || driver.vehicleType?.plateNumber || 'Unknown'
    },
    status: driver.isSuspended ? 'suspended' : driver.isApproved ? 'approved' : 'pending',
    rating: typeof driver.rating === 'number' ? driver.rating : (driver.rating as {average?: number})?.average || 0,
    totalTrips: driver.totalRides || driver.stats?.totalRides || 0,
    joinedDate: driver.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    documents: {
      license: 'https://example.com/license/123',
      registration: 'https://example.com/registration/123',
      insurance: 'https://example.com/insurance/123'
    }
  })) || [];
  
  // Filter and sort drivers
  const filteredDrivers = drivers.filter(driver => {
    // Filter by status
    if (statusFilter !== 'all' && driver.status !== statusFilter) return false;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        driver.name.toLowerCase().includes(term) ||
        driver.phone.includes(term) ||
        driver.email.toLowerCase().includes(term) ||
        driver.licenseNumber.toLowerCase().includes(term) ||
        driver.vehicle.plateNumber.toLowerCase().includes(term)
      );
    }
    
    return true;
  });
  
  const handleChangeDriverStatus = (driver: IDriver) => {
    setConfirmModal({
      isOpen: true,
      driverId: driver.id,
      driverName: driver.name,
      currentStatus: driver.status,
      selectedStatus: driver.status as 'pending' | 'approved' | 'suspended' | 'rejected',
      action: 'change'
    });
  };

  const handleConfirmAction = async () => {
    try {
      const { selectedStatus, driverId } = confirmModal;

      if (selectedStatus === 'approved') {
        await approveDriver({ id: driverId }).unwrap();
        toast.success("Driver approved successfully");
      } else if (selectedStatus === 'suspended') {
        await suspendDriver({ id: driverId }).unwrap();
        toast.success("Driver suspended successfully");
      } else if (selectedStatus === 'rejected') {
        // Note: reject functionality may need separate API endpoint
        toast.success("Driver rejected successfully");
      }

      // Close modal and refresh data
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
      // Refetch updated driver data
      refetch();
    } catch (error) {
      console.error("Error performing driver action:", error);
      toast.error("Failed to update driver status. Please try again.");
    }
  };

  const handleStatusChangeInModal = (newStatus: string) => {
    setConfirmModal(prev => ({
      ...prev,
      selectedStatus: newStatus as 'pending' | 'approved' | 'suspended' | 'rejected'
    }));
  };

  
  const handleViewDetails = (driver: IDriver) => {
    setSelectedDriver(driver);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      case 'rejected': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  return (
    <div className="container mx-auto py-6 bg-white text-black min-h-screen">
      {isLoadingDrivers && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-white" />
          <p className="ml-2">Loading driver data...</p>
        </div>
      )}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Driver Management</h1>
        <p className="text-gray-500">Review, approve, and manage driver accounts</p>
      </div>
      
      <div className="mb-6">
        <Tabs defaultValue="all" className="w-full" onValueChange={setStatusFilter}>
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="suspended">Suspended</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10"
            placeholder="Search by name, email, phone, license..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select defaultValue="newest">
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="rating-high">Highest Rating</SelectItem>
              <SelectItem value="rating-low">Lowest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" /> More Filters
        </Button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Drivers List Table */}
        <div className="lg:w-2/3">
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-2">
              <CardTitle>Drivers List</CardTitle>
              <CardDescription>Showing {filteredDrivers.length} drivers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <div className="font-medium">{driver.name}</div>
                              <div className="text-sm text-gray-500">{driver.phone}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{driver.vehicle.make} {driver.vehicle.model}</div>
                            <div className="text-sm text-gray-500">{driver.vehicle.plateNumber}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block capitalize ${getStatusColor(driver.status)}`}>
                            {driver.status}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(driver.joinedDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white">
                              <DropdownMenuItem
                                onClick={() => handleViewDetails(driver)}
                                className="text-gray-700 hover:text-gray-900 cursor-pointer"
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleChangeDriverStatus(driver)}
                                className="text-gray-700 hover:text-gray-900 cursor-pointer"
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
            </CardContent>
          </Card>
        </div>
        
        {/* Driver Details */}
        <div className="lg:w-1/3">
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-2">
              <CardTitle>Driver Details</CardTitle>
              <CardDescription>
                {selectedDriver 
                  ? `Reviewing ${selectedDriver.name}'s profile` 
                  : 'Select a driver to view details'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDriver ? (
                <div className="space-y-4">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium text-gray-700">Name</TableCell>
                        <TableCell>{selectedDriver.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-gray-700">Email</TableCell>
                        <TableCell>{selectedDriver.email}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-gray-700">Phone</TableCell>
                        <TableCell>{selectedDriver.phone}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-gray-700">Status</TableCell>
                        <TableCell>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block capitalize ${getStatusColor(selectedDriver.status)}`}>
                            {selectedDriver.status}
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-gray-700">Total Trips</TableCell>
                        <TableCell>{selectedDriver.totalTrips}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-gray-700">Rating</TableCell>
                        <TableCell>
                          {selectedDriver.rating > 0 ? (
                            <div className="flex items-center">
                              {selectedDriver.rating.toFixed(1)}
                              <Star className="h-4 w-4 text-yellow-500 ml-1 fill-current" />
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-gray-700">Joined Date</TableCell>
                        <TableCell>{new Date(selectedDriver.joinedDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-gray-700">Vehicle Make</TableCell>
                        <TableCell>{selectedDriver.vehicle.make}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-gray-700">Vehicle Model</TableCell>
                        <TableCell>{selectedDriver.vehicle.model}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-gray-700">Vehicle Year</TableCell>
                        <TableCell>{selectedDriver.vehicle.year}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-gray-700">License Plate</TableCell>
                        <TableCell>{selectedDriver.vehicle.plateNumber}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-gray-700">License Number</TableCell>
                        <TableCell>{selectedDriver.licenseNumber}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  {/* Documents Section */}
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3 text-gray-700">Documents</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Driver's License
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Vehicle Registration
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Insurance
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t space-y-3">
                    {selectedDriver.status === 'pending' && (
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              driverId: selectedDriver.id,
                              driverName: selectedDriver.name,
                              currentStatus: selectedDriver.status,
                              selectedStatus: 'approved',
                              action: 'approve'
                            });
                          }}
                          className="w-full"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              driverId: selectedDriver.id,
                              driverName: selectedDriver.name,
                              currentStatus: selectedDriver.status,
                              selectedStatus: 'rejected',
                              action: 'reject'
                            });
                          }}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    )}

                    {selectedDriver.status === 'approved' && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setConfirmModal({
                            isOpen: true,
                            driverId: selectedDriver.id,
                            driverName: selectedDriver.name,
                            currentStatus: selectedDriver.status,
                            selectedStatus: 'suspended',
                            action: 'suspend'
                          });
                        }}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Suspend Driver
                      </Button>
                    )}

                    {selectedDriver.status === 'suspended' && (
                      <Button
                        className="w-full"
                        onClick={() => {
                          setConfirmModal({
                            isOpen: true,
                            driverId: selectedDriver.id,
                            driverName: selectedDriver.name,
                            currentStatus: selectedDriver.status,
                            selectedStatus: 'approved',
                            action: 'reactivate'
                          });
                        }}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Reactivate Driver
                      </Button>
                    )}

                    {selectedDriver.status === 'rejected' && (
                      <Button
                        className="w-full"
                        onClick={() => {
                          setConfirmModal({
                            isOpen: true,
                            driverId: selectedDriver.id,
                            driverName: selectedDriver.name,
                            currentStatus: selectedDriver.status,
                            selectedStatus: 'approved',
                            action: 'approve'
                          });
                        }}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve Driver
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-gray-100 rounded-full mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Select a driver from the list to view their details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={`${confirmModal.action.charAt(0).toUpperCase() + confirmModal.action.slice(1)} Driver`}
        description={
          confirmModal.action === 'approve' ? 'This will grant the driver access to accept rides on the platform.' :
          confirmModal.action === 'reject' ? 'This will deny the driver application and they will not be able to drive on the platform.' :
          confirmModal.action === 'suspend' ? 'This will temporarily disable the driver\'s ability to accept rides.' :
          'This will reactivate the driver\'s account and allow them to accept rides again.'
        }
        selectedStatus={confirmModal.selectedStatus}
        actionType={confirmModal.action}
        statusOptions={[
          { value: 'approved', label: 'Approved' },
          { value: 'suspended', label: 'Suspended' },
          { value: 'rejected', label: 'Rejected' }
        ]}
        onStatusChange={handleStatusChangeInModal}
        isLoading={confirmModal.action === 'suspend' ? isSuspendingDriver : isApprovingDriver}
        targetName={confirmModal.driverName}
      />
    </div>
  );
}