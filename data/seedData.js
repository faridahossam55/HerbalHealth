import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';

dotenv.config();

// ==================== بيانات المنتجات الكاملة ====================
const productsData = [
  // ========== DIABETES HERBS ==========
  {
    name: "Turmeric",
    description: "Contains curcumin that improves insulin sensitivity and helps regulate blood sugar",
    price: "65 EGP",
    image: "images/WhatsApp Image 2025-11-13 at 11.53.47_582ca98b.jpg",
    category: "herbs",
    disease: "Diabetes",
    tags: ["best_seller", "on_sale", "premium"],
    rating: 4.7,
    stock: 150,
    benefits: [
      "Improves insulin sensitivity and reduces insulin resistance",
      "Lowers fasting blood sugar levels",
      "Reduces inflammation in the body",
      "Protects pancreatic beta cells",
      "Rich in powerful antioxidants"
    ],
    usage: "For diabetes management and blood sugar control",
    how_to_use: "Mix 1 teaspoon of turmeric powder with warm water or milk. Take once or twice daily, preferably with meals.",
    ingredients: "100% pure turmeric powder (Curcuma longa root)",
    dosage: "500-1000mg per day",
    warnings: "May interact with diabetes medications. Consult doctor before use. Avoid if pregnant or have gallstones."
  },
  {
    name: "Basil",
    description: "Helps lower blood sugar levels and supports insulin production naturally",
    price: "45 EGP",
    image: "images/WhatsApp Image 2025-11-13 at 11.53.46_6f3e506a.jpg",
    category: "herbs",
    disease: "Diabetes",
    tags: ["affordable"],
    rating: 4.3,
    stock: 200,
    benefits: [
      "Lowers blood glucose levels effectively",
      "Improves insulin secretion from pancreas",
      "Reduces oxidative stress in diabetic patients",
      "Helps manage cholesterol levels",
      "Natural anti-inflammatory properties"
    ],
    usage: "Blood sugar regulation and diabetes management",
    how_to_use: "Steep 5-10 fresh basil leaves or 1 teaspoon dried basil in hot water for 10 minutes. Drink 2-3 times daily.",
    ingredients: "Organic holy basil leaves (Ocimum sanctum)",
    dosage: "2-3 cups of basil tea daily",
    warnings: "May lower blood sugar too much if taken with diabetes medication. Monitor blood sugar levels regularly."
  },
  {
    name: "Gymnema Sylvestre",
    description: "Known as 'sugar destroyer' - reduces sugar cravings and helps lower blood sugar levels",
    price: "85 EGP",
    image: "images/de641098b6223e629d313e17b4697cfd (1).jpg",
    category: "herbs",
    disease: "Diabetes",
    tags: ["premium", "special"],
    rating: 4.8,
    stock: 80,
    benefits: [
      "Reduces sugar cravings dramatically",
      "Lowers blood sugar levels naturally",
      "Improves insulin production",
      "Helps regenerate pancreatic cells",
      "Reduces absorption of sugar in intestines"
    ],
    usage: "For controlling sugar cravings and managing diabetes",
    how_to_use: "Take 400-600mg extract daily. Can be taken as capsules or tea. Best taken before meals.",
    ingredients: "Gymnema sylvestre leaf extract (standardized to 25% gymnemic acids)",
    dosage: "400-600mg daily in divided doses",
    warnings: "May cause hypoglycemia if combined with diabetes drugs. Monitor blood sugar closely."
  },
  {
    name: "Bitter Melon",
    description: "Contains compounds that act like insulin to naturally lower blood sugar levels",
    price: "60 EGP",
    image: "images/a4b8f37886ae581cb19d1d43a6870d60.jpg",
    category: "herbs",
    disease: "Diabetes",
    tags: ["affordable"],
    rating: 4.2,
    stock: 120,
    benefits: [
      "Acts like natural insulin in the body",
      "Lowers blood glucose levels effectively",
      "Improves glucose tolerance",
      "Reduces hemoglobin A1c levels",
      "Supports weight management"
    ],
    usage: "Diabetes management and blood sugar control",
    how_to_use: "Juice from 1-2 bitter melons daily or take as capsules. Can also be cooked as vegetable.",
    ingredients: "Bitter melon fruit extract (Momordica charantia)",
    dosage: "500-1000mg daily or 50-100ml juice",
    warnings: "May cause diarrhea in high doses. Avoid during pregnancy. Can lower blood sugar significantly."
  },
  {
    name: "Moringa",
    description: "Rich in antioxidants and compounds that help regulate blood sugar and improve insulin sensitivity",
    price: "70 EGP",
    image: "images/24d87d5f8fff54ba6c314fa5ddb12981.jpg",
    category: "herbs",
    disease: "Diabetes",
    tags: ["best_seller"],
    rating: 4.6,
    stock: 180,
    benefits: [
      "Improves insulin sensitivity significantly",
      "Lowers fasting and post-meal blood sugar",
      "Rich in vitamins, minerals and antioxidants",
      "Reduces inflammation in diabetic patients",
      "Supports overall immune function"
    ],
    usage: "Blood sugar regulation and nutritional support for diabetics",
    how_to_use: "Mix 1-2 teaspoons of moringa powder in water, juice or smoothie. Take once or twice daily.",
    ingredients: "Pure moringa oleifera leaf powder",
    dosage: "1-2 teaspoons (5-10 grams) daily",
    warnings: "May have laxative effect in high doses. Start with small amount."
  },
  {
    name: "Fenugreek",
    description: "High in soluble fiber that slows down carbohydrate absorption and sugar digestion",
    price: "55 EGP",
    image: "images/640bb2f0f04898216b4cba6d07c04f53.jpg",
    category: "herbs",
    disease: "Diabetes",
    tags: ["affordable"],
    rating: 4.4,
    stock: 160,
    benefits: [
      "Slows sugar absorption in intestines",
      "Improves glucose tolerance",
      "Lowers fasting blood sugar",
      "Reduces insulin resistance",
      "High in soluble fiber"
    ],
    usage: "For blood sugar control and diabetes management",
    how_to_use: "Soak 1-2 teaspoons of fenugreek seeds overnight, drink water and eat seeds in morning. Or take as capsules.",
    ingredients: "Fenugreek seeds (Trigonella foenum-graecum)",
    dosage: "5-50 grams daily (depending on form)",
    warnings: "May cause gas and bloating. Avoid during pregnancy. Can lower blood sugar significantly."
  },

  // ========== DIABETES FRUITS ==========
  {
    name: "Dragon Fruit",
    description: "High in fiber and antioxidants, helps regulate blood sugar with low glycemic index",
    price: "90 EGP",
    image: "images/3e51a2d4cbf63014d0b1092a2493f572.jpg",
    category: "fruits",
    disease: "Diabetes",
    tags: ["new_arrival", "premium"],
    rating: 4.7,
    stock: 90,
    benefits: [
      "Low glycemic index - doesn't spike blood sugar",
      "High in fiber which slows sugar absorption",
      "Rich in antioxidants that protect cells",
      "Improves insulin sensitivity",
      "Supports gut health"
    ],
    usage: "Diabetes-friendly fruit for blood sugar control",
    how_to_use: "Eat fresh as snack, add to salads or make smoothies. Consume in moderation.",
    ingredients: "Fresh dragon fruit (Hylocereus undatus)",
    dosage: "1/2 to 1 fruit daily",
    warnings: "Generally safe. Monitor blood sugar when introducing new foods."
  },
  {
    name: "Star Fruit",
    description: "Contains compounds that improve insulin sensitivity and help control blood sugar spikes",
    price: "75 EGP",
    image: "images/8e709df7d32262a79482e5e3b9124ad6.jpg",
    category: "fruits",
    disease: "Diabetes",
    tags: ["exotic"],
    rating: 4.5,
    stock: 70,
    benefits: [
      "Improves insulin sensitivity",
      "Helps control post-meal blood sugar spikes",
      "Low in calories and carbohydrates",
      "Rich in vitamin C and antioxidants",
      "Supports immune function"
    ],
    usage: "Blood sugar management and antioxidant support",
    how_to_use: "Eat fresh, sliced. Can be added to fruit salads or used as garnish.",
    ingredients: "Fresh star fruit (Averrhoa carambola)",
    dosage: "1 small to medium fruit daily",
    warnings: "Contains oxalates - avoid if you have kidney problems. May interact with some medications."
  },
  {
    name: "Passion Fruit",
    description: "Rich in pectin fiber that slows sugar absorption and helps maintain stable blood glucose",
    price: "80 EGP",
    image: "images/ee2fe596ec73e7dbdf3193114345d302.jpg",
    category: "fruits",
    disease: "Diabetes",
    tags: ["exotic"],
    rating: 4.6,
    stock: 85,
    benefits: [
      "High pectin fiber slows sugar absorption",
      "Helps maintain stable blood glucose levels",
      "Rich in antioxidants that protect against complications",
      "Low glycemic index",
      "Supports heart health"
    ],
    usage: "For stable blood sugar and diabetes management",
    how_to_use: "Scoop out pulp and eat fresh, add to yogurt or make juice without added sugar.",
    ingredients: "Fresh passion fruit (Passiflora edulis)",
    dosage: "1-2 fruits daily",
    warnings: "Seeds are edible and nutritious. Monitor portion size."
  },
  {
    name: "Pomegranate",
    description: "Powerful antioxidants improve insulin sensitivity and protect against diabetes complications",
    price: "95 EGP",
    image: "images/d3c87d76ea63e41815a6c67692db1762.jpg",
    category: "fruits",
    disease: "Diabetes",
    tags: ["premium", "antioxidant"],
    rating: 4.8,
    stock: 110,
    benefits: [
      "Improves insulin sensitivity significantly",
      "Protects against diabetes complications",
      "Reduces oxidative stress in diabetic patients",
      "Lowers fasting blood sugar",
      "Supports cardiovascular health"
    ],
    usage: "Diabetes management and complication prevention",
    how_to_use: "Eat seeds fresh, drink 100% pomegranate juice (no sugar added), or take extract.",
    ingredients: "Pomegranate arils and juice (Punica granatum)",
    dosage: "1/2 cup seeds or 250ml juice daily",
    warnings: "May interact with blood pressure medications. Contains natural sugars - consume in moderation."
  },
  {
    name: "Jabuticaba",
    description: "Brazilian grape tree fruit with high antioxidant content that helps improve insulin sensitivity and protect pancreatic cells",
    price: "120 EGP",
    image: "images/959f7f19d2ffaf34623d539a7047437b.jpg",
    category: "fruits",
    disease: "Diabetes",
    tags: ["exotic", "premium", "rare"],
    rating: 4.9,
    stock: 40,
    benefits: [
      "Protects pancreatic beta cells from damage",
      "Improves insulin sensitivity dramatically",
      "Very high in anthocyanin antioxidants",
      "Reduces inflammation in diabetes",
      "Supports overall metabolic health"
    ],
    usage: "Advanced diabetes support and pancreatic protection",
    how_to_use: "Eat fresh when in season, or take as standardized extract. Can be made into jam without sugar.",
    ingredients: "Jabuticaba fruit (Plinia cauliflora)",
    dosage: "1/2 cup fresh fruit or 500mg extract daily",
    warnings: "Seasonal availability. May stain clothing due to dark pigment."
  },
  {
    name: "Mangosteen",
    description: "Tropical fruit rich in xanthones that help reduce insulin resistance and regulate blood sugar levels naturally",
    price: "110 EGP",
    image: "images/96e9b6b277e3abc05ed03d92c7d41b1e.jpg",
    category: "fruits",
    disease: "Diabetes",
    tags: ["exotic", "premium"],
    rating: 4.7,
    stock: 60,
    benefits: [
      "Reduces insulin resistance effectively",
      "Regulates blood sugar levels naturally",
      "Powerful anti-inflammatory properties",
      "Rich in unique xanthone antioxidants",
      "Supports weight management"
    ],
    usage: "Insulin resistance and blood sugar regulation",
    how_to_use: "Eat fresh fruit, or take mangosteen extract. The white pulp is edible, rind can be used for tea.",
    ingredients: "Mangosteen fruit and rind (Garcinia mangostana)",
    dosage: "1-2 fruits daily or 500-1000mg extract",
    warnings: "May interact with chemotherapy drugs. Generally safe when consumed as food."
  },

  // ========== HIGH BLOOD PRESSURE HERBS ==========
  {
    name: "Andrographis Paniculata",
    description: "Indian herb with powerful anti-inflammatory properties that helps relax blood vessels and improve circulation",
    price: "120 EGP",
    image: "images/4d9288c9901e08659c367ce87bae1a79.jpg",
    category: "herbs",
    disease: "High Blood Pressure",
    tags: ["premium", "imported"],
    rating: 4.6,
    stock: 75,
    benefits: [
      "Relaxes blood vessels and improves circulation",
      "Reduces inflammation in cardiovascular system",
      "Lowers systolic and diastolic blood pressure",
      "Improves endothelial function",
      "Natural diuretic properties"
    ],
    usage: "Hypertension management and cardiovascular support",
    how_to_use: "Take as capsules or tablets. Standardized extract is most effective. Take with meals.",
    ingredients: "Andrographis paniculata extract (standardized to 10% andrographolides)",
    dosage: "300-600mg daily in divided doses",
    warnings: "May cause digestive upset. Avoid during pregnancy. Can interact with blood thinners."
  },
  {
    name: "Eleuthero (Siberian Ginseng)",
    description: "Adaptogenic herb that helps the body cope with stress, a major contributor to high blood pressure",
    price: "95 EGP",
    image: "images/4e890dbcb088a45086b28f888bfcefea.jpg",
    category: "herbs",
    disease: "High Blood Pressure",
    tags: ["adaptogen", "stress_relief"],
    rating: 4.4,
    stock: 100,
    benefits: [
      "Reduces stress-induced high blood pressure",
      "Improves adaptation to physical and mental stress",
      "Enhances circulation and oxygen utilization",
      "Supports adrenal gland function",
      "Increases energy and reduces fatigue"
    ],
    usage: "Stress-related hypertension and fatigue management",
    how_to_use: "Take as tincture, capsules or tea. Best taken in morning or early afternoon.",
    ingredients: "Eleutherococcus senticosus root extract",
    dosage: "300-1200mg daily",
    warnings: "May cause insomnia if taken late in day. Not recommended for those with autoimmune conditions."
  },
  {
    name: "Schisandra Berry",
    description: "Chinese berry that supports adrenal function and helps regulate blood pressure naturally",
    price: "110 EGP",
    image: "images/1665a6dae7eec5ae18f63e4b43151196.jpg",
    category: "herbs",
    disease: "High Blood Pressure",
    tags: ["berry", "adaptogen"],
    rating: 4.5,
    stock: 85,
    benefits: [
      "Regulates blood pressure by supporting adrenal health",
      "Reduces stress hormone (cortisol) levels",
      "Improves mental clarity and focus",
      "Protects liver function",
      "Enhances physical endurance"
    ],
    usage: "Adrenal support and blood pressure regulation",
    how_to_use: "Take as tincture, powder or capsules. Can be made into tea with dried berries.",
    ingredients: "Schisandra chinensis berry extract",
    dosage: "500-2000mg daily",
    warnings: "May cause heartburn or stomach upset. Avoid during pregnancy unless prescribed."
  },
  {
    name: "Maca Root",
    description: "Peruvian superfood that balances hormones and supports cardiovascular health",
    price: "105 EGP",
    image: "images/caf7667d088178f6aad6787be160878f.jpg",
    category: "herbs",
    disease: "High Blood Pressure",
    tags: ["superfood", "hormone_balance"],
    rating: 4.7,
    stock: 95,
    benefits: [
      "Balances hormones that affect blood pressure",
      "Improves energy and stamina naturally",
      "Supports cardiovascular health",
      "Enhances mood and reduces anxiety",
      "Rich in essential vitamins and minerals"
    ],
    usage: "Hormonal balance and cardiovascular support",
    how_to_use: "Add powder to smoothies, yogurt or oatmeal. Start with small dose and increase gradually.",
    ingredients: "Organic maca root powder (Lepidium meyenii)",
    dosage: "1-3 teaspoons (5-15 grams) daily",
    warnings: "Start with small dose to assess tolerance. May affect thyroid function in sensitive individuals."
  },
  {
    name: "Holy Basil (Tulsi)",
    description: "Sacred Indian herb that reduces cortisol levels and helps manage stress-related hypertension",
    price: "88 EGP",
    image: "images/0cdc4623f4d4e3b5b3f770e496c689bd.jpg",
    category: "herbs",
    disease: "High Blood Pressure",
    tags: ["sacred", "stress_relief"],
    rating: 4.8,
    stock: 120,
    benefits: [
      "Lowers cortisol (stress hormone) levels",
      "Reduces stress-induced high blood pressure",
      "Improves mental clarity and focus",
      "Boosts immune system function",
      "Antioxidant and anti-inflammatory properties"
    ],
    usage: "Stress reduction and blood pressure management",
    how_to_use: "Drink as tea 2-3 times daily. Can also take as capsules or tincture.",
    ingredients: "Organic holy basil leaves (Ocimum tenuiflorum)",
    dosage: "300-600mg extract or 2-3 cups tea daily",
    warnings: "May have blood-thinning effects. Avoid before surgery. Generally very safe."
  },
  {
    name: "Saffron",
    description: "Helps soothe stomach discomfort and improve digestion naturally",
    price: "180 EGP",
    image: "images/WhatsApp Image 2025-11-13 at 11.53.46_6723a9f4.jpg",
    category: "herbs",
    disease: "High Blood Pressure",
    tags: ["luxury", "premium"],
    rating: 4.9,
    stock: 50,
    benefits: [
      "Improves mood and reduces anxiety-related hypertension",
      "Powerful antioxidant properties protect blood vessels",
      "May help lower blood pressure naturally",
      "Improves circulation",
      "Anti-inflammatory effects"
    ],
    usage: "Mood support and cardiovascular health",
    how_to_use: "Steep a few threads in hot water for tea, or add to food as spice. Very potent - use sparingly.",
    ingredients: "Pure saffron threads (Crocus sativus)",
    dosage: "30-50mg daily (about 10-15 threads)",
    warnings: "Very expensive - beware of counterfeits. High doses may be toxic. Avoid during pregnancy."
  },

  // ========== HIGH BLOOD PRESSURE FRUITS ==========
  {
    name: "Berries (e.g., Blueberries)",
    description: "Small, round blue/purple fruits that are a bit sweet or tart",
    price: "250 EGP",
    image: "images/WhatsApp Image 2025-11-13 at 15.50.15_b3bcc369.jpg",
    category: "fruits",
    disease: "High Blood Pressure",
    tags: ["antioxidant", "premium"],
    rating: 4.7,
    stock: 65,
    benefits: [
      "Rich in anthocyanins that improve blood vessel function",
      "Helps lower systolic and diastolic blood pressure",
      "Improves arterial flexibility",
      "Reduces inflammation in cardiovascular system",
      "High in vitamin C and fiber"
    ],
    usage: "Cardiovascular health and blood pressure management",
    how_to_use: "Eat fresh, frozen, or dried. Add to cereals, yogurt, smoothies or eat as snack.",
    ingredients: "Fresh blueberries, strawberries, raspberries",
    dosage: "1/2 to 1 cup daily",
    warnings: "May interact with blood thinners. Wash thoroughly before eating."
  },
  {
    name: "Citrus Fruits (e.g., Oranges)",
    description: "Round fruit with a thick peel and juicy, tangy sections inside",
    price: "25 EGP",
    image: "images/WhatsApp Image 2025-11-13 at 15.50.16_dc63d8c3.jpg",
    category: "fruits",
    disease: "High Blood Pressure",
    tags: ["affordable", "vitamin_c"],
    rating: 4.2,
    stock: 300,
    benefits: [
      "High in potassium which helps lower blood pressure",
      "Rich in vitamin C for blood vessel health",
      "Contains flavonoids that improve circulation",
      "Natural diuretic properties",
      "Lowers risk of stroke"
    ],
    usage: "Blood pressure regulation and cardiovascular support",
    how_to_use: "Eat fresh, drink juice (with pulp), or add to salads. Whole fruit is better than juice.",
    ingredients: "Fresh oranges, grapefruits, lemons",
    dosage: "1-2 servings daily",
    warnings: "May interact with certain medications (grapefruit). Monitor if on blood pressure medication."
  },
  {
    name: "Grapes (Red or Black)",
    description: "Small, sweet, round fruits that grow in clusters",
    price: "45 EGP",
    image: "images/WhatsApp Image 2025-11-13 at 17.09.29_92da7b75.jpg",
    category: "fruits",
    disease: "High Blood Pressure",
    tags: ["antioxidant"],
    rating: 4.3,
    stock: 180,
    benefits: [
      "Resveratrol in grapes relaxes blood vessels",
      "Improves endothelial function",
      "Lowers blood pressure naturally",
      "Reduces inflammation in arteries",
      "Supports heart health"
    ],
    usage: "Cardiovascular protection and blood pressure management",
    how_to_use: "Eat fresh, frozen, or as raisins. Red and black grapes have highest resveratrol content.",
    ingredients: "Fresh red or black grapes (Vitis vinifera)",
    dosage: "1-2 cups daily",
    warnings: "Contains natural sugars - consume in moderation. Wash thoroughly."
  },
  {
    name: "Peaches",
    description: "A soft, round fruit with fuzzy skin and sweet, juicy yellow or white flesh",
    price: "50 EGP",
    image: "images/WhatsApp Image 2025-11-13 at 17.09.29_e7061d03.jpg",
    category: "fruits",
    disease: "High Blood Pressure",
    tags: ["seasonal"],
    rating: 4.4,
    stock: 140,
    benefits: [
      "Rich in potassium which helps regulate blood pressure",
      "Contains bioactive compounds that improve heart health",
      "High in fiber for cardiovascular protection",
      "Antioxidants protect blood vessels",
      "Natural anti-inflammatory properties"
    ],
    usage: "Blood pressure regulation and heart health",
    how_to_use: "Eat fresh when in season, canned in natural juice, or dried. Can be grilled or baked.",
    ingredients: "Fresh peaches (Prunus persica)",
    dosage: "1-2 medium peaches daily",
    warnings: "Peach pits contain cyanide - do not consume. May cause allergic reactions in sensitive individuals."
  },
  {
    name: "Cantaloupe",
    description: "High in potassium and antioxidants that help regulate blood pressure",
    price: "35 EGP",
    image: "images/75f091bacf823e13171f6dba16bfb3c8.jpg",
    category: "fruits",
    disease: "High Blood Pressure",
    tags: ["affordable", "potassium_rich"],
    rating: 4.1,
    stock: 200,
    benefits: [
      "Very high in potassium for blood pressure control",
      "Contains adenosine which improves blood flow",
      "Rich in vitamin C for blood vessel health",
      "Natural diuretic properties",
      "Low in sodium - ideal for hypertension"
    ],
    usage: "Potassium supplementation and blood pressure management",
    how_to_use: "Eat fresh, in fruit salads, or as juice. Refrigerate after cutting.",
    ingredients: "Fresh cantaloupe melon (Cucumis melo)",
    dosage: "1-2 cups cubed melon daily",
    warnings: "High glycemic index when very ripe. Monitor portion if diabetic."
  },
  {
    name: "Avocado",
    description: "Rich in potassium and healthy fats that support cardiovascular health",
    price: "65 EGP",
    image: "images/8f7345cacff5a603056d55263566d34a.jpg",
    category: "fruits",
    disease: "High Blood Pressure",
    tags: ["healthy_fats", "superfood"],
    rating: 4.6,
    stock: 110,
    benefits: [
      "Exceptionally high in potassium (more than bananas)",
      "Healthy monounsaturated fats improve cholesterol",
      "Contains magnesium which relaxes blood vessels",
      "Fiber helps control blood pressure",
      "Antioxidants protect cardiovascular system"
    ],
    usage: "Cardiovascular health and blood pressure regulation",
    how_to_use: "Eat fresh in salads, as guacamole, on toast, or in smoothies. Add lime juice to prevent browning.",
    ingredients: "Fresh avocado (Persea americana)",
    dosage: "1/4 to 1/2 avocado daily",
    warnings: "High in calories - watch portion size. May interact with blood thinners."
  },

  // ========== DIGESTIVE ISSUES HERBS ==========
  {
    name: "Ginger",
    description: "Helps improve blood circulation and reduce high blood pressure",
    price: "55 EGP",
    image: "images/WhatsApp Image 2025-11-13 at 11.28.07_72c43bd7.jpg",
    category: "herbs",
    disease: "Digestive Issues",
    tags: ["best_seller", "digestive_aid"],
    rating: 4.7,
    stock: 220,
    benefits: [
      "Relieves nausea and vomiting effectively",
      "Reduces inflammation in digestive tract",
      "Helps with indigestion and bloating",
      "Relieves menstrual cramps",
      "May help with motion sickness"
    ],
    usage: "Digestive support and nausea relief",
    how_to_use: "Make ginger tea by steeping fresh slices in hot water. Can also use powder in cooking or take capsules.",
    ingredients: "Fresh ginger root or powder (Zingiber officinale)",
    dosage: "1-2 grams daily (about 1/2 teaspoon powder)",
    warnings: "May interact with blood thinners. Can cause heartburn in some people."
  },
  {
    name: "Peppermint",
    description: "Natural relaxant that helps relax blood vessels and reduce pressure",
    price: "48 EGP",
    image: "images/WhatsApp Image 2025-11-13 at 11.28.07_6bde77bd.jpg",
    category: "herbs",
    disease: "Digestive Issues",
    tags: ["digestive_aid", "refreshing"],
    rating: 4.5,
    stock: 190,
    benefits: [
      "Relieves irritable bowel syndrome (IBS) symptoms",
      "Reduces abdominal pain and bloating",
      "Helps with indigestion and heartburn",
      "Relaxes digestive tract muscles",
      "Freshens breath naturally"
    ],
    usage: "Digestive comfort and IBS symptom relief",
    how_to_use: "Drink as tea after meals. Enteric-coated capsules are best for IBS. Can use oil for aromatherapy.",
    ingredients: "Peppermint leaves or oil (Mentha piperita)",
    dosage: "1-2 cups tea daily or 0.2-0.4ml oil 3 times daily",
    warnings: "May cause heartburn in some people. Avoid in gastroesophageal reflux disease (GERD)."
  },
  {
    name: "Turmeric",
    description: "Contains curcumin that improves heart health and lowers blood pressure",
    price: "65 EGP",
    image: "images/WhatsApp Image 2025-11-13 at 11.28.08_85304445.jpg",
    category: "herbs",
    disease: "Digestive Issues",
    tags: ["anti_inflammatory", "best_seller"],
    rating: 4.8,
    stock: 150,
    benefits: [
      "Reduces inflammation in digestive tract",
      "Helps with ulcerative colitis and Crohn's disease",
      "Improves gut microbiome health",
      "Protects against stomach ulcers",
      "Enhances digestion and nutrient absorption"
    ],
    usage: "Inflammatory bowel disease and digestive health",
    how_to_use: "Mix with black pepper and healthy fat for best absorption. Add to food or take as capsules.",
    ingredients: "Turmeric powder with piperine (black pepper extract)",
    dosage: "500-2000mg curcumin daily",
    warnings: "May interact with blood thinners. Can cause stomach upset in high doses."
  },
  {
    name: "Cinnamon",
    description: "Helps improve blood flow and reduce blood pressure naturally",
    price: "52 EGP",
    image: "images/WhatsApp Image 2025-11-13 at 11.28.08_e3d59e72.jpg",
    category: "herbs",
    disease: "Digestive Issues",
    tags: ["warming", "digestive_aid"],
    rating: 4.4,
    stock: 170,
    benefits: [
      "Helps control blood sugar spikes after meals",
      "Reduces gas and bloating",
      "Anti-microbial properties for gut health",
      "Improves digestion of fats",
      "Warms the digestive system"
    ],
    usage: "Digestive support and blood sugar management",
    how_to_use: "Add to food, drinks, or take as capsules. Ceylon cinnamon is preferred over cassia.",
    ingredients: "Ceylon cinnamon powder (Cinnamomum verum)",
    dosage: "1-6 grams daily (1/2 to 2 teaspoons)",
    warnings: "Cassia cinnamon contains coumarin which can be toxic in high doses. Choose Ceylon variety."
  },
  {
    name: "Fennel",
    description: "Rich in potassium which helps control blood pressure levels",
    price: "45 EGP",
    image: "images/WhatsApp Image 2025-11-13 at 11.28.08_18b3f1c5.jpg",
    category: "herbs",
    disease: "Digestive Issues",
    tags: ["digestive_aid", "affordable"],
    rating: 4.3,
    stock: 160,
    benefits: [
      "Relieves gas, bloating and colic",
      "Reduces abdominal cramps and pain",
      "Acts as mild laxative for constipation",
      "Relieves heartburn and indigestion",
      "Freshens breath naturally"
    ],
    usage: "Digestive comfort and gas relief",
    how_to_use: "Chew seeds after meals, make tea, or use in cooking. Safe for infants in small amounts.",
    ingredients: "Fennel seeds (Foeniculum vulgare)",
    dosage: "1/2 to 1 teaspoon seeds daily",
    warnings: "May interact with certain medications. Generally recognized as safe (GRAS)."
  },
  {
    name: "Garlic",
    description: "Powerful natural remedy that helps lower blood pressure effectively",
    price: "58 EGP",
    image: "images/b62df1618ad99ad22b64c98dda531d16.jpg",
    category: "herbs",
    disease: "Digestive Issues",
    tags: ["antibacterial", "immune_booster"],
    rating: 4.6,
    stock: 210,
    benefits: [
      "Natural antibiotic for gut infections",
      "Improves gut microbiome balance",
      "Reduces risk of stomach cancer",
      "Helps eliminate parasites",
      "Boosts immune system function"
    ],
    usage: "Gut health and immune support",
    how_to_use: "Eat raw (crushed and let sit 10 minutes), cooked, or take aged garlic extract.",
    ingredients: "Fresh garlic cloves (Allium sativum)",
    dosage: "1-2 cloves daily",
    warnings: "May cause bad breath and body odor. Can interact with blood thinners."
  },

  // ========== DIGESTIVE ISSUES FRUITS ==========
  {
    name: "Papaya",
    description: "Rich in potassium and fiber that help regulate blood pressure",
    price: "60 EGP",
    image: "images/WhatsApp Image 2025-11-13 at 11.28.06_7302bbdb.jpg",
    category: "fruits",
    disease: "Digestive Issues",
    tags: ["digestive_enzymes", "tropical"],
    rating: 4.5,
    stock: 95,
    benefits: [
      "Contains papain enzyme that aids protein digestion",
      "Relieves constipation and promotes regularity",
      "Reduces bloating and gas",
      "Soothes heartburn and acid reflux",
      "Anti-inflammatory for digestive tract"
    ],
    usage: "Digestive enzyme support and constipation relief",
    how_to_use: "Eat ripe fruit fresh. Green papaya can be cooked. Seeds are edible and peppery.",
    ingredients: "Fresh papaya fruit (Carica papaya)",
    dosage: "1/2 to 1 medium papaya daily",
    warnings: "Unripe papaya may cause uterine contractions - avoid during pregnancy."
  },
  {
    name: "Pineapple",
    description: "Contains bromelain enzyme that helps improve cardiovascular health",
    price: "70 EGP",
    image: "images/WhatsApp Image 2025-11-13 at 11.28.06_fbcda4bb.jpg",
    category: "fruits",
    disease: "Digestive Issues",
    tags: ["digestive_enzymes", "tropical"],
    rating: 4.6,
    stock: 85,
    benefits: [
      "Bromelain enzyme helps digest proteins",
      "Reduces inflammation in digestive tract",
      "Helps with bloating and gas",
      "May reduce severity of ulcerative colitis",
      "Improves nutrient absorption"
    ],
    usage: "Protein digestion and inflammatory bowel support",
    how_to_use: "Eat fresh, drink juice (with pulp), or take bromelain supplements. Core has highest enzyme content.",
    ingredients: "Fresh pineapple fruit (Ananas comosus)",
    dosage: "1-2 cups fresh pineapple daily",
    warnings: "May cause mouth irritation in some people. Can interact with blood thinners."
  },
  {
    name: "Kiwi",
    description: "High in antioxidants that support heart health and blood pressure control",
    price: "75 EGP",
    image: "images/WhatsApp Image 2025-11-13 at 11.28.07_cc2a6de4.jpg",
    category: "fruits",
    disease: "Digestive Issues",
    tags: ["vitamin_c", "digestive_aid"],
    rating: 4.7,
    stock: 90,
    benefits: [
      "Natural laxative for constipation relief",
      "Contains actinidin enzyme for protein digestion",
      "Prebiotic fiber feeds good gut bacteria",
      "Reduces abdominal discomfort and bloating",
      "Improves bowel movement frequency"
    ],
    usage: "Constipation relief and digestive regularity",
    how_to_use: "Eat with skin for maximum fiber (wash thoroughly). Can eat fresh or in smoothies.",
    ingredients: "Fresh kiwi fruit with skin (Actinidia deliciosa)",
    dosage: "1-2 kiwis daily",
    warnings: "May cause allergic reactions in sensitive individuals. Skin is edible but may be fuzzy."
  },
  {
    name: "Guava",
    description: "Rich in potassium and vitamin C that help maintain healthy blood pressure",
    price: "55 EGP",
    image: "images/WhatsApp Image 2025-11-13 at 11.28.07_96070292.jpg",
    category: "fruits",
    disease: "Digestive Issues",
    tags: ["vitamin_c", "tropical"],
    rating: 4.4,
    stock: 110,
    benefits: [
      "High fiber content prevents constipation",
      "Antimicrobial properties help with diarrhea",
      "Reduces duration of gastrointestinal infections",
      "Improves gut microbiome health",
      "Soothes stomach lining"
    ],
    usage: "Digestive regularity and infection control",
    how_to_use: "Eat fresh with skin (seeds are edible). Can juice or make into smoothies.",
    ingredients: "Fresh guava fruit (Psidium guajava)",
    dosage: "1-2 medium guavas daily",
    warnings: "High in vitamin C - very safe. May interact with certain medications."
  },
  {
    name: "Apricot",
    description: "Rich in potassium, fiber and antioxidants that help regulate blood pressure and support heart health",
    price: "50 EGP",
    image: "images/WhatsApp Image 2025-11-13 at 11.28.07_18f16b37.jpg",
    category: "fruits",
    disease: "Digestive Issues",
    tags: ["fiber_rich", "seasonal"],
    rating: 4.3,
    stock: 120,
    benefits: [
      "High in soluble fiber for constipation relief",
      "Natural laxative properties",
      "Soothes digestive tract inflammation",
      "Improves gut motility",
      "Prebiotic effects feed good bacteria"
    ],
    usage: "Constipation relief and digestive health",
    how_to_use: "Eat fresh when in season, or dried (unsulfured). Soak dried apricots to rehydrate.",
    ingredients: "Fresh or dried apricots (Prunus armeniaca)",
    dosage: "3-4 fresh apricots or 5-6 dried halves daily",
    warnings: "Dried apricots may contain sulfites. Pit contains cyanide - do not consume."
  },
  {
    name: "Watermelon",
    description: "Contains citrulline that helps relax blood vessels and improve blood flow",
    price: "62 EGP",
    image: "images/4e7b1510eb01fe8dcda94f6e176998c0.jpg",
    category: "fruits",
    disease: "Digestive Issues",
    tags: ["hydrating", "seasonal"],
    rating: 4.5,
    stock: 130,
    benefits: [
      "High water content prevents constipation",
      "Contains prebiotic fiber for gut health",
      "Electrolytes help with digestive balance",
      "Soothes acid reflux",
      "Anti-inflammatory for digestive tract"
    ],
    usage: "Hydration and digestive regularity",
    how_to_use: "Eat fresh, juice, or blend into smoothies. Can eat rind in pickles or stir-fries.",
    ingredients: "Fresh watermelon fruit (Citrullus lanatus)",
    dosage: "1-2 cups cubed watermelon daily",
    warnings: "High glycemic index when very ripe. Contains natural sugars."
  }
];

