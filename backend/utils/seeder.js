const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const categories = [
  { name: 'Short Kurti', slug: 'short-kurti', icon: '👗', description: 'Trendy short kurtis for everyday wear', displayOrder: 1, isActive: true, isFeatured: true, season: 'all' },
  { name: 'Long Kurti', slug: 'long-kurti', icon: '🥻', description: 'Elegant long kurtis for all occasions', displayOrder: 2, isActive: true, isFeatured: true, season: 'all' },
  { name: 'Suits', slug: 'suits', icon: '✨', description: 'Beautiful salwar suits and dress materials', displayOrder: 3, isActive: true, isFeatured: true, season: 'all' },
  { name: 'Tops', slug: 'tops', icon: '👚', description: 'Stylish tops and shirts', displayOrder: 4, isActive: true, isFeatured: false, season: 'all' },
  { name: 'Bottomwear', slug: 'bottomwear', icon: '👖', description: 'Palazzos, leggings, and more', displayOrder: 5, isActive: true, isFeatured: false, season: 'all' },
  { name: 'Accessories', slug: 'accessories', icon: '💎', description: 'Fashion accessories and jewellery', displayOrder: 6, isActive: true, isFeatured: false, season: 'all' },
  { name: 'Summer Collection', slug: 'summer-collection', icon: '☀️', description: 'Light and breezy summer fashion', displayOrder: 7, isActive: true, isFeatured: true, season: 'summer' },
  { name: 'Winter Collection', slug: 'winter-collection', icon: '❄️', description: 'Cozy winter fashion collection', displayOrder: 8, isActive: true, isFeatured: true, season: 'winter' },
];

