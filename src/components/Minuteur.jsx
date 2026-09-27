import { useState, useEffect, useRef } from 'react'

const DUREE = 40 * 60

function bip(ctx) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = 880
  gain.gain.setValueAtTime(0.6, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.8)
}

function jouerAlarme(ctx) {
  [0, 0.9, 1.8].forEach(t => {
    setTimeout(() => bip(ctx), t * 1000)
  })
}

export default function Minuteur() {
  const [restant, setRestant] = useState(DUREE)
  const [actif, setActif] = useState(false)
  const [fini, setFini] = useState(false)
  const [ouvert, setOuvert] = useState(false)
  const intervalRef = useRef(null)
  const audioCtxRef = useRef(null)
  const wakeLockRef = useRef(null)
  const debutRef = useRef(null)
  const restantAuPauseRef = useRef(DUREE)

  const getCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return audioCtxRef.current
  }

  const relacherWakeLock = () => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {})
      wakeLockRef.current = null
    }
  }

  const demarrer = () => {
    getCtx() // déverrouille l'audio au tap
    debutRef.current = Date.now()
    setActif(true)
    setFini(false)
    navigator.wakeLock?.request('screen').then(wl => {
      wakeLockRef.current = wl
    }).catch(() => {})
  }

  const pauseResume = () => {
    if (actif) {
      restantAuPauseRef.current = restant
      setActif(false)
      relacherWakeLock()
    } else {
      debutRef.current = Date.now()
      demarrer()
    }
  }

  const reset = () => {
    setActif(false)
    setFini(false)
    setRestant(DUREE)
    restantAuPauseRef.current = DUREE
    relacherWakeLock()
  }

  useEffect(() => {
    if (!actif) return
    intervalRef.current = setInterval(() => {
      const ecoule = Math.floor((Date.now() - debutRef.current) / 1000)
      const nouveau = restantAuPauseRef.current - ecoule
      if (nouveau <= 0) {
        clearInterval(intervalRef.current)
        setRestant(0)
        setActif(false)
        setFini(true)
        relacherWakeLock()
        jouerAlarme(getCtx())
      } else {
        setRestant(nouveau)
      }
    }, 500)
    return () => clearInterval(intervalRef.current)
  }, [actif])

  const mm = String(Math.floor(restant / 60)).padStart(2, '0')
  const ss = String(restant % 60).padStart(2, '0')
  const pct = (restant / DUREE) * 100
  const urgence = restant <= 300 && restant > 0 // 5 dernières minutes

  return (
    <>
      <button
        className={`minuteur-fab ${fini ? 'minuteur-fab--fini' : ''} ${actif ? 'minuteur-fab--actif' : ''}`}
        onClick={() => setOuvert(o => !o)}
        aria-label="Minuteur de cours"
      >
        {actif || fini ? `${mm}:${ss}` : '40:00'}
      </button>

      {ouvert && (
        <div className="minuteur-panel">
          <div className="minuteur-barre-wrap">
            <div
              className={`minuteur-barre ${urgence ? 'minuteur-barre--urgence' : ''}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className={`minuteur-temps ${fini ? 'minuteur-temps--fini' : ''} ${urgence ? 'minuteur-temps--urgence' : ''}`}>
            {mm}:{ss}
          </div>
          {fini && <p className="minuteur-msg">⏰ Cours terminé !</p>}
          <div className="minuteur-btns">
            {!actif && restant === DUREE && (
              <button className="btn-primary" onClick={demarrer}>Démarrer</button>
            )}
            {(actif || (restant < DUREE && !fini)) && (
              <button className="btn-secondary" onClick={pauseResume}>
                {actif ? 'Pause' : 'Reprendre'}
              </button>
            )}
            {restant < DUREE && (
              <button className="btn-secondary" onClick={reset}>Reset</button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
