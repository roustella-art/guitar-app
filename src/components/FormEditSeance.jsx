import { useState } from 'react'

export default function FormEditSeance({ seance, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    travail: seance.travail || '',
    devoirs: seance.devoirs || '',
    notes: seance.notes || ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="form-seance">
      <h3>MODIFIER SEANCE ({seance.date})</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Travail fait</label>
          <textarea
            name="travail"
            value={formData.travail}
            onChange={handleChange}
            rows="2"
          />
        </div>

        <div className="form-group">
          <label>Devoirs (suite)</label>
          <textarea
            name="devoirs"
            value={formData.devoirs}
            onChange={handleChange}
            rows="2"
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="2"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">Enregistrer</button>
          <button type="button" className="btn-secondary" onClick={onCancel}>Annuler</button>
        </div>
      </form>
    </div>
  )
}
