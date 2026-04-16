import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { readLocalStorageJson, removeLocalStorageKey, writeLocalStorageJson } from '../utils/storage';

export type LocalizedText = { en: string; bn: string };

export type DashboardCardId = 'emergency' | 'agriculture' | 'shopping' | 'blood';
export type DashboardIconKey = 'PhoneCall' | 'Sprout' | 'ShoppingBag' | 'Heart';

export interface DashboardCardConfig {
  id: DashboardCardId;
  enabled: boolean;
  iconKey: DashboardIconKey;
  color: string;
  lightColor: string;
  titleOverride?: LocalizedText;
  descOverride?: LocalizedText;
}

export type EmergencyIconKey = 'Siren' | 'Stethoscope' | 'Flame' | 'Zap' | 'Dog';

export interface EmergencyContactConfig {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  phone: string;
}

export type EmergencyCategoryId = 'ambulance' | 'doctor' | 'fire' | 'electricity' | 'animal';

export interface EmergencyCategoryConfig {
  id: EmergencyCategoryId;
  enabled: boolean;
  titleOverride?: LocalizedText;
  iconKey: EmergencyIconKey;
  color: string;
  contacts: EmergencyContactConfig[];
}

export interface HandmadeProductConfig {
  id: string;
  enabled: boolean;
  name: LocalizedText;
  price: number;
  unit: LocalizedText;
  image: string;
}

export type PopularProductIconKey = 'Milk' | 'Egg' | 'Fish' | 'Meat';

export interface PopularProductConfig {
  id: string;
  enabled: boolean;
  name: LocalizedText;
  iconKey: PopularProductIconKey;
  image?: string;
  color: string;
  price: string;
  unit: LocalizedText;
}

export interface FarmingTipConfig {
  id: string;
  enabled: boolean;
  cropName: LocalizedText;
  season: LocalizedText;
  description: LocalizedText;
}

export interface PestConfig {
  id: string;
  enabled: boolean;
  image: string;
  diseaseName: LocalizedText;
  caption: LocalizedText;
  treatment: LocalizedText;
}

export interface AgricultureConfig {
  dailyTip: LocalizedText;
  dailyInstructions: LocalizedText[];
  tips: FarmingTipConfig[];
  pests: PestConfig[];
}

export interface BloodDonorConfig {
  id: string;
  enabled: boolean;
  name: LocalizedText;
  group: string;
  location: LocalizedText;
  lastDonation: string;
  phone: string;
}

export interface BloodRequestConfig {
  id: string;
  enabled: boolean;
  group: string;
  location: LocalizedText;
  hospital: LocalizedText;
  bags: number;
  dateLabel: LocalizedText;
  urgent: boolean;
}

export interface BloodConfig {
  slogans: LocalizedText[];
  donors: BloodDonorConfig[];
  requests: BloodRequestConfig[];
}

export type HelpdeskServiceId = 'complaint' | 'info' | 'govt' | 'volunteer' | 'links';

export interface HelpdeskSubServiceConfig {
  id: HelpdeskServiceId;
  enabled: boolean;
  titleOverride?: LocalizedText;
}

export interface HelpdeskConfig {
  services: HelpdeskSubServiceConfig[];
}

export interface AppConfig {
  schemaVersion: 2;
  notices: LocalizedText;
  dashboardCards: DashboardCardConfig[];
  emergencyCategories: EmergencyCategoryConfig[];
  handmadeProducts: HandmadeProductConfig[];
  popularProducts: PopularProductConfig[];
  blood: BloodConfig;
  helpdesk: HelpdeskConfig;
  agriculture: AgricultureConfig;
}

