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
      background-color: #f8fafc;
      line-height: 1.6;
    }
    .email-wrapper {
      background-color: #f8fafc;
      padding: 40px 20px;
    }
    .email-content {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }
    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      padding: 32px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 26px;
      font-weight: 700;
    }
    .header p {
      margin: 8px 0 0 0;
      color: #dbeafe;
      font-size: 14px;
    }
    .body-content {
      padding: 40px 32px;
    }
    .greeting {
      font-size: 16px;
      color: #0f172a;
      margin-bottom: 20px;
      font-weight: 500;
    }
    .intro-text {
      font-size: 15px;
      color: #334155;
      margin-bottom: 32px;
      line-height: 1.7;
    }
    .context-box {
      background-color: #f1f5f9;
      border-left: 4px solid #3b82f6;
      padding: 24px;
      margin: 32px 0;
      border-radius: 6px;
    }
    .context-box h3 {
      margin: 0 0 16px 0;
      font-size: 13px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-weight: 700;
    }
    .context-items {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .context-item {
      font-size: 14px;
    }
    .context-label {
      color: #64748b;
      font-size: 12px;
      margin-bottom: 4px;
    }
    .context-value {
      color: #0f172a;
      font-weight: 700;
      font-size: 15px;
    }
    .section {
      margin: 32px 0;
      padding-bottom: 32px;
      border-bottom: 2px solid #f1f5f9;
    }
    .section:last-of-type {
      border-bottom: none;
    }
    .section-title {
      font-size: 19px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 16px 0;
    }
    .section-content {
      color: #334155;
      font-size: 15px;
      line-height: 1.8;
      white-space: pre-wrap;
    }
    ul {
      padding-left: 20px;
      margin: 0;
    }
    li {
      margin-bottom: 14px;
      color: #334155;
      line-height: 1.7;
    }
    .email-box {
      background-color: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: #1e293b;
      line-height: 1.7;
    }
    .cta-section {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      border: 3px solid #3b82f6;
      border-radius: 12px;
      padding: 36px 32px;
      margin: 40px 0;
      text-align: center;
    }
    .cta-badge {
      display: inline-block;
      background-color: #1e40af;
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 24px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 20px;
    }
    .cta-title {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 14px 0;
      line-height: 1.3;
    }
    .cta-description {
      font-size: 15px;
      color: #1e293b;
      margin: 0 0 28px 0;
      line-height: 1.7;
      font-weight: 500;
    }
    .cta-link {
      display: inline-block;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 16px 40px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 16px;
      margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
    .cta-features {
      display: flex;
      justify-content: center;
      gap: 24px;
      flex-wrap: wrap;
      margin-top: 20px;
      font-size: 14px;
      color: #475569;
      font-weight: 600;
    }
    .footer {
      background-color: #f8fafc;
      padding: 32px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
      border-top: 2px solid #e2e8f0;
    }
    .signature {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 2px solid #e2e8f0;
    }
    .signature-name {
      font-size: 17px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 6px 0;
    }
    .signature-title {
      font-size: 14px;
      color: #64748b;
      margin: 0;
      font-weight: 500;
    }
    @media only screen and (max-width: 600px) {
      .email-wrapper { padding: 20px 10px; }
      .body-content { padding: 32px 20px; }
      .context-items { grid-template-columns: 1fr; }
      .cta-section { padding: 28px 20px; }
      .cta-title { font-size: 22px; }
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
          <p style="font-size: 14px; color: #64748b; margin: 0 0 12px 0; font-weight: 600;"><strong>${answers.top_objection}</strong></p>
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

        <!-- Sales Whisperer CTA -->
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
          <div style="margin-top: 14px; font-size: 12px; color: #64748b; font-weight: 500;">
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
        <p style="margin: 0 0 12px 0; font-weight: 600;">Bonne vente ! 💪</p>
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
