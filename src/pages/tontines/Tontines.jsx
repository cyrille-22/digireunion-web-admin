import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Pencil, X, Check, Wallet, Users, UserPlus, Trash2 } from 'lucide-react';

// ── API ───────────────────────────────────────────────────────
const getDeductions   = () => api.get('/deductions').then(r => r.data);
const createDeduction = (data) => api.post('/deductions', data);
const updateDeduction = (id, data) => api.put(`/deductions/${id}`, data);
const deleteDeduction = (id) => api.delete(`/deductions/${id}`);
const inscrireMembre  = (data) => api.post('/cotisations/inscription', data);
const getMembresTontine = (id) =>
  api.get(`/cotisations/tontine/${id}/membres`).then(r => r.data);
const getAllMembers  = () => api.get('/members').then(r => r.data);
const getTontines   = () => api.get('/tontines').then(r => r.data);
const createTontine = (data) => api.post('/tontines', data);
const updateTontine = (id, data) => api.put(`/tontines/${id}`, data);
const getRubriques  = () => api.get('/pret-rubriques').then(r => r.data);
const createRubrique = (data) => api.post('/pret-rubriques', data);
const updateRubrique = (id, data) => api.put(`/pret-rubriques/${id}`, data);
const supprimerTontine  = (id) => api.delete(`/tontines/${id}`);
const supprimerRubrique = (id) => api.delete(`/prets/rubriques/${id}`);

