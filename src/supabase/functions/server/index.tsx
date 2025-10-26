import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// SMTP Configuration (checks database first, then environment variables)
const getEmailConfig = async () => {
  // Try to get config from database first
  const dbConfig = await kv.get('smtp-config');
  
  if (dbConfig && dbConfig.username && dbConfig.password) {
    return {
      hostname: dbConfig.hostname || 'smtp.gmail.com',
      port: parseInt(dbConfig.port || '587'),
      username: dbConfig.username,
      password: dbConfig.password,
      fromEmail: dbConfig.fromEmail || 'noreply@magrstore.com',
      fromName: dbConfig.fromName || 'MAGR Store',
    };
  }
  
  // Fallback to environment variables
  return {
    hostname: Deno.env.get('SMTP_HOST') || 'smtp.gmail.com',
    port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
    username: Deno.env.get('SMTP_USER') || '',
    password: Deno.env.get('SMTP_PASSWORD') || '',
    fromEmail: Deno.env.get('SMTP_FROM_EMAIL') || 'noreply@magrstore.com',
    fromName: Deno.env.get('SMTP_FROM_NAME') || 'MAGR Store',
  };
};

// Email sending function
async function sendEmail(to: string, subject: string, html: string, cc?: string[], bcc?: string[]) {
  const config = await getEmailConfig();
  
  if (!config.username || !config.password) {
    console.log('Email not sent - SMTP credentials not configured. Email would be sent to:', to);
    console.log('Subject:', subject);
    // Store in database for tracking even if not sent
    await kv.set(`email:${Date.now()}:${to}`, {
      to,
      subject,
      html,
      sentAt: new Date().toISOString(),
      status: 'not_configured',
      cc,
      bcc
    });
    return { success: false, error: 'SMTP not configured' };
  }

  try {
    const client = new SMTPClient({
      connection: {
        hostname: config.hostname,
        port: config.port,
        tls: true,
        auth: {
          username: config.username,
          password: config.password,
        },
      },
    });

    await client.send({
      from: `${config.fromName} <${config.fromEmail}>`,
      to,
      cc: cc?.join(','),
      bcc: bcc?.join(','),
      subject,
      content: html,
      html,
    });

    await client.close();

    // Store successful email in database
    await kv.set(`email:${Date.now()}:${to}`, {
      to,
      subject,
      html,
      sentAt: new Date().toISOString(),
      status: 'sent',
      cc,
      bcc
    });

    console.log(`Email sent successfully to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Store failed email in database
    await kv.set(`email:${Date.now()}:${to}`, {
      to,
      subject,
      html,
      sentAt: new Date().toISOString(),
      status: 'failed',
      error: String(error),
      cc,
      bcc
    });
    
    return { success: false, error: String(error) };
  }
}

// Health check endpoint
app.get("/make-server-dee56b5b/health", (c) => {
  return c.json({ status: "ok" });
});

// Subscribe to newsletter
app.post("/make-server-dee56b5b/subscribe", async (c) => {
  try {
    const { email, name } = await c.req.json();
    
    if (!email || !email.includes('@')) {
      return c.json({ error: 'Valid email is required' }, 400);
    }

    // Check if email already exists
    const existing = await kv.get(`subscriber:${email}`);
    if (existing) {
      return c.json({ error: 'Email already subscribed' }, 400);
    }

    // Store subscriber
    const subscriber = {
      email,
      name: name || '',
      subscribedAt: new Date().toISOString(),
      status: 'active'
    };

    await kv.set(`subscriber:${email}`, subscriber);
    console.log(`New subscriber added: ${email}`);

    // Send welcome email (async, don't wait for it)
    sendEmail(
      email,
      `Welcome to MAGR Store${name ? ', ' + name : ''}!`,
      `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px;">Welcome to MAGR Store!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 18px; color: #111827;">Hi ${name || 'there'},</p>
              <p style="margin: 0 0 20px; font-size: 16px; color: #6b7280; line-height: 1.6;">
                Thank you for subscribing to MAGR Store! We're excited to have you as part of our community.
              </p>
              <p style="margin: 0 0 30px; font-size: 16px; color: #6b7280; line-height: 1.6;">
                As a subscriber, you'll get exclusive access to:
              </p>
              <ul style="margin: 0 0 30px; padding-left: 20px; color: #6b7280; font-size: 16px; line-height: 1.8;">
                <li>Early access to new products</li>
                <li>Exclusive discounts and promotions</li>
                <li>Special deals just for subscribers</li>
                <li>Tips and recommendations</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://magrstore.com" style="display: inline-block; background-color: #f97316; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">Start Shopping</a>
              </div>
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
                <p style="margin: 0 0 8px; font-weight: 600; color: #92400e; font-size: 14px;">🎁 Special Welcome Offer!</p>
                <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">Use code <strong>WELCOME15</strong> for 15% off your first purchase!</p>
              </div>
              <p style="margin: 30px 0 0; font-size: 14px; color: #9ca3af; line-height: 1.6;">
                If you have any questions, feel free to reach out to our support team at support@magrstore.com
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">© 2025 MAGR Store. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `
    ).catch(err => console.error('Error sending welcome email:', err));

    return c.json({ success: true, message: 'Successfully subscribed!' });
  } catch (error) {
    console.error('Error subscribing user:', error);
    return c.json({ error: 'Failed to subscribe. Please try again.' }, 500);
  }
});

