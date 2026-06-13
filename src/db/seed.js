import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcryptjs';

// Initialize the Postgres Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const categories = [
  {
    name: 'Ceramics',
    slug: 'ceramics',
    description: 'Handmade pottery, mugs, bowls, and decorative ceramic pieces',
    imageUrl: 'https://loremflickr.com/cache/resized/65535_54472909262_ec8ac75e95_b_800_800_nofilter.jpg',
  },
  {
    name: 'Jewelry',
    slug: 'jewelry',
    description: 'Unique handcrafted necklaces, bracelets, earrings, and rings',
    imageUrl: 'https://loremflickr.com/800/800/jewelry,necklace/all',
  },
  {
    name: 'Woodwork',
    slug: 'woodwork',
    description: 'Carved wooden items, furniture, cutting boards, and art pieces',
    imageUrl: 'https://loremflickr.com/800/800/woodwork,wood/all',
  },
  {
    name: 'Textiles',
    slug: 'textiles',
    description: 'Handwoven fabrics, knitted goods, quilts, and embroidery',
    imageUrl: 'https://loremflickr.com/800/800/textiles,fabric/all',
  },
  {
    name: 'Leather',
    slug: 'leather',
    description: 'Hand-tooled leather bags, wallets, belts, and accessories',
    imageUrl: 'https://loremflickr.com/800/800/leather,wallet/all',
  },
  {
    name: 'Candles',
    slug: 'candles',
    description: 'Artisan candles made with natural waxes and essential oils',
    imageUrl: 'https://loremflickr.com/800/800/candles,candle/all',
  },
  {
    name: 'Art Prints',
    slug: 'art-prints',
    description: 'Original artwork, illustrations, and limited edition prints',
    imageUrl: 'https://loremflickr.com/800/800/art,print/all',
  },
  {
    name: 'Home Decor',
    slug: 'home-decor',
    description: 'Handmade decorations, wall art, planters, and accessories',
    imageUrl: 'https://loremflickr.com/800/800/decor,home/all',
  },
];

