import { useState, useEffect } from 'react';
import { 
  Leaf, Settings, QrCode, RefreshCw, HelpCircle, Database, 
  ArrowRight, Plus, Trash2, Award, Server, LogOut, Activity, 
  CheckCircle2, XCircle, Star, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// === DATOS QUEMADOS INICIALES ===
const INITIAL_CONSEJOS = [
  {
    id: 'consejo-1',
    texto: 'Cierra el grifo mientras te cepillas los dientes. Puedes ahorrar hasta 12 litros de agua por minuto.',
    categoria: 'Agua',
    autor: 'Equipo CEA'
  },
  {
    id: 'consejo-2',
    texto: 'Sustituye bombillas incandescentes por iluminación LED. Consumen hasta un 80% menos de electricidad.',
    categoria: 'Energía',
    autor: 'Guardabosque Carlos'
  },
  {
    id: 'consejo-3',
    texto: 'Fomenta la biodiversidad plantando flores autóctonas para atraer abejas y polinizadores.',
    categoria: 'Biodiversidad',
    autor: 'Bióloga Sofía'
  },
  {
    id: 'consejo-4',
    texto: 'Separa tus residuos orgánicos para fabricar composta en casa y reducir tu basura.',
    categoria: 'Residuos',
    autor: 'Eco Guardián'
  },
  {
    id: 'consejo-5',
    texto: 'Para trayectos de menos de 2 km, prefiere caminar o ir en bicicleta. Beneficiarás tu salud.',
    categoria: 'Transporte',
    autor: 'Equipo CEA'
  }
];

const INITIAL_PREGUNTAS = [
  {
    id: 'trivia-1',
    pregunta: 'Anualmente en los océanos, ¿cuál de estos materiales tarda más tiempo en degradarse por completo?',
    opcionA: 'Botella de vidrio estándar (Tarda unos 4,000 años)',
    opcionB: 'Bolsa de plástico común (Tarda unos 150 a 500 años)',
    correcta: 'A',
    explicacion: '¡El vidrio de sílice es sumamente resistente! Tarda miles de años en desintegrarse totalmente.'
  },
  {
    id: 'trivia-2',
    pregunta: '¿Cuál de las siguientes acciones consume la mayor cantidad de agua potable promedio en un hogar?',
    opcionA: 'Tomar una ducha acelerada de 5 minutos',
    opcionB: 'Lavar la vajilla a mano manteniendo el grifo abierto',
    correcta: 'B',
    explicacion: 'Lavar trastos con grifo abierto consume unos 100 litros, el doble que una ducha eficiente.'
  }
];

// === VISTA TOTEM ===
function TotemView({ currentConsejos, onNavigateToPlay, onAddLog }) {
  const [consejo, setConsejo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('pending');
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    onAddLog('Fetch /api/consejo', 'Iniciando reclamo a https://proyecto-cea.onrender.com/api/consejo', true);

    fetch('https://proyecto-cea.onrender.com/api/consejo')
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (isMounted) {
          const fetchedConsejo = Array.isArray(data) ? data[0] : data;
          setConsejo(fetchedConsejo);
          setConnectionStatus('success');
          setLoading(false);
          onAddLog('Fetch /api/consejo exitoso', `Consejo: "${fetchedConsejo.texto.substring(0, 30)}..."`, true);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setConnectionStatus('failed');
          setLoading(false);
          const randomIdx = Math.floor(Math.random() * currentConsejos.length);
          setConsejo(currentConsejos[randomIdx] || INITIAL_CONSEJOS[0]);
          onAddLog('Fetch /api/consejo fallido', 'No se conectó al puerto 5000. Activando base de datos alternativa local.', false);
        }
      });

    return () => { isMounted = false; };
  }, [refreshCount, currentConsejos]);

  const getCategoryColor = (cat) => {
    if (cat === 'Agua') return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    if (cat === 'Energía') return 'bg-amber-100 text-amber-800 border-amber-200';
    if (cat === 'Biodiversidad') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (cat === 'Residuos') return 'bg-stone-250 text-stone-800 border-stone-300';
    return 'bg-indigo-100 text-indigo-800 border-indigo-200';
  };

  // === 1. CONFIGURACIÓN DEL QR DINÁMICO PARA LA NUBE ===
  const mobilePlayUrl = "https://proyecto-cea.netlify.app/?view=play";
  
  // Api de Google que genera el QR con fondo transparente/blanco de 200x200px
  const qrImageUrl = `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(mobilePlayUrl)}`;

  return (
    <div id="totem-interface" className="fade-in max-w-6xl mx-auto py-4 px-4 relative z-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 glass p-4 rounded-2xl shadow-sm border border-white/45">
        <div className="flex items-center gap-2.5">
          <div className={`w-3 h-3 rounded-full ${connectionStatus === 'success' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between glass text-emerald-950 rounded-3xl p-8 shadow-xl relative overflow-hidden min-h-[450px] border border-white/35">
          <div className="relative z-10">
            <span className="bg-emerald-900/10 text-emerald-800 font-mono text-xs uppercase px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 animate-bounce" /> Portal de Conciencia Ambiental
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-tight text-emerald-900 tracking-tight mt-4">
              Respira la <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-emerald-500">Naturaleza.</span>
            </h1>
          </div>

          <div className="my-8 relative z-10">
            <h3 className="text-xs uppercase font-mono tracking-widest text-emerald-700 font-extrabold mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> ECO-CONSEJO DEL MOMENTO
            </h3>
            <div className="bg-white/45 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-md">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
                </div>
              ) : consejo ? (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <span className={`text-[10px] uppercase font-mono px-2 py-1 rounded-md border font-semibold ${getCategoryColor(consejo.categoria)}`}>
                      {consejo.categoria}
                    </span>
                    {consejo.autor && <span className="text-[11px] text-emerald-850 italic">Por: {consejo.autor}</span>}
                  </div>
                  <p className="text-emerald-950 text-lg md:text-xl font-medium leading-relaxed italic">"{consejo.texto}"</p>
                </motion.div>
              ) : <p className="text-emerald-950">No hay consejos disponibles.</p>}
            </div>
          </div>

          <div className="flex justify-end items-center pt-4 border-t border-white/20">
            <button 
              onClick={() => setRefreshCount(prev => prev + 1)}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Siguiente Eco-Consejo
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 glass border border-white/35 rounded-3xl p-8 flex flex-col justify-between items-center text-center shadow-md">
          <div>
            <span className="bg-white/50 text-emerald-800 text-xs font-black px-3.5 py-1.5 rounded-full border uppercase tracking-widest inline-block mb-3">
              ¿Quieres participar?
            </span>
            <h2 className="text-2xl font-display font-extrabold text-emerald-950 tracking-tight">Trivia Ecológica Móvil</h2>
            <p className="text-emerald-800 text-xs mt-2 px-4">Escanea el código QR desde tu smartphone para responder preguntas y probar tus conocimientos ecológicos.</p>
          </div>

          {/* === 2. MODIFICADO SUTILMENTE: Reemplazamos los divs estáticos por el QR real === */}
          <div className="my-6 p-5 bg-white/40 rounded-3xl border border-white/50 relative shadow-sm">
            <div className="w-48 h-48 bg-white p-2 rounded-2xl shadow-xs flex items-center justify-center relative overflow-hidden">
              <img 
                src={qrImageUrl} 
                alt="Código QR" 
                className="w-full h-full object-contain relative z-10"
              />
            </div>
          </div>

          <div className="w-full">
            <button
              onClick={onNavigateToPlay}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <QrCode className="w-4 h-4" /> Simular Escaneo QR con Móvil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// === VISTA TRIVIA MÓVIL ===
function PlayView({ currentQuestions, stats, onUpdateStats, onAddLog, onResetPlayerStats }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('pending');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [postStatus, setPostStatus] = useState('idle');
  // NUEVO: Estado para saber si el usuario terminó todas las preguntas de la BD
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    onAddLog('Fetch /api/trivia', 'Iniciando reclamo a https://proyecto-cea.onrender.com/api/trivia', true);

    fetch('https://proyecto-cea.onrender.com/api/trivia')
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (isMounted) {
          const fetchedQuestions = Array.isArray(data) ? data : [data];
          if (fetchedQuestions.length > 0) {
            setQuestions(fetchedQuestions);
            
            const savedIndex = localStorage.getItem('cea_play_index');
            const idx = savedIndex ? parseInt(savedIndex) : 0;
            // Si el índice guardado es mayor o igual a las preguntas que hay, lo reseteamos a 0
            if (idx < fetchedQuestions.length) {
              setCurrentIndex(idx);
            } else {
              setCurrentIndex(0);
              localStorage.setItem('cea_play_index', '0');
            }
          } else {
            setQuestions(currentQuestions);
          }
    
          setConnectionStatus('success');
          setLoading(false);
          onAddLog('Fetch /api/trivia exitoso', `Trivia cargada remotamente. Total: ${fetchedQuestions.length}`, true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setConnectionStatus('failed');
          setLoading(false);
          setQuestions(currentQuestions.length > 0 ? currentQuestions : INITIAL_PREGUNTAS);
          onAddLog('Fetch /api/trivia fallido', 'Usando preguntas locales guardadas en memoria.', false);
        }
      });

    return () => { isMounted = false; };
  }, [currentQuestions]);

  const handleAnswerSelect = async (option) => {
    if (showFeedback) return;
    const activeQuestion = questions[currentIndex];
    if (!activeQuestion) return;

    setSelectedAnswer(option);
    const correct = activeQuestion.correcta === option;
    setIsCorrect(correct);
    setShowFeedback(true);
    onUpdateStats(correct);

    setPostStatus('sending');
    try {
      // OJO: Cambié 'questionId' a 'preguntaId' para que calce con tu Flask del backend
      const response = await fetch('https://proyecto-cea.onrender.com/api/trivia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preguntaId: activeQuestion.id, respuesta: option })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setPostStatus('success');
      onAddLog('POST exitoso', `Respuesta registrada para la pregunta "${activeQuestion.id}"`, true);
    } catch {
      setPostStatus('failed');
      onAddLog('POST fallido', `No se pudo enviar POST a puerto 5000. Guardado localmente.`, false);
    }
  };

  // MODIFICADO: Bloqueamos el bucle infinito del residuo (%)
  const handleNextQuestion = () => {
    if (!questions.length) return;
    
    // Si todavía quedan preguntas en el array de Neon, avanzamos
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      localStorage.setItem('cea_play_index', nextIdx.toString());
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // ¡Llegamos al final real de la base de datos!
      setIsFinished(true);
      localStorage.setItem('cea_play_index', '0'); // Dejamos listo para la próxima sesión
    }
  };

  // NUEVO: Función para que puedan volver a jugar si quieren
  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsFinished(false);
    
    // Llamamos a la función del padre para poner el marcador en 0/0
    if (onResetPlayerStats) {
      onResetPlayerStats();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-stone-600">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
        <p className="text-sm font-medium">Cargando trivia ecológica...</p>
      </div>
    );
  }

  // NUEVO: Si terminó, le plantamos esta vista limpia en vez de romper la UI
  if (isFinished) {
    return (
      <div className="text-center p-8 bg-white border border-stone-100 rounded-3xl shadow-xl max-w-md mx-auto">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-stone-900 tracking-tight">¡Trivia Completada!</h2>
        <p className="text-sm text-stone-600 mt-2">
          Has respondido todas las preguntas disponibles en este Tótem CEA. ¡Gracias por participar!
        </p>
        <button
          onClick={handleRestartQuiz}
          className="mt-6 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-3 px-6 rounded-xl transition"
        >
          Volver a Jugar
        </button>
      </div>
    );
  }

  const activeQuestion = questions[currentIndex];

  // Si por un delay raro de carga no hay pregunta activa, evitamos el crash
  if (!activeQuestion) return null;

  // ... AQUÍ DEBAJO SIGUE TU CÓDIGO DEL RETURN FORMATEADO (HTML/JSX) QUE YA TIENES IGUAL ...

  return (
    <div id="play-interface" className="fade-in max-w-lg mx-auto py-3 px-4">
      <div className="bg-stone-900 rounded-[48px] p-4 pt-12 pb-5 shadow-2xl border-[10px] border-stone-800 relative">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-stone-800 rounded-full flex items-center justify-center gap-1.5 z-20">
          <div className="w-10 h-1 bg-stone-700 rounded-full" />
          <div className="w-2.5 h-2.5 bg-stone-950 rounded-full" />
        </div>

        <div className="bg-[#042f1a]/95 rounded-[38px] px-4 py-5 min-h-[520px] flex flex-col justify-between overflow-hidden text-stone-900 relative">
          <div className="flex justify-between items-center text-emerald-300 text-[11px] font-mono relative z-10 px-2 mb-4">
            <span className="flex items-center gap-1 font-bold">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> CEA Móvil Live
            </span>
          </div>

          <div className="bg-white/10 border border-white/15 rounded-2xl p-3 flex justify-between items-center text-white mb-4 relative z-10">
            <div>
              <p className="text-[10px] text-emerald-200 uppercase font-mono font-black">Mi Puntaje</p>
              <p className="text-sm font-black text-white mt-0.5">{stats.correctas} de {stats.totalJugado} correctas</p>
            </div>
            <span className="text-[11px] font-mono bg-emerald-950/70 px-2 py-1 rounded border border-white/5 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> Stats
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center relative z-10">
            {loading ? (
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-2" />
                <p className="text-xs text-white font-mono">Buscando eco-preguntas...</p>
              </div>
            ) : !activeQuestion ? (
              <div className="text-center text-white p-4">
                <HelpCircle className="w-10 h-10 text-emerald-300 mx-auto mb-2" />
                <p className="text-sm font-bold">No hay preguntas de trivia disponibles.</p>
              </div>
            ) : (
              <div className="flex flex-col h-full justify-between py-2">
                <div className="bg-white/10 border border-white/10 rounded-2xl p-5 mb-5">
                  <span className="text-[9px] uppercase font-mono bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full">
                    Pregunta {currentIndex + 1} de {questions.length}
                  </span>
                  <h3 className="text-white text-base font-bold leading-snug mt-3">{activeQuestion.pregunta}</h3>
                </div>

                <div className="space-y-3">
                  <AnimatePresence mode="wait">
                    {!showFeedback ? (
                      <motion.div key="options" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                        <button
                          onClick={() => handleAnswerSelect('A')}
                          className="w-full text-left bg-white/10 hover:bg-white/20 active:scale-[0.99] transition duration-150 rounded-2xl p-4 border border-white/10 flex items-start gap-3 cursor-pointer shadow-sm text-white"
                        >
                          <span className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-300 font-display font-black text-xs flex items-center justify-center shrink-0 border border-white/10">A</span>
                          <span className="text-xs font-semibold leading-relaxed pt-0.5">{activeQuestion.opcionA}</span>
                        </button>

                        <button
                          onClick={() => handleAnswerSelect('B')}
                          className="w-full text-left bg-white/10 hover:bg-white/20 active:scale-[0.99] transition duration-150 rounded-2xl p-4 border border-white/10 flex items-start gap-3 cursor-pointer shadow-sm text-white"
                        >
                          <span className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-300 font-display font-black text-xs flex items-center justify-center shrink-0 border border-white/10">B</span>
                          <span className="text-xs font-semibold leading-relaxed pt-0.5">{activeQuestion.opcionB}</span>
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div key="feedback" initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`rounded-2xl p-4 border ${isCorrect ? 'bg-emerald-900 border-emerald-500 text-emerald-105' : 'bg-red-950 border-red-500 text-red-105'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                          <span className="font-display font-black text-xs uppercase tracking-wide text-white">{isCorrect ? '¡Correcto!' : 'Incorrecto'}</span>
                        </div>
                        <p className="text-xs mb-2 text-white">Respuesta correcta: <span className="font-bold underline">Opción {activeQuestion.correcta}</span></p>
                        {activeQuestion.explicacion && <p className="bg-[#02180d]/80 p-2.5 rounded-xl text-[10.5px] leading-relaxed mb-3 text-emerald-100">💡 {activeQuestion.explicacion}</p>}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-emerald-300 font-mono">
                            {postStatus === 'sending' && '📡 Enviando...'}
                            {postStatus === 'success' && '✓ API OK'}
                            {postStatus === 'failed' && '⚠ Local'}
                          </span>
                          <button
                            onClick={handleNextQuestion}
                            className="flex items-center gap-1.5 bg-white text-emerald-950 font-bold py-2 px-4 rounded-xl text-xs transition cursor-pointer"
                          >
                            Siguiente <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// === VISTA ADMINISTRACIÓN ===
function AdminView({
  currentConsejos,
  currentQuestions,
  onAddConsejo,
  onAddQuestion,
  onResetDatabase,
  onDeleteConsejo,
  onDeleteQuestion,
  logs,
  onClearLogs,
  onAddLog,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('consejos');

  const [consejoTexto, setConsejoTexto] = useState('');
  const [consejoCategoria, setConsejoCategoria] = useState('Agua');
  const [consejoAutor, setConsejoAutor] = useState('');

  const [questionTexto, setQuestionTexto] = useState('');
  const [questionOpcionA, setQuestionOpcionA] = useState('');
  const [questionOpcionB, setQuestionOpcionB] = useState('');
  const [questionCorrecta, setQuestionCorrecta] = useState('A');
  const [questionExplicacion, setQuestionExplicacion] = useState('');

  const handleAddConsejo = (e) => {
    e.preventDefault();
    if (!consejoTexto.trim()) return;
    
    // Llama al fetch real del componente padre
    onAddConsejo({ 
      texto: consejoTexto, 
      categoria: consejoCategoria, 
      autor: consejoAutor.trim() || 'Administrador CEA' 
    });
    
    setConsejoTexto('');
    setConsejoAutor('');
    alert('🚀 ¡Eco-Consejo enviado y guardado en la Base de Datos de Neon!');
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!questionTexto.trim() || !questionOpcionA.trim() || !questionOpcionB.trim()) {
      alert('Por favor complete todos los datos.');
      return;
    }
    
    // Llama al fetch real del componente padre
    onAddQuestion({ 
      pregunta: questionTexto, 
      opcionA: questionOpcionA, 
      opcionB: questionOpcionB, 
      correcta: questionCorrecta, 
      explicacion: questionExplicacion 
    });
    
    setQuestionTexto('');
    setQuestionOpcionA('');
    setQuestionOpcionB('');
    setQuestionExplicacion('');
    alert('🚀 ¡Pregunta de trivia enviada y guardada en Neon SQL!');
  };

  const flaskCode = `from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

CONSEJOS = [{ "id": "1", "texto": "Recuerda regar las plantas por las noches.", "categoria": "Agua" }]
TRIVIA = [{ "id": "t-1", "pregunta": "¿Porcentaje de agua dulce?", "opcionA": "2.5%", "opcionB": "45%", "correcta": "A" }]

@app.route('/api/consejo', methods=['GET'])
def get_consejo(): return jsonify(random.choice(CONSEJOS))

@app.route('/api/trivia', methods=['GET', 'POST'])
def handle_trivia():
    if request.method == 'POST': return jsonify({"status":"ok"}), 201
    return jsonify(TRIVIA)

if __name__ == '__main__': app.run(port=5000)`;

  const expressCode = `const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); app.use(express.json());

const consejos = [{ id: "1", texto: "Evita el consumo vampiro.", categoria: "Energía" }];
const trivia = [{ id: "t-1", pregunta: "¿Gas más potente?", opcionA: "Metano", opcionB: "CO2", correcta: "A" }];

app.get('/api/consejo', (req, res) => res.json(consejos[0]));
app.get('/api/trivia', (req, res) => res.json(trivia));
app.post('/api/trivia', (req, res) => res.status(201).json({ status: "ok" }));

app.listen(5000, () => console.log('Servidor en puerto 5000'));`;

  return (
    <div id="admin-interface" className="fade-in max-w-6xl mx-auto py-4 px-4 relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-6 rounded-3xl border border-white/40 shadow-md mb-8">
        <div>
          <h1 className="text-2xl font-display font-black text-emerald-950 tracking-tight">Control Panel CEA</h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => { if (confirm('¿Restablecer de fábrica?')) onResetDatabase(); }}
            className="text-emerald-950 bg-white/45 hover:bg-white/60 font-bold text-xs py-2 px-4 rounded-xl border cursor-pointer"
          >
            Valores por Defecto (Reset)
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center gap-1.5 text-white bg-red-700 hover:bg-red-800 font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="flex border-b border-white/20 mb-6 font-semibold overflow-x-auto gap-1 pb-1">
        <button onClick={() => setActiveTab('consejos')} className={`px-4 py-3 text-xs uppercase tracking-wider rounded-t-xl cursor-pointer ${activeTab==='consejos'?'bg-white/30 text-emerald-950 font-black':'text-emerald-800/80'}`}>
          Eco-Consejos ({currentConsejos.length})
        </button>
        <button onClick={() => setActiveTab('trivia')} className={`px-4 py-3 text-xs uppercase tracking-wider rounded-t-xl cursor-pointer ${activeTab==='trivia'?'bg-white/30 text-emerald-950 font-black':'text-emerald-800/80'}`}>
          Preguntas ({currentQuestions.length})
        </button>
        <button onClick={() => setActiveTab('servidores')} className={`px-4 py-3 text-xs uppercase tracking-wider rounded-t-xl cursor-pointer ${activeTab==='servidores'?'bg-white/30 text-emerald-950 font-black':'text-emerald-800/80'}`}>
          Puerto 5000
        </button>
        <button onClick={() => setActiveTab('logs')} className={`px-4 py-3 text-xs uppercase tracking-wider rounded-t-xl cursor-pointer ${activeTab==='logs'?'bg-white/30 text-emerald-950 font-black':'text-emerald-800/80'}`}>
          Consola Red ({logs.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 glass p-6 rounded-3xl border">
          {activeTab === 'consejos' && (
            <form onSubmit={handleAddConsejo} className="space-y-4">
              <h3 className="font-extrabold text-emerald-955 text-sm">Agregar Eco-Consejo</h3>
              <textarea required value={consejoTexto} onChange={e => setConsejoTexto(e.target.value)} placeholder="Ej: Usa bolsas biodegradables..." className="w-full border rounded-xl p-3 text-xs text-emerald-950 bg-white/40" />
              <div className="grid grid-cols-1 gap-2">
                <select value={consejoCategoria} onChange={e => setConsejoCategoria(e.target.value)} className="w-full border rounded-xl p-2.5 text-xs bg-white/60 text-emerald-950">
                  <option value="Agua">Agua</option>
                  <option value="Energía">Energía</option>
                  <option value="Biodiversidad">Biodiversidad</option>
                  <option value="Residuos">Residuos</option>
                  <option value="Transporte">Transporte</option>
                </select>
                <input type="text" value={consejoAutor} onChange={e => setConsejoAutor(e.target.value)} placeholder="Autor (ej: Guardaparque)" className="w-full border rounded-xl p-2.5 text-xs bg-white/40 text-emerald-950" />
              </div>
              <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs">Agregar</button>
            </form>
          )}

          {activeTab === 'trivia' && (
            <form onSubmit={handleAddQuestion} className="space-y-4 text-emerald-955">
              <h3 className="font-extrabold text-sm">Agregar Pregunta de Trivia</h3>
              <input required type="text" value={questionTexto} onChange={e => setQuestionTexto(e.target.value)} placeholder="Pregunta" className="w-full border rounded-xl p-2.5 text-xs bg-white/40 text-emerald-950" />
              <input required type="text" value={questionOpcionA} onChange={e => setQuestionOpcionA(e.target.value)} placeholder="Opción A" className="w-full border rounded-xl p-2.5 text-xs bg-white/40 text-emerald-950" />
              <input required type="text" value={questionOpcionB} onChange={e => setQuestionOpcionB(e.target.value)} placeholder="Opción B" className="w-full border rounded-xl p-2.5 text-xs bg-white/40 text-emerald-950" />
              <select value={questionCorrecta} onChange={e => setQuestionCorrecta(e.target.value)} className="w-full border rounded-xl p-2.5 text-xs bg-white/60 text-emerald-950">
                <option value="A">Opción A es correcta</option>
                <option value="B">Opción B es correcta</option>
              </select>
              <textarea value={questionExplicacion} onChange={e => setQuestionExplicacion(e.target.value)} placeholder="Explicación Educativa" className="w-full border rounded-xl p-2.5 text-xs bg-white/40 text-emerald-950" />
              <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs">Agregar Pregunta</button>
            </form>
          )}

          {activeTab === 'logs' && (
            <div className="text-emerald-955 text-xs space-y-3">
              <h4 className="font-bold text-emerald-900">Historial de Red</h4>
              <button onClick={onClearLogs} className="text-emerald-950 bg-emerald-900/10 hover:bg-emerald-900/20 px-3 py-2 rounded-xl text-xs font-bold w-full transition cursor-pointer">Vaciar Consola</button>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 glass p-6 rounded-3xl border overflow-hidden">
          {activeTab === 'consejos' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b bg-white/20 text-emerald-950 uppercase text-[10px] font-bold">
                    <th className="py-2.5 px-3">Cat</th>
                    <th className="py-2.5 px-3">Mensaje</th>
                    <th className="py-2.5 px-3 text-center">Eliminar</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-emerald-950">
                  {currentConsejos.map(consejo => (
                    <tr key={consejo.id} className="hover:bg-white/10">
                      <td className="py-3 px-3"><span className="bg-emerald-900 text-white px-2 py-0.5 rounded font-bold">{consejo.categoria}</span></td>
                      <td className="py-3 px-3 italic font-semibold">{consejo.texto}</td>
                      <td className="py-3 px-3 text-center">
                        <button onClick={() => { onDeleteConsejo(consejo.id); onAddLog('Consejo Borrado', consejo.id, true); }} className="text-red-600 hover:bg-red-50 p-1.5 rounded"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'trivia' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b bg-white/20 text-emerald-950 uppercase text-[10px] font-bold">
                    <th className="py-2.5 px-3">Pregunta</th>
                    <th className="py-2.5 px-3">Correcta</th>
                    <th className="py-2.5 px-3 text-center">Eliminar</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-emerald-950">
                  {currentQuestions.map(q => (
                    <tr key={q.id} className="hover:bg-white/10">
                      <td className="py-3 px-3 font-semibold">{q.pregunta}</td>
                      <td className="py-3 px-3 text-center"><span className="bg-emerald-800 text-white px-1.5 py-0.5 rounded text-[10px]">{q.correcta}</span></td>
                      <td className="py-3 px-3 text-center">
                        <button onClick={() => { onDeleteQuestion(q.id); onAddLog('Pregunta Borrada', q.id, true); }} className="text-red-650 hover:bg-red-50 p-1.5 rounded"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'servidores' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-mono text-xs text-emerald-950 font-bold bg-white/50 p-2 rounded">Opción Python (Flask)</h4>
                <pre className="bg-[#02180d]/90 text-emerald-100 p-3 rounded-lg text-[10px] font-mono mt-1 overflow-auto max-h-40">{flaskCode}</pre>
              </div>
              <div>
                <h4 className="font-mono text-xs text-emerald-950 font-bold bg-white/50 p-2 rounded">Opción Node (Express)</h4>
                <pre className="bg-[#02180d]/90 text-indigo-100 p-3 rounded-lg text-[10px] font-mono mt-1 overflow-auto max-h-40">{expressCode}</pre>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-emerald-950 text-xs">No hay actividad de red registrada.</div>
              ) : (
                [...logs].reverse().map(log => (
                  <div key={log.id} className={`p-2.5 rounded-xl border flex items-center justify-between text-xs min-h-[46px] ${log.success ? 'bg-emerald-100/50':'bg-amber-100/50'}`}>
                    <div>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] text-white mr-2 ${log.success?'bg-emerald-700':'bg-amber-600'}`}>
                        {log.success ? 'OK' : 'ERROR'}
                      </span>
                      <strong className="font-mono">{log.action}: </strong><span className="italic">{log.detail}</span>
                    </div>
                    <span className="text-[10px] text-emerald-800 shrink-0 font-mono ml-2">{log.time}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// === COMPONENTE PRINCIPAL ORQUESTADOR ===
export default function App() {
  const [activeView, setActiveView] = useState('totem');
  
  // 1. MODIFICADO: Estados empiezan vacíos porque ahora mandan los datos de Neon SQL
  const [consejos, setConsejos] = useState([]);
  const [questions, setQuestions] = useState([]);

  // Estadísticas del jugador
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('cea_stats');
    return saved ? JSON.parse(saved) : { correctas: 0, totalJugado: 0 };
  });

  const handleResetPlayerStats = () => {
    setStats({ correctas: 0, totalJugado: 0 });
  };

  // Consola de red
  const [logs, setLogs] = useState([]);

  // Proteccion de Admin
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');

  // Alerta de credenciales incorrectas en Ventana Emergente
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');

  // 2. NUEVO/MODIFICADO: Efecto inicial para jalar TODO (Preguntas y Consejos) desde tu Flask
  useEffect(() => {
    // Cargar preguntas de la BD
    fetch('https://proyecto-cea.onrender.com/api/trivia')
      .then(res => res.json())
      .then(data => {
        const fetched = Array.isArray(data) ? data : [data];
        if (fetched.length > 0) setQuestions(fetched);
      })
      .catch(err => {
        console.error("Error cargando trivia de Flask:", err);
        const saved = localStorage.getItem('cea_questions');
        setQuestions(saved ? JSON.parse(saved) : INITIAL_PREGUNTAS);
      });

    // Cargar consejos de la BD (Hacemos un GET global a tu ruta)
    fetch('https://proyecto-cea.onrender.com/api/consejo')
      .then(res => res.json())
      .then(data => {
        // Como tu backend actual devuelve uno random, lo metemos en un arreglo para el panel admin.
        // Tip de pro: Si en el futuro quieres listar todos, haz una ruta /api/consejos en Flask.
        if (data && data.id) {
          setConsejos([data]);
        }
      })
      .catch(err => {
        console.error("Error cargando consejos de Flask:", err);
        const saved = localStorage.getItem('cea_consejos');
        setConsejos(saved ? JSON.parse(saved) : INITIAL_CONSEJOS);
      });
  }, []);

  // Persistir estadísticas locales
  useEffect(() => {
    localStorage.setItem('cea_stats', JSON.stringify(stats));
  }, [stats]);

  // Manejador del parámetro de URL rápido "?view=play"
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam === 'play' || viewParam === 'play-view') {
      setActiveView('play');
    }
  }, []);

  const addLog = (action, detail, success) => {
    const newLog = {
      id: Math.random().toString(36).substring(2, 9),
      action,
      detail,
      success,
      time: new Date().toLocaleTimeString()
    };
    setLogs(prev => [...prev.slice(-39), newLog]);
  };

  const handleUpdateStats = (isCorrect) => {
    setStats(prev => ({
      correctas: prev.correctas + (isCorrect ? 1 : 0),
      totalJugado: prev.totalJugado + 1
    }));
  };

  // 3. MODIFICADO: POST real para Consejos
  const handleAddConsejo = (newConsejo) => {
    fetch('https://proyecto-cea.onrender.com/api/consejo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        texto: newConsejo.texto,
        categoria: newConsejo.categoria,
        autor: newConsejo.autor
      })
    })
    .then(res => {
      if (!res.ok) throw new Error("Error en servidor");
      return res.json();
    })
    .then(data => {
      const cReal = { 
        id: `consejo-${data.id}`, 
        texto: newConsejo.texto,
        categoria: newConsejo.categoria,
        autor: newConsejo.autor
      };
      setConsejos(prev => [cReal, ...prev]);
    })
    .catch(err => console.error(err));
  };

  // 4. MODIFICADO: POST real para Preguntas
  const handleAddQuestion = (newQ) => {
    fetch('https://proyecto-cea.onrender.com/api/trivia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pregunta: newQ.pregunta,
        opcion_a: newQ.opcionA,
        opcion_b: newQ.opcionB,
        correcta: newQ.correcta.toUpperCase(),
        explicacion: newQ.explicacion
      })
    })
    .then(res => {
      if (!res.ok) throw new Error("Error en servidor");
      return res.json();
    })
    .then(data => {
      const qReal = {
        id: `trivia-${data.id}`,
        pregunta: newQ.pregunta,
        opcionA: newQ.opcionA,
        opcionB: newQ.opcionB,
        correcta: newQ.correcta.toUpperCase(),
        explicacion: newQ.explicacion || "¡Excelente contribución a la ecología!"
      };
      setQuestions(prev => [...prev, qReal]);
    })
    .catch(err => console.error(err));
  };

  // 5. ENLACE DE BORRADO DE TRIVIA CON EL BACKEND 
  const handleDeleteQuestion = (idCompleto) => {
    const idLimpio = String(idCompleto).replace('trivia-', '');
    
    fetch(`https://proyecto-cea.onrender.com/api/trivia/${idLimpio}`, {
      method: 'DELETE'
    })
    .then(res => {
      if (!res.ok) throw new Error("No se pudo borrar en la BD");
      setQuestions(prev => prev.filter(item => item.id !== idCompleto));
    })
    .catch(err => console.error("Error al borrar pregunta de Neon:", err));
  };

  // 6. ENLACE DE BORRADO DE CONSEJOS CON EL BACKEND
  const handleDeleteConsejo = (idCompleto) => {
    const idLimpio = String(idCompleto).replace('consejo-', '');

    fetch(`https://proyecto-cea.onrender.com/api/consejo/${idLimpio}`, {
      method: 'DELETE'
    })
    .then(res => {
      if (!res.ok) throw new Error("No se pudo borrar en la BD");
      setConsejos(prev => prev.filter(item => item.id !== idCompleto));
    })
    .catch(err => console.error("Error al borrar consejo de Neon:", err));
  };

  const handleResetDatabase = () => {
    setConsejos([]);
    setQuestions([]);
    setStats({ correctas: 0, totalJugado: 0 });
    localStorage.removeItem('cea_play_index');
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUser === 'admin' && adminPass === 'cea2026') {
      setIsAdminAuthenticated(true);
      addLog('Login Admin', 'Autenticación exitosa del administrador', true);
    } else {
      setErrorModalMessage('Las credenciales ingresadas son incorrectas. Por favor, verifica el usuario o contraseña del Centro de Educación Ambiental para gestionar los contenidos ecológicos.');
      setShowErrorModal(true);
      addLog('Login Admin Fallido', 'Intento fallido con credenciales erróneas', false);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminUser('');
    setAdminPass('');
    addLog('Logout Admin', 'Administrador cerró sesión con éxito', true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between select-none">
      
      {/* HEADER PRINCIPAL */}
      <header className="glass shadow-sm py-4 px-6 border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('totem')}>
            <span className="p-2 bg-emerald-700 text-white rounded-xl shadow-xs">
              <Leaf className="w-5 h-5" />
            </span>
            <div>
              <span className="font-display font-black text-emerald-950 tracking-tight block">CEA Centro Ecológico</span>
            </div>
          </div>

          <nav className="flex items-center bg-white/25 border border-white/40 p-1.5 rounded-2xl gap-1">
            <button
              id="nav-totem-btn"
              onClick={() => setActiveView('totem')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-250 flex items-center gap-1.5 cursor-pointer shadow-sm select-none ${activeView === 'totem' ? 'bg-emerald-600 text-white scale-[1.02]' : 'text-emerald-950 hover:bg-emerald-50 hover:text-emerald-900 bg-transparent'}`}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Monitor Tótem
            </button>
            <button
              id="nav-play-btn"
              onClick={() => setActiveView('play')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-250 flex items-center gap-1.5 cursor-pointer shadow-sm select-none ${activeView === 'play' ? 'bg-emerald-600 text-white scale-[1.02]' : 'text-emerald-950 hover:bg-emerald-50 hover:text-emerald-900 bg-transparent'}`}
            >
              <QrCode className="w-3.5 h-3.5" /> Trivia Celular
            </button>
            <button
              id="nav-admin-btn"
              onClick={() => setActiveView('admin')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-250 flex items-center gap-1.5 cursor-pointer shadow-sm select-none ${activeView === 'admin' ? 'bg-emerald-600 text-white scale-[1.02]' : 'text-emerald-950 hover:bg-emerald-50 hover:text-emerald-900 bg-transparent'}`}
            >
              <Settings className="w-3.5 h-3.5" /> Guardabosques
            </button>
          </nav>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 py-6 relative">
        <AnimatePresence mode="wait">
          {activeView === 'totem' && (
            <motion.div key="totem-v animate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TotemView currentConsejos={consejos} onNavigateToPlay={() => setActiveView('play')} onAddLog={addLog} />
            </motion.div>
          )}

          {activeView === 'play' && (
            <motion.div key="play-v animate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PlayView currentQuestions={questions} stats={stats} onUpdateStats={handleUpdateStats} onResetPlayerStats={handleResetPlayerStats} onAddLog={addLog} />
            </motion.div>
          )}

          {activeView === 'admin' && (
            <motion.div key="admin-v animate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {!isAdminAuthenticated ? (
                <div className="max-w-md mx-auto my-12 glass p-8 rounded-3xl border border-white/45 shadow-xl text-emerald-955">
                  <div className="text-center mb-6">
                    <span className="p-3 bg-emerald-700 text-white rounded-2xl shadow-md inline-block mb-3">
                      <Settings className="w-6 h-6" />
                    </span>
                    <h2 className="text-2xl font-display font-black">Acceso Guardabosques</h2>
                    <p className="text-xs text-emerald-800 mt-1">Ingresa las credenciales del Centro de Educación Ambiental para gestionar contenidos.</p>
                  </div>

                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-black mb-1 text-emerald-900">Usuario</label>
                      <input 
                        required 
                        type="text" 
                        value={adminUser} 
                        onChange={e => setAdminUser(e.target.value)} 
                        placeholder="admin" 
                        className="w-full border rounded-xl p-3 text-xs bg-white/40 focus:outline-hidden text-emerald-950" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-black mb-1 text-emerald-900">Contraseña</label>
                      <input 
                        required 
                        type="password" 
                        value={adminPass} 
                        onChange={e => setAdminPass(e.target.value)} 
                        placeholder="••••••••" 
                        className="w-full border rounded-xl p-3 text-xs bg-white/40 focus:outline-hidden text-emerald-950" 
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer mt-2"
                    >
                      Verificar Identidad
                    </button>
                  </form>
                </div>
              ) : (
                <AdminView 
                  currentConsejos={consejos} 
                  currentQuestions={questions} 
                  onAddConsejo={handleAddConsejo}
                  onAddQuestion={handleAddQuestion}
                  onResetDatabase={handleResetDatabase}
                  onDeleteConsejo={handleDeleteConsejo}
                  onDeleteQuestion={handleDeleteQuestion}
                  logs={logs}
                  onClearLogs={() => setLogs([])}
                  onAddLog={addLog}
                  onLogout={handleAdminLogout}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER DEL CEA */}
      <footer className="glass py-4 text-center text-[11px] text-emerald-950 font-semibold border-t border-white/20">
        <p>© 2026 Centro de Educación Ambiental (CEA).</p>
      </footer>

      {/* VENTANA EMERGENTE PERSONALIZADA: ERROR DE CREDENCIALES */}
      <AnimatePresence>
        {showErrorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowErrorModal(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-white border border-red-200/50 rounded-3xl p-6 shadow-2xl max-w-sm w-full mx-auto text-center overflow-hidden z-10"
            >
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-sm">
                <XCircle className="w-7 h-7" />
              </div>
              
              <h3 className="text-base font-display font-black text-stone-900 tracking-tight">Acceso Denegado</h3>
              
              <p className="text-xs text-stone-600 mt-2.5 leading-relaxed px-1">
                {errorModalMessage || "Las credenciales ingresadas son incorrectas. Por favor, verifica tu contraseña e inténtalo de nuevo."}
              </p>
              
              <div className="mt-5">
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="w-full bg-red-700 hover:bg-red-800 text-white text-xs font-bold py-3 px-4 rounded-xl transition duration-150 cursor-pointer shadow-md select-none"
                >
                  Intentar de nuevo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
