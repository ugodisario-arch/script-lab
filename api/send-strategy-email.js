// File: /api/send-strategy-email.js
// Vercel Serverless Function

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Accepter uniquement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { to, subject, strategy, answers, salesWhispererCTA } = req.body;

    // Générer le HTML de l'email
    const emailHtml = generateEmailHTML(strategy, answers, salesWhispererCTA);

    // Envoyer l'email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Ugo - Script Lab PRO <ugo@saleswhisperer.io>',
      to: [to],
      subject: `Votre stratégie pour ${answers.company_name || 'votre entreprise'}`, // Sujet sans emoji
      html: emailHtml,
    });

    if (error) {
      console.error('❌ Erreur Resend:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('✅ Email envoyé avec succès:', data);
    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    return res.status(500).json({ error: error.message });
  }
}

function generateEmailHTML(strategy, answers, salesWhispererCTA) {
  const companyName = answers.company_name || 'votre entreprise';
  const callType = answers.call_type === 'cold' ? 'Cold Call' : 'Call Qualifié';
  const firstName = answers.company_name ? answers.company_name.split(' ')[0] : 'vous';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      color: #1a1a1a;
      line-height: 1.6;
    }
    .email-wrapper {
      background-color: #f5f5f5;
      padding: 40px 20px;
    }
    .email-content {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    .header {
      background-color: #3b82f6;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 24px;
      font-weight: 600;
    }
    .header p {
      margin: 8px 0 0 0;
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
    }
    .body-content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 16px;
      color: #1a1a1a;
      margin-bottom: 20px;
    }
    .intro-text {
      font-size: 15px;
      color: #374151;
      margin-bottom: 30px;
      line-height: 1.7;
    }
    .context-box {
      background-color: #f9fafb;
      border-left: 4px solid #3b82f6;
      padding: 20px;
      margin: 30px 0;
      border-radius: 4px;
    }
    .context-box h3 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .context-items {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .context-item {
      font-size: 14px;
    }
    .context-label {
      color: #6b7280;
      font-size: 13px;
    }
    .context-value {
      color: #1a1a1a;
      font-weight: 600;
    }
    .section {
      margin: 30px 0;
      padding-bottom: 30px;
      border-bottom: 1px solid #e5e7eb;
    }
    .section:last-of-type {
      border-bottom: none;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 16px 0;
    }
    .section-content {
      color: #374151;
      font-size: 15px;
      line-height: 1.7;
      white-space: pre-wrap;
    }
    ul {
      padding-left: 20px;
      margin: 0;
    }
    li {
      margin-bottom: 12px;
      color: #374151;
      line-height: 1.6;
    }
    .email-box {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 20px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: #1f2937;
      line-height: 1.6;
    }
    .cta-section {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border: 2px solid #3b82f6;
      border-radius: 8px;
      padding: 30px;
      margin: 40px 0;
      text-align: center;
    }
    .cta-badge {
      display: inline-block;
      background-color: #3b82f6;
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }
    .cta-title {
      font-size: 22px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 12px 0;
      line-height: 1.3;
    }
    .cta-description {
      font-size: 15px;
      color: #4b5563;
      margin: 0 0 24px 0;
      line-height: 1.6;
    }
    .cta-link {
      display: inline-block;
      background-color: #3b82f6;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 15px;
      margin-bottom: 20px;
      transition: background-color 0.2s;
    }
    .cta-features {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
      margin-top: 16px;
      font-size: 13px;
      color: #6b7280;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
    }
    .signature {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    .signature-name {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 4px 0;
    }
    .signature-title {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
    }
    @media only screen and (max-width: 600px) {
      .email-wrapper { padding: 20px 10px; }
      .body-content { padding: 30px 20px; }
      .context-items { grid-template-columns: 1fr; }
      .cta-section { padding: 24px 20px; }
      .cta-title { font-size: 20px; }
    }
    /* Support mode sombre */
    @media (prefers-color-scheme: dark) {
      .email-wrapper { background-color: #1a1a1a !important; }
      .email-content { background-color: #262626 !important; }
      .greeting, .section-title, .cta-title, .signature-name { color: #f5f5f5 !important; }
      .intro-text, .section-content, li, .cta-description { color: #d1d5db !important; }
      .context-box { background-color: #1f2937 !important; }
      .email-box { background-color: #1f2937 !important; border-color: #374151 !important; color: #d1d5db !important; }
      .footer { background-color: #1f2937 !important; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-content">
      <!-- Header -->
      <div class="header">
        <h1>Script Lab PRO</h1>
        <p>by Sales Whisperer</p>
      </div>

      <!-- Body -->
      <div class="body-content">
        <div class="greeting">
          Bonjour,
        </div>

        <div class="intro-text">
          Votre stratégie commerciale personnalisée pour <strong>${companyName}</strong> est prête. J'ai analysé votre contexte et préparé un plan d'action complet adapté à votre situation.
        </div>

        <!-- Context Box -->
        <div class="context-box">
          <h3>Votre contexte</h3>
          <div class="context-items">
            <div class="context-item">
              <div class="context-label">Type d'appel</div>
              <div class="context-value">${callType}</div>
            </div>
            <div class="context-item">
              <div class="context-label">Marché</div>
              <div class="context-value">${answers.market || 'N/A'}</div>
            </div>
            <div class="context-item">
              <div class="context-label">Interlocuteur</div>
              <div class="context-value">${answers.prospect_title || 'N/A'}</div>
            </div>
            <div class="context-item">
              <div class="context-label">Objectif</div>
              <div class="context-value">${answers.call_objective || 'N/A'}</div>
            </div>
          </div>
        </div>

        <!-- Strategy Sections -->
        <div class="section">
          <h2 class="section-title">📞 Introduction</h2>
          <div class="section-content">${strategy.intro}</div>
        </div>

        <div class="section">
          <h2 class="section-title">🎯 Questions de Découverte</h2>
          <ul>
            ${strategy.discovery.map(q => `<li>${q}</li>`).join('')}
          </ul>
        </div>

        <div class="section">
          <h2 class="section-title">✨ Positionnement de Valeur</h2>
          <div class="section-content">${strategy.value_positioning}</div>
        </div>

        <div class="section">
          <h2 class="section-title">⚡ Différenciation</h2>
          <div class="section-content">${strategy.differentiation}</div>
        </div>

        <div class="section">
          <h2 class="section-title">🛡️ Traitement Objection</h2>
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 12px 0;"><strong>${answers.top_objection}</strong></p>
          <div class="section-content">${strategy.objection_handling[answers.top_objection]}</div>
        </div>

        <div class="section">
          <h2 class="section-title">✅ Closing</h2>
          <div class="section-content">${strategy.closing}</div>
        </div>

        <div class="section">
          <h2 class="section-title">📧 Email de Suivi</h2>
          <div class="email-box">${strategy.follow_up_email}</div>
        </div>

        <!-- Sales Whisperer CTA - Version sobre -->
        <div class="cta-section">
          <div class="cta-badge">Passez au niveau supérieur</div>
          <h3 class="cta-title">Et si vous aviez ces insights en temps réel ?</h3>
          <p class="cta-description">
            Sales Whisperer analyse vos conversations pendant vos appels et vous suggère exactement quoi dire au moment précis où vous en avez besoin.
          </p>
          <a href="${salesWhispererCTA.url}" class="cta-link">
            Rejoindre la Waitlist Sales Whisperer
          </a>
          <div class="cta-features">
            <span>✓ Temps réel</span>
            <span>✓ IA Fine-Tuned</span>
            <span>✓ Analytics détaillées</span>
          </div>
          <div style="margin-top: 12px; font-size: 12px; color: #9ca3af;">
            Compatible Meet, Teams, Zoom, Salesforce
          </div>
        </div>

        <!-- Signature -->
        <div class="signature">
          <p class="signature-name">Ugo Di Sario</p>
          <p class="signature-title">Founder @ Sales Whisperer</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p style="margin: 0 0 12px 0;">Bonne vente ! 💪</p>
        <p style="margin: 0; font-size: 12px;">
          Script Lab PRO • by Sales Whisperer
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
