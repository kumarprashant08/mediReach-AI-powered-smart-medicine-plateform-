import {
  User,
  Medicine,
  Pharmacy,
  InventoryItem,
  Prescription,
  Reservation,
  NotificationItem,
  PharmacyAccessResult,
  DemandForecastData,
  StockoutRiskItem,
} from '../types';

const API_BASE = '/api';


const readApiResponse = async (res: Response) => {
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();
  let data: any = null;
  if (text) {
    if (contentType.includes('application/json')) {
      try { data = JSON.parse(text); } catch { data = null; }
    } else {
      try { data = JSON.parse(text); } catch { data = { message: text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() }; }
    }
  }
  return { data, text };
};

const getHeaders = () => {
  const token = localStorage.getItem('medireach_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // AUTH
  async login(email: string, password: string): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const { data } = await readApiResponse(res);
    if (!res.ok) {
      throw new Error(data?.message || `Login failed (HTTP ${res.status})`);
    }
    if (!data) throw new Error('Server returned an empty response. Make sure the MediReach server is running on port 5001.');
    if (data.token) localStorage.setItem('medireach_token', data.token);
    return data;
  },

  async register(userData: any): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const { data } = await readApiResponse(res);
    if (!res.ok) {
      throw new Error(data?.message || `Registration failed (HTTP ${res.status})`);
    }
    if (!data) throw new Error('Server returned an empty response. Make sure the MediReach server is running on port 5001.');
    if (data.token) localStorage.setItem('medireach_token', data.token);
    return data;
  },

  async getMe(): Promise<User | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: getHeaders() });
      if (!res.ok) {
        localStorage.removeItem('medireach_token');
        return null;
      }
      return await res.json();
    } catch {
      return null;
    }
  },

  // MEDICINES
  async getMedicines(params?: { q?: string; category?: string; form?: string; rxOnly?: boolean }): Promise<Medicine[]> {
    const query = new URLSearchParams();
    if (params?.q) query.append('q', params.q);
    if (params?.category) query.append('category', params.category);
    if (params?.form) query.append('form', params.form);
    if (params?.rxOnly !== undefined) query.append('rxOnly', String(params.rxOnly));

    const res = await fetch(`${API_BASE}/medicines?${query.toString()}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch medicines');
    return await res.json();
  },

  async autocompleteMedicines(q: string): Promise<Medicine[]> {
    const res = await fetch(`${API_BASE}/medicines/search?q=${encodeURIComponent(q)}`, { headers: getHeaders() });
    if (!res.ok) return [];
    return await res.json();
  },

  async getMedicineById(id: string): Promise<{ medicine: Medicine; inStockPharmaciesCount: number; inventorySummary: InventoryItem[] }> {
    const res = await fetch(`${API_BASE}/medicines/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Medicine not found');
    return await res.json();
  },


  async addPharmacyMedicine(payload: {
    name: string; genericName: string; brand: string; strength: string; form?: string;
    category?: string; commonUse?: string; prescriptionRequired?: boolean;
    price: number; quantity: number; sku?: string;
  }): Promise<{ medicine: Medicine; inventory: InventoryItem; message: string }> {
    const res = await fetch(`${API_BASE}/pharmacy/medicines`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add medicine');
    return data;
  },

  async getSafeRoute(params: {
    lat: number; lng: number; pharmacyId: string; medicineId?: string;
  }): Promise<{
    generatedAt: string; isNight: boolean; pharmacy: Pharmacy; medicineId: string | null;
    inventory: InventoryItem | null; safetyScore: number; distanceKm: number;
    durationMinutes: number; routeSource: string; geometry: { type: string; coordinates: number[][] };
    recommendation: string; safetyDisclaimer: string;
  }> {
    const query = new URLSearchParams({
      lat: String(params.lat), lng: String(params.lng), pharmacyId: params.pharmacyId,
    });
    if (params.medicineId) query.set('medicineId', params.medicineId);
    const res = await fetch(`${API_BASE}/safe-route?${query.toString()}`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Safe route analysis failed');
    return data;
  },

  // PHARMACIES & SMART ACCESS RANKING
  async getNearbyPharmacies(params: {
    lat?: number;
    lng?: number;
    medicineId?: string;
    maxDistance?: number;
    openOnly?: boolean;
    sortBy?: string;
  }): Promise<PharmacyAccessResult[]> {
    const query = new URLSearchParams();
    if (params.lat) query.append('lat', String(params.lat));
    if (params.lng) query.append('lng', String(params.lng));
    if (params.medicineId) query.append('medicineId', params.medicineId);
    if (params.maxDistance) query.append('maxDistance', String(params.maxDistance));
    if (params.openOnly) query.append('openOnly', 'true');
    if (params.sortBy) query.append('sortBy', params.sortBy);

    const res = await fetch(`${API_BASE}/pharmacies/nearby?${query.toString()}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch nearby pharmacies');
    return await res.json();
  },

  async getPharmacyById(id: string): Promise<{ pharmacy: Pharmacy; inventory: InventoryItem[]; inStockCount: number; outOfStockCount: number }> {
    const res = await fetch(`${API_BASE}/pharmacies/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Pharmacy not found');
    return await res.json();
  },

  // INVENTORY MANAGEMENT
  async getInventory(pharmacyId?: string): Promise<InventoryItem[]> {
    const query = pharmacyId ? `?pharmacyId=${pharmacyId}` : '';
    const res = await fetch(`${API_BASE}/inventory${query}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch inventory');
    return await res.json();
  },

  async updateInventoryItem(id: string, updates: { quantity?: number; price?: number }): Promise<InventoryItem> {
    const res = await fetch(`${API_BASE}/inventory/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update inventory');
    return await res.json();
  },

  // PRESCRIPTION OCR
  async processOCR(formData: FormData): Promise<{
    prescriptionId: string;
    imageUrl: string;
    rawText: string;
    extractedMedicines: any[];
    overallConfidence: number;
  }> {
    const res = await fetch(`${API_BASE}/prescriptions/ocr`, {
      method: 'POST',
      headers: {
        ...(localStorage.getItem('medireach_token')
          ? { Authorization: `Bearer ${localStorage.getItem('medireach_token')}` }
          : {}),
      },
      body: formData,
    });
    if (!res.ok) throw new Error('Prescription OCR processing failed');
    return await res.json();
  },

  // RESERVATIONS
  async createReservation(payload: {
    pharmacyId: string;
    medicineId: string;
    quantity: number;
    pickupTime?: string;
    notes?: string;
  }): Promise<Reservation> {
    const res = await fetch(`${API_BASE}/reservations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Reservation failed');
    }
    return await res.json();
  },

  async getReservations(): Promise<Reservation[]> {
    const res = await fetch(`${API_BASE}/reservations`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch reservations');
    return await res.json();
  },

  async getReservationById(id: string): Promise<Reservation> {
    const res = await fetch(`${API_BASE}/reservations/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Reservation not found');
    return await res.json();
  },

  async updateReservationStatus(id: string, status: string): Promise<Reservation> {
    const res = await fetch(`${API_BASE}/reservations/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return await res.json();
  },

  // ANALYTICS & DEMAND FORECASTING
  async getDemandForecast(medicineId?: string, pharmacyId?: string): Promise<DemandForecastData> {
    const query = new URLSearchParams();
    if (medicineId) query.append('medicineId', medicineId);
    if (pharmacyId) query.append('pharmacyId', pharmacyId);

    const res = await fetch(`${API_BASE}/analytics/demand?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch demand forecast');
    return await res.json();
  },

  async getStockoutRisks(pharmacyId?: string): Promise<StockoutRiskItem[]> {
    const query = pharmacyId ? `?pharmacyId=${pharmacyId}` : '';
    const res = await fetch(`${API_BASE}/analytics/stockout${query}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch stockout risks');
    return await res.json();
  },

  async getAdminOverview(): Promise<any> {
    const res = await fetch(`${API_BASE}/analytics/overview`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch overview stats');
    return await res.json();
  },

  // NOTIFICATIONS & RESTOCK ALERTS
  async getNotifications(): Promise<{ notifications: NotificationItem[]; unreadCount: number }> {
    const res = await fetch(`${API_BASE}/notifications`, { headers: getHeaders() });
    if (!res.ok) return { notifications: [], unreadCount: 0 };
    return await res.json();
  },

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

  async createRestockAlert(medicineId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/notifications/restock-alert`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ medicineId }),
    });
    if (!res.ok) throw new Error('Failed to subscribe restock alert');
  },
};
