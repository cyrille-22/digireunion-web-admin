import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

export default function Welcome() {
  const navigate   = useNavigate();
  const { token }  = useAuthStore();

  // Si déjà connecté → dashboard
  useEffect(() => {
    if (token) navigate('/');
  }, [token]);

  return (
    <div className="min-h-screen relative overflow-hidden
      flex flex-col">

      {/* Image de fond */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80')`,
          backgroundSize:    'cover',
          backgroundPosition:'center',
          backgroundRepeat:  'no-repeat',
          filter: 'brightness(0.25) saturate(0.8)',
        }}
      />

      {/* Overlay dégradé */}
      <div className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, rgba(15,17,23,0.95) 0%, rgba(27,79,114,0.85) 50%, rgba(15,17,23,0.95) 100%)'
        }}
      />

      {/* Contenu */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Header */}
        <div className="flex items-center justify-between
          px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl
              flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg
                leading-none">Digi-Réunion</p>
              <p className="text-blue-400 text-xs font-mono
                tracking-wider">v1.0</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-gray-400 hover:text-white text-sm
              transition border border-[#2e3a50] px-4 py-2
              rounded-xl hover:border-blue-500">
            Se connecter
          </button>
        </div>

        {/* Hero */}
        <div className="flex-1 flex flex-col items-center
          justify-center px-8 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2
            bg-blue-900/30 border border-blue-800/50 rounded-full
            px-4 py-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-green-400
              animate-pulse"/>
            <span className="text-blue-300 text-xs font-mono
              tracking-wider uppercase">
              Plateforme SaaS · Multi-associations
            </span>
          </div>

          {/* Titre principal */}
          <h1 className="text-5xl font-bold text-white mb-4
            leading-tight max-w-3xl">
            Gérez vos{' '}
            <span className="text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(135deg, #3B82F6, #10B981)'
              }}>
              tontines & réunions
            </span>
            {' '}avec précision
          </h1>

          {/* Sous-titre */}
          <p className="text-gray-300 text-lg mb-10 max-w-2xl
            leading-relaxed">
            Digi-Réunion digitalise la gestion financière de votre
            association. Transparence totale, zéro erreur,
            accessibilité en temps réel.
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-10 max-w-2xl
            w-full">
            {[
              { icon: '🔒', label: 'Sécurisé',
                desc: 'Journal immuable' },
              { icon: '📊', label: 'Transparent',
                desc: 'Traçabilité totale' },
              { icon: '📱', label: 'Accessible',
                desc: 'Sur tous vos appareils' },
            ].map((f, i) => (
              <div key={i}
                className="bg-white/5 backdrop-blur-sm border
                  border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">{f.icon}</div>
                <p className="text-white font-semibold text-sm">
                  {f.label}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bouton CTA */}
          <button
            onClick={() => navigate('/login')}
            className="group relative px-10 py-4 rounded-2xl
              font-bold text-white text-lg transition-all
              duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              boxShadow: '0 0 30px rgba(59,130,246,0.4)'
            }}>
            <span className="relative z-10 flex items-center gap-3">
              Commencer maintenant
              <span className="text-xl
                group-hover:translate-x-1 transition-transform">
                →
              </span>
            </span>
          </button>

          <p className="text-gray-500 text-xs mt-4">
            Déjà membre ?{' '}
            <button onClick={() => navigate('/login')}
              className="text-blue-400 hover:text-blue-300
                transition">
              Connectez-vous
            </button>
          </p>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 border-t border-white/10
          bg-black/20 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-8 py-5">
            <div className="grid grid-cols-4 gap-8 text-center">
              {[
                { value: '100%', label: 'Configurable' },
                { value: 'Multi', label: 'Associations' },
                { value: 'PDF',   label: 'PV Automatique' },
                { value: '24/7',  label: 'Disponible' },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-2xl font-bold text-white">
                    {s.value}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}