import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Globe, Heart, Shield, Target, Users } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Your safety is our top priority with advanced security features and verified drivers.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'We build strong communities by connecting riders and drivers in meaningful ways.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Expanding worldwide to make transportation accessible to everyone, everywhere.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to delivering the highest quality service and user experience.',
    },
  ];

  const team = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Visionary leader with 15+ years in transportation technology.',
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Technology expert driving innovation in ride-sharing solutions.',
    },
    {
      name: 'Marcus Williams',
      role: 'Head of Operations',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Operations specialist ensuring smooth platform performance.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Safety',
      image: 'https://images.pexels.com/photos/3756941/pexels-photo-3756941.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Safety advocate implementing comprehensive security measures.',
    },
  ];

  const milestones = [
    { year: '2020', event: 'Cabro Founded', description: 'Started with a vision to revolutionize transportation' },
    { year: '2021', event: '10K+ Drivers', description: 'Reached our first major milestone of driver partners' },
    { year: '2022', event: '1M+ Rides', description: 'Completed our millionth successful ride' },
    { year: '2023', event: 'Global Expansion', description: 'Launched in 50+ cities worldwide' },
    { year: '2024', event: 'Safety Innovation', description: 'Introduced advanced AI-powered safety features' },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">About Cabro</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make transportation accessible, safe, and convenient for everyone. 
            Since 2020, we've been connecting riders and drivers, building communities, and 
            transforming how people move around their cities.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Our Mission"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div className="space-y-8">
              <div>
                <div className="flex items-center mb-4">
                  <Target className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold">Our Mission</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To provide safe, reliable, and affordable transportation solutions that connect 
                  communities and empower individuals to move freely and confidently in their daily lives.
                </p>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <Heart className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold">Our Vision</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To be the world's most trusted transportation platform, fostering sustainable 
                  mobility solutions that bring people together while reducing environmental impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do and shape our company culture
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <Card key={value.title} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Passionate individuals working together to revolutionize transportation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <Card key={member.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="mb-4">{member.role}</Badge>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Milestones */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Key milestones that shaped our growth and success
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone) => (
              <div key={milestone.year} className="flex items-center mb-8 last:mb-0">
                <div className="flex-shrink-0 w-24 text-right mr-8">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {milestone.year}
                  </Badge>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-primary rounded-full mr-8"></div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{milestone.event}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-muted/30 rounded-2xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Cabro by Numbers</h2>
            <p className="text-xl text-muted-foreground">
              Our impact in numbers speaks for itself
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10M+', label: 'Total Rides' },
              { value: '500K+', label: 'Active Users' },
              { value: '100K+', label: 'Driver Partners' },
              { value: '200+', label: 'Cities Served' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}