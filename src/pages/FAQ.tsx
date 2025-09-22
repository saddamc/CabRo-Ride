import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { HelpCircle, Search } from 'lucide-react';
import { useState } from 'react';

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      category: 'Getting Started',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      faqs: [
        {
          question: 'How do I create a Cabro account?',
          answer: 'You can create an account by downloading our mobile app or visiting our website. Simply enter your phone number, verify with the OTP, and complete your profile with basic information.',
        },
        {
          question: 'Is Cabro available in my city?',
          answer: 'Cabro operates in over 200 cities worldwide. You can check availability by entering your location in the app or on our website\'s city list page.',
        },
        {
          question: 'What documents do I need to get started?',
          answer: 'For riders, you only need a valid phone number. For drivers, you\'ll need a valid driver\'s license, vehicle registration, insurance proof, and background check clearance.',
        },
      ],
    },
    {
      category: 'Booking & Rides',
      color: 'bg-green-100 text-green-800 border-green-200',
      faqs: [
        {
          question: 'How do I book a ride?',
          answer: 'Open the app, enter your pickup and destination, choose your ride type, and confirm. You\'ll be matched with a nearby driver within minutes.',
        },
        {
          question: 'Can I schedule a ride in advance?',
          answer: 'Yes! You can schedule rides up to 7 days in advance. Select "Schedule" when booking and choose your preferred date and time.',
        },
        {
          question: 'How is the fare calculated?',
          answer: 'Fares are calculated based on base rate, time, distance, and demand. You\'ll see the estimated fare before confirming your ride, with no hidden charges.',
        },
        {
          question: 'Can I change my destination during the ride?',
          answer: 'Yes, you can update your destination through the app during the ride. The fare will be adjusted accordingly and shown in real-time.',
        },
      ],
    },
    {
      category: 'Payments',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      faqs: [
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept credit/debit cards, digital wallets (Apple Pay, Google Pay), PayPal, and cash in select cities.',
        },
        {
          question: 'When is my card charged?',
          answer: 'Your card is charged immediately after the ride is completed. You\'ll receive a receipt via email and in the app.',
        },
        {
          question: 'How do I add or update payment methods?',
          answer: 'Go to Profile > Payment Methods in the app. You can add, remove, or set a default payment method anytime.',
        },
        {
          question: 'What if there\'s an issue with my payment?',
          answer: 'Contact our support team through the app or website. We\'ll help resolve payment issues and provide refunds when applicable.',
        },
      ],
    },
    {
      category: 'Safety & Security',
      color: 'bg-red-100 text-red-800 border-red-200',
      faqs: [
        {
          question: 'How does Cabro ensure my safety?',
          answer: 'We conduct thorough background checks on drivers, provide real-time tracking, emergency SOS buttons, and 24/7 safety monitoring.',
        },
        {
          question: 'What should I do in an emergency?',
          answer: 'Use the SOS button in the app to immediately alert emergency services and your emergency contacts. You can also call local emergency numbers.',
        },
        {
          question: 'How can I share my ride details with family?',
          answer: 'Use the "Share Trip" feature to send real-time location and ride details to your contacts. They can track your journey live.',
        },
        {
          question: 'What if I feel unsafe during a ride?',
          answer: 'Trust your instincts. Use the SOS button, ask the driver to end the trip, or call emergency services. Report the incident through the app.',
        },
      ],
    },
    {
      category: 'Driver Information',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      faqs: [
        {
          question: 'How do I become a Cabro driver?',
          answer: 'Apply through our driver portal, submit required documents, pass background and vehicle inspections, and complete online training.',
        },
        {
          question: 'What are the vehicle requirements?',
          answer: 'Vehicles must be 2010 or newer, pass safety inspection, have valid registration and insurance, and meet city-specific requirements.',
        },
        {
          question: 'How much can I earn as a driver?',
          answer: 'Earnings vary by city, hours worked, and demand. Drivers keep 80% of fares plus tips. Check our driver portal for local earning estimates.',
        },
        {
          question: 'Can I drive part-time?',
          answer: 'Absolutely! Cabro offers complete flexibility. Drive whenever you want, wherever you want, for as long as you want.',
        },
      ],
    },
    {
      category: 'Technical Support',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      faqs: [
        {
          question: 'The app is not working properly. What should I do?',
          answer: 'Try restarting the app, checking your internet connection, or updating to the latest version. Contact support if issues persist.',
        },
        {
          question: 'How do I update my app?',
          answer: 'Visit your device\'s app store (Apple App Store or Google Play Store) and check for Cabro updates. Enable auto-updates for convenience.',
        },
        {
          question: 'I can\'t find my driver. What should I do?',
          answer: 'Check the real-time map in the app, call your driver directly, or use the "Find My Driver" feature. Contact support if needed.',
        },
        {
          question: 'How do I report a technical issue?',
          answer: 'Go to Profile > Help & Support > Report Issue in the app, or contact our technical support team through the website.',
        },
      ],
    },
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(
      faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Find quick answers to common questions about Cabro. 
            Still need help? Our support team is here for you 24/7.
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-base"
            />
          </div>
        </section>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto">
          {searchTerm && (
            <div className="mb-8">
              <p className="text-muted-foreground">
                {filteredFAQs.reduce((total, category) => total + category.faqs.length, 0)} 
                {' '}results found for "{searchTerm}"
              </p>
            </div>
          )}

          {filteredFAQs.map((category) => (
            <div key={category.category} className="mb-12">
              <div className="flex items-center mb-6">
                <HelpCircle className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">{category.category}</h2>
                <Badge className={`ml-4 ${category.color}`}>
                  {category.faqs.length} questions
                </Badge>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {category.faqs.map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`${category.category}-${index}`}
                        className="border-b last:border-b-0"
                      >
                        <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 transition-colors">
                          <span className="text-left font-medium">
                            {faq.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                          <div className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          ))}

          {filteredFAQs.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any FAQs matching your search. Try different keywords or contact our support team.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Popular searches:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['booking', 'payment', 'safety', 'driver', 'cancel'].map((term) => (
                    <Badge 
                      key={term}
                      variant="outline" 
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => setSearchTerm(term)}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <section className="mt-16 bg-muted/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? Our support team is available 24/7 to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="text-sm font-semibold mb-1">Live Chat</div>
                <div className="text-xs text-muted-foreground">Available 24/7</div>
              </div>
            </Card>
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="text-sm font-semibold mb-1">Email Support</div>
                <div className="text-xs text-muted-foreground">support@cabro.com</div>
              </div>
            </Card>
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="text-sm font-semibold mb-1">Phone Support</div>
                <div className="text-xs text-muted-foreground">+1 (555) 123-4567</div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}