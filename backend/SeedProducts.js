// seedProducts.js
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product  = require('./models/Product');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected');

  // ── 1. Categories ──────────────────────────────────────────────────────
  await Category.deleteMany({});

  const cats = await Category.insertMany([
    { name: 'Sarees',       slug: 'sarees',       image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80' },
    { name: 'Kurtas',       slug: 'kurtas',       image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80' },
    { name: 'Lehengas',     slug: 'lehengas',     image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80' },
    { name: 'Western Wear', slug: 'western-wear', image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=600&q=80' },
    { name: 'Winter Wear',  slug: 'winter-wear',  image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80' },
  ]);

  const id = (name) => cats.find(c => c.name === name)._id;
  console.log('📁 Categories inserted');

  // ── 2. Products ────────────────────────────────────────────────────────
  await Product.deleteMany({});

  await Product.insertMany([

    // ── SAREES ────────────────────────────────────────────────────────
    {
      name: 'Banarasi Silk Saree', slug: 'banarasi-silk-saree',
      category: id('Sarees'),
      mainImage: { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', publicId: 'zuri/sarees/banarasi_main' },
      images: [
        { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80', publicId: 'zuri/sarees/banarasi_1' },
        { url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', publicId: 'zuri/sarees/banarasi_2' },
      ],
      price: 4999, mrp: 7999, discount: 37,
      description: 'Handwoven Banarasi silk saree with intricate zari work and golden border. A timeless piece for weddings and festive occasions. Each saree takes skilled weavers 15–30 days to complete.',
      shortDescription: 'Handwoven Banarasi silk with zari work',
      sizes: [{ size: 'Free Size', stock: 15 }],
      colors: [{ name: 'Royal Red', hex: '#8B0000' }, { name: 'Deep Blue', hex: '#00008B' }, { name: 'Emerald', hex: '#50C878' }],
      fabric: 'Pure Banarasi Silk',
      careInstructions: ['Dry clean only', 'Store in muslin cloth', 'Avoid direct sunlight'],
      stock: 15, isActive: true, isFeatured: true, isNewArrival: false, isBestSeller: true,
    },

    {
      name: 'Chiffon Floral Saree', slug: 'chiffon-floral-saree',
      category: id('Sarees'),
      mainImage: { url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', publicId: 'zuri/sarees/chiffon_main' },
      images: [
        { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', publicId: 'zuri/sarees/chiffon_1' },
        { url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80', publicId: 'zuri/sarees/chiffon_2' },
      ],
      price: 1299, mrp: 2199, discount: 41,
      description: 'Light and breezy chiffon saree with delicate floral prints. Perfect for daytime events, office wear, and casual outings. The soft drape makes it easy to wear all day.',
      shortDescription: 'Lightweight chiffon with floral prints',
      sizes: [{ size: 'Free Size', stock: 30 }],
      colors: [{ name: 'Peach', hex: '#FFCBA4' }, { name: 'Mint Green', hex: '#98FF98' }, { name: 'Lavender', hex: '#E6E6FA' }],
      fabric: 'Georgette Chiffon',
      careInstructions: ['Hand wash in cold water', 'Do not wring', 'Iron on low heat'],
      stock: 30, isActive: true, isFeatured: false, isNewArrival: true, isBestSeller: false,
    },

    {
      name: 'Kanjivaram Silk Saree', slug: 'kanjivaram-silk-saree',
      category: id('Sarees'),
      mainImage: { url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80', publicId: 'zuri/sarees/kanjivaram_main' },
      images: [
        { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', publicId: 'zuri/sarees/kanjivaram_1' },
        { url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', publicId: 'zuri/sarees/kanjivaram_2' },
      ],
      price: 8999, mrp: 13999, discount: 36,
      description: 'Premium Kanjivaram silk saree with temple border design and rich pallu. A South Indian classic for weddings and religious ceremonies. Woven on traditional pit looms in Kanchipuram.',
      shortDescription: 'Premium Kanjivaram silk with temple border',
      sizes: [{ size: 'Free Size', stock: 8 }],
      colors: [{ name: 'Magenta', hex: '#FF00FF' }, { name: 'Peacock Blue', hex: '#005F6A' }, { name: 'Gold', hex: '#FFD700' }],
      fabric: 'Pure Kanjivaram Silk',
      careInstructions: ['Dry clean only', 'Wrap in soft cloth', 'Keep away from moisture'],
      stock: 8, isActive: true, isFeatured: true, isNewArrival: false, isBestSeller: true,
    },

    // ── KURTAS ────────────────────────────────────────────────────────
    {
      name: 'Cotton Anarkali Kurta', slug: 'cotton-anarkali-kurta',
      category: id('Kurtas'),
      mainImage: { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80', publicId: 'zuri/kurtas/anarkali_main' },
      images: [
        { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', publicId: 'zuri/kurtas/anarkali_1' },
        { url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', publicId: 'zuri/kurtas/anarkali_2' },
      ],
      price: 899, mrp: 1499, discount: 40,
      description: 'Flared Anarkali style kurta in breathable cotton with intricate block print. Pairs beautifully with churidar or straight pants. The flared silhouette is flattering for all body types.',
      shortDescription: 'Flared Anarkali in breathable block-print cotton',
      sizes: [
        { size: 'XS', stock: 5 }, { size: 'S', stock: 12 }, { size: 'M', stock: 18 },
        { size: 'L',  stock: 14 }, { size: 'XL', stock: 8 }, { size: 'XXL', stock: 4 },
      ],
      colors: [{ name: 'Dusty Rose', hex: '#DCAE96' }, { name: 'Indigo', hex: '#4B0082' }, { name: 'Mustard', hex: '#FFDB58' }],
      fabric: 'Pure Cotton',
      careInstructions: ['Machine wash cold', 'Tumble dry low', 'Iron on medium heat'],
      stock: 61, isActive: true, isFeatured: true, isNewArrival: true, isBestSeller: false,
    },

    {
      name: 'Straight Fit Kurti', slug: 'straight-fit-kurti',
      category: id('Kurtas'),
      mainImage: { url: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&q=80', publicId: 'zuri/kurtas/straight_main' },
      images: [
        { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80', publicId: 'zuri/kurtas/straight_1' },
        { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', publicId: 'zuri/kurtas/straight_2' },
      ],
      price: 599, mrp: 999, discount: 40,
      description: 'Classic straight fit kurti with subtle embroidery at the neckline. Versatile enough for office, college, or casual outings. The breathable rayon fabric keeps you comfortable all day.',
      shortDescription: 'Classic straight fit with embroidered neckline',
      sizes: [
        { size: 'S', stock: 20 }, { size: 'M', stock: 25 },
        { size: 'L', stock: 20 }, { size: 'XL', stock: 15 }, { size: 'XXL', stock: 10 },
      ],
      colors: [{ name: 'Off White', hex: '#FAF9F6' }, { name: 'Navy Blue', hex: '#000080' }, { name: 'Olive', hex: '#808000' }, { name: 'Maroon', hex: '#800000' }],
      fabric: 'Rayon',
      careInstructions: ['Hand wash preferred', 'Do not bleach', 'Warm iron'],
      stock: 90, isActive: true, isFeatured: false, isNewArrival: false, isBestSeller: true,
    },

    // ── LEHENGAS ──────────────────────────────────────────────────────
    {
      name: 'Bridal Velvet Lehenga', slug: 'bridal-velvet-lehenga',
      category: id('Lehengas'),
      mainImage: { url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', publicId: 'zuri/lehengas/bridal_main' },
      images: [
        { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', publicId: 'zuri/lehengas/bridal_1' },
        { url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80', publicId: 'zuri/lehengas/bridal_2' },
      ],
      price: 24999, mrp: 39999, discount: 38,
      description: 'Luxurious velvet lehenga with heavy zardozi embroidery and dupatta. Designed for brides who want to make a grand statement. Includes matching blouse piece and embroidered dupatta.',
      shortDescription: 'Luxurious velvet with zardozi embroidery',
      sizes: [{ size: 'S', stock: 3 }, { size: 'M', stock: 5 }, { size: 'L', stock: 4 }, { size: 'XL', stock: 2 }],
      colors: [{ name: 'Ruby Red', hex: '#9B111E' }, { name: 'Royal Purple', hex: '#7851A9' }, { name: 'Champagne', hex: '#F7E7CE' }],
      fabric: 'Velvet with Net Dupatta',
      careInstructions: ['Dry clean only', 'Store flat', 'Do not wring or twist'],
      stock: 14, isActive: true, isFeatured: true, isNewArrival: false, isBestSeller: true,
    },

    {
      name: 'Georgette Party Lehenga', slug: 'georgette-party-lehenga',
      category: id('Lehengas'),
      mainImage: { url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80', publicId: 'zuri/lehengas/party_main' },
      images: [
        { url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', publicId: 'zuri/lehengas/party_1' },
        { url: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&q=80', publicId: 'zuri/lehengas/party_2' },
      ],
      price: 5999, mrp: 9999, discount: 40,
      description: 'Elegant georgette lehenga with sequin work and flared skirt. Perfect for sangeet, reception, and festive parties. The lightweight fabric allows easy movement on the dance floor.',
      shortDescription: 'Sequin georgette lehenga for parties',
      sizes: [{ size: 'XS', stock: 4 }, { size: 'S', stock: 8 }, { size: 'M', stock: 10 }, { size: 'L', stock: 7 }, { size: 'XL', stock: 5 }],
      colors: [{ name: 'Blush Pink', hex: '#FFB6C1' }, { name: 'Midnight Blue', hex: '#191970' }, { name: 'Sage Green', hex: '#8FBC8F' }],
      fabric: 'Georgette with Sequin Work',
      careInstructions: ['Dry clean recommended', 'Handle sequins gently', 'Store in garment bag'],
      stock: 34, isActive: true, isFeatured: false, isNewArrival: true, isBestSeller: false,
    },

    // ── WESTERN WEAR ──────────────────────────────────────────────────
    {
      name: 'High-Waist Palazzo Pants', slug: 'high-waist-palazzo-pants',
      category: id('Western Wear'),
      mainImage: { url: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&q=80', publicId: 'zuri/western/palazzo_main' },
      images: [
        { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80', publicId: 'zuri/western/palazzo_1' },
        { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', publicId: 'zuri/western/palazzo_2' },
      ],
      price: 699, mrp: 1199, discount: 42,
      description: 'Flowy high-waist palazzo pants in crepe fabric. Can be styled with crop tops, shirts, or kurtis for a chic Indo-western look. The elastic waistband ensures a comfortable fit.',
      shortDescription: 'Flowy crepe palazzo for Indo-western styling',
      sizes: [
        { size: 'XS', stock: 8 }, { size: 'S', stock: 15 }, { size: 'M', stock: 20 },
        { size: 'L',  stock: 18 }, { size: 'XL', stock: 12 }, { size: 'XXL', stock: 6 },
      ],
      colors: [{ name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' }, { name: 'Camel', hex: '#C19A6B' }, { name: 'Rust Orange', hex: '#B7410E' }],
      fabric: 'Crepe',
      careInstructions: ['Machine wash cold', 'Do not bleach', 'Iron on low heat'],
      stock: 79, isActive: true, isFeatured: false, isNewArrival: true, isBestSeller: true,
    },

    {
      name: 'Floral Wrap Dress', slug: 'floral-wrap-dress',
      category: id('Western Wear'),
      mainImage: { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', publicId: 'zuri/western/wrapDress_main' },
      images: [
        { url: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&q=80', publicId: 'zuri/western/wrapDress_1' },
        { url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', publicId: 'zuri/western/wrapDress_2' },
      ],
      price: 1199, mrp: 1999, discount: 40,
      description: 'Flattering wrap-style dress with bold floral print. The adjustable tie waist suits all body types. Great for brunches, vacations, and casual gatherings.',
      shortDescription: 'Flattering wrap dress with bold floral print',
      sizes: [{ size: 'XS', stock: 6 }, { size: 'S', stock: 14 }, { size: 'M', stock: 16 }, { size: 'L', stock: 10 }, { size: 'XL', stock: 6 }],
      colors: [{ name: 'Tropical Blue', hex: '#0085C7' }, { name: 'Coral', hex: '#FF6F61' }],
      fabric: 'Viscose',
      careInstructions: ['Hand wash cold', 'Lay flat to dry', 'Cool iron'],
      stock: 52, isActive: true, isFeatured: true, isNewArrival: true, isBestSeller: false,
    },

    // ── WINTER WEAR ───────────────────────────────────────────────────
    {
      name: 'Embroidered Pashmina Shawl', slug: 'embroidered-pashmina-shawl',
      category: id('Winter Wear'),
      mainImage: { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80', publicId: 'zuri/winter/pashmina_main' },
      images: [
        { url: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&q=80', publicId: 'zuri/winter/pashmina_1' },
        { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', publicId: 'zuri/winter/pashmina_2' },
      ],
      price: 2999, mrp: 4999, discount: 40,
      description: 'Authentic Kashmiri pashmina shawl with hand-embroidered floral motifs. Lightweight yet extremely warm. Each piece is unique and takes artisans several days to embroider by hand.',
      shortDescription: 'Authentic Kashmiri pashmina with hand embroidery',
      sizes: [{ size: 'Free Size', stock: 20 }],
      colors: [{ name: 'Ivory', hex: '#FFFFF0' }, { name: 'Charcoal', hex: '#36454F' }, { name: 'Burgundy', hex: '#800020' }, { name: 'Camel', hex: '#C19A6B' }],
      fabric: 'Pure Pashmina',
      careInstructions: ['Dry clean only', 'Store with cedar balls', 'Fold, do not hang'],
      stock: 20, isActive: true, isFeatured: true, isNewArrival: false, isBestSeller: true,
    },

    {
      name: 'Woolen Cardigan', slug: 'woolen-cardigan',
      category: id('Winter Wear'),
      mainImage: { url: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&q=80', publicId: 'zuri/winter/cardigan_main' },
      images: [
        { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80', publicId: 'zuri/winter/cardigan_1' },
        { url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80', publicId: 'zuri/winter/cardigan_2' },
      ],
      price: 1599, mrp: 2499, discount: 36,
      description: 'Cosy button-front woolen cardigan with ribbed cuffs and hem. Layer over kurtis or pair with jeans for effortless winter style. The merino wool blend is soft against the skin.',
      shortDescription: 'Cosy button-front woolen cardigan',
      sizes: [{ size: 'S', stock: 10 }, { size: 'M', stock: 15 }, { size: 'L', stock: 12 }, { size: 'XL', stock: 8 }, { size: 'XXL', stock: 4 }],
      colors: [{ name: 'Oatmeal', hex: '#E5D5B0' }, { name: 'Slate Grey', hex: '#708090' }, { name: 'Forest', hex: '#228B22' }],
      fabric: 'Merino Wool Blend',
      careInstructions: ['Hand wash in lukewarm water', 'Reshape while damp', 'Dry flat'],
      stock: 49, isActive: true, isFeatured: false, isNewArrival: true, isBestSeller: false,
    },

  ]);

  console.log('👗 11 products inserted');
  console.log('🎉 Done!');
  await mongoose.disconnect();
};

seed().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});