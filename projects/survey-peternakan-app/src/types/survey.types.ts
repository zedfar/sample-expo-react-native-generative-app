export type LivestockType =
  | 'sapi'
  | 'kambing'
  | 'domba'
  | 'ayam'
  | 'bebek'
  | 'kerbau'
  | 'lainnya';

export interface Survey {
  id: string;
  farmerName: string;
  farmName: string;
  location: {
    province: string;
    district: string;
    village: string;
  };
  livestockType: LivestockType;
  quantity: number;
  healthStatus: 'sehat' | 'sakit' | 'karantina';
  feedingMethod: 'rumput' | 'pakan-pabrik' | 'campuran';
  notes?: string;
  surveyDate: string;
  surveyorId: string;
  surveyorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSurveyInput {
  farmerName: string;
  farmName: string;
  location: {
    province: string;
    district: string;
    village: string;
  };
  livestockType: LivestockType;
  quantity: number;
  healthStatus: 'sehat' | 'sakit' | 'karantina';
  feedingMethod: 'rumput' | 'pakan-pabrik' | 'campuran';
  notes?: string;
  surveyDate: string;
}

export interface UpdateSurveyInput {
  farmerName?: string;
  farmName?: string;
  location?: {
    province: string;
    district: string;
    village: string;
  };
  livestockType?: LivestockType;
  quantity?: number;
  healthStatus?: 'sehat' | 'sakit' | 'karantina';
  feedingMethod?: 'rumput' | 'pakan-pabrik' | 'campuran';
  notes?: string;
  surveyDate?: string;
}
