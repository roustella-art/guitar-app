export default function FicheDetail({ fiche, onEdit, onDelete }) {
  return (
    <div className="detail-container">
      <div className="fiche-meta">
        <span className="fiche-date">{fiche.date}</span>
        {fiche.niveau && <span className="fiche-tag">{fiche.niveau}</span>}
        {fiche.morceau && <span className="fiche-morceau">♪ {fiche.morceau}</span>}
      </div>

      <div className="fiche-contenu">
        {fiche.contenu.split('\n').map((line, i) => (
          <p key={i}>{line || ' '}</p>
        ))}
      </div>

      <div className="fiche-actions">
        <button className="btn-secondary" onClick={onEdit}>Modifier</button>
        <button
          className="btn-delete"
          onClick={() => { if (confirm('Supprimer cette fiche ?')) onDelete() }}
        >
          Supprimer
        </button>
      </div>
    </div>
  )
}
