import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import { Calendar, ChevronRight, X } from 'lucide-react';

const getHistorique = (page) =>
  api.get(`/cotisations/historique?page=${page}`).then(r => r.data);
const getBilan = (id) =>
  api.get(`/cotisations/bilan/${id}`).then(r => r.data);

function DetailSeanceModal({ seanceId, onClose }) {
  const { data: bilan, isLoading } = useQuery({
    queryKey: ['bilan', seanceId],
    queryFn: () => getBilan(seanceId)
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end
      md:items-center justify-center z-50">
      <div className="bg-[#161b27] border border-[#2e3a50]
        rounded-t-2xl md:rounded-2xl p-5 w-full md:max-w-lg
        max-h-[85vh] overflow-y-auto">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">
            Détail séance #{bilan?.seance?.numero}
          </h2>
          <button onClick={onClose}
            className="text-gray-400 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-500 text-center py-8">
            Chargement...
          </p>
        ) : (
          <div className="space-y-3">
            {/* Présences */}
            <div className="bg-[#1e2535] rounded-xl p-3">
              <p className="text-xs text-gray-500 font-mono
                uppercase tracking-wider mb-2">Présences</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-green-400">
                    {bilan?.presences?.presents || 0}
                  </p>
                  <p className="text-xs text-gray-500">Présents</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-red-400">
                    {bilan?.presences?.absents || 0}
                  </p>
                  <p className="text-xs text-gray-500">Absents</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-amber-400">
                    {bilan?.presences?.excuses || 0}
                  </p>
                  <p className="text-xs text-gray-500">Excusés</p>
                </div>
              </div>
            </div>

            {/* Cotisations */}
            {bilan?.cotisations?.map((c, i) => (
              <div key={i} className="bg-[#1e2535] rounded-xl p-3">
                <p className="text-xs text-gray-500 font-mono
                  uppercase tracking-wider mb-2">
                  {c.tontine_nom}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="text-xs bg-green-900/30
                      text-green-400 px-2 py-0.5 rounded">
                      ✅ {c.nb_cotises}
                    </span>
                    <span className="text-xs bg-red-900/30
                      text-red-400 px-2 py-0.5 rounded">
                      ❌ {c.nb_non_cotises}
                    </span>
                  </div>
                  <span className="text-green-400 font-mono
                    font-bold text-sm">
                    {parseFloat(c.total_cotise)
                      .toLocaleString('fr-FR')} F
                  </span>
                </div>
              </div>
            ))}

            {/* Mouvements */}
            <div className="bg-[#1e2535] rounded-xl p-3">
              <p className="text-xs text-gray-500 font-mono
                uppercase tracking-wider mb-2">Mouvements</p>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">Entrées</span>
                <span className="text-green-400 font-mono text-sm">
                  +{parseFloat(bilan?.mouvements?.total_entrees || 0)
                    .toLocaleString('fr-FR')} F
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Sorties</span>
                <span className="text-red-400 font-mono text-sm">
                  -{parseFloat(bilan?.mouvements?.total_sorties || 0)
                    .toLocaleString('fr-FR')} F
                </span>
              </div>
            </div>

            {/* Télécharger PV */}
            <button
              onClick={() => {
                const token = localStorage.getItem('token');
                fetch(`/api/v1/pv/${seanceId}`, {
                  headers: { Authorization: `Bearer ${token}` }
                })
                .then(r => r.blob())
                .then(blob => {
                  const url = URL.createObjectURL(blob);
                  const a   = document.createElement('a');
                  a.href    = url;
                  a.download = `PV_Seance_${bilan?.seance?.numero}.pdf`;
                  a.click();
                });
              }}
              className="w-full bg-red-900/30 text-red-400
                hover:bg-red-900/50 py-2.5 rounded-xl text-sm
                font-medium transition flex items-center
                justify-center gap-2">
              📄 Télécharger le PV PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MesSeances() {
  const [page, setPage]             = useState(1);
  const [detailId, setDetailId]     = useState(null);

  const { data: historiqueData } = useQuery({
    queryKey: ['historique', page],
    queryFn: () => getHistorique(page)
  });

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white">
          Séances
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Historique des séances de l'association
        </p>
      </div>

      {/* Liste séances */}
      <div className="space-y-3">
        {historiqueData?.seances?.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Aucune séance clôturée
          </div>
        )}

        {historiqueData?.seances?.map(s => (
          <div key={s.id}
            onClick={() => setDetailId(s.id)}
            className="bg-[#161b27] border border-[#2e3a50]
              rounded-xl p-4 flex items-center gap-3
              cursor-pointer hover:border-blue-800/50 transition">

            <div className="w-10 h-10 bg-blue-900/30 rounded-xl
              flex items-center justify-center flex-shrink-0">
              <span className="text-blue-400 font-mono
                font-bold text-sm">
                #{s.numero}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {new Date(s.date_seance).toLocaleDateString('fr-FR', {
                  weekday: 'long', day: 'numeric',
                  month: 'long', year: 'numeric'
                })}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500">
                  👥 {s.nb_presents} présents
                </span>
                <span className="text-xs text-gray-500">·</span>
                <span className="text-xs text-green-400">
                  {parseFloat(s.total_entrees || 0)
                    .toLocaleString('fr-FR')} F
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded
                font-mono ${s.ecart === '0.00'
                  ? 'bg-green-900/40 text-green-400'
                  : 'bg-red-900/40 text-red-400'}`}>
                {s.ecart === '0.00' ? '✅' : '⚠️'}
              </span>
              <ChevronRight size={16} className="text-gray-500" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {historiqueData?.pages > 1 && (
        <div className="flex justify-center gap-3 mt-5">
          <button
            onClick={() => setPage(p => Math.max(1, p-1))}
            disabled={page === 1}
            className="px-4 py-2 bg-[#161b27] border border-[#2e3a50]
              text-gray-400 rounded-xl text-sm disabled:opacity-30
              hover:text-white transition">
            ← Précédent
          </button>
          <span className="px-4 py-2 text-gray-500 text-sm">
            {page} / {historiqueData.pages}
          </span>
          <button
            onClick={() => setPage(p =>
              Math.min(historiqueData.pages, p+1))}
            disabled={page === historiqueData.pages}
            className="px-4 py-2 bg-[#161b27] border border-[#2e3a50]
              text-gray-400 rounded-xl text-sm disabled:opacity-30
              hover:text-white transition">
            Suivant →
          </button>
        </div>
      )}

      {/* Modal détail */}
      {detailId && (
        <DetailSeanceModal
          seanceId={detailId}
          onClose={() => setDetailId(null)}
        />
      )}
    </div>
  );
}