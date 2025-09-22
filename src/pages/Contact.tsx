import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call with requestAnimationFrame to avoid performance warnings
    requestAnimationFrame(() => {
      setTimeout(() => {
        toast.success('Thank you! Your message has been sent successfully.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          category: '',
        });
        setIsSubmitting(false);
      }, 1500);
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Support',
      details: '+1 (555) 123-4567',
      subDetails: 'Mon-Sun: 24/7 Available',
    },
    {
      icon: Mail,
      title: 'Email Support',
      details: 'support@cabro.com',
      subDetails: 'We reply within 2 hours',
    },
    {
      icon: MapPin,
      title: 'Office Location',
      details: '123 Business Street',
      subDetails: 'New York, NY 10001',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Mon-Fri: 9:00 AM - 6:00 PM',
      subDetails: 'Emergency support 24/7',
    },
  ];

  const faqs = [
    {
      question: 'How do I book a ride?',
      answer: 'Simply enter your pickup and destination locations in the app, choose your preferred ride type, and confirm your booking.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept credit/debit cards, digital wallets (Apple Pay, Google Pay), and cash payments.',
    },
    {
      question: 'How do I become a driver?',
      answer: 'Apply through our driver portal, submit required documents, pass background check, and attend orientation.',
    },
    {
      question: 'Is there a cancellation fee?',
      answer: 'Cancellation is free within 5 minutes of booking. After that, a small fee may apply depending on the situation.',
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container px-4 mx-auto">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-bold lg:text-5xl">Get in Touch</h1>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
            Have questions or need help? We're here to assist you. Reach out to our friendly support team.
          </p>
        </section>

        <div className="grid gap-12 mb-16 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select onValueChange={handleSelectChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="driver">Driver Application</SelectItem>
                          <SelectItem value="safety">Safety Concern</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Brief subject of your message"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please describe your inquiry or concern in detail..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start space-x-4">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{info.title}</h3>
                      <p className="text-muted-foreground">{info.details}</p>
                      <p className="text-sm text-muted-foreground">{info.subDetails}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">
                  Emergency Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-red-600 dark:text-red-400">
                  For urgent safety concerns or emergencies during rides:
                </p>
                <Button variant="destructive" size="sm" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Emergency: 911
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Quick answers to common questions. Can't find what you're looking for? Contact us!
            </p>
          </div>

          <div className="grid max-w-6xl gap-8 mx-auto md:grid-cols-2">
            {faqs.map((faq, index) => (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <h3 className="flex items-start mb-3 font-semibold">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    {faq.question}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground ml-7">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Map Section (Placeholder) */}
        <section>
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-center h-64 rounded-lg bg-muted/30">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="mb-2 font-semibold">Visit Our Office</h3>
                  <p className="text-muted-foreground">
                    123 Business Street, New York, NY 10001
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}