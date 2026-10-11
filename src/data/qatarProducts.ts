import { FoodProduct } from '../types';

export const QATAR_SUPERMARKET_PRODUCTS: FoodProduct[] = [
  {
    id: 'prod-baladna-strawberry-yogurt',
    barcode: '6291001234567',
    name: {
      en: 'Baladna Full Cream Strawberry Flavored Yogurt (170g)',
      ar: 'زبادي كامل الدسم بنكهة الفراولة من بلدنا (170غ)',
    },
    brand: 'Baladna (قطر)',
    category: 'Dairy & Yogurts',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80',
    servingSize: '1 tub (170g)',
    nutrition: {
      calories: 168,
      carbs: 24.5,
      addedSugars: 17.5,
      refinedStarches: 0,
      fiber: 0.2,
      protein: 5.2,
      fats: 5.4,
      saturatedFats: 3.5,
      sodium: 78,
    },
    upfLevel: 4, // Ultra-processed (added sugars, modified starch, color, flavoring)
    trafficLight: 'HIGH',
    spikeVelocity: 'Rapid',
    glucoseImpactReason: {
      en: 'Contains 17.5g of added free sugars (equivalent to 4.5 teaspoons). Rapid absorption liquid-phase sugar causes an immediate insulin spike.',
      ar: 'يحتوي على 17.5 غرام من السكر الحر المضاف (ما يعادل 4.5 ملاعق صغيرة). سكر سريع الامتصاص يؤدي إلى طفرة حادة في هرمون الإنسولين.',
    },
    foodSafety: {
      productionDate: '2026-10-06',
      expiryDate: '2026-10-18',
      daysRemaining: 8,
      storageInstructions: {
        en: 'Keep refrigerated between 2°C and 4°C. Consume within 24 hours after opening.',
        ar: 'يحفظ مبرداً بين 2 إلى 4 درجات مئوية. يستهلك خلال 24 ساعة بعد الفتح.',
      },
      useByAdvisory: {
        en: 'Product is fully fresh with 8 days remaining. Safe to consume when kept continuously chilled in home refrigerator.',
        ar: 'المنتج طازج تماماً ومتبقي 8 أيام على الصلاحية. آمن للاستهلاك عند حفظه مبرداً في الثلاجة المنزلية.',
      },
      isPastExpiry: false,
    },
    qatarSwaps: [
      {
        name: {
          en: 'Baladna Plain Greek Laban / Greek Style Yogurt + Fresh Berries',
          ar: 'زبادي بلدنا يوناني سادة طبيعي + حفنة توت طازج',
        },
        whyBetter: {
          en: 'Zero added sugar, 3x higher protein (14g) which slows gastric emptying and stabilizes glucose.',
          ar: 'خالٍ تماماً من السكر المضاف، وثلاثة أضعاف البروتين (14غ) مما يبطئ امتصاص الجلوكوز ويمنع الطفرات.',
        },
        supermarketFound: 'Al Meera, Lulu, Monoprix, Carrefour',
        sugarReduction: '-17.5g Added Sugar',
      },
      {
        name: {
          en: 'Baladna Fresh Laban Ayran (Salted/Unsweetened)',
          ar: 'لبن عيران بلدنا الطازج (مملح خفيف بدون سكر)',
        },
        whyBetter: {
          en: 'Natural fermented hydration with live probiotics, 0g added sugar.',
          ar: 'مشروب مخمر طبيعي يحتوي على بكتيريا نافعة، بدون أي سكر مضاف.',
        },
        supermarketFound: 'All Qatar Supermarkets & Baqalas',
        sugarReduction: '-17.5g Added Sugar',
      },
    ],
    summaryTip: {
      en: 'Dessert-style yogurts are one of the biggest hidden sugar traps in GCC supermarkets. Swap to plain laban with a sprinkle of Ceylon cinnamon.',
      ar: 'تعد ألبان الفواكه المحلاة من أكبر مصائد السكر الخفي في أسواق الخليج. استبدلها بلبن سادة مع رشة قرفة سيلانية.',
    },
  },
  {
    id: 'prod-almarai-mango-nectar',
    barcode: '6281007123991',
    name: {
      en: 'Almarai Mango Nectar Juice Drink (1 Liter)',
      ar: 'شراب نكتار المانجو من المراعي (1 لتر)',
    },
    brand: 'Almarai',
    category: 'Beverages & Juices',
    imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=400&q=80',
    servingSize: '1 glass (250ml)',
    nutrition: {
      calories: 140,
      carbs: 34.0,
      addedSugars: 28.0,
      refinedStarches: 0,
      fiber: 0.3,
      protein: 0.4,
      fats: 0.1,
      saturatedFats: 0,
      sodium: 15,
    },
    upfLevel: 4,
    trafficLight: 'HIGH',
    spikeVelocity: 'Rapid',
    glucoseImpactReason: {
      en: 'Extremely high sugar concentration (28g free fructose & sucrose per glass). Lack of intact plant fiber causes blood glucose to surge within 15 minutes.',
      ar: 'تركيز سكر مرتفع جداً (28 غرام سكر مضاف لكل كوب). غياب الألياف يجعل سكر الدم يقفز خلال 15 دقيقة فقط.',
    },
    foodSafety: {
      productionDate: '2026-08-15',
      expiryDate: '2027-02-15',
      daysRemaining: 125,
      storageInstructions: {
        en: 'Store unopened in a cool dry place below 25°C. Once opened, keep refrigerated and consume within 3 days.',
        ar: 'يحفظ في مكان جاف وبارد تحت 25 مئوية. بعد الفتح يحفظ بالثلاجة ويستهلك خلال 3 أيام.',
      },
      useByAdvisory: {
        en: 'Long shelf-life UHT pasteurized product. Safe if sealed; refrigerate immediately after breaking seal.',
        ar: 'منتج معقم طويل الأجل. آمن طالما العبوة مغلقة؛ يجب تبريده فور فتح الغطاء.',
      },
      isPastExpiry: false,
    },
    qatarSwaps: [
      {
        name: {
          en: 'Sparkling Water infused with Fresh Mint & Lime (Al Rayyan / Perrier)',
          ar: 'مياه غازية مع نعناع طازج وشريحة ليمون (مياه الريان)',
        },
        whyBetter: {
          en: '100% sugar-free, provides refreshing fizz with zero insulin impact.',
          ar: 'خالية تماماً من السكر، منعشة جداً بدون أي رفع لمستوى الإنسولين.',
        },
        supermarketFound: 'Everywhere in Qatar',
        sugarReduction: '-28g Added Sugar',
      },
      {
        name: {
          en: 'Whole fresh mango slice (50g) paired with a handful of raw almonds',
          ar: 'شريحة مانجو طازجة كاملة (50غ) مع حفنة لوز نيء',
        },
        whyBetter: {
          en: 'Provides natural cellular fiber plus healthy nut fats to blunt glycemic peak.',
          ar: 'تحتفظ بالألياف الطبيعية مع دهون اللوز الصحية التي تبطئ امتصاص السكر.',
        },
        supermarketFound: 'Lulu, Al Meera Produce Section',
        sugarReduction: '-22g Added Sugar',
      },
    ],
    summaryTip: {
      en: 'Liquid sugars are directly absorbed through the stomach lining without chewing satiety cues. Choose infused water or unsweetened cold hibiscus.',
      ar: 'السكريات السائلة تمتص فوراً دون أي إشارات شبع للمخ. اختر الماء المنكه بشرائح الليمون أو الكركديه البارد غير المحلى.',
    },
  },
  {
    id: 'prod-lulu-white-khubz',
    barcode: '6297000112233',
    name: {
      en: 'Lulu Fresh White Arabic Bread / Khubz (Pack of 5)',
      ar: 'خبز عربي أبيض طازج من مخابز اللولو (كيس 5 أرغفة)',
    },
    brand: 'Lulu Bakeries',
    category: 'Bakery & Bread',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
    servingSize: '1 loaf (80g)',
    nutrition: {
      calories: 215,
      carbs: 45.0,
      addedSugars: 1.5,
      refinedStarches: 43.5,
      fiber: 1.6,
      protein: 6.8,
      fats: 1.0,
      saturatedFats: 0.2,
      sodium: 380,
    },
    upfLevel: 3,
    trafficLight: 'HIGH',
    spikeVelocity: 'Rapid',
    glucoseImpactReason: {
      en: 'High glycemic index (~75) refined white flour with stripped germ and bran. Converts into blood glucose almost as fast as pure table sugar.',
      ar: 'دقيق أبيض مكرر منزوع الردة ذو مؤشر جلايسيمي مرتفع (~75). يتحول في الدم إلى جلوكوز بسرعة تماثل السكر المباشر.',
    },
    foodSafety: {
      productionDate: '2026-10-10',
      expiryDate: '2026-10-13',
      daysRemaining: 2,
      storageInstructions: {
        en: 'Store at room temperature in a dry place. Freeze remaining bread before day 3 to prevent mold growth.',
        ar: 'يحفظ في درجة حرارة الغرفة بمكان جاف. يمكن تجميد الأرغفة المتبقية قبل اليوم الثالث لمنع العفن.',
      },
      useByAdvisory: {
        en: 'Use-By Awareness: 2 days of peak freshness left. Guardrail note: Short shelf-life is natural for preservative-free bread, not a defect.',
        ar: 'تنبيه الصلاحية: متبقي يومان على ذروة الطراوة. تنبيه أمان: قصر الصلاحية طبيعي للخبز الخالي من المواد الحافظة.',
      },
      isPastExpiry: false,
    },
    qatarSwaps: [
      {
        name: {
          en: 'Al Meera 100% Wholewheat Khubz / Brown Regag Bread',
          ar: 'خبز قمح كامل 100% من الميرة أو خبز رقاق أسمر',
        },
        whyBetter: {
          en: 'Retains natural bran fiber (4.8g per loaf) with lower glycemic index and sustained energy.',
          ar: 'يحتفظ بألياف النخالة الكاملة (4.8غ لكل رغيف) مع مؤشر جلايسيمي منخفض وشبع أطول.',
        },
        supermarketFound: 'Al Meera, Carrefour Qatar',
        sugarReduction: '-20g Refined Carbs Impact',
      },
      {
        name: {
          en: 'Al Baker Multigrain High-Fiber Tortilla / Flaxseed Flatbread',
          ar: 'خبز التورتيلا بالحبوب الكاملة وبذور الكتان من المطاحن',
        },
        whyBetter: {
          en: 'Added flaxseed and seeds reduce net digestible carbs by 40%.',
          ar: 'بذور الكتان والحبوب تقلل صافي الكربوهيدرات القابلة للهضم بنسبة 40%.',
        },
        supermarketFound: 'Lulu, Monoprix, Mega Mart',
        sugarReduction: '-18g Refined Carbs',
      },
    ],
    summaryTip: {
      en: 'Always pair your flatbread with healthy fats or proteins (like tahini, halloumi, or grilled eggs) to slow down carbohydrate digestion.',
      ar: 'احرص دائماً على تناول الخبز مع مصدر بروتين أو دهون صحية (مثل الطحينة أو الحلوم أو البيض) لإبطاء هضم النشويات.',
    },
  },
  {
    id: 'prod-almeera-wholewheat-bread',
    barcode: '6298889991112',
    name: {
      en: 'Al Meera 100% Stoneground Wholewheat Arabic Bread',
      ar: 'خبز عربي بالقمح الكامل 100% من مخابز الميرة',
    },
    brand: 'Al Meera (الميرة)',
    category: 'Bakery & Bread',
    imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=400&q=80',
    servingSize: '1 medium loaf (70g)',
    nutrition: {
      calories: 175,
      carbs: 32.0,
      addedSugars: 0.5,
      refinedStarches: 0,
      fiber: 5.5,
      protein: 8.2,
      fats: 1.5,
      saturatedFats: 0.3,
      sodium: 290,
    },
    upfLevel: 2,
    trafficLight: 'LOW',
    spikeVelocity: 'Slow',
    glucoseImpactReason: {
      en: 'Excellent dietary fiber content (5.5g per loaf) and zero refined starches. Digested slowly, providing steady glucose release.',
      ar: 'محتوى ممتاز من الألياف الغذائية (5.5 غرام لكل رغيف) وخالٍ من الدقيق الأبيض المكرر. يمتص ببطء واستقرار.',
    },
    foodSafety: {
      productionDate: '2026-10-10',
      expiryDate: '2026-10-14',
      daysRemaining: 4,
      storageInstructions: {
        en: 'Store in breadbox or airtight bag. Can be sliced and frozen for up to 3 months.',
        ar: 'يحفظ في كيس محكم أو صندوق الخبز. يمكن تجميده في الفريزر حتى 3 أشهر.',
      },
      useByAdvisory: {
        en: 'Freshly baked today. Ideal for diabetic meal planning.',
        ar: 'مخبوز طازجاً اليوم. خيار مثالي للوقاية وإدارة السكري.',
      },
      isPastExpiry: false,
    },
    qatarSwaps: [],
    summaryTip: {
      en: 'Great choice! One loaf fits your lunch or breakfast carb target comfortably.',
      ar: 'اختيار ممتاز ومثالي! رغيف واحد يناسب ميزانية كربوهيدرات وجبة الغداء أو الإفطار.',
    },
  },
  {
    id: 'prod-rainbow-karak-condensed',
    barcode: '8712800114422',
    name: {
      en: 'Rainbow Sweetened Condensed Milk for Karak (397g)',
      ar: 'حليب مكثف محلى لصنع الكرك من رينبو (397غ)',
    },
    brand: 'Rainbow',
    category: 'Canned Goods & Dairy',
    imageUrl: 'https://images.unsplash.com/photo-1579954115563-e72bf1381629?auto=format&fit=crop&w=400&q=80',
    servingSize: '2 tbsp (30g per cup of tea)',
    nutrition: {
      calories: 130,
      carbs: 22.0,
      addedSugars: 19.5,
      refinedStarches: 0,
      fiber: 0,
      protein: 3.1,
      fats: 3.2,
      saturatedFats: 2.1,
      sodium: 40,
    },
    upfLevel: 4,
    trafficLight: 'HIGH',
    spikeVelocity: 'Rapid',
    glucoseImpactReason: {
      en: 'Massive concentration of refined sucrose (19.5g added sugar in just 2 tablespoons). Frequent Karak intake is a primary driver of pre-diabetes in the Gulf region.',
      ar: 'تركيز هائل من السكر المكرر (19.5 غرام سكر في ملعقتين فقط). شرب الكرك المحلى يومياً أحد أكبر مسببات ما قبل السكري في الخليج.',
    },
    foodSafety: {
      productionDate: '2026-03-01',
      expiryDate: '2027-09-01',
      daysRemaining: 320,
      storageInstructions: {
        en: 'Store unopened in pantry. Once opened, transfer to glass container, refrigerate and use within 5 days.',
        ar: 'يحفظ غير مفتوح في خزانة المطبخ. بعد الفتح ينقل لوعاء زجاجي ويحفظ بالثلاجة لمدة 5 أيام.',
      },
      useByAdvisory: {
        en: 'Long shelf-life hermetically sealed can. Safe if can is undamaged.',
        ar: 'صلاحية طويلة للعلبة المغلقة بإحكام. آمن تماماً طالما العلبة غير منتفخة.',
      },
      isPastExpiry: false,
    },
    qatarSwaps: [
      {
        name: {
          en: 'Rainbow Original Evaporated Milk (Unsweetened) + Crushed Cardamom & Saffron',
          ar: 'حليب مبخر غير محلى (رينبو الأصلي أبو قوس) مع هيل مطحون وزعفران',
        },
        whyBetter: {
          en: 'Gives the rich authentic Karak texture without a single gram of added sugar.',
          ar: 'يعطيك قوام ونكهة الكرك الأصلية الغنية بدون غرام واحد من السكر المضاف.',
        },
        supermarketFound: 'All Qatar Supermarkets',
        sugarReduction: '-19.5g Added Sugar',
      },
      {
        name: {
          en: 'Baladna Fresh Low-Fat Milk + Cinnamon stick infusion',
          ar: 'حليب بلدنا قليل الدسم طازج مغلي مع عود قرفة وهيل',
        },
        whyBetter: {
          en: 'Ceylon cinnamon naturally supports insulin sensitivity and adds warm sweetness.',
          ar: 'القرفة تعطي حلاوة دافئة وتساعد طبيعياً في تحسين حساسية الإنسولين.',
        },
        supermarketFound: 'Al Meera, Lulu, Monoprix',
        sugarReduction: '-19.5g Added Sugar',
      },
    ],
    summaryTip: {
      en: 'A daily cup of traditional sweet Karak adds ~7kg of refined sugar per year! Transitioning to unsweetened evaporated milk with extra cardamom makes an enormous health difference.',
      ar: 'كوب كرك محلى يومياً يعادل 7 كغم سكر مكرر سنوياً! التحول لحليب مبخر غير محلى مع زيادة الهيل يحمي شرايينك وجلوكوزك فوراً.',
    },
  },
  {
    id: 'prod-baladna-fresh-laban',
    barcode: '6291009876543',
    name: {
      en: 'Baladna 100% Fresh Pure Laban (1 Liter)',
      ar: 'لبن بلدنا الطازج الصافي 100% (1 لتر)',
    },
    brand: 'Baladna (قطر)',
    category: 'Dairy & Yogurts',
    imageUrl: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=400&q=80',
    servingSize: '1 cup (200ml)',
    nutrition: {
      calories: 98,
      carbs: 8.8,
      addedSugars: 0,
      refinedStarches: 0,
      fiber: 0,
      protein: 6.4,
      fats: 4.2,
      saturatedFats: 2.8,
      sodium: 110,
    },
    upfLevel: 1,
    trafficLight: 'LOW',
    spikeVelocity: 'Slow',
    glucoseImpactReason: {
      en: 'Zero added sugar, contains natural milk sugar (lactose) buffered by fermented dairy proteins and natural fats.',
      ar: 'خالٍ من السكر المضاف، ويحتوي على سكر اللاكتوز الطبيعي المدعوم ببروتينات ودهون اللبن المخمر التي تمنع الارتفاع.',
    },
    foodSafety: {
      productionDate: '2026-10-08',
      expiryDate: '2026-10-18',
      daysRemaining: 7,
      storageInstructions: {
        en: 'Store refrigerated below 4°C at all times. Shake well before drinking.',
        ar: 'يحفظ مبرداً بشكل دائم تحت 4 درجات مئوية. يرج جيداً قبل الشرب.',
      },
      useByAdvisory: {
        en: 'Excellent local Qatari fresh dairy product. Perfectly safe within its 7 remaining days.',
        ar: 'منتج ألبان قطري طازج ممتاز. آمن تماماً خلال فترة الصلاحية المتبقية (7 أيام).',
      },
      isPastExpiry: false,
    },
    qatarSwaps: [],
    summaryTip: {
      en: 'Baladna fresh laban is an outstanding regional choice to pair with meals. Fermented probiotics also support gut microbiome and metabolic balance.',
      ar: 'لبن بلدنا الطازج خيار محلي مثالي مع وجبات الغداء. البكتيريا النافعة تدعم صحة الجهاز الهضمي والتمثيل الغذائي.',
    },
  },
  {
    id: 'prod-mazzraty-chicken-breast',
    barcode: '6292004561234',
    name: {
      en: 'Mazzraty Fresh Qatar Chicken Breast Fillets (500g)',
      ar: 'صدور دجاج طازجة بدون عظم من مزرعتي قطر (500غ)',
    },
    brand: 'Mazzraty (مزرعتي قطر)',
    category: 'Meat & Poultry',
    imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80',
    servingSize: '150g cooked portion',
    nutrition: {
      calories: 165,
      carbs: 0,
      addedSugars: 0,
      refinedStarches: 0,
      fiber: 0,
      protein: 34.0,
      fats: 3.2,
      saturatedFats: 0.9,
      sodium: 74,
    },
    upfLevel: 1,
    trafficLight: 'LOW',
    spikeVelocity: 'Slow',
    glucoseImpactReason: {
      en: 'Zero glycemic impact. High pure lean protein triggers glucagon release and suppresses ghrelin without raising blood glucose.',
      ar: 'أثر جلوكوز منعدم. بروتين نقي عالي الجودة يحفز الشبع ويعزز توازن السكر دون أي رفع لمستوى الجلوكوز.',
    },
    foodSafety: {
      productionDate: '2026-10-09',
      expiryDate: '2026-10-14',
      daysRemaining: 3,
      storageInstructions: {
        en: 'Store chilled between 0°C and 2°C. Cook thoroughly to an internal temperature of 75°C. Freeze if not using within 48h.',
        ar: 'يحفظ مبرداً بين 0 و2 درجة مئوية. يطهى جيداً حتى 75 مئوية. ينصح بالتجميد إذا لم يطهى خلال 48 ساعة.',
      },
      useByAdvisory: {
        en: 'Use-By Awareness: 3 days until expiry. If not preparing tonight or tomorrow, place in freezer immediately.',
        ar: 'تنبيه الاستخدام: متبقي 3 أيام. إذا لم يتم طهيه اليوم أو غداً، ضعه في الفريزر فوراً لحفظ جودته.',
      },
      isPastExpiry: false,
    },
    qatarSwaps: [],
    summaryTip: {
      en: 'Pairing Mazzraty lean chicken with vegetables before eating complex carbs is the most effective meal order strategy for blunting glucose spikes.',
      ar: 'تناول دجاج مزرعتي المشوي مع الخضار قبل البدء بالنشويات المعقدة هي أفضل استراتيجية لتسطيح منحنى سكر الدم.',
    },
  },
  {
    id: 'prod-dandy-icecream-vanilla',
    barcode: '6293005556667',
    name: {
      en: 'Dandy Vanilla Ice Cream Tub (500ml)',
      ar: 'آيس كريم فانيلا عائلي من داندي قطر (500مل)',
    },
    brand: 'Dandy (داندي قطر)',
    category: 'Frozen Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=400&q=80',
    servingSize: '1 scoop (75g)',
    nutrition: {
      calories: 185,
      carbs: 23.0,
      addedSugars: 20.0,
      refinedStarches: 1.0,
      fiber: 0.1,
      protein: 3.0,
      fats: 9.2,
      saturatedFats: 5.8,
      sodium: 52,
    },
    upfLevel: 4,
    trafficLight: 'HIGH',
    spikeVelocity: 'Rapid',
    glucoseImpactReason: {
      en: 'High added sugar combined with saturated fats creates extended metabolic resistance and delayed prolonged glucose elevation.',
      ar: 'الجمع بين السكر المضاف المرتفع والدهون المشبعة يسبب مقاومة إنسولين مؤقتة وارتفاعاً مطولاً في سكر الدم.',
    },
    foodSafety: {
      productionDate: '2026-06-10',
      expiryDate: '2027-06-10',
      daysRemaining: 240,
      storageInstructions: {
        en: 'Keep frozen at -18°C or below. Do not refreeze once thawed.',
        ar: 'يحفظ مجمداً عند -18 مئوية أو أقل. لا تعيد تجميده بعد الذوبان.',
      },
      useByAdvisory: {
        en: 'Safely frozen long shelf-life treat. Keep frozen during transport home from supermarket.',
        ar: 'منتج مجمد طويل الصلاحية. احرص على عدم ذوبانه أثناء نقله من السوبرماركت للمنزل.',
      },
      isPastExpiry: false,
    },
    qatarSwaps: [
      {
        name: {
          en: 'Frozen Baladna Greek Yogurt blended with real frozen strawberries and crushed pistachios',
          ar: 'زبادي بلدنا يوناني مجمد ومخفوق مع فراولة طبيعية وفستق حلبي مفروم',
        },
        whyBetter: {
          en: 'Real creamy ice-cream texture with 80% less sugar and 3x more protein.',
          ar: 'يعطيك قوام الآيس كريم الكريمي مع خفض 80% من السكر وثلاثة أضعاف البروتين.',
        },
        supermarketFound: 'Al Meera, Lulu, Monoprix',
        sugarReduction: '-16g Added Sugar',
      },
    ],
    summaryTip: {
      en: 'If you choose to indulge, have a small portion right after a high-fiber lunch rather than on an empty stomach at midnight.',
      ar: 'إذا أردت تناوله أحياناً، تناوله كحصة صغيرة مباشرة بعد غداء غني بالألياف والبروتين وليس في منتصف الليل على معدة فارغة.',
    },
  },
];
