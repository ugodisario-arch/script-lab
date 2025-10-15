// api/generate-strategy.js
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers, email } = req.body;

  console.log('=== Début génération stratégie ===');
  console.log('Email:', email);
  console.log('Entreprise:', answers.company_name);

  try {
    // Construire le prompt pour Groq
    const prompt = buildPrompt(answers);

    console.log('Appel Groq API...');

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
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 3000,
    });

    console.log('Groq API réponse OK');

    const strategyText = completion.choices[0]?.message?.content;
    const strategy = parseStrategy(strategyText, answers);

    console.log('Stratégie parsée');

    // Envoyer email à ugo@saleswhisperer.io
    console.log('Envoi email notification...');
    await sendEmailNotification(answers, email, strategy);

    // Envoyer email au prospect
    console.log('Envoi email prospect...');
    await sendProspectEmail(email, strategy, answers);

    console.log('=== Fin génération stratégie ===');

    res.status(200).json({ strategy });

  } catch (error) {
    console.error('=== ERREUR ===');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Erreur lors de la génération',
      fallback: true,
      details: error.message
    });
  }
}

function buildPrompt(answers) {
  const isCold = answers.call_type === 'cold';
  const callType = isCold ? 'prospection à froid (cold call)' : 'call qualifié';
  
  return `
Tu es un expert en stratégie commerciale. Tu dois créer une stratégie ULTRA-PERSONNALISÉE en INTERPRÉTANT et REFORMULANT les informations fournies. 

⚠️ RÈGLES CRITIQUES :
- NE JAMAIS copier-coller textuellement les inputs
- INTERPRÉTER le contexte et créer des phrases fluides et naturelles
- SYNTHÉTISER les informations en langage commercial professionnel
- Utiliser un ton ${answers.tone?.toLowerCase() || 'professionnel'}
- Parler comme un vrai commercial expert, pas comme un robot

CONTEXTE À INTERPRÉTER :

🎯 TYPE DE CALL : ${callType}
Canal : ${answers.channel}
Objectif : ${answers.call_objective}

🏢 ENTREPRISE :
Nom : ${answers.company_name || '[Entreprise]'}
Marché : ${answers.market}
Offre : ${answers.product_type}
Transformation client : "${answers.value_prop}"
Différenciation : "${answers.usp}"
Concurrents : ${answers.competitors || 'concurrents du marché'}
${answers.ticket ? `Ticket moyen : ${answers.ticket}` : ''}
${answers.cycle_length ? `Cycle de vente : ${answers.cycle_length}` : ''}

👤 PROSPECT :
Poste/Titre : ${answers.prospect_title}
${answers.prospect_company_size ? `Taille entreprise : ${answers.prospect_company_size}` : ''}
Pain point identifié : "${answers.main_pain}"
Triggers d'achat : "${answers.trigger_events}"
Objection principale : ${answers.top_objection}
${answers.decision_maker ? `Décideur : ${answers.decision_maker}` : ''}

---

GÉNÈRE une stratégie avec ces sections (balises exactes requises) :

[INTRO]
${isCold ? 
`Crée une accroche de cold call en 2-3 phrases NATURELLES qui :
1. Se présente de façon directe et professionnelle
2. Donne une RAISON CRÉDIBLE de l'appel (basée sur le pain point "${answers.main_pain}" et les triggers "${answers.trigger_events}")
3. Demande l'autorisation de continuer

⚠️ INTERDICTIONS :
- Ne liste pas les triggers mot à mot
- Ne copie pas "${answers.main_pain}" tel quel
- Reformule en langage commercial naturel

EXEMPLE DE BON STYLE :
"Bonjour [Prénom], je suis [Nom] de ${answers.company_name}. J'ai remarqué que beaucoup de [${answers.prospect_title}] dans [secteur] font face à [reformulation intelligente du pain point]. C'est justement notre spécialité d'aider des entreprises comme la vôtre à [bénéfice]. Avez-vous 2 minutes ?"` 
: 
`Crée une ouverture de call qualifié qui :
1. Remercie le prospect
2. Rappelle brièvement le contexte (sans être lourd)
3. Pose une question d'ouverture qui engage la découverte

Style conversationnel et professionnel.`}

[DISCOVERY]
Crée 4 questions de découverte SPIN selling :
1. SITUATION : Question factuelle sur leur contexte actuel
2. PROBLÈME : Question qui explore "${answers.main_pain}" sans le citer mot à mot
3. IMPLICATION : Question sur les conséquences du problème
4. NEED-PAYOFF : Question qui fait visualiser la solution

⚠️ Questions doivent être NATURELLES, pas génériques. Adaptées au secteur ${answers.market} et au poste ${answers.prospect_title}.

[VALUE_POSITIONING]
Crée un pitch de valeur en 3-4 phrases qui :
1. Reformule "${answers.value_prop}" en langage impactant
2. Connecte au pain point "${answers.main_pain}" (reformulé)
3. Mentionne la différenciation "${answers.usp}" naturellement
4. Donne un résultat CONCRET et MESURABLE

Ne copie AUCUNE phrase des inputs. Réinterprète tout.

[DIFFERENTIATION]
Crée 3-4 bullets de différenciation vs ${answers.competitors || 'concurrents'} :
- Reformule "${answers.usp}" en avantage concurrentiel clair
- Ajoute 2-3 autres différenciateurs logiques basés sur ${answers.product_type}
- Utilise un langage percutant et commercial

Format : "✓ [Avantage] : [Explication concrète en 1 phrase]"

[OBJECTION]
Crée une réponse COMPLÈTE à l'objection ${answers.top_objection} en 4 étapes :

1. EMPATHIE : Valide l'objection sans être condescendant
2. QUESTION INVERSÉE : Pose une question qui fait réfléchir
3. REFRAME : Change l'angle de vue (coût vs investissement, timing vs opportunité, etc.)
4. PREUVE : Mini-exemple ou stat qui renforce

Longueur : 4-6 phrases. Style : ${answers.tone?.toLowerCase() || 'professionnel'}.

[CLOSING]
Crée une technique de closing pour "${answers.call_objective}" qui :
- Récapitule brièvement (1 phrase)
- Pose une question de closing directe
- Propose une NEXT STEP concrète avec choix (dates, format, etc.)

Ne sois pas hésitant. Sois assumé et direct.

[EMAIL]
Crée un email de suivi en 3 parties :

**OBJET** : Court et intrigant (8-12 mots max)

**CORPS** :
1. Rappel personnalisé de l'échange (1-2 phrases)
2. 3 points clés de valeur (bullets)
3. Call-to-action clair avec proposition de créneaux

Ton : professionnel mais pas corporate. Humain.

---

⚠️ RAPPEL FINAL : 
- ZÉRO copier-coller des inputs
- TOUT doit sonner naturel et fluide
- Parle comme un top 1% sales rep
- Adapte le vocabulaire au niveau ${answers.market} ${answers.product_type}
`;
}

