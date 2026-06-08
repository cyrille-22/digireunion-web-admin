import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestOTP, verifyOTP } from '../../api/auth';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [step, setStep]       = useState(1);
  const [telephone, setTel]   = useState('');
  const [code, setCode]       = useState('');
  const [loading, setLoading] = useState(false);
  const { login }             = useAuthStore();
  const navigate              = useNavigate();
  const [otpVisible, setOtpVisible] = useState(null);

 const handleRequestOTP = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await requestOTP(telephone);
    // Afficher le code OTP directement si renvoyé
    if (res.data.code_otp) {
      setOtpVisible(res.data.code_otp);
    }
    toast.success('Code OTP généré !');
    setStep(2);
  } catch (err) {
    toast.error(err.response?.data?.message || 'Erreur');
  } finally {
    setLoading(false);
  }
};

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verifyOTP(telephone, code);
      login(res.data.token, res.data.membre);
      toast.success(`Bienvenue ${res.data.membre.nom} !`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Code incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex">

      {/* Image de fond */}
      <div className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1920&q=80')`,
          backgroundSize:    'cover',
          backgroundPosition:'center',
          filter: 'brightness(0.2) saturate(0.7)',
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, rgba(15,17,23,0.97) 0%, rgba(27,79,114,0.90) 100%)'
        }}
      />

      {/* Panneau gauche — Branding */}
      <div className="relative z-10 hidden lg:flex flex-col
        justify-between w-1/2 p-12">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl
            flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <div>
            <p className="text-white font-bold text-xl leading-none">
              Digi-Réunion
            </p>
            <p className="text-blue-400 text-xs font-mono">
              Gestion financière
            </p>
          </div>
        </div>

        {/* Citation centrale */}
        <div>
          <div className="w-12 h-1 bg-blue-500 rounded mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4
            leading-tight">
            La transparence financière
            <br />
            <span className="text-blue-400">
              au service de votre association
            </span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed
            max-w-md">
            Gérez vos tontines, cotisations, prêts et séances
            en toute sécurité. Chaque centime tracé, chaque
            décision documentée.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3">
          {[
            { icon: '✅', text: 'Journal immuable et auditable' },
            { icon: '📄', text: 'PV de séance généré automatiquement' },
            { icon: '🔐', text: 'Connexion sécurisée par OTP' },
            { icon: '📊', text: 'Tableaux de bord en temps réel' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-lg">{f.icon}</span>
              <span className="text-gray-300 text-sm">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Panneau droit — Formulaire */}
      <div className="relative z-10 flex-1 flex items-center
        justify-center p-8">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-blue-600 rounded-xl
              flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <p className="text-white font-bold text-xl">
              Digi-Réunion
            </p>
          </div>

          {/* Card formulaire */}
          <div className="bg-white/5 backdrop-blur-xl border
            border-white/10 rounded-3xl p-8 shadow-2xl">

            {step === 1 ? (
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white mb-1">
                    Connexion
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Entrez votre numéro pour recevoir un code OTP
                  </p>
                </div>

                <form onSubmit={handleRequestOTP}>
                  <div className="mb-5">
                    <label className="block text-sm text-gray-400
                      mb-2">Numéro de téléphone</label>
                    <input
                      type="tel"
                      value={telephone}
                      onChange={e => setTel(e.target.value)}
                      placeholder="+237 6XX XXX XXX"
                      className="w-full bg-white/5 border
                        border-white/10 rounded-2xl px-4 py-4
                        text-white placeholder-gray-600 text-lg
                        focus:outline-none focus:border-blue-500
                        focus:bg-white/10 transition"
                      required
                    />
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-4 rounded-2xl font-bold
                      text-white text-base transition-all
                      duration-300 hover:scale-[1.02]
                      disabled:opacity-50 disabled:scale-100"
                    style={{
                      background: loading
                        ? '#374151'
                        : 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                      boxShadow: loading
                        ? 'none'
                        : '0 0 20px rgba(59,130,246,0.3)'
                    }}>
                    {loading
                      ? '⏳ Envoi en cours...'
                      : '📱 Recevoir le code OTP'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <button
                    onClick={() => { setStep(1); setCode(''); }}
                    className="text-gray-500 hover:text-white
                      text-sm mb-4 flex items-center gap-1
                      transition">
                    ← Retour
                  </button>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    Vérification
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Code envoyé au{' '}
                    <span className="text-white font-medium">
                      {telephone}
                    </span>
                  </p>
                </div>
                {/* Affichage temporaire du code OTP */}
                {otpVisible && (
                  <div className="bg-amber-900/20 border border-amber-800/30
                    rounded-2xl p-4 mb-4 text-center">
                    <p className="text-xs text-amber-400 mb-1">
                      🔐 Code OTP (mode test)
                    </p>
                    <p className="text-4xl font-mono font-bold text-white
                      tracking-widest">
                      {otpVisible}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Copiez ce code ci-dessous
                    </p>
                  </div>
                )}
                <form onSubmit={handleVerifyOTP}>
                  <div className="mb-5">
                    <label className="block text-sm text-gray-400
                      mb-2">Code OTP à 6 chiffres</label>
                    <input
                      type="text"
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      placeholder="• • • • • •"
                      maxLength={6}
                      className="w-full bg-white/5 border
                        border-white/10 rounded-2xl px-4 py-4
                        text-white placeholder-gray-600 text-3xl
                        tracking-[0.5em] text-center font-mono
                        focus:outline-none focus:border-blue-500
                        focus:bg-white/10 transition"
                      required
                    />
                    <p className="text-xs text-gray-500 text-center
                      mt-2">
                      Consultez le terminal du serveur pour le code
                    </p>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-4 rounded-2xl font-bold
                      text-white text-base transition-all
                      duration-300 hover:scale-[1.02]
                      disabled:opacity-50"
                    style={{
                      background: loading
                        ? '#374151'
                        : 'linear-gradient(135deg, #10B981, #059669)',
                      boxShadow: loading
                        ? 'none'
                        : '0 0 20px rgba(16,185,129,0.3)'
                    }}>
                    {loading ? '⏳ Vérification...' : '✅ Se connecter'}
                  </button>
                </form>
              </>
            )}

            {/* Footer card */}
            <p className="text-center text-gray-600 text-xs mt-6">
              Digi-Réunion · Gestion financière sécurisée
            </p>
          </div>

          {/* Retour accueil */}
          <p className="text-center text-gray-500 text-xs mt-4">
            <button onClick={() => navigate('/welcome')}
              className="hover:text-gray-300 transition">
              ← Retour à l'accueil
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}