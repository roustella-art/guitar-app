import { useState } from 'react'

const INSTRUMENTS = ['Guitare', 'Basse', 'Batterie', 'Chant']
const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

export default function FormEditEleve({ eleve, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nom: eleve.nom,
    prenom: eleve.prenom,
    email: eleve.email || "",
    telephone: eleve.telephone || "",
    niveau: eleve.niveau || "",
    jour: eleve.jour || "",
    heure: eleve.heure || "",
    instruments: eleve.instruments || []
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleInstrumentChange = (instrument) => {
    setFormData(prev => {
      const instruments = prev.instruments.includes(instrument)
        ? prev.instruments.filter(i => i !== instrument)
        : [...prev.instruments, instrument]
      return { ...prev, instruments }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.nom.trim() || !formData.prenom.trim()) {
      alert('Veuillez remplir au moins le nom et le prenom')
      return
    }
    onSave(formData)
  }

  return (
    <div className="form-container">
      <h2>MODIFIER</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Prenom *</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Nom *</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Telephone</label>
          <input
            type="tel"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Niveau</label>
          <input
            type="text"
            name="niveau"
            value={formData.niveau}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Jour</label>
            <select name="jour" value={formData.jour} onChange={handleChange}>
              <option value="">-</option>
              {JOURS.map(j => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Heure</label>
            <input
              type="text"
              name="heure"
              value={formData.heure}
              onChange={handleChange}
              placeholder="09h00"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Instruments</label>
          <div className="instruments-list">
            {INSTRUMENTS.map(instrument => (
              <label key={instrument} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.instruments.includes(instrument)}
                  onChange={() => handleInstrumentChange(instrument)}
                />
                {instrument}
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">Enregistrer</button>
          <button type="button" className="btn-secondary" onClick={onCancel}>Annuler</button>
        </div>
      </form>
    </div>
  )
}
