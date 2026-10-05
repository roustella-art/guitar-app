import { useMemo } from 'react'

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const DEBUT = 8 * 60
const FIN = 21 * 60
const DUREE = 60

function mins(h) {
  const m = /(\d{1,2})\D*(\d{2})?/.exec((h || '').trim())
  return m ? Number(m[1]) * 60 + Number(m[2] || 0) : null
}

function hhmm(t) {
  return `${String(Math.floor(t / 60)).padStart(2, '0')}h${String(t % 60).padStart(2, '0')}`
}

export default function Planning({ eleves, onSelectEleve }) {
  const { jours, sansCreneau } = useMemo(() => {
    const actifs = eleves.filter(e => !e.archive)
    const sans = actifs.filter(e => !e.jour || mins(e.heure) === null)
    const jours = []

    for (const jour of JOURS) {
      const duJour = actifs.filter(e => e.jour === jour && mins(e.heure) !== null)
      if (!duJour.length) continue

      const parHeure = new Map()
      for (const e of duJour) {
        const t = mins(e.heure)
        if (!parHeure.has(t)) parHeure.set(t, [])
        parHeure.get(t).push(e)
      }
      const heures = [...parHeure.keys()].sort((a, b) => a - b)
      const slots = heures.map((t, i) => {
        const groupe = parHeure.get(t)
        const suivant = heures[i + 1]
        return {
          debut: t,
          fin: suivant ? Math.min(t + DUREE, suivant) : t + DUREE,
          eleves: groupe,
          chez: groupe.every(e => e.lieu === 'chez'),
        }
      })
      jours.push({ jour, slots })
    }
    return { jours, sansCreneau: sans }
  }, [eleves])

  const span = FIN - DEBUT
  const heures = []
  for (let h = DEBUT / 60; h <= FIN / 60; h++) heures.push(h)

  const nbChez = jours.reduce(
    (n, j) => n + j.slots.reduce((m, s) => m + (s.chez ? s.eleves.length : 0), 0), 0)
  const total = jours.reduce(
    (n, j) => n + j.slots.reduce((m, s) => m + s.eleves.length, 0), 0)

  if (!jours.length) {
    return (
      <div className="list-container">
        <div className="list-header"><h2>PLANNING</h2></div>
        <p className="empty-state">Aucun élève avec un jour et une heure</p>
      </div>
    )
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>PLANNING ({total})</h2>
      </div>

      <div className="plan-legende">
        <span><i className="plan-pastille chez" />Chez moi ({nbChez})</span>
        <span><i className="plan-pastille ext" />Extérieur ({total - nbChez})</span>
      </div>

      <div className="plan-cadre">
        <div className="plan-grille" style={{ gridTemplateColumns: `34px repeat(${jours.length}, minmax(116px, 1fr))` }}>
          <div className="plan-axe">
            {heures.map(h => (
              <span
                key={h}
                className="plan-heure"
                style={{ top: `${((h * 60 - DEBUT) / span) * 100}%` }}
              >
                {h}h
              </span>
            ))}
          </div>

          {jours.map(({ jour, slots }) => (
            <div key={jour} className="plan-col">
              <h3>{jour.slice(0, 3)}</h3>
              <div className="plan-piste">
                {heures.slice(1).map(h => (
                  <div
                    key={h}
                    className="plan-ligne"
                    style={{ top: `${((h * 60 - DEBUT) / span) * 100}%` }}
                  />
                ))}
                {slots.map(s => {
                  const court = s.fin - s.debut <= 30
                  return (
                    <button
                      key={s.debut}
                      className={`plan-bloc ${s.chez ? 'chez' : 'ext'}${court ? ' court' : ''}`}
                      style={{
                        top: `${((s.debut - DEBUT) / span) * 100}%`,
                        height: `${((s.fin - s.debut) / span) * 100}%`,
                      }}
                      onClick={() => onSelectEleve(s.eleves[0])}
                    >
                      <b>{s.eleves.map(e => `${e.prenom} ${e.nom}`.trim()).join(' / ')}</b>
                      {!court && <span>{hhmm(s.debut)} – {hhmm(s.fin)}</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {sansCreneau.length > 0 && (
        <p className="plan-note">
          Sans jour ou heure : {sansCreneau.map(e => `${e.prenom} ${e.nom}`.trim()).join(', ')}
        </p>
      )}
    </div>
  )
}
