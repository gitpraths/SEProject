import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Users, Building2, Briefcase, GitCompare, UserPlus, FileText, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatsCard from '@/components/StatsCard';
import type { UserRole } from '@/hooks/useAuth';
import { Link } from 'wouter';

interface DashboardPageProps {
  userName: string;
  userRole: UserRole;
}

export default function DashboardPage({ userName, userRole }: DashboardPageProps) {
  const { t } = useTranslation();

  //todo: remove mock functionality
  const stats = {
    volunteer: [
      { title: t('dashboard.totalProfiles'), value: '23', icon: Users, trend: '+5 this month' },
      { title: t('dashboard.pendingApprovals'), value: '8', icon: Clock, trend: 'Awaiting review' },
      { title: 'Approved', value: '15', icon: CheckCircle, trend: '65% approval rate' }
    ],
    ngo_staff: [
      { title: t('dashboard.totalProfiles'), value: '142', icon: Users, trend: '+12 this week' },
      { title: t('dashboard.shelterCapacity'), value: '85%', icon: Building2, trend: '24/28 occupied' },
      { title: t('dashboard.jobPlacements'), value: '67', icon: Briefcase, trend: '+8 this month' },
      { title: 'AI Matches', value: '89', icon: GitCompare, trend: '92% accuracy' }
    ],
    admin: [
      { title: t('dashboard.totalProfiles'), value: '342', icon: Users, trend: '+28 this month' },
      { title: 'Shelters', value: '45', icon: Building2, trend: '12 cities' },
      { title: 'Jobs', value: '156', icon: Briefcase, trend: '23 employers' },
      { title: 'Total Matches', value: '234', icon: GitCompare, trend: '94% success' }
    ]
  };

  const roleStats = stats[userRole] || stats.volunteer;

  const recentActivity = [
    { id: 1, action: 'New profile created', user: 'John Doe', time: '2 hours ago' },
    { id: 2, action: 'Profile approved', user: 'Jane Smith', time: '4 hours ago' },
    { id: 3, action: 'Shelter assigned', user: 'Mike Johnson', time: '1 day ago' },
    { id: 4, action: 'Job placement confirmed', user: 'Sarah Williams', time: '2 days ago' }
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold text-foreground">
          {t('dashboard.welcome')}, {userName}!
        </h1>
        <p className="text-muted-foreground capitalize">
          {userRole.replace('_', ' ')} Dashboard
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {roleStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>{t('dashboard.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/profiles/create">
              <Button className="w-full justify-start gap-2" data-testid="button-create-profile">
                <UserPlus className="h-4 w-4" />
                {t('profile.createNew')}
              </Button>
            </Link>
            <Link href="/profiles/all">
              <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-view-profiles">
                <FileText className="h-4 w-4" />
                View All Profiles
              </Button>
            </Link>
            {(userRole === 'ngo_staff' || userRole === 'admin') && (
              <Link href="/resources/shelters">
                <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-manage-resources">
                  <Building2 className="h-4 w-4" />
                  Manage Resources
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="rounded-full bg-primary/10 p-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
