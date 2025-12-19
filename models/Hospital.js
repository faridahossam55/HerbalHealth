export class Hospital {
  constructor(data) {
    this.name = data.name;
    this.type = data.type || 'clinic';
    this.address = {
      street: data.street || '',
      city: data.city || 'Cairo',
      country: data.country || 'Egypt',
      coordinates: data.coordinates || { lat: 0, lng: 0 }
    };
    this.contact = {
      phone: data.phone || '',
      email: data.email || '',
      website: data.website || ''
    };
    this.services = data.services || [];
    this.doctors = data.doctors || [];
    this.workingHours = data.workingHours || {
      sunday: { from: '09:00', to: '17:00' },
      monday: { from: '09:00', to: '17:00' },
      tuesday: { from: '09:00', to: '17:00' },
      wednesday: { from: '09:00', to: '17:00' },
      thursday: { from: '09:00', to: '17:00' },
      friday: { from: '09:00', to: '16:00' },
      saturday: { from: '10:00', to: '15:00' }
    };
    this.addedBy = data.addedBy;
    this.verified = false;
    this.rating = 0;
    this.reviewCount = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this._id,
      name: this.name,
      type: this.type,
      address: this.address,
      contact: this.contact,
      services: this.services,
      doctors: this.doctors,
      workingHours: this.workingHours,
      verified: this.verified,
      rating: this.rating,
      reviewCount: this.reviewCount,
      createdAt: this.createdAt
    };
  }

  static fromMongo(doc) {
    const hospital = new Hospital(doc);
    hospital._id = doc._id;
    return hospital;
  }
}