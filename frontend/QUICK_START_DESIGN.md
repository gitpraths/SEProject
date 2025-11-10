# Quick Start - Design System

## Installation

The design system is already configured. Just import components:

```tsx
import { Button, Input, Card, Alert } from '@/components/UI';
```

## Common Patterns

### Form with Validation
```tsx
'use client';

import { useState } from 'react';
import { Button, Input, Alert } from '@/components/UI';

export default function MyForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    // Optimistic UI - show success immediately
    setSuccess(true);
    
    try {
      await api.saveEmail(email);
    } catch (err) {
      setSuccess(false);
      setError('Failed to save email');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <Alert variant="success">Email saved successfully!</Alert>
      )}
      
      <Input
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        required
      />
      
      <Button type="submit" variant="primary" fullWidth>
        Save Email
      </Button>
    </form>
  );
}
```

### Loading State with Skeleton
```tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, SkeletonCard } from '@/components/UI';

export default function DataList() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map(item => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent>{item.description}</CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### Interactive Card List
```tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/UI';

export default function ItemList({ items }) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {items.map(item => (
        <Card
          key={item.id}
          interactive
          onClick={() => router.push(`/items/${item.id}`)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle>{item.name}</CardTitle>
              <Badge variant={item.urgent ? 'danger' : 'primary'}>
                {item.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>{item.description}</CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### File Upload with Progress
```tsx
'use client';

import { useState } from 'react';
import { Button, ProgressBar, Alert } from '@/components/UI';

export default function FileUpload() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError('');
    
    try {
      await uploadFile(file, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      });
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      {error && <Alert variant="danger">{error}</Alert>}
      
      <input
        type="file"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        disabled={uploading}
        className="input"
      />
      
      {uploading && (
        <ProgressBar
          value={progress}
          label="Uploading..."
          showPercentage
          variant="primary"
        />
      )}
    </div>
  );
}
```

### Mobile Bottom Navigation
```tsx
'use client';

import { BottomNav } from '@/components/UI';

export default function Layout({ children }) {
  const navItems = [
    {
      href: '/dashboard',
      label: 'Home',
      icon: <HomeIcon />,
    },
    {
      href: '/dashboard/map',
      label: 'Map',
      icon: <MapIcon />,
    },
    {
      href: '/dashboard/profile',
      label: 'Profile',
      icon: <UserIcon />,
    },
  ];

  return (
    <>
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      <BottomNav items={navItems} />
    </>
  );
}
```

### Offline Support
```tsx
'use client';

import { OfflineIndicator } from '@/components/UI';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <OfflineIndicator />
        {children}
      </body>
    </html>
  );
}
```

## Color Usage Quick Reference

```tsx
// Backgrounds
className="bg-primary-500"      // Blue - primary actions
className="bg-secondary-500"    // Green - success
className="bg-warning-500"      // Orange - warnings
className="bg-danger-500"       // Red - errors
className="bg-neutral-100"      // Gray - backgrounds

// Text
className="text-primary-500"    // Blue text
className="text-secondary-500"  // Green text
className="text-warning-500"    // Orange text
className="text-danger-500"     // Red text
className="text-neutral-700"    // Dark gray text

// Borders
className="border-primary-500"
className="border-secondary-500"
className="border-warning-500"
className="border-danger-500"
className="border-neutral-300"
```

## Accessibility Checklist

When creating new components:

- [ ] Add proper ARIA labels
- [ ] Support keyboard navigation
- [ ] Include focus indicators
- [ ] Use semantic HTML
- [ ] Ensure 44x44px touch targets
- [ ] Test with screen reader
- [ ] Verify color contrast
- [ ] Add loading states
- [ ] Support offline mode

## Testing Your Component

```bash
# Run the design system demo
npm run dev

# Visit http://localhost:3000/design-system
# Test keyboard navigation with Tab key
# Test on mobile device or responsive mode
```

## Need Help?

- Full documentation: `DESIGN_SYSTEM.md`
- Component examples: `/app/design-system/page.tsx`
- All components: `/components/UI/`
