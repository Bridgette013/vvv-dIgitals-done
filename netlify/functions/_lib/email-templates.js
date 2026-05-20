/**
 * Email templates for SendGrid delivery.
 * Pure functions — return { subject, html, text }.
 */

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function prettyFilename(filename) {
  return filename
    .replace(/\.pdf$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderReceiptEmail({
  customerName,
  productName,
  downloads,
  toolUrl,
  licenseToken,
  siteUrl,
  supportEmail,
}) {
  const subject = `Your ${productName} is ready`;

  const downloadsHtml = downloads
    .map(
      (d) => `
        <tr>
          <td style="padding:8px 0;font-family:Georgia,serif;font-size:15px;color:#222;">
            ${escapeHtml(prettyFilename(d.filename))}
          </td>
          <td style="padding:8px 0;text-align:right;">
            <a href="${d.url}" style="color:#1a4d8c;text-decoration:underline;font-family:Georgia,serif;font-size:15px;">Download</a>
          </td>
        </tr>`
    )
    .join('');

  const toolBlockHtml = toolUrl
    ? `
        <p style="font-family:Georgia,serif;font-size:15px;line-height:1.6;color:#222;">
          <strong>Calculator access:</strong>
          <a href="${toolUrl}" style="color:#1a4d8c;">Open your calculator</a>.
          Bookmark the page — your license is attached to the link.
        </p>`
    : '';

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f7f5f0;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:4px;padding:40px 36px;max-width:600px;">
        <tr><td>
          <p style="margin:0 0 8px;font-family:Georgia,serif;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#6b6b6b;">VVV Digitals</p>
          <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:26px;font-weight:400;color:#1a1a1a;">
            Your toolkit is ready, ${escapeHtml(customerName)}.
          </h1>
          <p style="font-family:Georgia,serif;font-size:15px;line-height:1.6;color:#222;">
            Thank you for purchasing the <strong>${escapeHtml(productName)}</strong>. Everything you need is below.
          </p>
          ${toolBlockHtml}
          <h2 style="margin:28px 0 12px;font-family:Georgia,serif;font-size:18px;font-weight:400;color:#1a1a1a;border-bottom:1px solid #e0d9c8;padding-bottom:6px;">Your downloads</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            ${downloadsHtml}
          </table>
          <p style="margin:24px 0 0;font-family:Georgia,serif;font-size:13px;line-height:1.5;color:#6b6b6b;">
            Download links are valid for 7 days. Need fresh links? Reply to this email or contact
            <a href="mailto:${supportEmail}" style="color:#6b6b6b;">${supportEmail}</a>.
          </p>
          <h2 style="margin:28px 0 12px;font-family:Georgia,serif;font-size:18px;font-weight:400;color:#1a1a1a;border-bottom:1px solid #e0d9c8;padding-bottom:6px;">Your license key</h2>
          <pre style="margin:0;padding:12px;background:#f4f1ea;border-radius:3px;font-family:'Courier New',monospace;font-size:11px;line-height:1.4;color:#1a1a1a;white-space:pre-wrap;word-break:break-all;">${escapeHtml(licenseToken)}</pre>
          <p style="margin:16px 0 0;font-family:Georgia,serif;font-size:13px;line-height:1.5;color:#6b6b6b;">
            Save this key. Paste it into the calculator if your bookmark expires.
          </p>
          <hr style="margin:32px 0;border:none;border-top:1px solid #e0d9c8;"/>
          <p style="font-family:Georgia,serif;font-size:12px;line-height:1.5;color:#888;">
            <strong>Educational use only.</strong> This toolkit is not legal or claims advice. It is not affiliated with the U.S. Department of Veterans Affairs. For representation in your VA claim, consult an accredited attorney, claims agent, or Veterans Service Organization.
          </p>
          <p style="margin:16px 0 0;font-family:Georgia,serif;font-size:12px;line-height:1.5;color:#888;">
            VVV Digitals LLC · Glendale, AZ · ${siteUrl.replace('https://','')}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `Your toolkit is ready, ${customerName}.`,
    '',
    `Thank you for purchasing the ${productName}.`,
    '',
    toolUrl ? `Calculator access: ${toolUrl}` : '',
    '',
    'Your downloads (links valid 7 days):',
    ...downloads.map((d) => `  - ${prettyFilename(d.filename)}: ${d.url}`),
    '',
    'Your license key (save this):',
    licenseToken,
    '',
    `Need fresh links? Email ${supportEmail}`,
    '',
    '— Educational use only. Not legal or claims advice. Not affiliated with the U.S. Department of Veterans Affairs.',
    '',
    'VVV Digitals LLC · Glendale, AZ',
  ]
    .filter(Boolean)
    .join('\n');

  return { subject, html, text };
}

module.exports = { renderReceiptEmail };
