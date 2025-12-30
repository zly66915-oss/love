
import React, { useState, useMemo } from 'react';
import { 
  ExternalLink, 
  ShieldCheck, 
  Globe, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Youtube,
  ArrowLeft,
  LayoutGrid,
  ShieldAlert,
  Music,
  Info,
  CheckCircle2,
  Lock,
  EyeOff
} from 'lucide-react';
import { SearchResult } from '../types';

interface Props {
  description: string;
  matches: SearchResult[];
  onReset: () => void;
  imagePreview: string;
}

const getPlatformInfo = (url: string) => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.com')) return { name: 'Facebook', icon: <Facebook size={18} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' };
  if (lowerUrl.includes('instagram.com')) return { name: 'Instagram', icon: <Instagram size={18} />, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' };
  if (lowerUrl.includes('linkedin.com')) return { name: 'LinkedIn', icon: <Linkedin size={18} />, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100' };
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return { name: 'X / Twitter', icon: <Twitter size={18} />, color: 'text-gray-900', bg: 'bg-gray-100', border: 'border-gray-200' };
  if (lowerUrl.includes('tiktok.com')) return { name: 'TikTok', icon: <Music size={18} />, color: 'text-black', bg: 'bg-gray-100', border: 'border-gray-200' };
  return { name: 'منصة اجتماعية', icon: <Globe size={18} />, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' };
};

const ResultsView: React.FC<Props> = ({ description, matches, onReset, imagePreview }) => {
  const [filter, setFilter] = useState<string>('all');

  const platforms = useMemo(() => {
    const pSet = new Set<string>();
    matches.forEach(m => pSet.add(getPlatformInfo(m.url).name));
    return Array.from(pSet);
  }, [matches]);

  const filteredMatches = useMemo(() => {
    if (filter === 'all') return matches;
    return matches.filter(m => getPlatformInfo(m.url).name === filter);
  }, [matches, filter]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button onClick={onReset} className="group flex items-center gap-2 text-gray-700 hover:text-blue-600 font-bold transition-all bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>بحث جديد</span>
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
          <Lock size={14} />
          وضع الفحص العميق نشط
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
              <LayoutGrid size={16} className="text-blue-600" />
              الصورة المختبرة
            </h3>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <img src={imagePreview} alt="Source" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4 shadow-lg">
             <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase">
               <EyeOff size={16} />
               حقيقة تقنية
             </div>
             <p className="text-xs leading-relaxed text-slate-300">
               لا يمكن لأي أداة شرعية في العالم رؤية الصور في <b>الرسائل الخاصة</b> أو <b>الحسابات المغلقة</b>. إذا أخبرك أحد بذلك فهو يخدعك. نحن نبحث عن "التسريبات" والأرشفة العامة فقط.
             </p>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-blue-100 relative overflow-hidden">
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <ShieldCheck size={24} />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900">تقرير الخصوصية والتحليل العميق</h2>
              </div>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium text-sm md:text-base bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {description}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-gray-900">النتائج العلنية المكتشفة</h2>
                <p className="text-xs text-gray-500">تم فحص الأرشيف والحسابات العامة</p>
              </div>
            </div>
            
            {filteredMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredMatches.map((match, idx) => {
                  const platform = getPlatformInfo(match.url);
                  return (
                    <div key={idx} className={`group bg-white p-6 rounded-[2rem] border ${platform.border} hover:shadow-2xl transition-all duration-300 flex flex-col`}>
                      <div className="flex gap-4 items-start">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${platform.bg} ${platform.color}`}>
                           {platform.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${platform.bg} ${platform.color}`}>{platform.name}</span>
                          <h4 className="font-bold text-gray-900 truncate text-sm mt-1" title={match.title}>{match.title}</h4>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
                        <a href={match.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 px-5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-all w-full justify-center">
                          فتح المصدر <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white p-16 rounded-[3rem] border border-gray-100 text-center space-y-6 shadow-sm">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                  <ShieldCheck size={56} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900">صورتك في أمان</h3>
                  <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
                    لم يتم العثور على أي نسخ مسربة أو عامة لهذه الصورة. إذا كانت منشورة في حساب خاص، فهي لا تزال محمية وغير قابلة للبحث.
                  </p>
                </div>
              </div>
            )}
          </section>

          <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex flex-col md:flex-row gap-5 items-center">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg">
              <Info size={24} />
            </div>
            <div className="space-y-1 text-center md:text-right">
              <p className="text-sm font-black text-blue-900">كيف تحمي صورك الخاصة؟</p>
              <p className="text-xs text-blue-800 leading-relaxed">
                تأكد دائماً من تفعيل ميزة "الحساب الخاص" (Private) في إنستغرام وتويتر، وقم بضبط خصوصية منشورات فيسبوك لتكون لـ "الأصدقاء فقط". هذا هو الجدار الوحيد الذي يمنع صورك من الظهور في محركات البحث.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