const STORAGE_KEY = 'smart_village_app_config_v1';
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/app-config`;
const AUTH_SESSION_KEY = 'auth_session';

function getAuthHeader(): string | null {
  const raw = localStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed?.token === 'string' ? parsed.token : null;
  } catch {
    return null;
  }
}

const DEFAULT_CONFIG: AppConfig = {
  schemaVersion: 2,
  notices: {
    bn: 'গ্রামের সরকারি হাসপাতালে আগামী শুক্রবার বিনামূল্যে রক্ত পরীক্ষা করা হবে। | নতুন সার ভর্তুকির জন্য ইউনিয়ন পরিষদে যোগাযোগ করুন। | খেলাধুলা ক্লাবের পক্ষ থেকে আগামী রোববার ফুটবল টুনামেন্ট আয়োজন করা হবে।',
    en: 'Free blood checkups at the village government hospital next Friday. | Contact Union Parishad for new fertilizer subsidies. | Football tournament organized by the Sports Club this Sunday.',
  },
  helpdesk: {
    services: [
      { id: 'complaint', enabled: true },
      { id: 'info', enabled: true },
      { id: 'govt', enabled: true },
      { id: 'volunteer', enabled: true },
      { id: 'links', enabled: true },
    ],
  },
  dashboardCards: [
    {
      id: 'emergency',
      enabled: true,
      iconKey: 'PhoneCall',
      color: 'bg-red-500',
      lightColor: 'bg-red-50',
    },
    {
      id: 'agriculture',
      enabled: true,
      iconKey: 'Sprout',
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
    },
    {
      id: 'shopping',
      enabled: true,
      iconKey: 'ShoppingBag',
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
    },
    {
      id: 'blood',
      enabled: true,
      iconKey: 'Heart',
      color: 'bg-rose-500',
      lightColor: 'bg-rose-50',
    },
  ],
  emergencyCategories: [
    {
      id: 'ambulance',
      enabled: true,
      iconKey: 'Siren',
      color: 'bg-red-500',
      contacts: [
        {
          id: 'ambulance_1',
          name: {
            bn: 'রফিক অ্যাম্বুলেন্স',
            en: 'Rafiq Ambulance',
          },
          description: {
            bn: '২৪/৭ অক্সিজেন সুবিধা',
            en: '24/7 Oxygen Available',
          },
          phone: '01700000001',
        },
        {
          id: 'ambulance_2',
          name: {
            bn: 'আল-শিফা সার্ভিস',
            en: 'Al-Shifa Service',
          },
          description: {
            bn: 'গ্রামের প্রধান হাসপাতাল',
            en: 'Village Hospital Main',
          },
          phone: '01700000002',
        },
      ],
    },
    {
      id: 'doctor',
      enabled: true,
      iconKey: 'Stethoscope',
      color: 'bg-blue-500',
      contacts: [
        {
          id: 'doctor_1',
          name: {
            bn: 'উপজেলা স্বাস্থ্য কমপ্লেক্স',
            en: 'Upazila Health Complex',
          },
          description: {
            bn: 'জরুরী বিভাগ',
            en: 'Emergency Wing',
          },
          phone: '01700000003',
        },
        {
          id: 'doctor_2',
          name: {
            bn: 'ডা. সেলিম উদ্দিন',
            en: 'Dr. Selim Uddin',
          },
          description: {
            bn: 'মেডিক্যাল অফিসার',
            en: 'Medical Officer',
          },
          phone: '01700000004',
        },
      ],
    },
    {
      id: 'fire',
      enabled: true,
      iconKey: 'Flame',
      color: 'bg-orange-600',
      contacts: [
        {
          id: 'fire_1',
          name: {
            bn: 'ফায়ার সার্ভিস স্টেশন',
            en: 'Fire Service Station',
          },
          description: {
            bn: 'স্থানীয় সদরদপ্তর',
            en: 'Local HQ',
          },
          phone: '01700000005',
        },
        {
          id: 'fire_2',
          name: {
            bn: 'পুলিশ স্টেশন (থানা)',
            en: 'Police Station (Thana)',
          },
          description: {
            bn: 'ডিউটি অফিসার',
            en: 'Duty Officer',
          },
          phone: '01700000006',
        },
      ],
    },
    {
      id: 'electricity',
      enabled: true,
      iconKey: 'Zap',
      color: 'bg-yellow-600',
      contacts: [
        {
          id: 'electricity_1',
          name: {
            bn: 'পল্লী বিদ্যুৎ অফিস',
            en: 'Palli Bidyut Office',
          },
          description: {
            bn: 'অভিযোগ কেন্দ্র',
            en: 'Complaint Center',
          },
          phone: '01700000007',
        },
      ],
    },
    {
      id: 'animal',
      enabled: true,
      iconKey: 'Dog',
      color: 'bg-green-600',
      contacts: [
        {
          id: 'animal_1',
          name: {
            bn: 'ডা. করিম (পশু চিকিৎসক)',
            en: 'Dr. Karim (Vet Doctor)',
          },
          description: {
            bn: 'গবাদি পশু বিশেষজ্ঞ',
            en: 'Livestock Specialist',
          },
          phone: '01700000008',
        },
      ],
    },
  ],
  handmadeProducts: [
    {
      id: 'h1',
      enabled: true,
      name: {
        bn: 'খাঁটি ঘি',
        en: 'Pure Ghee',
      },
      price: 1200,
      unit: {
        bn: 'প্রতি কেজি',
        en: 'per kg',
      },
      image:
        'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'h2',
      enabled: true,
      name: {
        bn: 'নকশী কাঁথা',
        en: 'Nokshi Kantha',
      },
      price: 2500,
      unit: {
        bn: 'প্রতি টুকরা',
        en: 'per piece',
      },
      image:
        'https://images.unsplash.com/photo-1620163351988-1216a6741703?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'h3',
      enabled: true,
      name: {
        bn: 'মাটির কলসি',
        en: 'Earthen Pitcher',
      },
      price: 350,
      unit: {
        bn: 'প্রতি টুকরা',
        en: 'per piece',
      },
      image:
        'https://images.unsplash.com/photo-1590422443834-3112c8200676?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'h4',
      enabled: true,
      name: {
        bn: 'তালের পাখা',
        en: 'Palm Leaf Fan',
      },
      price: 50,
      unit: {
        bn: 'প্রতি টুকরা',
        en: 'per piece',
      },
      image:
        'https://images.unsplash.com/photo-1620163351988-1216a6741703?auto=format&fit=crop&w=300&q=80',
    },
  ],
  popularProducts: [
    {
      id: 'milk',
      enabled: true,
      name: {
        bn: 'দুধ',
        en: 'Milk',
      },
      iconKey: 'Milk',
      color: 'bg-blue-50 text-blue-500',
      price: '৮০',
      unit: {
        bn: 'প্রতি লিটার',
        en: 'per litre',
      },
    },
    {
      id: 'chicken-eggs',
      enabled: true,
      name: {
        bn: 'মুরগির ডিম',
        en: 'Chicken Eggs',
      },
      iconKey: 'Egg',
      color: 'bg-amber-50 text-amber-500',
      price: '৬০',
      unit: {
        bn: 'প্রতি হালি',
        en: 'per hali',
      },
    },
    {
      id: 'duck-eggs',
      enabled: true,
      name: {
        bn: 'হাঁসের ডিম',
        en: 'Duck Eggs',
      },
      iconKey: 'Egg',
      color: 'bg-orange-50 text-orange-500',
      price: '৭০',
      unit: {
        bn: 'প্রতি হালি',
        en: 'per hali',
      },
    },
  ],
  blood: {
    slogans: [
      {
        en: 'One drop of blood can save a life',
        bn: 'এক ফোঁটা রক্ত একটি জীবন বাঁচাতে পারে',
      },
      {
        en: 'Donate blood, save lives',
        bn: 'রক্ত দিন, জীবন বাঁচান',
      },
      {
        en: 'Your blood can give someone a second chance',
        bn: 'আপনার রক্ত কারো নতুন জীবনের সুযোগ দিতে পারে',
      },
    ],
    donors: [
      {
        id: '1',
        enabled: true,
        name: {
          bn: 'আরিফ আহমেদ',
          en: 'Arif Ahmed',
        },
        group: 'O+',
        location: {
          bn: 'দক্ষিণ গ্রাম',
          en: 'South Village',
        },
        lastDonation: '12-10-2023',
        phone: '01711111111',
      },
      {
        id: '2',
        enabled: true,
        name: {
          bn: 'সোহেল রানা',
          en: 'Sohel Rana',
        },
        group: 'A+',
        location: {
          bn: 'উত্তর পাড়া',
          en: 'North Para',
        },
        lastDonation: '05-01-2024',
        phone: '01722222222',
      },
      {
        id: '3',
        enabled: true,
        name: {
          bn: 'কামাল উদ্দিন',
          en: 'Kamal Uddin',
        },
        group: 'B+',
        location: {
          bn: 'পূর্ব গ্রাম',
          en: 'East Village',
        },
        lastDonation: '15-02-2024',
        phone: '01733333333',
      },
      {
        id: '4',
        enabled: true,
        name: {
          bn: 'রিনা আক্তার',
          en: 'Rina Akter',
        },
        group: 'O+',
        location: {
          bn: 'সদর বাজার',
          en: 'Sadar Bazar',
        },
        lastDonation: '20-12-2023',
        phone: '01744444444',
      },
    ],
    requests: [
      {
        id: 'r1',
        enabled: true,
        group: 'B-',
        location: {
          bn: 'গ্রাম হাসপাতাল',
          en: 'Village Hospital',
        },
        hospital: {
          bn: 'উপজেলা স্বাস্থ্য কমপ্লেক্স',
          en: 'Upazila Health Complex',
        },
        bags: 2,
        dateLabel: {
          bn: 'আজ',
          en: 'Today',
        },
        urgent: true,
      },
      {
        id: 'r2',
        enabled: true,
        group: 'O+',
        location: {
          bn: 'পূর্ব গ্রাম',
          en: 'East Village',
        },
        hospital: {
          bn: 'ক্লিনিক রোড',
          en: 'Clinic Road',
        },
        bags: 1,
        dateLabel: {
          bn: 'আগামীকাল',
          en: 'Tomorrow',
        },
        urgent: false,
      },
    ],
  },
  agriculture: {
    dailyTip: {
      bn: 'আজ সকালে জমির মাটি হাতে নিয়ে আর্দ্রতা পরীক্ষা করুন। অতিরিক্ত শুকনা হলে হালকা সেচ দিন, তবে পানি জমতে দেবেন না।',
      en: 'Check the soil moisture in your field this morning. If it is too dry, give a light irrigation, but avoid waterlogging.',
    },
    dailyInstructions: [
      { bn: '১) সকালে বা বিকেলে সেচ দিন, দুপুরের বেশি রোদে সেচ দিলে পানি দ্রুত বাষ্প হয়ে যায়।', en: '1) Irrigate in the morning or afternoon; watering in the midday sun causes rapid evaporation.' },
      { bn: '২) পাতার রং হলদে হলে নাইট্রোজেনের ঘাটতি থাকতে পারে, সুষম সার প্রয়োগ করুন।', en: '2) Yellowing leaves indicate a possible nitrogen deficiency; apply balanced fertilizer.' },
      { bn: '৩) জমিতে আগাছা থাকলে ৭-১০ দিনের মধ্যে পরিষ্কার করুন যাতে পুষ্টি অপচয় না হয়।', en: '3) If there are weeds in the field, clear them within 7-10 days to prevent nutrient waste.' },
      { bn: '৪) পোকা আক্রমণ দেখলে প্রথমে আক্রান্ত পাতা আলাদা করুন, তারপর নিরাপদ কীটনাশক নির্দেশনা মেনে ব্যবহার করুন।', en: '4) Upon seeing pest attacks, remove the affected leaves first, then use safe pesticides following instructions.' },
      { bn: '৫) আবহাওয়া পূর্বাভাস দেখে সেচ ও স্প্রে পরিকল্পনা করুন, বৃষ্টির ঠিক আগে স্প্রে এড়িয়ে চলুন।', en: '5) Check weather forecasts before planning irrigation and spraying; avoid spraying right before rain.' },
    ],
    tips: [
      {
        id: 'tip-1',
        enabled: true,
        cropName: { bn: 'ধান', en: 'Rice' },
        season: { bn: 'বর্ষা', en: 'Monsoon' },
        description: {
          bn: 'চারার বয়স ২০-২৫ দিন হলে রোপণ করুন এবং জমিতে ২-৩ সেমি পানি ধরে রাখুন।',
          en: 'Transplant seedlings when 20-25 days old and maintain 2-3 cm standing water in the field.',
        },
      },
      {
        id: 'tip-2',
        enabled: true,
        cropName: { bn: 'গম', en: 'Wheat' },
        season: { bn: 'শীত', en: 'Winter' },
        description: {
          bn: 'জমি ভালোভাবে ঝুরঝুরে করে বপন করুন এবং আগাছা ২০ দিনের মধ্যে পরিষ্কার করুন।',
          en: 'Prepare fine soil before sowing and remove weeds within the first 20 days.',
        },
      },
      {
        id: 'tip-3',
        enabled: true,
        cropName: { bn: 'আলু', en: 'Potato' },
        season: { bn: 'শীত', en: 'Winter' },
        description: {
          bn: 'বীজ আলু কাটার পর ছায়ায় শুকিয়ে রোপণ করুন, জমিতে পানি জমতে দেবেন না।',
          en: 'Dry seed potato pieces in shade before planting and avoid waterlogging.',
        },
      },
      {
        id: 'tip-4',
        enabled: true,
        cropName: { bn: 'টমেটো', en: 'Tomato' },
        season: { bn: 'শীত', en: 'Winter' },
        description: {
          bn: 'সুষম সার ব্যবহার করুন এবং গাছে খুঁটি দিন যাতে ফল মাটিতে না লাগে।',
          en: 'Use balanced fertilizer and support plants with stakes to protect fruits.',
        },
      },
      {
        id: 'tip-5',
        enabled: true,
        cropName: { bn: 'পেঁয়াজ', en: 'Onion' },
        season: { bn: 'রবি', en: 'Rabi' },
        description: {
          bn: 'পাতা হলদে হওয়া শুরু করলে সেচ কমিয়ে দিন, তারপর তুলুন ও শুকান।',
          en: 'Reduce irrigation when leaves turn yellow, then harvest and cure properly.',
        },
      },
    ],
    pests: [
      {
        id: 'pest-1',
        enabled: true,
        image: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0f4f8f?auto=format&fit=crop&w=900&q=80',
        diseaseName: { bn: 'ধানের ব্লাস্ট রোগ', en: 'Rice Blast Disease' },
        caption: {
          bn: 'পাতায় ডিম্বাকৃতি দাগ দেখা যায়, দ্রুত ছড়িয়ে ফলন কমিয়ে দেয়।',
          en: 'Oval spots appear on leaves, spreading quickly and reducing yield.',
        },
        treatment: {
          bn: 'আক্রান্ত পাতা তুলে ফেলুন, পরিমিত নাইট্রোজেন সার দিন এবং অনুমোদিত ছত্রাকনাশক ৭-১০ দিন পরপর প্রয়োগ করুন।',
          en: 'Remove infected leaves, apply adequate nitrogen, and use approved fungicide every 7-10 days.',
        },
      },
      {
        id: 'pest-2',
        enabled: true,
        image: 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?auto=format&fit=crop&w=900&q=80',
        diseaseName: { bn: 'টমেটোর লেট ব্লাইট', en: 'Tomato Late Blight' },
        caption: {
          bn: 'পাতা ও ফলে কালচে দাগ হয়, আর্দ্র আবহাওয়ায় সংক্রমণ বেড়ে যায়।',
          en: 'Dark spots form on leaves and fruits, infections increase in humid weather.',
        },
        treatment: {
          bn: 'গাছের ভেজা পাতা কমাতে সকালে সেচ দিন, আক্রান্ত অংশ সরান এবং তামা-ভিত্তিক ছত্রাকনাশক ব্যবহার করুন।',
          en: 'Irrigate in the morning to reduce leaf wetness, remove infected parts, and use copper-based fungicide.',
        },
      },
      {
        id: 'pest-3',
        enabled: true,
        image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80',
        diseaseName: { bn: 'বেগুনের ফল ও ডগা ছিদ্রকারী পোকা', en: 'Eggplant Fruit & Shoot Borer' },
        caption: {
          bn: 'ডগা শুকিয়ে যায় ও ফলে ছিদ্র হয়, বাজারযোগ্যতা কমে যায়।',
          en: 'Shoots wither and fruits get bored, reducing marketability.',
        },
        treatment: {
          bn: 'আক্রান্ত ডগা ও ফল নিয়মিত অপসারণ করুন, ফেরোমন ফাঁদ বসান এবং প্রয়োজনে নির্দেশনা অনুযায়ী কীটনাশক দিন।',
          en: 'Regularly remove affected shoots and fruits, set pheromone traps, and use pesticide as instructed if necessary.',
        },
      },
      {
        id: 'pest-4',
        enabled: true,
        image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80',
        diseaseName: { bn: 'আলুর আগাম ধসা', en: 'Potato Early Blight' },
        caption: {
          bn: 'পাতায় ছোট বাদামি দাগ হয়, রোগ বাড়লে গাছ দ্রুত দুর্বল হয়।',
          en: 'Small brown spots on leaves, plants weaken quickly as disease progresses.',
        },
        treatment: {
          bn: 'ফসল পর্যায়ক্রমে চাষ করুন, আক্রান্ত পাতা নষ্ট করুন এবং রোগ শুরুতেই সুরক্ষামূলক স্প্রে দিন।',
          en: 'Practice crop rotation, destroy affected leaves, and apply protective spray at the onset.',
        },
      },
      {
        id: 'pest-5',
        enabled: true,
        image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
        diseaseName: { bn: 'পাতা মোড়ানো ভাইরাস', en: 'Leaf Curl Virus' },
        caption: {
          bn: 'পাতা কুঁকড়ে যায় ও গাছের বৃদ্ধি কমে, ফলন উল্লেখযোগ্যভাবে কমে।',
          en: 'Leaves curl up and plant growth slows, significantly reducing yield.',
        },
        treatment: {
          bn: 'সাদা মাছি নিয়ন্ত্রণে স্টিকি ট্র্যাপ ব্যবহার করুন, আক্রান্ত গাছ তুলে ফেলুন এবং ভাইরাসমুক্ত চারা ব্যবহার করুন।',
          en: 'Use sticky traps to control whiteflies, uproot infected plants, and use virus-free seedlings.',
        },
      },
      {
        id: 'pest-6',
        enabled: true,
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=900&q=80',
        diseaseName: { bn: 'পাতা ঝলসানো রোগ', en: 'Leaf Blight' },
        caption: {
          bn: 'পাতার কিনারা শুকিয়ে বাদামি হয়ে যায়, গাছের স্বাভাবিক বৃদ্ধি ব্যাহত হয়।',
          en: 'Leaf edges dry up and turn brown, hindering normal plant growth.',
        },
        treatment: {
          bn: 'সুষম সারের সাথে পটাশ বাড়ান, পানি ব্যবস্থাপনা ঠিক রাখুন এবং প্রয়োজন হলে বিশেষজ্ঞের পরামর্শে স্প্রে করুন।',
          en: 'Increase potash with balanced fertilizer, manage water well, and spray on expert advice if needed.',
        },
      },
    ],
  },
};

const ALLOWED_ICON_KEYS: DashboardIconKey[] = ['PhoneCall', 'Sprout', 'ShoppingBag', 'Heart'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function coerceLocalizedText(value: unknown, fallback: LocalizedText): LocalizedText {
  if (!isRecord(value)) return fallback;
  const en = typeof value.en === 'string' ? value.en : fallback.en;
  const bn = typeof value.bn === 'string' ? value.bn : fallback.bn;
  return { en, bn };
}

function coerceIconKey(value: unknown, fallback: DashboardIconKey): DashboardIconKey {
  if (typeof value !== 'string') return fallback;
  return (ALLOWED_ICON_KEYS as string[]).includes(value) ? (value as DashboardIconKey) : fallback;
}

function coerceDashboardCard(
  value: unknown,
  fallback: DashboardCardConfig,
): DashboardCardConfig {
  if (!isRecord(value)) return fallback;
  return {
    ...fallback,
    enabled: typeof value.enabled === 'boolean' ? value.enabled : fallback.enabled,
    iconKey: coerceIconKey(value.iconKey, fallback.iconKey),
    color: typeof value.color === 'string' ? value.color : fallback.color,
    lightColor: typeof value.lightColor === 'string' ? value.lightColor : fallback.lightColor,
    titleOverride: value.titleOverride ? coerceLocalizedText(value.titleOverride, fallback.titleOverride ?? { en: '', bn: '' }) : fallback.titleOverride,
    descOverride: value.descOverride ? coerceLocalizedText(value.descOverride, fallback.descOverride ?? { en: '', bn: '' }) : fallback.descOverride,
  };
}

function mergeDashboardCards(raw: unknown, defaults: DashboardCardConfig[]): DashboardCardConfig[] {
  const defaultById = new Map<DashboardCardId, DashboardCardConfig>(defaults.map(d => [d.id, d]));
  const allowedIds = new Set<DashboardCardId>(defaults.map(d => d.id));

  const storedArray = Array.isArray(raw) ? raw : [];
  const storedById = new Map<DashboardCardId, unknown>();
  const storedOrder: DashboardCardId[] = [];

  for (const item of storedArray) {
    if (!isRecord(item)) continue;
    const id = item.id;
    if (id === 'emergency' || id === 'agriculture' || id === 'shopping' || id === 'blood') {
      storedById.set(id, item);
      if (!storedOrder.includes(id)) storedOrder.push(id);
    }
  }

  for (const def of defaults) {
    if (!storedOrder.includes(def.id)) storedOrder.push(def.id);
  }

  return storedOrder
    .filter((id) => allowedIds.has(id))
    .map((id) => coerceDashboardCard(storedById.get(id), defaultById.get(id)!));
}

function coerceAppConfig(raw: unknown): AppConfig {
  if (!isRecord(raw)) return DEFAULT_CONFIG;

  const notices = coerceLocalizedText(raw.notices, DEFAULT_CONFIG.notices);
  const dashboardCards = mergeDashboardCards(raw.dashboardCards, DEFAULT_CONFIG.dashboardCards);
  const emergencyCategories =
    Array.isArray((raw as any).emergencyCategories) && (raw as any).emergencyCategories.length
      ? ((raw as any).emergencyCategories as EmergencyCategoryConfig[])
      : DEFAULT_CONFIG.emergencyCategories;
  const handmadeProducts =
    Array.isArray((raw as any).handmadeProducts) && (raw as any).handmadeProducts.length
      ? ((raw as any).handmadeProducts as HandmadeProductConfig[])
      : DEFAULT_CONFIG.handmadeProducts;
  const popularProducts =
    Array.isArray((raw as any).popularProducts) && (raw as any).popularProducts.length
      ? ((raw as any).popularProducts as PopularProductConfig[])
      : DEFAULT_CONFIG.popularProducts;
  const blood =
    isRecord((raw as any).blood) && (raw as any).blood
      ? ((raw as any).blood as BloodConfig)
      : DEFAULT_CONFIG.blood;
  const helpdesk =
    isRecord((raw as any).helpdesk) && (raw as any).helpdesk
      ? ((raw as any).helpdesk as HelpdeskConfig)
      : DEFAULT_CONFIG.helpdesk;
  const agriculture =
    isRecord((raw as any).agriculture) && (raw as any).agriculture
      ? ((raw as any).agriculture as AgricultureConfig)
      : DEFAULT_CONFIG.agriculture;

  return {
    schemaVersion: 2,
    notices,
    dashboardCards,
    emergencyCategories,
    handmadeProducts,
    popularProducts,
    blood,
    helpdesk,
    agriculture,
  };
}

function loadConfig(): AppConfig {
  const stored = readLocalStorageJson<unknown>(STORAGE_KEY);
  return coerceAppConfig(stored);
}

interface AppConfigContextType {
  config: AppConfig;
  setConfig: (next: AppConfig) => void;
  resetToDefaults: () => void;
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

export const AppConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(() => loadConfig());
  const [hasLoadedRemoteConfig, setHasLoadedRemoteConfig] = useState(false);

  useEffect(() => {
    const fetchRemoteConfig = async () => {
      try {
        const token = getAuthHeader();
        const response = await fetch(API_BASE_URL, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = await response.json();
        if (response.ok && data?.config) {
          setConfig(coerceAppConfig(data.config));
        }
      } catch {
        // Keep localStorage/default config when backend is unreachable.
      } finally {
        setHasLoadedRemoteConfig(true);
      }
    };

    fetchRemoteConfig();
  }, []);

  useEffect(() => {
    writeLocalStorageJson(STORAGE_KEY, config);

    if (!hasLoadedRemoteConfig) return;

    const saveRemoteConfig = async () => {
      try {
        const token = getAuthHeader();
        if (!token) return;

        await fetch(API_BASE_URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ config }),
        });
      } catch {
        // Silently ignore network errors; localStorage remains source of truth offline.
      }
    };

    saveRemoteConfig();
  }, [config, hasLoadedRemoteConfig]);

  const value = useMemo<AppConfigContextType>(() => {
    return {
      config,
      setConfig,
      resetToDefaults: () => {
        removeLocalStorageKey(STORAGE_KEY);
        setConfig(DEFAULT_CONFIG);
      },
    };
  }, [config]);

  return <AppConfigContext.Provider value={value}>{children}</AppConfigContext.Provider>;
};

export const useAppConfig = () => {
  const ctx = useContext(AppConfigContext);
  if (!ctx) throw new Error('useAppConfig must be used within AppConfigProvider');
  return ctx;
};

export const DEFAULT_APP_CONFIG = DEFAULT_CONFIG;
