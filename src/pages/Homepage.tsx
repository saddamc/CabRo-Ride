import HeroSection from "@/components/modules/home/HeroSection";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, DollarSign, MapPin, Shield, Smartphone, Star } from "lucide-react";

const features = [
  {
    icon: <MapPin className="h-10 w-10 text-primary" />,
    title: "Easy Pickup",
    description: "Request a ride and get picked up within minutes, at your doorstep or any location you choose."
  },
  {
    icon: <Clock className="h-10 w-10 text-primary" />,
    title: "Fast & Reliable",
    description: "Arrive on time, every time. Our drivers are professional and punctual."
  },
  {
    icon: <DollarSign className="h-10 w-10 text-primary" />,
    title: "Affordable Rates",
    description: "Transparent pricing with no hidden fees. Pay only for the distance you travel."
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Safe Rides",
    description: "All our drivers are verified and trained. Your safety is our top priority."
  },
  {
    icon: <Star className="h-10 w-10 text-primary" />,
    title: "Quality Service",
    description: "Enjoy a premium ride experience with well-maintained vehicles and professional drivers."
  },
  {
    icon: <Smartphone className="h-10 w-10 text-primary" />,
    title: "Easy Booking",
    description: "Book and manage your rides with our intuitive mobile app. Track your driver in real-time."
  }
];

export default function Homepage() {
    return (
        <div className="bg-white">
            <HeroSection />
            
            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Ride Service</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="mb-4 p-3 rounded-full bg-primary/10">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* How It Works Section */}
            <section className="py-20">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <div className="text-center max-w-xs">
                            <div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mb-4">1</div>
                            <h3 className="text-xl font-semibold mb-2">Set Your Pickup</h3>
                            <p className="text-gray-600">Enter your pickup location and destination to find available rides.</p>
                        </div>
                        <div className="text-center max-w-xs">
                            <div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mb-4">2</div>
                            <h3 className="text-xl font-semibold mb-2">Choose Your Ride</h3>
                            <p className="text-gray-600">Select from economy, premium, or luxury rides based on your preference.</p>
                        </div>
                        <div className="text-center max-w-xs">
                            <div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mb-4">3</div>
                            <h3 className="text-xl font-semibold mb-2">Enjoy Your Ride</h3>
                            <p className="text-gray-600">Get picked up by your driver and reach your destination safely and comfortably.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Footer CTA */}
            <section className="py-16 bg-primary/10">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready for Your Next Ride?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Download our app today and experience the most convenient way to travel around the city.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-black text-white px-8 py-3 rounded-lg flex items-center justify-center hover:bg-gray-800 transition">
                            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.0703 13.3287L14.3548 15.085L11.735 12.4606L14.3548 9.83637L17.0703 11.5925C17.7228 12.0345 17.7228 12.8869 17.0703 13.3287Z"></path>
                                <path d="M6.94995 8.9541L10.6208 12.4607L6.94995 15.9674L3.92963 13.1639V9.75767L6.94995 8.9541Z"></path>
                                <path d="M10.6209 12.4606L6.95003 8.95422L11.7353 6.13812L14.3551 9.83631L10.6209 12.4606Z"></path>
                                <path d="M10.6208 12.4606L14.3549 15.085L11.7352 18.783L6.94995 15.9673L10.6208 12.4606Z"></path>
                            </svg>
                            Play Store
                        </button>
                        <button className="bg-black text-white px-8 py-3 rounded-lg flex items-center justify-center hover:bg-gray-800 transition">
                            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09998 22C7.78998 22.05 6.79998 20.68 5.95998 19.47C4.25998 17 2.94998 12.45 4.70998 9.39C5.57998 7.87 7.12998 6.91 8.81998 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.09 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"></path>
                            </svg>
                            App Store
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}