// Get all subscribers (admin only - in production, add auth)
app.get("/make-server-dee56b5b/subscribers", async (c) => {
  try {
    const subscribers = await kv.getByPrefix('subscriber:');
    return c.json({ subscribers });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return c.json({ error: 'Failed to fetch subscribers' }, 500);
  }
});

// Vendor registration
app.post("/make-server-dee56b5b/vendor/register", async (c) => {
  try {
    const vendorData = await c.req.json();
    
    const { businessName, email, phone, category, description } = vendorData;
    
    // Validate required fields
    if (!businessName || !email || !phone || !category) {
      return c.json({ error: 'All required fields must be filled' }, 400);
    }

    if (!email.includes('@')) {
      return c.json({ error: 'Valid email is required' }, 400);
    }

    // Check if vendor already exists
    const existing = await kv.get(`vendor:${email}`);
    if (existing) {
      return c.json({ error: 'A vendor with this email already exists' }, 400);
    }

    // Store vendor application
    const vendor = {
      ...vendorData,
      applicationId: `VND-${Date.now()}`,
      appliedAt: new Date().toISOString(),
      status: 'pending',
      approved: false
    };

    await kv.set(`vendor:${email}`, vendor);
    console.log(`New vendor application: ${businessName} (${email})`);

    return c.json({ 
      success: true, 
      message: 'Application submitted successfully!',
      applicationId: vendor.applicationId
    });
  } catch (error) {
    console.error('Error registering vendor:', error);
    return c.json({ error: 'Failed to submit application. Please try again.' }, 500);
  }
});

// Get all vendor applications (admin only - in production, add auth)
app.get("/make-server-dee56b5b/vendors", async (c) => {
  try {
    const vendors = await kv.getByPrefix('vendor:');
    return c.json({ vendors });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return c.json({ error: 'Failed to fetch vendors' }, 500);
  }
});

// Update vendor status (admin only - in production, add auth)
app.put("/make-server-dee56b5b/vendor/:email/status", async (c) => {
  try {
    const email = c.req.param('email');
    const { status, approved } = await c.req.json();
    
    const vendor = await kv.get(`vendor:${email}`);
    if (!vendor) {
      return c.json({ error: 'Vendor not found' }, 404);
    }

    const updatedVendor = {
      ...vendor,
      status,
      approved,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`vendor:${email}`, updatedVendor);
    console.log(`Vendor status updated: ${email} - ${status}`);

    return c.json({ success: true, vendor: updatedVendor });
  } catch (error) {
    console.error('Error updating vendor status:', error);
    return c.json({ error: 'Failed to update vendor status' }, 500);
  }
});

