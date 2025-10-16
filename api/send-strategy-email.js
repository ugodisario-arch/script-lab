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
      subject: subject || `Votre stratégie pour ${answers.company_name || 'votre entreprise'}`,
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
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre Stratégie Commerciale</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      padding: 20px;
      line-height: 1.6;
    }
    .email-container {
      max-width: 680px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
      color: #ffffff;
      padding: 40px 32px;
      text-align: center;
      border-bottom: 3px solid #3b82f6;
    }
    .header h1 {
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    .header p {
      font-size: 15px;
      color: #a0a0a0;
      font-weight: 400;
    }
    .content {
      padding: 40px 32px;
    }
    .intro {
      background-color: #fafafa;
      border-left: 4px solid #3b82f6;
      padding: 20px 24px;
      margin-bottom: 32px;
      border-radius: 4px;
    }
    .intro p {
      color: #333333;
      font-size: 16px;
      line-height: 1.7;
    }
    .section {
      margin-bottom: 32px;
    }
    .section-title {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e5e7eb;
    }
    .section-content {
      color: #475569;
      font-size: 15px;
      line-height: 1.8;
    }
    .list-item {
      background-color: #f8fafc;
      padding: 14px 18px;
      margin-bottom: 10px;
      border-radius: 6px;
      border-left: 3px solid #3b82f6;
      color: #334155;
      font-size: 15px;
    }
    .email-box {
      background-color: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 20px;
      white-space: pre-line;
      color: #334155;
      font-size: 14px;
      line-height: 1.7;
      margin-top: 12px;
    }
    
    /* CTA ÉPURÉ NOIR AVEC STROKE */
    .cta-section {
      background-color: #0a0a0a;
      border: 2px solid #3b82f6;
      border-radius: 8px;
      padding: 40px 32px;
      margin: 40px 0;
      text-align: center;
    }
    .cta-title {
      font-size: 26px;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 16px 0;
      line-height: 1.3;
      letter-spacing: -0.5px;
    }
    .cta-description {
      font-size: 16px;
      color: #a0a0a0;
      margin: 0 0 32px 0;
      line-height: 1.7;
      max-width: 480px;
      margin-left: auto;
      margin-right: auto;
    }
    .cta-link {
      display: inline-block;
      background-color: #ffffff;
      color: #000000 !important;
      text-decoration: none;
      padding: 16px 48px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 16px;
      letter-spacing: 0.3px;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }
    .cta-link:hover {
      background-color: #f5f5f5;
      border-color: #3b82f6;
    }
    .cta-features {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
      margin-top: 24px;
      font-size: 13px;
      color: #737373;
      font-weight: 500;
    }
    .cta-compatibility {
      margin-top: 16px;
      font-size: 12px;
      color: #525252;
      font-weight: 400;
    }
    
    .signature {
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      text-align: left;
    }
    .signature-name {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .signature-title {
      font-size: 14px;
      color: #64748b;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px 32px;
      text-align: center;
      color: #64748b;
      font-size: 14px;
      border-top: 1px solid #e5e7eb;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 24px 20px;
      }
      .header h1 {
        font-size: 24px;
      }
      .cta-title {
        font-size: 22px;
      }
      .cta-features {
        flex-direction: column;
        gap: 8px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>📋 Votre Stratégie Commerciale</h1>
      <p>Générée par Script Lab PRO</p>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Intro -->
      <div class="intro">
        <p><strong>Bonjour,</strong></p>
        <p>Voici votre stratégie commerciale personnalisée pour <strong>${companyName}</strong>. Utilisez ce guide pour structurer vos appels et maximiser vos conversions.</p>
      </div>

      <!-- Introduction Section -->
      <div class="section">
        <h2 class="section-title">🎯 Introduction</h2>
        <div class="section-content">${strategy.intro || 'Contenu non disponible'}</div>
      </div>

      <!-- Questions de Découverte -->
      <div class="section">
        <h2 class="section-title">🔍 Questions de Découverte</h2>
        ${strategy.discovery?.map((q, idx) => `
          <div class="list-item"><strong>${idx + 1}.</strong> ${q}</div>
        `).join('') || '<p class="section-content">Aucune question disponible</p>'}
      </div>

      <!-- Proposition de Valeur -->
      <div class="section">
        <h2 class="section-title">💎 Proposition de Valeur</h2>
        <div class="section-content">${strategy.value || 'Contenu non disponible'}</div>
      </div>

      <!-- Différenciation -->
      <div class="section">
        <h2 class="section-title">⚡ Différenciation</h2>
        <div class="section-content">${strategy.differentiation || 'Contenu non disponible'}</div>
      </div>

      <!-- Gestion des Objections -->
      <div class="section">
        <h2 class="section-title">🛡️ Gestion des Objections</h2>
        ${strategy.objections?.map((obj, idx) => `
          <div class="list-item">
            <strong>Objection ${idx + 1}:</strong> ${obj.objection}<br>
            <strong style="color: #3b82f6;">Réponse:</strong> ${obj.response}
          </div>
        `).join('') || '<p class="section-content">Aucune objection disponible</p>'}
      </div>

      <!-- Closing -->
      <div class="section">
        <h2 class="section-title">🎁 Closing</h2>
        <div class="section-content">${strategy.closing || 'Contenu non disponible'}</div>
      </div>

      <!-- Email de Suivi -->
      <div class="section">
        <h2 class="section-title">📧 Email de Suivi</h2>
        <div class="email-box">${strategy.follow_up_email || 'Contenu non disponible'}</div>
      </div>

      <!-- CTA SALES WHISPERER - VERSION ÉPURÉE -->
      <div class="cta-section">
        <h3 class="cta-title">Et si vous aviez ces insights en temps réel ?</h3>
        <p class="cta-description">
          Sales Whisperer analyse vos conversations pendant vos appels et vous suggère exactement quoi dire au moment précis où vous en avez besoin.
        </p>
        <a href="${salesWhispererCTA?.url || 'https://tally.so/r/wdv5ZN'}" class="cta-link">
          Rejoindre la Waitlist
        </a>
        <div class="cta-features">
          <span>✓ Temps réel</span>
          <span>✓ IA Fine-Tuned</span>
          <span>✓ Analytics détaillées</span>
        </div>
        <div class="cta-compatibility">
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
      <p style="margin: 0 0 8px 0; font-weight: 600;">Bonne vente ! 💪</p>
      <p style="margin: 0; font-size: 12px;">
        Script Lab PRO • by Sales Whisperer
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
