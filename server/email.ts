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
