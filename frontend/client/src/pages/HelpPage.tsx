import { HelpCircle, Mail, Phone, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function HelpPage() {
  const faqs = [
    {
      q: 'How do I create a new profile?',
      a: 'Navigate to the "Create Profile" section from the dashboard. Follow the 6-step wizard to enter location, basic information, health details, skills, needs, and consent.'
    },
    {
      q: 'What information is required for a profile?',
      a: 'Basic information includes name, age, gender, and location. Health information, skills, and needs are important but optional. Consent is mandatory before submission.'
    },
    {
      q: 'How does the AI matching system work?',
      a: 'Our AI analyzes profile data including location, needs, and skills to match individuals with appropriate shelters, jobs, and resources based on availability and compatibility.'
    },
    {
      q: 'Can I access the system offline?',
      a: 'Yes! The system automatically saves drafts locally. When you\'re offline, you can continue working on profiles, and they will sync once you\'re back online.'
    },
    {
      q: 'Who can access the profiles?',
      a: 'Access is role-based. Volunteers can create and view their own submissions. NGO Staff can manage resources and view all profiles. Admins have full system access.'
    },
    {
      q: 'How is privacy protected?',
      a: 'All data is encrypted and stored securely. Profile IDs are masked, and sensitive information is only accessible to authorized personnel with proper consent.'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Help & Support</h1>
        <p className="text-muted-foreground">Find answers and get assistance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">Email</p>
                  <a href="mailto:support@nest.org" className="text-sm text-primary hover:underline">
                    support@nest.org
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">Phone</p>
                  <a href="tel:+911234567890" className="text-sm text-primary hover:underline">
                    +91 123 456 7890
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">Live Chat</p>
                  <p className="text-sm text-muted-foreground">Available 9 AM - 6 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a href="#" className="block text-sm text-primary hover:underline">
                User Guide
              </a>
              <a href="#" className="block text-sm text-primary hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="block text-sm text-primary hover:underline">
                Terms of Service
              </a>
              <a href="#" className="block text-sm text-primary hover:underline">
                Data Protection
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
