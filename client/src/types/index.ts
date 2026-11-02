export type UserRole = 'Patient' | 'Pharmacy' | 'Admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: {
    address: string;
    latitude: number;
    longitude: number;
  };
  pharmacyId?: string | any;
  token?: string;
}

export interface Medicine {
  _id: string;
  name: string;
  genericName: string;
  brand: string;
  strength: string;
  form: string;
  category: string;
  uses: string[];
  precautions: string[];
  sideEffects: string[];
  storage: string;
  prescriptionRequired: boolean;
  averagePrice: number;
  imageUrl?: string;
}

export interface Pharmacy {
  _id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  openingHours: string;
  isOpenNow: boolean;
  verified: boolean;
  rating: number;
  avgPickupMinutes: number;
}

export interface InventoryItem {
  _id: string;
  pharmacyId: string | Pharmacy;
  medicineId: string | Medicine;
  quantity: number;
  price: number;
  sku?: string;
  lastUpdated: string;
}

export interface ExtractedMedicine {
  rawText: string;
  matchedMedicineId?: string | Medicine;
  matchedName: string;
  strength: string;
  dosageText: string;
  quantity: number;
  confidence: number;
  userVerified?: boolean;
}

export interface Prescription {
  _id: string;
  userId: string;
  imageUrl: string;
  ocrRawText?: string;
  extractedMedicines: ExtractedMedicine[];
  overallConfidence: number;
  status: 'Uploading' | 'Processing' | 'Completed' | 'Failed';
  createdAt: string;
}

export interface Reservation {
  _id: string;
  userId: string | User;
  pharmacyId: Pharmacy;
  medicineId: Medicine;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  pickupTime: string;
  reservationId: string;
  status: 'Pending' | 'Confirmed' | 'Ready for Pickup' | 'Completed' | 'Cancelled' | 'Expired';
  qrPayload: string;
  notes?: string;
  createdAt: string;
}

export interface NotificationItem {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface PharmacyAccessResult {
  pharmacy: Pharmacy;
  inventory?: InventoryItem;
  medicine?: Medicine;
  accessScore: number;
  distanceKm: number;
  status: string;
  confidenceScore?: number;
  reasons: string[];
  scoreBreakdown?: {
    availabilityScore: number;
    distanceScore: number;
    priceScore: number;
    freshnessScore: number;
    pickupScore: number;
  };
  isTopRecommendation?: boolean;
}

export interface DemandForecastData {
  avgDailyDemand: number;
  predictedDailyDemand: number;
  currentStock: number;
  stockoutDays: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendedReplenish: number;
  leadTimeDays: number;
  confidence: number;
  modelType: string;
  trendData: Array<{
    day: string;
    historical: number;
    predicted: number;
    searches: number;
  }>;
}

export interface StockoutRiskItem {
  inventoryId: string;
  medicine: Medicine;
  pharmacy: Pharmacy;
  currentStock: number;
  price: number;
  avgDailyDemand: number;
  predictedDailyDemand: number;
  stockoutDays: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendedReplenish: number;
}
