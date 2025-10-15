import React, { useState } from 'react';
import { Send, Sparkles, Target, Zap, Phone, Mail, Copy, Check } from 'lucide-react';

const ScriptLabPro = () => {
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
        setStrategy(data.strategy);
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
    
    return {
      intro: isCold 
        ? `Bonjour ${answers.prospect_title || '[Prénom]'}, je suis [Votre nom] de ${answers.company_name || '[Entreprise]'}.\n\nJe travaille avec des ${isB2B ? 'entreprises' : 'professionnels'} qui ${answers.main_pain || 'cherchent à améliorer leurs résultats'}.\n\nJ'ai vu que ${answers.trigger_events || 'votre contexte pourrait bénéficier de notre approche'}. Avez-vous 2 minutes pour que je vous explique pourquoi je vous contacte ?`
        : `Bonjour ${answers.prospect_title || '[Prénom]'}, merci de prendre ce temps.\n\nJe sais que vous avez manifesté un intérêt pour ${answers.product_type}. Pour optimiser notre échange, j'aimerais d'abord comprendre votre situation actuelle.\n\nPouvez-vous me parler de ${answers.main_pain || 'vos défis actuels'} ?`,
      
      discovery: [
        `Parlez-moi de votre contexte actuel concernant ${answers.main_pain || 'ce sujet'}. Qu'est-ce qui fonctionne, qu'est-ce qui ne fonctionne pas ?`,
        `${answers.trigger_events ? `Vous mentionnez ${answers.trigger_events}. Depuis combien de temps cette situation dure-t-elle ?` : 'Quels sont vos objectifs prioritaires pour les 6-12 prochains mois ?'}`,
        `Si vous pouviez résoudre UN seul problème aujourd'hui, lequel choisiriez-vous et pourquoi ?`,
        `Comment mesurez-vous le succès actuellement ? Quels KPIs regardez-vous ?`
      ],
      
      value_positioning: `Ce qui nous distingue : ${answers.value_prop || '[votre proposition de valeur]'}.\n\nContrairement à ${answers.competitors || 'd\'autres solutions'}, ${answers.usp || 'notre approche unique permet'}.\n\nConcrètement, nos clients ${isB2B ? 'B2B' : ''} constatent [résultat mesurable] en [délai], ce qui leur permet de [impact business].`,
      
      differentiation: `Vs ${answers.competitors || 'concurrents'} :\n- ${answers.usp || 'Notre différenciateur clé'}\n- Pas de [friction habituelle du marché]\n- [Bénéfice unique que personne d'autre n'offre]`,
      
      objection_handling: {
        [answers.top_objection]: answers.top_objection === '"C\'est trop cher"'
          ? `"Je comprends la question du budget. Laissez-moi vous poser une question : combien vous coûte ${answers.main_pain || 'le problème actuel'} par mois ?\n\nSi notre solution vous permet de ${answers.value_prop || 'résoudre ce problème'}, le ROI se fait en [calculer durée]. C'est un investissement, pas une dépense."`
          : answers.top_objection === '"On a déjà un outil"'
          ? `"Excellent, vous avez déjà ${answers.competitors || 'une solution'}. Question : qu'est-ce qui manque aujourd'hui ? Si c'était parfait, seriez-vous en train de me parler ?\n\nLa plupart de nos clients utilisaient [concurrent] avant. Ce qui les a fait changer : ${answers.usp || '[votre différence]'}."`
          : answers.top_objection === '"Pas le bon moment"'
          ? `"Je comprends. Par curiosité, qu'est-ce qui ferait que ce SERAIT le bon moment ? [Attendre réponse]\n\nSouvent, 'pas le bon moment' signifie que ce n'est pas assez prioritaire. Si ${answers.main_pain || 'ce problème'} persiste dans 6 mois, quel impact cela aura-t-il ?"`
          : `"${answers.top_objection} - Je comprends cette préoccupation. Laissez-moi vous partager comment nos clients ont surmonté exactement cette même question..."`
      },
      
      closing: answers.call_objective === 'Obtenir un RDV découverte'
        ? `"D'après ce que vous m'avez partagé, ${answers.main_pain || 'votre situation'} mérite qu'on creuse ensemble.\n\nProchaine étape logique : un échange de 30 minutes avec [expert interne] pour voir concrètement comment on pourrait vous aider.\n\nJe regarde mon agenda - vous préférez mardi ou jeudi cette semaine ?"`
        : answers.call_objective === 'Closer la vente'
        ? `"Récapitulons : vous cherchez à ${answers.value_prop || '[objectif]'}, vous avez identifié que ${answers.main_pain || '[pain]'} est votre blocage principal, et notre solution répond précisément à ça.\n\nSur une échelle de 1 à 10, où vous situez-vous dans votre décision ? [Attendre]\n\nQu'est-ce qui vous manque pour passer à ${answers.decision_maker === 'Mon interlocuteur direct' ? '10' : 'convaincre votre direction'} ?"`
        : `"Quelle serait la prochaine étape logique pour vous ? Qu'est-ce qui vous aiderait à avancer dans votre réflexion ?"`,
      
      follow_up_email: `Objet : Suite à notre échange - ${answers.company_name || '[Votre entreprise]'}\n\nBonjour ${answers.prospect_title || '[Prénom]'},\n\nMerci pour cet échange de qualité ce ${answers.channel === 'Téléphone' ? 'matin' : 'jour'}.\n\nComme discuté, vous cherchez à ${answers.value_prop || '[résoudre X]'}, et votre principal défi est ${answers.main_pain || '[Y]'}.\n\nVoici les 3 points clés à retenir :\n1. ${answers.usp || '[Point clé 1]'}\n2. [Point clé 2 basé sur la conversation]\n3. [Point clé 3]\n\nProchaine étape : ${answers.call_objective || '[action]'}\n\nDisponible pour échanger ?\n\nBien à vous,\n[Signature]`
    };
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Script Lab PRO
            </h1>
            <p className="text-xs text-slate-400">by Sales Whisperer</p>
          </div>
          <a 
            href="https://www.saleswhisperer.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Découvrir Sales Whisperer →
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {stage === 'intro' && (
          <div className="text-center space-y-8 py-12">
            <div className="inline-block p-4 bg-blue-500/10 rounded-full">
              <Target className="w-16 h-16 text-blue-400" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">Créez votre stratégie commerciale sur-mesure</h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                En 5 minutes, obtenez une stratégie complète adaptée à votre entreprise et votre prospect.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8">
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <Phone className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="font-semibold mb-2">Cold Call ou Qualifié</h3>
                <p className="text-sm text-slate-400">Stratégie adaptée au contexte de votre appel</p>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <Zap className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="font-semibold mb-2">IA Hyper-personnalisée</h3>
                <p className="text-sm text-slate-400">Génération basée sur votre contexte unique</p>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <Target className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="font-semibold mb-2">Stratégie complète</h3>
                <p className="text-sm text-slate-400">Pas juste un script, un plan d'action</p>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20"
            >
              Commencer l'analyse
            </button>
          </div>
        )}

        {stage === 'questions' && question && (
          <div className="space-y-6 py-8">
            <div className="space-y-4">
              {sectionProgress && (
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
                    <span className="text-sm font-medium text-blue-400">
                      Section {sectionProgress.current}/{sectionProgress.total}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-sm text-slate-300">{sectionProgress.name}</span>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between text-sm text-slate-400">
                <span>Question {currentQuestion + 1} sur {filteredQuestions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-lg leading-relaxed">
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
                        className="w-full text-left p-4 bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700 hover:border-blue-600 rounded-lg transition-all group"
                      >
                        <span className="group-hover:text-blue-400 transition-colors">{optionLabel}</span>
                      </button>
                    );
                  })
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={question.placeholder}
                      className="w-full p-4 bg-slate-800/30 border border-slate-700 focus:border-blue-600 rounded-lg resize-none focus:outline-none"
                      rows="3"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          handleTextSubmit();
                        }
                      }}
                    />
                    <button
                      onClick={handleTextSubmit}
                      disabled={!textInput.trim()}
                      className="w-full p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="max-w-xl mx-auto space-y-6 py-12">
            <div className="text-center space-y-4">
              <div className="inline-block p-4 bg-blue-500/10 rounded-full">
                <Mail className="w-12 h-12 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold">Votre stratégie est presque prête !</h2>
              <p className="text-slate-300">
                Entrez votre email pour recevoir votre stratégie commerciale complète et personnalisée.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full p-4 bg-slate-800/50 border border-slate-700 focus:border-blue-600 rounded-lg focus:outline-none text-lg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEmailSubmit();
                  }
                }}
              />
              <button
                onClick={handleEmailSubmit}
                disabled={isGenerating || !email.includes('@')}
                className="w-full p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Génération de votre stratégie...
                  </>
                ) : (
                  'Générer ma stratégie'
                )}
              </button>
            </div>

            <p className="text-xs text-center text-slate-500">
              🔒 Vos données sont sécurisées. Stratégie envoyée par email + accessible immédiatement.
            </p>
          </div>
        )}

        {stage === 'result' && strategy && (
          <div className="space-y-8 py-8">
            <div className="text-center space-y-4">
              <div className="inline-block p-4 bg-green-500/10 rounded-full">
                <Target className="w-12 h-12 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold">Votre stratégie commerciale est prête ! 🎯</h2>
              <p className="text-slate-300">
                Stratégie envoyée à <span className="text-blue-400">{email}</span>
              </p>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copier toute la stratégie</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-900/50 to-slate-800/50 border border-blue-700/50 rounded-lg p-6 space-y-4">
                <h3 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
                  <Phone className="w-6 h-6" />
                  Introduction {answers.call_type === 'cold' ? '(Cold Call)' : '(Call Qualifié)'}
                </h3>
                <p className="text-slate-200 leading-relaxed whitespace-pre-line">{strategy.intro}</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-bold text-blue-400">🔍 Questions de Découverte</h3>
                <ul className="space-y-3">
                  {strategy.discovery.map((q, idx) => (
                    <li key={idx} className="text-slate-200 flex items-start gap-3 p-3 bg-slate-900/50 rounded">
                      <span className="text-blue-400 font-bold flex-shrink-0">{idx + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-bold text-blue-400">💎 Positionnement de Valeur</h3>
                <p className="text-slate-200 leading-relaxed whitespace-pre-line">{strategy.value_positioning}</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-bold text-blue-400">⚔️ Différenciation Concurrentielle</h3>
                <p className="text-slate-200 leading-relaxed whitespace-pre-line">{strategy.differentiation}</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-bold text-blue-400">🛡️ Traitement de l'Objection Principale</h3>
                <div className="space-y-3">
                  <p className="text-sm text-slate-400 font-medium">{answers.top_objection}</p>
                  <p className="text-slate-200 leading-relaxed whitespace-pre-line bg-slate-900/50 p-4 rounded">
                    {strategy.objection_handling[answers.top_objection]}
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-bold text-blue-400">✅ Closing & Prochaines Étapes</h3>
                <p className="text-slate-200 leading-relaxed whitespace-pre-line">{strategy.closing}</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-bold text-blue-400">📧 Email de Suivi</h3>
                <div className="bg-slate-900/50 p-4 rounded font-mono text-sm text-slate-300 whitespace-pre-line">
                  {strategy.follow_up_email}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 space-y-4">
              <h3 className="text-2xl font-bold">Imaginez avoir cet assistant EN DIRECT pendant vos appels 🚀</h3>
              <p className="text-blue-100">
                <strong>Sales Whisperer</strong> vous suggère les bonnes réponses en temps réel, analyse votre conversation, gère les objections et vous aide à closer plus efficacement.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="https://www.saleswhisperer.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Découvrir Sales Whisperer
                </a>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <h4 className="font-bold mb-3 text-slate-200 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Conseils d'utilisation
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Personnalisez chaque élément selon le prospect spécifique</li>
                <li>• Pratiquez à voix haute avant vos appels importants</li>
                <li>• Adaptez le ton selon les réactions de votre interlocuteur</li>
                <li>• Utilisez cette stratégie comme guide, pas comme script rigide</li>
                <li>• Prenez des notes pendant le call pour affiner votre approche</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ScriptLabPro;
