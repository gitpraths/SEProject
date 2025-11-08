import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, User, MapPin, Calendar, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  created: string;
  status: 'pending' | 'approved' | 'assigned';
}

export default function ProfilesListPage() {
  const [searchTerm, setSearchTerm] = useState('');

  //todo: remove mock functionality
  const profiles: Profile[] = [
    { id: 'NEST-ABC123', name: 'John Doe', age: 42, location: 'Downtown, Delhi', created: '2024-01-15', status: 'approved' },
    { id: 'NEST-DEF456', name: 'Jane Smith', age: 35, location: 'South Delhi', created: '2024-01-18', status: 'assigned' },
    { id: 'NEST-GHI789', name: 'Mike Johnson', age: 51, location: 'East Delhi', created: '2024-01-20', status: 'pending' },
    { id: 'NEST-JKL012', name: 'Sarah Williams', age: 28, location: 'West Delhi', created: '2024-01-22', status: 'approved' },
    { id: 'NEST-MNO345', name: 'Robert Brown', age: 45, location: 'North Delhi', created: '2024-01-25', status: 'pending' }
  ];

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Profile['status']) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      assigned: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    };

    return (
      <Badge variant="secondary" className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">All Profiles</h1>
        <p className="text-muted-foreground">View and manage all registered profiles</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-profiles"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredProfiles.map((profile, index) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="rounded-2xl hover-elevate">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{profile.name}</h3>
                      {getStatusBadge(profile.status)}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Age {profile.age}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {profile.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(profile.created).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" data-testid={`button-view-${profile.id}`}>
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredProfiles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No profiles found matching your search</p>
        </div>
      )}
    </div>
  );
}
