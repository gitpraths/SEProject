import { Toaster } from 'react-hot-toast';
import MatchesPage from '../MatchesPage';

export default function MatchesPageExample() {
  return (
    <div className="min-h-screen bg-background">
      <MatchesPage />
      <Toaster position="top-right" />
    </div>
  );
}