// ── MODAL TONTINE ─────────────────────────────────────────────
function TontineModal({ tontine, onClose, onSave }) {
  const [form, setForm] = useState({
    nom:                     tontine?.nom                     || '',
    montant_part:            tontine?.montant_part            || '',
    periodicite:             tontine?.periodicite             || 'hebdo',
    nb_beneficiaires_seance: tontine?.nb_beneficiaires_seance || 1,
    mode_attribution:        tontine?.mode_attribution        || 'tour_role',
    parts_multiples:         tontine?.parts_multiples         ?? true,
    penalite_absence:        tontine?.penalite_absence        || 0,
    regle_reliquat:          tontine?.regle_reliquat          || 'reporter',
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50">
      <div className="bg-[#161b27] border border-[#2e3a50] rounded-t-2xl md:rounded-2xl p-5 md:p-6 w-full md:max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base md:text-lg font-semibold text-white">
            {tontine ? 'Modifier la tontine' : 'Créer une tontine'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-2">Nom de la tontine</label>
            <input type="text" value={form.nom}
              onChange={e => setForm({...form, nom: e.target.value})}
              placeholder="Ex: Grande Tontine 2025"
              className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
              required />
          </div>

          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-2">Montant par part (FCFA)</label>
            <input type="number" value={form.montant_part}
              onChange={e => setForm({...form, montant_part: e.target.value})}
              placeholder="Ex: 5000"
              className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
              required />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2">Périodicité</label>
              <select value={form.periodicite}
                onChange={e => setForm({...form, periodicite: e.target.value})}
                className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-blue-500">
                <option value="hebdo">Hebdomadaire</option>
                <option value="bimensuel">Bimensuel</option>
                <option value="mensuel">Mensuel</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">Bénéficiaires/séance</label>
              <input type="number" min="1" value={form.nb_beneficiaires_seance}
                onChange={e => setForm({...form, nb_beneficiaires_seance: e.target.value})}
                className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-3 py-3 text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-2">Mode d'attribution</label>
            <select value={form.mode_attribution}
              onChange={e => setForm({...form, mode_attribution: e.target.value})}
              className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500">
              <option value="tour_role">Tour de rôle</option>
              <option value="tirage">Tirage au sort</option>
              <option value="enchere">Enchères</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2">Pénalité absence (F)</label>
              <input type="number" min="0" value={form.penalite_absence}
                onChange={e => setForm({...form, penalite_absence: e.target.value})}
                className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-3 py-3 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">Règle du reliquat</label>
              <select value={form.regle_reliquat}
                onChange={e => setForm({...form, regle_reliquat: e.target.value})}
                className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-blue-500">
                <option value="reporter">Reporter</option>
                <option value="distribuer">Distribuer</option>
                <option value="reserver">Réserver</option>
              </select>
            </div>
          </div>

          <div className="mb-5 flex items-center gap-3">
            <input type="checkbox" id="parts"
              checked={form.parts_multiples}
              onChange={e => setForm({...form, parts_multiples: e.target.checked})}
              className="w-4 h-4 accent-blue-500" />
            <label htmlFor="parts" className="text-sm text-gray-400 cursor-pointer">
              Autoriser les parts multiples
            </label>
          </div>

          <div className="flex gap-3 pt-3 border-t border-[#2e3a50]">
            <button type="button" onClick={onClose}
              className="flex-1 bg-[#1e2535] border border-[#2e3a50] text-gray-400 py-3 rounded-xl hover:text-white transition text-sm">
              Annuler
            </button>
            <button type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-sm">
              <Check size={16} />
              {tontine ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── MODAL RUBRIQUE PRÊT ───────────────────────────────────────
function RubriqueModal({ rubrique, onClose, onSave }) {
  const [form, setForm] = useState({
    nom:                 rubrique?.nom                 || '',
    plafond:             rubrique?.plafond             || '',
    taux_interet:        rubrique?.taux_interet        || 0,
    periodicite_interet: rubrique?.periodicite_interet || 'mensuel',
    mode_calcul_interet: rubrique?.mode_calcul_interet || 'simple',
    duree_max_seances:   rubrique?.duree_max_seances   || 4,
    penalite_retard:     rubrique?.penalite_retard     || 0,
    validation_requise:  rubrique?.validation_requise  || 'president',
    type_rubrique:       rubrique?.type_rubrique       || 'pret',
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50">
      <div className="bg-[#161b27] border border-[#2e3a50] rounded-t-2xl md:rounded-2xl p-5 md:p-6 w-full md:max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base md:text-lg font-semibold text-white">
            {rubrique ? 'Modifier la rubrique' : 'Créer une rubrique'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}>

          {/* Type de rubrique */}
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-2">Type de rubrique</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                ['pret',    '💳 Prêt'],
                ['epargne', '🏦 Épargne'],
                ['fond',    '🏛️ Fond'],
              ].map(([val, label]) => (
                <div key={val}
                  onClick={() => setForm({...form, type_rubrique: val})}
                  className={`border rounded-xl p-2 cursor-pointer text-center transition ${
                    form.type_rubrique === val
                      ? 'bg-blue-900/20 border-blue-800/50 text-white'
                      : 'bg-[#1e2535] border-[#2e3a50] text-gray-400'}`}>
                  <p className="text-xs font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-2">Nom de la rubrique</label>
            <input type="text" value={form.nom}
              onChange={e => setForm({...form, nom: e.target.value})}
              placeholder="Ex: Banque, Fond de Solidarité, GAV..."
              className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
              required />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2">Plafond (F) — vide = illimité</label>
              <input type="number" value={form.plafond}
                onChange={e => setForm({...form, plafond: e.target.value})}
                placeholder="Illimité"
                className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-3 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">Taux d'intérêt (%)</label>
              <input type="number" step="0.01" min="0" max="100"
                value={form.taux_interet}
                onChange={e => setForm({...form, taux_interet: e.target.value})}
                className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-3 py-3 text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2">Périodicité taux</label>
              <select value={form.periodicite_interet}
                onChange={e => setForm({...form, periodicite_interet: e.target.value})}
                className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-blue-500">
                <option value="mensuel">Mensuel</option>
                <option value="seance">Par séance</option>
                <option value="annuel">Annuel</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">Mode de calcul</label>
              <select value={form.mode_calcul_interet}
                onChange={e => setForm({...form, mode_calcul_interet: e.target.value})}
                className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-blue-500">
                <option value="simple">Intérêt simple</option>
                <option value="degressif">Dégressif</option>
                <option value="forfait">Forfait fixe</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <label className="block text-xs text-gray-400 mb-2">Durée max (séances)</label>
              <input type="number" min="1" value={form.duree_max_seances}
                onChange={e => setForm({...form, duree_max_seances: e.target.value})}
                className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-3 py-3 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">Validation requise</label>
              <select value={form.validation_requise}
                onChange={e => setForm({...form, validation_requise: e.target.value})}
                className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-blue-500">
                <option value="president">Président</option>
                <option value="bureau">Bureau</option>
                <option value="automatique">Automatique</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-[#2e3a50]">
            <button type="button" onClick={onClose}
              className="flex-1 bg-[#1e2535] border border-[#2e3a50] text-gray-400 py-3 rounded-xl hover:text-white transition text-sm">
              Annuler
            </button>
            <button type="submit"
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-sm">
              <Check size={16} />
              {rubrique ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── MODAL INSCRIPTION MEMBRES ─────────────────────────────────
function InscriptionModal({ tontine, onClose }) {
  const queryClient = useQueryClient();
  const [partsMap, setPartsMap] = useState({});

  const { data: allMembresData } = useQuery({
    queryKey: ['members'],
    queryFn: getAllMembers
  });

  const { data: inscritData, refetch } = useQuery({
    queryKey: ['membres-tontine', tontine.id],
    queryFn: () => getMembresTontine(tontine.id)
  });

  const allMembres = allMembresData?.membres || [];
  const inscrits   = inscritData?.membres    || [];
  const inscritIds = new Set(inscrits.map(m => m.member_id));

  const mutation = useMutation({
    mutationFn: (data) => inscrireMembre(data),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries(['membres-tontine']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Erreur')
  });

  const handleInscrire = (memberId) => {
    const nb_parts = parseInt(partsMap[memberId] || 1);
    mutation.mutate({ tontine_id: tontine.id, member_id: memberId, nb_parts });
    toast.success('Membre inscrit !');
  };

  const handleModifier = (memberId) => {
    const nb_parts = parseInt(
      partsMap[memberId] ||
      inscrits.find(m => m.member_id === memberId)?.nb_parts || 1
    );
    mutation.mutate({ tontine_id: tontine.id, member_id: memberId, nb_parts });
    toast.success('Parts mises à jour !');
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50">
      <div className="bg-[#161b27] border border-[#2e3a50] rounded-t-2xl md:rounded-2xl p-5 w-full md:max-w-2xl max-h-[85vh] flex flex-col">

        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-white truncate">
              Inscription — {tontine.nom}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {parseFloat(tontine.montant_part).toLocaleString('fr-FR')} F/part
              · {inscrits.length} inscrit(s)
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white flex-shrink-0 ml-2 p-1">
            <X size={20} />
          </button>
        </div>

        {/* Résumé */}
        <div className="bg-[#1e2535] rounded-xl p-3 mb-3 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total attendu/séance</p>
              <p className="text-lg font-bold text-green-400 font-mono">
                {inscrits.reduce((s, m) => s + parseFloat(m.montant_du || 0), 0)
                  .toLocaleString('fr-FR')} F
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Parts totales</p>
              <p className="text-lg font-bold text-blue-400 font-mono">
                {inscrits.reduce((s, m) => s + (m.nb_parts || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Liste membres */}
        <div className="flex-1 overflow-y-auto space-y-2 pb-2">
          {allMembres.map(m => {
            const estInscrit  = inscritIds.has(m.id);
            const infoInscrit = inscrits.find(i => i.member_id === m.id);
            const nbParts     = partsMap[m.id] !== undefined
              ? partsMap[m.id]
              : infoInscrit?.nb_parts || 1;
            const montant = parseInt(nbParts || 1) * parseFloat(tontine.montant_part);

            return (
              <div key={m.id}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 border transition ${
                  estInscrit
                    ? 'bg-green-900/10 border-green-800/30'
                    : 'bg-[#1e2535] border-transparent'}`}>

                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  estInscrit ? 'bg-green-900/40 text-green-400' : 'bg-blue-900/40 text-blue-400'}`}>
                  {m.nom_complet.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${estInscrit ? 'text-green-400' : 'text-white'}`}>
                    {m.nom_complet}
                  </p>
                  <p className="text-xs text-gray-500 capitalize truncate">
                    {m.role}
                    {estInscrit && (
                      <span className="ml-1 text-green-400">
                        · {infoInscrit?.nb_parts} part(s)
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">×</span>
                      <input
                        type="number" min="1" max="20" value={nbParts}
                        onChange={e => setPartsMap(prev => ({...prev, [m.id]: e.target.value}))}
                        className="w-12 bg-[#252d40] border border-[#3a4960] rounded-lg px-2 py-1 text-white text-center text-sm font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-0.5">
                      {montant.toLocaleString('fr-FR')} F
                    </span>
                  </div>

                  {estInscrit ? (
                    <button onClick={() => handleModifier(m.id)}
                      className="flex items-center gap-1 bg-blue-900/40 text-blue-400 hover:bg-blue-900/60 px-2.5 py-1.5 rounded-lg text-xs font-medium transition">
                      <Pencil size={12} /> Modifier
                    </button>
                  ) : (
                    <button onClick={() => handleInscrire(m.id)}
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition">
                      <UserPlus size={12} /> Inscrire
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-[#2e3a50] flex-shrink-0">
          <button onClick={onClose}
            className="w-full bg-[#1e2535] border border-[#2e3a50] text-gray-400 py-3 rounded-xl hover:text-white transition text-sm">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MODAL DÉDUCTION ───────────────────────────────────────────
function DeductionModal({ deduction, onClose, onSave }) {
  const [form, setForm] = useState({
    nom:          deduction?.nom          || '',
    type_montant: deduction?.type_montant || 'fixe',
    montant:      deduction?.montant      || '',
    pourcentage:  deduction?.pourcentage  || '',
    applicable_a: deduction?.applicable_a || 'toutes',
    ordre:        deduction?.ordre        || 1,
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50">
      <div className="bg-[#161b27] border border-[#2e3a50] rounded-t-2xl md:rounded-2xl p-5 w-full md:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">
            {deduction ? 'Modifier' : 'Nouvelle'} déduction
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-2">Nom de la déduction</label>
            <input type="text" value={form.nom}
              onChange={e => setForm({...form, nom: e.target.value})}
              placeholder="Ex: Jeton de présence, Construction foyer..."
              className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
              required />
          </div>

          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-2">Type de montant</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['fixe',       '💰 Montant fixe'],
                ['pourcentage','📊 Pourcentage'],
              ].map(([val, label]) => (
                <div key={val}
                  onClick={() => setForm({...form, type_montant: val})}
                  className={`border rounded-xl p-3 cursor-pointer text-center transition ${
                    form.type_montant === val
                      ? 'bg-blue-900/20 border-blue-800/50 text-white'
                      : 'bg-[#1e2535] border-[#2e3a50] text-gray-400'}`}>
                  <p className="text-sm font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {form.type_montant === 'fixe' ? (
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-2">Montant fixe (FCFA)</label>
              <input type="number" min="0" value={form.montant}
                onChange={e => setForm({...form, montant: e.target.value})}
                placeholder="Ex: 5000"
                className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 font-mono"
                required />
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-2">Pourcentage (%)</label>
              <input type="number" min="0" max="100" step="0.01"
                value={form.pourcentage}
                onChange={e => setForm({...form, pourcentage: e.target.value})}
                placeholder="Ex: 5"
                className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 font-mono"
                required />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <label className="block text-xs text-gray-400 mb-2">Ordre d'affichage</label>
              <input type="number" min="1" value={form.ordre}
                onChange={e => setForm({...form, ordre: e.target.value})}
                className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-3 py-3 text-white focus:outline-none focus:border-blue-500 font-mono" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">Applicable à</label>
              <select value={form.applicable_a}
                onChange={e => setForm({...form, applicable_a: e.target.value})}
                className="w-full bg-[#1e2535] border border-[#2e3a50] rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-blue-500">
                <option value="toutes">Toutes</option>
                <option value="petite">Petite tontine</option>
                <option value="grande">Grande tontine</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-[#2e3a50]">
            <button type="button" onClick={onClose}
              className="flex-1 bg-[#1e2535] border border-[#2e3a50] text-gray-400 py-3 rounded-xl hover:text-white transition text-sm">
              Annuler
            </button>
            <button type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-sm">
              <Check size={16} />
              {deduction ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── PAGE PRINCIPALE ───────────────────────────────────────────
export default function Tontines() {
  const [showTontineModal,   setShowTontineModal]   = useState(false);
  const [showRubriqueModal,  setShowRubriqueModal]  = useState(false);
  const [showDeductionModal, setShowDeductionModal] = useState(false);
  const [showInscription,    setShowInscription]    = useState(null);
  const [selectedTontine,    setSelectedTontine]    = useState(null);
  const [selectedRubrique,   setSelectedRubrique]   = useState(null);
  const [selectedDeduction,  setSelectedDeduction]  = useState(null);
  const [tab, setTab] = useState('tontines');
  const queryClient = useQueryClient();

  // ── QUERIES ──
  const { data: tontinesData,   isLoading: loadingT } = useQuery({ queryKey: ['tontines'],   queryFn: getTontines });
  const { data: rubriquesData,  isLoading: loadingR } = useQuery({ queryKey: ['rubriques'],  queryFn: getRubriques });
  const { data: deductionsData, refetch: refetchD }   = useQuery({ queryKey: ['deductions'], queryFn: getDeductions });

  const tontines   = tontinesData?.tontines    || [];
  const rubriques  = rubriquesData?.rubriques  || [];
  const deductions = deductionsData?.deductions || [];

  // ── MUTATIONS ──
  const tontineMutation = useMutation({
    mutationFn: (data) => selectedTontine
      ? updateTontine(selectedTontine.id, data)
      : createTontine(data),
    onSuccess: () => {
      toast.success(selectedTontine ? 'Tontine mise à jour !' : 'Tontine créée !');
      queryClient.invalidateQueries(['tontines']);
      setShowTontineModal(false);
      setSelectedTontine(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Erreur')
  });

  const rubriqueMutation = useMutation({
    mutationFn: (data) => selectedRubrique
      ? updateRubrique(selectedRubrique.id, data)
      : createRubrique(data),
    onSuccess: () => {
      toast.success(selectedRubrique ? 'Rubrique mise à jour !' : 'Rubrique créée !');
      queryClient.invalidateQueries(['rubriques']);
      setShowRubriqueModal(false);
      setSelectedRubrique(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Erreur')
  });

  const deductionMutation = useMutation({
    mutationFn: (data) => selectedDeduction
      ? updateDeduction(selectedDeduction.id, data)
      : createDeduction(data),
    onSuccess: () => {
      toast.success(selectedDeduction ? 'Déduction mise à jour !' : 'Déduction créée !');
      refetchD();
      setShowDeductionModal(false);
      setSelectedDeduction(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Erreur')
  });

  const deleteDedMutation = useMutation({
    mutationFn: (id) => deleteDeduction(id),
    onSuccess: () => { toast.success('Déduction supprimée !'); refetchD(); },
    onError:   (err) => toast.error(err.response?.data?.message || 'Erreur')
  });

  const handleSupprimerTontine = async (t) => {
    if (!window.confirm(`Supprimer la tontine "${t.nom}" ?\nCette action est irréversible.`)) return;
    try {
      await supprimerTontine(t.id);
      toast.success('Tontine supprimée');
      queryClient.invalidateQueries(['tontines']);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur suppression');
    }
  };

  const handleSupprimerRubrique = async (r) => {
    if (!window.confirm(`Supprimer la rubrique "${r.nom}" ?`)) return;
    try {
      await supprimerRubrique(r.id);
      toast.success('Rubrique supprimée');
      queryClient.invalidateQueries(['rubriques']);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur suppression');
    }
  };

  const periodiciteLabel = { hebdo: 'Hebdomadaire', bimensuel: 'Bimensuel', mensuel: 'Mensuel' };
  const modeLabel = { tour_role: 'Tour de rôle', tirage: 'Tirage au sort', enchere: 'Enchères' };

  return (
    <div>
      {/* ── HEADER ── */}
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-white">Configuration</h1>
        <p className="text-gray-400 text-xs md:text-sm mt-1">
          Tontines · Rubriques · Déductions
        </p>
      </div>

      {/* ── TABS ── */}
      <div className="grid grid-cols-3 gap-1 bg-[#1e2535] p-1 rounded-xl mb-5">
        {[
          ['tontines',   `Tontines (${tontines.length})`],
          ['rubriques',  `Rubriques (${rubriques.length})`],
          ['deductions', `Déductions (${deductions.length})`],
        ].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-2 py-2 rounded-lg text-xs md:text-sm font-medium transition truncate ${
              tab === key
                ? 'bg-[#161b27] text-white shadow'
                : 'text-gray-400 hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          ONGLET TONTINES
      ══════════════════════════════════════════════════════ */}
      {tab === 'tontines' && (
        <div>
          {/* Bouton créer */}
          <button
            onClick={() => { setSelectedTontine(null); setShowTontineModal(true); }}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition text-sm mb-4">
            <Plus size={16} /> Nouvelle tontine
          </button>

          {loadingT ? (
            <p className="text-gray-500 text-center py-10">Chargement...</p>
          ) : tontines.length === 0 ? (
            <div className="bg-[#161b27] border border-[#2e3a50] rounded-xl p-10 text-center">
              <p className="text-gray-500">Aucune tontine configurée</p>
              <p className="text-xs text-gray-600 mt-1">
                Créez votre première tontine pour commencer
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tontines.map(t => (
                <div key={t.id}
                  className="bg-[#161b27] border border-[#2e3a50] rounded-xl p-4 hover:border-blue-800/50 transition">

                  {/* En-tête carte */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-amber-900/30 text-amber-400 flex items-center justify-center flex-shrink-0">
                        <Wallet size={16} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-white font-semibold text-sm truncate">{t.nom}</h3>
                        <p className="text-xs text-gray-500">{periodiciteLabel[t.periodicite]}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-mono ${
                        t.statut === 'actif'
                          ? 'bg-green-900/40 text-green-400'
                          : 'bg-gray-800 text-gray-400'}`}>
                        {t.statut}
                      </span>
                      <button
                        onClick={() => { setSelectedTontine(t); setShowTontineModal(true); }}
                        className="text-gray-400 hover:text-blue-400 transition p-1"
                        title="Modifier">
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setShowInscription(t)}
                        className="text-gray-400 hover:text-green-400 transition p-1"
                        title="Gérer membres">
                        <Users size={14} />
                      </button>
                      <button
                        onClick={() => handleSupprimerTontine(t)}
                        className="text-gray-400 hover:text-red-400 transition p-1"
                        title="Supprimer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Infos */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#1e2535] rounded-lg p-2.5">
                      <p className="text-xs text-gray-500 mb-0.5">Montant/part</p>
                      <p className="text-white font-mono font-bold text-sm">
                        {parseFloat(t.montant_part).toLocaleString('fr-FR')} F
                      </p>
                    </div>
                    <div className="bg-[#1e2535] rounded-lg p-2.5">
                      <p className="text-xs text-gray-500 mb-0.5">Attribution</p>
                      <p className="text-white text-xs">{modeLabel[t.mode_attribution]}</p>
                    </div>
                    <div className="bg-[#1e2535] rounded-lg p-2.5">
                      <p className="text-xs text-gray-500 mb-0.5">Pénalité absence</p>
                      <p className="text-white font-mono text-sm">
                        {parseFloat(t.penalite_absence).toLocaleString('fr-FR')} F
                      </p>
                    </div>
                    <div className="bg-[#1e2535] rounded-lg p-2.5">
                      <p className="text-xs text-gray-500 mb-0.5">Reliquat</p>
                      <p className="text-white text-xs capitalize">{t.regle_reliquat}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          ONGLET RUBRIQUES
      ══════════════════════════════════════════════════════ */}
      {tab === 'rubriques' && (
        <div>
          {/* Bouton créer */}
          <button
            onClick={() => { setSelectedRubrique(null); setShowRubriqueModal(true); }}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl font-medium transition text-sm mb-4">
            <Plus size={16} /> Nouvelle rubrique
          </button>

          {loadingR ? (
            <p className="text-gray-500 text-center py-10">Chargement...</p>
          ) : rubriques.length === 0 ? (
            <div className="bg-[#161b27] border border-[#2e3a50] rounded-xl p-10 text-center">
              <p className="text-gray-500">Aucune rubrique configurée</p>
              <p className="text-xs text-gray-600 mt-1">
                Créez vos rubriques de prêt, épargne ou fond
              </p>
            </div>
          ) : (
            <div className="bg-[#161b27] border border-[#2e3a50] rounded-xl overflow-hidden">

              {/* En-tête tableau — desktop */}
              <div className="hidden md:grid grid-cols-8 gap-3 px-4 py-3 bg-[#1e2535] text-xs text-gray-500 font-mono uppercase tracking-wider">
                <div className="col-span-2">Nom</div>
                <div>Type</div>
                <div>Taux</div>
                <div>Calcul</div>
                <div>Durée</div>
                <div>Validation</div>
                <div>Actions</div>
              </div>

              {rubriques.map(r => (
                <div key={r.id}
                  className="border-b border-[#2e3a50] last:border-0 hover:bg-[#1e2535]/50 transition">

                  {/* ── CARTE MOBILE ── */}
                  <div className="md:hidden p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium text-sm truncate">{r.nom}</p>
                        <p className="text-xs text-gray-500">
                          Plafond : {r.plafond
                            ? `${parseFloat(r.plafond).toLocaleString('fr-FR')} F`
                            : 'Illimité'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <button
                          onClick={() => { setSelectedRubrique(r); setShowRubriqueModal(true); }}
                          className="text-gray-400 hover:text-blue-400 transition p-1">
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleSupprimerRubrique(r)}
                          className="text-gray-400 hover:text-red-400 transition p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                        r.type_rubrique === 'pret'
                          ? 'bg-blue-900/40 text-blue-400'
                          : r.type_rubrique === 'epargne'
                            ? 'bg-green-900/40 text-green-400'
                            : 'bg-purple-900/40 text-purple-400'}`}>
                        {r.type_rubrique}
                      </span>
                      <span className="text-amber-400 font-mono text-xs">
                        {(parseFloat(r.taux_interet) * 100).toFixed(1)}%
                      </span>
                      <span className="text-gray-500 text-xs capitalize">
                        {r.mode_calcul_interet}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {r.duree_max_seances} séances
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                        r.validation_requise === 'automatique'
                          ? 'bg-green-900/40 text-green-400'
                          : 'bg-blue-900/40 text-blue-400'}`}>
                        {r.validation_requise}
                      </span>
                    </div>
                  </div>

                  {/* ── LIGNE DESKTOP ── */}
                  <div className="hidden md:grid grid-cols-8 gap-3 px-4 py-3 items-center text-sm">
                    <div className="col-span-2">
                      <p className="text-white font-medium">{r.nom}</p>
                      <p className="text-xs text-gray-500">
                        Plafond : {r.plafond
                          ? `${parseFloat(r.plafond).toLocaleString('fr-FR')} F`
                          : 'Illimité'}
                      </p>
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-1 rounded font-mono ${
                        r.type_rubrique === 'pret'
                          ? 'bg-blue-900/40 text-blue-400'
                          : r.type_rubrique === 'epargne'
                            ? 'bg-green-900/40 text-green-400'
                            : 'bg-purple-900/40 text-purple-400'}`}>
                        {r.type_rubrique}
                      </span>
                    </div>
                    <div className="text-amber-400 font-mono">
                      {(parseFloat(r.taux_interet) * 100).toFixed(1)}%
                    </div>
                    <div className="text-gray-400 capitalize">{r.mode_calcul_interet}</div>
                    <div className="text-gray-400">{r.duree_max_seances} séances</div>
                    <div>
                      <span className={`px-2 py-1 rounded-md text-xs font-mono ${
                        r.validation_requise === 'automatique'
                          ? 'bg-green-900/40 text-green-400'
                          : 'bg-blue-900/40 text-blue-400'}`}>
                        {r.validation_requise}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setSelectedRubrique(r); setShowRubriqueModal(true); }}
                        className="text-gray-400 hover:text-blue-400 transition">
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleSupprimerRubrique(r)}
                        className="text-gray-400 hover:text-red-400 transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          ONGLET DÉDUCTIONS
      ══════════════════════════════════════════════════════ */}
      {tab === 'deductions' && (
        <div>
          <div className="flex items-center justify-between mb-4 gap-3">
            <p className="text-xs text-gray-400 flex-1">
              Proposées automatiquement lors du bénéfice (bouffer)
            </p>
            <button
              onClick={() => { setSelectedDeduction(null); setShowDeductionModal(true); }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl font-medium transition text-sm flex-shrink-0">
              <Plus size={15} /> Nouvelle
            </button>
          </div>

          {deductions.length === 0 ? (
            <div className="bg-[#161b27] border border-[#2e3a50] rounded-xl p-10 text-center">
              <p className="text-gray-500 mb-2">Aucune déduction configurée</p>
              <p className="text-xs text-gray-600">
                Ex: Jeton de présence, Construction foyer, Épargne construction...
              </p>
            </div>
          ) : (
            <div className="bg-[#161b27] border border-[#2e3a50] rounded-xl overflow-hidden">

              {/* En-tête — desktop */}
              <div className="hidden md:grid grid-cols-6 gap-3 px-4 py-3 bg-[#1e2535] text-xs text-gray-500 font-mono uppercase tracking-wider">
                <div className="col-span-2">Nom</div>
                <div>Type</div>
                <div>Montant</div>
                <div>Applicable</div>
                <div>Actions</div>
              </div>

              {deductions.map(d => (
                <div key={d.id}
                  className="border-b border-[#2e3a50] last:border-0 hover:bg-[#1e2535]/50 transition">

                  {/* Carte mobile */}
                  <div className="md:hidden p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white font-medium text-sm truncate flex-1">
                        {d.nom}
                      </p>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <button
                          onClick={() => { setSelectedDeduction(d); setShowDeductionModal(true); }}
                          className="text-gray-400 hover:text-blue-400 transition p-1">
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Supprimer "${d.nom}" ?`)) {
                              deleteDedMutation.mutate(d.id);
                            }
                          }}
                          className="text-gray-400 hover:text-red-400 transition p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                        d.type_montant === 'fixe'
                          ? 'bg-blue-900/40 text-blue-400'
                          : 'bg-purple-900/40 text-purple-400'}`}>
                        {d.type_montant}
                      </span>
                      <span className="text-white font-mono text-xs">
                        {d.type_montant === 'fixe'
                          ? `${parseFloat(d.montant).toLocaleString('fr-FR')} F`
                          : `${(parseFloat(d.pourcentage) * 100).toFixed(1)}%`}
                      </span>
                      <span className="text-gray-500 text-xs capitalize">
                        · {d.applicable_a}
                      </span>
                    </div>
                  </div>

                  {/* Ligne desktop */}
                  <div className="hidden md:grid grid-cols-6 gap-3 px-4 py-3 items-center text-sm">
                    <div className="col-span-2">
                      <p className="text-white font-medium">{d.nom}</p>
                      <p className="text-xs text-gray-500">Ordre : {d.ordre}</p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded-md text-xs font-mono ${
                        d.type_montant === 'fixe'
                          ? 'bg-blue-900/40 text-blue-400'
                          : 'bg-purple-900/40 text-purple-400'}`}>
                        {d.type_montant}
                      </span>
                    </div>
                    <div className="text-white font-mono">
                      {d.type_montant === 'fixe'
                        ? `${parseFloat(d.montant).toLocaleString('fr-FR')} F`
                        : `${(parseFloat(d.pourcentage) * 100).toFixed(1)}%`}
                    </div>
                    <div className="text-gray-400 text-xs capitalize">{d.applicable_a}</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setSelectedDeduction(d); setShowDeductionModal(true); }}
                        className="text-gray-400 hover:text-blue-400 transition">
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Supprimer "${d.nom}" ?`)) {
                            deleteDedMutation.mutate(d.id);
                          }
                        }}
                        className="text-gray-400 hover:text-red-400 transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MODALS ── */}
      {showTontineModal && (
        <TontineModal
          tontine={selectedTontine}
          onClose={() => { setShowTontineModal(false); setSelectedTontine(null); }}
          onSave={(form) => tontineMutation.mutate(form)}
        />
      )}
      {showRubriqueModal && (
        <RubriqueModal
          rubrique={selectedRubrique}
          onClose={() => { setShowRubriqueModal(false); setSelectedRubrique(null); }}
          onSave={(form) => rubriqueMutation.mutate(form)}
        />
      )}
      {showInscription && (
        <InscriptionModal
          tontine={showInscription}
          onClose={() => setShowInscription(null)}
        />
      )}
      {showDeductionModal && (
        <DeductionModal
          deduction={selectedDeduction}
          onClose={() => { setShowDeductionModal(false); setSelectedDeduction(null); }}
          onSave={(form) => deductionMutation.mutate(form)}
        />
      )}
    </div>
  );
}