// ============================================
// ADMIN & CONFIGURATION ENDPOINTS
// ============================================

// Get SMTP configuration
app.get("/make-server-dee56b5b/admin/smtp-config", async (c) => {
  try {
    const config = await kv.get('smtp-config');
    
    if (!config) {
      return c.json({ 
        configured: false,
        config: {
          hostname: '',
          port: '587',
          username: '',
          password: '',
          fromEmail: '',
          fromName: 'MAGR Store'
        }
      });
    }
    
    // Return config but mask password
    return c.json({ 
      configured: true,
      config: {
        ...config,
        password: config.password ? '••••••••' : ''
      }
    });
  } catch (error) {
    console.error('Error fetching SMTP config:', error);
    return c.json({ error: 'Failed to fetch configuration' }, 500);
  }
});

// Save SMTP configuration
app.post("/make-server-dee56b5b/admin/smtp-config", async (c) => {
  try {
    const { hostname, port, username, password, fromEmail, fromName } = await c.req.json();
    
    if (!hostname || !port || !username || !password) {
      return c.json({ error: 'All SMTP fields are required' }, 400);
    }

    const config = {
      hostname,
      port,
      username,
      password,
      fromEmail: fromEmail || 'noreply@magrstore.com',
      fromName: fromName || 'MAGR Store',
      updatedAt: new Date().toISOString(),
    };

    await kv.set('smtp-config', config);
    console.log('SMTP configuration updated');

    return c.json({ 
      success: true, 
      message: 'SMTP configuration saved successfully',
      configured: true 
    });
  } catch (error) {
    console.error('Error saving SMTP config:', error);
    return c.json({ error: 'Failed to save configuration' }, 500);
  }
});

// Test SMTP configuration
app.post("/make-server-dee56b5b/admin/test-smtp", async (c) => {
  try {
    const { testEmail } = await c.req.json();
    
    if (!testEmail || !testEmail.includes('@')) {
      return c.json({ error: 'Valid test email is required' }, 400);
    }

    const result = await sendEmail(
      testEmail,
      'MAGR Store - SMTP Test Email',
      `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">✅ SMTP Test Successful!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 18px; color: #111827;">Congratulations!</p>
              <p style="margin: 0 0 20px; font-size: 16px; color: #6b7280; line-height: 1.6;">
                Your SMTP configuration is working correctly. You can now send emails from MAGR Store!
              </p>
              <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; border-radius: 4px; margin: 20px 0;">
                <p style="margin: 0; font-weight: 600; color: #065f46; font-size: 14px;">✓ Configuration Verified</p>
                <p style="margin: 8px 0 0; color: #065f46; font-size: 13px;">Your email system is ready to use.</p>
              </div>
              <p style="margin: 30px 0 0; font-size: 14px; color: #9ca3af;">
                This is a test email sent from MAGR Store Email CRM system.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">© 2025 MAGR Store. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `
    );

    if (result.success) {
      return c.json({ 
        success: true, 
        message: `Test email sent successfully to ${testEmail}! Check your inbox.` 
      });
    } else {
      return c.json({ 
        success: false, 
        error: result.error,
        message: 'Failed to send test email. Please check your SMTP configuration.' 
      }, 500);
    }
  } catch (error) {
    console.error('Error testing SMTP:', error);
    return c.json({ 
      success: false,
      error: String(error),
      message: 'Failed to send test email' 
    }, 500);
  }
});

// Change admin password
app.post("/make-server-dee56b5b/admin/change-password", async (c) => {
  try {
    const { currentPassword, newPassword } = await c.req.json();
    
    if (!currentPassword || !newPassword) {
      return c.json({ error: 'Current and new passwords are required' }, 400);
    }

    if (newPassword.length < 6) {
      return c.json({ error: 'New password must be at least 6 characters' }, 400);
    }

    // Get current admin password from database
    const adminConfig = await kv.get('admin-config');
    const storedPassword = adminConfig?.password || 'admin123'; // Default password

    if (currentPassword !== storedPassword) {
      return c.json({ error: 'Current password is incorrect' }, 401);
    }

    // Update password
    await kv.set('admin-config', {
      password: newPassword,
      updatedAt: new Date().toISOString(),
    });

    console.log('Admin password updated successfully');

    return c.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return c.json({ error: 'Failed to change password' }, 500);
  }
});

