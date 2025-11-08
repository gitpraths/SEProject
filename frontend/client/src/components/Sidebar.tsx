import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Building2,
  Briefcase,
  GitCompare,
  BarChart3,
  Settings,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/hooks/useAuth';

interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  href: string;
  roles: UserRole[];
}

interface SidebarProps {
  role: UserRole;
}

export default function Sidebar({ role }: SidebarProps) {
  const { t } = useTranslation();
  const [location] = useLocation();

  const navItems: NavItem[] = [
    {
      label: t('nav.dashboard'),
      icon: LayoutDashboard,
      href: '/dashboard',
      roles: ['volunteer', 'ngo_staff', 'admin']
    },
    {
      label: t('nav.createProfile'),
      icon: UserPlus,
      href: '/profiles/create',
      roles: ['volunteer', 'ngo_staff', 'admin']
    },
    {
      label: t('nav.allProfiles'),
      icon: Users,
      href: '/profiles/all',
      roles: ['ngo_staff', 'admin']
    },
    {
      label: t('nav.shelters'),
      icon: Building2,
      href: '/resources/shelters',
      roles: ['ngo_staff', 'admin']
    },
    {
      label: t('nav.jobs'),
      icon: Briefcase,
      href: '/resources/jobs',
      roles: ['ngo_staff', 'admin']
    },
    {
      label: t('nav.matches'),
      icon: GitCompare,
      href: '/matches',
      roles: ['ngo_staff', 'admin']
    },
    {
      label: t('nav.reports'),
      icon: BarChart3,
      href: '/reports',
      roles: ['admin']
    },
    {
      label: t('nav.settings'),
      icon: Settings,
      href: '/settings',
      roles: ['volunteer', 'ngo_staff', 'admin']
    },
    {
      label: t('nav.help'),
      icon: HelpCircle,
      href: '/help',
      roles: ['volunteer', 'ngo_staff', 'admin']
    }
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className="hidden md:block w-64 border-r bg-sidebar h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="space-y-1 p-4">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all hover-elevate cursor-pointer',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground'
                )}
                data-testid={`link-${item.href.replace(/\//g, '-')}`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
