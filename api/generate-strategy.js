// api/generate-strategy.js
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers, email } = req.body;

  try {
    // Construire le prompt pour Groq
    const prompt = buildPrompt(answers);

    // Appeler Groq pour générer la stratégie
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Tu es un expert en stratégie commerciale B2B/B2C. Tu génères des stratégies de vente ultra-personnalisées, actionnables et efficaces. Ton style est direct, professionnel et orienté résultats. Tu utilises des frameworks de vente éprouvés (SPIN, Challenger Sale, MEDDIC) adaptés au contexte.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 3000,
    });

    const strategyText = completion.choices[0]?.message?.content;
    const strategy = parseStrategy(strategyText, answers);

    // Envoyer email à ugo@saleswhisperer.io
    await sendEmailNotification(answers, email, strategy);

    // Envoyer email au prospect (optionnel)
    await sendProspectEmail(email, strategy, answers);

    res.status(200).json({ strategy });

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la génération',
      fallback: true 
    });
  }
}

function buildPrompt(answers) {
  const isCold = answers.call_type === 'cold';
  const callType = isCold ? 'prospection à froid (cold call)' : 'call qualifié';
  
  return `
Crée une stratégie commerciale complète et personnalisée pour ce contexte :

CONTEXTE DU CALL :
- Type : ${callType}
- Canal : ${answers.channel}
- Objectif : ${answers.call_objective}

ENTREPRISE :
- Nom : ${answers.company_name || 'Non spécifié'}
- Marché : ${answers.market}
- Solution : ${answers.product_type}
- Proposition de valeur : ${answers.value_prop}
- USP : ${answers.usp}
- Concurrents : ${answers.competitors || 'Non spécifiés'}
- Ticket moyen : ${answers.ticket || 'Non spécifié'}
- Cycle de vente : ${answers.cycle_length || 'Non spécifié'}

PROSPECT :
- Titre/Poste : ${answers.prospect_title}
- Taille entreprise : ${answers.prospect_company_size || 'Non spécifié'}
- Pain point principal : ${answers.main_pain}
- Triggers : ${answers.trigger_events}
- Objection #1 : ${answers.top_objection}
- Décideur : ${answers.decision_maker || 'Non spécifié'}

STYLE :
- Ton : ${answers.tone}

GÉNÈRE une stratégie structurée avec ces sections (utilise exactement ces balises) :

[INTRO]
${isCold ? 'Accroche cold call percutante (2-3 phrases max) qui capte l\'attention et donne une raison valable de continuer' : 'Accroche call qualifié qui réaffirme l\'intérêt et pose le cadre de l\'échange'}

[DISCOVERY]
4 questions de découverte puissantes utilisant SPIN (Situation, Problème, Implication, Need-payoff). Une question par ligne.

[VALUE_POSITIONING]
Positionnement de valeur clair qui connecte les pain points du prospect à la solution unique de l'entreprise. Utilise la formule : Situation actuelle → Problème → Notre solution → Résultat mesurable.

[DIFFERENTIATION]
Différenciation vs ${answers.competitors || 'concurrents'} en 3-4 points bullet. Sois précis sur ce qui rend ${answers.company_name || 'l\'entreprise'} unique.

[OBJECTION]
Réponse complète et structurée à l'objection "${answers.top_objection}". Utilise la méthode : Empathie → Question inversée → Reframe → Preuve/exemple.

[CLOSING]
Technique de closing adaptée à l'objectif "${answers.call_objective}". Sois direct et propose une action concrète.

[EMAIL]
Email de suivi professionnel (objet + corps). Format prêt à copier-coller.

Génère du contenu ACTIONNABLE, pas de théorie. Sois précis et utilise les informations fournies.
`;
}

function parseStrategy(text, answers) {
  // Parser le texte généré par Groq
  const sections = {
    intro: extractSection(text, 'INTRO'),
    discovery: extractSection(text, 'DISCOVERY').split('\n').filter(q => q.trim()),
    value_positioning: extractSection(text, 'VALUE_POSITIONING'),
    differentiation: extractSection(text, 'DIFFERENTIATION'),
    objection_handling: {
      [answers.top_objection]: extractSection(text, 'OBJECTION')
    },
    closing: extractSection(text, 'CLOSING'),
    follow_up_email: extractSection(text, 'EMAIL')
  };

  return sections;
}

