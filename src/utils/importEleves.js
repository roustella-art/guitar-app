export const elevesList = [
  { nom: "Carrieri", prenom: "Rosario", email: "", telephone: "", niveau: "Actif", jour: "Lundi", heure: "09h00" },
  { nom: "Millard", prenom: "Thierry", email: "", telephone: "", niveau: "Actif", jour: "Lundi", heure: "10h00" },
  { nom: "DoCruzeiro", prenom: "Philipe", email: "", telephone: "", niveau: "Actif", jour: "Lundi", heure: "14h00" },
  { nom: "Pansard", prenom: "Thibault", email: "", telephone: "", niveau: "Actif", jour: "Lundi", heure: "15h00" },
  { nom: "Eddie/Thomas", prenom: "Eddie/Thomas", email: "", telephone: "", niveau: "Actif", jour: "Mardi", heure: "08h30" },
  { nom: "Billaudelle", prenom: "Daniel", email: "", telephone: "", niveau: "Actif", jour: "Mardi", heure: "11h30" },
  { nom: "Daudier", prenom: "Gérard", email: "", telephone: "", niveau: "Actif", jour: "Mardi", heure: "12h45" },
  { nom: "Coudert", prenom: "Jacques", email: "", telephone: "", niveau: "Actif", jour: "Mardi", heure: "15h00" },
  { nom: "Tardieu", prenom: "Maëllis", email: "", telephone: "", niveau: "Actif", jour: "Mardi", heure: "16h45" },
  { nom: "Gardette", prenom: "Dom", email: "", telephone: "", niveau: "Actif", jour: "Mardi", heure: "18h00" },
  { nom: "Saconnet", prenom: "Claire", email: "", telephone: "", niveau: "Actif", jour: "Mardi", heure: "19h00" },
  { nom: "Curtil", prenom: "Bruno", email: "", telephone: "", niveau: "Actif", jour: "Mercredi", heure: "09h00" },
  { nom: "Lecoanet", prenom: "Gérard", email: "", telephone: "", niveau: "Actif", jour: "Mercredi", heure: "10h30" },
  { nom: "Charvet", prenom: "Agathe", email: "", telephone: "", niveau: "Actif", jour: "Mercredi", heure: "15h00" },
  { nom: "Hugues", prenom: "Hugues", email: "", telephone: "", niveau: "Actif", jour: "Mercredi", heure: "16h00" },
  { nom: "Lehellay", prenom: "Jules/Charlotte", email: "", telephone: "", niveau: "Alternance", jour: "Mercredi", heure: "17h45" },
  { nom: "Marie", prenom: "Marie", email: "", telephone: "", niveau: "Actif", jour: "Mercredi", heure: "19h00" },
  { nom: "Gabriel", prenom: "Jean-Luc", email: "", telephone: "", niveau: "Actif", jour: "Jeudi", heure: "15h15" },
  { nom: "Porte", prenom: "Nathan", email: "", telephone: "", niveau: "Actif", jour: "Jeudi", heure: "16h15" },
  { nom: "Brelot", prenom: "Paul", email: "", telephone: "", niveau: "Actif", jour: "Jeudi", heure: "17h15" },
  { nom: "NiN75", prenom: "NiN75", email: "", telephone: "", niveau: "Actif", jour: "Jeudi", heure: "19h00" },
  { nom: "Jobard", prenom: "Marc", email: "", telephone: "", niveau: "Actif", jour: "Vendredi", heure: "09h00" },
  { nom: "Renda", prenom: "Didier", email: "", telephone: "", niveau: "Actif", jour: "Vendredi", heure: "10h00" },
  { nom: "Waguette", prenom: "Emmanuelle", email: "", telephone: "", niveau: "Actif", jour: "Vendredi", heure: "11h00" },
  { nom: "Ngondara", prenom: "Michel", email: "", telephone: "", niveau: "Actif", jour: "Vendredi", heure: "14h00" },
  { nom: "Beurdeley", prenom: "Mick", email: "", telephone: "", niveau: "Actif", jour: "Vendredi", heure: "15h45" },
  { nom: "Maxence", prenom: "Godard", email: "", telephone: "", niveau: "Actif", jour: "Vendredi", heure: "16h30" },
  { nom: "Pierrat", prenom: "David", email: "", telephone: "", niveau: "Actif", jour: "Vendredi", heure: "17h30" },
  { nom: "Lopez", prenom: "Michel", email: "", telephone: "", niveau: "Actif", jour: "Vendredi", heure: "18h45" },
  { nom: "Saconnet", prenom: "Simon", email: "", telephone: "", niveau: "Actif", jour: "Samedi", heure: "?" }
];

export function importElevesToLocalStorage() {
  const eleves = elevesList.map((e, i) => ({
    id: Date.now() + i,
    ...e,
    seances: []
  }));
  
  localStorage.setItem('eleves', JSON.stringify(eleves));
  console.log(`✅ ${eleves.length} élèves importés!`);
  return eleves;
}
