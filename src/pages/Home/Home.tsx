import LocationSearch from '@/components/RideBooking/LocationSearch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import type { ILocation } from '@/redux/features/rides/ride.api';

import { reverseGeocode } from '@/services/mockLocationService';
import { Car, Check, ChevronRight, Clock, MapPin, Shield, Star, Users } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const { toast } = useToast();
  const features = [
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Advanced safety features including real-time tracking and emergency SOS',
    },
    {
      icon: Clock,
      title: 'Quick & Reliable',
      description: 'Get rides within minutes with our extensive network of drivers',
    },
    {
      icon: Star,
      title: 'Highly Rated',
      description: 'Top-rated drivers ensuring quality service every time',
    },
  ];

  const services = [
    {
      title: 'For Riders',
      description: 'Book rides instantly with transparent pricing and real-time tracking',
      image: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      title: 'For Drivers',
      description: 'Earn flexible income with our driver-friendly platform and tools',
      image: 'https://images.pexels.com/photos/1319743/pexels-photo-1319743.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      title: 'For Business',
      description: 'Corporate solutions for employee transportation and logistics',
      image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Daily Commuter',
      content: 'Cabro has made my daily commute so much easier. The drivers are professional and the app is incredibly user-friendly.',
      rating: 5,
    },
    {
      name: 'Mike Chen',
      role: 'Driver Partner',
      content: 'As a driver, I appreciate the fair pricing and the support from Cabro. It provides a steady income source.',
      rating: 5,
    },
    {
      name: 'Emily Davis',
      role: 'Business User',
      content: 'Our company uses Cabro for client pickups. The corporate features are excellent and billing is transparent.',
      rating: 5,
    },
  ];

  const pricingTiers = [
    {
      name: 'Economy',
      description: 'Affordable rides for everyday travel',
      basePrice: '$2.50',
      perKm: '$0.80',
      features: ['Standard vehicles', 'Basic safety features', 'In-app support'],
    },
    {
      name: 'Comfort',
      description: 'Premium vehicles for comfortable rides',
      basePrice: '$3.50',
      perKm: '$1.20',
      features: ['Premium vehicles', 'Enhanced comfort', 'Priority booking'],
      popular: true,
    },
    {
      name: 'Business',
      description: 'Professional service for business travel',
      basePrice: '$5.00',
      perKm: '$1.80',
      features: ['Luxury vehicles', 'Professional drivers', 'Receipt management'],
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container px-4 mx-auto">
          <div className="grid items-center gap-12 lg:grid-cols-[50%_50%]">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold leading-tight lg:text-6xl">
                  Your Ride,
                  <span className="text-primary"> Simplified</span>
                </h1>
                <p className="text-xl leading-relaxed text-muted-foreground">
                  Affordable, reliable, and trusted rides at your fingertips — anytime, anywhere.
                </p>
              </div>
             
              {/* Ride Booking */}
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
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Cabro App"
                className="shadow-2xl rounded-2xl"
              />
              <div className="absolute p-4 bg-white shadow-lg -bottom-6 -left-6 dark:bg-card rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full dark:bg-green-900">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-black">Live Tracking</div>
                    <div className="text-sm text-black text-muted-foreground ">Real-time updates</div>
                  </div>
                </div>
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

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">How Cabro Works</h2>
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
              Getting your ride is simple and straightforward
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Request a Ride',
                description: 'Enter your pickup and destination locations in the app',
                icon: MapPin,
              },
              {
                step: '02', 
                title: 'Get Matched',
                description: 'We connect you with a nearby verified driver instantly',
                icon: Users,
              },
              {
                step: '03',
                title: 'Enjoy Your Ride',
                description: 'Track your ride in real-time and pay securely through the app',
                icon: Car,
              },
            ].map((item) => (
              <Card key={item.step} className="text-center transition-shadow hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="mb-2 text-sm font-semibold text-primary">{item.step}</div>
                  <h3 className="mb-4 text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">Why Choose Cabro?</h2>
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
              Experience the difference with our premium features
            </p>
          </div>
          <div className="grid gap-8 mb-16 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-primary/10">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">Our Services</h2>
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
              Tailored solutions for every transportation need
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service) => (
              <Card key={service.title} className="overflow-hidden transition-shadow hover:shadow-lg">
                <div className="overflow-hidden aspect-video">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">{service.description}</p>
                  <Button variant="ghost" className="h-auto p-0">
                    Learn More
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">What Our Users Say</h2>
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
              Hear from our satisfied riders and drivers
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-6 italic text-muted-foreground">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-full bg-primary/10">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">Transparent Pricing</h2>
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
              Choose the ride type that fits your needs and budget
            </p>
          </div>

          <div className="grid max-w-5xl gap-8 mx-auto md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <Card key={tier.name} className={`hover:shadow-lg transition-shadow ${tier.popular ? 'ring-2 ring-primary' : ''}`}>
                {tier.popular && (
                  <div className="py-2 text-sm font-semibold text-center bg-primary text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <p className="text-muted-foreground">{tier.description}</p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{tier.basePrice}</span>
                    <span className="text-muted-foreground"> base + {tier.perKm}/km</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="w-4 h-4 mr-3 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant={tier.popular ? 'default' : 'outline'}>
                    Choose {tier.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl">Ready to Get Started?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-xl opacity-90">
            Join millions of users who trust Cabro for their daily transportation needs
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" className="px-8 py-6 text-lg" asChild>
              <Link to="/start-ride">
                <Car className="w-5 h-5 mr-2" />
                Start Riding
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg text-white border-white hover:bg-white hover:text-primary" asChild>
              <Link to="/driver">
                <Users className="w-5 h-5 mr-2" />
                Become a Driver
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;