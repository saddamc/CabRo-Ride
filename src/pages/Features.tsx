import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Clock, CreditCard, MapPin, Phone, Settings, Shield, Star, Users, Zap } from 'lucide-react';

export default function Features() {
  const riderFeatures = [
    {
      icon: MapPin,
      title: 'Smart Pickup & Drop-off',
      description: 'Advanced location detection and precise pickup points for seamless rides.',
    },
    {
      icon: Clock,
      title: 'Real-time Tracking',
      description: 'Track your driver in real-time with accurate ETA and route information.',
    },
    {
      icon: CreditCard,
      title: 'Multiple Payment Options',
      description: 'Pay with credit cards, digital wallets, or cash. Automatic receipts included.',
    },
    {
      icon: Shield,
      title: 'Safety Features',
      description: 'Emergency SOS, ride sharing, and verified driver information for peace of mind.',
    },
    {
      icon: Star,
      title: 'Rate & Review',
      description: 'Rate drivers and provide feedback to maintain service quality.',
    },
    {
      icon: Phone,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for any issues or questions.',
    },
  ];

  const driverFeatures = [
    {
      icon: BarChart3,
      title: 'Earnings Dashboard',
      description: 'Comprehensive earnings tracking with daily, weekly, and monthly insights.',
    },
    {
      icon: Settings,
      title: 'Flexible Schedule',
      description: 'Set your own hours and work when it suits you best.',
    },
    {
      icon: Zap,
      title: 'Instant Notifications',
      description: 'Receive ride requests instantly with smart matching algorithms.',
    },
    {
      icon: MapPin,
      title: 'Navigation Integration',
      description: 'Built-in GPS navigation with optimal route suggestions.',
    },
    {
      icon: Users,
      title: 'Driver Community',
      description: 'Connect with other drivers and access exclusive resources.',
    },
    {
      icon: Shield,
      title: 'Driver Protection',
      description: 'Comprehensive insurance coverage and safety protocols.',
    },
  ];

  const adminFeatures = [
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Real-time analytics on rides, revenue, and platform performance.',
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Comprehensive user and driver management with verification tools.',
    },
    {
      icon: Settings,
      title: 'Platform Configuration',
      description: 'Configure pricing, regions, and platform settings dynamically.',
    },
    {
      icon: Shield,
      title: 'Safety Monitoring',
      description: 'Monitor safety incidents and implement preventive measures.',
    },
    {
      icon: Clock,
      title: 'Real-time Monitoring',
      description: 'Live monitoring of active rides and platform health metrics.',
    },
    {
      icon: Phone,
      title: 'Support Management',
      description: 'Manage customer support tickets and communication channels.',
    },
  ];

  const safetyFeatures = [
    'Real-time ride tracking and sharing',
    'Emergency SOS button with instant alerts',
    'Driver background verification',
    'In-app emergency contacts',
    '24/7 safety monitoring center',
    'Ride recording and incident reporting',
    'Insurance coverage for all rides',
    'Safety tips and guidelines',
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Platform Features</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the comprehensive features that make Cabro the perfect choice 
            for riders, drivers, and platform administrators.
          </p>
        </section>

        {/* Feature Tabs */}
        <Tabs defaultValue="rider" className="mb-16">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="rider">For Riders</TabsTrigger>
            <TabsTrigger value="driver">For Drivers</TabsTrigger>
            <TabsTrigger value="admin">For Admins</TabsTrigger>
            <TabsTrigger value="safety">Safety First</TabsTrigger>
          </TabsList>

          <TabsContent value="rider" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Rider Experience</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need for a smooth, safe, and convenient ride experience.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {riderFeatures.map((feature) => (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="driver" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Driver Tools</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Powerful tools and features designed to help drivers succeed and earn more.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {driverFeatures.map((feature) => (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive platform management tools for efficient operations and growth.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {adminFeatures.map((feature) => (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="safety" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Safety & Security</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your safety is our top priority. We've implemented comprehensive security measures.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="https://images.pexels.com/photos/5473177/pexels-photo-5473177.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Safety Features"
                  className="rounded-2xl shadow-xl"
                />
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-600">
                      <Shield className="w-6 h-6 mr-3" />
                      Comprehensive Safety Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {safetyFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Technology Stack */}
        <section className="bg-muted/30 rounded-2xl p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Built with Modern Technology</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform is powered by cutting-edge technology for optimal performance and reliability.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              'Real-time GPS',
              'AI Matching',
              'Cloud Infrastructure',
              'Mobile Apps',
              'Payment Gateway',
              'Analytics Engine',
            ].map((tech) => (
              <div key={tech} className="text-center">
                <Badge variant="outline" className="px-4 py-2 text-sm">
                  {tech}
                </Badge>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Experience These Features Today</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already enjoying the benefits of our comprehensive platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Start as a Rider</h3>
                <p className="text-sm text-muted-foreground">Book your first ride today</p>
              </div>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center">
                <Settings className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Become a Driver</h3>
                <p className="text-sm text-muted-foreground">Start earning with flexible hours</p>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}