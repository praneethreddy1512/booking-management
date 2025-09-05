import type { Provider,User,Booking,Slot } from "../types/index.ts";
const api = {
  baseUrl: 'http://localhost:5000/api',

  async getProviders(): Promise<Provider[]> {
    return [
      {
        _id: '1',
        name: 'John Smith',
        service: 'carpenter',
        email: 'john@carpenter.com',
        phone: '+1234567890',
        hourlyRate: 50,
        workingHours: { start: '09:00', end: '18:00' }
      },
    ];
  },

  async getAvailableSlots(providerId: string, date: string): Promise<Slot[]> {
    const provider = await this.getProviders().then(ps => ps.find(p => p._id === providerId));
    if (!provider) return [];

    const slots: Slot[] = [];
    const startHour = parseInt(provider.workingHours.start.split(':')[0]);
    const endHour = parseInt(provider.workingHours.end.split(':')[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      const isAvailable = Math.random() > 0.3;
      slots.push({
        _id: `${providerId}-${hour}`,
        providerId: provider,
        date,
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
        price: provider.hourlyRate,
        isAvailable
      });
    }

    return slots.filter(slot => slot.isAvailable);
  },

  async createUser(userData: Omit<User, '_id'>): Promise<User> {
    return { _id: Date.now().toString(), ...userData };
  },

  async bookSlot(bookingData: {
    userId: string;
    slotId: string;
    notes?: string;
  }): Promise<Booking> {
    return {
      _id: Date.now().toString(),
      userId: {
        _id: bookingData.userId,
        name: 'Mock User',
        email: 'user@email.com',
        phone: '+1234567890'
      },
      providerId: {
        _id: '1',
        name: 'John Smith',
        service: 'carpenter',
        email: 'john@carpenter.com',
        phone: '+1234567890',
        hourlyRate: 50,
        workingHours: { start: '09:00', end: '18:00' }
      },
      slotId: {
        _id: bookingData.slotId,
        providerId: {} as Provider,
        date: new Date().toISOString(),
        startTime: '10:00',
        endTime: '11:00',
        price: 50,
        isAvailable: false
      },
      status: 'pending',
      totalPrice: 50,
      notes: bookingData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
};

export default api;
