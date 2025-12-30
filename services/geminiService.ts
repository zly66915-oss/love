
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ImageData, SearchResult } from "../types";

export const analyzeImagePresence = async (image: ImageData): Promise<{
  description: string;
  matches: SearchResult[];
}> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    أنت الآن تعمل في وضع "الفحص العميق للخصوصية" (Deep Privacy Scan).
    المهمة: ابحث عن هذه الصورة في كافة زوايا شبكات التواصل الاجتماعي (Facebook, Instagram, X, TikTok, LinkedIn, Reddit).
    
    التركيز الخاص:
    1. ابحث عن أي "أثار" (Traces) لهذه الصورة حتى لو كانت في منشورات قديمة أو مجموعات (Groups) قد تكون مؤرشفة.
    2. ابحث عن "الحسابات الوهمية" التي قد تستخدم هذه الصورة كصورة ملف شخصي (هذه دائماً عامة حتى لو كان الحساب خاصاً).
    3. ابحث عن "الإشارات" (Mentions) أو الروابط التي تشير إلى وجود هذه الصورة في محتوى خارجي.
    4. اشرح للمستخدم أنك لا تستطيع اختراق الحسابات الخاصة المغلقة تقنياً، ولكنك تبحث عن "التسريبات" أو "الأرشفة" التي تمت لهذه الصور.
    
    ملاحظة: إذا وجدت روابط من منصات تواصل، اذكرها بدقة. إذا لم تجد، اشرح الاحتمالات التقنية لعدم ظهورها (مثل قوة إعدادات الخصوصية).
    اللغة: العربية.
  `;

  const imagePart = {
    inlineData: {
      mimeType: image.mimeType,
      data: image.base64,
    },
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { 
        parts: [
          imagePart, 
          { text: prompt }
        ] 
      },
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    const socialDomains = [
      'facebook.com', 'fb.com', 'instagram.com', 'instagr.am', 
      'twitter.com', 'x.com', 'linkedin.com', 'tiktok.com', 
      'reddit.com', 'pinterest.com', 'snapchat.com', 'threads.net'
    ];

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const matches: SearchResult[] = groundingChunks
      .filter((chunk: any) => {
        if (!chunk.web) return false;
        const url = chunk.web.uri.toLowerCase();
        return socialDomains.some(domain => url.includes(domain));
      })
      .map((chunk: any) => ({
        title: chunk.web.title || "رابط اجتماعي مكتشف",
        url: chunk.web.uri,
      }));

    let finalDescription = response.text || "لم يتم العثور على بيانات.";
    
    if (matches.length === 0) {
      finalDescription = "لم يتم العثور على أي 'أثر علني' لهذه الصورة. \n\nتوضيح بخصوص المنشورات الخاصة: تقنياً، المنشورات الموجهة لـ 'الأصدقاء فقط' أو في 'الحسابات المغلقة' لا يمكن لأي محرك بحث الوصول إليها لأنها محمية بتشفير المنصة. إذا كانت صورتك هناك، فهي بأمان عن أعين المتطفلين طالما لم يقم أحد الأشخاص الموثوقين بتسريبها أو إعادة نشرها بشكل عام.";
    }

    return { description: finalDescription, matches };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("حدث خطأ أثناء الفحص العميق. يرجى التأكد من اتصالك ومحاولة رفع الصورة مرة أخرى.");
  }
};
