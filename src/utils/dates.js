// Les seances sont stockees en jj/mm/aaaa ; <input type="date"> parle aaaa-mm-jj.

export function versInput(fr) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec((fr || '').trim())
  return m ? `${m[3]}-${m[2]}-${m[1]}` : ''
}

export function versFr(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((iso || '').trim())
  return m ? `${m[3]}/${m[2]}/${m[1]}` : ''
}

export function aujourdhuiInput() {
  const d = new Date()
  const p = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

// Tri antichronologique : les dates invalides retombent sur l'identifiant.
export function plusRecenteDabord(a, b) {
  const ta = versInput(a.date)
  const tb = versInput(b.date)
  if (ta && tb && ta !== tb) return tb.localeCompare(ta)
  return (b.id || 0) - (a.id || 0)
}
