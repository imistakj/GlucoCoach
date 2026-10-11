import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize Google GenAI client if key exists
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiAvailable: !!aiClient,
    app: 'GlucoCoach Qatar',
  });
});

// Dual-Risk Supermarket Nutrition Label Analysis
app.post('/api/analyze-nutrition', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, textInput, productName, lang = 'en' } = req.body;

    if (!aiClient) {
      return res.status(503).json({
        error: 'Gemini API is not configured on the server. Falling back to local offline engine.',
        useFallback: true,
      });
    }

    const systemPrompt = `You are GlucoCoach Qatar's clinical nutrition AI engine specialized in diabetes prevention and food decision guidance for Qatar residents.
Analyze this food label/product according to the DUAL-RISK ENGINE:

1. DIABETES IMPACT ANALYSIS:
- Total Carbs (g per 100g or serving)
- Added/Free Sugars (g)
- Refined Starches assessment
- Dietary Fiber (g)
- Protein (g)
- Healthy Fats vs Trans/Saturated (g)
- Sodium (mg)
- Ultra-Processed Foods (UPF) NOVA indicator (1-4)
- Traffic Light Score: "LOW" (green), "MEDIUM" (amber), or "HIGH" (red) glucose impact score.
- Spike Velocity: "Slow", "Moderate", "Rapid"
- Culturally Relevant Qatari Swaps: Suggest 1-2 healthier local alternatives available in Qatar supermarkets (Al Meera, Lulu, Carrefour Qatar, Monoprix). E.g. Plain Greek/Baladna Laban with berries instead of sweetened yogurt; wholegrain pita/regag instead of white refined khubz; fresh unsweetened Laban Ayran; unsweetened cardamom gahwa.

2. FOOD SAFETY & USE-BY AWARENESS:
- Production / Expiry / Use-by date detected (if visible)
- Storage guidance (e.g., "Store refrigerated below 4°C", "Freeze remaining slices")
- GUARDRAIL: Strict separation of food safety from diabetes risk. NEVER mark an item as "unsafe" solely because it is near expiry! Show a "Use-By Awareness" advisory with practical food-waste prevention and safe storage.

Language preference: ${lang === 'ar' ? 'Arabic with clear health terms' : 'English with Qatar cultural terms'}.

Return ONLY valid JSON matching this schema:
{
  "productName": "string",
  "category": "string",
  "servingSize": "string",
  "nutrition": {
    "carbs": number,
    "addedSugars": number,
    "fiber": number,
    "protein": number,
    "fats": number,
    "sodium": number
  },
  "upfLevel": 1 | 2 | 3 | 4,
  "trafficLight": "LOW" | "MEDIUM" | "HIGH",
  "glucoseImpactReason": "string",
  "spikeVelocity": "Slow" | "Moderate" | "Rapid",
  "qatarSwaps": [
    {
      "name": "string",
      "whyBetter": "string",
      "supermarketFound": "string"
    }
  ],
  "foodSafety": {
    "expiryDateFound": "string or null",
    "useByAdvisory": "string",
    "storageInstructions": "string",
    "isPastExpiry": boolean
  },
  "summaryTip": "string"
}`;

    const parts: any[] = [{ text: systemPrompt }];

    if (textInput || productName) {
      parts.push({
        text: `Product info provided by user: Name: ${productName || 'Unknown'}, Text: ${textInput || ''}`,
      });
    }

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType || 'image/jpeg',
        },
      });
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: parts,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error analyzing nutrition label:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze nutrition label',
      useFallback: true,
    });
  }
});

// Restaurant & Meal Photo Guidance Endpoint
app.post('/api/analyze-meal', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, mealDescription, diningContext = 'restaurant', lang = 'en' } = req.body;

    if (!aiClient) {
      return res.status(503).json({
        error: 'Gemini API not configured. Falling back to local offline engine.',
        useFallback: true,
      });
    }

    const prompt = `You are GlucoCoach Qatar's restaurant and meal point-of-decision assistant.
Analyze this meal/menu/receipt in the context of Qatar dining culture (e.g., Majlis dining, Qatari breakfast, Levantine/Khaleeji dinners, Karak tea stalls, biryani/machboos restaurants).

Provide:
1. Estimated carb and free sugar load (grams range).
2. Glucose spike likelihood: "Low", "Moderate", "High".
3. Immediate actionable meal-fit advice (e.g. "Fits your lunch target if you eat half the rice portion and add extra rocca/cucumber salad and grilled protein").
4. Culturally tailored swaps in Qatar (e.g. "Choose grilled shish tawook over deep-fried chicken", "Swap french fries for fatteh/tabbouleh", "Reduce balila/rice portion and double lean chicken/fish", "Order Karak tea with zero sugar or evaporated low-fat milk").
5. "Order Script / Majlis Navigator": 1-2 polite phrases to say to the waiter or host in Arabic and English (e.g. 'Please put the sauce on the side / لو سمحت الصلصة على جنب', 'Half rice portion please / نصف كمية الأرز من فضلك').

Language requested: ${lang === 'ar' ? 'Arabic' : 'English'}.

Return ONLY valid JSON matching this schema:
{
  "dishName": "string",
  "estimatedCarbsRange": "string",
  "estimatedSugarsRange": "string",
  "spikeRisk": "Low" | "Moderate" | "High",
  "actionableMealFit": "string",
  "swaps": [
    {
      "original": "string",
      "recommendedSwap": "string",
      "healthBenefit": "string"
    }
  ],
  "majlisTips": "string",
  "waiterScript": {
    "en": "string",
    "ar": "string"
  }
}`;

    const parts: any[] = [{ text: prompt }];

    if (mealDescription) {
      parts.push({ text: `Meal or Menu Text: ${mealDescription}` });
    }

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType || 'image/jpeg',
        },
      });
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: parts,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error analyzing meal:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze meal',
      useFallback: true,
    });
  }
});

