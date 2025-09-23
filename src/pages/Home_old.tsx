// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Car, Clock, MapPin, Play, Shield, Star } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const Home = () => {
//   const features = [
//     {
//       icon: Shield,
//       title: 'Safe & Secure',
//       description: 'Advanced safety features including real-time tracking and emergency SOS',
//     },
//     {
//       icon: Clock,
//       title: 'Quick & Reliable',
//       description: 'Get rides within minutes with our extensive network of drivers',
//     },
//     {
//       icon: Star,
//       title: 'Highly Rated',
//       description: 'Top-rated drivers ensuring quality service every time',
//     },
//   ];



//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
//         <div className="container px-4 mx-auto">
//           <div className="grid items-center gap-12 lg:grid-cols-2">
//             <div className="space-y-8">
//               <div className="space-y-4">
//                 <h1 className="text-4xl font-bold leading-tight lg:text-6xl">
//                   Your Ride,
//                   <span className="text-primary"> Your Way</span>
//                 </h1>
//                 <p className="text-xl leading-relaxed text-muted-foreground">
//                   Experience safe, reliable, and affordable transportation with Cabro. 
//                   Connect with trusted drivers in your area instantly.
//                 </p>
//               </div>
//               <div className="flex flex-col gap-4 sm:flex-row">
//                 <Button size="lg" className="px-8 py-6 text-lg" asChild>
//                   <Link to="/rider/book">
//                     <Car className="w-5 h-5 mr-2" />
//                     Book a Ride Now
//                   </Link>
//                 </Button>
//                 <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
//                   <Play className="w-5 h-5 mr-2" />
//                   Watch Demo
//                 </Button>
//               </div>
//               <div className="flex items-center space-x-8">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold">1M+</div>
//                   <div className="text-sm text-muted-foreground">Happy Riders</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold">50K+</div>
//                   <div className="text-sm text-muted-foreground">Active Drivers</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold">4.8</div>
//                   <div className="text-sm text-muted-foreground">Average Rating</div>
//                 </div>
//               </div>
//             </div>
//             <div className="relative">
//               <img
//                 src="https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg?auto=compress&cs=tinysrgb&w=600"
//                 alt="Cabro App"
//                 className="shadow-2xl rounded-2xl"
//               />
//               <div className="absolute p-4 bg-white shadow-lg -bottom-6 -left-6 dark:bg-card rounded-xl">
//                 <div className="flex items-center space-x-3">
//                   <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full dark:bg-green-900">
//                     <MapPin className="w-6 h-6 text-green-600" />
//                   </div>
//                   <div>
//                     <div className="font-semibold">Live Tracking</div>
//                     <div className="text-sm text-muted-foreground">Real-time updates</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       {/* Features Section */}
//       <section className="py-20">
//         <div className="container px-4 mx-auto">
//           <div className="mb-16 text-center">
//             <h2 className="mb-4 text-3xl font-bold lg:text-4xl">Why Choose Cabro?</h2>
//             <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
//               Experience the difference with our premium features
//             </p>
//           </div>
//           <div className="grid gap-8 mb-16 md:grid-cols-3">
//             {features.map((feature) => (
//               <Card key={feature.title} className="transition-shadow hover:shadow-lg">
//                 <CardHeader>
//                   <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-primary/10">
//                     <feature.icon className="w-6 h-6 text-primary" />
//                   </div>
//                   <CardTitle>{feature.title}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-muted-foreground">{feature.description}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;
