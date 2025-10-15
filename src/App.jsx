import React, { useState } from 'react';
import { Send, Sparkles, TrendingUp, Target, Zap } from 'lucide-react';

const App = () => {
  const [stage, setStage] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const questions = [
    {
      id: 'market',
      text: "Commençons par le commencement : vous vendez en B2B ou B2C ?",
      type: 'choice',
      options: ['B2B', 'B2C', 'Les deux'],
    },
    {
      id: 'product_type',
      text: "Quel type de solution proposez-vous ?",
      type: 'choice',
      options: ['SaaS/Logiciel', 'Service/Conseil', 'Produit physique', 'Formation/Éducation'],
    },
    {
      id: 'ticket',
      text: "Quel est votre ticket moyen approximatif ?",
      type: 'choice',
      options: ['< 1 000€', '1 000€ - 5 000€', '5 000€ - 20 000€', '> 20 000€'],
      condition: (ans) => ans.market === 'B2B' || ans.market === 'Les deux'
    },
    {
      id: 'cycle_length',
      text: "Combien de temps dure en moyenne votre cycle de vente ?",
      type: 'choice',
      options: ['< 1 semaine', '1-4 semaines', '1-3 mois', '> 3 mois'],
      condition: (ans) => ans.market === 'B2B' || ans.market === 'Les deux'
    },
    {
      id: 'sales_stage',
      text: "À quelle étape avez-vous le plus besoin d'aide ?",
      type: 'choice',
      options: ['Prospection à froid', 'Qualification/Découverte', 'Démonstration/Présentation', 'Négociation/Closing'],
    },
    {
      id: 'channel',
      text: "Quel est votre principal canal de vente ?",
      type: 'choice',
      options: ['Appels téléphoniques', 'Emails', 'Visioconférence', 'Rendez-vous physiques', 'LinkedIn/Social'],
    },
    {
      id: 'main_challenge',
      text: "Quel est votre principal défi actuellement ?",
      type: 'choice',
      options: [
        'Obtenir des rendez-vous',
        'Gérer les objections',
        'Différencier mon offre',
        'Conclure les ventes',
        'Accélérer le cycle de vente'
      ],
    },
    {
      id: 'objection',
      text: "Quelle objection rencontrez-vous le plus souvent ?",
      type: 'choice',
      options: [
        '"C\'est trop cher"',
        '"On a déjà un fournisseur"',
        '"Pas le bon moment"',
        '"Je dois en parler à..."',
        '"Envoyez-moi une doc"'
      ],
    },
    {
      id: 'value_prop',
      text: "En une phrase : quelle transformation apportez-vous à vos clients ?",
      type: 'text',
      placeholder: 'Ex: On aide les PME à doubler leur productivité en automatisant...',
    },
    {
      id: 'tone',
      text: "Dernière question : quel ton correspond le mieux à votre style ?",
      type: 'choice',
      options: ['Professionnel et corporate', 'Consultatif et expert', 'Direct et impactant', 'Chaleureux et relationnel'],
    },
  ];

  const getFilteredQuestions = () => {
    return questions.filter(q => !q.condition || q.condition(answers));
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

  const handleEmailSubmit = () => {
    if (email && email.includes('@')) {
      setIsTyping(true);
      setTimeout(() => {
        setStage('result');
        setIsTyping(false);
      }, 1200);
    }
  };

  const generateScript = () => {
    const isBtoB = answers.market === 'B2B' || answers.market === 'Les deux';
    const isHighTicket = answers.ticket && (answers.ticket.includes('20 000') || answers.ticket.includes('5 000'));
    const isProspecting = answers.sales_stage?.includes('Prospection');
    
    return {
      hook: isProspecting 
        ? `"Bonjour [Prénom], je suis [Votre nom] de [Entreprise]. Je vous contacte parce que je travaille avec des ${isBtoB ? 'entreprises comme la vôtre' : 'professionnels'} qui cherchent à ${answers.value_prop?.toLowerCase() || 'améliorer leurs résultats'}. Ai-je 2 minutes pour vous expliquer pourquoi je vous appelle ?"` 
        : `"Merci de me recevoir. Pour optimiser notre temps, j'aimerais comprendre vos enjeux actuels. Qu'est-ce qui vous a motivé à explorer une solution comme la nôtre ?"`,
      
      discovery: [
        isBtoB ? "Quels sont vos objectifs principaux pour les 6-12 prochains mois ?" : "Qu'est-ce qui vous pousse à chercher une solution maintenant ?",
        `Comment gérez-vous actuellement [pain point lié à ${answers.product_type}] ?`,
        "Si vous pouviez améliorer un seul aspect de votre process actuel, lequel choisiriez-vous ?"
      ],
      
      value: answers.main_challenge?.includes('Différencier') 
        ? `"Ce qui nous distingue : ${answers.value_prop}. Contrairement aux solutions classiques, notre approche vous permet de [bénéfice mesurable]. Nos clients constatent en moyenne [résultat concret] en [délai]."`
        : `"Concrètement, ${answers.value_prop}. Cela signifie que vous [bénéfice 1], [bénéfice 2], et surtout [bénéfice 3 émotionnel]."`,
      
      objections: {
        price: '"Je comprends la question du prix. Laissez-moi vous poser une question : quel est le coût de ne rien changer ? Si notre solution vous permet de [ROI concret], l\'investissement se rembourse en [durée]."',
        timing: '"Justement, c\'est souvent le signal qu\'il est temps d\'agir. Les meilleures décisions sont rarement prises dans l\'urgence. Que diriez-vous qu\'on prépare le terrain maintenant pour être prêt quand le moment sera optimal ?"',
        competitor: '"Excellent, vous avez déjà une solution en place. Par curiosité, qu\'est-ce qui pourrait vous faire envisager un changement ? Quelles sont les limites de votre système actuel ?"',
        decision: `"${isBtoB && isHighTicket ? 'Tout à fait normal pour un investissement de cette nature' : 'Je comprends'}. Qui d'autre devrait être impliqué dans cette réflexion ? Organisons un point avec toutes les parties prenantes."`
      },
      
      closing: answers.main_challenge?.includes('Conclure') 
        ? `"D'après ce que vous m'avez dit, il semble que [récapituler besoin] soit une priorité. Notre solution répond précisément à cela. Sur une échelle de 1 à 10, où vous situez-vous dans votre réflexion ? [Attendre réponse] Qu'est-ce qui vous manque pour passer de [X] à 10 ?"` 
        : `"Récapitulons : vous cherchez à [objectif], et nous pouvons vous aider via [solution]. Quelle est la prochaine étape logique pour vous ?"`,
    };
  };

  const script = stage === 'result' ? generateScript() : null;

  const filteredQuestions = getFilteredQuestions();
  const question = stage === 'questions' ? filteredQuestions[currentQuestion] : null;
  const progress = stage === 'questions' ? ((currentQuestion + 1) / filteredQuestions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Script Lab</h1>
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
              <Sparkles className="w-16 h-16 text-blue-400" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">Créez votre script de vente personnalisé</h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                En 2 minutes, obtenez un script adapté à votre situation, vos prospects et vos objectifs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8">
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <Target className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="font-semibold mb-2">Questions ciblées</h3>
                <p className="text-sm text-slate-400">10 questions max pour comprendre votre contexte</p>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <Zap className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="font-semibold mb-2">Script instantané</h3>
                <p className="text-sm text-slate-400">Généré en fonction de votre profil unique</p>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <TrendingUp className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="font-semibold mb-2">Prêt à l'emploi</h3>
                <p className="text-sm text-slate-400">Utilisez-le immédiatement dans vos calls</p>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="mt-8 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
            >
              Commencer l'analyse
            </button>
          </div>
        )}

        {stage === 'questions' && question && (
          <div className="space-y-6 py-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Question {currentQuestion + 1} sur {filteredQuestions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
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
                  question.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      className="w-full text-left p-4 bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700 hover:border-blue-600 rounded-lg transition-all"
                    >
                      {option}
                    </button>
                  ))
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
                      className="w-full p-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
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
                <Sparkles className="w-12 h-12 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold">Votre script est presque prêt !</h2>
              <p className="text-slate-300">
                Entrez votre email pour recevoir votre script personnalisé et des conseils exclusifs pour booster vos ventes.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full p-4 bg-slate-800/50 border border-slate-700 focus:border-blue-600 rounded-lg focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEmailSubmit();
                  }
                }}
              />
              <button
                onClick={handleEmailSubmit}
                disabled={isTyping || !email.includes('@')}
                className="w-full p-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTyping ? 'Génération en cours...' : 'Générer mon script'}
              </button>
            </div>

            <p className="text-xs text-center text-slate-500">
              🔒 Vos données sont sécurisées. Pas de spam, juste du contenu de qualité.
            </p>
          </div>
        )}

        {stage === 'result' && script && (
          <div className="space-y-8 py-8">
            <div className="text-center space-y-4">
              <div className="inline-block p-4 bg-green-500/10 rounded-full">
                <Sparkles className="w-12 h-12 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold">Votre script personnalisé est prêt !</h2>
              <p className="text-slate-300">Un email de confirmation a été envoyé à <span className="text-blue-400">{email}</span></p>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-bold text-blue-400">🎯 Accroche d'ouverture</h3>
                <p className="text-slate-200 leading-relaxed">{script.hook}</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-bold text-blue-400">🔍 Questions de découverte</h3>
                <ul className="space-y-3">
                  {script.discovery.map((q, idx) => (
                    <li key={idx} className="text-slate-200 flex items-start gap-2">
                      <span className="text-blue-400 font-bold">{idx + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-bold text-blue-400">💎 Argumentation de valeur</h3>
                <p className="text-slate-200 leading-relaxed">{script.value}</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-bold text-blue-400">🛡️ Traitement des objections</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">"C'est trop cher"</p>
                    <p className="text-slate-200 leading-relaxed">{script.objections.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">"Pas le bon moment"</p>
                    <p className="text-slate-200 leading-relaxed">{script.objections.timing}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">"On a déjà un fournisseur"</p>
                    <p className="text-slate-200 leading-relaxed">{script.objections.competitor}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-bold text-blue-400">✅ Technique de closing</h3>
                <p className="text-slate-200 leading-relaxed">{script.closing}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 space-y-4">
              <h3 className="text-2xl font-bold">Imaginez avoir cet assistant EN DIRECT pendant vos appels 🚀</h3>
              <p className="text-blue-100">
                Sales Whisperer vous suggère les bonnes réponses en temps réel, analyse votre conversation et vous aide à closer plus efficacement.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="https://www.saleswhisperer.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Découvrir Sales Whisperer
                </a>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-blue-800 hover:bg-blue-900 font-semibold rounded-lg transition-colors"
                >
                  Télécharger le script (PDF)
                </button>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <h4 className="font-bold mb-3 text-slate-200">💡 Conseils d'utilisation</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Personnalisez chaque script selon le prospect spécifique</li>
                <li>• Pratiquez à voix haute avant vos appels</li>
                <li>• Notez ce qui fonctionne et ajustez progressivement</li>
                <li>• Utilisez le script comme guide, pas comme téléprompter</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
