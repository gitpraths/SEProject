'use client';

import React, { useState } from 'react';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Alert,
  Badge,
  Spinner,
  ProgressBar,
  Skeleton,
  SkeletonCard,
  OfflineIndicator,
} from '@/components/UI';

export default function DesignSystemPage() {
  const [progress, setProgress] = useState(45);
  const [showAlert, setShowAlert] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <OfflineIndicator />
      
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-neutral-900 mb-2">
            Design System
          </h1>
          <p className="text-lg text-neutral-600">
            WCAG 2.1 AA compliant components with mobile-first design
          </p>
        </header>

        <main id="main-content" className="space-y-12">
          {/* Color Palette */}
          <section>
            <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-6">
              Color Palette
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <div className="w-full h-24 bg-primary-500 rounded-lg mb-3" />
                <h3 className="font-semibold text-neutral-900">Primary</h3>
                <p className="text-sm text-neutral-600">#2563EB</p>
                <p className="text-xs text-neutral-500 mt-1">Trust, Stability</p>
              </Card>
              <Card>
                <div className="w-full h-24 bg-secondary-500 rounded-lg mb-3" />
                <h3 className="font-semibold text-neutral-900">Secondary</h3>
                <p className="text-sm text-neutral-600">#10B981</p>
                <p className="text-xs text-neutral-500 mt-1">Success, Growth</p>
              </Card>
              <Card>
                <div className="w-full h-24 bg-warning-500 rounded-lg mb-3" />
                <h3 className="font-semibold text-neutral-900">Warning</h3>
                <p className="text-sm text-neutral-600">#F59E0B</p>
                <p className="text-xs text-neutral-500 mt-1">Attention Needed</p>
              </Card>
              <Card>
                <div className="w-full h-24 bg-danger-500 rounded-lg mb-3" />
                <h3 className="font-semibold text-neutral-900">Danger</h3>
                <p className="text-sm text-neutral-600">#EF4444</p>
                <p className="text-xs text-neutral-500 mt-1">Urgent, Critical</p>
              </Card>
              <Card>
                <div className="w-full h-24 bg-neutral-500 rounded-lg mb-3" />
                <h3 className="font-semibold text-neutral-900">Neutral</h3>
                <p className="text-sm text-neutral-600">#6B7280</p>
                <p className="text-xs text-neutral-500 mt-1">Text, Backgrounds</p>
              </Card>
            </div>
          </section>

          {/* Typography */}
          <section>
            <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-6">
              Typography
            </h2>
            <Card>
              <div className="space-y-4">
                <div>
                  <h1 className="font-heading text-4xl font-bold">Heading 1 - 36px</h1>
                  <p className="text-sm text-neutral-500">Poppins Bold</p>
                </div>
                <div>
                  <h2 className="font-heading text-3xl font-bold">Heading 2 - 30px</h2>
                  <p className="text-sm text-neutral-500">Poppins Bold</p>
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold">Heading 3 - 24px</h3>
                  <p className="text-sm text-neutral-500">Poppins Bold</p>
                </div>
                <div>
                  <h4 className="font-heading text-xl font-bold">Heading 4 - 20px</h4>
                  <p className="text-sm text-neutral-500">Poppins Bold</p>
                </div>
                <div>
                  <p className="font-body text-base">Body text - 16px minimum for mobile readability</p>
                  <p className="text-sm text-neutral-500">Open Sans Regular</p>
                </div>
              </div>
            </Card>
          </section>

          {/* Buttons */}
          <section>
            <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-6">
              Buttons
            </h2>
            <Card>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="warning">Warning Button</Button>
                  <Button variant="danger">Danger Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" size="sm">Small</Button>
                  <Button variant="primary" size="md">Medium</Button>
                  <Button variant="primary" size="lg">Large</Button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" disabled>Disabled</Button>
                  <Button variant="primary" isLoading>Loading</Button>
                </div>
                <div>
                  <Button variant="primary" fullWidth>Full Width Button</Button>
                </div>
              </div>
            </Card>
          </section>

          {/* Form Inputs */}
          <section>
            <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-6">
              Form Inputs
            </h2>
            <Card>
              <div className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  helpText="We'll never share your email"
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  error="Password must be at least 8 characters"
                  required
                />
                <Input
                  label="Disabled Input"
                  type="text"
                  value="Cannot edit this"
                  disabled
                />
              </div>
            </Card>
          </section>

          {/* Alerts */}
          <section>
            <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-6">
              Alerts
            </h2>
            <div className="space-y-4">
              <Alert variant="info" title="Information">
                Your profile is 80% complete. Add more details to improve recommendations.
              </Alert>
              <Alert variant="success" title="Success">
                Your changes have been saved successfully!
              </Alert>
              <Alert variant="warning" title="Warning">
                Please verify your email address to access all features.
              </Alert>
              {showAlert && (
                <Alert
                  variant="danger"
                  title="Error"
                  onClose={() => setShowAlert(false)}
                >
                  Failed to process your request. Please try again.
                </Alert>
              )}
            </div>
          </section>

          {/* Badges */}
          <section>
            <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-6">
              Badges
            </h2>
            <Card>
              <div className="flex flex-wrap gap-3">
                <Badge variant="primary">Active</Badge>
                <Badge variant="secondary">Completed</Badge>
                <Badge variant="warning">Pending</Badge>
                <Badge variant="danger">Urgent</Badge>
              </div>
            </Card>
          </section>

          {/* Loading States */}
          <section>
            <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-6">
              Loading States
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Spinners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <Spinner size="sm" />
                      <p className="text-xs text-neutral-600 mt-2">Small</p>
                    </div>
                    <div className="text-center">
                      <Spinner size="md" />
                      <p className="text-xs text-neutral-600 mt-2">Medium</p>
                    </div>
                    <div className="text-center">
                      <Spinner size="lg" />
                      <p className="text-xs text-neutral-600 mt-2">Large</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress Bars</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ProgressBar
                      value={progress}
                      label="Upload Progress"
                      showPercentage
                      variant="primary"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setProgress(Math.max(0, progress - 10))}
                      >
                        -10%
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setProgress(Math.min(100, progress + 10))}
                      >
                        +10%
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Skeleton Screens */}
          <section>
            <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-6">
              Skeleton Screens
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </section>

          {/* Cards */}
          <section>
            <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-6">
              Cards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Static Card</CardTitle>
                </CardHeader>
                <CardContent>
                  This is a regular card component with header and content sections.
                </CardContent>
              </Card>

              <Card interactive onClick={() => alert('Card clicked!')}>
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                </CardHeader>
                <CardContent>
                  Click this card to see the interaction. It has hover and focus states.
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Accessibility Features */}
          <section>
            <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-6">
              Accessibility Features
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>WCAG 2.1 AA Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary-500 mt-1">✓</span>
                    <span>Color contrast ratio minimum 4.5:1 for all text</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary-500 mt-1">✓</span>
                    <span>Keyboard navigation support (try using Tab key)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary-500 mt-1">✓</span>
                    <span>Screen reader friendly with proper ARIA labels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary-500 mt-1">✓</span>
                    <span>Focus indicators on all interactive elements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary-500 mt-1">✓</span>
                    <span>Touch targets minimum 44x44px for mobile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary-500 mt-1">✓</span>
                    <span>Reduced motion support for users with vestibular disorders</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