const getProducts = (categoryIds) => [
  { name: 'Floral Print Short Kurti', description: 'Beautiful floral print cotton kurti perfect for casual outings. Soft fabric, easy to care for.', shortDescription: 'Floral cotton kurti', price: 599, mrp: 999, category: categoryIds['short-kurti'], sizes: [{size:'XS',stock:10},{size:'S',stock:15},{size:'M',stock:20},{size:'L',stock:12},{size:'XL',stock:8}], colors: [{name:'Pink',hex:'#FF69B4'},{name:'White',hex:'#FFFFFF'}], fabric: 'Cotton', isFeatured: true, isNewArrival: true, stock: 65, tags: ['floral','cotton','casual'], season: 'summer', images: [{url:'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600',publicId:'demo1'}] },
  { name: 'Embroidered Short Kurti', description: 'Handcrafted embroidered kurti with mirror work. Traditional yet modern design.', shortDescription: 'Mirror work kurti', price: 849, mrp: 1299, category: categoryIds['short-kurti'], sizes: [{size:'S',stock:8},{size:'M',stock:12},{size:'L',stock:10}], colors: [{name:'Yellow',hex:'#FFD700'},{name:'Green',hex:'#228B22'}], fabric: 'Rayon', isFeatured: false, isNewArrival: true, isBestSeller: true, stock: 30, tags: ['embroidered','festive','ethnic'], season: 'all', images: [{url:'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600',publicId:'demo2'}] },
  { name: 'Anarkali Long Kurti', description: 'Graceful Anarkali style long kurti with delicate lace detailing. Perfect for festive occasions.', shortDescription: 'Anarkali festive kurti', price: 1299, mrp: 2199, category: categoryIds['long-kurti'], sizes: [{size:'S',stock:6},{size:'M',stock:10},{size:'L',stock:8},{size:'XL',stock:5}], colors: [{name:'Maroon',hex:'#800000'},{name:'Navy',hex:'#000080'}], fabric: 'Georgette', isFeatured: true, isBestSeller: true, stock: 29, tags: ['anarkali','festive','party'], season: 'all', images: [{url:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600',publicId:'demo3'}] },
  { name: 'Block Print Long Kurti', description: 'Traditional block print long kurti inspired by Rajasthani art. Natural dyes, breathable fabric.', shortDescription: 'Rajasthani block print', price: 999, mrp: 1599, category: categoryIds['long-kurti'], sizes: [{size:'XS',stock:5},{size:'S',stock:8},{size:'M',stock:15},{size:'L',stock:10}], colors: [{name:'Indigo',hex:'#4B0082'},{name:'Rust',hex:'#B7410E'}], fabric: 'Cotton', isFeatured: true, isNewArrival: false, stock: 38, tags: ['blockprint','traditional','rajasthani'], season: 'all', images: [{url:'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600',publicId:'demo4'}] },
  { name: 'Cotton Palazzo Suit', description: 'Comfortable 3-piece palazzo suit set with dupatta. Ideal for daily wear and casual occasions.', shortDescription: 'Palazzo 3-piece set', price: 1499, mrp: 2499, category: categoryIds['suits'], sizes: [{size:'S',stock:7},{size:'M',stock:12},{size:'L',stock:9},{size:'XL',stock:6}], colors: [{name:'Peach',hex:'#FFCBA4'},{name:'Lavender',hex:'#E6E6FA'}], fabric: 'Cotton Blend', isFeatured: true, isBestSeller: true, stock: 34, tags: ['palazzo','3piece','casual'], season: 'summer', images: [{url:'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600',publicId:'demo5'}] },
  { name: 'Patiala Salwar Suit', description: 'Classic Patiala suit with beautiful phulkari embroidery. A timeless traditional look.', shortDescription: 'Phulkari Patiala suit', price: 1799, mrp: 2999, category: categoryIds['suits'], sizes: [{size:'S',stock:5},{size:'M',stock:8},{size:'L',stock:7}], colors: [{name:'Royal Blue',hex:'#4169E1'},{name:'Magenta',hex:'#FF00FF'}], fabric: 'Silk Blend', isFeatured: false, isBestSeller: true, stock: 20, tags: ['patiala','phulkari','traditional'], season: 'all', images: [{url:'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600',publicId:'demo6'}] },
  { name: 'Crop Halter Top', description: 'Trendy crop halter top perfect for summer outings. Lightweight and stylish.', shortDescription: 'Summer halter crop top', price: 449, mrp: 699, category: categoryIds['tops'], sizes: [{size:'XS',stock:10},{size:'S',stock:15},{size:'M',stock:12}], colors: [{name:'White',hex:'#FFFFFF'},{name:'Black',hex:'#000000'},{name:'Sky Blue',hex:'#87CEEB'}], fabric: 'Crepe', isFeatured: false, isNewArrival: true, stock: 37, tags: ['crop','halter','summer'], season: 'summer', images: [{url:'https://images.unsplash.com/photo-1592301933927-35b597393c0a?w=600',publicId:'demo7'}] },
  { name: 'Flared Palazzo Pants', description: 'Wide-leg palazzo pants with elastic waistband. Extremely comfortable for all-day wear.', shortDescription: 'Wide-leg palazzos', price: 699, mrp: 1099, category: categoryIds['bottomwear'], sizes: [{size:'S',stock:12},{size:'M',stock:18},{size:'L',stock:15},{size:'XL',stock:10}], colors: [{name:'Black',hex:'#000000'},{name:'Beige',hex:'#F5F5DC'},{name:'Red',hex:'#FF0000'}], fabric: 'Rayon', isFeatured: false, isBestSeller: true, stock: 55, tags: ['palazzo','bottomwear','comfortable'], season: 'all', images: [{url:'https://images.unsplash.com/photo-1594938298603-c8148c4b4d6a?w=600',publicId:'demo8'}] },
  { name: 'Kundan Necklace Set', description: 'Stunning kundan polki necklace set with earrings and maang tikka. Perfect for weddings.', shortDescription: 'Bridal kundan set', price: 1299, mrp: 2199, category: categoryIds['accessories'], sizes: [{size:'Free Size',stock:20}], colors: [{name:'Gold',hex:'#FFD700'}], fabric: 'Metal Alloy', isFeatured: true, isNewArrival: false, stock: 20, tags: ['kundan','jewellery','bridal','wedding'], season: 'all', images: [{url:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600',publicId:'demo9'}] },
  { name: 'Linen Sleeveless Kurti', description: 'Breathable linen kurti perfect for hot summer days. Simple, elegant, and cool.', shortDescription: 'Summer linen kurti', price: 749, mrp: 1199, category: categoryIds['summer-collection'], sizes: [{size:'XS',stock:8},{size:'S',stock:12},{size:'M',stock:16},{size:'L',stock:10}], colors: [{name:'Off White',hex:'#FAF9F6'},{name:'Mint',hex:'#98FF98'}], fabric: 'Linen', isFeatured: true, isNewArrival: true, stock: 46, tags: ['linen','summer','sleeveless'], season: 'summer', images: [{url:'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600',publicId:'demo10'}] },
  { name: 'Woolen Shawl Kurti Set', description: 'Warm woolen kurti with matching shawl. Ideal for chilly winter evenings and festive season.', shortDescription: 'Winter kurti with shawl', price: 1899, mrp: 3199, category: categoryIds['winter-collection'], sizes: [{size:'S',stock:6},{size:'M',stock:8},{size:'L',stock:7},{size:'XL',stock:4}], colors: [{name:'Burgundy',hex:'#800020'},{name:'Forest Green',hex:'#228B22'}], fabric: 'Wool Blend', isFeatured: true, isNewArrival: false, stock: 25, tags: ['woolen','winter','shawl','festive'], season: 'winter', images: [{url:'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600',publicId:'demo11'}] },
  { name: 'Silk Party Wear Gown', description: 'Floor-length silk gown with embellishments. Stunning party and reception wear.', shortDescription: 'Floor-length party gown', price: 3499, mrp: 5999, category: categoryIds['long-kurti'], sizes: [{size:'S',stock:4},{size:'M',stock:6},{size:'L',stock:5}], colors: [{name:'Teal',hex:'#008080'},{name:'Purple',hex:'#800080'}], fabric: 'Art Silk', isFeatured: true, isBestSeller: false, stock: 15, tags: ['party','gown','silk','festive'], season: 'all', images: [{url:'https://images.unsplash.com/photo-1617691919729-c3d9e6e59b80?w=600',publicId:'demo12'}] },
];

async function seed() {
  try {
    console.log(process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany()]);
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin Zuri',
      email: 'admin@zurifashion.com',
      password: 'admin123456',
      role: 'admin',
    });
    console.log('Admin created:', admin.email);

    // Create test user
    await User.create({
      name: 'Test User',
      email: 'user@zurifashion.com',
      password: 'user123456',
      role: 'user',
    });

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    const categoryMap = {};
    createdCategories.forEach(c => { categoryMap[c.slug] = c._id; });
    console.log('Categories created:', createdCategories.length);

    // Create products
    const productData = getProducts(categoryMap);
    await Product.insertMany(productData);
    console.log('Products created:', productData.length);

    console.log('\n✅ Seeding complete!');
    console.log('Admin: admin@zurifashion.com / admin123456');
    console.log('User:  user@zurifashion.com / user123456');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
