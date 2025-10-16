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
      subject: subject,
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
  const callType = answers.call_type === 'cold' ? '❄️ Cold Call' : '🎯 Call Qualifié';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { font-size: 32px; font-weight: bold; color: #ffffff; margin-bottom: 8px; }
    .subtitle { font-size: 14px; color: #888; }
    .intro { background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1)); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 24px; margin-bottom: 32px; }
    .context-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
    .context-item { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 16px; }
    .context-label { font-size: 12px; color: #888; margin-bottom: 4px; }
    .context-value { font-size: 16px; font-weight: 600; color: #ffffff; }
    .section { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 24px; margin-bottom: 24px; }
    .section-title { font-size: 20px; font-weight: bold; color: #ffffff; margin-bottom: 16px; }
    .section-content { color: #cccccc; line-height: 1.8; white-space: pre-wrap; }
    .cta-section { background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2)); border: 2px solid rgba(59, 130, 246, 0.3); border-radius: 20px; padding: 40px; text-align: center; margin: 48px 0; }
    .cta-badge { display: inline-block; background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.4); border-radius: 20px; padding: 8px 16px; font-size: 12px; font-weight: bold; color: #60a5fa; margin-bottom: 20px; }
    .cta-title { font-size: 28px; font-weight: bold; color: #ffffff; margin-bottom: 16px; line-height: 1.3; }
    .cta-description { font-size: 16px; color: #cccccc; margin-bottom: 32px; line-height: 1.6; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #3b82f6, #06b6d4); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 12px; font-weight: bold; font-size: 18px; margin-bottom: 24px; }
    .features { display: flex; justify-content: center; gap: 24px; margin-top: 24px; flex-wrap: wrap; }
    .feature-item { font-size: 14px; color: #888; }
    .footer { text-align: center; color: #666; font-size: 14px; margin-top: 48px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
    ul { padding-left: 20px; }
    li { margin-bottom: 12px; color: #cccccc; }
    @media only screen and (max-width: 600px) { .context-grid { grid-template-columns: 1fr; } .cta-section { padding: 24px; } .cta-title { font-size: 22px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Script Lab <span style="font-weight: 300; font-style: italic; color: #888;">PRO</span></div>
      <div class="subtitle">by Sales Whisperer</div>
    </div>
    <div class="intro">
      <h1 style="margin: 0 0 16px 0; font-size: 24px;">🎯 Votre stratégie est prête !</h1>
      <p style="margin: 0; color: #cccccc; line-height: 1.6;">Nous avons analysé votre contexte et généré une stratégie commerciale complète pour <strong>${companyName}</strong>.</p>
    </div>
    <div class="context-grid">
      <div class="context-item"><div class="context-label">Type d'appel</div><div class="context-value">${callType}</div></div>
      <div class="context-item"><div class="context-label">Marché</div><div class="context-value">${answers.market || 'N/A'}</div></div>
      <div class="context-item"><div class="context-label">Interlocuteur</div><div class="context-value">${answers.prospect_title || 'N/A'}</div></div>
      <div class="context-item"><div class="context-label">Objectif</div><div class="context-value">${answers.call_objective || 'N/A'}</div></div>
    </div>
    <div class="section"><div class="section-title">📞 Introduction</div><div class="section-content">${strategy.intro}</div></div>
    <div class="section"><div class="section-title">🎯 Questions de Découverte</div><ul>${strategy.discovery.map(q => `<li>${q}</li>`).join('')}</ul></div>
    <div class="section"><div class="section-title">✨ Positionnement de Valeur</div><div class="section-content">${strategy.value_positioning}</div></div>
    <div class="section"><div class="section-title">⚡ Différenciation</div><div class="section-content">${strategy.differentiation}</div></div>
    <div class="section"><div class="section-title">🛡️ Traitement Objection : ${answers.top_objection}</div><div class="section-content">${strategy.objection_handling[answers.top_objection]}</div></div>
    <div class="section"><div class="section-title">✅ Closing</div><div class="section-content">${strategy.closing}</div></div>
    <div class="section"><div class="section-title">📧 Email de Suivi</div><div class="section-content" style="font-family: monospace; font-size: 13px; background: rgba(0,0,0,0.3); padding: 16px; border-radius: 8px;">${strategy.follow_up_email}</div></div>
    <div class="cta-section">
      <div class="cta-badge">🚀 NIVEAU SUPÉRIEUR</div>
      <div class="cta-title">Et si vous aviez cette stratégie<br><span style="font-weight: 300; font-style: italic; color: #888;">en temps réel</span> ?</div>
      <div class="cta-description"><strong>Sales Whisperer</strong> analyse vos conversations pendant vos appels et vous suggère exactement quoi dire.</div>
      <a href="${salesWhispererCTA.url}" class="cta-button">${salesWhispererCTA.text}</a>
      <div class="features">
        <div class="feature-item">✓ Temps réel</div>
        <div class="feature-item">✓ IA Fine-Tuned</div>
        <div class="feature-item">✓ Analytics</div>
      </div>
      <div style="margin-top: 16px; font-size: 12px; color: #666;">Compatible Meet · Teams · Zoom · Salesforce</div>
    </div>
    <div class="footer">
      <p>Bonne vente ! 💪</p>
      <p style="margin-top: 8px;"><strong>Ugo Di Sario</strong></p>
      <p style="margin-top: 4px; font-size: 12px; color: #666;">Founder @ Sales Whisperer</p>
    </div>
  </div>
</body>
</html>
  `;
}