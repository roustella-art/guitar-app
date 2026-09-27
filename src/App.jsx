import { useState, useEffect } from 'react'
import './App.css'
import ElevesList from './components/ElevesList'
import EleveDetail from './components/EleveDetail'
import FormAddEleve from './components/FormAddEleve'
import CoursList from './components/CoursList'
import FicheDetail from './components/FicheDetail'
import FormFiche from './components/FormFiche'
import Minuteur from './components/Minuteur'

function App() {
  const [eleves, setEleves] = useState([])
  const [selectedEleve, setSelectedEleve] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [cours, setCours] = useState([])
  const [showCours, setShowCours] = useState(false)
  const [selectedFiche, setSelectedFiche] = useState(null)
  const [showAddFicheForm, setShowAddFicheForm] = useState(false)
  const [ficheToEdit, setFicheToEdit] = useState(null)
  const [showPasteModal, setShowPasteModal] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const [pasteError, setPasteError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('eleves')
    if (saved) {
      const parsed = JSON.parse(saved)
      setEleves(parsed)
      const lastId = localStorage.getItem('lastEleveId')
      if (lastId) {
        const found = parsed.find(e => String(e.id) === lastId)
        if (found) setSelectedEleve(found)
      }
    }
    const savedCours = localStorage.getItem('cours')
    if (savedCours) setCours(JSON.parse(savedCours))
  }, [])

  useEffect(() => {
    localStorage.setItem('eleves', JSON.stringify(eleves))
  }, [eleves])

  useEffect(() => {
    localStorage.setItem('cours', JSON.stringify(cours))
  }, [cours])

  useEffect(() => {
    if (selectedEleve) {
      const updated = eleves.find(e => e.id === selectedEleve.id)
      if (updated) setSelectedEleve(updated)
      localStorage.setItem('lastEleveId', String(selectedEleve.id))
    } else {
      localStorage.removeItem('lastEleveId')
    }
  }, [eleves, selectedEleve])

  const addEleve = (eleve) => {
    const newEleve = {
      id: Date.now(),
      ...eleve,
      seances: []
    }
    setEleves([...eleves, newEleve])
    setShowAddForm(false)
  }

  const updateEleve = (id, updates) => {
    setEleves(eleves.map(e => e.id === id ? { ...e, ...updates } : e))
  }

  const deleteEleve = (id) => {
    setEleves(eleves.filter(e => e.id !== id))
    setSelectedEleve(null)
  }

  const addSeance = (eleveId, seance) => {
    updateEleve(eleveId, {
      seances: [...(eleves.find(e => e.id === eleveId)?.seances || []), {
        id: Date.now(),
        date: new Date().toLocaleDateString('fr-FR'),
        ...seance
      }]
    })
  }

  const updateSeance = (eleveId, seanceId, updates) => {
    const eleve = eleves.find(e => e.id === eleveId)
    if (eleve) {
      const updatedSeances = eleve.seances.map(s => 
        s.id === seanceId ? { ...s, ...updates } : s
      )
      updateEleve(eleveId, { seances: updatedSeances })
    }
  }

  const deleteSeance = (eleveId, seanceId) => {
    const eleve = eleves.find(e => e.id === eleveId)
    if (eleve) {
      const updatedSeances = eleve.seances.filter(s => s.id !== seanceId)
      updateEleve(eleveId, { seances: updatedSeances })
    }
  }

  const handlePasteImport = () => {
    setPasteError('')
    try {
      const data = JSON.parse(pasteText)
      if (!data.eleves || !Array.isArray(data.eleves)) {
        setPasteError('Format invalide : pas de champ "eleves"')
        return
      }
      setEleves(data.eleves)
      localStorage.setItem('eleves', JSON.stringify(data.eleves))
      if (data.cours && Array.isArray(data.cours)) {
        setCours(data.cours)
        localStorage.setItem('cours', JSON.stringify(data.cours))
      }
      setShowPasteModal(false)
      setPasteText('')
    } catch {
      setPasteError('JSON invalide, vérifie le texte collé')
    }
  }

  const addFiche = (data) => {
    const newFiche = {
      id: Date.now(),
      date: new Date().toLocaleDateString('fr-FR'),
      ...data
    }
    setCours(prev => [...prev, newFiche])
    setShowAddFicheForm(false)
    setFicheToEdit(null)
    setSelectedFiche(newFiche)
  }

  const updateFiche = (id, data) => {
    setCours(prev => prev.map(f => f.id === id ? { ...f, ...data } : f))
    setSelectedFiche(prev => prev?.id === id ? { ...prev, ...data } : prev)
    setFicheToEdit(null)
    setShowAddFicheForm(false)
  }

  const deleteFiche = (id) => {
    setCours(prev => prev.filter(f => f.id !== id))
    setSelectedFiche(null)
  }

  const handleReset = () => {
    if (confirm('Supprimer TOUS les donnees et recommencer?')) {
      localStorage.clear()
      setEleves([])
      setCours([])
      setSelectedEleve(null)
      setShowAddForm(false)
      setShowCours(false)
      setSelectedFiche(null)
    }
  }

  const handleExport = () => {
    const data = {
      version: '1.0',
      exported: new Date().toLocaleString('fr-FR'),
      eleves: eleves,
      cours: cours
    }
    
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cedrik-musik-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    alert('Donnees exportees!')
  }

  const inCours = showCours || selectedFiche || showAddFicheForm
  const showBack = selectedEleve || showAddForm || inCours

  const handleBack = () => {
    if (ficheToEdit) {
      setFicheToEdit(null)
      setShowAddFicheForm(false)
    } else if (selectedFiche) {
      setSelectedFiche(null)
    } else if (showAddFicheForm) {
      setShowAddFicheForm(false)
    } else if (showCours) {
      setShowCours(false)
    } else {
      setSelectedEleve(null)
      setShowAddForm(false)
    }
  }

  return (
    <div className="container">
      <header>
        <div className="header-content">
          {showBack && (
            <button className="btn-back-header" onClick={handleBack}>
              retour
            </button>
          )}
          <h1>CEDRIK-MUSIK</h1>
          {eleves.length > 0 && !selectedEleve && !showAddForm && !inCours && (
            <button className="btn-reset" onClick={handleReset}>reset</button>
          )}
        </div>
      </header>

      {!selectedEleve && !showAddForm && !inCours && (
        <ElevesList
          eleves={eleves}
          onSelectEleve={setSelectedEleve}
          onAddNew={() => setShowAddForm(true)}
          onExport={handleExport}
          onPasteImport={() => setShowPasteModal(true)}
          onShowCours={() => setShowCours(true)}
          coursCount={cours.length}
        />
      )}

      {showPasteModal && (
        <div className="modal-overlay" onClick={() => { setShowPasteModal(false); setPasteText(''); setPasteError('') }}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>Coller un export</h3>
            <p className="modal-hint">Colle le contenu JSON de ton dernier export</p>
            <textarea
              className="paste-textarea"
              value={pasteText}
              onChange={e => { setPasteText(e.target.value); setPasteError('') }}
              placeholder='{"version":"1.0","eleves":[...],"cours":[...]}'
              rows={10}
              autoFocus
            />
            {pasteError && <p className="paste-error">{pasteError}</p>}
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => { setShowPasteModal(false); setPasteText(''); setPasteError('') }}>Annuler</button>
              <button className="btn-primary" onClick={handlePasteImport} disabled={!pasteText.trim()}>Importer</button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <FormAddEleve
          onAdd={addEleve}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {selectedEleve && (
        <EleveDetail
          eleve={selectedEleve}
          onAddSeance={(seance) => addSeance(selectedEleve.id, seance)}
          onBack={() => setSelectedEleve(null)}
          onDelete={() => deleteEleve(selectedEleve.id)}
          onUpdate={(updates) => updateEleve(selectedEleve.id, updates)}
          onUpdateSeance={updateSeance}
          onDeleteSeance={deleteSeance}
        />
      )}

      {showCours && !selectedFiche && !showAddFicheForm && (
        <CoursList
          cours={cours}
          onSelectFiche={setSelectedFiche}
          onAddNew={() => setShowAddFicheForm(true)}
        />
      )}

      {showAddFicheForm && (
        <FormFiche
          fiche={ficheToEdit}
          onAdd={ficheToEdit ? (data) => updateFiche(ficheToEdit.id, data) : addFiche}
          onCancel={() => { setShowAddFicheForm(false); setFicheToEdit(null) }}
        />
      )}

      {selectedFiche && !showAddFicheForm && (
        <FicheDetail
          fiche={selectedFiche}
          onEdit={() => { setFicheToEdit(selectedFiche); setShowAddFicheForm(true) }}
          onDelete={() => deleteFiche(selectedFiche.id)}
        />
      )}

      <Minuteur />
    </div>
  )
}

export default App
