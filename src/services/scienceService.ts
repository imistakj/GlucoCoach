/**
 * Science Skill Service for GlucoCoach Qatar
 * Integrates PubChem Chemical Database (PUG REST), Reactome Pathways,
 * and Biochemical Carbohydrate/Sugar Modeling according to Google DeepMind Science guidelines.
 */

export interface PubChemCompound {
  cid: number;
  title: string;
  iupacName: string;
  molecularFormula: string;
  molecularWeight: number;
  canonicalSmiles: string;
  inchikey?: string;
  xLogP?: number;
  hBondDonorCount?: number;
  hBondAcceptorCount?: number;
  tpsa?: number;
}

export interface SugarBiochemistry {
  compound: PubChemCompound;
  glycemicIndex: number;
  metabolicFate: {
    en: string;
    ar: string;
  };
  reactomePathway: {
    id: string;
    name: string;
    url: string;
  };
  pubchemUrl: string;
}

// Ground truth PubChem chemical reference database for common nutritional sugars
export const KNOWN_SUGAR_COMPOUNDS: Record<string, SugarBiochemistry> = {
  sucrose: {
    compound: {
      cid: 5988,
      title: 'Sucrose (Table Sugar / White Sugar)',
      iupacName: '(2R,3R,4S,5S,6R)-2-[(2S,3S,4S,5R)-3,4-dihydroxy-2,5-bis(hydroxymethyl)oxolan-2-yl]oxy-6-(hydroxymethyl)oxane-3,4,5-triol',
      molecularFormula: 'C12H22O11',
      molecularWeight: 342.3,
      canonicalSmiles: 'C(C1C(C(C(C(O1)OC2(C(C(C(O2)CO)O)O)CO)O)O)O)O',
      inchikey: 'CZMRCDWAGMRECN-UGDNZRGBSA-N',
      hBondDonorCount: 8,
      hBondAcceptorCount: 11,
      tpsa: 189,
    },
    glycemicIndex: 65,
    metabolicFate: {
      en: 'Hydrolyzed by intestinal sucrase into 50% D-glucose and 50% D-fructose. Triggers rapid insulin release via pancreatic beta cells.',
      ar: 'يتحلل بفعل إنزيم السكريز المعوي إلى 50% جلوكوز و50% فركتوز. يحفز إفرازاً سريعاً للإنسولين من خلايا بيتا في البنكرياس.',
    },
    reactomePathway: {
      id: 'R-HSA-70326',
      name: 'Glucose and Fructose Metabolism',
      url: 'https://reactome.org/content/detail/R-HSA-70326',
    },
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5988',
  },
  glucose: {
    compound: {
      cid: 5793,
      title: 'D-Glucose (Dextrose / Blood Sugar)',
      iupacName: '(2R,3S,4R,5R)-2,3,4,5,6-pentahydroxyhexanal',
      molecularFormula: 'C6H12O6',
      molecularWeight: 180.16,
      canonicalSmiles: 'C([C@@H]1[C@H]([C@@H]([C@H](C(O1)O)O)O)O)O',
      inchikey: 'WQZGKKKJIJFFOK-GASJEMHNSA-N',
      hBondDonorCount: 5,
      hBondAcceptorCount: 6,
      tpsa: 110,
    },
    glycemicIndex: 100,
    metabolicFate: {
      en: 'Direct reference standard (GI=100). Rapidly transported into systemic circulation via SGLT1 and GLUT2, driving acute glycemic response.',
      ar: 'المعيار المرجعي للمؤشر الجلايسيمي (100). يمتص فوراً إلى الدورة الدموية عبر ناقلات SGLT1 وGLUT2 مسبباً طفرة حادة في السكر.',
    },
    reactomePathway: {
      id: 'R-HSA-70326',
      name: 'Glucose Transport & Glycolysis',
      url: 'https://reactome.org/content/detail/R-HSA-70326',
    },
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5793',
  },
  fructose: {
    compound: {
      cid: 5984,
      title: 'D-Fructose (Fruit Sugar / Corn Syrup Constituent)',
      iupacName: '(3S,4R,5R)-1,3,4,5,6-pentahydroxyhexan-2-one',
      molecularFormula: 'C6H12O6',
      molecularWeight: 180.16,
      canonicalSmiles: 'C([C@@H]1[C@H]([C@@H](C(O1)(CO)O)O)O)O',
      inchikey: 'BJHIKXHVCXSTTG-UYFOZJQFSA-N',
      hBondDonorCount: 5,
      hBondAcceptorCount: 6,
      tpsa: 110,
    },
    glycemicIndex: 23,
    metabolicFate: {
      en: 'Transported by GLUT5 directly to the liver. Bypasses phosphofructokinase (PFK) regulation, rapidly driving hepatic de novo lipogenesis (fatty liver risk) and visceral adiposity despite low immediate blood glucose spike.',
      ar: 'ينتقل عبر ناقل GLUT5 مباشرة إلى الكبد متجاوزاً تنظيم الإنزيم الحاكم، مما يحفز تصنيع الدهون الكبدية وتراكم دهون البطن رغم عدم رفعه السريع للجلوكوز الفوري.',
    },
    reactomePathway: {
      id: 'R-HSA-5653656',
      name: 'Fructose Catabolism in Liver',
      url: 'https://reactome.org/content/detail/R-HSA-5653656',
    },
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5984',
  },
};

/**
 * Fetch live compound physical and chemical properties directly from PubChem PUG REST API
 * (CORS-enabled, as specified in Google DeepMind Science skills)
 */
export async function fetchPubChemCompoundByCID(cid: number): Promise<PubChemCompound | null> {
  try {
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/Title,IUPACName,MolecularFormula,MolecularWeight,CanonicalSMILES,InChIKey,XLogP,TPSA,HBondDonorCount,HBondAcceptorCount/JSON`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const props = data.PropertyTable?.Properties?.[0];
    if (!props) return null;

    return {
      cid,
      title: props.Title || `CID ${cid}`,
      iupacName: props.IUPACName || '',
      molecularFormula: props.MolecularFormula || '',
      molecularWeight: props.MolecularWeight || 0,
      canonicalSmiles: props.CanonicalSMILES || '',
      inchikey: props.InChIKey,
      xLogP: props.XLogP,
      tpsa: props.TPSA,
      hBondDonorCount: props.HBondDonorCount,
      hBondAcceptorCount: props.HBondAcceptorCount,
    };
  } catch (error) {
    console.warn('PubChem fetch failed, using internal scientific reference:', error);
    return null;
  }
}

/**
 * Computes scientific sugar metrics:
 * - Teaspoon equivalents (1 tsp = ~4.2g)
 * - Sugar cubes (1 cube = ~4.0g)
 * - Moles of sucrose / glucose
 * - Glycemic Load (GL = GI * available_carbs / 100)
 */
export function calculateSugarScienceMetrics(sugarGrams: number, carbsGrams: number, estimatedGI = 65) {
  const teaspoons = Number((sugarGrams / 4.2).toFixed(1));
  const sugarCubes = Number((sugarGrams / 4.0).toFixed(1));
  // Average molar mass of sugars ~250 g/mol
  const millimoles = Number(((sugarGrams / 342.3) * 1000).toFixed(1));
  const glycemicLoad = Number(((estimatedGI * Math.max(sugarGrams, carbsGrams)) / 100).toFixed(1));

  let glCategory: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (glycemicLoad > 19) glCategory = 'HIGH';
  else if (glycemicLoad >= 11) glCategory = 'MEDIUM';

  return {
    sugarGrams,
    teaspoons,
    sugarCubes,
    millimoles,
    glycemicLoad,
    glCategory,
  };
}
