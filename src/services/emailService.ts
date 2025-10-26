interface OrderDetails {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  currency: string;
  shippingAddress: string;
  paymentMethod: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
}

export class EmailService {
  private static generateOrderEmailHTML(
    orderDetails: OrderDetails,
    status: "success" | "failed",
  ): string {
    const isSuccess = status === "success";
    const statusColor = isSuccess ? "#10b981" : "#ef4444";
    const statusIcon = isSuccess ? "✓" : "✗";
    const statusText = isSuccess
      ? "Payment Successful"
      : "Payment Failed";
    const statusMessage = isSuccess
      ? "Thank you for your order! Your payment has been processed successfully."
      : "We were unable to process your payment. Please try again or contact support.";

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order ${status === "success" ? "Confirmation" : "Failed"}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">MAGR Store</h1>
            </td>
          </tr>

          <!-- Status Badge -->
          <tr>
            <td style="padding: 30px 30px 20px; text-align: center;">
              <div style="display: inline-block; background-color: ${statusColor}; color: #ffffff; padding: 12px 24px; border-radius: 50px; font-size: 16px; font-weight: 600;">
                <span style="font-size: 20px; margin-right: 8px;">${statusIcon}</span>
                ${statusText}
              </div>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <p style="margin: 0; font-size: 16px; color: #6b7280; line-height: 1.5;">${statusMessage}</p>
            </td>
          </tr>

          <!-- Order Details -->
          <tr>
            <td style="padding: 0 30px 20px;">
              <h2 style="margin: 0 0 20px; font-size: 20px; color: #111827;">Order Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Order ID:</td>
                  <td style="padding: 8px 0; text-align: right; color: #111827; font-weight: 600; font-size: 14px;">${orderDetails.orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date:</td>
                  <td style="padding: 8px 0; text-align: right; color: #111827; font-size: 14px;">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Payment Method:</td>
                  <td style="padding: 8px 0; text-align: right; color: #111827; font-size: 14px;">${orderDetails.paymentMethod}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="padding: 0 30px 20px;">
              <h3 style="margin: 0 0 15px; font-size: 18px; color: #111827;">Items Ordered</h3>
              <table style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px;">
                ${orderDetails.items
                  .map(
                    (item, index) => `
                  <tr style="${index !== 0 ? "border-top: 1px solid #e5e7eb;" : ""}">
                    <td style="padding: 15px;">
                      <div style="font-size: 14px; color: #111827; font-weight: 500;">${item.name}</div>
                      <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Qty: ${item.quantity}</div>
                    </td>
                    <td style="padding: 15px; text-align: right; color: #111827; font-weight: 600;">${orderDetails.currency}${item.price.toFixed(2)}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </table>
            </td>
          </tr>

          <!-- Total -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 15px 0; border-top: 2px solid #e5e7eb; font-size: 18px; font-weight: bold; color: #111827;">Total</td>
                  <td style="padding: 15px 0; border-top: 2px solid #e5e7eb; text-align: right; font-size: 20px; font-weight: bold; color: #f97316;">${orderDetails.currency}${orderDetails.total.toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>

          ${
            isSuccess
              ? `
          <!-- Shipping Address -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h3 style="margin: 0 0 10px; font-size: 18px; color: #111827;">Shipping Address</h3>
              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">${orderDetails.shippingAddress}</p>
            </td>
          </tr>

          <!-- Next Steps -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px;">
                <p style="margin: 0 0 8px; font-weight: 600; color: #92400e; font-size: 14px;">What's Next?</p>
                <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">We're processing your order and will send you a tracking number once your items ship. Estimated delivery: 2-3 business days.</p>
              </div>
            </td>
          </tr>
          `
              : `
          <!-- Retry Payment -->
          <tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <a href="#" style="display: inline-block; background-color: #f97316; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 16px;">Retry Payment</a>
              <p style="margin: 15px 0 0; color: #6b7280; font-size: 13px;">Need help? Contact our support team</p>
            </td>
          </tr>
          `
          }

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #9ca3af; font-size: 13px;">Questions? Contact us at support@magrstore.com or +234 808 929 9224</p>
              <p style="margin: 0 0 15px; color: #9ca3af; font-size: 13px;">Canaan Land, Ota, Ogun State, Nigeria</p>
              <div style="margin-top: 20px;">
                <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 12px; margin: 0 10px;">Unsubscribe</a>
                <span style="color: #d1d5db;">|</span>
                <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 12px; margin: 0 10px;">Privacy Policy</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  static async sendOrderConfirmation(
    orderDetails: OrderDetails,
    status: "success" | "failed",
  ): Promise<void> {
    const emailHTML = this.generateOrderEmailHTML(
      orderDetails,
      status,
    );

    // In a real implementation, you would send this to your email service
    // For now, we'll log it and show a notification
    console.log(
      "📧 Email would be sent to:",
      orderDetails.customerEmail,
    );
    console.log(
      "Subject:",
      status === "success"
        ? "Order Confirmation"
        : "Payment Failed",
    );
    console.log("HTML:", emailHTML);

    // Store email in localStorage for demonstration
    const emailLog = {
      to: orderDetails.customerEmail,
      subject:
        status === "success"
          ? `Order Confirmation #${orderDetails.orderId}`
          : `Payment Failed #${orderDetails.orderId}`,
      html: emailHTML,
      sentAt: new Date().toISOString(),
      status,
    };

    const existingLogs = JSON.parse(
      localStorage.getItem("emailLogs") || "[]",
    );
    existingLogs.push(emailLog);
    localStorage.setItem(
      "emailLogs",
      JSON.stringify(existingLogs),
    );

    // In production, integrate with email service:
    // await fetch('YOUR_EMAIL_API_ENDPOINT', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     to: orderDetails.customerEmail,
    //     subject: emailLog.subject,
    //     html: emailHTML,
    //   }),
    // });
  }

  static async sendWelcomeEmail(
    email: string,
    name?: string,
  ): Promise<void> {
    console.log("📧 Welcome email would be sent to:", email);
    // Similar implementation for welcome emails
  }
}

// Export mock function for testing
export function mockOrderConfirmation(
  status: "success" | "failed" = "success",
) {
  const mockOrder: OrderDetails = {
    orderId: `ORD-${Date.now()}`,
    customerName: "John Doe",
    customerEmail: "customer@example.com",
    items: [
      {
        name: "Wireless Earbuds Pro",
        quantity: 1,
        price: 49.99,
      },
      {
        name: "Smart Watch Series 5",
        quantity: 1,
        price: 199.99,
      },
    ],
    total: 249.98,
    currency: "$",
    shippingAddress:
      "123 Main Street, Apt 4B, New York, NY 10001, United States",
    paymentMethod: "Credit Card (**** 1234)",
  };

  EmailService.sendOrderConfirmation(mockOrder, status);
}