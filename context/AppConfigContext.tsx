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

export type PopularProductIconKey = 'Milk' | 'Egg';

export interface PopularProductConfig {
  id: string;
  enabled: boolean;
  name: LocalizedText;
  iconKey: PopularProductIconKey;
  color: string;
  price: string;
  unit: LocalizedText;
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

export interface AppConfig {
  schemaVersion: 2;
  notices: LocalizedText;
  dashboardCards: DashboardCardConfig[];
  emergencyCategories: EmergencyCategoryConfig[];
  handmadeProducts: HandmadeProductConfig[];
  popularProducts: PopularProductConfig[];
  blood: BloodConfig;
}

const STORAGE_KEY = 'smart_village_app_config_v1';

const DEFAULT_CONFIG: AppConfig = {
  schemaVersion: 2,
  notices: {
    bn: 'গ্রামের সরকারি হাসপাতালে আগামী শুক্রবার বিনামূল্যে রক্ত পরীক্ষা করা হবে। | নতুন সার ভর্তুকির জন্য ইউনিয়ন পরিষদে যোগাযোগ করুন। | খেলাধুলা ক্লাবের পক্ষ থেকে আগামী রোববার ফুটবল টুনামেন্ট আয়োজন করা হবে।',
    en: 'Free blood checkups at the village government hospital next Friday. | Contact Union Parishad for new fertilizer subsidies. | Football tournament organized by the Sports Club this Sunday.',
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

function loadConfig(): AppConfig {
  const stored = readLocalStorageJson<unknown>(STORAGE_KEY);
  if (!isRecord(stored)) return DEFAULT_CONFIG;

  const notices = coerceLocalizedText(stored.notices, DEFAULT_CONFIG.notices);
  const dashboardCards = mergeDashboardCards(stored.dashboardCards, DEFAULT_CONFIG.dashboardCards);
  const emergencyCategories =
    Array.isArray((stored as any).emergencyCategories) && (stored as any).emergencyCategories.length
      ? ((stored as any).emergencyCategories as EmergencyCategoryConfig[])
      : DEFAULT_CONFIG.emergencyCategories;
  const handmadeProducts =
    Array.isArray((stored as any).handmadeProducts) && (stored as any).handmadeProducts.length
      ? ((stored as any).handmadeProducts as HandmadeProductConfig[])
      : DEFAULT_CONFIG.handmadeProducts;
  const popularProducts =
    Array.isArray((stored as any).popularProducts) && (stored as any).popularProducts.length
      ? ((stored as any).popularProducts as PopularProductConfig[])
      : DEFAULT_CONFIG.popularProducts;
  const blood =
    isRecord((stored as any).blood) && (stored as any).blood
      ? ((stored as any).blood as BloodConfig)
      : DEFAULT_CONFIG.blood;

  return {
    schemaVersion: 2,
    notices,
    dashboardCards,
    emergencyCategories,
    handmadeProducts,
    popularProducts,
    blood,
  };
}

interface AppConfigContextType {
  config: AppConfig;
  setConfig: (next: AppConfig) => void;
  resetToDefaults: () => void;
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

export const AppConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(() => loadConfig());

  useEffect(() => {
    writeLocalStorageJson(STORAGE_KEY, config);
  }, [config]);

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
