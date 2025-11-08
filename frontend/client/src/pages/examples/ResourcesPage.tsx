import { Toaster } from 'react-hot-toast';
import ResourcesPage from '../ResourcesPage';

export default function ResourcesPageExample() {
  return (
    <div className="min-h-screen bg-background">
      <ResourcesPage type="shelters" />
      <Toaster position="top-right" />
    </div>
  );
}