// ==================== بيانات الفئات ====================
const categoriesData = [
  {
    name: "Diabetes",
    type: "disease",
    description: "Natural products for diabetes management and blood sugar control",
    image: "images/categories/diabetes.jpg",
    featured: true
  },
  {
    name: "High Blood Pressure",
    type: "disease",
    description: "Herbal remedies for hypertension and blood pressure regulation",
    image: "images/categories/blood-pressure.jpg",
    featured: true
  },
  {
    name: "Digestive Issues",
    type: "disease",
    description: "Natural solutions for digestive health and gastrointestinal comfort",
    image: "images/categories/digestive.jpg",
    featured: true
  },
  {
    name: "Herbs",
    type: "product_type",
    description: "Medicinal herbs and plants for various health conditions",
    image: "images/categories/herbs.jpg",
    featured: false
  },
  {
    name: "Fruits",
    type: "product_type",
    description: "Healthy fruits, extracts, and natural fruit-based remedies",
    image: "images/categories/fruits.jpg",
    featured: false
  }
];

// ==================== دالة تهيئة قاعدة البيانات ====================
async function seedDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('herbalDB');
    
    console.log('🗑️  Clearing existing data...');
    await db.collection('products').deleteMany({});
    await db.collection('categories').deleteMany({});
    await db.collection('users').deleteMany({});
    
    // ========== إضافة الفئات ==========
    console.log('🌿 Adding categories...');
    const categories = categoriesData.map(data => new Category(data));
    const categoryResult = await db.collection('categories').insertMany(
      categories.map(c => {
        const obj = { ...c };
        delete obj._id;
        return obj;
      })
    );
    
    // الحصول على IDs للفئات
    const categoryIds = {};
    const insertedCategories = await db.collection('categories').find({}).toArray();
    insertedCategories.forEach(cat => {
      categoryIds[cat.name] = cat._id;
    });
    
    console.log(`✅ Added ${categoryResult.insertedCount} categories`);
    
    // ========== إضافة المنتجات ==========
    console.log('🛍️ Adding products...');
    const products = productsData.map(data => new Product(data));
    const productResult = await db.collection('products').insertMany(
      products.map(p => {
        const obj = { ...p };
        delete obj._id;
        
        // إضافة categoryId المرجعي
        if (categoryIds[obj.disease]) {
          obj.categoryId = categoryIds[obj.disease];
        }
        
        return obj;
      })
    );
    
    console.log(`✅ Added ${productResult.insertedCount} products`);
    
    // ========== تحديث عدد المنتجات في كل فئة ==========
    console.log('📊 Updating product counts in categories...');
    for (const category of insertedCategories) {
      const productCount = await db.collection('products').countDocuments({
        $or: [
          { disease: category.name },
          { category: category.name.toLowerCase() }
        ]
      });
      
      await db.collection('categories').updateOne(
        { _id: category._id },
        { $set: { productsCount: productCount } }
      );
    }
    
    // ========== إنشاء مستخدمين ==========
    console.log('👥 Creating users...');
    
    // مستخدم أدمن
    const admin = new User({
      name: "Admin User",
      email: "admin@herbalhealth.com",
      password: "admin123",
      role: "admin",
      phone: "+20108651139",
      address: {
        street: "Tahrir Street",
        city: "Cairo",
        country: "Egypt"
      }
    });
    await admin.hashPassword();
    await db.collection('users').insertOne(admin);
    
    // مستخدم عادي
    const regularUser = new User({
      name: "Regular User",
      email: "user@example.com",
      password: "password123",
      role: "user",
      phone: "+201012345678",
      healthConcerns: ["Diabetes", "Digestive Issues"],
      address: {
        street: "Nasr City",
        city: "Cairo",
        country: "Egypt"
      }
    });
    await regularUser.hashPassword();
    await db.collection('users').insertOne(regularUser);
    
    // مستخدم ستاف
    const staffUser = new User({
      name: "Hospital Staff",
      email: "staff@herbalhealth.com",
      password: "staff123",
      role: "staff",
      phone: "+201098765432"
    });
    await staffUser.hashPassword();
    await db.collection('users').insertOne(staffUser);
    
    console.log('✅ Added 3 users (admin, regular, staff)');
    
    // ========== عرض الإحصائيات ==========
    console.log('\n🎉 Database seeded successfully!');
    console.log('='.repeat(50));
    console.log('📊 STATISTICS:');
    console.log('='.repeat(50));
    
    const finalCategories = await db.collection('categories').find({}).toArray();
    const finalProducts = await db.collection('products').find({}).toArray();
    
    // إحصائيات الفئات
    console.log('\n📁 CATEGORIES:');
    finalCategories.forEach(cat => {
      console.log(`   • ${cat.name}: ${cat.productsCount} products`);
    });
    
    // إحصائيات الأمراض
    console.log('\n🏥 DISEASES:');
    const diseases = ['Diabetes', 'High Blood Pressure', 'Digestive Issues'];
    for (const disease of diseases) {
      const count = finalProducts.filter(p => p.disease === disease).length;
      const herbs = finalProducts.filter(p => p.disease === disease && p.category === 'herbs').length;
      const fruits = finalProducts.filter(p => p.disease === disease && p.category === 'fruits').length;
      console.log(`   • ${disease}: ${count} products (${herbs} herbs, ${fruits} fruits)`);
    }
    
    // إحصائيات عامة
    console.log('\n📈 OVERALL:');
    console.log(`   • Total Products: ${finalProducts.length}`);
    console.log(`   • Total Categories: ${finalCategories.length}`);
    console.log(`   • Herbs: ${finalProducts.filter(p => p.category === 'herbs').length}`);
    console.log(`   • Fruits: ${finalProducts.filter(p => p.category === 'fruits').length}`);
    
    // بيانات الدخول
    console.log('\n🔑 LOGIN CREDENTIALS:');
    console.log('   • Admin: admin@herbalhealth.com / admin123');
    console.log('   • User: user@example.com / password123');
    console.log('   • Staff: staff@herbalhealth.com / staff123');
    
    console.log('\n🚀 Backend is ready! Run: npm run dev');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    console.error('Stack:', error.stack);
  } finally {
    await client.close();
    process.exit(0);
  }
}

// ==================== تشغيل سكريبت البذور ====================
seedDatabase();