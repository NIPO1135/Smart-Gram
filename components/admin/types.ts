import { AppConfig } from '../../context/AppConfigContext';

export interface AdminSubViewProps {
  draft: AppConfig;
  setDraft: React.Dispatch<React.SetStateAction<AppConfig>>;
  language: 'en' | 'bn';
  t: any;
  labels: Record<string, string>;
  onSave: () => void;
  onBack: () => void;
}
