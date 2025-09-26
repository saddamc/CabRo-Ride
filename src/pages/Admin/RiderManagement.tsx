import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ban, Car, FileText, Filter, Search, User } from "lucide-react";
import { useState } from "react";

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
  const [selectedRider, setSelectedRider] = useState<IRider | null>(null);
  
  // Mock riders data for the UI
  const mockRiders: IRider[] = [
    {
      id: 'ri-001',
      name: 'Emily Johnson',
      phone: '+1 (555) 123-4567',
      email: 'emily.johnson@example.com',
      status: 'active',
      totalRides: 37,
      joinedDate: '2025-01-15',
      lastActive: '2025-09-25'
    },
    {
      id: 'ri-002',
      name: 'Robert Chen',
      phone: '+1 (555) 987-6543',
      email: 'robert.chen@example.com',
      status: 'active',
      totalRides: 105,
      joinedDate: '2024-11-10',
      lastActive: '2025-09-23'
    },
    {
      id: 'ri-003',
      name: 'Jessica Smith',
      phone: '+1 (555) 456-7890',
      email: 'jessica.smith@example.com',
      status: 'suspended',
      totalRides: 82,
      joinedDate: '2025-02-22',
      lastActive: '2025-08-15'
    },
    {
      id: 'ri-004',
      name: 'Michael Wilson',
      phone: '+1 (555) 321-6547',
      email: 'michael.wilson@example.com',
      status: 'inactive',
      totalRides: 8,
      joinedDate: '2025-07-15',
      lastActive: '2025-08-20'
    },
    {
      id: 'ri-005',
      name: 'Samantha Lee',
      phone: '+1 (555) 789-0123',
      email: 'samantha.lee@example.com',
      status: 'active',
      totalRides: 24,
      joinedDate: '2025-05-30',
      lastActive: '2025-09-24'
    }
  ];
  
  // Filter riders
  const filteredRiders = mockRiders.filter(rider => {
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
  
  const handleSuspendRider = (id: string) => {
    console.log(`Suspending rider with ID: ${id}`);
    // API call to suspend rider would go here
  };
  
  const handleReactivateRider = (id: string) => {
    console.log(`Reactivating rider with ID: ${id}`);
    // API call to reactivate rider would go here
  };
  
  const handleViewDetails = (rider: IRider) => {
    setSelectedRider(rider);
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
    <div className="container mx-auto py-6 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Rider Management</h1>
        <p className="text-gray-500">Manage and monitor rider accounts</p>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Button
            variant="outline"
            className={`mr-2 ${statusFilter === 'all' ? 'bg-primary/10' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Riders
          </Button>
          <Button
            variant="outline"
            className={`mr-2 ${statusFilter === 'active' ? 'bg-green-100 text-green-700' : ''}`}
            onClick={() => setStatusFilter('active')}
          >
            Active
          </Button>
          <Button
            variant="outline"
            className={`mr-2 ${statusFilter === 'inactive' ? 'bg-gray-100 text-gray-700' : ''}`}
            onClick={() => setStatusFilter('inactive')}
          >
            Inactive
          </Button>
          <Button
            variant="outline"
            className={`mr-2 ${statusFilter === 'suspended' ? 'bg-red-100 text-red-700' : ''}`}
            onClick={() => setStatusFilter('suspended')}
          >
            Suspended
          </Button>
        </div>
        
        <div>
          <Button variant="default">Export Data</Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10"
            placeholder="Search by name, email, phone..."
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
              <SelectItem value="rides-high">Most Rides</SelectItem>
              <SelectItem value="rides-low">Fewest Rides</SelectItem>
              <SelectItem value="recent">Recently Active</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" /> More Filters
        </Button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Riders List Table */}
        <div className="lg:w-2/3">
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-2">
              <CardTitle>Riders List</CardTitle>
              <CardDescription>Showing {filteredRiders.length} riders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rider</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total Rides</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRiders.map((rider) => (
                      <TableRow key={rider.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <div className="font-medium">{rider.name}</div>
                              <div className="text-sm text-gray-500">{rider.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block capitalize ${getStatusColor(rider.status)}`}>
                            {rider.status}
                          </div>
                        </TableCell>
                        <TableCell>{rider.totalRides}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(rider.lastActive).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(rider)}
                              className="h-8 w-8 p-0"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            
                            {rider.status === 'active' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSuspendRider(rider.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {(rider.status === 'suspended' || rider.status === 'inactive') && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReactivateRider(rider.id)}
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <User className="h-4 w-4" />
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
        
        {/* Rider Details */}
        <div className="lg:w-1/3">
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-2">
              <CardTitle>Rider Details</CardTitle>
              <CardDescription>
                {selectedRider 
                  ? `Viewing ${selectedRider.name}'s profile` 
                  : 'Select a rider to view details'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedRider ? (
                <div className="space-y-6">
                  {/* Rider Info */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                      <User className="h-10 w-10 text-gray-500" />
                    </div>
                    <h3 className="font-semibold text-lg">{selectedRider.name}</h3>
                    <div className="text-sm text-gray-500">{selectedRider.email}</div>
                    <div className="text-sm text-gray-500">{selectedRider.phone}</div>
                    
                    <div className="flex items-center mt-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block capitalize ${getStatusColor(selectedRider.status)}`}>
                        {selectedRider.status}
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Total Rides</div>
                      <div className="font-semibold text-lg">{selectedRider.totalRides}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Joined</div>
                      <div className="font-semibold text-sm">
                        {new Date(selectedRider.joinedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent Activity */}
                  <div>
                    <h4 className="font-medium mb-2">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Car className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Downtown to Airport</div>
                            <div className="text-xs text-gray-500">Sep 24, 2025 • $34.50</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Car className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Westside Mall to Residential Area</div>
                            <div className="text-xs text-gray-500">Sep 22, 2025 • $18.75</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Car className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Central Park to Office District</div>
                            <div className="text-xs text-gray-500">Sep 20, 2025 • $22.30</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <Button variant="link" className="text-sm">
                        View all rides
                      </Button>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="pt-4 border-t">
                    {selectedRider.status === 'active' && (
                      <Button 
                        variant="outline"
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleSuspendRider(selectedRider.id)}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Suspend Rider
                      </Button>
                    )}
                    
                    {(selectedRider.status === 'suspended' || selectedRider.status === 'inactive') && (
                      <Button 
                        className="w-full"
                        onClick={() => handleReactivateRider(selectedRider.id)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Reactivate Rider
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-gray-100 rounded-full mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Select a rider from the list to view their details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}