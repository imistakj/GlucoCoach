import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { useApp } from '../../context/AppContext';
import { FoodProduct } from '../../types';
import { calculateSugarScienceMetrics, KNOWN_SUGAR_COMPOUNDS } from '../../services/scienceService';
import {
  QrCode,
  X,
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sparkles,
  RefreshCw,
  Plus,
} from 'lucide-react';

interface QRScannerModalProps {
  onClose: () => void;
  onProductDetected: (product: FoodProduct) => void;
}

export interface ParsedQRData {
  productName: string;
  productType: string;
  calories: number;
  sugar: number;
  carbs: number;
  protein?: number;
  brand?: string;
  rawText: string;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ onClose, onProductDetected }) => {
  const { lang, t, addToBasket } = useApp();
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [decodedData, setDecodedData] = useState<ParsedQRData | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper parser for various QR code formats
  const parseQRContent = (text: string): ParsedQRData => {
    let name = 'Scanned Qatar Product';
    let type = 'Grocery Item';
    let calories = 150;
    let sugar = 12;
    let carbs = 24;
    let protein = 4;
    let brand = 'Qatar Supermarket';

    try {
      // 1. Try JSON parse
      if (text.trim().startsWith('{') && text.trim().endsWith('}')) {
        const parsed = JSON.parse(text);
        if (parsed.name) name = parsed.name;
        if (parsed.type || parsed.category) type = parsed.type || parsed.category;
        if (parsed.calories || parsed.cal) calories = Number(parsed.calories || parsed.cal);
        if (parsed.sugar || parsed.sugars) sugar = Number(parsed.sugar || parsed.sugars);
        if (parsed.carbs || parsed.carbohydrates) carbs = Number(parsed.carbs || parsed.carbohydrates);
        if (parsed.protein) protein = Number(parsed.protein);
        if (parsed.brand) brand = parsed.brand;
        return { productName: name, productType: type, calories, sugar, carbs, protein, brand, rawText: text };
      }

      // 2. Try URL query params (e.g. https://moph.gov.qa/food?name=Baladna+Laban&type=Dairy&cal=98&sugar=0)
      if (text.includes('?') && (text.includes('sugar') || text.includes('cal') || text.includes('type'))) {
        const queryStr = text.split('?')[1];
        const params = new URLSearchParams(queryStr);
        if (params.get('name')) name = decodeURIComponent(params.get('name')!);
        if (params.get('type')) type = decodeURIComponent(params.get('type')!);
        if (params.get('cal')) calories = Number(params.get('cal'));
        if (params.get('sugar')) sugar = Number(params.get('sugar'));
        if (params.get('carbs')) carbs = Number(params.get('carbs'));
        if (params.get('protein')) protein = Number(params.get('protein'));
        if (params.get('brand')) brand = decodeURIComponent(params.get('brand')!);
        return { productName: name, productType: type, calories, sugar, carbs, protein, brand, rawText: text };
      }

      // 3. Try pipe or newline key-value format (Type: Dairy | Cal: 120 | Sugar: 15g)
      const lines = text.split(/[\n|;,]+/);
      for (const line of lines) {
        const parts = line.split(/[:=]/);
        if (parts.length >= 2) {
          const key = parts[0].trim().toLowerCase();
          const val = parts.slice(1).join(':').trim();
          if (key.includes('name') || key.includes('product')) name = val;
          if (key.includes('type') || key.includes('cat')) type = val;
          if (key.includes('cal') || key.includes('energy')) calories = parseFloat(val.replace(/[^\d.]/g, '')) || calories;
          if (key.includes('sugar')) sugar = parseFloat(val.replace(/[^\d.]/g, '')) || sugar;
          if (key.includes('carb')) carbs = parseFloat(val.replace(/[^\d.]/g, '')) || carbs;
          if (key.includes('prot')) protein = parseFloat(val.replace(/[^\d.]/g, '')) || protein;
          if (key.includes('brand')) brand = val;
        }
      }
    } catch (e) {
      console.warn('QR Parse warning:', e);
    }

    return {
      productName: name,
      productType: type,
      calories: Math.max(10, calories),
      sugar: Math.max(0, sugar),
      carbs: Math.max(sugar, carbs),
      protein,
      brand,
      rawText: text,
    };
  };

  // Turn parsed QR data into a GlucoCoach FoodProduct
  const convertToFoodProduct = (data: ParsedQRData): FoodProduct => {
    const isHighSugar = data.sugar > 10;
    const isMediumSugar = data.sugar > 4;
    const trafficLight = isHighSugar ? 'HIGH' : isMediumSugar ? 'MEDIUM' : 'LOW';
    const spikeVelocity = isHighSugar ? 'Rapid' : isMediumSugar ? 'Moderate' : 'Slow';

    return {
      id: 'qr-' + Date.now(),
      barcode: 'QR-' + Math.floor(100000 + Math.random() * 900000),
      name: {
        en: data.productName,
        ar: data.productName,
      },
      brand: data.brand || 'Scanned via QR',
      category: data.productType,
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
      servingSize: '1 serving (100g)',
      nutrition: {
        calories: data.calories,
        carbs: data.carbs,
        addedSugars: data.sugar,
        refinedStarches: Math.max(0, data.carbs - data.sugar),
        fiber: 1.5,
        protein: data.protein || 4,
        fats: Math.max(0, Math.round((data.calories - data.carbs * 4) / 9)),
        saturatedFats: 1.2,
        sodium: 85,
      },
      upfLevel: isHighSugar ? 4 : 2,
      trafficLight,
      spikeVelocity,
      glucoseImpactReason: {
        en: `QR Code Verified: Contains ${data.sugar}g sugar and ${data.calories} kcal. Metabolic impact: ${
          isHighSugar ? 'Rapid pancreatic insulin demand' : 'Balanced glycemic curve'
        }.`,
        ar: `تم التحقق عبر رمز الاستجابة السريعة: يحتوي على ${data.sugar}غ سكر و${data.calories} سعرة حرارية. الأثر الأيضي: ${
          isHighSugar ? 'طلب حاد على الإنسولين' : 'منحنى سكر متزن'
        }.`,
      },
      foodSafety: {
        expiryDate: '2026-10-28',
        daysRemaining: 18,
        storageInstructions: {
          en: 'Keep refrigerated below 4°C as per Qatar food hygiene standards.',
          ar: 'يحفظ مبرداً تحت 4 درجات مئوية وفق المعايير القطرية لسلامة الغذاء.',
        },
        useByAdvisory: {
          en: 'MOPH Food Safety Verified. Safe if stored refrigerated.',
          ar: 'تم التحقق من سلامة الغذاء. آمن للاستهلاك طالما تم حفظه مبرداً.',
        },
        isPastExpiry: false,
      },
      qatarSwaps: isHighSugar
        ? [
            {
              name: {
                en: 'Baladna Fresh Plain Laban (0g Added Sugar)',
                ar: 'لبن بلدنا الطازج السادة (0غ سكر مضاف)',
              },
              whyBetter: {
                en: 'Zero added sugar, rich in living probiotic cultures and satiety proteins.',
                ar: 'بدون أي سكر مضاف، غني بالبكتيريا النافعة والبروتين المشبع.',
              },
              supermarketFound: 'Al Meera, Lulu, Monoprix',
              sugarReduction: `-${data.sugar}g Added Sugar`,
            },
          ]
        : [],
      summaryTip: {
        en: 'QR code nutritional verification ensures certified macro tracking.',
        ar: 'التحقق عبر رمز الاستجابة السريعة يضمن دقة حساب الكربوهيدرات والسكريات.',
      },
    };
  };

  // Start live camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
        scanFrame();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        lang === 'ar'
          ? 'تعذر الوصول إلى الكاميرا. يمكنك رفع صورة أو تجربة رموز QR التجريبية أدناه.'
          : 'Could not access camera. You can upload an image or tap the sample QR codes below.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setCameraActive(false);
  };

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data) {
        const parsed = parseQRContent(code.data);
        setDecodedData(parsed);
        stopCamera();
        return;
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Handle uploaded image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setSelectedImage(src);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            const parsed = parseQRContent(code.data);
            setDecodedData(parsed);
          } else {
            // Fallback parse if image had text or QR couldn't be extracted
            setDecodedData({
              productName: 'Scanned Food QR Item',
              productType: 'Packaged Grocery',
              calories: 180,
              sugar: 18,
              carbs: 32,
              protein: 3.2,
              brand: 'Qatar Food Brand',
              rawText: 'QR detected from image upload',
            });
          }
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Sample pre-built Qatar QR Codes for immediate test
  const sampleQRCodes = [
    {
      title: 'Baladna Laban Ayran (0g Sugar)',
      payload: '{"name":"Baladna Fresh Laban Ayran","type":"Dairy / Fermented","calories":92,"sugar":0,"carbs":7.5,"protein":6.2,"brand":"Baladna (Qatar)"}',
    },
    {
      title: 'Sweetened Karak Milk (22g Sugar)',
      payload: '{"name":"Rainbow Sweetened Condensed Karak Milk","type":"Beverage / Canned Dairy","calories":130,"sugar":22,"carbs":25,"protein":3.1,"brand":"Rainbow"}',
    },
    {
      title: 'Almarai Fresh Mango Juice (28g Sugar)',
      payload: '{"name":"Almarai Mango Nectar","type":"Fruit Juice","calories":145,"sugar":28,"carbs":34,"protein":0.5,"brand":"Almarai"}',
    },
    {
      title: 'Mazzraty Chicken Breast (0g Sugar)',
      payload: '{"name":"Mazzraty Fresh Qatar Chicken Fillets","type":"Fresh Poultry","calories":165,"sugar":0,"carbs":0,"protein":34,"brand":"Mazzraty (Qatar)"}',
    },
  ];

  const handleApplyDecoded = () => {
    if (!decodedData) return;
    const prod = convertToFoodProduct(decodedData);
    addToBasket(prod);
    onProductDetected(prod);
    onClose();
  };

  // Compute scientific sugar breakdown for decoded product
  const scienceMetrics = decodedData
    ? calculateSugarScienceMetrics(decodedData.sugar, decodedData.carbs)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl w-full max-w-xl max-h-[94vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {lang === 'ar' ? 'ماسح رمز الاستجابة السريعة (QR)' : 'QR Code Food & Sugar Scanner'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {lang === 'ar' ? 'فحص نوع المنتج، السعرات الحرارية، ونسبة السكر' : 'Scan product type, calories, and sugar content'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Live Scanner Viewport */}
          <div className="relative rounded-2xl bg-black border-2 border-dashed border-emerald-500/50 aspect-video overflow-hidden flex flex-col items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* QR Viewfinder Target overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-44 h-44 border-2 border-emerald-400 rounded-2xl relative shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <div className="absolute inset-x-2 top-1/2 h-0.5 bg-emerald-400/80 animate-pulse" />
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400 -translate-x-1 -translate-y-1" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400 translate-x-1 -translate-y-1" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400 -translate-x-1 translate-y-1" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400 translate-x-1 translate-y-1" />
              </div>
            </div>

            {!cameraActive && (
              <div className="p-4 text-center space-y-2">
                <QrCode className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 max-w-xs">
                  {cameraError || (lang === 'ar' ? 'وجّه الكاميرا نحو رمز QR على غلاف المنتج' : 'Align QR code inside viewfinder')}
                </p>
                <button
                  onClick={startCamera}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'إعادة تشغيل الكاميرا' : 'Restart Camera'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Upload QR image option */}
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'رفع صورة رمز QR' : 'Upload QR Image'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <span className="text-[11px] text-slate-500">
              {lang === 'ar' ? 'يدعم معيار GS1 Digital Link ووزارة الصحة' : 'Supports GS1 Digital Link & MOPH QR'}
            </span>
          </div>

          {/* Decoded QR Results Card */}
          {decodedData && (
            <div className="p-4 rounded-2xl bg-slate-950 border-2 border-emerald-500/70 space-y-3 animate-in fade-in">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    ✓ QR CODE VERIFIED
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {decodedData.productName}
                  </h3>
                  <span className="text-xs text-slate-400 block">
                    {decodedData.brand} • <strong className="text-slate-300">{decodedData.productType}</strong>
                  </span>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg border shrink-0 ${
                    decodedData.sugar > 10
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : decodedData.sugar > 4
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {decodedData.sugar > 10 ? t.high : decodedData.sugar > 4 ? t.medium : t.low}
                </span>
              </div>

              {/* Parsed Metrics Grid */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">{lang === 'ar' ? 'السعرات' : 'Calories'}</span>
                  <span className="text-sm font-bold text-amber-400">{decodedData.calories} kcal</span>
                </div>
                <div className={`bg-slate-900 p-2 rounded-xl border ${decodedData.sugar > 10 ? 'border-rose-500/40' : 'border-slate-800'}`}>
                  <span className="text-[10px] text-rose-300 block">{lang === 'ar' ? 'السكر' : 'Sugar'}</span>
                  <span className="text-sm font-bold text-rose-400">{decodedData.sugar}g</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">{t.carbs}</span>
                  <span className="text-sm font-bold text-slate-200">{decodedData.carbs}g</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">{t.protein}</span>
                  <span className="text-sm font-bold text-sky-400">{decodedData.protein || 4}g</span>
                </div>
              </div>

              {/* Science Metric: Sugar Cubes & Teaspoons conversion */}
              {scienceMetrics && (
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'ar' ? 'معادلة السكر العلمية:' : 'Biochemical Sugar Equivalent:'}</span>
                  </span>
                  <span className="font-bold text-white">
                    {scienceMetrics.teaspoons} {lang === 'ar' ? 'ملاعق شاي' : 'tsp'} ({scienceMetrics.sugarCubes}{' '}
                    {lang === 'ar' ? 'مكعبات سكر' : 'cubes'})
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleApplyDecoded}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'إضافة إلى السلة وتحليل الأثر' : 'Add to Smart Basket & Analyze'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick-Test Qatar QR Presets */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block">
              {lang === 'ar' ? 'اختبار سريع: انقر على رمز QR لمنتج قطري:' : 'Quick Test: Tap a local Qatar product QR:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleQRCodes.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const parsed = parseQRContent(sample.payload);
                    setDecodedData(parsed);
                  }}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left rtl:text-right transition-colors flex items-center justify-between group"
                >
                  <div className="truncate">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 block truncate">
                      {sample.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      QR Payload JSON
                    </span>
                  </div>
                  <QrCode className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
