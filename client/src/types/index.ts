export interface Provider {
  _id: string;
  name: string;
  service: string;
  email: string;
  phone: string;
  hourlyRate: number;
  workingHours: {
    start: string;
    end: string;
  };
}

export interface Slot {
  _id: string;
  providerId: Provider;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  isAvailable: boolean;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface Booking {
  _id: string;
  userId: User;
  providerId: Provider;
  slotId: Slot;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
