import { useState } from 'react';
import { Settings, Mail, Users, ShoppingBag, BarChart3, Lock, Key, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { EmailCRMDashboard } from './EmailCRMDashboard';
import { SMTPConfigDialog } from './SMTPConfigDialog';
import { PasswordChangeDialog } from './PasswordChangeDialog';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [smtpDialogOpen, setSmtpDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (!password) {
      toast.error('Please enter a password');
      return;
    }

    setLoggingIn(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-dee56b5b/admin/verify-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ password })
        }
      );

      const data = await response.json();

      if (data.valid) {
        setIsAuthenticated(true);
        toast.success('Welcome to Admin Panel');
      } else {
        toast.error('Incorrect password');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      toast.error('Failed to verify password');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-6 z-40 w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 transition-all hover:scale-110"
        title="Admin Panel"
      >
        <Settings className="w-5 h-5" />
      </button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Admin Login
            </DialogTitle>
            <DialogDescription>
              Enter the admin password to access the control panel
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            <Button 
              onClick={handleLogin} 
              disabled={loggingIn}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              {loggingIn ? 'Verifying...' : 'Login'}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Default password: admin123 (Change it after first login!)
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[95vw] h-[90vh] p-0">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-gray-900 text-white p-4 space-y-2 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-xl mb-1">Admin Panel</h2>
              <p className="text-xs text-gray-400">MAGR Store Control Center</p>
            </div>

            <Tabs defaultValue="email" orientation="vertical" className="space-y-2">
              <TabsList className="flex flex-col h-auto bg-transparent gap-2">
                <TabsTrigger
                  value="email"
                  className="w-full justify-start data-[state=active]:bg-orange-500"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email CRM
                </TabsTrigger>
                <TabsTrigger
                  value="subscribers"
                  className="w-full justify-start data-[state=active]:bg-orange-500"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Subscribers
                </TabsTrigger>
                <TabsTrigger
                  value="vendors"
                  className="w-full justify-start data-[state=active]:bg-orange-500"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Vendors
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="w-full justify-start data-[state=active]:bg-orange-500"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 bg-white rounded-lg overflow-hidden">
                <TabsContent value="email" className="m-0 h-full overflow-y-auto">
                  <EmailCRMDashboard />
                </TabsContent>

                <TabsContent value="subscribers" className="m-0 p-6">
                  <div className="max-w-4xl">
                    <h2 className="text-2xl mb-4">Subscriber Management</h2>
                    <p className="text-gray-600">
                      View and manage your email subscribers. Use the Email CRM tab to send campaigns.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="vendors" className="m-0 p-6">
                  <div className="max-w-4xl">
                    <h2 className="text-2xl mb-4">Vendor Applications</h2>
                    <p className="text-gray-600">
                      Review and manage vendor registration applications from "Sell on MAGR Store".
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="m-0 p-6">
                  <div className="max-w-4xl">
                    <h2 className="text-2xl mb-4">Site Analytics</h2>
                    <p className="text-gray-600">
                      View overall site performance, sales metrics, and user engagement data.
                    </p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <div className="pt-4 mt-4 border-t border-gray-700 space-y-2">
              <Button
                onClick={() => setSmtpDialogOpen(true)}
                variant="outline"
                className="w-full border-gray-600 text-white hover:bg-gray-800 justify-start"
              >
                <Zap className="w-4 h-4 mr-2" />
                SMTP Settings
              </Button>
              <Button
                onClick={() => setPasswordDialogOpen(true)}
                variant="outline"
                className="w-full border-gray-600 text-white hover:bg-gray-800 justify-start"
              >
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-gray-600 text-white hover:bg-gray-800"
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-gray-50 overflow-hidden">
            <Tabs defaultValue="email" className="h-full">
              <TabsContent value="email" className="m-0 h-full overflow-y-auto">
                <EmailCRMDashboard />
              </TabsContent>
              <TabsContent value="subscribers" className="m-0 h-full overflow-y-auto p-6">
                <SubscriberManagement />
              </TabsContent>
              <TabsContent value="vendors" className="m-0 h-full overflow-y-auto p-6">
                <VendorManagement />
              </TabsContent>
              <TabsContent value="analytics" className="m-0 h-full overflow-y-auto p-6">
                <SiteAnalytics />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>

      {/* SMTP Configuration Dialog */}
      <SMTPConfigDialog 
        open={smtpDialogOpen} 
        onOpenChange={setSmtpDialogOpen} 
      />

      {/* Password Change Dialog */}
      <PasswordChangeDialog 
        open={passwordDialogOpen} 
        onOpenChange={setPasswordDialogOpen}
        onPasswordChanged={handleLogout}
      />
    </Dialog>
  );
}

// Placeholder components (to be expanded)
function SubscriberManagement() {
  const [subscribers, setSubscribers] = useState<any[]>([]);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl mb-4">Email Subscribers</h2>
      <p className="text-gray-600 mb-6">
        All your email subscribers are listed here. Use the Email CRM to send campaigns to them.
      </p>
      {/* Add subscriber list here */}
    </div>
  );
}

function VendorManagement() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl mb-4">Vendor Applications</h2>
      <p className="text-gray-600 mb-6">
        Review vendor registration requests from "Sell on MAGR Store" section.
      </p>
      {/* Add vendor list here */}
    </div>
  );
}

function SiteAnalytics() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl mb-4">Site Analytics</h2>
      <p className="text-gray-600 mb-6">
        Overview of your site's performance and key metrics.
      </p>
      {/* Add analytics charts here */}
    </div>
  );
}