function extractSection(text, section) {
  const regex = new RegExp(`\\[${section}\\]([\\s\\S]*?)(?=\\[|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

async function sendEmailNotification(answers, prospectEmail, strategy) {
  // Utiliser Resend ou autre service
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (!resendApiKey) {
    console.log('Pas de clé Resend configurée');
    return;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Script Lab <noreply@saleswhisperer.io>',
        to: 'ugo@saleswhisperer.io',
        subject: `🎯 Nouveau lead Script Lab - ${answers.company_name || 'Lead intéressé'}`,
        html: `
          <h2>Nouveau lead Script Lab !</h2>
          
          <h3>📧 Contact</h3>
          <p><strong>Email :</strong> ${prospectEmail}</p>
          
          <h3>🏢 Entreprise</h3>
          <ul>
            <li><strong>Nom :</strong> ${answers.company_name || 'Non spécifié'}</li>
            <li><strong>Marché :</strong> ${answers.market}</li>
            <li><strong>Solution :</strong> ${answers.product_type}</li>
            <li><strong>Value Prop :</strong> ${answers.value_prop}</li>
            <li><strong>USP :</strong> ${answers.usp}</li>
            <li><strong>Ticket moyen :</strong> ${answers.ticket || 'Non spécifié'}</li>
          </ul>
          
          <h3>🎯 Prospect</h3>
          <ul>
            <li><strong>Poste :</strong> ${answers.prospect_title}</li>
            <li><strong>Pain point :</strong> ${answers.main_pain}</li>
            <li><strong>Triggers :</strong> ${answers.trigger_events}</li>
            <li><strong>Objection #1 :</strong> ${answers.top_objection}</li>
          </ul>
          
          <h3>📞 Contexte Call</h3>
          <ul>
            <li><strong>Type :</strong> ${answers.call_type === 'cold' ? 'Cold Call' : 'Call Qualifié'}</li>
            <li><strong>Canal :</strong> ${answers.channel}</li>
            <li><strong>Objectif :</strong> ${answers.call_objective}</li>
          </ul>
          
          <hr>
          <p><em>Ce lead a généré une stratégie complète et est potentiellement intéressé par Sales Whisperer.</em></p>
        `
      })
    });

    if (!response.ok) {
      console.error('Erreur Resend:', await response.text());
    }
  } catch (error) {
    console.error('Erreur envoi email:', error);
  }
}

async function sendProspectEmail(email, strategy, answers) {
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (!resendApiKey) return;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Script Lab <noreply@saleswhisperer.io>',
        to: email,
        subject: `Votre stratégie commerciale personnalisée - ${answers.company_name || 'Script Lab'}`,
        html: `
          <h1>Votre stratégie commerciale est prête ! 🎯</h1>
          
          <p>Bonjour,</p>
          
          <p>Voici votre stratégie commerciale complète et personnalisée basée sur votre contexte unique.</p>
          
          <p><strong>⚠️ Cette stratégie est accessible directement sur la page de résultats. Conservez ce lien !</strong></p>
          
          <hr>
          
          <h2>🚀 Envie d'aller plus loin ?</h2>
          
          <p>Imaginez avoir un assistant IA qui vous suggère les bonnes réponses <strong>en temps réel</strong> pendant vos appels...</p>
          
          <p>C'est exactement ce que fait <strong>Sales Whisperer</strong> :</p>
          <ul>
            <li>✅ Suggestions de réponses instantanées</li>
            <li>✅ Analyse en temps réel de la conversation</li>
            <li>✅ Gestion des objections</li>
            <li>✅ Insights post-call</li>
          </ul>
          
          <p><a href="https://www.saleswhisperer.io/" style="display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Découvrir Sales Whisperer</a></p>
          
          <hr>
          
          <p>Bonne vente ! 💪</p>
          
          <p><em>L'équipe Script Lab</em></p>
        `
      })
    });
  } catch (error) {
    console.error('Erreur envoi email prospect:', error);
  }
}
