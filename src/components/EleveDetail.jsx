import { useState } from 'react'
import FormSeance from './FormSeance'
import FormEditSeance from './FormEditSeance'
import FormEditEleve from './FormEditEleve'

export default function EleveDetail({ eleve, onAddSeance, onBack, onDelete, onUpdate, onUpdateSeance, onDeleteSeance }) {
  const [showForm, setShowForm] = useState(() => {
    try {
      const saved = localStorage.getItem(`draft_seance_${eleve.id}`)
      if (saved) {
        const draft = JSON.parse(saved)
        return !!(draft.travail || draft.devoirs || draft.notes)
      }
    } catch {}
    return false
  })
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingSeanceId, setEditingSeanceId] = useState(null)

  const handleDelete = () => {
    if (confirm(`Supprimer ${eleve.prenom} ${eleve.nom}?`)) {
      onDelete()
    }
  }

  const handleEditSave = (updates) => {
    onUpdate(updates)
    setShowEditForm(false)
  }

  const handleDeleteSeance = (seanceId) => {
    if (confirm('Supprimer cette seance?')) {
      onDeleteSeance(eleve.id, seanceId)
    }
  }

  const handleUpdateSeance = (seanceId, updates) => {
    onUpdateSeance(eleve.id, seanceId, updates)
    setEditingSeanceId(null)
  }

  return (
    <div className="detail-container">
      <div className="eleve-header">
        <h2>{eleve.prenom} {eleve.nom}</h2>
        {eleve.archive && <span className="badge-archive">archivé</span>}
        <button className="btn-delete" onClick={handleDelete}>supprimer</button>
      </div>

      {!showEditForm ? (
        <>
          <div className="eleve-info">
            <div className="info-group">
              <label>Jour/Heure</label>
              <p>{eleve.jour || '-'} {eleve.heure ? `${eleve.heure}` : ''}</p>
            </div>
            <div className="info-group">
              <label>Email</label>
              <p>{eleve.email || '-'}</p>
            </div>
            <div className="info-group">
              <label>Telephone</label>
              <p>{eleve.telephone || '-'}</p>
            </div>
            <div className="info-group">
              <label>Niveau</label>
              <p>{eleve.niveau || '-'}</p>
            </div>
          </div>

          <div className="eleve-actions">
            <button className="btn-primary" onClick={() => setShowEditForm(true)}>
              Modifier
            </button>
            <button
              className="btn-secondary"
              onClick={() => onUpdate({ archive: !eleve.archive })}
            >
              {eleve.archive ? 'Réactiver' : 'Archiver'}
            </button>
          </div>

          {!showForm ? (
            <button className="btn-primary wide" onClick={() => setShowForm(true)}>
              + Ajouter seance
            </button>
          ) : (
            <FormSeance
              eleve={eleve}
              onAdd={(seance) => {
                onAddSeance(seance)
                setShowForm(false)
              }}
              onCancel={() => setShowForm(false)}
            />
          )}
        </>
      ) : (
        <FormEditEleve
          eleve={eleve}
          onSave={handleEditSave}
          onCancel={() => setShowEditForm(false)}
        />
      )}

      <div className="seances-history">
        <h3>HISTORIQUE ({eleve.seances?.length || 0})</h3>
        {!eleve.seances || eleve.seances.length === 0 ? (
          <p className="empty-state">Aucune seance</p>
        ) : (
          <div className="seances-list">
            {[...eleve.seances].reverse().map(seance => (
              <div key={seance.id}>
                {editingSeanceId === seance.id ? (
                  <FormEditSeance
                    seance={seance}
                    onSave={(updates) => handleUpdateSeance(seance.id, updates)}
                    onCancel={() => setEditingSeanceId(null)}
                  />
                ) : (
                  <div className="seance-item">
                    <div className="seance-header">
                      <div className="seance-date">{seance.date}</div>
                      <div className="seance-actions">
                        <button 
                          className="btn-seance-edit"
                          onClick={() => setEditingSeanceId(seance.id)}
                        >
                          editer
                        </button>
                        <button 
                          className="btn-seance-delete"
                          onClick={() => handleDeleteSeance(seance.id)}
                        >
                          suppr
                        </button>
                      </div>
                    </div>
                    <div className="seance-content">
                      {seance.travail && (
                        <div><strong>travail</strong> {seance.travail}</div>
                      )}
                      {seance.devoirs && (
                        <div><strong>devoirs</strong> {seance.devoirs}</div>
                      )}
                      {seance.notes && (
                        <div><strong>notes</strong> {seance.notes}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
