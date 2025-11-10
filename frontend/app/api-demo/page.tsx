'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { useFetch, useMutation, usePagination, useUpload } from '@/hooks/useApi';
import {
  useShelterUpdates,
  useNewIndividualNotifications,
  useEmergencyAlerts,
} from '@/hooks/useSocket';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Alert,
  Badge,
  ProgressBar,
  SkeletonCard,
} from '@/components/UI';

export default function ApiDemoPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  // ==========================================
  // FETCH DATA EXAMPLE
  // ==========================================
  const {
    data: individuals,
    loading: loadingIndividuals,
    error: individualsError,
    execute: refreshIndividuals,
  } = useFetch(() => api.getAllIndividuals({ page: 1, limit: 5 }));

  // ==========================================
  // MUTATION EXAMPLE
  // ==========================================
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
  });

  const {
    execute: createIndividual,
    loading: creating,
    error: createError,
  } = useMutation((data) => api.createIndividual(data), {
    onSuccess: (data) => {
      console.log('Individual created:', data);
      setFormData({ name: '', age: '', email: '' });
      refreshIndividuals();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createIndividual(formData);
  };

  // ==========================================
  // PAGINATION EXAMPLE
  // ==========================================
  const {
    data: paginatedData,
    loading: loadingPaginated,
    page,
    pages,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
  } = usePagination((params) => api.getAllIndividuals(params), {
    initialPage: 1,
    initialLimit: 3,
  });

  // ==========================================
  // FILE UPLOAD EXAMPLE
  // ==========================================
  const { upload, progress, loading: uploading, error: uploadError } = useUpload();

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await upload(selectedFile, 1, 'id_proof');
      alert('Upload successful!');
      setSelectedFile(null);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  // ==========================================
  // REAL-TIME UPDATES
  // ==========================================
  const [shelters, setShelters] = useState([
    { id: 1, name: 'Hope Shelter', available_beds: 10, total_capacity: 50 },
    { id: 2, name: 'Safe Haven', available_beds: 5, total_capacity: 30 },
  ]);

  // Listen for shelter updates
  useShelterUpdates((data) => {
    console.log('Shelter update received:', data);
    setShelters((prev) =>
      prev.map((shelter) =>
        shelter.id === data.shelter_id
          ? { ...shelter, available_beds: data.available_beds }
          : shelter
      )
    );
  });

  // Listen for new individual notifications
  useNewIndividualNotifications((data) => {
    console.log('New individual registered:', data);
    setAlerts((prev) => [
      ...prev,
      {
        type: 'info',
        message: `New registration: ${data.name}`,
        timestamp: Date.now(),
      },
    ]);
    refreshIndividuals();
  });

  // Listen for emergency alerts
  useEmergencyAlerts((data) => {
    console.log('Emergency alert:', data);
    setAlerts((prev) => [
      ...prev,
      {
        type: 'danger',
        message: data.message,
        timestamp: Date.now(),
      },
    ]);
  });

  // Auto-dismiss alerts after 5 seconds
  useEffect(() => {
    if (alerts.length > 0) {
      const timer = setTimeout(() => {
        setAlerts((prev) => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alerts]);

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-neutral-900 mb-2">
            API Integration Demo
          </h1>
          <p className="text-lg text-neutral-600">
            Complete example of Next.js ↔ Flask API integration
          </p>
        </header>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {alerts.map((alert, idx) => (
              <Alert
                key={idx}
                variant={alert.type as any}
                onClose={() => setAlerts((prev) => prev.filter((_, i) => i !== idx))}
              >
                {alert.message}
              </Alert>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FETCH DATA EXAMPLE */}
          <Card>
            <CardHeader>
              <CardTitle>1. Fetch Data (useFetch)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingIndividuals ? (
                  <SkeletonCard />
                ) : individualsError ? (
                  <Alert variant="danger">{individualsError.message}</Alert>
                ) : (
                  <div className="space-y-2">
                    {individuals?.data?.data?.map((individual: any) => (
                      <div
                        key={individual.id}
                        className="p-3 bg-neutral-100 rounded-lg"
                      >
                        <p className="font-semibold">{individual.name}</p>
                        <p className="text-sm text-neutral-600">
                          Age: {individual.age}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                <Button onClick={refreshIndividuals} variant="outline" fullWidth>
                  Refresh Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CREATE DATA EXAMPLE */}
          <Card>
            <CardHeader>
              <CardTitle>2. Create Data (useMutation)</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {createError && (
                  <Alert variant="danger">{createError.message}</Alert>
                )}

                <Input
                  label="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />

                <Input
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />

                <Button type="submit" isLoading={creating} fullWidth>
                  Create Individual
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* PAGINATION EXAMPLE */}
          <Card>
            <CardHeader>
              <CardTitle>3. Pagination (usePagination)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingPaginated ? (
                  <SkeletonCard />
                ) : (
                  <div className="space-y-2">
                    {paginatedData.map((individual: any) => (
                      <div
                        key={individual.id}
                        className="p-3 bg-neutral-100 rounded-lg"
                      >
                        <p className="font-semibold">{individual.name}</p>
                        <Badge variant="primary">{individual.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Button onClick={prevPage} disabled={!hasPrev} size="sm">
                    Previous
                  </Button>
                  <span className="text-sm text-neutral-600">
                    Page {page} of {pages}
                  </span>
                  <Button onClick={nextPage} disabled={!hasNext} size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FILE UPLOAD EXAMPLE */}
          <Card>
            <CardHeader>
              <CardTitle>4. File Upload (useUpload)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploadError && (
                  <Alert variant="danger">{uploadError.message}</Alert>
                )}

                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
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

                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  isLoading={uploading}
                  fullWidth
                >
                  Upload Document
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* REAL-TIME UPDATES EXAMPLE */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>5. Real-Time Updates (Socket.IO)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shelters.map((shelter) => (
                  <div
                    key={shelter.id}
                    className="p-4 bg-neutral-100 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{shelter.name}</h4>
                      <Badge
                        variant={
                          shelter.available_beds > 5
                            ? 'secondary'
                            : shelter.available_beds > 0
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {shelter.available_beds} beds
                      </Badge>
                    </div>
                    <ProgressBar
                      value={shelter.available_beds}
                      max={shelter.total_capacity}
                      variant={
                        shelter.available_beds > 5
                          ? 'secondary'
                          : shelter.available_beds > 0
                          ? 'warning'
                          : 'danger'
                      }
                    />
                    <p className="text-sm text-neutral-600 mt-2">
                      Capacity: {shelter.available_beds} / {shelter.total_capacity}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-neutral-600 mt-4">
                💡 Shelter capacities update in real-time via Socket.IO
              </p>
            </CardContent>
          </Card>
        </div>

        {/* INSTRUCTIONS */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-neutral-700">
              <li>Start Flask backend: <code className="bg-neutral-100 px-2 py-1 rounded">python app.py</code></li>
              <li>Ensure backend is running on <code className="bg-neutral-100 px-2 py-1 rounded">http://localhost:5000</code></li>
              <li>Try creating a new individual using the form</li>
              <li>Test pagination by clicking Previous/Next</li>
              <li>Upload a file to test file upload with progress</li>
              <li>Open browser console to see Socket.IO connection status</li>
              <li>Trigger backend events to see real-time updates</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
