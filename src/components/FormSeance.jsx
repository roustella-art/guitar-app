import { useState } from 'react'

export default function FormSeance({ onAdd, onCancel, eleve }) {
  const draftKey = `draft_seance_${eleve.id}`

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(draftKey)
      if (saved) return JSON.parse(saved)
    } catch {}
    return { travail: '', devoirs: '', notes: '' }
  })
  const [copied, setCopied] = useState(false)

  const hasDraft = formData.travail || formData.devoirs || formData.notes

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const next = { ...prev, [name]: value }
      localStorage.setItem(draftKey, JSON.stringify(next))
      return next
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.travail.trim() && !formData.devoirs.trim()) {
      alert('Remplis au moins le travail ou les devoirs')
      return
    }
    onAdd(formData)
    localStorage.removeItem(draftKey)
    setFormData({ travail: '', devoirs: '', notes: '' })
  }

  const handleCancel = () => {
    if (hasDraft) {
      if (confirm('Effacer le brouillon ?')) {
        localStorage.removeItem(draftKey)
        onCancel()
      }
    } else {
      onCancel()
    }
  }

  const getNextWeekDate = () => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    return nextWeek.toLocaleDateString('fr-FR')
  }

  const getFormattedMessage = () => {
    const nextWeekDate = getNextWeekDate()
    return `Pour la semaine du ${nextWeekDate} :\n${formData.devoirs}`
  }

  const handleCopy = () => {
    const message = getFormattedMessage()
    navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSMS = () => {
    if (!eleve.telephone) {
      alert('Telephone non renseigne')
      return
    }
    const message = getFormattedMessage()
    const encodedMessage = encodeURIComponent(message)
    const phone = eleve.telephone.replace(/\s/g, '')
    window.location.href = `sms:${phone}?body=${encodedMessage}`
  }

  return (
    <div className="form-seance">
      <h3>
        SEANCE DU {new Date().toLocaleDateString('fr-FR')}
        {hasDraft && <span className="draft-indicator"> [brouillon]</span>}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Travail fait</label>
          <textarea
            name="travail"
            value={formData.travail}
            onChange={handleChange}
            placeholder="ex: Accord Am, arpege..."
            rows="2"
          />
        </div>

        <div className="form-group">
          <label>Devoirs (suite)</label>
          <textarea
            name="devoirs"
            value={formData.devoirs}
            onChange={handleChange}
            placeholder="ex: Reviser accord Am, 10 min d'arpege..."
            rows="2"
          />
          <div className="devoirs-actions">
            <button 
              type="button" 
              className="btn-copy"
              onClick={handleCopy}
            >
              {copied ? 'Copie !' : 'Copier'}
            </button>
            {eleve.telephone && (
              <button 
                type="button" 
                className="btn-sms"
                onClick={handleSMS}
              >
                SMS
              </button>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Observations, points positifs, a retravailler..."
            rows="2"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">Enregistrer seance</button>
          <button type="button" className="btn-secondary" onClick={handleCancel}>Annuler</button>
        </div>
      </form>
    </div>
  )
}