async function main() {
  console.log('🌱 Starting database seed via raw SQL...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Seed Categories
    console.log('Seeding categories...');
    const catMap = {};
    
    for (const category of categories) {
      const res = await client.query(
        `INSERT INTO "categories" (name, slug, description, image_url)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (slug) 
         DO UPDATE SET image_url = EXCLUDED.image_url
         RETURNING id, slug`,
        [category.name, category.slug, category.description, category.imageUrl]
      );
      const row = res.rows[0];
      catMap[row.slug] = row.id;
    }

    // 2. Seed Users
    console.log('Seeding users...');
    const passwordHash = await bcrypt.hash('password123', 10);
    const users = [
      {
        email: 'buyer@example.com',
        name: 'Alex Shopper',
        role: 'buyer',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
        bannerColor: '#2F4F4F',
        socialLinks: null
      },
      {
        email: 'artisan@example.com',
        name: 'Sarah Crafts',
        role: 'seller',
        bio: 'Passionate about creating unique ceramic pieces.',
        location: 'Portland, OR',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
        bannerColor: '#f28b82',
        socialLinks: { instagram: 'https://instagram.com', website: 'https://example.com' }
      },
      {
        email: 'woodcrafter@example.com',
        name: 'Mark Woods',
        role: 'seller',
        bio: 'Sustainable woodworking from salvaged timber.',
        location: 'Austin, TX',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        bannerColor: '#fbbc04',
        socialLinks: { facebook: 'https://facebook.com' }
      },
      {
        email: 'weaver@example.com',
        name: 'Elena Thread',
        role: 'seller',
        bio: 'Handwoven textiles and modern macrame.',
        location: 'Brooklyn, NY',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
        bannerColor: '#ccff90',
        socialLinks: { instagram: 'https://instagram.com', twitter: 'https://twitter.com', website: 'https://example.com' }
      }
    ];

    const userMap = {};
    for (const u of users) {
      const res = await client.query(
        `INSERT INTO "users" (email, password_hash, name, role, bio, location, avatar_url, banner_color, social_links)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (email) 
         DO UPDATE SET name = EXCLUDED.name, avatar_url = EXCLUDED.avatar_url, banner_color = EXCLUDED.banner_color, social_links = EXCLUDED.social_links
         RETURNING id, email`,
        [u.email, passwordHash, u.name, u.role, u.bio, u.location, u.avatarUrl, u.bannerColor, u.socialLinks]
      );
      userMap[res.rows[0].email] = res.rows[0].id;
    }

    // 3. Build Products Data Array with accurate foreign keys
    console.log('Seeding products and product images...');
    const productsData = [
      {
        sellerId: userMap['artisan@example.com'],
        categoryId: catMap['ceramics'],
        title: 'Hand-thrown Speckled Planter',
        slug: 'hand-thrown-speckled-planter',
        description: 'A beautiful, completely unique ceramic planter made from speckled clay. Perfect for indoor houseplants.',
        price: 45.00,
        inventoryQty: 8,
        status: 'active',
        tags: ['planter', 'speckled', 'ceramic'],
        avgRating: 4.8,
        reviewCount: 3,
        images: [
          'https://res.cloudinary.com/dyqyb9ri8/image/upload/v1781131244/ceramic-pot_xrjkmg.jpg'
        ],
      },
      {
        sellerId: userMap['artisan@example.com'],
        categoryId: catMap['ceramics'],
        title: 'Glazed Matcha Bowl',
        slug: 'glazed-matcha-bowl',
        description: 'Handcrafted matcha tea bowl with a striking emerald glaze. Designed for traditional whisking.',
        price: 55.00,
        inventoryQty: 4,
        status: 'active',
        tags: ['bowl', 'tea', 'matcha'],
        avgRating: 5.0,
        reviewCount: 1,
        images: [
          'https://res.cloudinary.com/dyqyb9ri8/image/upload/v1781334376/k1g1qvx80rywkavimu0f.webp',
          'https://res.cloudinary.com/dyqyb9ri8/image/upload/v1781334376/zwsxwg5ghkyt3sqyfpgd.webp'
        ],
      },
      {
        sellerId: userMap['woodcrafter@example.com'],
        categoryId: catMap['woodwork'],
        title: 'Olive Wood Cutting Board',
        slug: 'olive-wood-cutting-board',
        description: 'Premium cutting board made from sustainably sourced Olive wood. Finished with food-safe mineral oil and beeswax.',
        price: 120.00,
        inventoryQty: 5,
        status: 'active',
        tags: ['kitchen', 'wood', 'cutting board'],
        avgRating: 4.5,
        reviewCount: 2,
        images: [
          'https://res.cloudinary.com/dyqyb9ri8/image/upload/v1781306384/dreirockzyiteuiquf73.webp',
          'https://res.cloudinary.com/dyqyb9ri8/image/upload/v1781306384/yjqta9ln9uqw5p9ziyyh.webp'
        ],
      },
      {
        sellerId: userMap['woodcrafter@example.com'],
        categoryId: catMap['woodwork'],
        title: 'Hand-carved Wooden Spoon',
        slug: 'hand-carved-wooden-spoon',
        description: 'Ergonomic wooden spoon carved from cherry wood. Perfect for stirring soups and stews.',
        price: 28.00,
        inventoryQty: 15,
        status: 'active',
        tags: ['kitchen', 'spoon', 'wood'],
        avgRating: 5.0,
        reviewCount: 4,
        images: [
          'https://res.cloudinary.com/dyqyb9ri8/image/upload/v1781306434/rf9ffs3eudvtg0gs7edr.webp',
          'https://res.cloudinary.com/dyqyb9ri8/image/upload/v1781307077/zjpp8ffhlbxbrl7w79ti.webp'
        ],
      },
      {
        sellerId: userMap['weaver@example.com'],
        categoryId: catMap['textiles'],
        title: 'Chunky Knit Blanket',
        slug: 'chunky-knit-blanket',
        description: 'Ultra cozy chunky knit throw blanket made from 100% merino wool. Perfect for chilly evenings.',
        price: 180.00,
        inventoryQty: 3,
        status: 'active',
        tags: ['blanket', 'wool', 'cozy'],
        avgRating: 4.9,
        reviewCount: 6,
        images: [
          'https://res.cloudinary.com/dyqyb9ri8/image/upload/v1781334233/attunutzjim4m45obrko.webp'
        ],
      },
      {
        sellerId: userMap['weaver@example.com'],
        categoryId: catMap['textiles'],
        title: 'Indigo Dyed Scarf',
        slug: 'indigo-dyed-scarf',
        description: 'Lightweight cotton scarf hand-dyed using natural indigo in a shibori pattern.',
        price: 42.00,
        inventoryQty: 7,
        status: 'active',
        tags: ['scarf', 'indigo', 'dyed'],
        avgRating: 5,
        reviewCount: 0,
        images: [
          'https://res.cloudinary.com/dyqyb9ri8/image/upload/v1781334251/ljiebt1qlccavowoxvb7.webp'
        ],
      },
      {
        sellerId: userMap['artisan@example.com'],
        categoryId: catMap['jewelry'],
        title: 'Hammered Silver Band',
        slug: 'hammered-silver-band',
        description: 'Sterling silver ring with a textured, hammered finish. Available in sizes 5 through 10.',
        price: 65.00,
        inventoryQty: 12,
        status: 'active',
        tags: ['ring', 'silver', 'jewelry'],
        avgRating: 4.7,
        reviewCount: 5,
        images: [
          'https://res.cloudinary.com/dyqyb9ri8/image/upload/v1781306052/dn9l9aeooag29mgaptlv.webp'
        ],
      },
      {
        sellerId: userMap['artisan@example.com'],
        categoryId: catMap['jewelry'],
        title: 'Rose Quartz Pendant',
        slug: 'rose-quartz-pendant',
        description: 'Raw rose quartz crystal wrapped in gold-filled wire on an 18-inch chain.',
        price: 50.00,
        inventoryQty: 4,
        status: 'active',
        tags: ['necklace', 'crystal', 'gold'],
        avgRating: 5.0,
        reviewCount: 2,
        images: [
          'https://res.cloudinary.com/dyqyb9ri8/image/upload/v1781306102/ehnkckkbd5yofpiwetpu.webp'
        ],
      },
      {
        sellerId: userMap['woodcrafter@example.com'],
        categoryId: catMap['leather'],
        title: 'Minimalist Leather Cardholder',
        slug: 'minimalist-leather-cardholder',
        description: 'Slim leather cardholder made from full-grain vegetable-tanned leather. Holds up to 6 cards.',
        price: 35.00,
        inventoryQty: 20,
        status: 'active',
        tags: ['wallet', 'leather', 'minimalist'],
        avgRating: 4.6,
        reviewCount: 8,
        images: [
          'https://res.cloudinary.com/dyqyb9ri8/image/upload/v1781307044/crxocn7fsv0wzdtz1uju.webp'
        ],
      },
      {
        sellerId: userMap['weaver@example.com'],
        categoryId: catMap['candles'],
        title: 'Lavender & Cedarwood Soy Candle',
        slug: 'lavender-cedarwood-soy-candle',
        description: 'Hand-poured soy wax candle infused with lavender and cedarwood essential oils. 40-hour burn time.',
        price: 24.00,
        inventoryQty: 30,
        status: 'active',
        tags: ['candle', 'lavender', 'soy'],
        avgRating: 4.9,
        reviewCount: 15,
        images: [
          'https://res.cloudinary.com/dyqyb9ri8/image/upload/v1781132529/all_dkyh0q.webp'
        ],
      },
      {
        sellerId: userMap['artisan@example.com'],
        categoryId: catMap['art-prints'],
        title: 'Botanical Watercolor Print',
        slug: 'botanical-watercolor-print',
        description: 'Giclee print of an original watercolor monstera leaf painting. 8x10 inches, unframed.',
        price: 22.00,
        inventoryQty: 50,
        status: 'active',
        tags: ['art', 'print', 'botanical'],
        avgRating: 5.0,
        reviewCount: 4,
        images: [
          'https://res.cloudinary.com/dyqyb9ri8/image/upload/v1781306136/zomtey500egza2dnegyo.webp'
        ],
      },
      {
        sellerId: userMap['weaver@example.com'],
        categoryId: catMap['home-decor'],
        title: 'Macrame Plant Hanger',
        slug: 'macrame-plant-hanger',
        description: 'Hand-knotted cotton macrame plant hanger. Measures 36 inches long, fits 4-6 inch pots.',
        price: 32.00,
        inventoryQty: 10,
        status: 'active',
        tags: ['macrame', 'plants', 'decor'],
        avgRating: 4.8,
        reviewCount: 7,
        images: [
          'https://res.cloudinary.com/dyqyb9ri8/image/upload/v1781334267/sxqy5pz1rjnja0d6zvyo.webp',
          'https://res.cloudinary.com/dyqyb9ri8/image/upload/v1781334268/kva6dpnruhzbkt9jgrtw.webp'
        ],
      },
      {
        sellerId: userMap['woodcrafter@example.com'],
        categoryId: catMap['woodwork'],
        title: 'Walnut End Grain Cutting Board',
        slug: 'walnut-end-grain-cutting-board',
        description: 'Premium end-grain cutting board made from sustainably sourced American Walnut. Finished with food-safe mineral oil and beeswax.',
        price: 150.00,
        inventoryQty: 3,
        status: 'active',
        tags: ['kitchen', 'wood', 'cutting board'],
        avgRating: 4.9,
        reviewCount: 12,
        images: [
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&h=900&fit=crop'
        ],
      },
      {
        sellerId: userMap['artisan@example.com'],
        categoryId: catMap['ceramics'],
        title: 'Minimalist White Bowl Set',
        slug: 'minimalist-white-bowl-set',
        description: 'Set of 4 matte white ceramic bowls. Perfect for cereal, soup, or salads. Stackable design saves space in your cupboards.',
        price: 85.00,
        inventoryQty: 5,
        status: 'active',
        tags: ['bowl', 'minimalist', 'set'],
        avgRating: 5.0,
        reviewCount: 8,
        images: [
          'https://res.cloudinary.com/dyqyb9ri8/image/upload/v1781306000/zc2eaphlavodksvpnpui.webp'
        ],
      }
    ];

    for (const p of productsData) {
      if (!p.categoryId) continue;

      // Upsert product
      const res = await client.query(
        `INSERT INTO "products" 
         (seller_id, category_id, title, slug, description, price, inventory_qty, status, tags, avg_rating, review_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (slug) 
         DO UPDATE SET 
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           price = EXCLUDED.price,
           inventory_qty = EXCLUDED.inventory_qty,
           status = EXCLUDED.status
         RETURNING id`,
        [
          p.sellerId,
          p.categoryId,
          p.title,
          p.slug,
          p.description,
          p.price,
          p.inventoryQty,
          p.status,
          p.tags,
          p.avgRating,
          p.reviewCount
        ]
      );

      const productId = res.rows[0].id;

      // Prevent review duplication when running seed multiple times
      await client.query('DELETE FROM "reviews" WHERE product_id = $1', [productId]);

      // Check existing images
      const { rows: existingImages } = await client.query('SELECT url FROM "product_images" WHERE product_id = $1', [productId]);
      const existingUrls = existingImages.map(img => img.url);

      const imageRecords = p.images.map((url, idx) => ({
        url,
        isPrimary: idx === 0,
        displayOrder: idx
      }));

      for (const img of imageRecords) {
        if (!existingUrls.includes(img.url)) {
          await client.query(
            `INSERT INTO "product_images" (product_id, url, display_order, is_primary)
             VALUES ($1, $2, $3, $4)`,
            [productId, img.url, img.displayOrder, img.isPrimary]
          );
        }
      }

      // Add actual comments based on reviewCount
      const comments = [
        "Absolutely love this! The quality is amazing.",
        "Really well made, exactly as pictured.",
        "Fast shipping and gorgeous craftsmanship.",
        "I get so many compliments on this.",
        "Beautiful piece, perfectly matches my decor.",
        "Great customer service and fantastic product.",
        "Even better in person, highly recommended!",
        "Such a unique item, very happy with my purchase."
      ];
      
      for (let i = 0; i < p.reviewCount; i++) {
        let rating = Math.min(5, Math.max(1, Math.round(p.avgRating + (Math.random() - 0.5))));
        const comment = comments[Math.floor(Math.random() * comments.length)];
        
        await client.query(
          `INSERT INTO "reviews" (product_id, user_id, rating, comment)
           VALUES ($1, $2, $3, $4)`,
          [productId, userMap['buyer@example.com'], rating, comment]
        );
      }
    }

    await client.query('COMMIT');
    console.log(`Seeded ${productsData.length} products.`);
    console.log('✅ Seeding complete!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();