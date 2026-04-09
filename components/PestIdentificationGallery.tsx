import React, { useState } from 'react';
import { ShieldPlus, X } from 'lucide-react';

type PestItem = {
  id: string;
  image: string;
  diseaseName: string;
  caption: string;
  treatment: string;
};

const pestItems: PestItem[] = [
  {
    id: 'pest-1',
    image:
      'https://images.unsplash.com/photo-1592982537447-6f2a6a0f4f8f?auto=format&fit=crop&w=900&q=80',
    diseaseName: 'ধানের ব্লাস্ট রোগ',
    caption: 'পাতায় ডিম্বাকৃতি দাগ দেখা যায়, দ্রুত ছড়িয়ে ফলন কমিয়ে দেয়।',
    treatment: 'আক্রান্ত পাতা তুলে ফেলুন, পরিমিত নাইট্রোজেন সার দিন এবং অনুমোদিত ছত্রাকনাশক ৭-১০ দিন পরপর প্রয়োগ করুন।',
  },
  {
    id: 'pest-2',
    image:
      'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?auto=format&fit=crop&w=900&q=80',
    diseaseName: 'টমেটোর লেট ব্লাইট',
    caption: 'পাতা ও ফলে কালচে দাগ হয়, আর্দ্র আবহাওয়ায় সংক্রমণ বেড়ে যায়।',
    treatment: 'গাছের ভেজা পাতা কমাতে সকালে সেচ দিন, আক্রান্ত অংশ সরান এবং তামা-ভিত্তিক ছত্রাকনাশক ব্যবহার করুন।',
  },
  {
    id: 'pest-3',
    image:
      'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80',
    diseaseName: 'বেগুনের ফল ও ডগা ছিদ্রকারী পোকা',
    caption: 'ডগা শুকিয়ে যায় ও ফলে ছিদ্র হয়, বাজারযোগ্যতা কমে যায়।',
    treatment: 'আক্রান্ত ডগা ও ফল নিয়মিত অপসারণ করুন, ফেরোমন ফাঁদ বসান এবং প্রয়োজনে নির্দেশনা অনুযায়ী কীটনাশক দিন।',
  },
  {
    id: 'pest-4',
    image:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80',
    diseaseName: 'আলুর আগাম ধসা',
    caption: 'পাতায় ছোট বাদামি দাগ হয়, রোগ বাড়লে গাছ দ্রুত দুর্বল হয়।',
    treatment: 'ফসল পর্যায়ক্রমে চাষ করুন, আক্রান্ত পাতা নষ্ট করুন এবং রোগ শুরুতেই সুরক্ষামূলক স্প্রে দিন।',
  },
  {
    id: 'pest-5',
    image:
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
    diseaseName: 'পাতা মোড়ানো ভাইরাস',
    caption: 'পাতা কুঁকড়ে যায় ও গাছের বৃদ্ধি কমে, ফলন উল্লেখযোগ্যভাবে কমে।',
    treatment: 'সাদা মাছি নিয়ন্ত্রণে স্টিকি ট্র্যাপ ব্যবহার করুন, আক্রান্ত গাছ তুলে ফেলুন এবং ভাইরাসমুক্ত চারা ব্যবহার করুন।',
  },
  {
    id: 'pest-6',
    image:
      'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=900&q=80',
    diseaseName: 'পাতা ঝলসানো রোগ',
    caption: 'পাতার কিনারা শুকিয়ে বাদামি হয়ে যায়, গাছের স্বাভাবিক বৃদ্ধি ব্যাহত হয়।',
    treatment: 'সুষম সারের সাথে পটাশ বাড়ান, পানি ব্যবস্থাপনা ঠিক রাখুন এবং প্রয়োজন হলে বিশেষজ্ঞের পরামর্শে স্প্রে করুন।',
  },
];

const PestIdentificationGallery: React.FC = () => {
  const [activeTreatment, setActiveTreatment] = useState<PestItem | null>(null);

  return (
    <>
      <section className="rounded-[2rem] border border-emerald-100 bg-white p-5 sm:p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg sm:text-xl font-black text-emerald-900">পোকা ও রোগ শনাক্তকরণ গ্যালারি</h3>
          <p className="mt-1 text-sm font-semibold text-gray-600">
            ছবি দেখে রোগ চিনুন এবং দ্রুত প্রতিকার নিন।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pestItems.map((item) => (
            <article key={item.id} className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
              <div className="relative group">
                <img
                  src={item.image}
                  alt={item.diseaseName}
                  className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => setActiveTreatment(item)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white shadow-lg hover:bg-emerald-700"
                  >
                    <ShieldPlus className="w-3.5 h-3.5" />
                    Treatment
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h4 className="text-sm sm:text-base font-black text-gray-800">{item.diseaseName}</h4>
                <p className="mt-1.5 text-sm font-medium text-gray-600 leading-relaxed">{item.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {activeTreatment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-5 sm:p-6 shadow-2xl">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h4 className="text-lg sm:text-xl font-black text-emerald-900">{activeTreatment.diseaseName}</h4>
              <button
                type="button"
                onClick={() => setActiveTreatment(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close treatment details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm font-semibold text-gray-700 leading-relaxed">{activeTreatment.treatment}</p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveTreatment(null)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-black text-white hover:bg-emerald-700"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PestIdentificationGallery;