// Dedicated AI Sugar Calculation & Adaptive Previous-Day Meal Suggestion Endpoint
app.post('/api/calculate-food-sugar', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, foodDescription, previousDayGlucose = 122, lang = 'en' } = req.body;

    if (!aiClient) {
      return res.status(503).json({
        error: 'Gemini API not configured. Falling back to local offline engine.',
        useFallback: true,
      });
    }

    const prompt = `You are GlucoCoach Qatar's clinical nutrition AI and biochemical sugar calculator.
Task:
1. Examine the user's food picture/description carefully.
2. Calculate the exact sugar contents:
   - Total Sugar (grams)
   - Added / Free Sugars (grams)
   - Natural / Intrinsic Sugars (grams)
   - Estimated Total Carbohydrates (grams)
   - Calories (kcal)
   - Sugar equivalent in teaspoons (grams / 4.2)
   - Sugar equivalent in standard sugar cubes (grams / 4.0)
   - Predominant biochemical sugar species:
     * "sucrose" (PubChem CID 5988, Table Sugar, C12H22O11)
     * "fructose" (PubChem CID 5984, Fruit Sugar / Agave / Corn syrup, C6H12O6)
     * "glucose" (PubChem CID 5793, Dextrose, C6H12O6)
   - Estimated Glycemic Index (GI: 0-100) and Glycemic Load (GL)
   - Spike Velocity: "Slow" | "Moderate" | "Rapid"

3. ADAPTIVE LOCAL MEAL SUGGESTION BASED ON PREVIOUS DAY'S SUGAR/GLUCOSE LEVEL:
   - The user recorded yesterday's glucose level as: ${previousDayGlucose} mg/dL.
   - If yesterday's level was ELEVATED (>130 fasting or >160 post-meal): Recommend a therapeutic low-glycemic restorative meal from an authentic local Qatar restaurant or home preparation (e.g., Grilled Hamour / Sea Bass with Rocca salad from Souq Waqif, or Mazzraty Shish Tawook with zero-carb Toum and cucumber laban) that helps restore insulin sensitivity and avoid compounded glycemic load.
   - If yesterday's level was OPTIMAL (<120 mg/dL): Recommend a balanced traditional Qatari meal with controlled portions of whole grains (e.g., Machboos with 1/2 cup basmati rice + high fiber daqoos & rocca).
   - If yesterday's level was LOW (<70 mg/dL): Recommend complex carbs with healthy fats.

Language: ${lang === 'ar' ? 'Arabic with Qatari terms and medical accuracy' : 'English with Qatari cultural contexts'}.

Return ONLY valid JSON matching this schema:
{
  "dishName": "string",
  "servingEstimated": "string",
  "totalSugarGrams": number,
  "addedSugarGrams": number,
  "naturalSugarGrams": number,
  "totalCarbsGrams": number,
  "calories": number,
  "teaspoons": number,
  "sugarCubes": number,
  "predominantSugarType": "sucrose" | "fructose" | "glucose",
  "pubchemCid": number,
  "glycemicIndex": number,
  "glycemicLoad": number,
  "spikeVelocity": "Slow" | "Moderate" | "Rapid",
  "scientificMetabolicExplanation": "string",
  "previousDayContext": {
    "recordedLevel": number,
    "status": "elevated" | "optimal" | "low",
    "clinicalInsight": "string",
    "suggestedHealthyMeal": {
      "name": "string",
      "restaurantOrLocation": "string",
      "whyBeneficialToday": "string",
      "orderScript": "string",
      "carbsAndSugarSummary": "string"
    }
  }
}`;

    const parts: any[] = [{ text: prompt }];

    if (foodDescription) {
      parts.push({ text: `Food description: ${foodDescription}` });
    }

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType || 'image/jpeg',
        },
      });
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: parts,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error calculating food sugar:', error);
    return res.status(500).json({
      error: error.message || 'Failed to calculate food sugar',
      useFallback: true,
    });
  }
});

// Configure Vite or Static Serve
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GlucoCoach Qatar server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
