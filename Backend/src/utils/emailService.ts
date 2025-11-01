import nodemailer from "nodemailer";
import {
  emailHost,
  emailPort,
  emailUser,
  emailPassword,
  companyEmail,
  companyName,
} from "../secrets";

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: emailHost,
    port: parseInt(emailPort || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
};

// Generate order confirmation email HTML
const generateOrderEmailHTML = (orderData: any) => {
  const { order, user, items, address } = orderData;

  const itemsHTML = items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <div style="display: flex; align-items: center;">
          <img src="${
            item.product.image_url1 ||
            item.product.image_url2 ||
            "/placeholder.jpg"
          }" 
               alt="${item.product.name}" 
               style="width: 60px; height: 60px; object-fit: cover; margin-right: 12px; border-radius: 8px;">
          <div>
            <h4 style="margin: 0; color: #333; font-size: 16px;">${
              item.product.name
            }</h4>
            <p style="margin: 4px 0; color: #666; font-size: 14px;">Category: ${
              item.product.category?.name || "N/A"
            }</p>
            
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        RS ${Number(item.price_at_purchase).toFixed(2)}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
        RS ${(Number(item.price_at_purchase) * item.quantity).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - ${companyName}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e0e0e0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; border-radius: 0 0 10px 10px; }
        .order-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th { background: #667eea; color: white; padding: 12px; text-align: left; }
        .table td { padding: 12px; border-bottom: 1px solid #eee; }
        .total-row { background: #f8f9fa; font-weight: bold; }
        .address-box { background: #f0f8ff; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #667eea; }
        .status-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .status-pending { background: #fff3cd; color: #856404; }
        .btn { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">${companyName}</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Order Confirmation</p>
        </div>
        
        <div class="content">
          <h2 style="color: #667eea; margin-bottom: 20px;">Thank you for your order, ${
            user.first_name
          }!</h2>
          
          <p>We're excited to confirm that we've received your order. Here are the details:</p>
          
          <div class="order-details">
            <h3 style="margin-top: 0; color: #333;">Order Information</h3>
            <p><strong>Order ID:</strong> ${order.order_id}</p>
            <p><strong>Order Date:</strong> ${new Date(
              order.createdAt
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${
              order.status
            }">${order.status}</span></p>
            <p><strong>Total Amount:</strong> RS ${Number(
              order.total_amount
            ).toFixed(2)}</p>
          </div>

          <div class="address-box">
            <h3 style="margin-top: 0; color: #333;">Delivery Address</h3>
            <p style="margin: 5px 0;"><strong>${user.first_name} ${
    user.last_name
  }</strong></p>
            <p style="margin: 5px 0;">${address.address_line_1}</p>
            ${
              address.address_line_2
                ? `<p style="margin: 5px 0;">${address.address_line_2}</p>`
                : ""
            }
            <p style="margin: 5px 0;">${address.city}, ${address.state} ${
    address.postal_code
  }</p>
            <p style="margin: 5px 0;">${address.country}</p>
            ${
              address.phone
                ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${address.phone}</p>`
                : ""
            }
          </div>

          <h3 style="color: #333; margin-bottom: 15px;">Order Items</h3>
          <table class="table">
            <thead>
              <tr>
                <th style="width: 50%;">Product</th>
                <th style="width: 15%; text-align: center;">Quantity</th>
                <th style="width: 17.5%; text-align: right;">Unit Price</th>
                <th style="width: 17.5%; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
              <tr class="total-row">
                <td colspan="3" style="text-align: right; padding: 15px;">
                  <strong>Total Amount:</strong>
                </td>
                <td style="text-align: right; padding: 15px;">
                  <strong>RS ${Number(order.total_amount).toFixed(2)}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <div style="margin: 30px 0; text-align: center;">
            <p>You can track your order status anytime in your account.</p>
            <a href="#" class="btn">Track Your Order</a>
          </div>

          <div style="background: #f0f8ff; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea;">
            <h4 style="margin-top: 0; color: #333;">What's Next?</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>We'll send you a shipping confirmation with tracking details once your order ships</li>
              <li>Estimated delivery: 5-7 business days</li>
              <li>Questions? Contact our support team</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
          <p style="margin: 10px 0 0 0; font-size: 14px;">
            If you have any questions, please contact us at <a href="mailto:${companyEmail}" style="color: #667eea;">${companyEmail}</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (orderData: any) => {
  try {
    if (!emailHost || !emailUser || !emailPassword) {
      console.warn("Email configuration not found. Skipping email send.");
      return { success: false, message: "Email configuration not found" };
    }

    const transporter = createTransporter();
    const { user, order } = orderData;

    const mailOptions = {
      from: `"${companyName}" <${emailUser}>`,
      to: user.email,
      subject: `Order Confirmation #${order.order_id} - ${companyName}`,
      html: generateOrderEmailHTML(orderData),
      // Also send a plain text version
      text: `
Dear ${user.first_name},

Thank you for your order with ${companyName}!

Order Details:
- Order ID: ${order.order_id}
- Date: ${new Date(order.createdAt).toLocaleDateString()}
- Total: $${Number(order.total_amount).toFixed(2)}
- Status: ${order.status}

We'll send you a shipping confirmation once your order is on its way.

Thank you for shopping with us!

Best regards,
The ${companyName} Team
${companyEmail}
      `.trim(),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      message: "Order confirmation email sent successfully",
    };
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to send order confirmation email",
    };
  }
};

// Send order status update email
export const sendOrderStatusUpdateEmail = async (
  orderData: any,
  newStatus: string
) => {
  try {
    if (!emailHost || !emailUser || !emailPassword) {
      console.warn("Email configuration not found. Skipping email send.");
      return { success: false, message: "Email configuration not found" };
    }

    const transporter = createTransporter();
    const { user, order } = orderData;

    const statusMessages: {
      [key: string]: { subject: string; message: string; color: string };
    } = {
      confirmed: {
        subject: "Order Confirmed",
        message:
          "Your order has been confirmed and is being prepared for shipping.",
        color: "#28a745",
      },
      processing: {
        subject: "Order Processing",
        message: "Your order is currently being processed and packed.",
        color: "#ffc107",
      },
      shipped: {
        subject: "Order Shipped",
        message:
          "Great news! Your order has been shipped and is on its way to you.",
        color: "#17a2b8",
      },
      delivered: {
        subject: "Order Delivered",
        message:
          "Your order has been successfully delivered. We hope you enjoy your purchase!",
        color: "#28a745",
      },
      cancelled: {
        subject: "Order Cancelled",
        message:
          "Your order has been cancelled. If you did not request this cancellation, please contact support.",
        color: "#dc3545",
      },
    };

    const statusInfo = statusMessages[newStatus] || {
      subject: "Order Status Update",
      message: `Your order status has been updated to: ${newStatus}`,
      color: "#6c757d",
    };

    const mailOptions = {
      from: `"${companyName}" <${emailUser}>`,
      to: user.email,
      subject: `${statusInfo.subject} - Order #${order.order_id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: ${
            statusInfo.color
          }; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">${companyName}</h1>
            <h2 style="margin: 10px 0 0 0;">${statusInfo.subject}</h2>
          </div>
          
          <div style="background: white; padding: 20px; border: 1px solid #e0e0e0;">
            <p>Dear ${user.first_name},</p>
            <p>${statusInfo.message}</p>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p><strong>Order ID:</strong> ${order.order_id}</p>
              <p><strong>Status:</strong> <span style="color: ${
                statusInfo.color
              }; font-weight: bold; text-transform: uppercase;">${newStatus}</span></p>
              <p><strong>Total:</strong> RS${Number(order.total_amount).toFixed(
                2
              )}</p>
            </div>
            
            <p>Thank you for choosing ${companyName}!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="margin: 0;">Questions? Contact us at <a href="mailto:${companyEmail}">${companyEmail}</a></p>
          </div>
        </div>
      `,
      text: `
Dear ${user.first_name},

${statusInfo.message}

Order Details:
- Order ID: ${order.order_id}
- Status: ${newStatus}
- Total: RS${Number(order.total_amount).toFixed(2)}

Thank you for choosing ${companyName}!

Contact us: ${companyEmail}
      `.trim(),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Order status update email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      message: "Order status update email sent successfully",
    };
  } catch (error) {
    console.error("Error sending order status update email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to send order status update email",
    };
  }
};

export default {
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
};
