export type Language = 'en' | 'ar';
export type GlucoseUnit = 'mg/dL' | 'mmol/L';
export type TrafficLight = 'LOW' | 'MEDIUM' | 'HIGH';
export type SpikeVelocity = 'Slow' | 'Moderate' | 'Rapid';
export type TriageLevel = 'GREEN' | 'AMBER' | 'RED';

export type LocalizedText = {
  en: string;
  ar: string;
  [key: string]: any;
};

export interface NutritionInfo {
  calories: number;
  carbs: number; // grams
  addedSugars: number; // grams
  refinedStarches: number; // grams
  fiber: number; // grams
  protein: number; // grams
  fats: number; // grams
  saturatedFats: number; // grams
  sodium: number; // mg
}

export interface FoodSafetyInfo {
  productionDate?: string;
  expiryDate?: string;
  daysRemaining?: number;
  storageInstructions: LocalizedText;
  useByAdvisory: LocalizedText;
  isPastExpiry: boolean;
}

export interface QatarSwap {
  name: LocalizedText;
  whyBetter: LocalizedText;
  supermarketFound: string; // e.g. "Al Meera, Lulu, Monoprix"
  sugarReduction: string; // e.g. "-18g sugar"
  carbsReduction?: string;
}

export interface FoodProduct {
  id: string;
  barcode: string;
  name: LocalizedText;
  brand: string; // e.g. Baladna, Almarai, Mazzraty, Dandy
  category: string;
  imageUrl: string;
  servingSize: string;
  nutrition: NutritionInfo;
  upfLevel: 1 | 2 | 3 | 4; // NOVA score
  trafficLight: TrafficLight;
  spikeVelocity: SpikeVelocity;
  glucoseImpactReason: LocalizedText;
  foodSafety: FoodSafetyInfo;
  qatarSwaps: QatarSwap[];
  summaryTip: LocalizedText;
}

export interface BasketItem {
  product: FoodProduct;
  quantity: number;
  addedAt: string;
}

export interface MealSwap {
  original: LocalizedText;
  recommendedSwap: LocalizedText;
  healthBenefit: LocalizedText;
}

export interface MealDish {
  id: string;
  name: LocalizedText;
  category: 'traditional' | 'street' | 'breakfast' | 'beverage' | 'dessert';
  imageUrl: string;
  estimatedCarbsRange: string;
  estimatedSugarsRange: string;
  spikeRisk: TrafficLight;
  actionableMealFit: LocalizedText;
  swaps: MealSwap[];
  majlisTips: LocalizedText;
  waiterScript: LocalizedText;
  caloriesEstimate: number;
}

export interface DailyCheckIn {
  id: string;
  date: string;
  timeOfDay: 'morning' | 'evening';
  feelingRating: 'great' | 'good' | 'tired' | 'unwell';
  sleepHours: number;
  sleepQuality: 'good' | 'fair' | 'poor';
  medicationTaken: boolean;
  glucoseLevel?: number; // stored in mg/dL
  glucoseTiming?: 'fasting' | 'pre_meal' | 'post_meal' | 'bedtime' | 'random';
  restingHeartRate?: number;
  steps?: number;
  symptoms: {
    chestTightness: boolean;
    shortnessOfBreath: boolean;
    numbnessShoulderJaw: boolean;
    coldSweat: boolean;
    dizzinessFainting: boolean;
    legSwelling: boolean;
    unusualFatigue: boolean;
    excessiveThirst: boolean;
  };
  notes?: string;
  triageLevel: TriageLevel;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  notifyOnAmber: boolean;
}

export interface FoodSugarAnalysisResult {
  dishName: string;
  servingEstimated: string;
  totalSugarGrams: number;
  addedSugarGrams: number;
  naturalSugarGrams: number;
  totalCarbsGrams: number;
  calories: number;
  teaspoons: number;
  sugarCubes: number;
  predominantSugarType: 'sucrose' | 'fructose' | 'glucose' | 'maltose' | 'lactose' | 'erythritol' | string;
  pubchemCid: number;
  glycemicIndex: number;
  glycemicLoad: number;
  spikeVelocity: SpikeVelocity;
  scientificMetabolicExplanation: string;
  previousDayContext: {
    recordedLevel: number;
    status: 'elevated' | 'optimal' | 'low';
    clinicalInsight: string;
    suggestedHealthyMeal: {
      name: string;
      restaurantOrLocation: string;
      whyBeneficialToday: string;
      orderScript: string;
      carbsAndSugarSummary: string;
    };
  };
}

export interface QatariKitchenProvider {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  tagline: {
    en: string;
    ar: string;
  };
  zone: string;
  phone: string;
  whatsapp: string;
  rating: number;
  deliveryTimeMin: number;
  certifiedDiabeticPartner: boolean;
  specialty: string;
  iconName?: string;
}

export interface KitchenMealItem {
  id: string;
  kitchenId: string;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  priceQAR: number;
  imageUrl: string;
  sugarGrams: number;
  addedSugarGrams: number;
  carbsGrams: number;
  proteinGrams: number;
  calories: number;
  glycemicImpact: 'LOW' | 'MEDIUM';
  diabeticApproved: boolean;
  portionMods: {
    en: string[];
    ar: string[];
  };
  deliveryKitchenName: {
    en: string;
    ar: string;
  };
  category: 'grills' | 'traditional' | 'seafood' | 'breakfast' | 'beverages';
}

