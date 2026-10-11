import { MealDish } from '../types';

export const QATAR_POPULAR_MEALS: MealDish[] = [
  {
    id: 'meal-machboos-laham',
    name: {
      en: 'Qatari Machboos Laham (Spiced Lamb with Basmati Rice)',
      ar: 'مجبوس لحم قطري تقليدي مع أرز بسمتي بالزعفران واللومي',
    },
    category: 'traditional',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80',
    estimatedCarbsRange: '85 - 110g',
    estimatedSugarsRange: '3 - 6g (natural)',
    spikeRisk: 'HIGH',
    actionableMealFit: {
      en: 'This fits your lunch carb budget if you eat 1 cup of the rice portion (instead of the standard 3 cups served) and double the fresh cucumber-mint yogurt and Rocca salad.',
      ar: 'تناسب هذه الوجبة ميزانيتك لغداء السكري إذا حددت كمية الأرز بكوب واحد (بدلاً من صحن المجبوس الممتلئ) وضاعفت سلطة الروكا والخيار بالزبادي.',
    },
    swaps: [
      {
        original: {
          en: '3 cups of spiced Machboos white basmati rice',
          ar: 'صحن أرز المجبوس الممتلئ (3 أكواب أرز أبيض)',
        },
        recommendedSwap: {
          en: '1 measured cup of rice, prioritized after eating the tender lamb and side salad first',
          ar: 'كوب واحد من الأرز، وتناوله بعد أكل قطعة اللحم الهبر والسلطة الخضراء أولاً',
        },
        healthBenefit: {
          en: 'Reduces glycemic load by 60% and delays post-meal glucose rise by up to 45 minutes.',
          ar: 'يخفض الحمل الجلايسيمي بنسبة 60% ويؤخر قفزة سكر ما بعد الأكل بما يصل إلى 45 دقيقة.',
        },
      },
      {
        original: {
          en: 'Hashwa fried onion & raisin sweet topping',
          ar: 'حشوة البصل المقلي والزبيب المحلى بالسكر',
        },
        recommendedSwap: {
          en: 'Extra Daqoos (fresh garlic & tomato sauce without sugar) and fresh lemon wedge',
          ar: 'دقوس طماطم طازج بالثوم بدون سكر مع عصرة ليمون طازجة',
        },
        healthBenefit: {
          en: 'Eliminates 12g of concentrated dried-fruit fructose.',
          ar: 'يتجنب 12 غراماً من سكر الفركتوز المركز الموجود بالزبيب المقلي.',
        },
      },
    ],
    majlisTips: {
      en: 'At the Majlis or family Friday feast: Spoon a healthy portion of lamb and cucumber salad onto your individual plate first before reaching for the rice mound. It looks generous and honors hospitality while protecting your glucose.',
      ar: 'في مجالس الجمعة والولائم العائلية: ابدأ بوضع قطعة اللحم والسلطة في صحنك أولاً ثم خذ حصة معتدلة من الأرز. هذا يعكس احترام كرم الضيافة ويحمي مستويات سكر دمك تماماً.',
    },
    waiterScript: {
      en: 'Could I please get an extra side of Rocca salad and fresh cucumber yogurt, and serve half the normal rice portion?',
      ar: 'لو سمحت، ممكن صحن سلطة جرجير إضافي وخيار بلبن، ونصف كمية العيش (الأرز) المعتادة من فضلك؟',
    },
    caloriesEstimate: 780,
  },
  {
    id: 'meal-shish-tawook-platter',
    name: {
      en: 'Grilled Shish Tawook Platter (Skewers with Toum & Salad)',
      ar: 'مشاوي شيش طاووق على الفحم مع ثومية وسلطة خضراء',
    },
    category: 'traditional',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80',
    estimatedCarbsRange: '25 - 35g',
    estimatedSugarsRange: '1 - 3g',
    spikeRisk: 'LOW',
    actionableMealFit: {
      en: 'Outstanding choice! Grilled marinated chicken breast is rich in lean protein and healthy spices. Fits your meal targets with zero insulin strain.',
      ar: 'اختيار استثنائي ممتاز! صدور الدجاج المتبلة المشوية على الفحم غنية بالبروتين الصافي ولا تجهد البنكرياس مطلقاً.',
    },
    swaps: [
      {
        original: {
          en: 'Deep-fried french fries basket on the side',
          ar: 'صحن البطاطا المقلية المقرمشة بالزيت',
        },
        recommendedSwap: {
          en: 'Fresh Tabbouleh or Fattoush with light pomegranate dressing',
          ar: 'تبولة طازجة غنية بالبقدونس أو فتوش مع القليل من دبس الرمان',
        },
        healthBenefit: {
          en: 'Saves 38g of oxidized fast-acting refined carbohydrates and 250 calories.',
          ar: 'يوفر 38 غراماً من النشويات سريعة الامتصاص المقلية بالزيوت و250 سعرة.',
        },
      },
      {
        original: {
          en: '3 white pita breads',
          ar: '3 أرغفة خبز عربي أبيض مكرر',
        },
        recommendedSwap: {
          en: 'Half a wholewheat pita or enjoy skewers wrapped directly in fresh lettuce leaves',
          ar: 'نصف رغيف قمح كامل أو لف قطع الطاووق بأوراق الخس الطازجة',
        },
        healthBenefit: {
          en: 'Virtually flat glucose response without sluggish afternoon crash.',
          ar: 'منحنى سكر منبسط ومستقر تماماً بدون أي خمول أو نعاس بعد الوجبة.',
        },
      },
    ],
    majlisTips: {
      en: 'When dining out at Souq Waqif or Katara restaurants: Shish Tawook and Mashawi (mixed grill) are your best allies. Request vegetables grilled on skewers alongside.',
      ar: 'عند تناول العشاء في سوق واقف أو مطاعم كتارا: المشاوي المشكلة والشيش طاووق هي أفضل خيار للوقاية من السكري. اطلب أسياخ بصل وطماطم مشوية إضافية.',
    },
    waiterScript: {
      en: 'Please swap the french fries for a fresh green salad or tabbouleh, and bring the garlic sauce on the side.',
      ar: 'لو سمحت استبدل البطاطس المقلية بسلطة خضراء أو تبولة طازجة، وصلصة الثوم على جنب من فضلك.',
    },
    caloriesEstimate: 510,
  },
  {
    id: 'meal-balaleet-breakfast',
    name: {
      en: 'Traditional Balaleet (Sweet Vermicelli with Cardamom & Omelette)',
      ar: 'بلاليط قطرية تقليدية (شعيرية بالسكر والهيل والزعفران مع قرص بيض)',
    },
    category: 'breakfast',
    imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=500&q=80',
    estimatedCarbsRange: '70 - 90g',
    estimatedSugarsRange: '32 - 45g (added sucrose)',
    spikeRisk: 'HIGH',
    actionableMealFit: {
      en: 'Traditional Balaleet is heavily sweetened with table sugar cooked into the vermicelli pasta. If craving this classic breakfast, double the egg omelette portion and limit vermicelli to 3 tablespoons.',
      ar: 'البلاليط التقليدية تطبخ بكمية كبيرة من السكر المكرر. إذا اشتهيت هذا الفطور الشعبي، تناول قرص البيض المتبل كاملاً واكتفِ بملعقتين إلى 3 ملاعق فقط من الشعيرية.',
    },
    swaps: [
      {
        original: {
          en: 'Full bowl of sugar-drenched vermicelli',
          ar: 'صحن بلاليط ممتلئ مطبوخ بالسكر الأبيض',
        },
        recommendedSwap: {
          en: 'Shakshuka or 2-egg omelette with sautéed tomatoes, peppers, and 1 wholewheat flatbread',
          ar: 'شكشوكة بيض بالطماطم والفلفل الطازج أو قرص بيض بالجبن مع رغيف أسمر',
        },
        healthBenefit: {
          en: 'Cuts 35g of pure morning sugar that would otherwise cause a mid-morning reactive hypoglycemic crash.',
          ar: 'يمنع 35 غراماً من السكر المكرر الصباحي الذي يسبب هبوطاً واشتهاءً حاداً للحلويات قبل الظهر.',
        },
      },
    ],
    majlisTips: {
      en: 'For weekend family breakfasts: Praise the dish’s aroma (cardamom & rose water) and fill your plate primarily with the savory egg layer, olives, and labneh.',
      ar: 'في إفطار الجمعة مع العائلة: استمتع برائحة الهيل وماء الورد، واجعل صحنك يمتلئ بقرص البيض واللبنة والزيتون أولاً.',
    },
    waiterScript: {
      en: 'Could I have the Balaleet with the egg omelette served separately and less sweet vermicelli?',
      ar: 'لو سمحت، هل ممكن تقديم قرص البيض بشكل منفصل مع تقليل كمية البلاليط؟',
    },
    caloriesEstimate: 590,
  },
  {
    id: 'meal-karak-tea-stall',
    name: {
      en: 'Karak Mqanes / Tea Time Classic Sweet Karak',
      ar: 'شاي كرك قطري أصلي (بالحليب المكثف والسكر الزائد والهيل)',
    },
    category: 'beverage',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&q=80',
    estimatedCarbsRange: '24 - 32g',
    estimatedSugarsRange: '22 - 28g (3+ teaspoons of sugar)',
    spikeRisk: 'HIGH',
    actionableMealFit: {
      en: 'Standard Karak from roadside tea cafeterias contains 20g to 28g of sugar per small cup. Drinking 2 to 3 cups daily is a direct trigger for metabolic resistance.',
      ar: 'كوب الكرك العادي من الكافتيريات يحتوي على 20 إلى 28 غرام سكر. شرب كوبين إلى 3 أكواب يومياً يرفع مقاومة الإنسولين بصورة مستمرة.',
    },
    swaps: [
      {
        original: {
          en: 'Regular sweet Karak (3 spoons sugar + condensed milk)',
          ar: 'كرك عادي (حليب مركز وسكر زيادة)',
        },
        recommendedSwap: {
          en: 'Karak "Bidoon Sukkar" (Unsweetened Karak) with evaporated milk & double cardamom, or traditional Arabic Gahwa with 1 date',
          ar: 'كرك بدون سكر بحليب مبخر وزيادة هيل، أو قهوة عربية شقراء مع تمرة واحدة فقط',
        },
        healthBenefit: {
          en: 'Zero added sugar spike while maintaining the cozy Qatari ritual.',
          ar: 'يحافظ على متعة طقس الكرك الدافئ مع حماية كاملة من طفرة السكر اليومية.',
        },
      },
    ],
    majlisTips: {
      en: 'At Majlis gatherings: Opt for Arabic Gahwa (cardamom coffee). Gahwa has zero carbs and antioxidant chlorogenic acid. Just pair it with a single date rather than five.',
      ar: 'في المجلس: فضل القهوة العربية الشقراء المرة. القهوة العربية خالية من السكر وغنية بمضادات الأكسدة. اكتفِ بتمرة أو تمرتين على الأكثر.',
    },
    waiterScript: {
      en: 'One Karak tea, strictly without sugar please, with evaporated milk and extra cardamom.',
      ar: 'واحد كرك بدون سكر نهائياً لو سمحت، مع حليب مبخر وزيادة هيل.',
    },
    caloriesEstimate: 160,
  },
  {
    id: 'meal-luqaimat-dessert',
    name: {
      en: 'Luqaimat with Date Syrup & Sesame (1 bowl / 6 pieces)',
      ar: 'لقيمات مقرمشة بالدبس والسمسم (حصة 6 حبات)',
    },
    category: 'dessert',
    imageUrl: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=500&q=80',
    estimatedCarbsRange: '55 - 75g',
    estimatedSugarsRange: '38 - 50g',
    spikeRisk: 'HIGH',
    actionableMealFit: {
      en: 'Deep-fried dough soaked in date syrup produces an immediate glycemic surge. Limit to 1 to 2 pieces after a protein meal, or swap for fresh seasonal melon/pomegranate.',
      ar: 'عجينة مقلية مغموسة بدبس التمر تعطي قفزة سريعة جداً في سكر الدم. إذا رغبت بها، اكتفِ بحبة أو حبتين بعد وجبة غداء بروتينية.',
    },
    swaps: [
      {
        original: {
          en: '6 Luqaimat pieces dripping with date molasses',
          ar: 'صحن لقيمات (6 حبات) مغطى بالدبس الكثيف',
        },
        recommendedSwap: {
          en: '2 pieces of Luqaimat enjoyed slowly with hot Arabic Gahwa, or a bowl of fresh chilled pomegranate seeds',
          ar: 'حبتان فقط تؤكل ببطء مع فنجان قهوة عربية مرة، أو وعاء رمان طازج مبرد',
        },
        healthBenefit: {
          en: 'Cuts sugar consumption by 70% and avoids the acute 2-hour glucose peak.',
          ar: 'يخفض استهلاك السكر بنسبة 70% ويمنع ذروة السكر الحادة بعد ساعتين.',
        },
      },
    ],
    majlisTips: {
      en: 'In Ramadan or family celebrations: Savor one piece mindfully with a warm cup of cardamom tea without sugar. Lingering over conversation reduces mindless grazing.',
      ar: 'في مناسبات رمضان والأعياد: تناول حبة واحدة بتمهل وتلذذ بها مع شاي الهيل بدون سكر. الحديث والمجالسة تغنيك عن الأكل التلقائي.',
    },
    waiterScript: {
      en: 'Could we please have the date syrup served on the side in a separate cup?',
      ar: 'لو سمحت، هل ممكن وضع الدبس على جنب في وعاء منفصل؟',
    },
    caloriesEstimate: 420,
  },
  {
    id: 'meal-chicken-shawarma',
    name: {
      en: 'Arabic Chicken Shawarma Platter with Pickles & Toum',
      ar: 'صحن شاورما دجاج عربي على الفحم مع مخلل وثومية',
    },
    category: 'street',
    imageUrl: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=500&q=80',
    estimatedCarbsRange: '35 - 48g',
    estimatedSugarsRange: '2 - 4g',
    spikeRisk: 'MEDIUM',
    actionableMealFit: {
      en: 'Good protein base. To optimize for diabetes prevention: ask for shawarma without french fries inside the sandwich and opt for saj or brown flatbread.',
      ar: 'قاعدة بروتينية جيدة ومغذية. لتحسينها للوقاية: اطلب الشاورما بدون بطاطس داخل الساندوتش واطلب خبز صاج خفيف أو بر.',
    },
    swaps: [
      {
        original: {
          en: 'Jumbo shawarma wrapped in thick pita with stuffed fries',
          ar: 'شاورما صاروخ بخبز أبيض سميك محشوة بطاطس مقلية ومايونيز',
        },
        recommendedSwap: {
          en: 'Shawarma meat plate with fresh chopped cucumber, tomato, rocca, and toum (garlic dip)',
          ar: 'صحن شاورما دجاج بدون خبز مع سلطة خيار وجرجير وثومية طازجة',
        },
        healthBenefit: {
          en: 'Zero refined starch, slow and gentle glucose response.',
          ar: 'خالٍ من النشويات المكررة، واستجابة بطيئة وسلسة للجلوكوز.',
        },
      },
    ],
    majlisTips: {
      en: 'Late night snack run in Doha: An open shawarma plate with salad is dramatically healthier than burger & fries combos.',
      ar: 'عند طلب عشاء متأخر في الدوحة: صحن الشاورما المفتوح مع السلطة أفضل بمراحل من وجبات البرجر والبطاطس السريعة.',
    },
    waiterScript: {
      en: 'One chicken shawarma plate, please no french fries, extra pickles and green salad instead.',
      ar: 'صحن شاورما دجاج لو سمحت، بدون بطاطا مقلية، مع سلطة خضراء ومخلل زيادة.',
    },
    caloriesEstimate: 480,
  },
];
