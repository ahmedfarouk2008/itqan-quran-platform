
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  async getTeacherSuggestions(studentLevel: string, interest: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `بصفتك مستشاراً تعليمياً في منصة قرآن، اقترح 3 تخصصات للمعلمين تناسب طالب بمستوى ${studentLevel} ويهتم بـ ${interest}. أرجع النتيجة بتنسيق JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              specialty: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["specialty", "reason"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  },

  async analyzeTajweed(audioBase64: string, verse: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: `قم بتحليل أداء الطالب في تجويد الآية: "${verse}". ركز على مخارج الحروف وأحكام النون والميم الساكنة. قدم نصائح عملية باللغة العربية.` },
          { inlineData: { mimeType: 'audio/mp3', data: audioBase64 } }
        ]
      }
    });
    return response.text;
  },

  async getAyahTafsir(surah: string, ayah: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `اشرح باختصار تفسير الآية رقم ${ayah} من سورة ${surah} بأسلوب مبسط للطلاب.`
    });
    return response.text;
  }
};
