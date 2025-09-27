export interface Material {
  id: string;
  code: string;
  name: string;
  specification: string;
  unit: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Location {
  id: string;
  name: string;
  code: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Investigator {
  id: string;
  name: string;
  isCurrent: boolean | string;
  registeredAt: string;
}

export interface InspectionRecord {
  id: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  unit: string;
  quantity: number;
  locationId: string;
  locationName: string;
  investigatorName: string;
  inspectionDate: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
