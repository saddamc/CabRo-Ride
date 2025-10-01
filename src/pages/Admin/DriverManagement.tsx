import ConfirmationModal from "@/components/modal/ConfirmationModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApprovedDriverMutation, useGetAllDriversQuery, useSuspendDriverMutation } from "@/redux/features/driver/driver.api";
import { Check, CheckCircle2, FileText, Filter, Loader2, Search, Shield, Star, User, X } from "lucide-react";
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
    action: 'approve' | 'reject' | 'suspend' | 'reactivate';
    driverId: string;
    driverName: string;
  }>({
    isOpen: false,
    action: 'approve',
    driverId: '',
    driverName: ''
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
  
  const openConfirmModal = (action: 'approve' | 'reject' | 'suspend' | 'reactivate', driver: IDriver) => {
    setConfirmModal({
      isOpen: true,
      action,
      driverId: driver.id,
      driverName: driver.name
    });
  };

  const handleConfirmAction = async () => {
    try {
      const { action, driverId } = confirmModal;
      
      if (action === 'approve' || action === 'reactivate') {
        await approveDriver({ id: driverId }).unwrap();
        toast.success(`Driver ${action === 'approve' ? 'approved' : 'reactivated'} successfully`);
      } else if (action === 'suspend') {
        await suspendDriver({ id: driverId }).unwrap();
        toast.success("Driver suspended successfully");
      } else if (action === 'reject') {
        // Implement reject API call if needed
        toast.success("Driver rejected successfully");
      }

      // Close modal and refresh data
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
      // Refetch updated driver data
      refetch();
    } catch (error) {
      console.error("Error performing driver action:", error);
      toast.error(`Failed to ${confirmModal.action} driver. Please try again.`);
    }
  };

  const handleApproveDriver = (id: string, name: string) => {
    const driver = { id, name } as IDriver;
    openConfirmModal('approve', driver);
  };
  
  const handleRejectDriver = (id: string, name: string) => {
    const driver = { id, name } as IDriver;
    openConfirmModal('reject', driver);
  };
  
  const handleSuspendDriver = (id: string, name: string) => {
    const driver = { id, name } as IDriver;
    openConfirmModal('suspend', driver);
  };
  
  const handleReactivateDriver = (id: string, name: string) => {
    const driver = { id, name } as IDriver;
    openConfirmModal('reactivate', driver);
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
    <div className="container mx-auto py-6 bg-black text-white">
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
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(driver)}
                              className="h-8 w-8 p-0"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            
                            {driver.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleApproveDriver(driver.id, driver.name)}
                                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRejectDriver(driver.id, driver.name)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            
                            {driver.status === 'approved' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSuspendDriver(driver.id, driver.name)}
                                className="h-8 w-8 p-0 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {driver.status === 'suspended' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReactivateDriver(driver.id, driver.name)}
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
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
                <div className="space-y-6">
                  {/* Driver Info */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                      <User className="h-10 w-10 text-gray-500" />
                    </div>
                    <h3 className="font-semibold text-lg">{selectedDriver.name}</h3>
                    <div className="text-sm text-gray-500">{selectedDriver.email}</div>
                    <div className="text-sm text-gray-500">{selectedDriver.phone}</div>
                    
                    <div className="flex items-center mt-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block capitalize ${getStatusColor(selectedDriver.status)}`}>
                        {selectedDriver.status}
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Total Trips</div>
                      <div className="font-semibold text-lg">{selectedDriver.totalTrips}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Rating</div>
                      <div className="font-semibold text-lg flex items-center justify-center">
                        {selectedDriver.rating > 0 ? (
                          <>
                            {selectedDriver.rating.toFixed(1)}
                            <Star className="h-4 w-4 text-yellow-500 ml-1 fill-current" />
                          </>
                        ) : (
                          'N/A'
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Vehicle Info */}
                  <div>
                    <h4 className="font-medium mb-2">Vehicle Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Make & Model</span>
                        <span className="font-medium">{selectedDriver.vehicle.make} {selectedDriver.vehicle.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Year</span>
                        <span className="font-medium">{selectedDriver.vehicle.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">License Plate</span>
                        <span className="font-medium">{selectedDriver.vehicle.plateNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">License Number</span>
                        <span className="font-medium">{selectedDriver.licenseNumber}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Documents */}
                  <div>
                    <h4 className="font-medium mb-2">Documents</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        View Driver's License
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        View Vehicle Registration
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        View Insurance
                      </Button>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="pt-4 border-t space-y-3">
                    {selectedDriver.status === 'pending' && (
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          onClick={() => handleApproveDriver(selectedDriver.id, selectedDriver.name)}
                          className="w-full"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleRejectDriver(selectedDriver.id, selectedDriver.name)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    )}
                    
                    {selectedDriver.status === 'approved' && (
                      <Button 
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSuspendDriver(selectedDriver.id, selectedDriver.name)}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Suspend Driver
                      </Button>
                    )}
                    
                    {selectedDriver.status === 'suspended' && (
                      <Button 
                        className="w-full"
                        onClick={() => handleReactivateDriver(selectedDriver.id, selectedDriver.name)}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Reactivate Driver
                      </Button>
                    )}
                    
                    {selectedDriver.status === 'rejected' && (
                      <Button 
                        className="w-full"
                        onClick={() => handleApproveDriver(selectedDriver.id, selectedDriver.name)}
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
        title={`${confirmModal.action === 'approve' ? 'Approve' : 
                confirmModal.action === 'reject' ? 'Reject' :
                confirmModal.action === 'suspend' ? 'Suspend' : 'Reactivate'} Driver`}
        description={
          confirmModal.action === 'approve' ? 'This will grant the driver access to accept rides on the platform.' :
          confirmModal.action === 'reject' ? 'This will deny the driver application and they will not be able to drive on the platform.' :
          confirmModal.action === 'suspend' ? 'This will temporarily disable the driver\'s ability to accept rides.' :
          'This will reactivate the driver\'s account and allow them to accept rides again.'
        }
        actionType={confirmModal.action}
        isLoading={confirmModal.action === 'suspend' ? isSuspendingDriver : isApprovingDriver}
        targetName={confirmModal.driverName}
      />
    </div>
  );
}