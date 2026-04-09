import React, { useState } from 'react';
import { Lightbulb, X } from 'lucide-react';

const DailyFarmingTipCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tipOfTheDay =
    'আজ সকালে জমির মাটি হাতে নিয়ে আর্দ্রতা পরীক্ষা করুন। অতিরিক্ত শুকনা হলে হালকা সেচ দিন, তবে পানি জমতে দেবেন না।';

  return (
    <>
      <section className="rounded-3xl border border-green-100 bg-[#f0fdf4] p-5 sm:p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-2.5 text-green-700 shadow-sm">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-black text-green-900">আজকের কৃষি পরামর্শ</h3>
            <div className="mt-3 rounded-2xl border border-green-200 bg-white/70 p-4">
              <p className="text-sm sm:text-base font-semibold leading-relaxed text-gray-700">{tipOfTheDay}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-4 rounded-xl bg-green-600 px-4 py-2 text-sm font-black text-white transition-colors hover:bg-green-700"
            >
              Read More
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-5 sm:p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <h4 className="text-lg sm:text-xl font-black text-green-900">বিস্তারিত কৃষি নির্দেশনা</h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm sm:text-base font-semibold leading-relaxed text-gray-700">
              <p>১) সকালে বা বিকেলে সেচ দিন, দুপুরের বেশি রোদে সেচ দিলে পানি দ্রুত বাষ্প হয়ে যায়।</p>
              <p>২) পাতার রং হলদে হলে নাইট্রোজেনের ঘাটতি থাকতে পারে, সুষম সার প্রয়োগ করুন।</p>
              <p>৩) জমিতে আগাছা থাকলে ৭-১০ দিনের মধ্যে পরিষ্কার করুন যাতে পুষ্টি অপচয় না হয়।</p>
              <p>৪) পোকা আক্রমণ দেখলে প্রথমে আক্রান্ত পাতা আলাদা করুন, তারপর নিরাপদ কীটনাশক নির্দেশনা মেনে ব্যবহার করুন।</p>
              <p>৫) আবহাওয়া পূর্বাভাস দেখে সেচ ও স্প্রে পরিকল্পনা করুন, বৃষ্টির ঠিক আগে স্প্রে এড়িয়ে চলুন।</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl bg-green-600 px-4 py-2 text-sm font-black text-white transition-colors hover:bg-green-700"
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

export default DailyFarmingTipCard;
