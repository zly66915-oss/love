
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
              P
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
              كاشف <span className="text-blue-600">الصور</span>
            </h1>
          </div>
          <nav className="hidden md:flex space-x-reverse space-x-8">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">الرئيسية</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">عن الخدمة</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">الخصوصية</a>
          </nav>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-all shadow-md active:scale-95">
            ابدأ الآن
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
