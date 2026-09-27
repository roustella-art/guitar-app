export default function CoursList({ cours, onSelectFiche, onAddNew }) {
  const sorted = [...cours].sort((a, b) => b.id - a.id)

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>COURS ({cours.length})</h2>
        <button className="btn-primary" onClick={onAddNew}>+ Ajouter</button>
      </div>

      {cours.length === 0 ? (
        <div className="empty-state-container">
          <p className="empty-state">Aucune fiche de cours</p>
          <p className="empty-state" style={{ fontSize: '12px', marginTop: 4 }}>
            Ajoute ta première fiche pédagogique
          </p>
        </div>
      ) : (
        <div className="eleves-grid">
          {sorted.map(fiche => (
            <div
              key={fiche.id}
              className="eleve-card fiche-card"
              onClick={() => onSelectFiche(fiche)}
            >
              <h3>{fiche.titre}</h3>
              <p className="schedule">
                {fiche.date}
                {fiche.niveau ? ` | ${fiche.niveau}` : ''}
              </p>
              {fiche.morceau && (
                <p className="instruments">♪ {fiche.morceau}</p>
              )}
              <p className="level fiche-preview">
                {fiche.contenu.substring(0, 100)}{fiche.contenu.length > 100 ? '…' : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
