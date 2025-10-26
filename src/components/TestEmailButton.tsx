import { Button } from './ui/button';
import { Mail } from 'lucide-react';
import { mockOrderConfirmation } from '../services/emailService';
import { toast } from 'sonner@2.0.3';

export function TestEmailButton() {
  const handleTestSuccess = () => {
    mockOrderConfirmation('success');
    toast.success('Success email generated! Check console for HTML.');
  };

  const handleTestFailed = () => {
    mockOrderConfirmation('failed');
    toast.error('Failed email generated! Check console for HTML.');
  };

  return (
    <div className="fixed bottom-48 left-6 z-50 flex flex-col gap-2">
      <Button
        onClick={handleTestSuccess}
        variant="outline"
        size="sm"
        className="shadow-lg"
      >
        <Mail className="w-4 h-4 mr-2" />
        Test Success Email
      </Button>
      <Button
        onClick={handleTestFailed}
        variant="outline"
        size="sm"
        className="shadow-lg"
      >
        <Mail className="w-4 h-4 mr-2" />
        Test Failed Email
      </Button>
    </div>
  );
}
