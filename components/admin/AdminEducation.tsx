import React, { useState } from 'react';
import { AdminSubViewProps } from './types';
import { Save, ArrowLeft, Plus, Trash2, Laptop, Briefcase, Globe, BookOpen, Monitor } from 'lucide-react';
import { EducationCourseConfig, JobOpeningConfig, EducationIconKey } from '../../context/AppConfigContext';

const ICON_OPTIONS: { key: EducationIconKey; label: string; icon: React.ElementType }[] = [
  { key: 'Laptop', label: 'Laptop', icon: Laptop },
  { key: 'Briefcase', label: 'Briefcase', icon: Briefcase },
  { key: 'Globe', label: 'Globe', icon: Globe },
  { key: 'BookOpen', label: 'BookOpen', icon: BookOpen },
  { key: 'Monitor', label: 'Monitor', icon: Monitor },
];

export default function AdminEducation({ draft, setDraft, labels, language, onSave, onBack }: AdminSubViewProps) {
  const [activeTab, setActiveTab] = useState<'courses' | 'jobOpenings'>('courses');

  const addCourse = () => {
    setDraft(prev => ({
      ...prev,
      education: {
        ...prev.education,
        courses: [
          ...(prev.education?.courses || []),
          { id: `course-${Date.now()}`, title: { en: '', bn: '' }, iconKey: 'Laptop', color: 'bg-blue-500', link: '' }
        ]
      }
    }));
  };

  const updateCourse = (idx: number, patch: Partial<EducationCourseConfig>) => {
    setDraft(prev => {
      const newList = [...(prev.education?.courses || [])];
      newList[idx] = { ...newList[idx], ...patch };
      return { ...prev, education: { ...prev.education, courses: newList } };
    });
  };

  const removeCourse = (idx: number) => {
    setDraft(prev => ({
      ...prev,
      education: { ...prev.education, courses: (prev.education?.courses || []).filter((_, i) => i !== idx) }
    }));
  };

  const addJobOpening = () => {
    setDraft(prev => ({
      ...prev,
      education: {
        ...prev.education,
        jobOpenings: [
          ...(prev.education?.jobOpenings || []),
          { id: `job-${Date.now()}`, title: { en: '', bn: '' }, company: { en: '', bn: '' }, type: '', location: { en: '', bn: '' } }
        ]
      }
    }));
  };

  const updateJobOpening = (idx: number, patch: Partial<JobOpeningConfig>) => {
    setDraft(prev => {
      const newList = [...(prev.education?.jobOpenings || [])];
      newList[idx] = { ...newList[idx], ...patch };
      return { ...prev, education: { ...prev.education, jobOpenings: newList } };
    });
  };

  const removeJobOpening = (idx: number) => {
    setDraft(prev => ({
      ...prev,
      education: { ...prev.education, jobOpenings: (prev.education?.jobOpenings || []).filter((_, i) => i !== idx) }
    }));
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-indigo-50 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-indigo-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-indigo-700" />
        </button>
        <div>
          <h3 className="font-black text-gray-800 text-xl">{language === 'bn' ? 'শিক্ষা ও তরুণ কনফিগারেশন' : 'Education & Youth Setup'}</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 opacity-70">
            {language === 'bn' ? 'কোর্স এবং চাকরির খবর' : 'Manage courses & jobs'}
          </p>
        </div>
      </div>

      <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-black whitespace-nowrap transition-all ${
            activeTab === 'courses' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Laptop className="w-4 h-4" />
          {language === 'bn' ? 'অনলাইন কোর্স' : 'Online Courses'}
        </button>
        <button
          onClick={() => setActiveTab('jobOpenings')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-black whitespace-nowrap transition-all ${
            activeTab === 'jobOpenings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          {language === 'bn' ? 'চাকরির খবর' : 'Job Openings'}
        </button>
      </div>

      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex justify-end mb-2">
            <button onClick={addCourse} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
              <Plus className="w-4 h-4" />
              {language === 'bn' ? 'কোর্স যোগ করুন' : 'Add Course'}
            </button>
          </div>
          {(draft.education?.courses || []).map((course, idx) => (
            <div key={course.id} className="border border-gray-100 rounded-[2rem] p-5 bg-gray-50/40">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${course.color || 'bg-indigo-500'} flex items-center justify-center text-white`}>
                    {ICON_OPTIONS.find(opt => opt.key === course.iconKey)?.icon({ className: "w-5 h-5" }) || <Laptop className="w-5 h-5" />}
                  </div>
                </div>
                <button onClick={() => removeCourse(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Title (বাংলা)</label>
                  <input value={course.title.bn} onChange={(e) => updateCourse(idx, { title: { ...course.title, bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Title (English)</label>
                  <input value={course.title.en} onChange={(e) => updateCourse(idx, { title: { ...course.title, en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Link URL</label>
                  <input value={course.link} onChange={(e) => updateCourse(idx, { link: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-mono text-sm" placeholder="https://" />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Icon</label>
                  <select value={course.iconKey} onChange={(e) => updateCourse(idx, { iconKey: e.target.value as EducationIconKey })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm">
                    {ICON_OPTIONS.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Color (Tailwind)</label>
                  <input value={course.color} onChange={(e) => updateCourse(idx, { color: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-mono text-sm" placeholder="bg-blue-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'jobOpenings' && (
        <div className="space-y-4">
          <div className="flex justify-end mb-2">
            <button onClick={addJobOpening} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
              <Plus className="w-4 h-4" />
              {language === 'bn' ? 'চাকরি যোগ করুন' : 'Add Job'}
            </button>
          </div>
          {(draft.education?.jobOpenings || []).map((job, idx) => (
            <div key={job.id} className="border border-gray-100 rounded-[2rem] p-5 bg-gray-50/40">
              <div className="flex justify-end mb-4">
                <button onClick={() => removeJobOpening(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Job Title (বাংলা)</label>
                  <input value={job.title.bn} onChange={(e) => updateJobOpening(idx, { title: { ...job.title, bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Job Title (English)</label>
                  <input value={job.title.en} onChange={(e) => updateJobOpening(idx, { title: { ...job.title, en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Company (বাংলা)</label>
                  <input value={job.company.bn} onChange={(e) => updateJobOpening(idx, { company: { ...job.company, bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Company (English)</label>
                  <input value={job.company.en} onChange={(e) => updateJobOpening(idx, { company: { ...job.company, en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Location (বাংলা)</label>
                  <input value={job.location.bn} onChange={(e) => updateJobOpening(idx, { location: { ...job.location, bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Location (English)</label>
                  <input value={job.location.en} onChange={(e) => updateJobOpening(idx, { location: { ...job.location, en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Job Type</label>
                  <input value={job.type} onChange={(e) => updateJobOpening(idx, { type: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm" placeholder="e.g. Full-time, Part-time" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={onSave} className="mt-6 w-full bg-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-600/30">
        <Save className="w-5 h-5" />
        {labels.save}
      </button>
    </div>
  );
}
