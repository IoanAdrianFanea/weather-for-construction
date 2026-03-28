import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { isDark, toggle } = useTheme();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
      
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-600">Measurement Units</h3>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex justify-between items-center">
          <span>Temperature</span>
          <span className="text-blue-500 font-bold">°C</span>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex justify-between items-center">
          <span>Wind Speed</span>
          <span className="text-blue-500 font-bold">km/h</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-600">Site Preferences</h3>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex justify-between items-center">
          <span>Safety Alerts</span>
          <div className="w-10 h-5 bg-blue-500 rounded-full relative">
            <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex justify-between items-center">
          <span>Default Site</span>
          <span className="text-slate-500">Southbank Site A</span>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex justify-between items-center">
          <span>Theme</span>
          <div
            onClick={toggle}
            className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${isDark ? 'bg-blue-500' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${isDark ? 'left-5' : 'left-0.5'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;