export interface QatarFoodProvider {
  id: string;
  name: { en: string; ar: string };
  tagline: { en: string; ar: string };
  logoText: string;
  accentColor: string;
  deliveryFeeQAR: number;
  deliveryTimeMin: number;
  isAutomatedSupported: boolean;
  rating: number;
}

export interface AutoMealOrderConfig {
  enabled: boolean;
  preferredProviderId: string;
  lunchTime: string; // e.g. "12:30"
  dinnerTime: string; // e.g. "19:00"
  maxSugarGramsPerMeal: number; // e.g. 5
  autoConfirmWithoutPrompt: boolean;
  deliveryAddress: string;
  deliveryZone: string;
  lastAutoOrderedAt?: string;
}

export interface HighSugarAlarmInfo {
  glucose: number;
  consecutiveHighCount: number;
  isPersistent: boolean;
  clinicName: string;
  clinicPhone: string;
  doctorName?: string;
  severity: 'WARNING' | 'CRITICAL';
  suggestedAction: {
    en: string;
    ar: string;
  };
}

export interface KitchenFoodOrder {
  id: string;
  meal: KitchenMealItem;
  quantity: number;
  totalQAR: number;
  status: 'confirmed' | 'preparing' | 'on_the_way' | 'delivered';
  customerName: string;
  customerPhone: string;
  deliveryZone: string;
  deliveryAddress: string;
  specialNotes?: string;
  selectedMods: string[];
  placedAt: string;
  estimatedDeliveryTime: string;
  providerId?: string;
  providerName?: string;
  isAutomated?: boolean;
}

export interface UserProfile {
  name: string;
  qatarId: string;
  healthCardNumber: string;
  dob: string;
  bloodType: string;
  diabeticStatus: 'pre-diabetes' | 'type-2' | 'preventative' | 'type-1';
  targetDailyAddedSugar: number; // grams (e.g. 25g)
  targetDailyCarbs: number; // grams (e.g. 130g)
  medications: string[];
  allergies: string[];
  primaryDoctor?: string;
  healthCenter: string; // e.g. "Al Sadd Health Center (PHCC)"
  emergencyContact: EmergencyContact;
  // Emergency medical-related data
  chronicConditions: string[]; // e.g. ["Type 2 Diabetes", "Hypertension"]
  emergencyNotes: string; // Critical notes for 999 paramedics (e.g., "Carries rapid glucose gel")
  preferredHospital: string; // e.g. "Hamad General Hospital - Emergency Department"
  insulinDependent: boolean;
  resuscitationPreference?: 'FULL_CODE' | 'DNR';
  updatedAt?: string;
}

export interface AppAuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isAnonymous?: boolean;
  qatarId?: string;
  healthCardNumber?: string;
  patientType?: 'type-2' | 'pre-diabetes' | 'preventative' | 'type-1';
  loginProvider?: 'email' | 'google' | 'qatar_health' | 'guest';
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface RecordedMeal {
  id: string;
  name: string;
  nameAr?: string;
  mealType: MealType;
  takenAt: string; // ISO string
  displayTime: string; // e.g. "1:15 PM"
  displayDate: string; // e.g. "Today" or "Yesterday"
  sugarGrams: number;
  addedSugarGrams: number;
  teaspoons?: number;
  sugarCubes?: number;
  carbsGrams: number;
  proteinGrams: number;
  calories: number;
  spikeRisk: TrafficLight;
  predominantSugarType?: 'sucrose' | 'fructose' | 'glucose' | 'maltose' | 'lactose' | 'erythritol' | string;
  pubchemCid?: number;
  glycemicIndex?: number;
  glycemicLoad?: number;
  glucoseAtMeal?: number; // blood glucose reading in mg/dL around meal
  glucoseTiming?: 'fasting' | 'pre_meal' | 'post_meal' | 'random';
  imageUrl?: string;
  source: 'ai_photo' | 'qr_scan' | 'kitchen_order' | 'quick_log' | 'catalog';
  notes?: string;
}

export interface NextMealSuggestion {
  targetMealType: MealType;
  dishName: {
    en: string;
    ar: string;
  };
  kitchenOrLocation: {
    en: string;
    ar: string;
  };
  imageUrl: string;
  sugarGrams: number;
  addedSugarGrams: number;
  carbsGrams: number;
  proteinGrams: number;
  calories: number;
  glycemicImpact: 'LOW' | 'MEDIUM';
  clinicalRationale: {
    en: string;
    ar: string;
  };
  actionableSequencingTip: {
    en: string;
    ar: string;
  };
  waiterScript: {
    en: string;
    ar: string;
  };
  kitchenMealId?: string;
  priceQAR?: number;
  optionLabel?: {
    en: string;
    ar: string;
  };
  badge?: {
    en: string;
    ar: string;
  };
}

export interface PersonalizedNextMealPlan {
  primarySuggestion: NextMealSuggestion;
  alternativeSuggestions: NextMealSuggestion[];
  historicalAnalysis: {
    lastLoggedGlucose: number;
    glucoseStatus: 'elevated' | 'optimal' | 'low' | 'critical_high';
    todayMealsCount: number;
    todayTotalSugarGrams: number;
    remainingSugarBudgetGrams: number;
    targetDailySugar: number;
    lastMealName: string;
    lastMealSugar: number;
    lastMealTimeDisplay: string;
    hasRecentSugarSpikes: boolean;
    clinicalMessageEn: string;
    clinicalMessageAr: string;
  };
}
