import { useState, useEffect } from 'react';
import { Mail, Send, Users, TrendingUp, Eye, MousePointer, Plus, FileText, BarChart3, Settings, Zap, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { SMTPConfigDialog } from './SMTPConfigDialog';

interface Template {
  name: string;
  subject: string;
  html: string;
  category: string;
  createdAt: string;
}

interface Campaign {
  name: string;
  templateName: string;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  openedCount: number;
  clickedCount: number;
  status: string;
  createdAt: string;
}

interface Analytics {
  totalCampaigns: number;
  totalTemplates: number;
  totalEmailsSent: number;
  totalEmailsOpened: number;
  totalEmailsClicked: number;
  openRate: string;
  clickRate: string;
  campaigns: Array<{
    name: string;
    sentCount: number;
    openedCount: number;
    clickedCount: number;
    openRate: string;
    clickRate: string;
  }>;
}

export function EmailCRMDashboard() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [smtpConfigured, setSmtpConfigured] = useState(false);

  // Template creation
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    html: '',
    category: 'promotional'
  });

  // Campaign creation
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    templateName: '',
    sendToAll: true,
  });

  // SMTP Settings
  const [smtpDialogOpen, setSmtpDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
    checkSMTPConfig();
  }, []);

  const checkSMTPConfig = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-dee56b5b/admin/smtp-config`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );
      const data = await response.json();
      setSmtpConfigured(data.configured || false);
    } catch (error) {
      console.error('Error checking SMTP config:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Load templates
      const templatesRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-dee56b5b/email/templates`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );
      const templatesData = await templatesRes.json();
      setTemplates(templatesData.templates || []);

      // Load campaigns
      const campaignsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-dee56b5b/email/campaigns`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );
      const campaignsData = await campaignsRes.json();
      setCampaigns(campaignsData.campaigns || []);

      // Load analytics
      const analyticsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-dee56b5b/email/analytics`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData.analytics);

      // Load subscribers
      const subscribersRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-dee56b5b/subscribers`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );
      const subscribersData = await subscribersRes.json();
      setSubscribers(subscribersData.subscribers || []);

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load email data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.html) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-dee56b5b/email/template`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(newTemplate)
        }
      );

      if (!response.ok) throw new Error('Failed to create template');

      toast.success('Template created successfully!');
      setTemplateDialogOpen(false);
      setNewTemplate({ name: '', subject: '', html: '', category: 'promotional' });
      loadData();
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
    }
  };

  const handleSendCampaign = async () => {
    if (!newCampaign.name || !newCampaign.templateName) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Prepare recipients
      const recipients = subscribers.map((sub: any) => ({
        email: sub.email,
        name: sub.name || ''
      }));

      if (recipients.length === 0) {
        toast.error('No subscribers found');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-dee56b5b/email/campaign/send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            campaignName: newCampaign.name,
            templateName: newCampaign.templateName,
            recipients
          })
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to send campaign');

      toast.success(data.message || 'Campaign sent successfully!');
      setCampaignDialogOpen(false);
      setNewCampaign({ name: '', templateName: '', sendToAll: true });
      loadData();
    } catch (error) {
      console.error('Error sending campaign:', error);
      toast.error('Failed to send campaign');
    }
  };

  const defaultTemplates = [
    {
      name: 'Welcome',
      subject: 'Welcome to MAGR Store!',
      html: '<h1>Welcome {{name}}!</h1><p>Thank you for subscribing.</p>',
      category: 'transactional'
    },
    {
      name: 'Weekly Deals',
      subject: 'This Week\'s Best Deals at MAGR Store',
      html: '<h1>Hi {{name}}!</h1><p>Check out our amazing deals this week.</p>',
      category: 'promotional'
    },
    {
      name: 'New Products',
      subject: 'New Arrivals Just For You',
      html: '<h1>Hey {{name}}!</h1><p>We have exciting new products in stock.</p>',
      category: 'promotional'
    }
  ];

  const createDefaultTemplates = async () => {
    for (const template of defaultTemplates) {
      try {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-dee56b5b/email/template`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify(template)
          }
        );
      } catch (error) {
        console.error('Error creating default template:', error);
      }
    }
    toast.success('Default templates created!');
    loadData();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl mb-2">Email CRM Dashboard</h1>
          <p className="text-gray-600">Manage your email campaigns and subscribers</p>
        </div>
        <Button onClick={() => setSmtpDialogOpen(true)} variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          SMTP Settings
        </Button>
      </div>

      {/* SMTP Warning */}
      {!smtpConfigured && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="flex items-center justify-between">
              <span>
                <strong>SMTP Not Configured:</strong> You need to configure your email server to send emails.
              </span>
              <Button
                onClick={() => setSmtpDialogOpen(true)}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700 ml-4"
              >
                <Zap className="w-4 h-4 mr-2" />
                Setup Now
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Total Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                <span className="text-2xl">{analytics.totalEmailsSent}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Open Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-500" />
                <span className="text-2xl">{analytics.openRate}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Click Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MousePointer className="w-5 h-5 text-orange-500" />
                <span className="text-2xl">{analytics.clickRate}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                <span className="text-2xl">{subscribers.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">
            <Send className="w-4 h-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="subscribers">
            <Users className="w-4 h-4 mr-2" />
            Subscribers
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Email Campaigns</CardTitle>
                  <CardDescription>Manage and send email campaigns to your subscribers</CardDescription>
                </div>
                <Dialog open={campaignDialogOpen} onOpenChange={setCampaignDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Plus className="w-4 h-4 mr-2" />
                      New Campaign
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Campaign</DialogTitle>
                      <DialogDescription>Send an email campaign to your subscribers</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="campaignName">Campaign Name</Label>
                        <Input
                          id="campaignName"
                          value={newCampaign.name}
                          onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                          placeholder="Summer Sale 2025"
                        />
                      </div>
                      <div>
                        <Label htmlFor="templateSelect">Select Template</Label>
                        <Select
                          value={newCampaign.templateName}
                          onValueChange={(value) => setNewCampaign({ ...newCampaign, templateName: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a template" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map((template) => (
                              <SelectItem key={template.name} value={template.name}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-sm text-gray-600">
                        This campaign will be sent to {subscribers.length} subscribers
                      </p>
                      <Button onClick={handleSendCampaign} className="w-full bg-orange-500 hover:bg-orange-600">
                        Send Campaign
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {campaigns.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No campaigns yet. Create your first campaign!</p>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.name} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{campaign.name}</h3>
                          <p className="text-sm text-gray-600">Template: {campaign.templateName}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          campaign.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-600">Sent</p>
                          <p className="text-lg">{campaign.sentCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Opened</p>
                          <p className="text-lg">{campaign.openedCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Clicked</p>
                          <p className="text-lg">{campaign.clickedCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Failed</p>
                          <p className="text-lg">{campaign.failedCount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Email Templates</CardTitle>
                  <CardDescription>Create and manage email templates</CardDescription>
                </div>
                <div className="flex gap-2">
                  {templates.length === 0 && (
                    <Button onClick={createDefaultTemplates} variant="outline">
                      Create Default Templates
                    </Button>
                  )}
                  <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        <Plus className="w-4 h-4 mr-2" />
                        New Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create Email Template</DialogTitle>
                        <DialogDescription>Design a reusable email template</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="templateName">Template Name</Label>
                          <Input
                            id="templateName"
                            value={newTemplate.name}
                            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                            placeholder="Summer Sale"
                          />
                        </div>
                        <div>
                          <Label htmlFor="subject">Email Subject</Label>
                          <Input
                            id="subject"
                            value={newTemplate.subject}
                            onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                            placeholder="Get 50% Off Everything!"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={newTemplate.category}
                            onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="promotional">Promotional</SelectItem>
                              <SelectItem value="transactional">Transactional</SelectItem>
                              <SelectItem value="newsletter">Newsletter</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="html">HTML Content</Label>
                          <Textarea
                            id="html"
                            value={newTemplate.html}
                            onChange={(e) => setNewTemplate({ ...newTemplate, html: e.target.value })}
                            placeholder="<h1>Hello {{name}}!</h1><p>Your email content here...</p>"
                            rows={8}
                          />
                          <p className="text-xs text-gray-500 mt-1">Use {`{{name}}`} for personalization</p>
                        </div>
                        <Button onClick={handleCreateTemplate} className="w-full bg-orange-500 hover:bg-orange-600">
                          Create Template
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {templates.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No templates yet. Create your first template!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div key={template.name} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                          {template.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
                      <p className="text-xs text-gray-400">
                        Created: {new Date(template.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscribers Tab */}
        <TabsContent value="subscribers">
          <Card>
            <CardHeader>
              <CardTitle>Email Subscribers</CardTitle>
              <CardDescription>Manage your email subscriber list</CardDescription>
            </CardHeader>
            <CardContent>
              {subscribers.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No subscribers yet</p>
              ) : (
                <div className="space-y-2">
                  {subscribers.map((subscriber, index) => (
                    <div key={index} className="flex items-center justify-between border-b py-2">
                      <div>
                        <p className="font-medium">{subscriber.email}</p>
                        <p className="text-xs text-gray-500">
                          Subscribed: {new Date(subscriber.subscribedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        subscriber.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {subscriber.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Analytics</CardTitle>
              <CardDescription>Track performance of your email campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics && analytics.campaigns.length > 0 ? (
                <div className="space-y-4">
                  {analytics.campaigns.map((campaign) => (
                    <div key={campaign.name} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">{campaign.name}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-xs text-gray-600">Sent</p>
                          <p className="text-lg">{campaign.sentCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Opened</p>
                          <p className="text-lg">{campaign.openedCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Clicked</p>
                          <p className="text-lg">{campaign.clickedCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Open Rate</p>
                          <p className="text-lg text-green-600">{campaign.openRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Click Rate</p>
                          <p className="text-lg text-orange-600">{campaign.clickRate}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No analytics data available yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* SMTP Configuration Dialog */}
      <SMTPConfigDialog 
        open={smtpDialogOpen} 
        onOpenChange={(open) => {
          setSmtpDialogOpen(open);
          if (!open) checkSMTPConfig(); // Refresh status when dialog closes
        }} 
      />
    </div>
  );
}
