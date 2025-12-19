export class Category {
  constructor(data) {
    this.name = data.name;
    this.slug = this.createSlug(data.name);
    this.description = data.description || '';
    this.image = data.image || `images/categories/${this.slug}.jpg`;
    this.type = data.type || 'product_type';
    this.parentCategory = data.parentCategory || null;
    this.productsCount = 0;
    this.featured = data.featured || false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  createSlug(name) {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  }

  toJSON() {
    return {
      id: this._id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      image: this.image,
      type: this.type,
      parentCategory: this.parentCategory,
      productsCount: this.productsCount,
      featured: this.featured,
      createdAt: this.createdAt
    };
  }

  static fromMongo(doc) {
    const category = new Category(doc);
    category._id = doc._id;
    return category;
  }
}