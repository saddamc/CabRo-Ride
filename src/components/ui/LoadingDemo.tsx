import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import Loading, { ButtonLoading, CardLoading, FullScreenLoading, InlineLoading } from "./Loading";
// import Loading, { ButtonLoading, CardLoading, FullScreenLoading, InlineLoading } from "./Loading";

const LoadingDemo: React.FC = () => {
  const [showFullScreen, setShowFullScreen] = React.useState(false);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Amazing Loading Components</h1>
        <p className="text-muted-foreground text-lg">Beautiful, customizable loading states for any use case</p>
      </div>

      {/* Quick Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Demo</CardTitle>
          <CardDescription>See different sizes and variants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Loading size="sm" variant="spinner" />
              <p className="mt-2 text-sm">Small</p>
            </div>
            <div className="text-center">
              <Loading size="md" variant="dots" />
              <p className="mt-2 text-sm">Dots</p>
            </div>
            <div className="text-center">
              <Loading size="lg" variant="pulse" />
              <p className="mt-2 text-sm">Pulse</p>
            </div>
            <div className="text-center">
              <Loading size="xl" variant="bounce" />
              <p className="mt-2 text-sm">Bounce</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Loading Variants</CardTitle>
          <CardDescription>All available animation styles with medium size</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg">
              <Loading variant="spinner" text="Spinner" />
            </div>
            <div className="text-center p-6 border rounded-lg">
              <Loading variant="dots" text="Dots" />
            </div>
            <div className="text-center p-6 border rounded-lg">
              <Loading variant="pulse" text="Pulse" />
            </div>
            <div className="text-center p-6 border rounded-lg">
              <Loading variant="bounce" text="Bounce" />
            </div>
            <div className="text-center p-6 border rounded-lg">
              <Loading variant="ring" text="Ring" />
            </div>
            <div className="text-center p-6 border rounded-lg">
              <Loading variant="bars" text="Bars" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sizes */}
      <Card>
        <CardHeader>
          <CardTitle>Size Variants</CardTitle>
          <CardDescription>From extra small to extra large</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-8 p-8">
            <div className="text-center">
              <Loading size="sm" variant="spinner" />
              <p className="mt-2 text-sm">sm</p>
            </div>
            <div className="text-center">
              <Loading size="md" variant="spinner" />
              <p className="mt-2 text-sm">md</p>
            </div>
            <div className="text-center">
              <Loading size="lg" variant="spinner" />
              <p className="mt-2 text-sm">lg</p>
            </div>
            <div className="text-center">
              <Loading size="xl" variant="spinner" />
              <p className="mt-2 text-sm">xl</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Color Variants</CardTitle>
          <CardDescription>Match your app's color scheme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-8 p-8">
            <div className="text-center">
              <Loading size="md" variant="spinner" color="primary" />
              <p className="mt-2 text-sm">Primary</p>
            </div>
            <div className="text-center">
              <Loading size="md" variant="spinner" color="secondary" />
              <p className="mt-2 text-sm">Secondary</p>
            </div>
            <div className="text-center">
              <Loading size="md" variant="spinner" color="accent" />
              <p className="mt-2 text-sm">Accent</p>
            </div>
            <div className="text-center">
              <Loading size="md" variant="spinner" color="muted" />
              <p className="mt-2 text-sm">Muted</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Use Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Common Use Cases</CardTitle>
          <CardDescription>Pre-built components for different scenarios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Full Screen */}
          <div>
            <h4 className="font-medium mb-4">Full Screen Loading</h4>
            <div className="flex gap-4">
              <Button
                onClick={() => setShowFullScreen(true)}
                variant="outline"
                className="w-full"
              >
                Show Full Screen Loading
              </Button>
              <Button
                onClick={() => setShowFullScreen(false)}
                variant="outline"
                className="w-full"
              >
                Hide Full Screen Loading
              </Button>
            </div>
          </div>

          {/* Inline */}
          <div>
            <h4 className="font-medium mb-2">Inline Loading</h4>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <span>Processing data...</span>
                <InlineLoading />
              </div>
            </div>
          </div>

          {/* Card */}
          <div>
            <h4 className="font-medium mb-2">Card Loading</h4>
            <div className="p-4 border rounded-lg">
              <CardLoading />
            </div>
          </div>

          {/* Button */}
          <div>
            <h4 className="font-medium mb-2">Button Loading</h4>
            <div className="p-4 border rounded-lg">
              <div className="flex gap-4">
                <Button disabled>
                  <ButtonLoading />
                  Saving...
                </Button>
                <Button>
                  <ButtonLoading />
                  Loading Action
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Implementation */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Implementation</CardTitle>
          <CardDescription>Use the main Loading component with custom props</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-8 border rounded-lg">
              <Loading
                size="lg"
                variant="spinner"
                text="🔥 Loading with emoji..."
                color="primary"
                className="text-primary"
              />
            </div>

            <div className="p-8 border rounded-lg bg-muted">
              <Loading
                size="md"
                variant="dots"
                text="Please wait..."
                color="accent"
                className="text-accent"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Screen Demo */}
      {showFullScreen && (
        <FullScreenLoading
          size="xl"
          variant="spinner"
          text="Loading your amazing content..."
          overlay
        />
      )}
    </div>
  );
};

export default LoadingDemo;