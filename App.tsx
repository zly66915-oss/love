
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultsView from './components/ResultsView';
import { analyzeImagePresence } from './services/geminiService';
import { AnalysisState, ImageData } from './types';
import { Loader2, ShieldCheck, ShieldAlert, Users, Search, Share2, Target } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isAnalyzing: false,
    error: null,
    description: null,
    matches: [],
  });
  const [preview, setPreview] = useState<string | null>(null);

  const processImage = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      const previewUrl = reader.result as string;
      setPreview(previewUrl);

      setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
      
      try {
        const imageData: ImageData = {
          base64: base64String,
          mimeType: file.type,
        };

        const result = await analyzeImagePresence(imageData);
        setState({
          isAnalyzing: false,
          error: null,
          description: result.description,
          matches: result.matches,
        });
      } catch (err: any) {
        setState(prev => ({ 
          ...prev, 
          isAnalyzing: false, 
          error: err.message || "حدث خطأ غير متوقع." 
        }));
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const resetSearch = () => {
    setState({
      isAnalyzing: false,
      error: null,
      description: null,
      matches: [],
    });
    setPreview(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        {!state.description && !state.isAnalyzing && (
          <div className="text-center mb-16 space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-bold tracking-wide uppercase">
              <Target size={16} />
              بحث مخصص لشبكات التواصل الاجتماعي فقط
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              كاشف الانتحال في <span className="text-blue-600">السوشيال ميديا</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              قم برفع صورتك وسنقوم بمسح شامل لـ (فيسبوك، إنستغرام، تيك توك، X) للعثور على أي حسابات أو منشورات تستخدم هويتك البصرية.
            </p>
          </div>
        )}

        <div className="relative">
          {state.isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="relative">
                <Loader2 size={64} className="text-blue-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full animate-ping"></div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-gray-800">جاري البحث في ملفات التواصل الاجتماعي...</h3>
                <p className="text-gray-500">نحن نستبعد المواقع العامة ونركز فقط على الحسابات الشخصية والمنشورات الاجتماعية</p>
              </div>
            </div>
          )}

          {!state.isAnalyzing && !state.description && (
            <ImageUploader onImageSelect={processImage} isLoading={state.isAnalyzing} />
          )}

          {state.error && (
            <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-700">
              <ShieldAlert className="flex-shrink-0" />
              <p className="font-medium">{state.error}</p>
              <button onClick={resetSearch} className="mr-auto px-4 py-2 bg-red-100 hover:bg-red-200 rounded-xl transition-colors">إعادة المحاولة</button>
            </div>
          )}

          {!state.isAnalyzing && state.description && preview && (
            <ResultsView 
              description={state.description}
              matches={state.matches}
              imagePreview={preview}
              onReset={resetSearch}
            />
          )}
        </div>

        {!state.description && !state.isAnalyzing && (
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Users className="text-blue-500" />}
              title="كشف انتحال الشخصية"
              description="تحديد الحسابات المزيفة التي تستخدم صورتك للاحتيال أو تضليل الآخرين على المنصات الاجتماعية."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-green-500" />}
              title="فلترة دقيقة"
              description="نظام ذكي يستبعد المواقع الإخبارية والعامة ليركز فقط على نشاط السوشيال ميديا الحقيقي."
            />
            <FeatureCard 
              icon={<Share2 className="text-purple-500" />}
              title="تتبع المنشورات"
              description="البحث عن منشورات الصور العامة في المجموعات والصفحات المفتوحة عبر الشبكات الكبرى."
            />
          </div>
        )}
      </main>

      <footer className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <p className="text-gray-400 text-sm">© 2024 كاشف الصور الذكي - محرك البحث الاجتماعي المتخصص.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">{icon}</div>
    <h4 className="text-xl font-bold text-gray-900 mb-3">{title}</h4>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default App;
