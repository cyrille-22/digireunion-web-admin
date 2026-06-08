import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';

const getMonProfil = () =>
  api.get('/members/me').then(r => r.data);
const getMesFinances = () =>
  api.get('/members/me/finances').then(r => r.data);

export default function MonEspace() {
  const { membre } = useAuthStore();

  const { data: finances } = useQuery({
    queryKey: ['mes-finances'],
    queryFn: getMesFinances
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">
          Bonjour {membre?.nom?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long', year: 'numeric',
            month: 'long', day: 'numeric'
          })}
        </p>
      </div>

      {/* Carte GAV */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800
        rounded-2xl p-5 mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32
          bg-white/10 rounded-full -translate-y-1/2
          translate-x-1/2" />
        <p className="text-blue-200 text-xs font-mono
          uppercase tracking-wider mb-1">
          Garde à Vue (GAV)
        </p>
        <p className="text-3xl font-bold text-white font-mono mb-1">
          {parseFloat(finances?.gav_solde || 0)
            .toLocaleString('fr-FR')} F
        </p>
        <p className="text-blue-200 text-xs">
          Épargne liquide disponible
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#161b27] border border-[#2e3a50]
          rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">
            Score fiabilité
          </p>
          <p className={`text-2xl font-bold font-mono ${
            (finances?.score_fiabilite || 0) >= 80
              ? 'text-green-400'
              : (finances?.score_fiabilite || 0) >= 60
                ? 'text-amber-400'
                : 'text-red-400'}`}>
            {finances?.score_fiabilite || 100}
            <span className="text-sm text-gray-500">/100</span>
          </p>
        </div>
        <div className="bg-[#161b27] border border-[#2e3a50]
          rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">
            Prêts en cours
          </p>
          <p className="text-2xl font-bold text-amber-400 font-mono">
            {finances?.nb_prets_en_cours || 0}
          </p>
        </div>
      </div>

      {/* Épargnes */}
      {finances?.epargnes?.length > 0 && (
        <div className="bg-[#161b27] border border-[#2e3a50]
          rounded-xl p-4 mb-4">
          <p className="text-xs text-gray-500 font-mono uppercase
            tracking-wider mb-3">
            Mes épargnes
          </p>
          {finances.epargnes.map((e, i) => (
            <div key={i}
              className="flex justify-between items-center
                py-2 border-b border-[#2e3a50] last:border-0">
              <div>
                <p className="text-white text-sm">{e.rubrique_nom}</p>
                {e.montant_minimum > 0 && (
                  <p className="text-xs text-gray-500">
                    Objectif : {parseFloat(e.montant_minimum)
                      .toLocaleString('fr-FR')} F
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-green-400 font-mono font-bold">
                  {parseFloat(e.solde).toLocaleString('fr-FR')} F
                </p>
                {e.montant_minimum > 0 && (
                  <p className={`text-xs ${
                    parseFloat(e.solde) >= parseFloat(e.montant_minimum)
                      ? 'text-green-400' : 'text-amber-400'}`}>
                    {parseFloat(e.solde) >= parseFloat(e.montant_minimum)
                      ? '✅ Objectif atteint'
                      : `Reste : ${(parseFloat(e.montant_minimum) -
                          parseFloat(e.solde))
                          .toLocaleString('fr-FR')} F`}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prêts en cours */}
      {finances?.prets?.length > 0 && (
        <div className="bg-[#161b27] border border-[#2e3a50]
          rounded-xl p-4">
          <p className="text-xs text-gray-500 font-mono uppercase
            tracking-wider mb-3">
            Mes prêts en cours
          </p>
          {finances.prets.map((p, i) => (
            <div key={i}
              className="py-2 border-b border-[#2e3a50] last:border-0">
              <div className="flex justify-between mb-1">
                <p className="text-white text-sm">{p.rubrique_nom}</p>
                <p className="text-red-400 font-mono text-sm font-bold">
                  {parseFloat(p.reste_a_regler)
                    .toLocaleString('fr-FR')} F
                </p>
              </div>
              {/* Barre de progression remboursement */}
              <div className="h-1.5 bg-[#1e2535] rounded-full
                overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      (parseFloat(p.montant_rembourse) /
                      parseFloat(p.montant_total_du)) * 100, 100
                    )}%`
                  }} />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Remboursé : {parseFloat(p.montant_rembourse)
                  .toLocaleString('fr-FR')} F /
                {parseFloat(p.montant_total_du)
                  .toLocaleString('fr-FR')} F
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}