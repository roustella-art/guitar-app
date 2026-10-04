import { useState, useMemo } from 'react'

const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

function parseDate(str) {
  const [j, m, a] = (str || '').split('/')
  const d = new Date(Number(a), Number(m) - 1, Number(j))
  return isNaN(d) ? null : d
}

function libelleJour(str) {
  const d = parseDate(str)
  return d ? JOURS[d.getDay()] : ''
}

export default function Journal({ eleves, onSelectEleve }) {
  const [recherche, setRecherche] = useState('')

  const groupes = useMemo(() => {
    const entrees = []
    for (const eleve of eleves) {
      for (const seance of eleve.seances || []) {
        entrees.push({ eleve, seance })
      }
    }

    const q = recherche.trim().toLowerCase()
    const filtrees = q
      ? entrees.filter(({ eleve, seance }) =>
          `${eleve.prenom} ${eleve.nom} ${seance.travail || ''} ${seance.devoirs || ''} ${seance.notes || ''}`
            .toLowerCase()
            .includes(q)
        )
      : entrees

    filtrees.sort((a, b) => {
      const da = parseDate(a.seance.date)
      const db = parseDate(b.seance.date)
      if (da && db && da.getTime() !== db.getTime()) return db - da
      return (b.seance.id || 0) - (a.seance.id || 0)
    })

    const parDate = []
    for (const entree of filtrees) {
      const date = entree.seance.date
      const dernier = parDate[parDate.length - 1]
      if (dernier && dernier.date === date) dernier.entrees.push(entree)
      else parDate.push({ date, entrees: [entree] })
    }
    return parDate
  }, [eleves, recherche])

  const total = groupes.reduce((n, g) => n + g.entrees.length, 0)

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>JOURNAL ({total})</h2>
      </div>

      <input
        className="journal-recherche"
        type="search"
        value={recherche}
        onChange={e => setRecherche(e.target.value)}
        placeholder="Rechercher un élève, un morceau…"
      />

      {groupes.length === 0 ? (
        <div className="empty-state-container">
          <p className="empty-state">
            {recherche ? 'Aucune séance trouvée' : 'Aucune séance enregistrée'}
          </p>
        </div>
      ) : (
        <div className="journal-liste">
          {groupes.map(groupe => (
            <section key={groupe.date} className="journal-groupe">
              <h3 className="journal-date">
                <span className="journal-jour">{libelleJour(groupe.date)}</span>
                {groupe.date}
                <span className="journal-compte">
                  {groupe.entrees.length} séance{groupe.entrees.length > 1 ? 's' : ''}
                </span>
              </h3>

              {groupe.entrees.map(({ eleve, seance }) => (
                <article
                  key={seance.id}
                  className="journal-seance"
                  onClick={() => onSelectEleve(eleve)}
                >
                  <div className="journal-seance-tete">
                    <strong>{eleve.prenom} {eleve.nom}</strong>
                    {eleve.heure && <span className="journal-heure">{eleve.heure}</span>}
                  </div>

                  {seance.travail && (
                    <p className="journal-champ">
                      <span className="journal-label">Travail</span>
                      {seance.travail}
                    </p>
                  )}
                  {seance.devoirs && (
                    <p className="journal-champ">
                      <span className="journal-label">Devoirs</span>
                      {seance.devoirs}
                    </p>
                  )}
                  {seance.notes && (
                    <p className="journal-champ">
                      <span className="journal-label">Notes</span>
                      {seance.notes}
                    </p>
                  )}
                </article>
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
