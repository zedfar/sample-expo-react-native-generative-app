export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface FarmField {
  id: string;
  name: string;
  area: number; // in hectares
  location: Location;
  soilType: string;
  irrigationType: string;
}

export interface Crop {
  id: string;
  name: string;
  variety: string;
  plantingDate: string;
  harvestDate?: string;
  expectedYield?: number;
  actualYield?: number;
  unit: 'kg' | 'ton' | 'quintal';
}

export interface Survey {
  id: string;
  userId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone?: string;
  field: FarmField;
  crops: Crop[];
  notes?: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'submitted' | 'verified';
}

export interface SurveyFormData {
  farmerName: string;
  farmerPhone: string;
  fieldName: string;
  fieldArea: string;
  soilType: string;
  irrigationType: string;
  cropName: string;
  cropVariety: string;
  plantingDate: string;
  expectedYield: string;
  yieldUnit: 'kg' | 'ton' | 'quintal';
  notes: string;
}

export const SOIL_TYPES = [
  'Liat',
  'Lempung',
  'Pasir',
  'Gambut',
  'Aluvial',
  'Vulkanik',
  'Laterit'
];

export const IRRIGATION_TYPES = [
  'Tadah Hujan',
  'Irigasi Teknis',
  'Irigasi Semi Teknis',
  'Irigasi Sederhana',
  'Pompa Air',
  'Sumur'
];

export const CROP_TYPES = [
  'Padi',
  'Jagung',
  'Kedelai',
  'Kacang Tanah',
  'Ubi Kayu',
  'Ubi Jalar',
  'Cabai',
  'Tomat',
  'Bawang Merah',
  'Bawang Putih',
  'Kentang',
  'Lainnya'
];

export const YIELD_UNITS = [
  { label: 'Kilogram (kg)', value: 'kg' },
  { label: 'Ton', value: 'ton' },
  { label: 'Kuintal', value: 'quintal' }
];
