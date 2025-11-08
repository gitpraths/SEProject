import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

interface Shelter {
  id: string;
  name: string;
  location: string;
  capacity: number;
  occupied: number;
  available: number;
  facilities: string[];
}

export default function ResourcesPage({ type }: { type: 'shelters' | 'jobs' }) {
  //todo: remove mock functionality
  const [shelters, setShelters] = useState<Shelter[]>([
    {
      id: '1',
      name: 'Safe Haven Home',
      location: 'Downtown, Delhi',
      capacity: 50,
      occupied: 38,
      available: 12,
      facilities: ['Medical Support', 'Food', 'Counseling']
    },
    {
      id: '2',
      name: 'Hope Shelter',
      location: 'East District, Mumbai',
      capacity: 30,
      occupied: 28,
      available: 2,
      facilities: ['Food', 'Education', 'Job Training']
    },
    {
      id: '3',
      name: 'Community Care Center',
      location: 'South Delhi',
      capacity: 75,
      occupied: 45,
      available: 30,
      facilities: ['Medical Support', 'Food', 'Recreation', 'Skills Training']
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredShelters = shelters.filter(shelter =>
    shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shelter.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    toast.success('Shelter added successfully!');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setShelters(shelters.filter(s => s.id !== id));
    toast.success('Shelter deleted');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {type === 'shelters' ? 'Shelters' : 'Jobs'}
          </h1>
          <p className="text-muted-foreground">
            Manage {type === 'shelters' ? 'shelter' : 'job'} resources and availability
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-resource">
              <Plus className="mr-2 h-4 w-4" />
              Add {type === 'shelters' ? 'Shelter' : 'Job'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New {type === 'shelters' ? 'Shelter' : 'Job'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="Resource name" data-testid="input-resource-name" />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="Address" data-testid="input-resource-location" />
              </div>
              <div className="space-y-2">
                <Label>Capacity</Label>
                <Input type="number" placeholder="Total capacity" data-testid="input-resource-capacity" />
              </div>
              <Button onClick={handleAdd} className="w-full" data-testid="button-save-resource">
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Input
        placeholder="Search by name or location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
        data-testid="input-search-resources"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredShelters.map((shelter, index) => {
          const availabilityPercent = (shelter.available / shelter.capacity) * 100;
          const statusColor = availabilityPercent > 30 ? 'green' : availabilityPercent > 10 ? 'amber' : 'red';
          
          return (
            <motion.div
              key={shelter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="rounded-2xl hover-elevate">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{shelter.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {shelter.location}
                      </div>
                    </div>
                    <Badge 
                      variant={statusColor === 'green' ? 'default' : 'secondary'}
                      className={
                        statusColor === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        statusColor === 'amber' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }
                    >
                      {shelter.available} Available
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Capacity</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {shelter.occupied}/{shelter.capacity}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Facilities</p>
                    <div className="flex flex-wrap gap-2">
                      {shelter.facilities.map(facility => (
                        <Badge key={facility} variant="outline" className="text-xs">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" data-testid={`button-edit-${shelter.id}`}>
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(shelter.id)}
                      data-testid={`button-delete-${shelter.id}`}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
