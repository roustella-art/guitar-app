import { useState } from 'react'

const INSTRUMENTS = ['Guitare', 'Basse', 'Batterie', 'Chant']
const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

export default function FormAddEleve({ onAdd, onCancel }) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    niveau: '',
    lieu: 'ext',
    jour: '',
    heure: '',
    instruments: []
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
    onAdd(formData)
    setFormData({ nom: '', prenom: '', email: '', telephone: '', niveau: '', lieu: 'ext', jour: '', heure: '', instruments: [] })
  }

  return (
    <div className="form-container">
      <h2>NOUVEL ELEVE</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Prenom *</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            placeholder="Leo"
          />
        </div>

        <div className="form-group">
          <label>Nom *</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Dupont"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="leo@example.com"
          />
        </div>

        <div className="form-group">
          <label>Telephone</label>
          <input
            type="tel"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            placeholder="06 12 34 56 78"
          />
        </div>

        <div className="form-group">
          <label>Niveau</label>
          <input
            type="text"
            name="niveau"
            value={formData.niveau}
            onChange={handleChange}
            placeholder="Debutant"
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
          <label>Lieu du cours</label>
          <select name="lieu" value={formData.lieu} onChange={handleChange}>
            <option value="ext">A l'exterieur</option>
            <option value="chez">Chez moi</option>
          </select>
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
          <button type="submit" className="btn-primary">Ajouter</button>
          <button type="button" className="btn-secondary" onClick={onCancel}>Annuler</button>
        </div>
      </form>
    </div>
  )
}
