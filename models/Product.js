export class Product {
  constructor(data) {
    this.name = data.name;
    this.description = data.description;
    
    // معالجة السعر
    if (data.price === undefined) {
      this.price = 0;
    } else if (typeof data.price === 'string') {
      this.price = parseFloat(data.price.replace(' EGP', '').trim()) || 0;
    } else if (typeof data.price === 'number') {
      this.price = data.price;
    } else {
      this.price = 0;
    }
    
    this.image = data.image;
    this.category = data.category || 'herbs';
    this.disease = data.disease || this.detectDisease(data.description);
    this.type = data.type || 'herb';
    this.tags = data.tags || [];
    this.stock = data.stock || 100;
    this.rating = data.rating || 4.5;
    
    // ⬇️ ⬇️ ⬇️ هنا تضيفي الحقول الجديدة ⬇️ ⬇️ ⬇️
    this.benefits = data.benefits || this.generateDefaultBenefits(data.category, data.disease);
    this.usage = data.usage || this.generateDefaultUsage(data.category);
    this.how_to_use = data.how_to_use || '';
    this.ingredients = data.ingredients || '100% natural ingredients';
    this.dosage = data.dosage || '';
    this.warnings = data.warnings || 'Consult with healthcare professional before use';
    
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // دالة لتوليد فوائد افتراضية بناءً على الفئة والمرض
  generateDefaultBenefits(category, disease) {
    const benefitsMap = {
      'Diabetes': [
        'Helps regulate blood sugar levels',
        'Improves insulin sensitivity',
        'Reduces sugar cravings',
        'Supports pancreatic health'
      ],
      'High Blood Pressure': [
        'Helps lower blood pressure naturally',
        'Improves blood circulation',
        'Reduces stress and anxiety',
        'Supports cardiovascular health'
      ],
      'Digestive Issues': [
        'Improves digestion and nutrient absorption',
        'Reduces bloating and gas',
        'Soothes stomach discomfort',
        'Supports gut health'
      ]
    };
    
    const categoryBenefits = {
      'herbs': ['100% natural and organic', 'No artificial additives', 'Traditional herbal remedy'],
      'fruits': ['Rich in vitamins and minerals', 'Natural antioxidants', 'High in dietary fiber']
    };
    
    const diseaseBenefits = benefitsMap[disease] || ['Supports overall wellness'];
    const catBenefits = categoryBenefits[category] || ['Natural and healthy'];
    
    return [...diseaseBenefits, ...catBenefits];
  }

  // دالة لتوليد طريقة استخدام افتراضية
  generateDefaultUsage(category) {
    if (category === 'herbs') {
      return 'Take as directed by healthcare professional. Usually 1-2 times daily with meals.';
    } else if (category === 'fruits') {
      return 'Consume fresh or as directed. Can be eaten raw, juiced, or added to meals.';
    }
    return 'Follow recommended dosage instructions.';
  }

  detectDisease(description) {
    if (!description) return 'General';
    const desc = description.toLowerCase();
    if (desc.includes('blood sugar') || desc.includes('insulin') || desc.includes('diabetes')) {
      return 'Diabetes';
    } else if (desc.includes('blood pressure') || desc.includes('hypertension')) {
      return 'High Blood Pressure';
    } else if (desc.includes('digest') || desc.includes('stomach')) {
      return 'Digestive Issues';
    }
    return 'General';
  }

  toJSON() {
    return {
      id: this._id,
      name: this.name,
      description: this.description,
      price: `${this.price} EGP`,
      image: this.image,
      category: this.category,
      disease: this.disease,
      type: this.type,
      tags: this.tags,
      stock: this.stock,
      rating: this.rating,
      // ⬇️ ⬇️ ⬇️ هنا تضيفي الحقول الجديدة في الـ JSON ⬇️ ⬇️ ⬇️
      benefits: this.benefits,
      usage: this.usage,
      how_to_use: this.how_to_use,
      ingredients: this.ingredients,
      dosage: this.dosage,
      warnings: this.warnings,
      createdAt: this.createdAt
    };
  }

  static fromMongo(doc) {
    const product = new Product(doc);
    product._id = doc._id;
    return product;
  }
}