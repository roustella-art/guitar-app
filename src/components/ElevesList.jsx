import { useState } from 'react'

const JOURS_ORDER = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

export default function ElevesList({ eleves, onSelectEleve, onAddNew, onExport, onPasteImport, onShowCours, onShowJournal, coursCount }) {
  const [voirArchives, setVoirArchives] = useState(false)

  const totalSeances = eleves.reduce((n, e) => n + (e.seances?.length || 0), 0)
  const actifs = eleves.filter(e => !e.archive)
  const archives = eleves.filter(e => e.archive)
  const visibles = voirArchives ? archives : actifs

  const sortEleves = (list) => {
    return [...list].sort((a, b) => {
      const dayA = JOURS_ORDER.indexOf(a.jour || '')
      const dayB = JOURS_ORDER.indexOf(b.jour || '')
      
      if (dayA !== dayB) {
        return dayA - dayB
      }
      
      const timeA = a.heure ? a.heure.replace('h', '').padStart(4, '0') : ''
      const timeB = b.heure ? b.heure.replace('h', '').padStart(4, '0') : ''
      return timeA.localeCompare(timeB)
    })
  }

  const sortedEleves = sortEleves(visibles)

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>{voirArchives ? 'ARCHIVES' : 'ELEVES'} ({visibles.length})</h2>
        <button className="btn-cours" onClick={onShowJournal}>
          Journal{totalSeances > 0 ? ` (${totalSeances})` : ''}
        </button>
        <button className="btn-cours" onClick={onShowCours}>
          Cours{coursCount > 0 ? ` (${coursCount})` : ''}
        </button>
        <button className="btn-primary" onClick={onAddNew}>+ Ajouter</button>
      </div>
      
      {eleves.length === 0 ? (
        <div className="empty-state-container">
          <p className="empty-state">Aucun eleve</p>
          <button className="btn-primary" onClick={onPasteImport} style={{ marginTop: '20px', width: '100%' }}>
            Coller un export
          </button>
        </div>
      ) : (
        <>
          {sortedEleves.length === 0 && (
            <p className="empty-state">
              {voirArchives ? 'Aucun élève archivé' : 'Tous les élèves sont archivés'}
            </p>
          )}

          <div className="eleves-grid">
            {sortedEleves.map(eleve => (
              <div
                key={eleve.id}
                className="eleve-card"
                onClick={() => onSelectEleve(eleve)}
              >
                <h3>{eleve.prenom} {eleve.nom}</h3>
                <p className="schedule">{eleve.jour} {eleve.heure ? `| ${eleve.heure}` : ''}</p>
                {eleve.instruments && eleve.instruments.length > 0 && (
                  <p className="instruments">{eleve.instruments.join(', ')}</p>
                )}
                <p className="level">{eleve.niveau}</p>
                <p className="seances">{eleve.seances?.length || 0} seance{eleve.seances?.length !== 1 ? 's' : ''}</p>
                {eleve.seances?.length > 0 && (
                  <p className="last-session">derniere: {eleve.seances[eleve.seances.length - 1].date}</p>
                )}
              </div>
            ))}
          </div>

          <div className="data-actions">
            <button
              className={`btn-secondary ${voirArchives ? 'btn-actif' : ''}`}
              onClick={() => setVoirArchives(v => !v)}
            >
              {voirArchives ? `← Élèves (${actifs.length})` : `Archives (${archives.length})`}
            </button>
            <button className="btn-secondary" onClick={onExport}>Exporter</button>
            <button className="btn-secondary" onClick={onPasteImport}>Coller export</button>
          </div>
        </>
      )}
    </div>
  )
}
