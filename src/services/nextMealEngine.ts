import { RecordedMeal, NextMealSuggestion, MealType } from '../types';
import { QATAR_HEALTHY_MEALS } from '../data/qatarKitchens';

/**
 * Intelligent Next Meal Recommendation Engine for GlucoCoach Qatar
 * Dynamically computes the next ideal meal based on:
 * 1. The last meal taken (meal type, sugar grams, carbs grams, spike risk, timing)
 * 2. Current/latest recorded blood sugar level (mg/dL)
 * 3. Clinical diabetic recovery physiology (hepatic glycogen depletion, insulin sensitivity, fiber sequencing)
 */

export function determineNextMealType(lastMealType?: MealType): MealType {
  const currentHour = new Date().getHours();

  if (!lastMealType) {
    if (currentHour >= 5 && currentHour < 11) return 'breakfast';
    if (currentHour >= 11 && currentHour < 16) return 'lunch';
    if (currentHour >= 16 && currentHour < 21) return 'dinner';
    return 'snack';
  }

  switch (lastMealType) {
    case 'breakfast':
      // If breakfast was taken early morning, next is lunch (or morning snack if <11am)
      return currentHour < 11 ? 'snack' : 'lunch';
    case 'lunch':
      // After lunch, next is dinner (or afternoon tea/snack if 2pm-5pm)
      return currentHour >= 14 && currentHour < 17 ? 'snack' : 'dinner';
    case 'dinner':
      // After dinner, next is breakfast tomorrow (or bedtime stabilizer snack if late)
      return currentHour >= 21 || currentHour < 4 ? 'snack' : 'breakfast';
    case 'snack':
      if (currentHour >= 5 && currentHour < 11) return 'breakfast';
      if (currentHour >= 11 && currentHour < 16) return 'lunch';
      return 'dinner';
    default:
      return 'lunch';
  }
}

