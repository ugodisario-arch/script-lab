import React, { useState } from 'react';
import { Send, Sparkles, Target, Zap, Phone, Mail, Copy, Check, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

const App = () => {
  const [stage, setStage] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategy, setStrategy] = useState(null);
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    intro: true,
    discovery: true,
    value: true,
    diff: true,
    objection: true,
    closing: true,
    email: true
  });



  const questions = [
    {
      id: 'call_type',
      text: "Commençons : s'agit-il d'un appel de prospection à froid ou d'un call qualifié ?",
      type: 'choice',
      options: [
        { label: '❄️ Cold Call - Prospect ne me connaît pas', value: 'cold' },
        { label: '🎯 Call Qualifié - Prospect a manifesté un intérêt', value: 'qualified' }
      ],
      section: 'context'
    },
    {
      id: 'market',
      text: "Quel est votre marché cible ?",
      type: 'choice',
      options: ['B2B', 'B2C', 'Les deux'],
      section: 'business'
    },
    {
      id: 'company_name',
      text: "Quel est le nom de votre entreprise ?",
      type: 'text',
      placeholder: 'Ex: TechCorp',
      section: 'business'
    },
    {
      id: 'product_type',
      text: "Quelle solution proposez-vous ?",
      type: 'choice',
      options: ['SaaS/Logiciel', 'Service/Conseil', 'Produit physique', 'Formation/Éducation', 'Autre'],
      section: 'business'
    },
    {
      id: 'value_prop',
      text: "Quelle transformation apportez-vous à vos clients ? (Soyez précis sur le résultat)",
      type: 'text',
      placeholder: 'Ex: On aide les équipes commerciales B2B à augmenter leur taux de closing de 40% grâce à l\'IA en temps réel',
      section: 'business'
    },
    {
      id: 'usp',
      text: "Qu'est-ce qui vous différencie VRAIMENT de vos concurrents ?",
      type: 'text',
      placeholder: 'Ex: Seule solution qui suggère des réponses en temps réel pendant les appels',
      section: 'business'
    },
    {
      id: 'competitors',
      text: "Qui sont vos 2-3 principaux concurrents ?",
      type: 'text',
      placeholder: 'Ex: Gong, Chorus.ai, ou autres',
      section: 'business'
    },
    {
      id: 'ticket',
      text: "Quel est votre ticket moyen ?",
      type: 'choice',
      options: ['< 1 000€', '1 000€ - 5 000€', '5 000€ - 20 000€', '20 000€ - 100 000€', '> 100 000€'],
      condition: (ans) => ans.market === 'B2B' || ans.market === 'Les deux',
      section: 'business'
    },
    {
      id: 'cycle_length',
      text: "Durée moyenne de votre cycle de vente ?",
      type: 'choice',
      options: ['< 1 semaine', '1-4 semaines', '1-3 mois', '3-6 mois', '> 6 mois'],
      condition: (ans) => ans.market === 'B2B' || ans.market === 'Les deux',
      section: 'business'
    },
    {
      id: 'prospect_title',
      text: "Quel est le poste/titre de votre interlocuteur idéal ?",
      type: 'text',
      placeholder: 'Ex: Directeur Commercial, CEO de PME, Responsable RH',
      section: 'prospect'
    },
    {
      id: 'prospect_company_size',
      text: "Taille d'entreprise de vos prospects idéaux ?",
      type: 'choice',
      options: ['1-10 employés', '10-50', '50-200', '200-1000', '1000+'],
      condition: (ans) => ans.market === 'B2B' || ans.market === 'Les deux',
      section: 'prospect'
    },
    {
      id: 'main_pain',
      text: "Quel est LE problème #1 que vit votre prospect au quotidien ?",
      type: 'text',
      placeholder: 'Ex: Perd des deals par manque de réactivité pendant les appels, ne sait pas quoi répondre aux objections',
      section: 'prospect'
    },
    {
      id: 'trigger_events',
      text: "Quels événements déclenchent le besoin de votre solution ?",
      type: 'text',
      placeholder: 'Ex: Équipe qui ne performe pas, turnover commercial élevé, expansion sur nouveau marché',
      section: 'prospect'
    },
    {
      id: 'top_objection',
      text: "Quelle est l'objection #1 que vous rencontrez ?",
      type: 'choice',
      options: [
        '"C\'est trop cher"',
        '"On a déjà un outil"',
        '"Pas le bon moment"',
        '"Pas convaincu du ROI"',
        '"Trop compliqué à mettre en place"'
      ],
      section: 'prospect'
    },
    {
      id: 'decision_maker',
      text: "Qui prend la décision finale d'achat ?",
      type: 'choice',
      options: [
        'Mon interlocuteur direct',
        'Son N+1 (manager)',
        'Comité de plusieurs personnes',
        'Direction générale',
        'Je ne sais pas encore'
      ],
      condition: (ans) => ans.market === 'B2B' || ans.market === 'Les deux',
      section: 'prospect'
    },
    {
      id: 'channel',
      text: "Quel canal utilisez-vous pour ce call ?",
      type: 'choice',
      options: ['Téléphone', 'Visioconférence (Zoom/Meet)', 'LinkedIn Audio', 'En personne'],
      section: 'strategy'
    },
    {
      id: 'call_objective',
      text: "Objectif principal de ce call ?",
      type: 'choice',
      options: [
        'Obtenir un RDV découverte',
        'Qualifier le besoin',
        'Présenter la solution',
        'Closer la vente',
        'Autre'
      ],
      section: 'strategy'
    },
    {
      id: 'tone',
      text: "Quel ton correspond à votre style et votre marché ?",
      type: 'choice',
      options: [
        'Professionnel et corporate',
        'Consultatif et expert',
        'Direct et challengeant',
        'Chaleureux et relationnel'
      ],
      section: 'strategy'
    },
  ];

  const getFilteredQuestions = () => {
    return questions.filter(q => !q.condition || q.condition(answers));
  };

  const getSectionProgress = () => {
    const filteredQuestions = getFilteredQuestions();
    const currentQ = filteredQuestions[currentQuestion];
    const sections = ['context', 'business', 'prospect', 'strategy'];
    const sectionIndex = sections.indexOf(currentQ?.section);
    return {
      current: sectionIndex + 1,
      total: sections.length,
      name: ['Contexte', 'Votre Entreprise', 'Votre Prospect', 'Stratégie'][sectionIndex]
    };
  };

  const handleStart = () => {
    setStage('questions');
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 800);
  };

  const handleAnswer = (value) => {
    const filteredQuestions = getFilteredQuestions();
    const question = filteredQuestions[currentQuestion];
    
    setAnswers({ ...answers, [question.id]: value });
    
    if (currentQuestion < filteredQuestions.length - 1) {
      setIsTyping(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setIsTyping(false);
      }, 800);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setStage('email');
        setIsTyping(false);
      }, 800);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setIsTyping(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        setIsTyping(false);
      }, 300);
    }
  };

  const handleSkip = () => {
    const filteredQuestions = getFilteredQuestions();
    
    if (currentQuestion < filteredQuestions.length - 1) {
      setIsTyping(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setIsTyping(false);
      }, 300);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setStage('email');
        setIsTyping(false);
      }, 300);
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      handleAnswer(textInput);
      setTextInput('');
    }
  };

  const handleEmailSubmit = async () => {
    if (email && email.includes('@')) {
      setIsGenerating(true);
      
      // Générer la stratégie
      const generatedStrategy = generateFallbackStrategy();
      setStrategy(generatedStrategy);
      
      try {
        // Préparer les données pour l'email
        const emailData = {
          to: email,
          subject: `🎯 Votre stratégie commerciale personnalisée - ${answers.company_name || 'Script Lab PRO'}`,
          strategy: generatedStrategy,
          answers: answers,
          salesWhispererCTA: {
            text: "🚀 Passez au niveau supérieur avec Sales Whisperer",
            url: "https://tally.so/r/wdv5ZN",
            description: "Obtenez ces insights en temps réel pendant vos appels"
          }
        };
        
        /* 
        Template d'email recommandé pour votre backend :
        
        Subject: 🎯 Votre stratégie commerciale personnalisée - [Company Name]
        
        Bonjour,
        
        Votre stratégie commerciale personnalisée est prête ! 
        
        📋 VOTRE CONTEXTE :
        - Type d'appel : [Cold/Qualifié]
        - Entreprise : [Company Name]
        - Prospect : [Prospect Title]
        - Objectif : [Call Objective]
        
        [Inclure les sections de la stratégie formatées en HTML]
        
        ---
        
        🚀 PASSEZ AU NIVEAU SUPÉRIEUR
        
        Imaginez avoir cette stratégie en temps réel pendant vos appels...
        
        Sales Whisperer analyse vos conversations et vous suggère exactement quoi dire,
        au moment précis où vous en avez besoin.
        
        [CTA Button: Rejoindre la Waitlist Sales Whisperer]
        Link: https://tally.so/r/wdv5ZN
        
        ✓ Temps réel : Insights en moins d'1 seconde
        ✓ IA Fine-Tuned : Sur les meilleures stratégies
        ✓ Analytics : Progression mesurable
        
        Compatible avec Meet, Teams, Zoom, Salesforce
        
        ---
        
        Bonne vente ! 💪
        L'équipe Script Lab PRO
        */
        
        // Envoi à votre API backend
        const response = await fetch('/api/send-strategy-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData)
        });
        
        if (response.ok) {
          console.log('✅ Email envoyé avec succès');
        } else {
          console.warn('⚠️ Erreur lors de l\'envoi de l\'email');
        }
        
      } catch (error) {
        console.error('❌ Erreur:', error);
        // Continue quand même pour afficher la stratégie
      } finally {
        setStage('result');
        setIsGenerating(false);
      }
    }
  };

  const generateFallbackStrategy = () => {
    const isCold = answers.call_type === 'cold';
    const isB2B = answers.market === 'B2B' || answers.market === 'Les deux';
    const companyName = answers.company_name || '[Votre entreprise]';
    
    const painPointInterpreted = interpretPainPoint(answers.main_pain);
    const triggerInterpreted = interpretTrigger(answers.trigger_events);
    const valueInterpreted = interpretValueProp(answers.value_prop);
    
    return {
      intro: isCold 
        ? `Bonjour [Prénom], je suis [Votre nom] de ${companyName}.\n\nJe contacte des ${answers.prospect_title} ${isB2B ? 'comme vous' : ''} parce que j'observe que ${painPointInterpreted}. ${triggerInterpreted ? `Surtout quand ${triggerInterpreted}.` : ''}\n\nC'est précisément ce sur quoi nous intervenons. Avez-vous 2 minutes pour que je vous explique comment ?`
        : `Bonjour [Prénom], merci de prendre ce temps d'échange.\n\nJe sais que ${valueInterpreted} vous intéresse. Avant d'entrer dans le détail de notre approche, j'aimerais mieux comprendre votre contexte.\n\nPouvez-vous me parler de ${painPointInterpreted} dans votre situation actuelle ?`,
      
      discovery: [
        `Comment gérez-vous actuellement ${reformulateForQuestion(answers.main_pain)} au sein de votre ${isB2B ? 'organisation' : 'activité'} ?`,
        `Depuis combien de temps cette situation dure-t-elle ? Qu'est-ce qui a déjà été tenté ?`,
        `Quel impact ${painPointInterpreted} a-t-il sur ${isB2B ? 'vos objectifs business' : 'votre chiffre d\'affaires'} concrètement ?`,
        `Si vous pouviez résoudre ce problème dans les 3 prochains mois, qu'est-ce que ça changerait pour vous ?`
      ],
      
      value_positioning: `Nous aidons des ${isB2B ? 'entreprises' : 'professionnels'} ${answers.market} à ${valueInterpreted}.\n\nNotre différence ? ${reformulateUSP(answers.usp, answers.competitors)}.\n\nConcrètement, nos clients constatent une amélioration de 30-50% sur ${getKPIFromPain(answers.main_pain)} en moyenne sous ${getCycleFromTicket(answers.ticket)}.`,
      
      differentiation: buildDifferentiation(answers),
      
      objection_handling: {
        [answers.top_objection]: buildObjectionResponse(answers.top_objection, answers)
      },
      
      closing: buildClosing(answers),
      
      follow_up_email: buildFollowUpEmail(answers, painPointInterpreted, valueInterpreted)
    };
  };

  function interpretPainPoint(pain) {
    if (!pain) return "certains défis opérationnels reviennent régulièrement";
    
    const lower = pain.toLowerCase();
    if (lower.includes('objection')) return "beaucoup d'équipes perdent des deals faute de réponses adaptées aux objections";
    if (lower.includes('performance')) return "les résultats commerciaux ne sont pas à la hauteur du potentiel";
    if (lower.includes('temps')) return "énormément de temps est perdu sur des tâches à faible valeur ajoutée";
    if (lower.includes('formation')) return "former et faire monter en compétence les équipes prend trop de temps";
    if (lower.includes('closing')) return "les opportunités ne se concrétisent pas assez souvent en signature";
    
    return `beaucoup rencontrent des difficultés autour de ${pain.toLowerCase()}`;
  }

  function interpretTrigger(trigger) {
    if (!trigger) return "";
    
    const lower = trigger.toLowerCase();
    if (lower.includes('performance')) return "les objectifs ne sont pas atteints";
    if (lower.includes('turnover') || lower.includes('rotation')) return "le turnover des équipes devient problématique";
    if (lower.includes('expansion') || lower.includes('croissance')) return "il y a une phase de croissance ou d'expansion";
    if (lower.includes('nouveau') || lower.includes('marché')) return "vous attaquez de nouveaux marchés";
    
    return `je constate que ${trigger.toLowerCase()}`;
  }

  function interpretValueProp(value) {
    if (!value) return "améliorer vos résultats commerciaux";
    
    return value
      .toLowerCase()
      .replace(/^on aide|^nous aidons|^j'aide/i, '')
      .replace(/les équipes|les entreprises|les commerciaux/gi, '')
      .trim();
  }

  function reformulateUSP(usp, competitors) {
    if (!usp) return "Notre approche unique vous permet d'obtenir des résultats mesurables rapidement";
    
    const hasCompetitors = competitors && competitors.toLowerCase() !== 'non spécifié';
    const competitorText = hasCompetitors ? `Contrairement à ${competitors}` : "Contrairement aux solutions classiques";
    
    return `${competitorText}, ${usp.toLowerCase()}`;
  }

  function reformulateForQuestion(pain) {
    if (!pain) return "ces enjeux";
    return pain.toLowerCase().replace(/^le |^la |^les |^l'/i, '');
  }

  function getKPIFromPain(pain) {
    if (!pain) return "leurs indicateurs clés";
    
    const lower = pain.toLowerCase();
    if (lower.includes('objection')) return "leur taux de conversion";
    if (lower.includes('closing')) return "leur taux de closing";
    if (lower.includes('performance')) return "leur performance commerciale";
    if (lower.includes('temps')) return "leur productivité";
    
    return "leurs résultats";
  }

  function getCycleFromTicket(ticket) {
    if (!ticket) return "3 mois";
    if (ticket.includes('< 1 000') || ticket.includes('&lt; 1 000')) return "1 mois";
    if (ticket.includes('1 000') || ticket.includes('5 000')) return "2-3 mois";
    return "3-6 mois";
  }

  function buildDifferentiation(answers) {
    const usp = answers.usp || "Notre approche unique";
    const items = [
      `✓ ${usp} : Ce qui nous rend vraiment différents sur le marché`,
    ];
    
    if (answers.product_type?.includes('SaaS')) {
      items.push("✓ Implémentation rapide : Opérationnel en quelques jours, pas plusieurs mois");
      items.push("✓ ROI mesurable : Tableaux de bord en temps réel pour suivre l'impact");
    } else if (answers.product_type?.includes('Service')) {
      items.push("✓ Expertise terrain : Notre équipe a géré ces problématiques des centaines de fois");
      items.push("✓ Accompagnement personnalisé : Pas de one-size-fits-all, tout est adapté");
    }
    
    items.push(`✓ Support réactif : Une équipe dédiée pour vous accompagner au quotidien`);
    
    return items.join('\n');
  }

  function buildObjectionResponse(objection, answers) {
    const responses = {
      '"C\'est trop cher"': `Je comprends que l'investissement soit un sujet. Laissez-moi vous poser une question : combien coûte ${reformulateForQuestion(answers.main_pain)} à votre ${answers.market === 'B2B' ? 'entreprise' : 'activité'} chaque mois ?\n\nSi notre solution permet de réduire ce coût de ne serait-ce que 30%, le retour sur investissement se fait en quelques semaines. C'est moins une dépense qu'un investissement rentable.`,
      
      '"On a déjà un outil"': `Parfait, vous avez déjà ${answers.competitors || 'une solution'} en place. Question directe : si c'était 100% satisfaisant, seriez-vous en train de me parler ?\n\nLa plupart de nos clients utilisaient ${answers.competitors || 'un concurrent'} avant. Ce qui les a fait changer ? ${reformulateUSP(answers.usp, answers.competitors)}. Voyons ensemble si ça fait sens pour vous.`,
      
      '"Pas le bon moment"': `Je comprends. Par curiosité : qu'est-ce qui ferait que dans 3-6 mois, ce SERAIT le bon moment ?\n\n[Attendre la réponse]\n\nSouvent, "pas le bon moment" signifie que ce n'est pas assez prioritaire. La question est : si ${reformulateForQuestion(answers.main_pain)} persiste 6 mois de plus, quel impact cumulé cela aura-t-il sur vos résultats ?`,
      
      '"Pas convaincu du ROI"': `C'est une question légitime. Faisons un calcul rapide ensemble : actuellement, ${reformulateForQuestion(answers.main_pain)} vous coûte combien par mois, approximativement ?\n\n[Calculer ensemble]\n\nNos clients dans ${answers.market} constatent une amélioration de 30-50% en moyenne. Sur votre cas, ça représenterait un gain significatif. Le ROI est là.`,
      
      '"Trop compliqué à mettre en place"': `Je comprends cette inquiétude. Justement, on a construit notre solution en pensant à ça. L'implémentation prend ${getCycleFromTicket(answers.ticket)}, pas plusieurs mois.\n\nEt surtout : on vous accompagne à chaque étape. Vous n'êtes pas seul face à un outil complexe.`
    };
    
    return responses[objection] || `Je comprends votre préoccupation. ${objection}\n\nVoici comment nos clients ont surmonté exactement cette même question...`;
  }

  function buildClosing(answers) {
    const objectives = {
      'Obtenir un RDV découverte': `D'après notre échange, ${reformulateForQuestion(answers.main_pain)} mérite qu'on creuse ensemble.\n\nProchaine étape logique : un point de 30 minutes avec notre expert ${answers.product_type} pour voir concrètement comment on s'adapte à votre situation.\n\nVous êtes plutôt disponible mardi ou jeudi cette semaine ?`,
      
      'Qualifier le besoin': `Récapitulons : vous avez ${reformulateForQuestion(answers.main_pain)}, ${answers.trigger_events ? `et ${interpretTrigger(answers.trigger_events)}` : 'et cherchez une solution'}.\n\nSur une échelle de 1 à 10, à quel niveau cette problématique est prioritaire pour vous ? [Attendre]\n\nQu'est-ce qui vous aiderait à passer à l'action ?`,
      
      'Closer la vente': `On a couvert l'essentiel : vous cherchez à ${interpretValueProp(answers.value_prop)}, ${reformulateForQuestion(answers.main_pain)} est votre blocage principal, et notre solution y répond directement.\n\nSur une échelle de 1 à 10, où vous situez-vous dans votre décision ?\n\n[Si inférieur à 8] Qu'est-ce qui vous manque pour arriver à 10 ?`
    };
    
    return objectives[answers.call_objective] || "Quelle serait la prochaine étape logique pour vous ?";
  }

  function buildFollowUpEmail(answers, painInterpreted, valueInterpreted) {
    const companyName = answers.company_name || '[Votre entreprise]';
    
    return `Objet : Suite à notre échange - ${companyName}\n\nBonjour [Prénom],\n\nMerci pour cet échange de qualité ${answers.channel === 'Téléphone' ? 'au téléphone' : 'ce jour'}.\n\nPour résumer, vous cherchez à ${valueInterpreted}, et votre principal défi est que ${painInterpreted}.\n\nLes 3 points clés à retenir de notre discussion :\n\n1. ${reformulateUSP(answers.usp, answers.competitors)}\n2. Nos clients ${answers.market} constatent des résultats mesurables sous ${getCycleFromTicket(answers.ticket)}\n3. L'implémentation est simple et accompagnée\n\nProchaine étape : ${answers.call_objective}\n\nJe reste disponible si vous avez des questions.\n\nBien à vous,\n[Votre signature]`;
  }

  const copyToClipboard = () => {
    const text = Object.entries(strategy)
      .map(([key, value]) => {
        if (typeof value === 'object') {
          return `${key.toUpperCase()}:\n${Object.entries(value).map(([k, v]) => `${k}: ${v}`).join('\n\n')}`;
        }
        if (Array.isArray(value)) {
          return `${key.toUpperCase()}:\n${value.map((v, i) => `${i + 1}. ${v}`).join('\n')}`;
        }
        return `${key.toUpperCase()}:\n${value}`;
      })
      .join('\n\n---\n\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredQuestions = getFilteredQuestions();
  const question = stage === 'questions' ? filteredQuestions[currentQuestion] : null;
  const progress = stage === 'questions' ? ((currentQuestion + 1) / filteredQuestions.length) * 100 : 0;
  const sectionProgress = stage === 'questions' ? getSectionProgress() : null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Subtle animated gradient orbs background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-sky-900/20 to-blue-900/20 rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-r from-cyan-900/20 to-slate-900/20 rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <header className="border-b border-white/5 sticky top-0 z-50 backdrop-blur-2xl bg-black/80">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Script Lab <span className="font-light italic text-white/60">PRO</span>
            </h1>
            <p className="text-xs text-white/40 mt-0.5">by <span className="font-semibold">Sales Whisperer</span></p>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="https://tally.so/r/wdv5ZN" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
              title="Rejoindre la waitlist de Sales Whisperer - IA en temps réel pour vos appels"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-blue-500/20 hover:border-blue-500/40 transition-all">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm">
                  <span className="text-white/60">Waitlist</span>{' '}
                  <span className="font-bold text-white/90 group-hover:text-white">Sales Whisperer</span>
                </span>
              </div>
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {stage === 'intro' && (
          <div className="text-center space-y-12 py-16">
            <div className="space-y-6">
              <h2 className="text-5xl font-bold leading-tight text-white">
                Créez votre stratégie <br/>
                <span className="italic font-light text-white/70">commerciale</span> sur-mesure
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto font-light">
                En <span className="font-bold">5 minutes</span>, obtenez une stratégie <span className="italic">complète</span> adaptée à votre entreprise et votre prospect.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8">
              <div className="border border-white/10 p-8 rounded-2xl hover:border-white/30 transition-all group bg-white/5 backdrop-blur-xl">
                <Phone className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform text-white/90" />
                <h3 className="font-bold mb-2 text-lg text-white/90">Cold Call <span className="italic font-light text-white/70">ou</span> Qualifié</h3>
                <p className="text-sm text-white/50 font-light">Stratégie adaptée au contexte de votre appel</p>
              </div>
              <div className="border border-white/10 p-8 rounded-2xl hover:border-white/30 transition-all group bg-white/5 backdrop-blur-xl">
                <Sparkles className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform text-white/90" />
                <h3 className="font-bold mb-2 text-lg text-white/90"><span className="italic">IA</span> Hyper-personnalisée</h3>
                <p className="text-sm text-white/50 font-light">Génération basée sur votre contexte <span className="font-semibold">unique</span></p>
              </div>
              <div className="border border-white/10 p-8 rounded-2xl hover:border-white/30 transition-all group bg-white/5 backdrop-blur-xl">
                <Target className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform text-white/90" />
                <h3 className="font-bold mb-2 text-lg text-white/90">Stratégie <span className="italic text-white/70">complète</span></h3>
                <p className="text-sm text-white/50 font-light">Pas juste un script, un <span className="font-semibold">plan d'action</span></p>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="mt-12 px-10 py-5 rounded-xl bg-white text-black hover:bg-white/90 font-bold text-lg transition-all transform hover:scale-105"
            >
              Commencer l'analyse
            </button>
          </div>
        )}

        {stage === 'questions' && question && (
          <div className="space-y-8 py-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              {sectionProgress && (
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 border border-white/20 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-xl">
                    <span className="text-sm font-bold text-white/90">
                      Section {sectionProgress.current}/{sectionProgress.total}
                    </span>
                    <span className="text-white/30">·</span>
                    <span className="text-sm font-light italic text-white/70">{sectionProgress.name}</span>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between text-sm text-white/40 font-light">
                <span>Question <span className="font-semibold text-white/60">{currentQuestion + 1}</span> sur {filteredQuestions.length}</span>
                <span className="font-bold text-white/60">{Math.round(progress)}%</span>
              </div>
              <div className="h-0.5 bg-white/10 overflow-hidden rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="text-sm text-white/40 hover:text-white/70 transition-colors flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-4 h-4 rotate-90" />
                  <span>Précédent</span>
                </button>
                <button
                  onClick={handleSkip}
                  className="text-sm text-white/40 hover:text-white/70 transition-colors flex items-center gap-2"
                >
                  <span>Passer</span>
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
              </div>
            </div>

            <div className="border border-white/20 p-8 rounded-2xl bg-white/5 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 border border-white/20 rounded-xl flex items-center justify-center bg-white/5">
                  <Sparkles className="w-6 h-6 text-white/90" />
                </div>
                <div className="flex-1 pt-2">
                  <p className="text-xl leading-relaxed font-light text-white/90">
                    {isTyping ? (
                      <span className="inline-flex gap-1">
                        <span className="animate-pulse">•</span>
                        <span className="animate-pulse" style={{animationDelay: '0.2s'}}>•</span>
                        <span className="animate-pulse" style={{animationDelay: '0.4s'}}>•</span>
                      </span>
                    ) : (
                      question.text
                    )}
                  </p>
                </div>
              </div>
            </div>

            {!isTyping && (
              <div className="space-y-3">
                {question.type === 'choice' ? (
                  question.options.map((option, idx) => {
                    const optionValue = typeof option === 'object' ? option.value : option;
                    const optionLabel = typeof option === 'object' ? option.label : option;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(optionValue)}
                        className="w-full text-left p-5 rounded-xl border border-white/20 hover:bg-white hover:text-black transition-all group font-light bg-white/5 backdrop-blur-xl text-white/90"
                      >
                        <span className="group-hover:font-semibold transition-all">{optionLabel}</span>
                      </button>
                    );
                  })
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={question.placeholder}
                      className="w-full p-5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/20 focus:border-white resize-none focus:outline-none text-white placeholder-white/30 font-light"
                      rows="4"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          handleTextSubmit();
                        }
                      }}
                    />
                    <button
                      onClick={handleTextSubmit}
                      disabled={!textInput.trim()}
                      className="w-full p-5 rounded-xl bg-white text-black hover:bg-white/90 font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Continuer <Send className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {stage === 'email' && (
          <div className="max-w-xl mx-auto space-y-8 py-16">
            <div className="text-center space-y-6">
              <div className="inline-block p-6 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl">
                <Mail className="w-16 h-16 text-white/90" />
              </div>
              <h2 className="text-4xl font-bold text-white">Votre stratégie est <span className="italic font-light text-white/70">presque</span> prête !</h2>
              <p className="text-lg text-white/50 font-light">
                Entrez votre email pour recevoir votre stratégie <span className="font-semibold text-white/70">commerciale complète</span> et personnalisée.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full p-5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/20 focus:border-white focus:outline-none text-lg text-white placeholder-white/30 font-light"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEmailSubmit();
                  }
                }}
              />
              <button
                onClick={handleEmailSubmit}
                disabled={isGenerating || !email.includes('@')}
                className="w-full p-5 rounded-xl bg-white text-black hover:bg-white/90 font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span className="font-light">Génération de votre</span> stratégie...
                  </>
                ) : (
                  'Générer ma stratégie'
                )}
              </button>
            </div>

            <p className="text-xs text-center text-white/40 font-light">
              🔒 Vos données sont <span className="font-semibold text-white/60">sécurisées</span>. Stratégie envoyée par email + accessible immédiatement.
            </p>
          </div>
        )}

        {stage === 'result' && strategy && (
          <div className="space-y-8 py-8">
            {/* Hero Section */}
            <div className="text-center space-y-6 mb-12">
              <div className="inline-block p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <Target className="w-16 h-16 text-white/90" />
              </div>
              <h2 className="text-5xl font-bold text-white">
                Votre stratégie est <span className="italic font-light text-white/70">prête</span> 🎯
              </h2>
              <p className="text-white/50 font-light text-lg">
                Envoyée à <span className="font-semibold text-white/80 px-3 py-1 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">{email}</span>
              </p>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all font-light text-white/90"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span className="font-semibold">Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Copier <span className="font-semibold">toute</span> la stratégie</span>
                  </>
                )}
              </button>
            </div>

            {/* Sales Whisperer Promo */}
            <div className="relative rounded-3xl overflow-hidden mb-16 border border-white/20">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mix-blend-lighten filter blur-3xl opacity-40 animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full mix-blend-lighten filter blur-3xl opacity-40 animate-pulse" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
                <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-gradient-to-r from-blue-400 to-sky-300 rounded-full mix-blend-lighten filter blur-3xl opacity-35 animate-pulse" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
                <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-white to-blue-300 rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '3s', animationDuration: '6s'}}></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950/50 via-blue-950/50 to-slate-950/50"></div>
              <div className="absolute inset-0 backdrop-blur-xl"></div>
              
              <div className="relative z-10 p-12">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-blue-400/30 text-blue-200 mb-8 font-semibold text-sm">
                    <Sparkles className="w-5 h-5" />
                    NIVEAU SUPÉRIEUR
                  </div>
                  <h3 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
                    Et si vous aviez cette stratégie <span className="italic font-light text-white/70">en direct</span> ?
                  </h3>
                  <p className="text-xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed">
                    <span className="font-bold text-white/90">Sales Whisperer</span> analyse vos conversations en temps réel et vous suggère exactement quoi dire.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  {/* Card 1 - Temps réel */}
                  <div className="relative rounded-3xl overflow-visible group transform hover:scale-105 transition-all duration-500">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-500"></div>
                    
                    {/* Glass card */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20">
                      {/* Background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-transparent"></div>
                      
                      {/* Glass effect */}
                      <div className="relative backdrop-blur-3xl bg-white/5 border border-white/30 rounded-3xl p-8 h-full">
                        {/* Icon container */}
                        <div className="relative mb-6">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 opacity-20 blur-xl rounded-2xl"></div>
                          <div className="relative p-5 rounded-2xl bg-gradient-to-br from-blue-400/30 to-cyan-400/20 backdrop-blur-xl border border-blue-300/40 w-fit shadow-lg">
                            <Zap className="w-12 h-12 text-blue-300 drop-shadow-lg" />
                          </div>
                        </div>
                        
                        <h4 className="text-2xl font-bold mb-4 text-white drop-shadow-lg">Temps réel</h4>
                        <p className="text-white/70 leading-relaxed">
                          Insights en moins d'1 seconde pendant vos appels
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 - IA Fine-Tuned */}
                  <div className="relative rounded-3xl overflow-visible group transform hover:scale-105 transition-all duration-500">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-500 opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-500"></div>
                    
                    {/* Glass card */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/20">
                      {/* Background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent"></div>
                      
                      {/* Glass effect */}
                      <div className="relative backdrop-blur-3xl bg-white/5 border border-white/30 rounded-3xl p-8 h-full">
                        {/* Icon container */}
                        <div className="relative mb-6">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-400 opacity-20 blur-xl rounded-2xl"></div>
                          <div className="relative p-5 rounded-2xl bg-gradient-to-br from-cyan-400/30 to-blue-400/20 backdrop-blur-xl border border-cyan-300/40 w-fit shadow-lg">
                            <Sparkles className="w-12 h-12 text-cyan-300 drop-shadow-lg" />
                          </div>
                        </div>
                        
                        <h4 className="text-2xl font-bold mb-4 text-white drop-shadow-lg">IA Fine-Tuned</h4>
                        <p className="text-white/70 leading-relaxed">
                          Entraînée sur les meilleures stratégies de vente
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 - Analytics */}
                  <div className="relative rounded-3xl overflow-visible group transform hover:scale-105 transition-all duration-500">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-400 to-sky-500 opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-500"></div>
                    
                    {/* Glass card */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-sky-500/20">
                      {/* Background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 via-blue-500/10 to-transparent"></div>
                      
                      {/* Glass effect */}
                      <div className="relative backdrop-blur-3xl bg-white/5 border border-white/30 rounded-3xl p-8 h-full">
                        {/* Icon container */}
                        <div className="relative mb-6">
                          <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-blue-400 opacity-20 blur-xl rounded-2xl"></div>
                          <div className="relative p-5 rounded-2xl bg-gradient-to-br from-sky-400/30 to-blue-400/20 backdrop-blur-xl border border-sky-300/40 w-fit shadow-lg">
                            <TrendingUp className="w-12 h-12 text-sky-300 drop-shadow-lg" />
                          </div>
                        </div>
                        
                        <h4 className="text-2xl font-bold mb-4 text-white drop-shadow-lg">Analytics</h4>
                        <p className="text-white/70 leading-relaxed">
                          Stats détaillées et progression mesurable
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-8 border-t border-white/10">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                    <a
                      href="https://tally.so/r/wdv5ZN"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-12 py-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border border-blue-400/50 hover:border-blue-300 font-bold text-xl transition-all transform hover:scale-105 text-white shadow-lg shadow-blue-500/25"
                    >
                      <Zap className="w-8 h-8" />
                      Rejoindre la Waitlist
                    </a>
                    <a
                      href="https://www.saleswhisperer.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 font-semibold text-lg transition-all text-white/90 backdrop-blur-xl"
                    >
                      En savoir plus →
                    </a>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-white/40">
                    <Check className="w-5 h-5" />
                    <span>Compatible <span className="font-semibold text-white/60">Meet · Teams · Zoom · Salesforce</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategy Sections */}
            <div className="space-y-6">
              {/* Introduction */}
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent"></div>
                <div className="absolute inset-0 border border-white/10 rounded-2xl"></div>
                <div className="relative backdrop-blur-xl bg-black/40">
                  <button
                    onClick={() => toggleSection('intro')}
                    className="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-all rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/10 border border-indigo-500/20">
                        <Phone className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white/90">Introduction</h3>
                        <p className="text-sm text-white/40 mt-1">
                          {answers.call_type === 'cold' ? 'Cold Call' : 'Call Qualifié'}
                        </p>
                      </div>
                    </div>
                    {expandedSections.intro ? <ChevronUp className="text-white/40" /> : <ChevronDown className="text-white/40" />}
                  </button>
                  {expandedSections.intro && (
                    <div className="px-8 pb-8">
                      <div className="p-6 rounded-xl bg-black/20 border border-white/5">
                        <p className="text-white/70 leading-relaxed whitespace-pre-line">{strategy.intro}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Discovery Questions */}
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent"></div>
                <div className="absolute inset-0 border border-white/10 rounded-2xl"></div>
                <div className="relative backdrop-blur-xl bg-black/40">
                  <button
                    onClick={() => toggleSection('discovery')}
                    className="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-all rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-600/10 border border-blue-500/20">
                        <Target className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white/90">Questions de Découverte</h3>
                    </div>
                    {expandedSections.discovery ? <ChevronUp className="text-white/40" /> : <ChevronDown className="text-white/40" />}
                  </button>
                  {expandedSections.discovery && (
                    <div className="px-8 pb-8">
                      <div className="space-y-4">
                        {strategy.discovery.map((q, idx) => (
                          <div key={idx} className="p-6 rounded-xl bg-black/20 border border-white/5 flex items-start gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">{idx + 1}</span>
                            <p className="text-white/70 leading-relaxed pt-1">{q}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Value Positioning */}
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent"></div>
                <div className="absolute inset-0 border border-white/10 rounded-2xl"></div>
                <div className="relative backdrop-blur-xl bg-black/40">
                  <button
                    onClick={() => toggleSection('value')}
                    className="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-all rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-600/10 border border-purple-500/20">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white/90">Positionnement de Valeur</h3>
                    </div>
                    {expandedSections.value ? <ChevronUp className="text-white/40" /> : <ChevronDown className="text-white/40" />}
                  </button>
                  {expandedSections.value && (
                    <div className="px-8 pb-8">
                      <div className="p-6 rounded-xl bg-black/20 border border-white/5">
                        <p className="text-white/70 leading-relaxed whitespace-pre-line">{strategy.value_positioning}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Differentiation */}
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent"></div>
                <div className="absolute inset-0 border border-white/10 rounded-2xl"></div>
                <div className="relative backdrop-blur-xl bg-black/40">
                  <button
                    onClick={() => toggleSection('diff')}
                    className="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-all rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-500/20">
                        <Zap className="w-6 h-6 text-amber-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white/90">Différenciation</h3>
                    </div>
                    {expandedSections.diff ? <ChevronUp className="text-white/40" /> : <ChevronDown className="text-white/40" />}
                  </button>
                  {expandedSections.diff && (
                    <div className="px-8 pb-8">
                      <div className="p-6 rounded-xl bg-black/20 border border-white/5">
                        <p className="text-white/70 leading-relaxed whitespace-pre-line">{strategy.differentiation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Objection Handling */}
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-transparent"></div>
                <div className="absolute inset-0 border border-white/10 rounded-2xl"></div>
                <div className="relative backdrop-blur-xl bg-black/40">
                  <button
                    onClick={() => toggleSection('objection')}
                    className="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-all rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500/20 to-red-600/10 border border-rose-500/20">
                        <Target className="w-6 h-6 text-rose-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white/90">Traitement Objection</h3>
                    </div>
                    {expandedSections.objection ? <ChevronUp className="text-white/40" /> : <ChevronDown className="text-white/40" />}
                  </button>
                  {expandedSections.objection && (
                    <div className="px-8 pb-8 space-y-4">
                      <div className="inline-flex px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-semibold">
                        {answers.top_objection}
                      </div>
                      <div className="p-6 rounded-xl bg-black/20 border border-white/5">
                        <p className="text-white/70 leading-relaxed whitespace-pre-line">
                          {strategy.objection_handling[answers.top_objection]}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Closing */}
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent"></div>
                <div className="absolute inset-0 border border-white/10 rounded-2xl"></div>
                <div className="relative backdrop-blur-xl bg-black/40">
                  <button
                    onClick={() => toggleSection('closing')}
                    className="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-all rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-600/10 border border-emerald-500/20">
                        <Check className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white/90">Closing</h3>
                    </div>
                    {expandedSections.closing ? <ChevronUp className="text-white/40" /> : <ChevronDown className="text-white/40" />}
                  </button>
                  {expandedSections.closing && (
                    <div className="px-8 pb-8">
                      <div className="p-6 rounded-xl bg-black/20 border border-white/5">
                        <p className="text-white/70 leading-relaxed whitespace-pre-line">{strategy.closing}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent"></div>
                <div className="absolute inset-0 border border-white/10 rounded-2xl"></div>
                <div className="relative backdrop-blur-xl bg-black/40">
                  <button
                    onClick={() => toggleSection('email')}
                    className="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-all rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/10 border border-violet-500/20">
                        <Mail className="w-6 h-6 text-violet-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white/90">Email de Suivi</h3>
                    </div>
                    {expandedSections.email ? <ChevronUp className="text-white/40" /> : <ChevronDown className="text-white/40" />}
                  </button>
                  {expandedSections.email && (
                    <div className="px-8 pb-8">
                      <div className="p-6 rounded-xl bg-black/20 border border-white/5 font-mono text-sm">
                        <p className="text-white/60 whitespace-pre-line leading-relaxed">{strategy.follow_up_email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
              <div className="absolute inset-0 border border-white/10 rounded-2xl"></div>
              <div className="relative backdrop-blur-xl bg-black/40 p-8">
                <h4 className="font-bold mb-6 flex items-center gap-3 text-white/90 text-xl">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/10 border border-blue-500/20">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  Conseils d'utilisation
                </h4>
                <ul className="space-y-3 text-white/50">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400/60 flex-shrink-0 mt-1">✓</span>
                    <span><span className="font-semibold text-white/70">Personnalisez</span> chaque élément selon le prospect</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400/60 flex-shrink-0 mt-1">✓</span>
                    <span>Pratiquez à <span className="italic text-white/70">voix haute</span> avant vos appels</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-pink-400/60 flex-shrink-0 mt-1">✓</span>
                    <span>Adaptez le <span className="font-semibold text-white/70">ton</span> selon les réactions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400/60 flex-shrink-0 mt-1">✓</span>
                    <span>Utilisez comme <span className="italic text-white/70">guide</span>, pas script rigide</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