// Get admin password (for login verification)
app.post("/make-server-dee56b5b/admin/verify-password", async (c) => {
  try {
    const { password } = await c.req.json();
    
    if (!password) {
      return c.json({ error: 'Password is required' }, 400);
    }

    const adminConfig = await kv.get('admin-config');
    const storedPassword = adminConfig?.password || 'admin123';

    if (password === storedPassword) {
      return c.json({ success: true, valid: true });
    } else {
      return c.json({ success: false, valid: false, error: 'Invalid password' }, 401);
    }
  } catch (error) {
    console.error('Error verifying password:', error);
    return c.json({ error: 'Failed to verify password' }, 500);
  }
});

// ============================================
// EMAIL & CRM ENDPOINTS
// ============================================

// Create email template
app.post("/make-server-dee56b5b/email/template", async (c) => {
  try {
    const { name, subject, html, category } = await c.req.json();
    
    if (!name || !subject || !html) {
      return c.json({ error: 'Name, subject, and html are required' }, 400);
    }

    const template = {
      name,
      subject,
      html,
      category: category || 'general',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`email-template:${name}`, template);
    console.log(`Email template created: ${name}`);

    return c.json({ success: true, template });
  } catch (error) {
    console.error('Error creating email template:', error);
    return c.json({ error: 'Failed to create template' }, 500);
  }
});

