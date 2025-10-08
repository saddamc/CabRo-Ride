import LocationSearch from '@/components/RideBooking/LocationSearch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import type { ILocation } from '@/redux/features/rides/ride.api';

import { reverseGeocode } from '@/services/mockLocationService';
import { Car, Clock, MapPin, Shield, Star, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const { toast } = useToast();
  
  // Add custom CSS to head
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .bg-grid-pattern {
        background-image: radial-gradient(currentColor 1px, transparent 1px);
        background-size: 30px 30px;
      }
      
      @keyframes pulse-slow {
        0% { transform: scale(1); }
        50% { transform: scale(1.03); }
        100% { transform: scale(1); }
      }
      
      .animate-pulse-slow {
        animation: pulse-slow 3s infinite ease-in-out;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const features = [
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Advanced safety features including real-time tracking, verified drivers, and emergency SOS button in every ride',
    },
    {
      icon: Clock,
      title: 'Quick & Reliable',
      description: 'Get rides within minutes with our extensive network of drivers across Dhaka and major cities',
    },
    {
      icon: Star,
      title: 'Highly Rated',
      description: 'Our strict quality control ensures only top-rated drivers with excellent service records serve you',
    },
  ];

  // No longer needed as we're using inline service definitions
  // const services = [
  //   {
  //     title: 'For Riders',
  //     description: 'Book rides instantly with transparent pricing, real-time tracking, and multiple payment options including cash, mobile banking, and cards',
  //     image: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=400',
  //   },
  //   {
  //     title: 'For Drivers',
  //     description: 'Join our network to earn flexible income with our driver-friendly platform, fair commission rates, and weekly incentives',
  //     image: 'https://images.pexels.com/photos/1319743/pexels-photo-1319743.jpeg?auto=compress&cs=tinysrgb&w=400',
  //   },
  //   {
  //     title: 'For Business',
  //     description: 'Comprehensive corporate solutions for employee transportation, client pickups, and logistics with detailed reporting and centralized billing',
  //     image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400',
  //   },
  // ];

  const testimonials = [
    {
      name: 'Farhan Ahmed',
      role: 'Daily Commuter',
      content: 'Cabro has transformed my daily commute in Dhaka traffic. The drivers are professional and the app is incredibly easy to use even during rush hour.',
      rating: 5,
    },
    {
      name: 'Rashid Khan',
      role: 'Driver Partner',
      content: 'As a driver in Dhaka, I appreciate the fair pricing and continuous support from Cabro. It has become my reliable source of income through all seasons.',
      rating: 5,
    },
    {
      name: 'Samira Rahman',
      role: 'Business User',
      content: 'Our company relies on Cabro for client transportation across Dhaka. The corporate features make expense tracking simple and the billing is completely transparent.',
      rating: 5,
    },
  ];

  const pricingTiers = [
    {
      name: 'Economy',
      description: 'Affordable rides for everyday travel',
      basePrice: '৳120',
      perKm: '৳20',
      features: ['Standard vehicles', 'Basic safety features', 'In-app support', 'Cash & digital payment'],
    },
    {
      name: 'Comfort',
      description: 'Premium vehicles for comfortable rides',
      basePrice: '৳180',
      perKm: '৳30',
      features: ['Premium vehicles', 'Enhanced comfort', 'Priority booking', 'Free WiFi'],
      popular: true,
    },
    {
      name: 'Business',
      description: 'Professional service for business travel',
      basePrice: '৳250',
      perKm: '৳40',
      features: ['Luxury vehicles', 'Professional drivers', 'Receipt management', 'Corporate billing'],
    },
  ];

  // Local state for LocationSearch props
  const [pickupLocation, setPickupLocation] = useState<ILocation | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<ILocation | null>(null);
  const [pickupInput, setPickupInput] = useState<string>("");
  const [destinationInput, setDestinationInput] = useState<string>("");

  // Handlers for LocationSearch
  const handlePickupInputChange = (value: string) => setPickupInput(value);
  const handleDestinationInputChange = (value: string) => setDestinationInput(value);
  const handlePickupSelect = (location: ILocation) => {
    setPickupLocation(location);
    setPickupInput(location.address);
  };
  const handleDestinationSelect = (location: ILocation) => {
    setDropoffLocation(location);
    setDestinationInput(location.address);
  };
  const handleGetCurrentLocation = async (isPickup: boolean) => {
    if (!isPickup) return; // Only handle pickup for now

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          const locationData = reverseGeocode(latitude, longitude);
          setPickupLocation(locationData);
          setPickupInput(locationData.address);
        }, (error) => {
          toast({
            title: 'Geolocation error',
            description: error.message,
            variant: 'destructive',
          });
        });
      } else {
        toast({
          title: 'Geolocation not supported',
          description: 'Your browser does not support geolocation',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error getting location',
        description: 'Could not determine your current location',
        variant: 'destructive',
      });
    }
  };
  const navigate = useNavigate();
  const handleSeeDetails = () => {
    if (pickupLocation && dropoffLocation) {
      navigate('/ride', {
        state: {
          pickupLocation,
          dropoffLocation
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Uber-style */}
      <section className="relative bg-black text-white">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.uber-assets.com/image/upload/v1613106985/assets/0e/47aa71-35cb-459a-a975-78c61ea300e2/original/HP-U4B-NYC-bkg.png')] bg-cover bg-center opacity-50"></div>
        
        <div className="container mx-auto px-4 py-16 lg:py-28 relative z-10">
          <div className="grid lg:grid-cols-[45%_55%] gap-10 items-center">
            <div className="bg-white text-black p-6 rounded-xl shadow-xl">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2 text-black">Go anywhere with Cabro</h1>
                <p className="text-gray-600">Request a ride, hop in, and go.</p>
              </div>
              
              {/* Uber-style tab selector */}
              <div className="flex border-b mb-6">
                <button className="py-3 px-5 font-medium border-b-2 border-black">
                  Ride
                </button>
                <button className="py-3 px-5 text-gray-500 font-medium">
                  Drive
                </button>
              </div>
              
              {/* Simplified booking form */}
              <div className="bg-white rounded-lg">
                <LocationSearch
                  pickupLocation={pickupLocation}
                  dropoffLocation={dropoffLocation}
                  pickupInput={pickupInput}
                  destinationInput={destinationInput}
                  onPickupInputChange={handlePickupInputChange}
                  onDestinationInputChange={handleDestinationInputChange}
                  onPickupSelect={handlePickupSelect}
                  onDestinationSelect={handleDestinationSelect}
                  onGetCurrentLocation={handleGetCurrentLocation}
                  onSeeDetails={handleSeeDetails}
                  userRole={undefined}
                />
              </div>
            </div>
            
            <div className="text-white">
              <h2 className="text-5xl font-bold mb-6 leading-tight">The destination for <br />on-demand transportation</h2>
              <p className="text-xl mb-8 opacity-90">Fast, reliable rides at your fingertips — anytime, anywhere in Bangladesh.</p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-white !text-black hover:bg-gray-100">
                  <Users className="w-5 h-5 mr-2 text-black" />
                  Sign up to drive
                </Button>
                <Link to="/about" className="inline-block ">
                <Button size="lg" className="bg-black !text-white border border-white hover:bg-gray-900 cursor-pointer" variant="outline">
                  <Car className="w-5 h-5 mr-2 text-white" />
                  Learn more
                </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Backend Connection Test */}
      {/* <section className="py-10 bg-muted/50">
        <div className="container px-4 mx-auto">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold">Backend Connection Test</h2>
            <p className="text-muted-foreground">Test your connection to the MongoDB backend</p>
          </div>
          <BackendConnectionTest />
        </div>
      </section> */}

      {/* Sustainable Transport Section */}
      <section className="py-16 bg-black text-white">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Ride Green with Cabro</h2>
              <p className="text-xl mb-8 text-gray-100">
                Join our eco-friendly initiative to reduce carbon footprints with shared rides and electric vehicle options.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04L12 21.044l9.618-13.06A11.955 11.955 0 0112 2.944z" />
                    </svg>
                  </div>
                  <p className="text-lg">30% lower emissions with our shared ride options</p>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-lg">Growing fleet of electric and hybrid vehicles</p>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <p className="text-lg">Carbon offset program for every ride you take</p>
                </div>
              </div>
              <div className="mt-8">
                <Button size="lg" className="bg-white !text-green-800 hover:bg-gray-100">
                  Learn about our green initiatives
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center md:justify-end">
              <img 
                src="https://images.pexels.com/photos/3912911/pexels-photo-3912911.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Electric car charging" 
                className="rounded-lg shadow-lg w-full max-w-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=800";
                }}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works - Simplified Uber-style */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-black">How Cabro works</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Request a ride',
                description: 'Choose your pickup and destination and select from economy, premium, or business options.',
                icon: MapPin,
              },
              {
                title: 'Match with a driver',
                description: 'We\'ll match you with the closest available driver in just seconds.',
                icon: Users,
              },
              {
                title: 'Track your trip',
                description: 'Watch your driver arrive in real-time and monitor your journey to the destination.',
                icon: Car,
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col">
                <div className="mb-5 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-black">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ride Options - Uber style */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-black">Ways to ride with Cabro</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-5 h-60 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src="./car-regular.png" 
                  alt="Regular Ride" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800";
                  }}
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">Cabro Economy</h3>
              <p className="text-gray-600 mb-4">Affordable rides for everyday travel</p>
              <Link to="/about" className="inline-block ">
                <Button size="lg" className="bg-black text-white border border-white hover:bg-gray-900 cursor-pointer" variant="outline">
                  <Car className="w-5 h-5 mr-2" />
                  Learn more
                </Button>
                </Link>
            </div>
            
            <div>
              <div className="mb-5 h-60 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src="./car-premium.png" 
                  alt="Premium Ride" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800";
                  }}
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Cabro Premium</h3>
              <p className="text-gray-600 mb-4">Premium vehicles for comfortable rides</p>
              <Link to="/about" className="inline-block ">
                <Button size="lg" className="bg-black text-white border border-white hover:bg-gray-900 cursor-pointer" variant="outline">
                  <Car className="w-5 h-5 mr-2" />
                  Learn more
                </Button>
                </Link>
            </div>
            
            <div>
              <div className="mb-5 h-60 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src="./car-luxury.png" 
                  alt="Luxury Ride" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=800";
                  }}
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Cabro Business</h3>
              <p className="text-gray-600 mb-4">Luxury vehicles for professional service</p>
              <Link to="/about" className="inline-block ">
                <Button size="lg" className="bg-black text-white border border-white hover:bg-gray-900 cursor-pointer" variant="outline">
                  <Car className="w-5 h-5 mr-2" />
                  Learn more
                </Button>
                </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features - Simplified Uber-style */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="mb-10">
            <h2 className="text-4xl font-bold mb-2 text-black">Focused on safety, wherever you go</h2>
            <p className="text-xl text-gray-600">
              Your safety matters to us—before, during, and after every trip.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title}>
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-gray-200">
                  <feature.icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-black">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services - Uber-style */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-black">Cabro for every need</h2>
          
          <div className="grid gap-16 md:grid-cols-2">
            {[
              {
                title: "Business travel",
                description: "Manage employee travel with easy expense tracking and corporate billing solutions.",
                image: "https://images.pexels.com/photos/4825701/pexels-photo-4825701.jpeg?auto=compress&cs=tinysrgb&w=600",
              },
              {
                title: "Airport transfers",
                description: "Get to and from airports with ease with pre-scheduled rides and luggage assistance.",
                image: "https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=600",
              },
            ].map((service) => (
              <div key={service.title} className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2 h-64 md:h-auto">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="object-cover w-full h-full rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600";
                    }}
                  />
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold mb-3 text-black">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link to="/about" className="inline-block ">
                <Button size="lg" className="bg-black !text-white border cursor-pointer border-white hover:bg-gray-900" variant="outline">
                  <Car className="w-5 h-5 mr-2 text-white" />
                  Learn more
                </Button>
                </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Uber-style */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4 text-black">Millions of passengers, thousands of drivers</h2>
            <p className="text-xl text-gray-600">
              See what people are saying about their Cabro experiences
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-black fill-black" />
                  ))}
                </div>
                <p className="mb-6 text-gray-600">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-full bg-gray-200">
                    <span className="text-sm font-medium text-black">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-medium text-black">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fare Estimate - Uber-style */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-black">Know your fare before booking</h2>
              <p className="text-xl mb-8 text-gray-600">
                Upfront pricing gives you peace of mind with transparent rates for every journey.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">FROM</h3>
                    <p className="font-medium text-black">Gulshan, Dhaka</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">TO</h3>
                    <p className="font-medium text-black">Dhanmondi, Dhaka</p>
                  </div>
                </div>
                <hr className="my-4" />
                <div className="space-y-4">
                  {pricingTiers.map((tier) => (
                    <div key={tier.name} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <Car className="w-6 h-6 text-black" />
                        </div>
                        <div>
                          <h4 className="font-medium text-black">{tier.name}</h4>
                          <p className="text-sm text-gray-500">15 mins</p>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-black">
                        {tier.basePrice} - {tier.basePrice.replace('৳', '৳')}50
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Prices may vary depending on traffic, weather, and demand. Final fare will be confirmed before your ride begins.
              </p>
            </div>
            
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/1474465/pexels-photo-1474465.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Cabro fare estimate" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Driver Benefits Section */}
      <section className="py-16 bg-black text-white">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="md:order-2">
              <Link to="/login">
                <h2 className="text-4xl font-bold cursor-pointer mb-6">Driver Rewards Program</h2>
              </Link>
              <p className="text-xl mb-6 text-gray-200">
                Join Cabro's exclusive rewards program designed to appreciate our hardworking drivers.
              </p>
              <div className="mb-8 space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Weekly Bonuses</h3>
                    <p className="text-gray-200">Earn extra for completing a set number of rides per week with our tiered bonus structure.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Health Benefits</h3>
                    <p className="text-gray-200">Access to special health insurance packages and medical checkups for our regular drivers.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Fuel Discounts</h3>
                    <p className="text-gray-200">Special partnerships with fuel stations across the city for exclusive discounts to Cabro drivers.</p>
                  </div>
                </div>
              </div>
              <Button size="lg" className="bg-white !text-indigo-900 hover:bg-gray-100 cursor-pointer" asChild>
                <Link to="/driver">Join as a Driver</Link>
              </Button>
            </div>
            
            <div className="md:order-1">
              <img 
                src="https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Professional Cabro driver" 
                className="rounded-lg shadow-lg w-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800";
                }}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer Banner - Uber-style */}
      <section className="bg-gray-50 py-12">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-black">Ready to ride with Cabro?</h2>
              <p className="text-gray-600">Get a ride in minutes.</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
              <Link to="/ride" className="inline-block">
              <Button size="lg" className="bg-black !text-white hover:bg-gray-900 cursor-pointer">
                <Car className="w-5 h-5 mr-2 text-white" />
                Get a ride
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;