export function generateNextMealSuggestion(
  lastMeal: RecordedMeal | null | undefined,
  currentGlucose: number
): NextMealSuggestion {
  const nextType = determineNextMealType(lastMeal?.mealType);
  const glucose = currentGlucose || 122;

  const isGlucoseElevated = glucose > 135;
  const isGlucoseVeryHigh = glucose >= 180;
  const isGlucoseLow = glucose < 80;
  const wasLastMealHighSugar = (lastMeal?.sugarGrams || 0) >= 12 || (lastMeal?.carbsGrams || 0) >= 55;
  const lastMealName = lastMeal?.name || 'Previous Meal';
  const lastMealSugar = lastMeal?.sugarGrams ?? 4;

  // SCENARIO 1: Glucose Elevated or Last Meal was high in sugar/carbs (Anti-Spike Depletion Protocol)
  if (isGlucoseElevated || wasLastMealHighSugar) {
    if (nextType === 'breakfast') {
      const balaleet = QATAR_HEALTHY_MEALS.find((m) => m.id === 'km-balaleet-diet-delights');
      return {
        targetMealType: 'breakfast',
        dishName: {
          en: 'Keto Sugar-Free Qatari Balaleet with Saffron Egg Omelette',
          ar: 'بلاليط قطرية خالية من السكر مع قرص بيض بالزعفران والهيل',
        },
        kitchenOrLocation: {
          en: 'Diet Delights Qatar Health Kitchen (West Bay)',
          ar: 'دايت ديلايتس قطر (الخليج الغربي)',
        },
        imageUrl: balaleet?.imageUrl || 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=500&q=80',
        sugarGrams: 0,
        addedSugarGrams: 0,
        carbsGrams: 6,
        proteinGrams: 22,
        calories: 310,
        glycemicImpact: 'LOW',
        clinicalRationale: {
          en: `Your recorded glucose is ${glucose} mg/dL and your last meal (${lastMealName}) contained ${lastMealSugar}g sugar. To break continuous insulin elevation, this breakfast provides zero simple sugar and uses konjac fiber to slow gastric emptying, returning fasting glucose to safe targets (<120 mg/dL).`,
          ar: `مستوى السكر المسجل لديك حالياً ${glucose} ملغ/دسل ووجبتك السابقة (${lastMealName}) احتوت على ${lastMealSugar}غ سكر. لكسر استمرار إفراز الإنسولين، يوفر هذا الفطور صفر سكر مضاف مع ألياف عالية لتفريغ المعدة ببطء وإعادة سكر الصيام لمستوياته الآمنة.`,
        },
        actionableSequencingTip: {
          en: 'Hydrate with warm water and lemon first, then consume the saffron egg omelette before the low-carb noodles.',
          ar: 'اشرب كوب ماء دافئ مع ليمون أولاً، ثم ابدأ بقرص البيض بالزعفران والبروتين قبل الشعيرية.',
        },
        waiterScript: {
          en: 'No added honey or sugar syrup, extra saffron and cardamom please.',
          ar: 'بدون أي سكر أو عسل مضاف، وزيادة زعفران وهيل من فضلك.',
        },
        kitchenMealId: 'km-balaleet-diet-delights',
        priceQAR: 42,
      };
    }

    if (nextType === 'snack') {
      return {
        targetMealType: 'snack',
        dishName: {
          en: 'Fresh Rocca & Cucumber Salad with Crushed Walnuts & Laban',
          ar: 'سلطة جرجير وخيار طازجة مع جوز مجروش ولبن بلدنا خالي الدسم',
        },
        kitchenOrLocation: {
          en: 'Mazzraty Farm Fresh / Souq Waqif Fresh Pantry',
          ar: 'مزارع مزرعتي / سوق واقف',
        },
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80',
        sugarGrams: 0.5,
        addedSugarGrams: 0,
        carbsGrams: 4,
        proteinGrams: 9,
        calories: 140,
        glycemicImpact: 'LOW',
        clinicalRationale: {
          en: `Following ${lastMealName} (${lastMealSugar}g sugar) and a glucose reading of ${glucose} mg/dL, consuming soluble fiber and polyphenols (rocca) stimulates natural GLP-1 release and facilitates non-insulin glucose uptake without caloric burden.`,
          ar: `عقب وجبة ${lastMealName} (${lastMealSugar}غ سكر) ومستوى سكر ${glucose} ملغ/دسل، فإن تناول الألياف الذائبة والبوليفينول في الجرجير يحفز هرمون GLP-1 الطبيعي ويسرع امتصاص الجلوكوز في العضلات.`,
        },
        actionableSequencingTip: {
          en: 'Add 1 teaspoon of cold-pressed olive oil and sumac for antioxidant endothelial protection.',
          ar: 'أضف ملعقة صغيرة من زيت الزيتون البكر والسماق لحماية بطانة الأوعية الدموية.',
        },
        waiterScript: {
          en: 'Fresh rocca and cucumber only with lemon, olive oil and sumac dressing on the side.',
          ar: 'جرجير وخيار طازج مع ليمون وزيت زيتون وسماق على جنب من فضلك.',
        },
        priceQAR: 18,
      };
    }

    // Default Lunch / Dinner under elevated glucose
    const hamour = QATAR_HEALTHY_MEALS.find((m) => m.id === 'km-hamour-bandar-aden');
    return {
      targetMealType: nextType,
      dishName: {
        en: 'Grilled Hamour Fillet with Fresh Rocca Salad & Lemon Daqoos',
        ar: 'فيليه هامور قطري طازج مشوي مع سلطة جرجير ودقوس بالليمون',
      },
      kitchenOrLocation: {
        en: 'Bandar Aden Authentic Seafood (Souq Waqif)',
        ar: 'مطعم بندر عدن للمأكولات البحرية (سوق واقف)',
      },
      imageUrl: hamour?.imageUrl || 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=80',
      sugarGrams: 0,
      addedSugarGrams: 0,
      carbsGrams: 4,
      proteinGrams: 42,
      calories: 340,
      glycemicImpact: 'LOW',
      clinicalRationale: {
        en: `Because your last meal (${lastMealName}) supplied ${lastMealSugar}g sugar and your glucose is ${glucose} mg/dL (${isGlucoseVeryHigh ? 'Significant Spike' : 'Elevated'}), cellular glycogen stores are saturated. This grilled seafood dish provides 42g lean protein and omega-3s with near-zero carbs (4g), forcing hepatic glycogen discharge and returning blood sugar below 130 mg/dL within 2 hours.`,
        ar: `نظراً لأن وجبتك السابقة (${lastMealName}) احتوت ${lastMealSugar}غ سكر ومستوى السكر حالياً ${glucose} ملغ/دسل (${isGlucoseVeryHigh ? 'ارتفاع حاد' : 'مرتفع'})، فإن هذا الطبق البحري المشوي يوفر 42غ بروتين صافي وأوميغا 3 بدون نشويات (4غ فقط)، مما يحفز استهلاك مخزون الجلوكوز وإعادته للمعدل الطبيعي.`,
      },
      actionableSequencingTip: {
        en: 'Begin eating with the crisp rocca salad and squeeze fresh lemon before touching the fish. Skip white rice completely.',
        ar: 'ابدأ بتناول سلطة الجرجير أولاً مع عصر الليمون الطازج، ثم تناول الهامور المشوي، وتجنب الأرز الأبيض تماماً.',
      },
      waiterScript: {
        en: 'Grilled fish with extra fresh rocca salad, strictly no rice, and lemon daqoos on the side please.',
        ar: 'سمك مشوي بدون زيت زيادة، مع صحن سلطة جرجير إضافي وبدون أرز نهائياً ودقوس على جنب من فضلك.',
      },
      kitchenMealId: 'km-hamour-bandar-aden',
      priceQAR: 58,
    };
  }

  // SCENARIO 2: Glucose is Low (<80 mg/dL) - Hypoglycemia Prevention
  if (isGlucoseLow) {
    return {
      targetMealType: nextType,
      dishName: {
        en: 'Wholewheat Khubz with Warm Foul Mudammas, Cumin & Olive Oil',
        ar: 'فول مدمس دافئ بزيت الزيتون والكمون مع نصف خبز بر أسمر',
      },
      kitchenOrLocation: {
        en: 'Karak Mqanes / Al Sadd Local Kitchen',
        ar: 'كرك مقناص / مطابخ السد الشعبية',
      },
      imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=500&q=80',
      sugarGrams: 2.5,
      addedSugarGrams: 0,
      carbsGrams: 30,
      proteinGrams: 16,
      calories: 320,
      glycemicImpact: 'LOW',
      clinicalRationale: {
        en: `Your recorded glucose is ${glucose} mg/dL (Approaching Hypoglycemia Threshold). To safely elevate and steady your blood sugar without triggering a rebound spike, this meal offers unrefined slow-digesting legumes with healthy fats (olive oil) for sustained glucose stability.`,
        ar: `مستوى السكر لديك حالياً ${glucose} ملغ/دسل (مقترب من هبوط السكر). لرفع وتثبيت السكر بأمان دون التسبب في قفزة ارتدادية، يوفر هذا الطبق بقوليات بطيئة الامتصاص مع زيت الزيتون لثبات مستمر.`,
      },
      actionableSequencingTip: {
        en: 'Chew slowly and pair with warm water or unsweetened green tea to enhance nutrient absorption.',
        ar: 'امضغ ببطء واشرب ماء دافئ أو شاي أخضر بدون سكر لدعم الامتصاص المتزن.',
      },
      waiterScript: {
        en: 'Warm foul with olive oil and cumin, side wholewheat bread, and strictly no added sugar in tea.',
        ar: 'فول مدمس بزيت الزيتون والكمون مع خبز بر، وشاي بدون أي سكر نهائياً من فضلك.',
      },
      priceQAR: 24,
    };
  }

  // SCENARIO 3: Optimal / In-Range Glucose (80-135 mg/dL) & Balanced Last Meal (Maintenance)
  if (nextType === 'breakfast') {
    return {
      targetMealType: 'breakfast',
      dishName: {
        en: 'Baladna Fresh Shakshouka & Wholewheat Bread with Laban',
        ar: 'شكشوكة طازجة ببيض بلدي وخضار مع رغيف بر أسمر ولبن بلدنا',
      },
      kitchenOrLocation: {
        en: 'Baladna Restaurant & Farm Kitchen (The Pearl)',
        ar: 'مطعم ومزارع بلدنا (اللؤلؤة / الخور)',
      },
      imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=500&q=80',
      sugarGrams: 2.2,
      addedSugarGrams: 0,
      carbsGrams: 20,
      proteinGrams: 21,
      calories: 360,
      glycemicImpact: 'LOW',
      clinicalRationale: {
        en: `Your glucose is in optimal balance (${glucose} mg/dL) after ${lastMealName} (${lastMealSugar}g sugar). This nutrient-dense breakfast preserves insulin sensitivity with bioavailable choline, lutein from eggs, and lycopene from simmered tomatoes.`,
        ar: `سكر دمك في توازن مثالي (${glucose} ملغ/دسل) عقب وجبة ${lastMealName} (${lastMealSugar}غ سكر). هذا الفطور المتوازن يحافظ على حساسية الإنسولين بالبروتين الكامل ومضادات الأكسدة من الطماطم والبيض البلدي.`,
      },
      actionableSequencingTip: {
        en: 'Savor the eggs and cooked vegetables first before eating the wholewheat bread slice.',
        ar: 'تناول البيض والخضار المطهية أولاً بالشوكة قبل البدء بتناول شريحة الخبز الأسمر.',
      },
      waiterScript: {
        en: 'Shakshouka with olive oil, brown wholewheat bread, and unsweetened fresh laban please.',
        ar: 'شكشوكة بزيت الزيتون مع خبز أسمر ولبن بلدنا طازج بدون سكر من فضلك.',
      },
      priceQAR: 35,
    };
  }

  if (nextType === 'snack') {
    return {
      targetMealType: 'snack',
      dishName: {
        en: 'Karak Mqanes Unsweetened Cardamom Tea with Roasted Almonds',
        ar: 'شاي كرك مقناص مبخر بدون سكر بالهيل مع لوز نيء محمص',
      },
      kitchenOrLocation: {
        en: 'Karak Mqanes (Katara Cultural Village)',
        ar: 'كرك مقناص (قرية كتارا الثقافية)',
      },
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80',
      sugarGrams: 1.2,
      addedSugarGrams: 0,
      carbsGrams: 6,
      proteinGrams: 7,
      calories: 180,
      glycemicImpact: 'LOW',
      clinicalRationale: {
        en: `With your glucose stable at ${glucose} mg/dL, enjoy the authentic Qatari Karak aroma using evaporated low-fat milk without condensed sugar, paired with magnesium-rich raw almonds to sustain satiety.`,
        ar: `مع استقرار قراءتك عند ${glucose} ملغ/دسل، استمتع بنكهة الكرك القطري الأصيل بالحليب المبخر الخالي من السكر مع لوز غني بالمغنيسيوم لتعزيز الشبع.`,
      },
      actionableSequencingTip: {
        en: 'Eat the almonds first; the healthy fat and plant sterols flatten any minor glycemic surge.',
        ar: 'تناول اللوز أولاً؛ حيث تسهم الدهون الصحية في تثبيت مستوى الجلوكوز.',
      },
      waiterScript: {
        en: 'Evaporated milk karak with cardamom and strictly zero sugar or condensed milk.',
        ar: 'كرك بحليب مبخر وهيل وبدون أي سكر أو حليب مكثف نهائياً لو سمحت.',
      },
      priceQAR: 16,
    };
  }

  // Default Lunch / Dinner under Optimal baseline
  const machboos = QATAR_HEALTHY_MEALS.find((m) => m.id === 'km-machboos-al-khaima');
  return {
    targetMealType: nextType,
    dishName: {
      en: 'Portion-Controlled Chicken Machboos with Cucumber Laban',
      ar: 'مجبوس دجاج قطري موزون (نصف حصة أرز) مع سلطة خيار بلبن',
    },
    kitchenOrLocation: {
      en: 'Al Khaima Traditional Kitchen (Al Sadd)',
      ar: 'مطبخ الخيمة الشعبي (السد / الوعب)',
    },
    imageUrl: machboos?.imageUrl || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80',
    sugarGrams: 1.5,
    addedSugarGrams: 0,
    carbsGrams: 32,
    proteinGrams: 35,
    calories: 460,
    glycemicImpact: 'LOW',
    clinicalRationale: {
      en: `Your glucose response after ${lastMealName} was well-managed (${glucose} mg/dL, optimal baseline). For your upcoming ${nextType}, you can safely enjoy authentic Qatari Machboos by utilizing a calibrated half-portion of aged basmati rice and frontloading with cooling cucumber yogurt.`,
      ar: `استجابتك السكرية بعد وجبة ${lastMealName} كانت متزنة ومثالية (${glucose} ملغ/دسل ضمن النطاق الصحي). لوجبتك القادمة (${nextType})، يمكنك الاستمتاع بمجبوس دجاج قطري أصيل بنصف كمية الأرز مع البدء بسلطة الخيار بالزبادي لتسطيح المنحنى.`,
    },
    actionableSequencingTip: {
      en: 'Sequence your dining: 1. Cucumber yogurt first, 2. Spiced chicken breast second, 3. Measured basmati rice last.',
      ar: 'تسلسل الأكل الذكي: 1. ابدأ بسلطة الخيار باللبن، 2. ثم صدر الدجاج المتبل، 3. وتناول أرز البسمتي الموزون في النهاية.',
    },
    waiterScript: {
      en: 'Chicken Machboos with half rice portion, double cucumber yogurt, and no sweet fried raisins please.',
      ar: 'مجبوس دجاج مع نصف كمية الأرز وسلطة خيار بالزبادي مضاعفة وبدون زبيب مقلي لو سمحت.',
    },
    kitchenMealId: 'km-machboos-al-khaima',
    priceQAR: 48,
  };
}
