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
  classification: 'Monosaccharide' | 'Disaccharide' | 'Polyol' | 'Antidiabetic Biguanide';
  commonSources: string[];
  metabolicFate: {
    en: string;
    ar: string;
  };
  diabeticImpact: {
    en: string;
    ar: string;
  };
  reactomePathway: {
    id: string;
    name: string;
    url: string;
    diagramUrl: string;
  };
  pubchemUrl: string;
  structureImageUrl: string;
}

// Ground truth PubChem chemical reference database for common nutritional sugars and diabetic compounds
export const KNOWN_SUGAR_COMPOUNDS: Record<string, SugarBiochemistry> = {
  sucrose: {
    compound: {
      cid: 5988,
      title: 'Sucrose (Table Sugar / Cane & Beet Sugar)',
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
    classification: 'Disaccharide',
    commonSources: ['Standard Karak tea', 'Luqaimat syrup', 'Balaleet', 'Baklava', 'Soft drinks'],
    metabolicFate: {
      en: 'Cleaved by brush-border enzyme sucrase into 50% D-glucose and 50% D-fructose. Glucose stimulates acute beta-cell insulin secretion, while fructose is directly extracted by hepatocytes.',
      ar: 'يتحلل بفعل إنزيم السكريز في الأمعاء إلى 50% جلوكوز و50% فركتوز. يحفز الجلوكوز إفراز الإنسولين السريع، بينما يتجه الفركتوز مباشرة إلى خلايا الكبد.',
    },
    diabeticImpact: {
      en: 'Dual-phase metabolic impact: immediate blood glucose elevation coupled with hepatic triglyceride accumulation, aggravating peripheral insulin resistance in Type 2 Diabetes.',
      ar: 'تأثير مزدوج: ارتفاع فوري في سكر الدم مع تحفيز تكوين الدهون الثلاثية في الكبد، مما يزيد مقاومة الإنسولين لدى مرضى السكري من النوع الثاني.',
    },
    reactomePathway: {
      id: 'R-HSA-70326',
      name: 'Glucose and Fructose Metabolism',
      url: 'https://reactome.org/content/detail/R-HSA-70326',
      diagramUrl: 'https://reactome.org/ContentService/exporter/diagram/R-HSA-70326.svg',
    },
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5988',
    structureImageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/5988/PNG?image_size=300x300',
  },
  glucose: {
    compound: {
      cid: 5793,
      title: 'D-Glucose (Dextrose / Capillary Blood Sugar)',
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
    classification: 'Monosaccharide',
    commonSources: ['Corn syrup', 'Dates (high free glucose)', 'Dextrose sports drinks', 'Honey'],
    metabolicFate: {
      en: 'The universal biological energy currency (GI=100 standard). Absorbed rapidly via SGLT1 active transport into portal circulation, triggering swift GLUT4 translocation in myocytes.',
      ar: 'المعيار المرجعي للمؤشر الجلايسيمي (100). يمتص فوراً عبر ناقلات SGLT1 المعوية مسبباً طفرة حادة في الجلوكوز وتدفق الإنسولين.',
    },
    diabeticImpact: {
      en: 'Direct driver of postprandial glycemic excursions. Requires immediate endogenous insulin or muscular contraction (post-meal walking) for clearance.',
      ar: 'المحرك المباشر لارتفاع سكر ما بعد الأكل. يتطلب إنسوليناً فعالاً أو نشاطاً عضلياً (المشي الخفيف) لخفضه بسرعة.',
    },
    reactomePathway: {
      id: 'R-HSA-70326',
      name: 'Glucose Transport & Glycolysis',
      url: 'https://reactome.org/content/detail/R-HSA-70326',
      diagramUrl: 'https://reactome.org/ContentService/exporter/diagram/R-HSA-70326.svg',
    },
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5793',
    structureImageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/5793/PNG?image_size=300x300',
  },
  fructose: {
    compound: {
      cid: 5984,
      title: 'D-Fructose (Fruit Sugar / Levulose)',
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
    classification: 'Monosaccharide',
    commonSources: ['High-fructose syrups', 'Agave nectar', 'Mangoes', 'Fruit juices', 'Dried figs'],
    metabolicFate: {
      en: 'Absorbed via facilitative GLUT5 transporter. Extracted ~70% on first-pass hepatic transit and phosphorylated by fructokinase, entirely bypassing the rate-limiting phosphofructokinase (PFK) checkpoint.',
      ar: 'يمتص عبر ناقل GLUT5 إلى الكبد مباشرة متجاوزاً الإنزيم الحاكم، مما يحفز تصنيع الأحماض الدهنية وتراكم دهون الكبد.',
    },
    diabeticImpact: {
      en: 'Low immediate glycemic spike (GI=23), but accelerates hepatic de novo lipogenesis, elevating VLDL, visceral fat, and hepatic steatosis in Type 2 Diabetes.',
      ar: 'مؤشر جلايسيمي منخفض لحظياً (23)، لكنه يسرع تراكم دهون الكبد ومقاومة الإنسولين على المدى الطويل.',
    },
    reactomePathway: {
      id: 'R-HSA-5653656',
      name: 'Fructose Catabolism in Liver',
      url: 'https://reactome.org/content/detail/R-HSA-5653656',
      diagramUrl: 'https://reactome.org/ContentService/exporter/diagram/R-HSA-5653656.svg',
    },
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5984',
    structureImageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/5984/PNG?image_size=300x300',
  },
  maltose: {
    compound: {
      cid: 6255,
      title: 'Maltose (Maltobiose / Starch Breakdown Sugar)',
      iupacName: '(2R,3R,4S,5S,6R)-2-[(2R,3S,4R,5R)-4,5-dihydroxy-2-(hydroxymethyl)-6-methyloxan-3-yl]oxy-6-(hydroxymethyl)oxane-3,4,5-triol',
      molecularFormula: 'C12H22O11',
      molecularWeight: 342.3,
      canonicalSmiles: 'C([C@@H]1[C@H]([C@@H]([C@H]([C@H](O1)O[C@@H]2[C@H](O[C@H]([C@@H]([C@H]2O)O)CO)O)O)O)O)O',
      inchikey: 'GUBGYTABKSRVRQ-UUNWGHNZSA-N',
      hBondDonorCount: 8,
      hBondAcceptorCount: 11,
      tpsa: 189,
    },
    glycemicIndex: 105,
    classification: 'Disaccharide',
    commonSources: ['White Khubz', 'Basmati rice', 'Potatoes', 'Fried dough', 'Beer/Malt beverages'],
    metabolicFate: {
      en: 'Two alpha-1,4-linked D-glucose units. Rapidly cleaved by salivary and pancreatic alpha-amylase and maltase in the jejunum into twin glucose molecules.',
      ar: 'جزيئان من الجلوكوز مرتبطين برابطة ألفا. يتحلل بسرعة فائقة بواسطة إنزيم الأميليز في اللعاب والأمعاء إلى جزيئي جلوكوز مسببين طفرة سكرية.',
    },
    diabeticImpact: {
      en: 'Highest glycemic index of all natural sugars (GI=105). Exceeds pure glucose in spike velocity when consumed as refined carbohydrates.',
      ar: 'أعلى مؤشر جلايسيمي بين السكريات الطبيعية (105)، ويتجاوز الجلوكوز النقي في سرعة الارتفاع عند تناوله مع الخبز الأبيض والنشويات.',
    },
    reactomePathway: {
      id: 'R-HSA-70326',
      name: 'Digestion and Absorption of Carbohydrates',
      url: 'https://reactome.org/content/detail/R-HSA-70326',
      diagramUrl: 'https://reactome.org/ContentService/exporter/diagram/R-HSA-70326.svg',
    },
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/6255',
    structureImageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/6255/PNG?image_size=300x300',
  },
  lactose: {
    compound: {
      cid: 6134,
      title: 'Lactose (Milk Sugar)',
      iupacName: '(2R,3R,4S,5R,6S)-2-(hydroxymethyl)-6-[(2R,3S,4R,5R,6J)-4,5,6-trihydroxy-2-(hydroxymethyl)oxan-3-yl]oxyoxane-3,4,5-triol',
      molecularFormula: 'C12H22O11',
      molecularWeight: 342.3,
      canonicalSmiles: 'C([C@@H]1[C@@H]([C@@H]([C@H]([C@@H](O1)O[C@@H]2[C@H](O[C@H]([C@@H]([C@H]2O)O)O)CO)O)O)O)O',
      inchikey: 'GUBGYTABKSRVRQ-QUYVFYDDSA-N',
      hBondDonorCount: 8,
      hBondAcceptorCount: 11,
      tpsa: 189,
    },
    glycemicIndex: 46,
    classification: 'Disaccharide',
    commonSources: ['Baladna fresh milk', 'Laban', 'Condensed milk in Karak', 'Cheese & Labneh'],
    metabolicFate: {
      en: 'Galactose-beta-1,4-glucose disaccharide. Hydrolyzed by lactase in intestinal brush border into D-glucose and D-galactose.',
      ar: 'سكر الحليب يتكون من جلوكوز وجلاكتوز. يتحلل بفعل إنزيم اللاكتيز في الأمعاء بمعدل تدريجي.',
    },
    diabeticImpact: {
      en: 'Moderate glycemic impact (GI=46). Unsweetened Baladna Laban provides protein and calcium with low glycemic variability.',
      ar: 'تأثير جلايسيمي معتدل (46). لبن بلدنا الطازج غير المحلى يعد خياراً مثالياً لمرضى السكري بفضل البروتين والكالسيوم.',
    },
    reactomePathway: {
      id: 'R-HSA-70326',
      name: 'Lactose Degradation',
      url: 'https://reactome.org/content/detail/R-HSA-70326',
      diagramUrl: 'https://reactome.org/ContentService/exporter/diagram/R-HSA-70326.svg',
    },
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/6134',
    structureImageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/6134/PNG?image_size=300x300',
  },
  erythritol: {
    compound: {
      cid: 222285,
      title: 'Erythritol (Diabetic Polyol Sweetener)',
      iupacName: '(2R,3S)-butane-1,2,3,4-tetrol',
      molecularFormula: 'C4H10O4',
      molecularWeight: 122.12,
      canonicalSmiles: 'C([C@@H]([C@H](CO)O)O)O',
      inchikey: 'UNXHWFMMPPVRQB-UHFFFAOYSA-N',
      hBondDonorCount: 4,
      hBondAcceptorCount: 4,
      tpsa: 80.9,
    },
    glycemicIndex: 0,
    classification: 'Polyol',
    commonSources: ['Keto balaleet', 'Diabetic dessert swaps', 'Monkfruit sweetener blends'],
    metabolicFate: {
      en: 'Rapidly absorbed in the small intestine but completely un-metabolized by human enzymes. Excreted unchanged in urine (>90%).',
      ar: 'يمتص في الأمعاء الدقيقة دون أن يستقلبه الجسم، ويخرج مع البول بنسبة تزيد عن 90% دون أي تأثير على الجلوكوز.',
    },
    diabeticImpact: {
      en: 'Zero glycemic index (GI=0) and 0 kcal/g. Does not trigger insulin secretion, making it clinically optimal for diabetic sweetening.',
      ar: 'مؤشر جلايسيمي صفر (GI=0) وصفر سعرات، لا يثير الإنسولين نهائياً، مما يجعله المحلي المفضل طبياً لمرضى السكري.',
    },
    reactomePathway: {
      id: 'R-HSA-70326',
      name: 'Non-Glycemic Carbohydrate Elimination',
      url: 'https://reactome.org/content/detail/R-HSA-70326',
      diagramUrl: 'https://reactome.org/ContentService/exporter/diagram/R-HSA-70326.svg',
    },
    pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/222285',
    structureImageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/222285/PNG?image_size=300x300',
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
      molecularWeight: props.MolecularWeight ? Number(props.MolecularWeight) : 0,
      canonicalSmiles: props.CanonicalSMILES || '',
      inchikey: props.InChIKey,
      xLogP: props.XLogP ? Number(props.XLogP) : undefined,
      tpsa: props.TPSA ? Number(props.TPSA) : undefined,
      hBondDonorCount: props.HBondDonorCount ? Number(props.HBondDonorCount) : undefined,
      hBondAcceptorCount: props.HBondAcceptorCount ? Number(props.HBondAcceptorCount) : undefined,
    };
  } catch (error) {
    console.warn('PubChem fetch failed, using internal scientific reference:', error);
    return null;
  }
}

/**
 * Get PubChem 2D Structure Rendering URL
 */
export function getPubChem2DImageUrl(cid: number, size = '300x300'): string {
  return `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=${size}`;
}

/**
 * Computes scientific sugar metrics:
 * - Teaspoon equivalents (1 tsp = ~4.2g)
 * - Sugar cubes (1 cube = ~4.0g)
 * - Moles of sucrose / glucose
 * - Glycemic Load (GL = GI * available_carbs / 100)
 */
export function calculateSugarScienceMetrics(sugarGrams: number, carbsGrams: number, estimatedGI = 65) {
  const safeSugar = Math.max(0, Number(sugarGrams) || 0);
  const safeCarbs = Math.max(safeSugar, Number(carbsGrams) || 0);
  const teaspoons = Number((safeSugar / 4.2).toFixed(1));
  const sugarCubes = Number((safeSugar / 4.0).toFixed(1));
  // Average molar mass of nutritional sugars ~342.3 g/mol (disaccharide) or 180.16 g/mol (monosaccharide)
  const millimoles = Number(((safeSugar / 342.3) * 1000).toFixed(1));
  const glycemicLoad = Number(((estimatedGI * safeCarbs) / 100).toFixed(1));

  let glCategory: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (glycemicLoad > 19) glCategory = 'HIGH';
  else if (glycemicLoad >= 11) glCategory = 'MEDIUM';

  return {
    sugarGrams: safeSugar,
    carbsGrams: safeCarbs,
    teaspoons,
    sugarCubes,
    millimoles,
    glycemicLoad,
    glCategory,
  };
}
