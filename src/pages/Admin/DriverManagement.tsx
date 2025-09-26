import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, CheckCircle2, FileText, Filter, Search, Shield, Star, User, X } from "lucide-react";
import { useState } from "react";

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
  
  // Mock drivers data for the UI
  const mockDrivers: IDriver[] = [
    {
      id: 'dr-001',
      name: 'John Smith',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@example.com',
      licenseNumber: 'DL-123456789',
      vehicle: {
        make: 'Toyota',
        model: 'Camry',
        year: '2021',
        plateNumber: 'ABC-1234'
      },
      status: 'approved',
      rating: 4.8,
      totalTrips: 256,
      joinedDate: '2025-03-15',
      documents: {
        license: 'https://example.com/license/123',
        registration: 'https://example.com/registration/123',
        insurance: 'https://example.com/insurance/123'
      }
    },
    {
      id: 'dr-002',
      name: 'Sarah Johnson',
      phone: '+1 (555) 987-6543',
      email: 'sarah.johnson@example.com',
      licenseNumber: 'DL-987654321',
      vehicle: {
        make: 'Honda',
        model: 'Civic',
        year: '2022',
        plateNumber: 'XYZ-5678'
      },
      status: 'pending',
      rating: 0,
      totalTrips: 0,
      joinedDate: '2025-09-10',
      documents: {
        license: 'https://example.com/license/456',
        registration: 'https://example.com/registration/456',
        insurance: 'https://example.com/insurance/456'
      }
    },
    {
      id: 'dr-003',
      name: 'Michael Chen',
      phone: '+1 (555) 456-7890',
      email: 'michael.chen@example.com',
      licenseNumber: 'DL-456789123',
      vehicle: {
        make: 'Nissan',
        model: 'Altima',
        year: '2020',
        plateNumber: 'DEF-9012'
      },
      status: 'suspended',
      rating: 3.2,
      totalTrips: 178,
      joinedDate: '2025-05-22',
      documents: {
        license: 'https://example.com/license/789',
        registration: 'https://example.com/registration/789',
        insurance: 'https://example.com/insurance/789'
      }
    },
    {
      id: 'dr-004',
      name: 'David Wilson',
      phone: '+1 (555) 321-6547',
      email: 'david.wilson@example.com',
      licenseNumber: 'DL-231654987',
      vehicle: {
        make: 'Ford',
        model: 'Focus',
        year: '2023',
        plateNumber: 'GHI-3456'
      },
      status: 'pending',
      rating: 0,
      totalTrips: 0,
      joinedDate: '2025-09-15',
      documents: {
        license: 'https://example.com/license/101',
        registration: 'https://example.com/registration/101',
        insurance: 'https://example.com/insurance/101'
      }
    },
    {
      id: 'dr-005',
      name: 'Jennifer Lee',
      phone: '+1 (555) 789-0123',
      email: 'jennifer.lee@example.com',
      licenseNumber: 'DL-789012345',
      vehicle: {
        make: 'Hyundai',
        model: 'Sonata',
        year: '2021',
        plateNumber: 'JKL-7890'
      },
      status: 'rejected',
      rating: 0,
      totalTrips: 0,
      joinedDate: '2025-08-30',
      documents: {
        license: 'https://example.com/license/202',
        registration: 'https://example.com/registration/202',
        insurance: 'https://example.com/insurance/202'
      }
    }
  ];
  
  // Filter and sort drivers
  const filteredDrivers = mockDrivers.filter(driver => {
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
  
  const handleApproveDriver = (id: string) => {
    console.log(`Approving driver with ID: ${id}`);
    // API call to approve driver would go here
  };
  
  const handleRejectDriver = (id: string) => {
    console.log(`Rejecting driver with ID: ${id}`);
    // API call to reject driver would go here
  };
  
  const handleSuspendDriver = (id: string) => {
    console.log(`Suspending driver with ID: ${id}`);
    // API call to suspend driver would go here
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
    <div className="container mx-auto py-6 bg-white">
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
                                  onClick={() => handleApproveDriver(driver.id)}
                                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRejectDriver(driver.id)}
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
                                onClick={() => handleSuspendDriver(driver.id)}
                                className="h-8 w-8 p-0 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {driver.status === 'suspended' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApproveDriver(driver.id)}
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
                          onClick={() => handleApproveDriver(selectedDriver.id)}
                          className="w-full"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleRejectDriver(selectedDriver.id)}
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
                        onClick={() => handleSuspendDriver(selectedDriver.id)}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Suspend Driver
                      </Button>
                    )}
                    
                    {selectedDriver.status === 'suspended' && (
                      <Button 
                        className="w-full"
                        onClick={() => handleApproveDriver(selectedDriver.id)}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Reactivate Driver
                      </Button>
                    )}
                    
                    {selectedDriver.status === 'rejected' && (
                      <Button 
                        className="w-full"
                        onClick={() => handleApproveDriver(selectedDriver.id)}
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
    </div>
  );
}