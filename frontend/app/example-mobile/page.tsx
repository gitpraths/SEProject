'use client';

import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Alert,
  SkeletonCard,
  BottomNav,
} from '@/components/UI';
import { usePullToRefresh } from '@/hooks/useSwipe';
import { useOffline } from '@/hooks/useOffline';

// Mock data
const mockItems = [
  {
    id: 1,
    name: 'John Doe',
    status: 'Active',
    urgent: false,
    lastUpdate: '2 hours ago',
  },
  {
    id: 2,
    name: 'Jane Smith',
    status: 'Pending',
    urgent: true,
    lastUpdate: '5 minutes ago',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    status: 'Completed',
    urgent: false,
    lastUpdate: '1 day ago',
  },
];

export default function ExampleMobilePage() {
  const [items, setItems] = useState(mockItems);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { isOnline, isSyncing, pendingChanges } = useOffline();

  // Pull-to-refresh functionality
  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setItems(mockItems);
    setLoading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const pullToRefresh = usePullToRefresh(handleRefresh);

  // Bottom navigation items
  const navItems = [
    {
      href: '/dashboard',
      label: 'Home',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: '/dashboard/map',
      label: 'Map',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      href: '/dashboard/profile',
      label: 'Profile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40 safe-top">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-2xl font-bold text-neutral-900">
              Mobile Example
            </h1>
            
            {/* Sync status indicator */}
            <div className="flex items-center gap-2">
              {isSyncing ? (
                <>
                  <div className="spinner" />
                  <span className="text-sm text-neutral-600">Syncing...</span>
                </>
              ) : isOnline ? (
                <Badge variant="secondary">Online</Badge>
              ) : (
                <Badge variant="warning">Offline</Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content with pull-to-refresh */}
      <main
        id="main-content"
        className="px-4 py-6 pb-24 md:pb-6"
        {...pullToRefresh}
      >
        {/* Pull-to-refresh indicator */}
        {pullToRefresh.isPulling && (
          <div
            className="flex justify-center mb-4 transition-all"
            style={{
              transform: `translateY(${Math.min(pullToRefresh.pullDistance, 80)}px)`,
            }}
          >
            <div className="spinner" />
          </div>
        )}

        {/* Success message */}
        {showSuccess && (
          <Alert variant="success" className="mb-4">
            Data refreshed successfully!
          </Alert>
        )}

        {/* Offline warning */}
        {!isOnline && pendingChanges > 0 && (
          <Alert variant="warning" className="mb-4">
            You have {pendingChanges} pending change{pendingChanges !== 1 ? 's' : ''} that will sync when you're back online.
          </Alert>
        )}

        {/* Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mobile-First Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-neutral-700">
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">↓</span>
                <span>Pull down to refresh the list</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">👆</span>
                <span>All touch targets are 44x44px minimum</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">⌨️</span>
                <span>Try keyboard navigation with Tab key</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">📱</span>
                <span>Bottom navigation appears on mobile</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">🔌</span>
                <span>Go offline to test sync functionality</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Loading state */}
        {loading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          /* Item list */
          <div className="space-y-4">
            {items.map((item) => (
              <Card
                key={item.id}
                interactive
                onClick={() => alert(`Clicked: ${item.name}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-neutral-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-neutral-600">{item.lastUpdate}</p>
                  </div>
                  <Badge
                    variant={
                      item.urgent
                        ? 'danger'
                        : item.status === 'Completed'
                        ? 'secondary'
                        : item.status === 'Pending'
                        ? 'warning'
                        : 'primary'
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`View details: ${item.name}`);
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Edit: ${item.name}`);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-6 space-y-3">
          <Button variant="primary" fullWidth>
            Add New Item
          </Button>
          <Button variant="outline" fullWidth onClick={handleRefresh}>
            Refresh List
          </Button>
        </div>
      </main>

      {/* Bottom navigation (mobile only) */}
      <BottomNav items={navItems} />
    </div>
  );
}
