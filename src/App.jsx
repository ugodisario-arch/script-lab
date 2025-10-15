import React, { useState } from 'react';
import { Send, Sparkles, Target, Zap, Phone, Mail, Copy, Check, TrendingUp } from 'lucide-react';

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

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      handleAnswer(textInput);
      setTextInput('');
    }
  };

  const handleEmailSubmit = async () => {
    if (email && email.includes('@')) {
      setIsGenerating(true);
      
      try {
        const response = await fetch('/api/generate-strategy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, email })
        });
        
        const data = await response.json();
        
        if (data.fallback || !data.strategy) {
          setStrategy(generateFallbackStrategy());
        } else {
          setStrategy(data.strategy);
        }
        
        setStage('result');
      } catch (error) {
        console.error('Erreur:', error);
        setStrategy(generateFallbackStrategy());
        setStage('result');
      } finally {
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

  const filteredQuestions = getFilteredQuestions();
  const question = stage === 'questions' ? filteredQuestions[currentQuestion] : null;
  const progress = stage === 'questions' ? ((currentQuestion + 1) / filteredQuestions.length) * 100 : 0;
  const sectionProgress = stage === 'questions' ? getSectionProgress() : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 sticky top-0 z-50 bg-black/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Script Lab <span className="font-light italic">PRO</span>
            </h1>
            <p className="text-xs text-white/50 mt-0.5">by <span className="font-semibold">Sales Whisperer</span></p>
          </div>
          <a 
            href="https://www.saleswhisperer.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm hover:text-white/70 transition-colors group"
          >
            <span className="font-light">Découvrir</span> <span className="font-bold group-hover:underline">Sales Whisperer</span> →
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {stage === 'intro' && (
          <div className="text-center space-y-12 py-16">
            <div className="space-y-6">
              <h2 className="text-5xl font-bold leading-tight">
                Créez votre stratégie <br/>
                <span className="italic font-light">commerciale</span> sur-mesure
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto font-light">
                En <span className="font-bold">5 minutes</span>, obtenez une stratégie <span className="italic">complète</span> adaptée à votre entreprise et votre prospect.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8">
              <div className="border border-white/10 p-8 hover:border-white/30 transition-all group bg-white/5 backdrop-blur-xl">
                <Phone className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-2 text-lg">Cold Call <span className="italic font-light">ou</span> Qualifié</h3>
                <p className="text-sm text-white/50 font-light">Stratégie adaptée au contexte de votre appel</p>
              </div>
              <div className="border border-white/10 p-8 hover:border-white/30 transition-all group bg-white/5 backdrop-blur-xl">
                <Sparkles className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-2 text-lg"><span className="italic">IA</span> Hyper-personnalisée</h3>
                <p className="text-sm text-white/50 font-light">Génération basée sur votre contexte <span className="font-semibold">unique</span></p>
              </div>
              <div className="border border-white/10 p-8 hover:border-white/30 transition-all group bg-white/5 backdrop-blur-xl">
                <Target className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-2 text-lg">Stratégie <span className="italic">complète</span></h3>
                <p className="text-sm text-white/50 font-light">Pas juste un script, un <span className="font-semibold">plan d'action</span></p>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="mt-12 px-10 py-5 bg-white text-black hover:bg-white/90 font-bold text-lg transition-all transform hover:scale-105"
            >
              Commencer l'analyse
            </button>
          </div>
        )}

        {stage === 'questions' && question && (
          <div className="space-y-8 py-8">
            <div className="space-y-4">
              {sectionProgress && (
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 border border-white/20 px-6 py-3 bg-white/5 backdrop-blur-xl">
                    <span className="text-sm font-bold">
                      Section {sectionProgress.current}/{sectionProgress.total}
                    </span>
                    <span className="text-white/30">·</span>
                    <span className="text-sm font-light italic">{sectionProgress.name}</span>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between text-sm text-white/40 font-light">
                <span>Question <span className="font-semibold">{currentQuestion + 1}</span> sur {filteredQuestions.length}</span>
                <span className="font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="h-0.5 bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="border border-white/20 p-8 bg-white/5 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 border border-white/20 flex items-center justify-center bg-white/5">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex-1 pt-2">
                  <p className="text-xl leading-relaxed font-light">
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
                        className="w-full text-left p-5 border border-white/20 hover:bg-white hover:text-black transition-all group font-light bg-white/5 backdrop-blur-xl"
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
                      className="w-full p-5 bg-white/5 backdrop-blur-xl border border-white/20 focus:border-white resize-none focus:outline-none text-white placeholder-white/30 font-light"
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
                      className="w-full p-5 bg-white text-black hover:bg-white/90 font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
              <div className="inline-block p-6 border border-white/20 bg-white/5 backdrop-blur-xl">
                <Mail className="w-16 h-16" />
              </div>
              <h2 className="text-4xl font-bold">Votre stratégie est <span className="italic font-light">presque</span> prête !</h2>
              <p className="text-lg text-white/50 font-light">
                Entrez votre email pour recevoir votre stratégie <span className="font-semibold">commerciale complète</span> et personnalisée.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full p-5 bg-white/5 backdrop-blur-xl border border-white/20 focus:border-white focus:outline-none text-lg text-white placeholder-white/30 font-light"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEmailSubmit();
                  }
                }}
              />
              <button
                onClick={handleEmailSubmit}
                disabled={isGenerating || !email.includes('@')}
                className="w-full p-5 bg-white text-black hover:bg-white/90 font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
              🔒 Vos données sont <span className="font-semibold">sécurisées</span>. Stratégie envoyée par email + accessible immédiatement.
            </p>
          </div>
        )}

        {stage === 'result' && strategy && (
          <div className="space-y-10 py-8">
            <div className="text-center space-y-6">
              <div className="inline-block p-6 border border-white/20 bg-white/5 backdrop-blur-xl">
                <Target className="w-16 h-16" />
              </div>
              <h2 className="text-4xl font-bold">Votre stratégie est <span className="italic font-light">prête</span> ! 🎯</h2>
              <p className="text-white/50 font-light">
                Envoyée à <span className="font-semibold text-white">{email}</span>
              </p>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 hover:bg-white hover:text-black transition-all font-light bg-white/5 backdrop-blur-xl"
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

            <div className="relative -mx-6 py-16 bg-gradient-to-b from-black via-gray-900 to-black">
              <div className="relative z-10 max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-8 font-semibold text-sm backdrop-blur-xl shadow-lg">
                    <Sparkles className="w-5 h-5" />
                    NIVEAU SUPÉRIEUR
                  </div>
                  <h3 className="text-5xl md:text-6xl font-bold mb-6 leading-tight max-w-4xl mx-auto text-white">
                    Et si vous aviez cette stratégie <span className="italic font-light">en direct</span> pendant vos appels ?
                  </h3>
                  <p className="text-xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed">
                    <span className="font-bold text-white">Sales Whisperer</span> analyse vos conversations en temps réel et vous suggère exactement quoi dire.
                  </p>
                </div>

                <div className="grid md:grid-cols-6 gap-6 mb-16">
                  <div className="md:col-span-4 border-2 border-white/20 p-10 hover:border-blue-400 transition-all bg-black/40 backdrop-blur-2xl">
                    <div className="flex items-start justify-between mb-8">
                      <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
                        <Zap className="w-12 h-12" />
                      </div>
                      <div className="px-4 py-2 bg-green-500 text-white font-bold text-sm shadow-lg">
                        &lt; 1 seconde
                      </div>
                    </div>
                    <h4 className="text-3xl font-bold mb-4 text-white">Insights en temps réel</h4>
                    <p className="text-white/70 text-lg leading-relaxed">
                      Obtenez des recommandations claires instantanément. Débloquez chaque situation et finalisez votre closing en toute confiance.
                    </p>
                  </div>

                  <div className="md:col-span-2 border-2 border-white/20 p-10 hover:border-purple-400 transition-all bg-black/40 backdrop-blur-2xl">
                    <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-6 w-fit shadow-xl">
                      <Sparkles className="w-12 h-12" />
                    </div>
                    <h4 className="text-2xl font-bold mb-4 text-white">Fine Tuning IA</h4>
                    <p className="text-white/70 leading-relaxed">
                      IA entraînée sur les meilleures stratégies de vente
                    </p>
                  </div>

                  <div className="md:col-span-2 border-2 border-white/20 p-10 hover:border-green-400 transition-all bg-black/40 backdrop-blur-2xl">
                    <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 text-white mb-6 w-fit shadow-xl">
                      <TrendingUp className="w-12 h-12" />
                    </div>
                    <h4 className="text-2xl font-bold mb-4 text-white">Progression mesurable</h4>
                    <p className="text-white/70 leading-relaxed">
                      Stats détaillées et analyses de performance
                    </p>
                  </div>

                  <div className="md:col-span-4 border-2 border-white/20 p-10 hover:border-orange-400 transition-all bg-black/40 backdrop-blur-2xl">
                    <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 text-white mb-6 w-fit shadow-xl">
                      <Target className="w-12 h-12" />
                    </div>
                    <h4 className="text-3xl font-bold mb-4 text-white">Un copilote intelligent, pas un remplaçant</h4>
                    <p className="text-white/70 text-lg leading-relaxed">
                      Renforcez vos performances en argumentant mieux, en rebondissant plus vite et en closant davantage, tout en gardant votre style naturel.
                    </p>
                  </div>
                </div>

                <div className="text-center py-12 border-t-2 border-white/20 backdrop-blur-xl bg-black/20">
                  <a
                    href="https://www.saleswhisperer.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 font-bold text-xl transition-all transform hover:scale-105 shadow-2xl mb-6"
                  >
                    <Zap className="w-8 h-8" />
                    Découvrir Sales Whisperer
                  </a>
                  <div className="flex items-center justify-center gap-2 text-sm text-white/60">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>Compatible <span className="font-semibold text-white">Google Meet · Teams · Zoom · Salesforce</span></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="border border-white/20 p-8 space-y-4 bg-white/5 backdrop-blur-xl">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <Phone className="w-7 h-7" />
                  Introduction <span className="font-light italic">({answers.call_type === 'cold' ? 'Cold Call' : 'Call Qualifié'})</span>
                </h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-line font-light">{strategy.intro}</p>
              </div>

              <div className="border border-white/20 p-8 space-y-4 bg-white/5 backdrop-blur-xl">
                <h3 className="text-xl font-bold">🔍 Questions de <span className="italic">Découverte</span></h3>
                <ul className="space-y-4">
                  {strategy.discovery.map((q, idx) => (
                    <li key={idx} className="text-white/80 flex items-start gap-4 p-4 border border-white/10 font-light bg-white/5 backdrop-blur-xl">
                      <span className="font-bold flex-shrink-0">{idx + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-white/20 p-8 space-y-4 bg-white/5 backdrop-blur-xl">
                <h3 className="text-xl font-bold">💎 Positionnement de <span className="italic">Valeur</span></h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-line font-light">{strategy.value_positioning}</p>
              </div>

              <div className="border border-white/20 p-8 space-y-4 bg-white/5 backdrop-blur-xl">
                <h3 className="text-xl font-bold">⚔️ Différenciation <span className="italic">Concurrentielle</span></h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-line font-light">{strategy.differentiation}</p>
              </div>

              <div className="border border-white/20 p-8 space-y-4 bg-white/5 backdrop-blur-xl">
                <h3 className="text-xl font-bold">🛡️ Traitement de l'<span className="italic">Objection Principale</span></h3>
                <div className="space-y-4">
                  <p className="text-sm text-white/50 font-semibold">{answers.top_objection}</p>
                  <p className="text-white/80 leading-relaxed whitespace-pre-line border border-white/10 p-6 font-light bg-white/5 backdrop-blur-xl">
                    {strategy.objection_handling[answers.top_objection]}
                  </p>
                </div>
              </div>

              <div className="border border-white/20 p-8 space-y-4 bg-white/5 backdrop-blur-xl">
                <h3 className="text-xl font-bold">✅ <span className="italic">Closing</span> & Prochaines Étapes</h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-line font-light">{strategy.closing}</p>
              </div>

              <div className="border border-white/20 p-8 space-y-4 bg-white/5 backdrop-blur-xl">
                <h3 className="text-xl font-bold">📧 Email de <span className="italic">Suivi</span></h3>
                <div className="border border-white/10 p-6 font-mono text-sm text-white/70 whitespace-pre-line font-light bg-white/5 backdrop-blur-xl">
                  {strategy.follow_up_email}
                </div>
              </div>
            </div>

            <div className="border border-white/10 p-8 bg-white/5 backdrop-blur-xl">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Conseils d'utilisation
              </h4>
              <ul className="space-y-3 text-sm text-white/60 font-light">
                <li>• <span className="font-semibold">Personnalisez</span> chaque élément selon le prospect spécifique</li>
                <li>• Pratiquez à <span className="italic">voix haute</span> avant vos appels importants</li>
                <li>• Adaptez le <span className="font-semibold">ton</span> selon les réactions de votre interlocuteur</li>
                <li>• Utilisez cette stratégie comme <span className="italic">guide</span>, pas comme script rigide</li>
                <li>• Prenez des <span className="font-semibold">notes</span> pendant le call pour affiner votre approche</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
