// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Loading from "@/components/ui/Loading";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// // import { useGetUserBookingsQuery } from "@/redux/features/auth/Booking/booking.api";

// import { format } from "date-fns";
// import { Bar, BarChart, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// export default function Bookings() {

//   const { data:bookings, isLoading, error } = useGetUserBookingsQuery({});

//   console.log("Booking Query State:", { bookings, isLoading, error });

//   if (isLoading) return <Loading />;

//   // Handle authentication error
//   if (error) {
//     console.error("Authentication or data error:", error);
//     return (
//       <div className="p-6">
//         <Card>
//           <CardContent className="py-8 text-center">
//             <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
//             <p className="text-gray-600 mb-4">
//               You need to be logged in to view your booking analytics.
//             </p>
//             <p className="text-sm text-gray-500">
//               Please log in to access your booking data.
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   console.log("Bookings data:", bookings);

//   // Handle case when data is not yet loaded or empty
//   if (!bookings) return <p>No bookings data available</p>;

//   // 📌 Transform Data (ensure bookings is an array)
//   const bookingsArray = Array.isArray(bookings) ? bookings : [];
//   const totalBookings = bookingsArray.length;

//   // Safe calculations with default fallbacks
//   const upcoming = bookingsArray.filter((b: any) => b.startDate && new Date(b.startDate) > new Date()).length;
//   const completed = bookingsArray.filter((b: any) => b.endDate && new Date(b.endDate) < new Date()).length;
//   const totalSpent = bookingsArray.reduce((sum: number, b: any) => sum + (b.price || 0) * (b.peopleCount || 1), 0);

//   // Group by month
//   const bookingsByMonth: Record<string, number> = {};
//   const spendingByMonth: Record<string, number> = {};
//   bookingsArray.forEach((b: any) => {
//     if (b.createdAt) {
//       const month = format(new Date(b.createdAt), "MMM yyyy");
//       bookingsByMonth[month] = (bookingsByMonth[month] || 0) + 1;
//       spendingByMonth[month] = (spendingByMonth[month] || 0) + (b.price || 0);
//     }
//   });

//   const bookingsByMonthData = Object.keys(bookingsByMonth).map((m) => ({
//     month: m,
//     count: bookingsByMonth[m],
//   }));

//   const spendingByMonthData = Object.keys(spendingByMonth).map((m) => ({
//     month: m,
//     spent: spendingByMonth[m],
//   }));

//   // Pie chart data by division
//   const divisionData: Record<string, number> = {};
//   bookingsArray.forEach((b: any) => {
//     if (b.division) {
//       divisionData[b.division] = (divisionData[b.division] || 0) + 1;
//     }
//   });
//   const pieData = Object.keys(divisionData).map((d) => ({
//     name: d,
//     value: divisionData[d],
//   }));

//   const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

//   return (
//     <div className="grid gap-6 p-6">
//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card><CardHeader><CardTitle>Total Bookings</CardTitle></CardHeader><CardContent>{totalBookings}</CardContent></Card>
//         <Card><CardHeader><CardTitle>Upcoming</CardTitle></CardHeader><CardContent>{upcoming}</CardContent></Card>
//         <Card><CardHeader><CardTitle>Completed</CardTitle></CardHeader><CardContent>{completed}</CardContent></Card>
//         <Card><CardHeader><CardTitle>Total Spent</CardTitle></CardHeader><CardContent>৳ {totalSpent}</CardContent></Card>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader><CardTitle>Bookings by Month</CardTitle></CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={250}>
//               <LineChart data={bookingsByMonthData}>
//                 <XAxis dataKey="month" /><YAxis /><Tooltip />
//                 <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader><CardTitle>Spending by Month</CardTitle></CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={250}>
//               <BarChart data={spendingByMonthData}>
//                 <XAxis dataKey="month" /><YAxis /><Tooltip /><Legend />
//                 <Bar dataKey="spent" fill="#82ca9d" />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader><CardTitle>Bookings by Division</CardTitle></CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart>
//                 <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
//                   {pieData.map((_, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         {/* Recent Bookings Table */}
//         <Card>
//           <CardHeader><CardTitle>Recent Bookings</CardTitle></CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Tour</TableHead>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Price</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {bookingsArray.slice(0, 5).map((b: any) => (
//                   <TableRow key={b.id}>
//                     <TableCell>{b.tourName}</TableCell>
//                     <TableCell>{format(new Date(b.startDate), "dd MMM yyyy")}</TableCell>
//                     <TableCell>{b.status}</TableCell>
//                     <TableCell>৳ {b.price}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