function parseStrategy(text, answers) {
  const sections = {
    intro: extractSection(text, 'INTRO'),
    discovery: extractSection(text, 'DISCOVERY').split('\n').filter(q => q.trim() && q.length > 10),
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
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (!resendApiKey) {
    console.log('⚠️ Pas de clé Resend configurée');
    return;
  }

  try {
    console.log('📧 Envoi email à ugo@saleswhisperer.io...');
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Script Lab <onboarding@resend.dev>',
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

    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ Erreur Resend:', result);
    } else {
      console.log('✅ Email notification envoyé:', result.id);
    }
  } catch (error) {
    console.error('❌ Erreur envoi email notification:', error.message);
  }
}

async function sendProspectEmail(email, strategy, answers) {
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (!resendApiKey) {
    console.log('⚠️ Pas de clé Resend pour email prospect');
    return;
  }

  try {
    console.log('📧 Envoi email au prospect:', email);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Script Lab <onboarding@resend.dev>',
        to: email,
        subject: `Votre stratégie commerciale personnalisée - ${answers.company_name || 'Script Lab'}`,
        html: `
          <h1>Votre stratégie commerciale est prête ! 🎯</h1>
          
          <p>Bonjour,</p>
          
          <p>Voici votre stratégie commerciale complète et personnalisée basée sur votre contexte unique.</p>
          
          <p><strong>⚠️ Cette stratégie est accessible directement sur la page de résultats. Conservez-la !</strong></p>
          
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
          
          <p><a href="https://www.saleswhisperer.io/" style="display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 16px;">Découvrir Sales Whisperer</a></p>
          
          <hr>
          
          <p>Bonne vente ! 💪</p>
          
          <p><em>L'équipe Script Lab</em></p>
        `
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ Erreur email prospect:', result);
    } else {
      console.log('✅ Email prospect envoyé:', result.id);
    }
  } catch (error) {
    console.error('❌ Erreur envoi email prospect:', error.message);
  }
}
