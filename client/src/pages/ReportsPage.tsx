import { motion } from 'framer-motion';
import { BarChart3, Download, Printer, Users, Building2, Briefcase, GitCompare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  //todo: remove mock functionality
  const monthlyData = [
    { month: 'Jan', profiles: 45, placements: 12 },
    { month: 'Feb', profiles: 52, placements: 18 },
    { month: 'Mar', profiles: 48, placements: 15 },
    { month: 'Apr', profiles: 61, placements: 23 },
    { month: 'May', profiles: 55, placements: 19 },
    { month: 'Jun', profiles: 67, placements: 28 }
  ];

  const handleExportCSV = () => {
    toast.success('Report exported as CSV');
  };

  const handlePrint = () => {
    window.print();
    toast.success('Printing...');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive overview of system performance</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV} data-testid="button-export-csv">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handlePrint} data-testid="button-print">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Profiles"
          value="342"
          icon={Users}
          trend="+28 this month"
        />
        <StatsCard
          title="Active Shelters"
          value="45"
          icon={Building2}
          trend="85% capacity"
        />
        <StatsCard
          title="Job Placements"
          value="156"
          icon={Briefcase}
          trend="+34 this month"
        />
        <StatsCard
          title="Successful Matches"
          value="234"
          icon={GitCompare}
          trend="94% success rate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Profiles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="profiles" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Placement Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="placements"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Distribution by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { category: 'Age Groups', data: [{ label: '18-30', value: 35 }, { label: '31-45', value: 42 }, { label: '46+', value: 23 }] },
              { category: 'Priority Level', data: [{ label: 'Critical', value: 12 }, { label: 'High', value: 28 }, { label: 'Medium', value: 45 }, { label: 'Low', value: 15 }] },
              { category: 'Resource Type', data: [{ label: 'Shelter', value: 48 }, { label: 'Job', value: 35 }, { label: 'Medical', value: 17 }] }
            ].map(item => (
              <div key={item.category} className="space-y-3">
                <h4 className="font-semibold text-sm text-foreground">{item.category}</h4>
                <div className="space-y-2">
                  {item.data.map(d => (
                    <div key={d.label} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{d.label}</span>
                        <span className="font-medium text-foreground">{d.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${d.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
