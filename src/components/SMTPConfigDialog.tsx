import { useState, useEffect } from 'react';
import { Settings, Mail, CheckCircle, AlertCircle, Send, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface SMTPConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SMTPConfigDialog({ open, onOpenChange }: SMTPConfigDialogProps) {
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [justSaved, setJustSaved] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [config, setConfig] = useState({
    hostname: 'smtp.gmail.com',
    port: '587',
    username: '',
    password: '',
    fromEmail: 'noreply@magrstore.com',
    fromName: 'MAGR Store'
  });

  useEffect(() => {
    if (open) {
      loadConfig();
    }
  }, [open]);

  const loadConfig = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-dee56b5b/admin/smtp-config`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );
      const data = await response.json();
      
      if (data.configured) {
        setConfig(data.config);
        setConfigured(true);
      }
    } catch (error) {
      console.error('Error loading SMTP config:', error);
    }
  };

  const handleSave = async () => {
    if (!config.hostname || !config.port || !config.username || !config.password) {
      toast.error('⚠️ Missing Required Fields', {
        description: 'Please fill in Host, Port, Username, and Password',
        duration: 4000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-dee56b5b/admin/smtp-config`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(config)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save configuration');
      }

      // Show success message with details
      toast.success('✅ SMTP Configuration Saved!', {
        description: `Host: ${config.hostname}:${config.port} | From: ${config.fromEmail}`,
        duration: 4000,
      });
      setConfigured(true);
      setJustSaved(true);
      setHasUnsavedChanges(false);
      
      // Reset the "just saved" indicator after 3 seconds
      setTimeout(() => setJustSaved(false), 3000);
    } catch (error) {
      console.error('Error saving SMTP config:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save configuration';
      toast.error('❌ Save Failed', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      toast.error('⚠️ Invalid Email', {
        description: 'Please enter a valid email address',
        duration: 3000,
      });
      return;
    }

    setTesting(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-dee56b5b/admin/test-smtp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ testEmail })
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success('✅ Test Email Sent!', {
          description: `Check your inbox at ${testEmail}. Don't forget to check spam folder.`,
          duration: 6000,
        });
      } else {
        toast.error('❌ Test Failed', {
          description: data.message || data.error || 'Failed to send test email. Please check your SMTP settings.',
          duration: 6000,
        });
      }
    } catch (error) {
      console.error('Error testing SMTP:', error);
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      toast.error('❌ Connection Failed', {
        description: `Could not send test email: ${errorMessage}`,
        duration: 6000,
      });
    } finally {
      setTesting(false);
    }
  };

  const presetConfigs = {
    gmail: {
      hostname: 'smtp.gmail.com',
      port: '587',
      label: 'Gmail'
    },
    sendgrid: {
      hostname: 'smtp.sendgrid.net',
      port: '587',
      label: 'SendGrid'
    },
    mailgun: {
      hostname: 'smtp.mailgun.org',
      port: '587',
      label: 'Mailgun'
    },
    outlook: {
      hostname: 'smtp-mail.outlook.com',
      port: '587',
      label: 'Outlook'
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            SMTP Email Configuration
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Configure your email server settings to send emails from MAGR Store
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Status Alert */}
          {hasUnsavedChanges && configured && (
            <Alert className="bg-orange-50 border-orange-200">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              <AlertDescription className="text-orange-800 text-xs sm:text-sm">
                ⚠️ You have unsaved changes. Click "Save Configuration" to apply them.
              </AlertDescription>
            </Alert>
          )}
          
          {configured && !hasUnsavedChanges ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <AlertDescription className="text-green-800 text-xs sm:text-sm">
                ✓ SMTP is configured and ready to use
              </AlertDescription>
            </Alert>
          ) : !configured ? (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              <AlertDescription className="text-yellow-800 text-xs sm:text-sm">
                SMTP not configured. Emails will not be sent until you configure these settings.
              </AlertDescription>
            </Alert>
          ) : null}

          {/* Quick Presets */}
          <div>
            <Label className="mb-2 block text-sm">Quick Setup</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(presetConfigs).map(([key, preset]) => (
                <Button
                  key={key}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm h-8 sm:h-9"
                  onClick={() => {
                    setConfig({ 
                      ...config, 
                      hostname: preset.hostname, 
                      port: preset.port 
                    });
                    setHasUnsavedChanges(true);
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* SMTP Settings Form */}
          <div className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="hostname" className="text-sm">SMTP Host *</Label>
                <Input
                  id="hostname"
                  value={config.hostname}
                  onChange={(e) => {
                    setConfig({ ...config, hostname: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="smtp.gmail.com"
                  className="h-9 sm:h-10 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="port" className="text-sm">Port *</Label>
                <Input
                  id="port"
                  value={config.port}
                  onChange={(e) => {
                    setConfig({ ...config, port: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="587"
                  className="h-9 sm:h-10 text-sm"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="username" className="text-sm">Username / Email *</Label>
              <Input
                id="username"
                value={config.username}
                onChange={(e) => {
                  setConfig({ ...config, username: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                placeholder="your-email@gmail.com"
                className="h-9 sm:h-10 text-sm"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm">Password / App Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={config.password}
                  onChange={(e) => {
                    setConfig({ ...config, password: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="Enter your password or app password"
                  className="h-9 sm:h-10 text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="fromEmail" className="text-sm">From Email</Label>
                <Input
                  id="fromEmail"
                  value={config.fromEmail}
                  onChange={(e) => {
                    setConfig({ ...config, fromEmail: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="noreply@magrstore.com"
                  className="h-9 sm:h-10 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="fromName" className="text-sm">From Name</Label>
                <Input
                  id="fromName"
                  value={config.fromName}
                  onChange={(e) => {
                    setConfig({ ...config, fromName: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="MAGR Store"
                  className="h-9 sm:h-10 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Gmail Instructions */}
          {config.hostname.includes('gmail') && (
            <Alert className="bg-blue-50 border-blue-200">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
              <AlertDescription className="text-blue-800 text-[10px] sm:text-xs leading-relaxed">
                <strong>Gmail Setup:</strong> You need to create an App Password. Go to your Google Account → 
                Security → 2-Step Verification → App passwords. Use the 16-character password here.
              </AlertDescription>
            </Alert>
          )}

          {/* Test Email Section */}
          <div className="border-t pt-3 sm:pt-4">
            <Label className="mb-2 block text-sm">Test Configuration</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter your email to receive a test"
                type="email"
                className="h-9 sm:h-10 text-sm flex-1"
              />
              <Button
                onClick={handleTest}
                disabled={testing || !configured}
                variant="outline"
                className="h-9 sm:h-10 text-sm whitespace-nowrap"
              >
                {testing ? (
                  <>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2" />
                    <span className="text-xs sm:text-sm">Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span className="text-xs sm:text-sm">Send Test</span>
                  </>
                )}
              </Button>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
              Save configuration first, then send a test email to verify it works
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end border-t pt-3 sm:pt-4">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="h-9 sm:h-10 text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className={`${justSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-500 hover:bg-orange-600'} h-9 sm:h-10 text-sm transition-colors`}
            >
              {loading ? (
                <>
                  <span className="animate-pulse">Saving...</span>
                </>
              ) : justSaved ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Saved!
                </>
              ) : (
                'Save Configuration'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
