import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  console.log('🌱 Starting seed2 — new sellers & products...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Get existing category IDs
    const { rows: catRows } = await client.query('SELECT id, slug FROM "categories"');
    const catMap = {};
    for (const row of catRows) {
      catMap[row.slug] = row.id;
    }

    // 2. Seed 3 new sellers
    console.log('Seeding new sellers...');
    const passwordHash = await bcrypt.hash('password123', 10);

    const newSellers = [
      {
        email: 'jeweler@example.com',
        name: 'Amara Osei',
        role: 'seller',
        bio: 'Handcrafted jewelry using recycled metals and ethically sourced stones.',
        location: 'Atlanta, GA',
        avatarUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=face',
        bannerColor: '#aecbfa',
        socialLinks: { instagram: 'https://instagram.com', facebook: 'https://facebook.com', twitter: 'https://twitter.com', website: 'https://example.com' }
      },
      {
        email: 'candlemaker@example.com',
        name: 'Finn Larsen',
        role: 'seller',
        bio: 'Small-batch candles and home fragrances poured by hand in my Seattle workshop.',
        location: 'Seattle, WA',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
        bannerColor: '#fdcfe8',
        socialLinks: { instagram: 'https://instagram.com' }
      },
      {
        email: 'leathersmith@example.com',
        name: 'Mei Lin',
        role: 'seller',
        bio: 'Leather goods and paper crafts made with patience, precision, and love.',
        location: 'San Francisco, CA',
        avatarUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop&crop=face',
        bannerColor: '#e6c9a8',
        socialLinks: { website: 'https://example.com', facebook: 'https://facebook.com' }
      },
    ];

    const userMap = {};
    for (const u of newSellers) {
      const res = await client.query(
        `INSERT INTO "users" (email, password_hash, name, role, bio, location, avatar_url, banner_color, social_links)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (email)
         DO UPDATE SET name = EXCLUDED.name, banner_color = EXCLUDED.banner_color, social_links = EXCLUDED.social_links
         RETURNING id, email`,
        [u.email, passwordHash, u.name, u.role, u.bio, u.location, u.avatarUrl, u.bannerColor, u.socialLinks]
      );
      userMap[res.rows[0].email] = res.rows[0].id;
    }

    // 3. Products — 5 per seller, no reviews
    console.log('Seeding new products...');
    const productsData = [
      // ─── Amara Osei (jeweler) ──────────────────────────────────
      {
        sellerId: userMap['jeweler@example.com'],
        categoryId: catMap['jewelry'],
        title: 'Gold Hoop Earrings',
        slug: 'gold-hoop-earrings',
        description: 'Lightweight 14k gold-fill hoop earrings with a satin finish. 30mm diameter.',
        price: 55.00,
        inventoryQty: 14,
        status: 'active',
        tags: ['earrings', 'gold', 'hoops'],
        images: [
          'https://img.magnific.com/free-photo/aesthetic-golden-hoop-earrings-assortment_23-2149846588.jpg','https://img.magnific.com/free-photo/high-angle-aesthetic-golden-earrings-arrangement_23-2149846595.jpg'
        ],
      },
      {
        sellerId: userMap['jeweler@example.com'],
        categoryId: catMap['jewelry'],
        title: 'Silver Chain Necklace',
        slug: 'silver-chain-necklace',
        description: 'Dainty sterling silver chain necklace, 18 inches with a lobster clasp.',
        price: 48.00,
        inventoryQty: 18,
        status: 'active',
        tags: ['necklace', 'silver', 'chain'],
        images: [
          'https://img.magnific.com/premium-photo/silver-chain-necklace-with-blue-diamond-pendant-white-background_237502-256.jpg','https://img.magnific.com/free-photo/closeup-shot-female-blue-shirt-wearing-beautiful-necklace-with-nice-pendant_181624-26541.jpg' 
        ],
      },
      {
        sellerId: userMap['jeweler@example.com'],
        categoryId: catMap['jewelry'],
        title: 'Beaded Stone Bracelet',
        slug: 'beaded-stone-bracelet',
        description: 'Stretch bracelet with natural jasper and lava stone beads. One size fits most.',
        price: 28.00,
        inventoryQty: 22,
        status: 'active',
        tags: ['bracelet', 'beaded', 'stone'],
        images: [
          'https://img.magnific.com/free-photo/bracelets-made-by-colorful-pearls-stones_114579-13013.jpg','https://img.magnific.com/free-photo/bracelets-made-by-colorful-pearls-stones_114579-13014.jpg' 
        ],
      },
      {
        sellerId: userMap['jeweler@example.com'],
        categoryId: catMap['jewelry'],
        title: 'Tiny Pearl Stud Earrings',
        slug: 'tiny-pearl-stud-earrings',
        description: 'Freshwater pearl stud earrings set in sterling silver. 5mm pearls.',
        price: 32.00,
        inventoryQty: 20,
        status: 'active',
        tags: ['earrings', 'pearl', 'studs'],
        images: [
          'https://img.magnific.com/free-photo/curly-blonde-young-woman-with-pearl-jewelry-dressed-white-blouse-looks-calm-poses-city-center_197531-29980.jpg', 'https://img.magnific.com/premium-photo/elegant-pearl-amethyst-stud-earrings-womans-ear_550617-117839.jpg'
        ],
      },
      {
        sellerId: userMap['jeweler@example.com'],
        categoryId: catMap['jewelry'],
        title: 'Wide Brass Band Ring',
        slug: 'wide-brass-band-ring',
        description: 'Hand-forged wide brass band ring with a brushed matte finish. Sizes 5-11.',
        price: 38.00,
        inventoryQty: 16,
        status: 'active',
        tags: ['ring', 'brass', 'band'],
        images: [
          'https://img.magnific.com/free-psd/close-up-golden-ring-isolated_23-2151217878.jpg', 'https://img.magnific.com/free-photo/view-luxurious-golden-ring-rock-concrete-tray_23-2150329705.jpg'
        ],
      },

      // ─── Finn Larsen (candlemaker) ─────────────────────────────
      {
        sellerId: userMap['candlemaker@example.com'],
        categoryId: catMap['candles'],
        title: 'Vanilla Bean Soy Candle',
        slug: 'vanilla-bean-soy-candle',
        description: 'Hand-poured soy candle with warm vanilla bean fragrance. 8oz jar, 50-hour burn time.',
        price: 22.00,
        inventoryQty: 35,
        status: 'active',
        tags: ['candle', 'vanilla', 'soy'],
        images: [
          'https://img.magnific.com/free-photo/warm-candle-flame-cork-coaster-calm-home-interior-styling-evening-relax_169016-71749.jpg','https://img.magnific.com/free-photo/candle-glow-woven-tray-warm-wooden-table-styling-cozy-moment_169016-71433.jpg'
        ],
      },
      {
        sellerId: userMap['candlemaker@example.com'],
        categoryId: catMap['candles'],
        title: 'Beeswax Pillar Candle',
        slug: 'beeswax-pillar-candle',
        description: 'Pure beeswax pillar candle, 3x6 inches. Natural honey scent with a long clean burn.',
        price: 18.00,
        inventoryQty: 40,
        status: 'active',
        tags: ['candle', 'beeswax', 'pillar'],
        images: [
          'https://img.magnific.com/premium-photo/wax-candle-with-rustic-flowers-wooden-table_596176-1080.jpg','https://img.magnific.com/premium-photo/wax-candle-with-rustic-flowers-wooden-table_596176-1038.jpg', 'https://img.magnific.com/premium-photo/candle-made-beeswax-is-burning-near-hydrangea-flower_451744-371.jpg'        ],
      },
      {
        sellerId: userMap['candlemaker@example.com'],
        categoryId: catMap['candles'],
        title: 'Eucalyptus Reed Diffuser',
        slug: 'eucalyptus-reed-diffuser',
        description: 'Glass bottle reed diffuser with eucalyptus and mint essential oils. Includes 8 rattan reeds.',
        price: 30.00,
        inventoryQty: 15,
        status: 'active',
        tags: ['diffuser', 'eucalyptus', 'fragrance'],
        images: [
          'https://img.magnific.com/free-photo/spa-composition-with-incense-sticks-air-humidifier-aroma-oils_169016-57700.jpg',
        ],
      },
      {
        sellerId: userMap['candlemaker@example.com'],
        categoryId: catMap['candles'],
        title: 'Citrus & Sage Travel Tin Candle',
        slug: 'citrus-sage-travel-tin-candle',
        description: 'Portable soy candle in a 4oz gold tin. Fresh citrus and sage scent.',
        price: 14.00,
        inventoryQty: 50,
        status: 'active',
        tags: ['candle', 'travel', 'citrus'],
        images: [
          'https://img.magnific.com/premium-photo/mint-tealight-candle-silver-tin_1012565-101904.jpg',
        ],
      },
      {
        sellerId: userMap['candlemaker@example.com'],
        categoryId: catMap['candles'],
        title: 'Soy Wax Melts Sampler',
        slug: 'soy-wax-melts-sampler',
        description: 'Set of 6 soy wax melts in assorted scents: lavender, vanilla, pine, cinnamon, lemon, and rose.',
        price: 16.00,
        inventoryQty: 45,
        status: 'active',
        tags: ['wax melts', 'sampler', 'soy'],
        images: [
            'https://img.magnific.com/premium-photo/wooden-bowl-with-soy-wax-wooden-wicks-closeup-candle-making_206268-5270.jpg'
        ],
      },

      // ─── Mei Lin (leathersmith) ────────────────────────────────
      {
        sellerId: userMap['leathersmith@example.com'],
        categoryId: catMap['leather'],
        title: 'Leather Bifold Wallet',
        slug: 'leather-bifold-wallet',
        description: 'Classic bifold wallet in vegetable-tanned leather. 6 card slots and a bill compartment.',
        price: 65.00,
        inventoryQty: 12,
        status: 'active',
        tags: ['wallet', 'leather', 'bifold'],
        images: [
          'https://img.magnific.com/free-photo/man-creates-leather-ware_1157-34007.jpg', 
        ],
      },
      {
        sellerId: userMap['leathersmith@example.com'],
        categoryId: catMap['leather'],
        title: 'Hand-stitched Leather Belt',
        slug: 'hand-stitched-leather-belt',
        description: 'Full-grain leather belt with a solid brass buckle. Hand-stitched edges. 1.5 inches wide.',
        price: 55.00,
        inventoryQty: 10,
        status: 'active',
        tags: ['belt', 'leather', 'brass'],
        images: [
          'https://img.magnific.com/free-photo/man-studio-creates-leather-ware_1157-33223.jpg', 'https://img.magnific.com/free-photo/young-woman-working-her-workspace-woman-wearing-apron-making-belt-grounge-dark-stone-texture-background_1157-51595.jpg'
        ],
      },
      {
        sellerId: userMap['leathersmith@example.com'],
        categoryId: catMap['leather'],
        title: 'Leather Tote Bag',
        slug: 'leather-tote-bag',
        description: 'Spacious leather tote bag with an interior zip pocket. Unlined for a soft, slouchy feel.',
        price: 140.00,
        inventoryQty: 5,
        status: 'active',
        tags: ['bag', 'tote', 'leather'],
        images: [
          'https://img.magnific.com/premium-photo/handmade-brown-leather-tote-bag_157402-665.jpg', 'https://img.magnific.com/premium-photo/close-up-leather-table_234894-1077.jpg'
        ],
      },
      {
        sellerId: userMap['leathersmith@example.com'],
        categoryId: catMap['leather'],
        title: 'Leather Key Fob',
        slug: 'leather-key-fob',
        description: 'Simple leather key fob with a brass key ring. Can be personalized with initials.',
        price: 15.00,
        inventoryQty: 40,
        status: 'active',
        tags: ['keychain', 'leather', 'personalized'],
        images: [
          'https://img.magnific.com/free-photo/black-leather-key-case_1232-1815.jpg', 'https://img.magnific.com/premium-photo/blank-key-ring-isolated-white-background-key-chain-your-design_79161-448.jpg'
        ],
      },
      {
        sellerId: userMap['leathersmith@example.com'],
        categoryId: catMap['leather'],
        title: 'Leather Bound Journal',
        slug: 'leather-bound-journal',
        description: 'A5 leather journal with 200 pages of cream acid-free paper. Wrap-around tie closure.',
        price: 45.00,
        inventoryQty: 15,
        status: 'active',
        tags: ['journal', 'leather', 'notebook'],
        images: [
          'https://img.magnific.com/premium-photo/brown-leather-journal-closed-detail-wood-boards_501731-187.jpg', 'https://img.magnific.com/premium-photo/handcrafted-leather-journal-with-turquoise-clasp-wooden-background_501731-16132.jpg', 'https://img.magnific.com/premium-photo/rustic-brown-leather-journal-with-distressed-finish-closed-lying-white-background_39665-14344.jpg', 'https://img.magnific.com/premium-photo/colorful-leatherbound-book-with-strap-isolated-white-background-aig57_31965-692254.jpg'
        ],
      },
    ];

    for (const p of productsData) {
      if (!p.categoryId) continue;

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
          0,  // avg_rating — no reviews
          0,  // review_count — no reviews
        ]
      );

      const productId = res.rows[0].id;

      // Clean up any old images for this product to avoid duplicates on re-run
      await client.query('DELETE FROM "product_images" WHERE product_id = $1', [productId]);

      for (let idx = 0; idx < p.images.length; idx++) {
        await client.query(
          `INSERT INTO "product_images" (product_id, url, display_order, is_primary)
           VALUES ($1, $2, $3, $4)`,
          [productId, p.images[idx], idx, idx === 0]
        );
      }
    }

    await client.query('COMMIT');
    console.log(`✅ seed2 complete — seeded ${newSellers.length} sellers and ${productsData.length} products (no reviews).`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ seed2 error:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();