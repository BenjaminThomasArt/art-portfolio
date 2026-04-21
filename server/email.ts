import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.mail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

interface OrderConfirmationData {
  orderRef: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string | null;
  itemTitle: string;
  itemDetails: string;
  itemPrice: string;
  shippingZone: string;
  shippingCost: string;
  totalPrice: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  county?: string | null;
  postcode: string;
  country: string;
}

interface OrderStatusUpdateData {
  orderRef: string;
  buyerName: string;
  buyerEmail: string;
  itemTitle: string;
  newStatus: "shipped" | "delivered";
  trackingNumber?: string;
}

export async function sendOrderStatusUpdate(data: OrderStatusUpdateData): Promise<boolean> {
  const fromEmail = process.env.SMTP_USER || process.env.CONTACT_EMAIL || "benjaminthomasart@mail.com";

  const isShipped = data.newStatus === "shipped";
  const subject = isShipped
    ? `Your order ${data.orderRef} has been shipped`
    : `Your order ${data.orderRef} has been delivered`;
  const heading = isShipped ? "Your artwork is on its way" : "Your artwork has been delivered";
  const bodyText = isShipped
    ? `Great news! Your order <strong style="color:#003153;">${data.orderRef}</strong> for '${data.itemTitle}' has been shipped and is on its way to you.${data.trackingNumber ? ` Your tracking number is <strong>${data.trackingNumber}</strong>.` : ''}`
    : `Your order <strong style="color:#003153;">${data.orderRef}</strong> for '${data.itemTitle}' has been marked as delivered. We hope you love your new artwork!`;
  const plainBody = isShipped
    ? `Great news! Your order ${data.orderRef} for '${data.itemTitle}' has been shipped and is on its way to you.${data.trackingNumber ? ` Your tracking number is ${data.trackingNumber}.` : ''}`
    : `Your order ${data.orderRef} for '${data.itemTitle}' has been marked as delivered. We hope you love your new artwork!`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f3f0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3f0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #e5e5e5;">
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #e5e5e5;">
              <h1 style="margin:0;font-size:24px;font-weight:normal;color:#003153;font-family:Georgia,'Times New Roman',serif;">Benjamin Thomas</h1>
              <p style="margin:4px 0 0;font-size:13px;color:#888;">Fine art &amp; more</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <div style="text-align:center;margin-bottom:24px;">
                <div style="display:inline-block;width:48px;height:48px;border-radius:50%;background-color:${isShipped ? '#f0e6ff' : '#e6f7e6'};line-height:48px;font-size:24px;">${isShipped ? '\u{1F4E6}' : '\u{2705}'}</div>
              </div>
              <h2 style="margin:0 0 12px;font-size:20px;font-weight:normal;color:#003153;text-align:center;">${heading}</h2>
              <p style="margin:0;font-size:14px;color:#666;line-height:1.6;text-align:center;">
                Dear ${data.buyerName},
              </p>
              <p style="margin:12px 0 0;font-size:14px;color:#666;line-height:1.6;text-align:center;">
                ${bodyText}
              </p>
            </td>
          </tr>
          ${!isShipped ? `
          <tr>
            <td style="padding:0 40px 32px;">
              <div style="padding:16px;background-color:#f0f7ff;border:1px solid #d0e3f0;border-radius:4px;text-align:center;">
                <p style="margin:0;font-size:13px;color:#003153;line-height:1.6;">
                  If you love your artwork, we'd really appreciate it if you shared a photo of it in your space. Tag us on Instagram!
                </p>
              </div>
            </td>
          </tr>` : ''}
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e5e5e5;background-color:#fafaf8;">
              <p style="margin:0;font-size:12px;color:#888;line-height:1.6;">
                If you have any questions about your order, please reply to this email or get in touch via WhatsApp at +44 7597 765530.
              </p>
              <p style="margin:12px 0 0;font-size:12px;color:#aaa;">
                &copy; Benjamin Thomas Art
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const textContent = `
${heading}

Dear ${data.buyerName},

${plainBody}

If you have any questions, reply to this email or contact via WhatsApp at +44 7597 765530.

Benjamin Thomas Art
`;

  try {
    await transporter.sendMail({
      from: `"Benjamin Thomas Art" <${fromEmail}>`,
      to: data.buyerEmail,
      subject,
      text: textContent.trim(),
      html: htmlContent,
    });
    console.log(`[Email] Status update (${data.newStatus}) sent to ${data.buyerEmail} for ${data.orderRef}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send status update:", error);
    return false;
  }
}

// ─── Owner notification: new enquiry ────────────────────────────────
interface EnquiryNotificationData {
  type: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  artworkTitle?: string | null;
}

export async function sendOwnerEnquiryNotification(data: EnquiryNotificationData): Promise<boolean> {
  const fromEmail = process.env.SMTP_USER || process.env.CONTACT_EMAIL || "benjaminthomasart@mail.com";
  const ownerEmail = process.env.CONTACT_EMAIL || "benjaminthomasart@mail.com";

  const typeLabel = data.type === "print" ? "Print enquiry" : data.type === "commission" ? "Commission enquiry" : "Contact enquiry";

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f3f0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3f0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #e5e5e5;">
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #e5e5e5;">
              <h1 style="margin:0;font-size:24px;font-weight:normal;color:#003153;font-family:Georgia,'Times New Roman',serif;">Benjamin Thomas Art</h1>
              <p style="margin:4px 0 0;font-size:13px;color:#888;">Website notification</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <h2 style="margin:0 0 16px;font-size:20px;font-weight:normal;color:#003153;">New ${typeLabel}</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e5e5;">
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #e5e5e5;background-color:#fafaf8;">
                    <p style="margin:0 0 2px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">From</p>
                    <p style="margin:0;font-size:14px;color:#333;">${data.name} (${data.email})${data.phone ? ` — ${data.phone}` : ''}</p>
                  </td>
                </tr>
                ${data.artworkTitle ? `<tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #e5e5e5;">
                    <p style="margin:0 0 2px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Artwork</p>
                    <p style="margin:0;font-size:14px;color:#333;">'${data.artworkTitle}'</p>
                  </td>
                </tr>` : ''}
                <tr>
                  <td style="padding:12px 16px;">
                    <p style="margin:0 0 2px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
                    <p style="margin:0;font-size:14px;color:#333;line-height:1.6;">${data.message.replace(/\n/g, '<br>')}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 0;font-size:13px;color:#666;">Reply directly to this email to respond to ${data.name}.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e5e5e5;background-color:#fafaf8;">
              <p style="margin:0;font-size:12px;color:#aaa;">&copy; Benjamin Thomas Art — Website Notification</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const textContent = `New ${typeLabel}\n\nFrom: ${data.name} (${data.email})${data.phone ? ` — ${data.phone}` : ''}${data.artworkTitle ? `\nArtwork: '${data.artworkTitle}'` : ''}\n\nMessage:\n${data.message}\n\nReply to this email to respond to ${data.name}.`;

  try {
    await transporter.sendMail({
      from: `"Benjamin Thomas Art" <${fromEmail}>`,
      to: ownerEmail,
      replyTo: data.email,
      subject: `${typeLabel} from ${data.name}`,
      text: textContent,
      html: htmlContent,
    });
    console.log(`[Email] Owner enquiry notification sent for ${typeLabel} from ${data.name}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send owner enquiry notification:", error);
    return false;
  }
}

// ─── Owner notification: new order ─────────────────────────────────
export async function sendOwnerOrderNotification(data: OrderConfirmationData): Promise<boolean> {
  const fromEmail = process.env.SMTP_USER || process.env.CONTACT_EMAIL || "benjaminthomasart@mail.com";
  const ownerEmail = process.env.CONTACT_EMAIL || "benjaminthomasart@mail.com";

  const shippingZoneLabel = data.shippingZone === "uk" ? "UK" : data.shippingZone === "europe" ? "Europe" : "Rest of World";
  const addressParts = [data.addressLine1, data.addressLine2, data.city, data.county, data.postcode, data.country].filter(Boolean);

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f3f0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3f0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #e5e5e5;">
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #e5e5e5;">
              <h1 style="margin:0;font-size:24px;font-weight:normal;color:#003153;font-family:Georgia,'Times New Roman',serif;">Benjamin Thomas Art</h1>
              <p style="margin:4px 0 0;font-size:13px;color:#888;">Website notification</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <h2 style="margin:0 0 16px;font-size:20px;font-weight:normal;color:#003153;">💰 New Order — ${data.orderRef}</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e5e5;">
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #e5e5e5;background-color:#fafaf8;">
                    <p style="margin:0 0 2px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Item</p>
                    <p style="margin:0;font-size:15px;color:#333;">'${data.itemTitle}'</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#666;">${data.itemDetails}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #e5e5e5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="font-size:13px;color:#666;">Item price</td><td align="right" style="font-size:13px;color:#333;">${data.itemPrice}</td></tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #e5e5e5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="font-size:13px;color:#666;">Delivery (${shippingZoneLabel})</td><td align="right" style="font-size:13px;color:#333;">${data.shippingCost}</td></tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;background-color:#fafaf8;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="font-size:14px;font-weight:bold;color:#003153;">Total</td><td align="right" style="font-size:14px;font-weight:bold;color:#003153;">${data.totalPrice}</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
              <div style="margin-top:20px;">
                <p style="margin:0 0 4px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Buyer</p>
                <p style="margin:0;font-size:14px;color:#333;">${data.buyerName} (${data.buyerEmail})${data.buyerPhone ? ` — ${data.buyerPhone}` : ''}</p>
              </div>
              <div style="margin-top:16px;">
                <p style="margin:0 0 4px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Ship to</p>
                <p style="margin:0;font-size:14px;color:#333;line-height:1.6;">${addressParts.join('<br>')}</p>
              </div>
              <div style="margin-top:20px;padding:16px;background-color:#fff8e1;border:1px solid #ffe082;border-radius:4px;">
                <p style="margin:0;font-size:13px;color:#333;line-height:1.6;">Check your PayPal for the incoming payment. The buyer has been asked to include <strong>${data.orderRef}</strong> in the payment note.</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e5e5e5;background-color:#fafaf8;">
              <p style="margin:0;font-size:12px;color:#aaa;">&copy; Benjamin Thomas Art — Website Notification</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const textContent = `New Order — ${data.orderRef}\n\nItem: '${data.itemTitle}'\nDetails: ${data.itemDetails}\nItem price: ${data.itemPrice}\nDelivery (${shippingZoneLabel}): ${data.shippingCost}\nTotal: ${data.totalPrice}\n\nBuyer: ${data.buyerName} (${data.buyerEmail})${data.buyerPhone ? ` — ${data.buyerPhone}` : ''}\n\nShip to:\n${addressParts.join('\n')}\n\nCheck your PayPal for the incoming payment.`;

  try {
    await transporter.sendMail({
      from: `"Benjamin Thomas Art" <${fromEmail}>`,
      to: ownerEmail,
      replyTo: data.buyerEmail,
      subject: `New order ${data.orderRef}: '${data.itemTitle}'`,
      text: textContent,
      html: htmlContent,
    });
    console.log(`[Email] Owner order notification sent for ${data.orderRef}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send owner order notification:", error);
    return false;
  }
}

export async function sendOrderConfirmation(data: OrderConfirmationData): Promise<boolean> {
  const fromEmail = process.env.SMTP_USER || process.env.CONTACT_EMAIL || "benjaminthomasart@mail.com";
  
  const shippingZoneLabel = data.shippingZone === "uk" ? "UK" : data.shippingZone === "europe" ? "Europe" : "Rest of World";
  
  const addressParts = [
    data.addressLine1,
    data.addressLine2,
    data.city,
    data.county,
    data.postcode,
    data.country,
  ].filter(Boolean);

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f3f0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3f0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #e5e5e5;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #e5e5e5;">
              <h1 style="margin:0;font-size:24px;font-weight:normal;color:#003153;font-family:Georgia,'Times New Roman',serif;">Benjamin Thomas</h1>
              <p style="margin:4px 0 0;font-size:13px;color:#888;">Fine art &amp; more</p>
            </td>
          </tr>
          
          <!-- Confirmation -->
          <tr>
            <td style="padding:32px 40px 16px;">
              <h2 style="margin:0 0 8px;font-size:20px;font-weight:normal;color:#003153;">Order confirmed</h2>
              <p style="margin:0;font-size:14px;color:#666;line-height:1.6;">
                Thank you for your order, ${data.buyerName}. Your order reference is <strong style="color:#003153;">${data.orderRef}</strong>.
              </p>
            </td>
          </tr>
          
          <!-- Order Details -->
          <tr>
            <td style="padding:16px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e5e5;">
                <tr>
                  <td style="padding:16px;border-bottom:1px solid #e5e5e5;background-color:#fafaf8;">
                    <p style="margin:0 0 4px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Item</p>
                    <p style="margin:0;font-size:15px;color:#333;">'${data.itemTitle}'</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#666;">${data.itemDetails}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #e5e5e5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:13px;color:#666;">Item price</td>
                        <td align="right" style="font-size:13px;color:#333;">${data.itemPrice}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #e5e5e5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:13px;color:#666;">Delivery (${shippingZoneLabel})</td>
                        <td align="right" style="font-size:13px;color:#333;">${data.shippingCost}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;background-color:#fafaf8;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:14px;font-weight:bold;color:#003153;">Total</td>
                        <td align="right" style="font-size:14px;font-weight:bold;color:#003153;">${data.totalPrice}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Shipping Address -->
          <tr>
            <td style="padding:16px 40px;">
              <p style="margin:0 0 8px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Shipping to</p>
              <p style="margin:0;font-size:14px;color:#333;line-height:1.6;">
                ${addressParts.join('<br>')}
              </p>
            </td>
          </tr>
          
          <!-- Payment Note -->
          <tr>
            <td style="padding:16px 40px 32px;">
              <div style="padding:16px;background-color:#f0f7ff;border:1px solid #d0e3f0;border-radius:4px;">
                <p style="margin:0;font-size:13px;color:#003153;line-height:1.6;">
                  Please include your order reference <strong>${data.orderRef}</strong> in the PayPal payment note so we can match your payment to this order. Once payment is confirmed, we'll begin preparing your artwork for dispatch.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e5e5e5;background-color:#fafaf8;">
              <p style="margin:0;font-size:12px;color:#888;line-height:1.6;">
                If you have any questions about your order, please reply to this email or get in touch via WhatsApp at +44 7597 765530.
              </p>
              <p style="margin:12px 0 0;font-size:12px;color:#aaa;">
                &copy; Benjamin Thomas Art
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const textContent = `
Order Confirmation — ${data.orderRef}

Thank you for your order, ${data.buyerName}.

Order Reference: ${data.orderRef}

Item: '${data.itemTitle}'
Details: ${data.itemDetails}
Item price: ${data.itemPrice}
Delivery (${shippingZoneLabel}): ${data.shippingCost}
Total: ${data.totalPrice}

Shipping to:
${addressParts.join('\n')}

Please include your order reference ${data.orderRef} in the PayPal payment note so we can match your payment to this order. Once payment is confirmed, we'll begin preparing your artwork for dispatch.

If you have any questions, reply to this email or contact via WhatsApp at +44 7597 765530.

Benjamin Thomas Art
`;

  try {
    await transporter.sendMail({
      from: `"Benjamin Thomas Art" <${fromEmail}>`,
      to: data.buyerEmail,
      subject: `Order confirmation — ${data.orderRef}`,
      text: textContent.trim(),
      html: htmlContent,
    });
    console.log(`[Email] Order confirmation sent to ${data.buyerEmail} for ${data.orderRef}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send order confirmation:", error);
    return false;
  }
}
