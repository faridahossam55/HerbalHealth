import bcrypt from 'bcryptjs';

export class User {
  constructor(data) {
    this.name = data.name;
    this.email = data.email.toLowerCase();
    this.password = data.password; // سيتم تشفيرها
    this.role = data.role || 'user';
    this.phone = data.phone || '';
    this.address = data.address || {};
    this.healthConcerns = data.healthConcerns || [];
    this.cart = data.cart || [];
    this.orders = data.orders || [];
    this.preferences = {
      notifications: true,
      newsletter: true,
      ...data.preferences
    };
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return {
      id: this._id,
      ...userWithoutPassword
    };
  }

  static fromMongo(doc) {
    const user = new User(doc);
    user._id = doc._id;
    return user;
  }
}