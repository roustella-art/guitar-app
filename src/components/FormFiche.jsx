import { useState } from 'react'

export default function FormFiche({ onAdd, onCancel, fiche }) {
  const isEdit = !!fiche
  const [formData, setFormData] = useState({
    titre: fiche?.titre || '',
    niveau: fiche?.niveau || '',
    morceau: fiche?.morceau || '',
    contenu: fiche?.contenu || ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.titre.trim() || !formData.contenu.trim()) {
      alert('Titre et contenu sont requis')
      return
    }
    onAdd(formData)
  }

  return (
    <div className="form-container">
      <h2>{isEdit ? 'MODIFIER LA FICHE' : 'NOUVELLE FICHE'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Titre *</label>
          <input
            type="text"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            placeholder="Ex: Déclinaisons d'un morceau"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Niveau</label>
            <input
              type="text"
              name="niveau"
              value={formData.niveau}
              onChange={handleChange}
              placeholder="Intermédiaire"
            />
          </div>
          <div className="form-group">
            <label>Morceau</label>
            <input
              type="text"
              name="morceau"
              value={formData.morceau}
              onChange={handleChange}
              placeholder="Good Riddance"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Contenu *</label>
          <textarea
            name="contenu"
            value={formData.contenu}
            onChange={handleChange}
            className="textarea-tall"
            placeholder="Description de la leçon, étapes, observations..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {isEdit ? 'Enregistrer' : 'Ajouter'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}
