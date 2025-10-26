# Email CRM System Documentation

## Overview

MAGR Store now includes a complete Email CRM system with SMTP integration, campaign management, email templates, and analytics tracking.

## 🎯 Features

### 1. **SMTP Email Service**
- Send transactional and marketing emails
- Configurable SMTP settings
- Support for major email providers (Gmail, SendGrid, Mailgun, AWS SES)
- Automatic welcome emails for new subscribers
- HTML email templates

### 2. **Email Templates**
- Create reusable email templates
- Template categories (Promotional, Transactional, Newsletter)
- Personalization with `{{name}}` variables
- Pre-built default templates

### 3. **Campaign Management**
- Send bulk email campaigns to subscribers
- Campaign status tracking (pending, sending, completed)
- Schedule campaigns for future dates
- Send to all subscribers or specific segments

### 4. **Analytics & Tracking**
- Email open tracking (pixel tracking)
- Click tracking
- Campaign performance metrics
- Open rate and click-through rate calculations
- Per-campaign and overall analytics

### 5. **CRM Dashboard**
- Visual dashboard for managing emails
- Subscriber list management
- Template library
- Campaign history
- Real-time analytics

## 🔧 Setup Instructions

### Step 1: Configure SMTP Settings

You need to set the following environment variables in your Supabase project:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@magrstore.com
SMTP_FROM_NAME=MAGR Store
```

### Popular SMTP Providers:

#### Gmail
```
Host: smtp.gmail.com
Port: 587
```
**Note:** You need to create an App Password in your Google Account settings.

#### SendGrid
```
Host: smtp.sendgrid.net
Port: 587
User: apikey
Password: YOUR_SENDGRID_API_KEY
```

#### Mailgun
```
Host: smtp.mailgun.org
Port: 587
User: postmaster@yourdomain.mailgun.org
Password: YOUR_MAILGUN_PASSWORD
```

#### AWS SES
```
Host: email-smtp.{region}.amazonaws.com
Port: 587
User: YOUR_SMTP_USERNAME
Password: YOUR_SMTP_PASSWORD
```

### Step 2: Access the Email CRM Dashboard

Add the EmailCRMDashboard component to your admin panel:

```tsx
import { EmailCRMDashboard } from './components/EmailCRMDashboard';

// In your admin route or component
<EmailCRMDashboard />
```

## 📧 API Endpoints

### Email Templates

#### Create Template
```http
POST /make-server-dee56b5b/email/template
Content-Type: application/json

{
  "name": "Welcome",
  "subject": "Welcome to MAGR Store!",
  "html": "<h1>Hello {{name}}!</h1>",
  "category": "transactional"
}
```

#### Get All Templates
```http
GET /make-server-dee56b5b/email/templates
```

#### Get Single Template
```http
GET /make-server-dee56b5b/email/template/:name
```

### Campaigns

#### Send Campaign
```http
POST /make-server-dee56b5b/email/campaign/send
Content-Type: application/json

{
  "campaignName": "Summer Sale 2025",
  "templateName": "Weekly Deals",
  "recipients": [
    { "email": "customer@example.com", "name": "John Doe" }
  ],
  "scheduledAt": null
}
```

#### Get All Campaigns
```http
GET /make-server-dee56b5b/email/campaigns
```

#### Get Campaign Details
```http
GET /make-server-dee56b5b/email/campaign/:name
```

### Single Emails

#### Send Email
```http
POST /make-server-dee56b5b/email/send
Content-Type: application/json

{
  "to": "customer@example.com",
  "subject": "Your Order Confirmation",
  "html": "<h1>Thank you for your order!</h1>",
  "cc": ["manager@magrstore.com"],
  "bcc": ["admin@magrstore.com"]
}
```

#### Send Welcome Email
```http
POST /make-server-dee56b5b/email/welcome
Content-Type: application/json

