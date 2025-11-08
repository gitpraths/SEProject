import { Toaster } from 'react-hot-toast';
import ReportsPage from '../ReportsPage';

export default function ReportsPageExample() {
  return (
    <div className="min-h-screen bg-background">
      <ReportsPage />
      <Toaster position="top-right" />
    </div>
  );
}
