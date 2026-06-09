import { useQuery } from '@tanstack/react-query';
import { getMembers } from '../../api/members';
import StatCard from '../../components/ui/StatCard';
import useAuthStore from '../../store/authStore';
import api from '../../api/axios';

// API Dashboard
const getDashboardStats = () =>
  api.get('/dashboard/stats').then(r => r.data);

export default function Dashboard() {
  const { membre } = useAuthStore();

  const { data: membresData } = useQuery({
    queryKey: ['members'],
    queryFn: () => getMembers().then(r => r.data),
    refetchInterval: 30000 // Rafraîchir toutes les 30s
  });

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    refetchInterval: 30000
  });

  const { data: tontinesData } = useQuery({
    queryKey: ['tontines'],
    queryFn: () => api.get('/tontines').then(r => r.data),
    refetchInterval: 30000
  });
const { data: parametresData } = useQuery({
  queryKey: ['parametres'],
  queryFn: () => api.get('/parametres').then(r => r.data),
  refetchInterval: 30000
});

  const assocNom = parametresData?.parametres?.nom || membre?.association;
  const lieuReunion = parametresData?.parametres?.lieu_reunion || '';
  const membres  = membresData?.membres   || [];
  const tontines = tontinesData?.tontines || [];
  const actifs   = membres.filter(m => m.statut === 'actif').length;

  return (
    <div>
      {/* Header */}
      <h1 className="text-2xl font-bold text-white">
          Bonjour, {membre?.nom?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {assocNom} {lieuReunion && `· ${lieuReunion}`} · {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long', year: 'numeric',
            month: 'long', day: 'numeric'
          })}
        </p>

{/* Stats — 2 colonnes sur mobile, 4 sur desktop */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
  <StatCard
    title="Caisse"
    value={stats
      ? `${parseFloat(stats.caisse_disponible || 0)
          .toLocaleString('fr-FR')} F`
      : '...'}
    subtitle="FCFA disponible"
    color="green"
  />
  <StatCard
    title="Membres"
    value={actifs}
    subtitle={`/ ${membres.length} total`}
    color="blue"
  />
  <StatCard
    title="Tontines"
    value={tontines.filter(t => t.statut === 'actif').length}
    subtitle="actives"
    color="amber"
  />
  <StatCard
    title="Séances"
    value={stats?.nb_seances_closes || 0}
    subtitle="tenues"
    color="purple"
  />
</div>

{/* Prêts + Membres — empilés sur mobile */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
  {/* Prêts en cours */}
  <div className="bg-[#161b27] border border-[#2e3a50]
    rounded-xl p-4">
    <p className="text-xs text-gray-500 font-mono uppercase
      tracking-wider mb-3">Prêts en cours</p>
    {!stats?.prets_en_cours?.length ? (
      <p className="text-gray-500 text-sm">
        Aucun prêt en cours
      </p>
    ) : (
      stats.prets_en_cours.slice(0, 5).map((p, i) => (
        <div key={i}
          className="flex items-center justify-between
            py-2 border-b border-[#2e3a50] last:border-0">
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm truncate">
              {p.nom_complet}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {p.rubrique_nom}
            </p>
          </div>
          <span className="text-red-400 font-mono text-sm
            flex-shrink-0 ml-2">
            {parseFloat(p.reste_a_regler)
              .toLocaleString('fr-FR')} F
          </span>
        </div>
      ))
    )}
  </div>

  {/* Membres récents */}
  <div className="bg-[#161b27] border border-[#2e3a50]
    rounded-xl p-4">
    <p className="text-xs text-gray-500 font-mono uppercase
      tracking-wider mb-3">Membres</p>
    {membres.slice(0, 5).map(m => (
      <div key={m.id}
        className="flex items-center justify-between
          py-2 border-b border-[#2e3a50] last:border-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-full bg-blue-900/40
            text-blue-400 flex items-center justify-center
            text-xs font-bold flex-shrink-0">
            {m.nom_complet.split(' ')
              .map(n => n[0]).join('').slice(0,2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm truncate">
              {m.nom_complet}
            </p>
            <p className="text-xs text-gray-500 capitalize truncate">
              {m.role}
            </p>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded font-mono
          flex-shrink-0 ml-2 ${m.statut === 'actif'
            ? 'bg-green-900/40 text-green-400'
            : 'bg-red-900/40 text-red-400'}`}>
          {m.statut}
        </span>
      </div>
    ))}
  </div>
</div>

{/* Tontines */}
<div className="bg-[#161b27] border border-[#2e3a50]
  rounded-xl p-4">
  <p className="text-xs text-gray-500 font-mono uppercase
    tracking-wider mb-3">Tontines actives</p>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {tontines.filter(t => t.statut === 'actif').map(t => (
      <div key={t.id}
        className="bg-[#1e2535] rounded-xl p-3">
        <div className="flex justify-between items-start mb-2">
          <p className="text-white font-medium text-sm truncate
            flex-1">
            {t.nom}
          </p>
          <span className="text-xs bg-green-900/40 text-green-400
            px-2 py-0.5 rounded font-mono flex-shrink-0 ml-2">
            Actif
          </span>
        </div>
        <p className="text-xl font-bold text-amber-400
          font-mono mb-0.5">
          {parseFloat(t.montant_part).toLocaleString('fr-FR')} F
        </p>
        <p className="text-xs text-gray-500 mb-2">
          par part · {t.periodicite}
        </p>
        <div>
          <div className="flex justify-between text-xs
            text-gray-500 mb-1">
            <span>Cycle</span>
            <span>
              {t.seance_courante || 0}/{t.nb_seances_cycle || 52}
            </span>
          </div>
          <div className="h-1.5 bg-[#252d40] rounded-full
            overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full"
              style={{
                width: `${Math.min(
                  ((t.seance_courante || 0) /
                  (t.nb_seances_cycle || 52)) * 100, 100
                )}%`
              }} />
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
    </div>
  );
}