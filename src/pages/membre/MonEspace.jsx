import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import { TrendingUp, CreditCard, PiggyBank, Calendar } from 'lucide-react';

const getMesFinances = () =>
  api.get('/members/me/finances').then(r => r.data);

const getMesCotisations = () =>
  api.get('/members/me/cotisations').then(r => r.data);

export default function MonEspace() {
  const { membre } = useAuthStore();

  const { data: finances, isLoading } = useQuery({
    queryKey: ['mes-finances'],
    queryFn: getMesFinances
  });

  const { data: cotisationsData } = useQuery({
    queryKey: ['mes-cotisations'],
    queryFn: getMesCotisations
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">
          Bonjour {membre?.nom?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long', year: 'numeric',
            month: 'long', day: 'numeric'
          })}
        </p>
      </div>

      {/* Carte GAV */}
      <div className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1B4F72, #2E86C1)'
        }}>
        <div className="absolute top-0 right-0 w-24 h-24
          bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-16 h-16
          bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <p className="text-blue-200 text-xs font-mono
          uppercase tracking-wider mb-1">
          Garde à Vue (GAV)
        </p>
        <p className="text-3xl font-bold text-white font-mono">
          {parseFloat(finances?.gav_solde || 0)
            .toLocaleString('fr-FR')} F
        </p>
        <p className="text-blue-200 text-xs mt-1">
          Épargne liquide · Retrait disponible
        </p>
      </div>

      {/* Score fiabilité */}
      <div className="bg-[#161b27] border border-[#2e3a50]
        rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-400" />
            <p className="text-sm font-medium text-white">
              Score de fiabilité
            </p>
          </div>
          <p className={`text-xl font-bold font-mono ${
            (finances?.score_fiabilite || 0) >= 80
              ? 'text-green-400'
              : (finances?.score_fiabilite || 0) >= 60
                ? 'text-amber-400'
                : 'text-red-400'}`}>
            {finances?.score_fiabilite || 100}/100
          </p>
        </div>
        <div className="h-2 bg-[#1e2535] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              (finances?.score_fiabilite || 0) >= 80
                ? 'bg-green-500'
                : (finances?.score_fiabilite || 0) >= 60
                  ? 'bg-amber-500'
                  : 'bg-red-500'}`}
            style={{ width: `${finances?.score_fiabilite || 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {(finances?.score_fiabilite || 0) >= 80
            ? '✅ Excellent — Membre très fiable'
            : (finances?.score_fiabilite || 0) >= 60
              ? '⚠️ Bon — Quelques retards'
              : '❌ À améliorer — Retards fréquents'}
        </p>
      </div>

      {/* Épargnes */}
      {finances?.epargnes?.length > 0 && (
        <div className="bg-[#161b27] border border-[#2e3a50]
          rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3
            border-b border-[#2e3a50]">
            <PiggyBank size={16} className="text-green-400" />
            <p className="text-sm font-semibold text-white">
              Mes épargnes
            </p>
          </div>
          {finances.epargnes.map((e, i) => {
            const progression = e.montant_minimum > 0
              ? Math.min(
                  (parseFloat(e.solde) /
                   parseFloat(e.montant_minimum)) * 100, 100
                )
              : 100;

            return (
              <div key={i}
                className="px-4 py-3 border-b border-[#2e3a50]
                  last:border-0">
                <div className="flex justify-between
                  items-start mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium
                      truncate">
                      {e.rubrique_nom}
                    </p>
                    <p className="text-xs text-gray-500">
                      {e.est_obligatoire
                        ? '🔴 Obligatoire'
                        : '🟢 Facultative'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-green-400 font-mono
                      font-bold text-sm">
                      {parseFloat(e.solde)
                        .toLocaleString('fr-FR')} F
                    </p>
                    {e.montant_minimum > 0 && (
                      <p className="text-xs text-gray-500">
                        / {parseFloat(e.montant_minimum)
                          .toLocaleString('fr-FR')} F
                      </p>
                    )}
                  </div>
                </div>
                {e.montant_minimum > 0 && (
                  <>
                    <div className="h-1.5 bg-[#1e2535]
                      rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full
                          transition-all ${
                          progression >= 100
                            ? 'bg-green-500'
                            : 'bg-blue-500'}`}
                        style={{ width: `${progression}%` }}
                      />
                    </div>
                    <p className={`text-xs mt-1 ${
                      progression >= 100
                        ? 'text-green-400'
                        : 'text-amber-400'}`}>
                      {progression >= 100
                        ? '✅ Objectif atteint — Membre actif'
                        : `Reste : ${(parseFloat(e.montant_minimum) -
                            parseFloat(e.solde))
                            .toLocaleString('fr-FR')} F`}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Cotisations par tontine */}
      {cotisationsData?.tontines?.length > 0 && (
        <div className="bg-[#161b27] border border-[#2e3a50]
          rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3
            border-b border-[#2e3a50]">
            <Calendar size={16} className="text-amber-400" />
            <p className="text-sm font-semibold text-white">
              Mes cotisations tontines
            </p>
          </div>
          {cotisationsData.tontines.map((t, i) => (
            <div key={i}
              className="px-4 py-3 border-b border-[#2e3a50]
                last:border-0">
              <div className="flex justify-between
                items-start mb-1">
                <p className="text-white text-sm font-medium">
                  {t.tontine_nom}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded
                  font-mono flex-shrink-0 ml-2 ${
                  t.statut_membre === 'actif'
                    ? 'bg-green-900/40 text-green-400'
                    : 'bg-red-900/40 text-red-400'}`}>
                  {t.nb_parts} part(s)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="bg-[#1e2535] rounded-lg p-2
                  text-center">
                  <p className="text-xs text-gray-500">
                    Cotisé
                  </p>
                  <p className="text-green-400 font-mono
                    text-sm font-bold">
                    {t.nb_seances_cotisees}
                  </p>
                </div>
                <div className="bg-[#1e2535] rounded-lg p-2
                  text-center">
                  <p className="text-xs text-gray-500">
                    Manqué
                  </p>
                  <p className="text-red-400 font-mono
                    text-sm font-bold">
                    {t.nb_seances_manquees}
                  </p>
                </div>
                <div className="bg-[#1e2535] rounded-lg p-2
                  text-center">
                  <p className="text-xs text-gray-500">
                    Total versé
                  </p>
                  <p className="text-white font-mono text-xs
                    font-bold">
                    {parseFloat(t.total_cotise)
                      .toLocaleString('fr-FR')} F
                  </p>
                </div>
              </div>
              {/* Progression cycle */}
              <div className="mt-2">
                <div className="flex justify-between
                  text-xs text-gray-500 mb-1">
                  <span>Progression cycle</span>
                  <span>
                    {t.seance_courante}/{t.nb_seances_cycle}
                  </span>
                </div>
                <div className="h-1.5 bg-[#1e2535] rounded-full
                  overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        (t.seance_courante /
                         t.nb_seances_cycle) * 100, 100
                      )}%`
                    }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prêts en cours */}
      {finances?.prets?.length > 0 && (
        <div className="bg-[#161b27] border border-[#2e3a50]
          rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3
            border-b border-[#2e3a50]">
            <CreditCard size={16} className="text-red-400" />
            <p className="text-sm font-semibold text-white">
              Mes prêts en cours
            </p>
          </div>
          {finances.prets.map((p, i) => {
            const progression = Math.min(
              (parseFloat(p.montant_rembourse) /
               parseFloat(p.montant_total_du)) * 100, 100
            );
            const echeanceMensuelle = parseFloat(p.montant_total_du) /
              parseFloat(p.nb_echeances);

            return (
              <div key={i}
                className="px-4 py-3 border-b border-[#2e3a50]
                  last:border-0">
                <div className="flex justify-between
                  items-start mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium
                      truncate">
                      {p.rubrique_nom}
                    </p>
                    <p className="text-xs text-gray-500">
                      {p.nb_echeances} échéance(s) ·
                      {echeanceMensuelle.toLocaleString('fr-FR')} F/séance
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-red-400 font-mono
                      font-bold text-sm">
                      {parseFloat(p.reste_a_regler)
                        .toLocaleString('fr-FR')} F
                    </p>
                    <p className="text-xs text-gray-500">
                      reste
                    </p>
                  </div>
                </div>

                {/* Progression remboursement */}
                <div className="h-1.5 bg-[#1e2535] rounded-full
                  overflow-hidden mb-1">
                  <div className="h-full bg-blue-500 rounded-full
                    transition-all"
                    style={{ width: `${progression}%` }} />
                </div>

                <div className="flex justify-between text-xs
                  text-gray-500">
                  <span>
                    Remboursé :
                    {parseFloat(p.montant_rembourse)
                      .toLocaleString('fr-FR')} F
                  </span>
                  <span>
                    Total :
                    {parseFloat(p.montant_total_du)
                      .toLocaleString('fr-FR')} F
                  </span>
                </div>

                {/* Date approximative de fin */}
                <div className="mt-2 bg-amber-900/20 border
                  border-amber-800/30 rounded-lg px-3 py-1.5">
                  <p className="text-xs text-amber-400">
                    ⏰ Prochain remboursement :
                    {echeanceMensuelle.toLocaleString('fr-FR')} F
                    à la prochaine séance
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Message si tout est en ordre */}
      {(!finances?.prets || finances.prets.length === 0) &&
       (!finances?.epargnes || finances.epargnes.length === 0) && (
        <div className="bg-green-900/20 border border-green-800/30
          rounded-xl p-5 text-center">
          <p className="text-2xl mb-2">🎉</p>
          <p className="text-green-400 font-medium">
            Tout est en ordre !
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Aucun prêt en cours · Finances saines
          </p>
        </div>
      )}
    </div>
  );
}