{
  "email": "newuser@example.com",
  "name": "Jane Doe"
}
```

### Analytics

#### Get Analytics
```http
GET /make-server-dee56b5b/email/analytics
```

Response:
```json
{
  "analytics": {
    "totalCampaigns": 5,
    "totalTemplates": 3,
    "totalEmailsSent": 1250,
    "totalEmailsOpened": 875,
    "totalEmailsClicked": 312,
    "openRate": "70.00",
    "clickRate": "24.96",
    "campaigns": [...]
  }
}
```

### Tracking

#### Track Email Open
```http
GET /make-server-dee56b5b/email/track/open/:trackingId
```
Returns a 1x1 transparent GIF pixel.

#### Track Email Click
```http
GET /make-server-dee56b5b/email/track/click/:trackingId?url=https://example.com
```
Redirects to the target URL after tracking.

## 📝 Email Template Personalization

Use the following variables in your email templates:

- `{{name}}` - Recipient's name
- `{{email}}` - Recipient's email

Example template:
```html
<h1>Hi {{name}}!</h1>
<p>Thank you for subscribing to MAGR Store.</p>
<p>We sent this email to {{email}}.</p>
```

## 📊 Database Schema

### Email Templates
```
Key: email-template:{name}
Value: {
  name: string
  subject: string
  html: string
  category: string
  createdAt: string (ISO)
  updatedAt: string (ISO)
}
```

### Campaigns
```
Key: campaign:{campaignName}
Value: {
  name: string
  templateName: string
  recipientCount: number
  sentCount: number
  failedCount: number
  openedCount: number
  clickedCount: number
  status: string
  scheduledAt: string | null
  createdAt: string (ISO)
  completedAt: string (ISO)
}
```

### Campaign Recipients
```
Key: campaign-recipient:{campaignName}:{email}
Value: {
  email: string
  name: string
  status: 'sent' | 'failed'
  sentAt: string (ISO)
  trackingId: string
  opened: boolean
  clicked: boolean
  openedAt?: string (ISO)
  clickedAt?: string (ISO)
}
```

### Sent Emails
```
Key: email:{timestamp}:{email}
Value: {
  to: string
  subject: string
  html: string
  sentAt: string (ISO)
  status: 'sent' | 'failed' | 'not_configured'
  error?: string
  cc?: string[]
  bcc?: string[]
}
```

## 🎨 Using the CRM Dashboard

### Creating a Template

1. Go to the **Templates** tab
2. Click **New Template**
3. Fill in:
   - Template Name (unique identifier)
   - Email Subject
   - Category (Promotional, Transactional, Newsletter)
   - HTML Content (use `{{name}}` for personalization)
4. Click **Create Template**

### Sending a Campaign

1. Make sure you have templates created
2. Go to the **Campaigns** tab
3. Click **New Campaign**
4. Fill in:
   - Campaign Name (unique identifier)
   - Select a template
5. Review recipient count
6. Click **Send Campaign**
7. Track results in the **Analytics** tab

### Viewing Analytics

The **Analytics** tab shows:
- Total campaigns sent
- Overall open and click rates
- Per-campaign performance metrics
- Detailed breakdown of each campaign

## 🔐 Security Considerations

### Production Recommendations:

1. **Never commit SMTP credentials** to version control
2. Use **environment variables** for all sensitive data
3. Implement **rate limiting** on email endpoints
4. Add **authentication** to admin endpoints
5. Use **email verification** before adding to subscriber list
6. Implement **unsubscribe functionality** in all emails
7. Comply with **GDPR, CAN-SPAM, and other regulations**
8. Use **SPF, DKIM, and DMARC** records for better deliverability

## 📈 Best Practices

### Email Deliverability

1. **Warm up your domain**: Start with small batches
2. **Clean your list**: Remove inactive subscribers
3. **Avoid spam triggers**: Don't use ALL CAPS, excessive punctuation
4. **Include unsubscribe link**: Required by law in many countries
5. **Monitor bounce rates**: Keep below 5%
6. **Test before sending**: Send test emails to yourself

### Campaign Strategy

1. **Segment your audience**: Send relevant content
2. **A/B test subject lines**: Test different approaches
3. **Optimal send times**: Tuesday-Thursday, 10am-2pm
4. **Mobile optimization**: 60%+ of emails are opened on mobile
5. **Clear call-to-action**: Make it obvious what you want users to do

### Template Design

1. **Keep it simple**: Clean, focused design
2. **Use responsive design**: Works on all devices
3. **Include alt text**: For images
4. **Limit image size**: Keep total email under 100KB
5. **Test across clients**: Gmail, Outlook, Apple Mail, etc.

## 🚀 Advanced Features (Future Enhancements)

- [ ] Email automation workflows
- [ ] Drip campaigns
- [ ] A/B testing for subject lines
- [ ] Advanced segmentation
- [ ] Email scheduling with timezone support
- [ ] Bounce and complaint handling
- [ ] Subscriber preferences center
- [ ] Rich text email editor
- [ ] Image hosting
- [ ] Dynamic content blocks

## 🆘 Troubleshooting

### Emails Not Sending

1. **Check SMTP credentials**: Verify environment variables are set correctly
2. **Check firewall**: Ensure port 587 is not blocked
3. **Check logs**: Look for error messages in server logs
4. **Test connection**: Use a tool like telnet to test SMTP connection
5. **Check rate limits**: Some providers limit emails per hour

### Low Open Rates

1. **Check spam folder**: Your emails might be going to spam
2. **Improve subject lines**: Make them more engaging
3. **Clean your list**: Remove inactive subscribers
4. **Verify sender reputation**: Use tools like mail-tester.com
5. **Add authentication**: Set up SPF, DKIM, DMARC

### Tracking Not Working

1. **Check tracking pixel**: Ensure HTML includes tracking pixel
2. **Image loading**: Some email clients block images by default
3. **Privacy settings**: Apple Mail Privacy Protection affects open tracking
4. **Click tracking**: Ensure links go through tracking URL

## 📞 Support

For questions or issues:
- Email: dev@magrstore.com
- Documentation: Check this file
- Server logs: Monitor Supabase function logs

## 📄 License

This email CRM system is part of MAGR Store. All rights reserved.

---

**Last Updated**: October 2025
**Version**: 1.0.0
