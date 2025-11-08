import { Users, Building2, Briefcase, GitCompare } from 'lucide-react';
import StatsCard from '../StatsCard';

export default function StatsCardExample() {
  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Profiles"
          value="142"
          icon={Users}
          trend="+12 this week"
        />
        <StatsCard
          title="Shelters"
          value="28"
          icon={Building2}
          trend="5 available"
        />
        <StatsCard
          title="Job Placements"
          value="67"
          icon={Briefcase}
          trend="+8 this month"
        />
        <StatsCard
          title="AI Matches"
          value="89"
          icon={GitCompare}
          trend="92% accuracy"
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Loading State:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Loading" value="0" icon={Users} loading />
          <StatsCard title="Loading" value="0" icon={Building2} loading />
        </div>
      </div>
    </div>
  );
}
