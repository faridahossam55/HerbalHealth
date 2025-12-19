export class Order {
  constructor(data) {
    this.userId = data.userId;
    this.items = data.items || [];
    this.shippingAddress = data.shippingAddress || {};
    this.payment = {
      method: data.paymentMethod || 'cash_on_delivery',
      status: 'pending',
      transactionId: data.transactionId || null
    };
    this.totals = this.calculateTotals(data.items, data.shipping, data.discount);
    this.status = 'pending';
    this.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.notes = data.notes || '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  calculateTotals(items = [], shipping = 20, discount = 0) {
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    const tax = subtotal * 0.14;
    const total = subtotal + shipping + tax - discount;
    
    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  }

  toJSON() {
    return {
      id: this._id,
      orderNumber: this.orderNumber,
      userId: this.userId,
      items: this.items,
      shippingAddress: this.shippingAddress,
      payment: this.payment,
      totals: this.totals,
      status: this.status,
      notes: this.notes,
      createdAt: this.createdAt,
      estimatedDelivery: this.calculateDeliveryDate()
    };
  }

  calculateDeliveryDate() {
    const date = new Date(this.createdAt);
    date.setDate(date.getDate() + 3);
    return date;
  }

  static fromMongo(doc) {
    const order = new Order(doc);
    order._id = doc._id;
    return order;
  }
}