const JOURS_ORDER = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

export default function ElevesList({ eleves, onSelectEleve, onAddNew, onImportDefault, onExport, onImportFile, onShowCours, coursCount }) {
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

  const sortedEleves = sortEleves(eleves)

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>ELEVES ({eleves.length})</h2>
        <button className="btn-cours" onClick={onShowCours}>
          Cours{coursCount > 0 ? ` (${coursCount})` : ''}
        </button>
        <button className="btn-primary" onClick={onAddNew}>+ Ajouter</button>
      </div>
      
      {eleves.length === 0 ? (
        <div className="empty-state-container">
          <p className="empty-state">Aucun eleve</p>
          {onImportDefault && (
            <button className="btn-primary" onClick={onImportDefault} style={{ marginTop: '20px', width: '100%' }}>
              Importer 30 eleves
            </button>
          )}
        </div>
      ) : (
        <>
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
            <button className="btn-secondary" onClick={onExport}>Exporter</button>
            <button className="btn-secondary" onClick={onImportFile}>Importer</button>
          </div>
        </>
      )}
    </div>
  )
}
