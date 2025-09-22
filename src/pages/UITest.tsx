import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, CheckCircle, Zap } from 'lucide-react';

export default function UITest() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">UI Components Test</h1>

      <div className="space-y-8">
        {/* Badge Test */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Badge Component</h2>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </section>

        {/* Card Test */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Card Component</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This is a basic card component.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Styled header</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Content sections</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <span>With Icon</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Cards can include icons and other elements.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tabs Test */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Tabs Component</h2>
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
              <Card>
                <CardHeader>
                  <CardTitle>Tab 1 Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>This is the content for Tab 1.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tab2">
              <Card>
                <CardHeader>
                  <CardTitle>Tab 2 Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>This is the content for Tab 2.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tab3">
              <Card>
                <CardHeader>
                  <CardTitle>Tab 3 Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>This is the content for Tab 3.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Accordion Test */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Accordion Component</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>What is this UI library?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p>This is a collection of UI components built with Tailwind CSS and Radix UI primitives.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How to use these components?</AccordionTrigger>
              <AccordionContent>
                <p>Import the components from the components/ui directory and use them in your pages.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Are they responsive?</AccordionTrigger>
              <AccordionContent>
                <p>Yes, all components are designed to be responsive and work on different screen sizes.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </div>
  );
}