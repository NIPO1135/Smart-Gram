export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl?: string;
  textContext: string;
  quiz?: QuizQuestion[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  modules: Module[];
}

export const YOUTH_COURSES: Course[] = [
  {
    id: 'c_digital_marketing',
    title: 'Digital Marketing Basics',
    modules: [
      {
        id: 'm_1',
        title: 'বেসিকস অফ ফ্রিল্যান্সিং',
        lessons: [
          {
            id: 'l_1_1',
            title: 'ফ্রিল্যান্সিং কি?',
            textContext: 'ফ্রিল্যান্সিং হলো মুক্ত পেশা। আপনি ঘরে বসে দেশ-বিদেশের মানুষের কাজ করে দিয়ে টাকা আয় করতে পারবেন। এর জন্য আপনার দরকার দক্ষতা, একটি কম্পিউটার ও ইন্টারনেট সংযোগ।',
            quiz: [
              {
                id: 'q_1',
                question: 'ফ্রিল্যান্সিং কী?',
                options: ['সরকারি চাকরি', 'মুক্ত পেশা', 'ব্যবসা', 'খেলাধুলা'],
                correctAnswer: 1
              }
            ]
          },
          {
            id: 'l_1_2',
            title: 'ডিজিটাল মার্কেটিং কেন প্রয়োজন?',
            textContext: 'আজকাল মানুষ অনলাইনেই বেশি সময় কাটায়। তাই যেকোনো ব্যবসা বা উদ্যোগের প্রসারের জন্য ডিজিটাল মার্কেটিং সবচেয়ে ভালো ও সাশ্রয়ী মাধ্যম।',
            quiz: [
              {
                id: 'q_2',
                question: 'ডিজিটাল মার্কেটিং কেন সাশ্রয়ী?',
                options: ['টিভি বিজ্ঞাপনের চেয়ে কম খরচ', 'কোনো খরচ নেই', 'মানুষ পত্রিকা পড়ে না বলে', 'উপরের সব'],
                correctAnswer: 0
              }
            ]
          }
        ]
      },
      {
        id: 'm_2',
        title: 'ফেসবুক মার্কেটিং',
        lessons: [
          {
            id: 'l_2_1',
            title: 'ফেসবুক পেজ খোলা',
            textContext: 'একটি প্রফেশনাল ফেসবুক পেজ হলো আপনার ব্যবসার অনলাইন ঠিকানা। কভার ফটো ও লোগো সেট করে পেজটি সুন্দরভাবে সাজানো জরুরি।',
            quiz: [
              {
                id: 'q_3',
                question: 'ব্যবসার অনলাইন ঠিকানা হিসেবে নিচের কোনটি কাজ করে?',
                options: ['ফেসবুক পেজ', 'পাসপোর্ট', 'ট্রেড লাইসেন্স', 'সিম কার্ড'],
                correctAnswer: 0
              }
            ]
          }
        ]
      }
    ]
  }
];
