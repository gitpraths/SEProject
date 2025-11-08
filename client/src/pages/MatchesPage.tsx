import { motion } from 'framer-motion';
import { Sparkles, MapPin, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

interface Match {
  id: string;
  type: 'Shelter' | 'Job';
  name: string;
  score: number;
  reasons: string[];
  location: string;
}

export default function MatchesPage() {
  //todo: remove mock functionality
  const matches: Match[] = [
    {
      id: '1',
      type: 'Shelter',
      name: 'Safe Haven Home',
      score: 92,
      location: 'Downtown, Delhi',
      reasons: ['Close to location', 'Medical support available', 'High availability']
    },
    {
      id: '2',
      type: 'Job',
      name: 'Kitchen Helper - Community Cafe',
      score: 88,
      location: 'South Delhi',
      reasons: ['Matches skills', 'Nearby location', 'Flexible hours']
    },
    {
      id: '3',
      type: 'Shelter',
      name: 'Hope Shelter',
      score: 85,
      location: 'East District, Delhi',
      reasons: ['Job training available', 'Good reviews', 'Available capacity']
    },
    {
      id: '4',
      type: 'Job',
      name: 'Warehouse Assistant',
      score: 82,
      location: 'West Delhi',
      reasons: ['Entry level position', 'Transportation provided', 'Immediate start']
    }
  ];

  const handleAssign = (match: Match) => {
    toast.success(`Assigned to ${match.name}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">AI-Powered Matches</h1>
        <p className="text-muted-foreground">Smart recommendations based on profiles and availability</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {matches.map((match, index) => {
          const scoreColor = match.score >= 90 ? 'green' : match.score >= 80 ? 'blue' : 'amber';
          
          return (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="rounded-2xl hover-elevate">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={match.type === 'Shelter' ? 'default' : 'secondary'}>
                          {match.type}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Sparkles className="h-4 w-4 text-amber-500" />
                          <span className={`font-bold text-sm ${
                            scoreColor === 'green' ? 'text-green-600 dark:text-green-400' :
                            scoreColor === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                            'text-amber-600 dark:text-amber-400'
                          }`}>
                            {match.score}% Match
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{match.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {match.location}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Why this is a good match:</p>
                    <ul className="space-y-1">
                      {match.reasons.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => handleAssign(match)}
                    className="w-full"
                    data-testid={`button-assign-${match.id}`}
                  >
                    Assign to Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
