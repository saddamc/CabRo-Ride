import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { AddDivisionModal } from "@/components/modules/Admin/Division/AddDivisionModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ErrorPage from "@/components/ui/ErrorPage";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useGetDivisionsQuery,
  useRemoveDivisionMutation,
} from "@/redux/features/auth/Division/division.api";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { ScaleLoader } from "react-spinners";
import { toast } from "sonner";

const AddDivision = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);

  const { data, isLoading, error } = useGetDivisionsQuery({ page: currentPage, limit });
  const [removeDivision] = useRemoveDivisionMutation();

  const totalPage = Math.ceil(data?.length / limit);

  const divisions = data?.slice((currentPage - 1) * limit, currentPage * limit);


  // const  = data?.meta?.totalPage || 1;
  // console.log("data:",totalPage) 

  const handleRemoveDivision = async (divisionId: string) => {
    const toastId = toast.loading("Removing...");
    try {
      const res = await removeDivision(divisionId).unwrap();

      if (res.success) {
        toast.success("Removed", { id: toastId });
      }
    } catch (err) {
      console.log(err);
    }
  };


  if (isLoading) {
    return <ScaleLoader />
  }

  if (error) {
    return <ErrorPage />
  }

    
  return (
    <div className="max-w-7xl mx-auto px-5 w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Divisions Management</h1>
          <p className="text-muted-foreground mt-2">Manage and organize your divisions</p>
        </div>
        <AddDivisionModal />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Divisions</CardTitle>
            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{data?.length || data?.data?.length || 0}</div>
            <p className="text-xs text-blue-600">
              Active divisions
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Last Updated</CardTitle>
            <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">Live</div>
            <p className="text-xs text-green-600">
              Real-time data
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
         {/* Divisions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            { divisions.map((item: { _id: string; name: string; description?: string; thumbnail?: string; image?: string }) => (
              <Card key={item._id} className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-shrink-0 relative">
                      {item?.thumbnail || item?.image ? (
                        <img
                          src={item.thumbnail || item.image}
                          alt={`${item.name} thumbnail`}
                          className="w-24 h-24 rounded-lg object-cover border border-border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center ${item?.thumbnail || item?.image ? 'hidden' : ''}`}>
                        <svg className="h-12 w-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                    <DeleteConfirmation
                      onConfirm={() => handleRemoveDivision(item._id)}
                    >
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DeleteConfirmation>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardTitle className="text-lg mb-2">{item?.name}</CardTitle>
                  {item?.description && (
                    <CardDescription className="text-sm leading-relaxed">
                      {item.description}
                    </CardDescription>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
      
      </div>
      {/* Pagination - Fixed condition */}
      {(totalPage > 1 || (data?.length || 0) > 0) && (
        <div className="mt-5">
          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPage }, (_, index) => index + 1).map(
                  (page) => (
                    <PaginationItem
                      key={page}
                      onClick={() => setCurrentPage(page)}
                    >
                      <PaginationLink isActive={currentPage === page}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className={
                      currentPage === totalPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )} 
    </div>
  );
};

export default AddDivision;