import { RecordedMeal, NextMealSuggestion, MealType, DailyCheckIn, UserProfile, PersonalizedNextMealPlan } from '../types';
import { QATAR_HEALTHY_MEALS } from '../data/qatarKitchens';

/**
 * Intelligent Next Meal Recommendation Engine for GlucoCoach Qatar
 * Dynamically computes personalized, healthy next-meal options based on:
 * 1. The user's historical data (all recorded meals, total sugar consumed today, spike history)
 * 2. The user's last logged blood sugar level (mg/dL) from capillary tests / CGM
 * 3. Clinical diabetic recovery physiology (hepatic glycogen depletion, insulin sensitivity, fiber sequencing)
 * 4. Local Qatar dining ecosystem (Diet Delights, Baladna, Souq Waqif, Al Khaima, Evergreen Organics)
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
      return currentHour < 11 ? 'snack' : 'lunch';
    case 'lunch':
      return currentHour >= 14 && currentHour < 17 ? 'snack' : 'dinner';
    case 'dinner':
      return currentHour >= 21 || currentHour < 4 ? 'snack' : 'breakfast';
    case 'snack':
      if (currentHour >= 5 && currentHour < 11) return 'breakfast';
      if (currentHour >= 11 && currentHour < 16) return 'lunch';
      return 'dinner';
    default:
      return 'lunch';
  }
}

export function generatePersonalizedNextMealPlan(params: {
  historicalMeals: RecordedMeal[];
  historicalCheckIns?: DailyCheckIn[];
  currentSugarLevel: number;
  userProfile?: UserProfile;
}): PersonalizedNextMealPlan {
  const { historicalMeals = [], historicalCheckIns = [], currentSugarLevel, userProfile } = params;

  const todayIso = new Date().toISOString().slice(0, 10);
  const todayMeals = historicalMeals.filter(
    (m) => m.displayDate === 'Today' || (m.takenAt && m.takenAt.startsWith(todayIso))
  );

  const todayTotalSugarGrams = Math.round(
    todayMeals.reduce((sum, m) => sum + (m.sugarGrams || 0), 0) * 10
  ) / 10;

  const targetDailySugar = userProfile?.targetDailyAddedSugar || 25;
  const remainingSugarBudgetGrams = Math.max(0, Math.round((targetDailySugar - todayTotalSugarGrams) * 10) / 10);

  // Determine last logged blood sugar level
  let lastLoggedGlucose = currentSugarLevel || 120;
  if (historicalCheckIns.length > 0 && historicalCheckIns[0].glucoseLevel) {
    lastLoggedGlucose = historicalCheckIns[0].glucoseLevel;
  } else if (historicalMeals.length > 0 && historicalMeals[0].glucoseAtMeal) {
    lastLoggedGlucose = historicalMeals[0].glucoseAtMeal;
  }

  const lastMeal = historicalMeals[0];
  const lastMealName = lastMeal ? (lastMeal.nameAr || lastMeal.name) : 'Previous Meal';
  const lastMealSugar = lastMeal ? lastMeal.sugarGrams : 0;
  const lastMealTimeDisplay = lastMeal ? (lastMeal.displayTime || 'earlier') : 'earlier today';

  const nextType = determineNextMealType(lastMeal?.mealType);

  const hasRecentSugarSpikes = historicalMeals.slice(0, 3).some((m) => m.spikeRisk === 'HIGH' || m.sugarGrams >= 15);

  let glucoseStatus: 'elevated' | 'optimal' | 'low' | 'critical_high' = 'optimal';
  if (lastLoggedGlucose >= 180) {
    glucoseStatus = 'critical_high';
  } else if (lastLoggedGlucose > 135) {
    glucoseStatus = 'elevated';
  } else if (lastLoggedGlucose < 80) {
    glucoseStatus = 'low';
  }

  // Generate dynamic clinical message synthesizing historical meals and last logged glucose
  let clinicalMessageEn = '';
  let clinicalMessageAr = '';

  if (glucoseStatus === 'critical_high' || glucoseStatus === 'elevated') {
    clinicalMessageEn = `Your last logged blood sugar is ${lastLoggedGlucose} mg/dL (Elevated). You have consumed ${todayTotalSugarGrams}g of your ${targetDailySugar}g sugar budget today across ${todayMeals.length} recorded meals. We recommend a Hepatic Glycogen Depletion meal with 0g added sugar and high lean protein to return blood sugar to baseline.`;
    clinicalMessageAr = `آخر قراءة لسكر الدم لديك هي ${lastLoggedGlucose} ملغ/دسل (مرتفعة). استهلكت اليوم ${todayTotalSugarGrams}غ من ميزانية السكر (${targetDailySugar}غ) عبر ${todayMeals.length} وجبات مسجلة. نوصي بوجبة استشفائية لتفريغ مخزون الجلوكوز بصفر سكر مضاف وبروتين نقي.`;
  } else if (glucoseStatus === 'low') {
    clinicalMessageEn = `Your last logged blood sugar is ${lastLoggedGlucose} mg/dL (Approaching Hypoglycemia). To safely steady your glucose without triggering a rebound spike, we recommend complex unrefined carbohydrates with slow-digesting dietary fiber.`;
    clinicalMessageAr = `آخر قراءة لسكر دمك ${lastLoggedGlucose} ملغ/دسل (مقترب من هبوط السكر). لرفع وتثبيت السكر بأمان دون ارتداد حاد، نوصي بنشويات معقدة غير مكررة مع ألياف بطيئة الامتصاص.`;
  } else {
    clinicalMessageEn = `Your blood sugar is balanced at ${lastLoggedGlucose} mg/dL with ${todayTotalSugarGrams}g sugar logged today (${remainingSugarBudgetGrams}g allowance remaining). For your upcoming ${nextType}, we recommend a balanced glycemic maintenance meal with protein-first sequencing.`;
    clinicalMessageAr = `سكر دمك متوازن عند ${lastLoggedGlucose} ملغ/دسل مع ${todayTotalSugarGrams}غ سكر مسجل اليوم (المتبقي من ميزانيتك: ${remainingSugarBudgetGrams}غ). لوجبتك القادمة (${nextType})، نوصي بوجبة متزنة تبدأ بالبروتين والألياف.`;
  }

  let primarySuggestion: NextMealSuggestion;
  const alternativeSuggestions: NextMealSuggestion[] = [];

  // ================= SCENARIO 1: ELEVATED GLUCOSE (>135 mg/dL) =================
  if (glucoseStatus === 'elevated' || glucoseStatus === 'critical_high' || hasRecentSugarSpikes) {
    if (nextType === 'breakfast') {
      const balaleet = QATAR_HEALTHY_MEALS.find((m) => m.id === 'km-balaleet-diet-delights');
      primarySuggestion = {
        targetMealType: 'breakfast',
        dishName: {
          en: 'Keto Sugar-Free Qatari Balaleet with Saffron Egg Omelette',
          ar: 'بلاليط قطرية خالية من السكر مع قرص بيض بالزعفران والهيل',
        },
        kitchenOrLocation: {
          en: 'Diet Delights Qatar Health Kitchen (West Bay / Al Hilal)',
          ar: 'دايت ديلايتس قطر (الخليج الغربي / الهلال)',
        },
        imageUrl: balaleet?.imageUrl || 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=500&q=80',
        sugarGrams: 0,
        addedSugarGrams: 0,
        carbsGrams: 6,
        proteinGrams: 22,
        calories: 310,
        glycemicImpact: 'LOW',
        clinicalRationale: {
          en: `Your last recorded glucose was ${lastLoggedGlucose} mg/dL and your previous meal (${lastMealName}) contributed to glycogen saturation. To stop continuous insulin elevation, this zero-sugar breakfast uses erythritol sweetener (PubChem CID 222285) and konjac fiber, returning fasting glucose to safe targets (<120 mg/dL).`,
          ar: `مستوى السكر المسجل لديك حالياً ${lastLoggedGlucose} ملغ/دسل ووجبتك السابقة (${lastMealName}) ساهمت في تشبع مخزون الكبد. لكسر استمرار إفراز الإنسولين، يوفر هذا الفطور صفر سكر مضاف مع محلي الإريثريتول الطبيعي وألياف الكونجاك لإعادة السكر لمستوياته الآمنة.`,
        },
        actionableSequencingTip: {
          en: 'Hydrate with warm water and fresh lemon first, then consume the saffron egg omelette before the low-carb noodles.',
          ar: 'اشرب كوب ماء دافئ مع ليمون أولاً، ثم ابدأ بقرص البيض بالزعفران والبروتين قبل الشعيرية.',
        },
        waiterScript: {
          en: 'No added honey or sugar syrup, extra saffron and cardamom please.',
          ar: 'بدون أي سكر أو عسل مضاف، وزيادة زعفران وهيل من فضلك.',
        },
        kitchenMealId: 'km-balaleet-diet-delights',
        priceQAR: 42,
        optionLabel: {
          en: 'Clinical Anti-Spike Choice',
          ar: 'الخيار العلاجي الخافض للسكر',
        },
        badge: {
          en: 'Zero Added Sugar • High Protein',
          ar: 'صفر سكر مضاف • غني بالبروتين',
        },
      };

      // Alternative Breakfast: Shakshouka without bread
      alternativeSuggestions.push({
        targetMealType: 'breakfast',
        dishName: {
          en: 'Baladna Cast-Iron Skillet Shakshouka (No Bread) with Extra Greens',
          ar: 'شكشوكة بلدنا بالمقلاة بدون خبز مع جرجير وطماطم طازجة',
        },
        kitchenOrLocation: {
          en: 'Baladna Restaurant (The Pearl / Medina Centrale)',
          ar: 'مطعم مزارع بلدنا (اللؤلؤة قطر)',
        },
        imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=500&q=80',
        sugarGrams: 1.5,
        addedSugarGrams: 0,
        carbsGrams: 5,
        proteinGrams: 19,
        calories: 260,
        glycemicImpact: 'LOW',
        clinicalRationale: {
          en: 'Eggs cooked with antioxidant-rich fresh tomatoes, bell peppers, and olive oil. Pure protein and micronutrients with zero simple carbohydrates.',
          ar: 'بيض طازج مطهو مع طماطم غنية بالليكوبين وفلفل رومي وزيت زيتون، يمنح شبعاً طويلاً دون أي تحفيز لموجة السكر.',
        },
        actionableSequencingTip: {
          en: 'Eat with a spoon directly and pair with hot green tea without sugar.',
          ar: 'تناول بالملعقة مباشرة مع كوب شاي أخضر ساخن خالي من السكر.',
        },
        waiterScript: {
          en: 'Cast-iron shakshouka cooked in olive oil, no bread basket and unsweetened black tea please.',
          ar: 'شكشوكة بزيت الزيتون وبدون سلة خبز وشاي أسود بدون سكر من فضلك.',
        },
        priceQAR: 36,
        optionLabel: {
          en: 'Farm Fresh Low-Carb Alternative',
          ar: 'بديل طازج من المزرعة قليل الكربوهيدرات',
        },
        badge: {
          en: '1.5g Sugar • 19g Protein',
          ar: '1.5غ سكر • 19غ بروتين',
        },
      });
    } else if (nextType === 'snack') {
      primarySuggestion = {
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
          en: `Following ${lastMealName} at ${lastMealTimeDisplay} and a glucose level of ${lastLoggedGlucose} mg/dL, consuming soluble fiber and polyphenols (rocca) stimulates natural GLP-1 release and facilitates non-insulin glucose uptake without caloric burden.`,
          ar: `عقب وجبة ${lastMealName} في ${lastMealTimeDisplay} ومستوى سكر ${lastLoggedGlucose} ملغ/دسل، فإن تناول الألياف الذائبة والبوليفينول في الجرجير يحفز هرمون GLP-1 الطبيعي ويسرع امتصاص الجلوكوز في العضلات.`,
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
        optionLabel: {
          en: 'Cellular Restoration Snack',
          ar: 'سناك استشفائي للجلوكوز',
        },
        badge: {
          en: '0g Added Sugar • Stimulates GLP-1',
          ar: 'صفر سكر مضاف • يحفز GLP-1',
        },
      };

      // Alternative snack: Karak without sugar + almonds
      alternativeSuggestions.push({
        targetMealType: 'snack',
        dishName: {
          en: 'Karak Mqanes Zero-Sugar Cardamom Tea with 12 Raw Almonds',
          ar: 'كرك مقناص بدون سكر بحليب مبخر مع 12 حبة لوز نيء',
        },
        kitchenOrLocation: {
          en: 'Karak Mqanes (Katara Cultural Village / The Pearl)',
          ar: 'كرك مقناص (كتارا / اللؤلؤة)',
        },
        imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80',
        sugarGrams: 1.0,
        addedSugarGrams: 0,
        carbsGrams: 4,
        proteinGrams: 6,
        calories: 150,
        glycemicImpact: 'LOW',
        clinicalRationale: {
          en: 'Enjoy authentic Qatari tea culture without blood sugar spikes. Almond magnesium activates insulin receptors.',
          ar: 'تمتع بنكهة الكرك الشعبي بدون رفع السكر، حيث يدعم المغنيسيوم في اللوز تنشيط مستقبلات الإنسولين.',
        },
        actionableSequencingTip: {
          en: 'Eat almonds before sipping the warm tea.',
          ar: 'تناول اللوز أولاً قبل ارتشاف الشاي الدافئ.',
        },
        waiterScript: {
          en: 'Cardamom karak strictly without sugar or condensed milk, and a small cup of raw almonds.',
          ar: 'كرك بالهيل بدون أي سكر أو حليب مكثف نهائياً مع صحن لوز نيء لو سمحت.',
        },
        priceQAR: 15,
        optionLabel: {
          en: 'Authentic Qatari Tea Swap',
          ar: 'بديل شاي الكرك القطري الأصيل',
        },
        badge: {
          en: '1g Sugar • Cardamom & Magnesium',
          ar: '1غ سكر • هيل ومغنيسيوم',
        },
      });
    } else {
      // Default Lunch / Dinner for Elevated Glucose
      const hamour = QATAR_HEALTHY_MEALS.find((m) => m.id === 'km-hamour-bandar-aden');
      primarySuggestion = {
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
          en: `Your last logged blood sugar was ${lastLoggedGlucose} mg/dL and your previous meal (${lastMealName}) provided ${lastMealSugar}g sugar. Because your glycogen stores are saturated, this grilled seafood meal delivers 42g lean protein and omega-3s with near-zero carbs (4g), forcing hepatic glycogen discharge and returning blood sugar below 130 mg/dL within 2 hours.`,
          ar: `قراءة سكر دمك الأخيرة هي ${lastLoggedGlucose} ملغ/دسل ووجبتك السابقة (${lastMealName}) احتوت على ${lastMealSugar}غ سكر. نظراً لتشبع مخزون الكبد، فإن هذا الهامور المشوي يوفر 42غ بروتين نقي وأوميغا 3 بدون نشويات (4غ فقط)، مما يحفز استهلاك مخزون الجلوكوز وإعادته للمعدل الطبيعي.`,
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
        optionLabel: {
          en: 'Clinical Primary: Hepatic Reset',
          ar: 'الخيار السريري الأول: تفريغ مخزون الكبد',
        },
        badge: {
          en: '0g Sugar • 42g Protein • High Omega-3',
          ar: '0غ سكر • 42غ بروتين • أوميغا 3',
        },
      };

      // Alternative Grill: Mazzraty Chicken Shish Tawook
      const tawook = QATAR_HEALTHY_MEALS.find((m) => m.id === 'km-tawook-diet-delights');
      alternativeSuggestions.push({
        targetMealType: nextType,
        dishName: {
          en: 'Mazzraty Marinated Shish Tawook Skewers with Parsley Tabbouleh',
          ar: 'شيش طاووق دجاج مزرعتي مشوي مع تبولة بقدونس وزيت زيتون',
        },
        kitchenOrLocation: {
          en: 'Diet Delights Qatar (West Bay / C-Ring Road)',
          ar: 'دايت ديلايتس قطر (الخليج الغربي / الطريق الدائري الثالث)',
        },
        imageUrl: tawook?.imageUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80',
        sugarGrams: 0.8,
        addedSugarGrams: 0,
        carbsGrams: 8,
        proteinGrams: 39,
        calories: 380,
        glycemicImpact: 'LOW',
        clinicalRationale: {
          en: 'Local organic chicken breast marinated in yogurt and garlic. High bioavailability protein maintains lean mass while keeping insulin demand at baseline.',
          ar: 'صدور دجاج مزرعتي المحلية المتبلة بالزبادي والثوم. بروتين سريع الامتصاص يحافظ على الكتلة العضلية مع خفض الطلب على الإنسولين إلى الصفر.',
        },
        actionableSequencingTip: {
          en: 'Eat the parsley tabbouleh first (high chlorophyll and vitamin C) before the skewers.',
          ar: 'ابدأ بتبولة البقدونس وزيت الزيتون أولاً ثم تناول أسياخ الشيش طاووق.',
        },
        waiterScript: {
          en: 'Grilled chicken skewers with extra parsley salad, no french fries or flatbread please.',
          ar: 'شيش طاووق مشوي مع سلطة بقدونس إضافية وبدون بطاطس مقلية أو خبز من فضلك.',
        },
        kitchenMealId: 'km-tawook-diet-delights',
        priceQAR: 45,
        optionLabel: {
          en: 'Healthy Kitchen Grills',
          ar: 'مشويات صحية من المطبخ القطري',
        },
        badge: {
          en: '0.8g Sugar • 39g Lean Protein',
          ar: '0.8غ سكر • 39غ بروتين صافي',
        },
      });

      // Rapid Home Prep alternative
      alternativeSuggestions.push({
        targetMealType: nextType,
        dishName: {
          en: 'Quick Home Prep: Pan-Seared Salmon & Baladna Cucumber Labneh Bowl',
          ar: 'تحضير منزلي سريع: سلمون مشوي بالمقلاة مع صحن لبنة وخيار بلدنا',
        },
        kitchenOrLocation: {
          en: 'Home Preparation (15 Minutes) • Al Meera / Lulu Pantry',
          ar: 'تحضير منزلي (15 دقيقة) • مكونات متوفرة في الميرة / اللولو',
        },
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=500&q=80',
        sugarGrams: 1.2,
        addedSugarGrams: 0,
        carbsGrams: 5,
        proteinGrams: 36,
        calories: 390,
        glycemicImpact: 'LOW',
        clinicalRationale: {
          en: 'Quick 15-minute home assembly. Omega-3 EPA/DHA improves adipocyte insulin sensitivity and blunts inflammation.',
          ar: 'تحضير سريع في 15 دقيقة. أحماض أوميغا 3 تحسن استجابة الخلايا للإنسولين وتخفف الالتهاب الوعائي.',
        },
        actionableSequencingTip: {
          en: 'Season with sumac, zaatar, and extra virgin olive oil.',
          ar: 'تبل بالسماق والزعتر وزيت الزيتون البكر الممتاز.',
        },
        waiterScript: {
          en: 'Home cooked recipe - no ordering script needed.',
          ar: 'وصفة تحضير منزلي سريعة.',
        },
        priceQAR: 32,
        optionLabel: {
          en: 'Fast Home Kitchen Prep',
          ar: 'تحضير منزلي سريع',
        },
        badge: {
          en: '15 Min Prep • 0g Added Sugar',
          ar: 'تحضير في 15 دقيقة • 0غ سكر مضاف',
        },
      });
    }
  }

  // ================= SCENARIO 2: LOW GLUCOSE (<80 mg/dL) =================
  else if (glucoseStatus === 'low') {
    primarySuggestion = {
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
        en: `Your last logged blood sugar is ${lastLoggedGlucose} mg/dL (Approaching Hypoglycemia Threshold). To safely elevate and steady your blood sugar without triggering a rebound spike, this meal offers unrefined slow-digesting legumes with healthy fats (olive oil) for sustained glucose stability.`,
        ar: `مستوى السكر المسجل لديك حالياً ${lastLoggedGlucose} ملغ/دسل (مقترب من هبوط السكر). لرفع وتثبيت السكر بأمان دون التسبب في قفزة ارتدادية، يوفر هذا الطبق بقوليات بطيئة الامتصاص مع زيت الزيتون لثبات مستمر.`,
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
      optionLabel: {
        en: 'Hypo-Prevention Restorative Choice',
        ar: 'الخيار الواقي من هبوط السكر',
      },
      badge: {
        en: 'Complex Fiber • Gentle Glucose Rise',
        ar: 'ألياف معقدة • رفع تدريجي آمن',
      },
    };

    // Alternative: Whole Grain Lentil Soup with lemon & roasted wholewheat croutons
    alternativeSuggestions.push({
      targetMealType: nextType,
      dishName: {
        en: 'Traditional Qatari Yellow Lentil Shorba with Cumin & Wholewheat Toast',
        ar: 'شوربة عدس قطرية بالكمون والليمون مع خبز بر محمص',
      },
      kitchenOrLocation: {
        en: 'Al Khaima Traditional Restaurant (Al Sadd)',
        ar: 'مطعم الخيمة الشعبي (السد)',
      },
      imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=500&q=80',
      sugarGrams: 2.0,
      addedSugarGrams: 0,
      carbsGrams: 28,
      proteinGrams: 14,
      calories: 280,
      glycemicImpact: 'LOW',
      clinicalRationale: {
        en: 'Warm, comforting lentil soup with complex carbohydrates and bioflavonoids to gently raise blood glucose.',
        ar: 'شوربة عدس دافئة ومغذية غنية بالألياف المعقدة لرفع سكر الدم بلطف وثبات.',
      },
      actionableSequencingTip: {
        en: 'Squeeze extra fresh lemon juice; citric acid enhances mineral absorption.',
        ar: 'اعصر ليموناً طازجاً إضافياً لتعزيز امتصاص الحديد ومضادات الأكسدة.',
      },
      waiterScript: {
        en: 'Lentil soup with lemon and cumin, brown wholewheat toast on the side.',
        ar: 'شوربة عدس مع ليمون وكمون وخبز أسمر محمص على جنب لو سمحت.',
      },
      priceQAR: 22,
      optionLabel: {
        en: 'Warm Comfort Soup Alternative',
        ar: 'شوربة دافئة ومغذية',
      },
      badge: {
        en: '2g Sugar • 14g Plant Protein',
        ar: '2غ سكر • 14غ بروتين نباتي',
      },
    });
  }

  // ================= SCENARIO 3: OPTIMAL / IN-RANGE GLUCOSE (80-135 mg/dL) =================
  else {
    if (nextType === 'breakfast') {
      primarySuggestion = {
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
          en: `Your last logged blood sugar is in optimal balance (${lastLoggedGlucose} mg/dL) after ${lastMealName} (${lastMealSugar}g sugar). This nutrient-dense breakfast preserves insulin sensitivity with bioavailable choline, lutein from eggs, and lycopene from simmered tomatoes.`,
          ar: `سكر دمك في توازن مثالي (${lastLoggedGlucose} ملغ/دسل) عقب وجبة ${lastMealName} (${lastMealSugar}غ سكر). هذا الفطور المتوازن يحافظ على حساسية الإنسولين بالبروتين الكامل ومضادات الأكسدة من الطماطم والبيض البلدي.`,
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
        optionLabel: {
          en: 'Balanced Morning Fuel',
          ar: 'طاقة صباحية متوازنة',
        },
        badge: {
          en: 'Optimal Glucose • 21g Protein',
          ar: 'سكر متزن • 21غ بروتين',
        },
      };

      // Alternative breakfast
      alternativeSuggestions.push({
        targetMealType: 'breakfast',
        dishName: {
          en: 'Evergreen Organics Avocado & Poached Eggs on Sourdough',
          ar: 'أفوكادو وبيض بلدي مسلوق على توست ساوردو مخمر',
        },
        kitchenOrLocation: {
          en: 'Evergreen Organics (Qanat Quartier, The Pearl)',
          ar: 'إيفرجرين أورجانيكس (قناة كارتييه، اللؤلؤة)',
        },
        imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=80',
        sugarGrams: 1.0,
        addedSugarGrams: 0,
        carbsGrams: 18,
        proteinGrams: 17,
        calories: 340,
        glycemicImpact: 'LOW',
        clinicalRationale: {
          en: 'Slow-fermented sourdough has a lower glycemic index and prebiotic benefits for gut microbiome insulin sensitivity.',
          ar: 'خبز الساوردو المخمر ببطء يتميز بمؤشر جلايسيمي منخفض ويعزز صحة بكتيريا الأمعاء النافعة.',
        },
        actionableSequencingTip: {
          en: 'Sprinkle pumpkin seeds and chili flakes on top for zinc and thermogenesis.',
          ar: 'أضف بذور القرع لمزيد من الزنك والدهون الصحية.',
        },
        waiterScript: {
          en: 'Poached eggs on toasted sourdough with smashed avocado and lemon, no sweet balsamic glaze.',
          ar: 'بيض مسلوق على توست ساوردو مع أفوكادو وليمون بدون صوصات محلاة من فضلك.',
        },
        priceQAR: 48,
        optionLabel: {
          en: 'Artisan Sourdough Alternative',
          ar: 'بديل الساوردو المخمر الصحي',
        },
        badge: {
          en: '1g Sugar • Healthy Monounsaturated Fats',
          ar: '1غ سكر • دهون أحادية صحية',
        },
      });
    } else if (nextType === 'snack') {
      primarySuggestion = {
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
          en: `With your last logged glucose stable at ${lastLoggedGlucose} mg/dL, enjoy authentic Qatari Karak aroma using evaporated low-fat milk without condensed sugar, paired with magnesium-rich raw almonds to sustain satiety.`,
          ar: `مع استقرار قراءتك الأخيرة عند ${lastLoggedGlucose} ملغ/دسل، استمتع بنكهة الكرك القطري الأصيل بالحليب المبخر الخالي من السكر مع لوز غني بالمغنيسيوم لتعزيز الشبع.`,
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
        optionLabel: {
          en: 'Qatari Afternoon Tea Protocol',
          ar: 'بروتوكول الشاي الشعبي المتزن',
        },
        badge: {
          en: '0g Added Sugar • Rich in Magnesium',
          ar: '0غ سكر مضاف • غني بالمغنيسيوم',
        },
      };

      // Alternative snack: Greek yogurt with chia
      alternativeSuggestions.push({
        targetMealType: 'snack',
        dishName: {
          en: 'Baladna Plain Greek Labneh with Chia Seeds & Cinnamon',
          ar: 'لبنة بلدنا يونانية طبيعية مع بذور الشيا ورشة قرفة',
        },
        kitchenOrLocation: {
          en: 'Home Preparation / Baladna Express',
          ar: 'تحضير منزلي / بلدنا إكسبريس',
        },
        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80',
        sugarGrams: 1.8,
        addedSugarGrams: 0,
        carbsGrams: 5,
        proteinGrams: 14,
        calories: 160,
        glycemicImpact: 'LOW',
        clinicalRationale: {
          en: 'Cinnamon active compound (methylhydroxychalcone polymer) mimics insulin and increases glucose utilization.',
          ar: 'تحتوي القرفة على مركبات تحاكي عمل الإنسولين وتزيد كفاءة حرق الجلوكوز في العضلات.',
        },
        actionableSequencingTip: {
          en: 'Mix chia seeds and allow to hydrate for 5 minutes before eating.',
          ar: 'اخلط بذور الشيا مع اللبنة واتركها 5 دقائق لامتصاص السوائل.',
        },
        waiterScript: {
          en: 'Home pantry snack.',
          ar: 'سناك منزلي سريع.',
        },
        priceQAR: 12,
        optionLabel: {
          en: 'Probiotic Labneh Alternative',
          ar: 'بديل اللبنة بالبروبيوتيك والقرفة',
        },
        badge: {
          en: '14g Protein • Insulin-Mimetic Cinnamon',
          ar: '14غ بروتين • قرفة محفزة للأنسولين',
        },
      });
    } else {
      // Default Lunch / Dinner under Optimal baseline
      const machboos = QATAR_HEALTHY_MEALS.find((m) => m.id === 'km-machboos-al-khaima');
      primarySuggestion = {
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
          en: `Your glucose response was well-managed (${lastLoggedGlucose} mg/dL, optimal baseline). For your upcoming ${nextType}, you can safely enjoy authentic Qatari Machboos by utilizing a calibrated half-portion of aged basmati rice and frontloading with cooling cucumber yogurt.`,
          ar: `استجابتك السكرية كانت متزنة ومثالية (${lastLoggedGlucose} ملغ/دسل ضمن النطاق الصحي). لوجبتك القادمة (${nextType})، يمكنك الاستمتاع بمجبوس دجاج قطري أصيل بنصف كمية الأرز مع البدء بسلطة الخيار بالزبادي لتسطيح المنحنى.`,
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
        optionLabel: {
          en: 'Calibrated Traditional Favorite',
          ar: 'الطبق الشعبي المحبوب بجرعة مدروسة',
        },
        badge: {
          en: '1.5g Sugar • 35g Basmati Carbs • 35g Protein',
          ar: '1.5غ سكر • 35غ أرز بسمتي • 35غ بروتين',
        },
      };

      // Alternative Option: Grilled Sea Bass with Rocca Salad from Bandar Aden
      const hamour = QATAR_HEALTHY_MEALS.find((m) => m.id === 'km-hamour-bandar-aden');
      alternativeSuggestions.push({
        targetMealType: nextType,
        dishName: {
          en: 'Grilled Hamour Fillet with Rocca Salad & Fresh Lemon Daqoos',
          ar: 'هامور مشوي على الفحم مع سلطة جرجير ودقوس بالليمون',
        },
        kitchenOrLocation: {
          en: 'Bandar Aden Seafood (Souq Waqif)',
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
          en: 'Zero-carb lean seafood option if you wish to bank carbohydrate credits for an evening social gathering or family majlis.',
          ar: 'خيار بحري بدون نشويات إذا رغبت في توفير رصيدك من النشويات لمجلس عائلي مسائي.',
        },
        actionableSequencingTip: {
          en: 'Savor with garlic lemon paste and fresh sumac-dusted rocca.',
          ar: 'تناوله مع الثوم والليمون وسلطة الجرجير الطازجة بالسماق.',
        },
        waiterScript: {
          en: 'Grilled hamour with extra rocca salad and no rice please.',
          ar: 'هامور مشوي مع سلطة جرجير إضافية وبدون أرز لو سمحت.',
        },
        kitchenMealId: 'km-hamour-bandar-aden',
        priceQAR: 58,
        optionLabel: {
          en: 'Zero-Carb Seafood Alternative',
          ar: 'بديل بحري خالي من النشويات',
        },
        badge: {
          en: '0g Sugar • 42g Protein',
          ar: '0غ سكر • 42غ بروتين',
        },
      });

      // Alternative Option: Traditional Whole Grain Harees
      const harees = QATAR_HEALTHY_MEALS.find((m) => m.id === 'km-harees-al-khaima');
      alternativeSuggestions.push({
        targetMealType: nextType,
        dishName: {
          en: 'Traditional Qatari Harees (Whole Grain Wheat & Veal)',
          ar: 'هريس قطري بالقمح الكامل واللحم البلدي بدون سمن مفرط',
        },
        kitchenOrLocation: {
          en: 'Al Khaima Traditional Kitchen (Al Sadd)',
          ar: 'مطبخ الخيمة الشعبي (السد)',
        },
        imageUrl: harees?.imageUrl || 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=500&q=80',
        sugarGrams: 1.0,
        addedSugarGrams: 0,
        carbsGrams: 38,
        proteinGrams: 28,
        calories: 420,
        glycemicImpact: 'LOW',
        clinicalRationale: {
          en: 'Whole wheat berries provide beta-glucans and insoluble fiber, slowing glucose absorption into systemic circulation.',
          ar: 'حبوب القمح الكاملة توفر ألياف البيتا جلوكان التي تبطئ امتصاص السكر وتمنح طاقة مستدامة.',
        },
        actionableSequencingTip: {
          en: 'Request light ghee (dihn barri) on top to keep saturated fat in check.',
          ar: 'اطلب رشة دهن بري خفيفة جداً لتقليل الدهون المشبعة.',
        },
        waiterScript: {
          en: 'Harees with half portion of ghee on top please.',
          ar: 'هريس مع دهن خفيف جداً على الوجه لو سمحت.',
        },
        kitchenMealId: 'km-harees-al-khaima',
        priceQAR: 42,
        optionLabel: {
          en: 'Heritage Whole-Grain Alternative',
          ar: 'خيار الهريس التراثي بالقمح الكامل',
        },
        badge: {
          en: 'High Beta-Glucan Fiber • 28g Protein',
          ar: 'ألياف بيتا جلوكان عالية • 28غ بروتين',
        },
      });
    }
  }

  return {
    primarySuggestion,
    alternativeSuggestions,
    historicalAnalysis: {
      lastLoggedGlucose,
      glucoseStatus,
      todayMealsCount: todayMeals.length,
      todayTotalSugarGrams,
      remainingSugarBudgetGrams,
      targetDailySugar,
      lastMealName,
      lastMealSugar,
      lastMealTimeDisplay,
      hasRecentSugarSpikes,
      clinicalMessageEn,
      clinicalMessageAr,
    },
  };
}

/**
 * Backwards compatibility helper
 */
export function generateNextMealSuggestion(
  lastMeal: RecordedMeal | null | undefined,
  currentGlucose: number
): NextMealSuggestion {
  const plan = generatePersonalizedNextMealPlan({
    historicalMeals: lastMeal ? [lastMeal] : [],
    currentSugarLevel: currentGlucose,
  });
  return plan.primarySuggestion;
}