// Get all email templates
app.get("/make-server-dee56b5b/email/templates", async (c) => {
  try {
    const templates = await kv.getByPrefix('email-template:');
    return c.json({ templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return c.json({ error: 'Failed to fetch templates' }, 500);
  }
});

// Get single email template
app.get("/make-server-dee56b5b/email/template/:name", async (c) => {
  try {
    const name = c.req.param('name');
    const template = await kv.get(`email-template:${name}`);
    
    if (!template) {
      return c.json({ error: 'Template not found' }, 404);
    }

    return c.json({ template });
  } catch (error) {
    console.error('Error fetching template:', error);
    return c.json({ error: 'Failed to fetch template' }, 500);
  }
});

// Send single email
app.post("/make-server-dee56b5b/email/send", async (c) => {
  try {
    const { to, subject, html, cc, bcc } = await c.req.json();
    
    if (!to || !subject || !html) {
      return c.json({ error: 'To, subject, and html are required' }, 400);
    }

    const result = await sendEmail(to, subject, html, cc, bcc);
    
    if (result.success) {
      return c.json({ success: true, message: 'Email sent successfully' });
    } else {
      return c.json({ 
        success: false, 
        error: result.error,
        message: 'Email not sent. Please configure SMTP settings.' 
      }, 500);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return c.json({ error: 'Failed to send email' }, 500);
  }
});

// Send campaign to multiple recipients
app.post("/make-server-dee56b5b/email/campaign/send", async (c) => {
  try {
    const { campaignName, templateName, recipients, scheduledAt } = await c.req.json();
    
    if (!campaignName || !templateName || !recipients || !Array.isArray(recipients)) {
      return c.json({ error: 'Invalid campaign data' }, 400);
    }

    // Get template
    const template = await kv.get(`email-template:${templateName}`);
    if (!template) {
      return c.json({ error: 'Template not found' }, 404);
    }

    // Create campaign record
    const campaign = {
      name: campaignName,
      templateName,
      recipientCount: recipients.length,
      status: scheduledAt ? 'scheduled' : 'sending',
      scheduledAt: scheduledAt || null,
      createdAt: new Date().toISOString(),
      sentCount: 0,
      failedCount: 0,
      openedCount: 0,
      clickedCount: 0,
    };

    await kv.set(`campaign:${campaignName}`, campaign);

    // Send emails (in production, use a queue system)
    let sentCount = 0;
    let failedCount = 0;

    for (const recipient of recipients) {
      // Personalize email (replace {{name}} with actual name, etc.)
      let personalizedHtml = template.html;
      let personalizedSubject = template.subject;
      
      if (recipient.name) {
        personalizedHtml = personalizedHtml.replace(/\{\{name\}\}/g, recipient.name);
        personalizedSubject = personalizedSubject.replace(/\{\{name\}\}/g, recipient.name);
      }
      
      // Add tracking pixel for open tracking
      const trackingId = `${campaignName}-${recipient.email}-${Date.now()}`;
      personalizedHtml += `<img src="https://track.magrstore.com/pixel/${trackingId}" width="1" height="1" />`;

      const result = await sendEmail(recipient.email, personalizedSubject, personalizedHtml);
      
      if (result.success) {
        sentCount++;
      } else {
        failedCount++;
      }

      // Store recipient status
      await kv.set(`campaign-recipient:${campaignName}:${recipient.email}`, {
        email: recipient.email,
        name: recipient.name,
        status: result.success ? 'sent' : 'failed',
        sentAt: new Date().toISOString(),
        trackingId,
        opened: false,
        clicked: false,
      });
    }

    // Update campaign stats
    campaign.status = 'completed';
    campaign.sentCount = sentCount;
    campaign.failedCount = failedCount;
    campaign.completedAt = new Date().toISOString();
    
    await kv.set(`campaign:${campaignName}`, campaign);

    console.log(`Campaign sent: ${campaignName} - Sent: ${sentCount}, Failed: ${failedCount}`);

    return c.json({ 
      success: true, 
      campaign,
      message: `Campaign sent to ${sentCount} recipients, ${failedCount} failed` 
    });
  } catch (error) {
    console.error('Error sending campaign:', error);
    return c.json({ error: 'Failed to send campaign' }, 500);
  }
});

// Get all campaigns
app.get("/make-server-dee56b5b/email/campaigns", async (c) => {
  try {
    const campaigns = await kv.getByPrefix('campaign:');
    return c.json({ campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return c.json({ error: 'Failed to fetch campaigns' }, 500);
  }
});

// Get campaign details with recipients
app.get("/make-server-dee56b5b/email/campaign/:name", async (c) => {
  try {
    const name = c.req.param('name');
    const campaign = await kv.get(`campaign:${name}`);
    
    if (!campaign) {
      return c.json({ error: 'Campaign not found' }, 404);
    }

    const recipients = await kv.getByPrefix(`campaign-recipient:${name}:`);

    return c.json({ campaign, recipients });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return c.json({ error: 'Failed to fetch campaign' }, 500);
  }
});

// Track email open
app.get("/make-server-dee56b5b/email/track/open/:trackingId", async (c) => {
  try {
    const trackingId = c.req.param('trackingId');
    const [campaignName, email] = trackingId.split('-');
    
    const recipient = await kv.get(`campaign-recipient:${campaignName}:${email}`);
    
    if (recipient && !recipient.opened) {
      recipient.opened = true;
      recipient.openedAt = new Date().toISOString();
      await kv.set(`campaign-recipient:${campaignName}:${email}`, recipient);
      
      // Update campaign stats
      const campaign = await kv.get(`campaign:${campaignName}`);
      if (campaign) {
        campaign.openedCount = (campaign.openedCount || 0) + 1;
        await kv.set(`campaign:${campaignName}`, campaign);
      }
    }

    // Return 1x1 transparent pixel
    return new Response(
      new Uint8Array([
        0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00,
        0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x21,
        0xf9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2c, 0x00, 0x00,
        0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44,
        0x01, 0x00, 0x3b
      ]),
      {
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error tracking email open:', error);
    return new Response(null, { status: 204 });
  }
});

// Track email click
app.get("/make-server-dee56b5b/email/track/click/:trackingId", async (c) => {
  try {
    const trackingId = c.req.param('trackingId');
    const url = c.req.query('url');
    const [campaignName, email] = trackingId.split('-');
    
    const recipient = await kv.get(`campaign-recipient:${campaignName}:${email}`);
    
    if (recipient && !recipient.clicked) {
      recipient.clicked = true;
      recipient.clickedAt = new Date().toISOString();
      await kv.set(`campaign-recipient:${campaignName}:${email}`, recipient);
      
      // Update campaign stats
      const campaign = await kv.get(`campaign:${campaignName}`);
      if (campaign) {
        campaign.clickedCount = (campaign.clickedCount || 0) + 1;
        await kv.set(`campaign:${campaignName}`, campaign);
      }
    }

    // Redirect to actual URL
    return c.redirect(url || 'https://magrstore.com');
  } catch (error) {
    console.error('Error tracking email click:', error);
    return c.redirect('https://magrstore.com');
  }
});

// Get email analytics
app.get("/make-server-dee56b5b/email/analytics", async (c) => {
  try {
    const campaigns = await kv.getByPrefix('campaign:');
    const templates = await kv.getByPrefix('email-template:');
    const emails = await kv.getByPrefix('email:');
    
    const totalSent = campaigns.reduce((sum: number, c: any) => sum + (c.sentCount || 0), 0);
    const totalOpened = campaigns.reduce((sum: number, c: any) => sum + (c.openedCount || 0), 0);
    const totalClicked = campaigns.reduce((sum: number, c: any) => sum + (c.clickedCount || 0), 0);
    
    const analytics = {
      totalCampaigns: campaigns.length,
      totalTemplates: templates.length,
      totalEmailsSent: totalSent,
      totalEmailsOpened: totalOpened,
      totalEmailsClicked: totalClicked,
      openRate: totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(2) : 0,
      clickRate: totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(2) : 0,
      campaigns: campaigns.map((c: any) => ({
        name: c.name,
        sentCount: c.sentCount,
        openedCount: c.openedCount,
        clickedCount: c.clickedCount,
        openRate: c.sentCount > 0 ? ((c.openedCount / c.sentCount) * 100).toFixed(2) : 0,
        clickRate: c.sentCount > 0 ? ((c.clickedCount / c.sentCount) * 100).toFixed(2) : 0,
      })),
    };

    return c.json({ analytics });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

// Send welcome email to new subscriber
app.post("/make-server-dee56b5b/email/welcome", async (c) => {
  try {
    const { email, name } = await c.req.json();
    
    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    const subject = `Welcome to MAGR Store${name ? ', ' + name : ''}!`;
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px;">Welcome to MAGR Store!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 18px; color: #111827;">Hi ${name || 'there'},</p>
              <p style="margin: 0 0 20px; font-size: 16px; color: #6b7280; line-height: 1.6;">
                Thank you for subscribing to MAGR Store! We're excited to have you as part of our community.
              </p>
              <p style="margin: 0 0 30px; font-size: 16px; color: #6b7280; line-height: 1.6;">
                As a subscriber, you'll get exclusive access to:
              </p>
              <ul style="margin: 0 0 30px; padding-left: 20px; color: #6b7280; font-size: 16px; line-height: 1.8;">
                <li>Early access to new products</li>
                <li>Exclusive discounts and promotions</li>
                <li>Special deals just for subscribers</li>
                <li>Tips and recommendations</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://magrstore.com" style="display: inline-block; background-color: #f97316; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">Start Shopping</a>
              </div>
              <p style="margin: 30px 0 0; font-size: 14px; color: #9ca3af; line-height: 1.6;">
                If you have any questions, feel free to reach out to our support team at support@magrstore.com
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">© 2025 MAGR Store. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const result = await sendEmail(email, subject, html);

    if (result.success) {
      return c.json({ success: true, message: 'Welcome email sent' });
    } else {
      return c.json({ success: false, error: result.error }, 500);
    }
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return c.json({ error: 'Failed to send welcome email' }, 500);
  }
});

Deno.serve(app.fetch);