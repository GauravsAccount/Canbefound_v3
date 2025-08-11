import { KeystoneContext } from '@keystone-6/core/types';

export async function seedDatabase(context: KeystoneContext) {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminUser = await context.query.User.createOne({
    data: {
      name: 'System Administrator',
      email: 'admin@college.edu',
      collegeId: 'ADMIN001',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
    },
  });

  console.log('✅ Admin user created');

  // Create sample users
  const users = await Promise.all([
    context.query.User.createOne({
      data: {
        name: 'John Doe',
        email: 'john.doe@college.edu',
        collegeId: 'STU001',
        password: 'password123',
        role: 'student',
        isVerified: true,
        phone: '(555) 123-4567',
      },
    }),
    context.query.User.createOne({
      data: {
        name: 'Jane Smith',
        email: 'jane.smith@college.edu',
        collegeId: 'STU002',
        password: 'password123',
        role: 'student',
        isVerified: true,
        phone: '(555) 234-5678',
      },
    }),
    context.query.User.createOne({
      data: {
        name: 'Mike Johnson',
        email: 'mike.johnson@college.edu',
        collegeId: 'STAFF001',
        password: 'password123',
        role: 'staff',
        isVerified: true,
        phone: '(555) 345-6789',
      },
    }),
  ]);

  console.log('✅ Sample users created');

  // Create categories
  const categories = await Promise.all([
    context.query.Category.createOne({
      data: {
        name: 'Electronics',
        description: 'Phones, laptops, tablets, headphones, etc.',
        icon: '📱',
        sortOrder: 1,
      },
    }),
    context.query.Category.createOne({
      data: {
        name: 'Clothing & Accessories',
        description: 'Jackets, hats, scarves, sunglasses, etc.',
        icon: '👕',
        sortOrder: 2,
      },
    }),
    context.query.Category.createOne({
      data: {
        name: 'Bags & Backpacks',
        description: 'Backpacks, purses, laptop bags, etc.',
        icon: '🎒',
        sortOrder: 3,
      },
    }),
    context.query.Category.createOne({
      data: {
        name: 'Books & Stationery',
        description: 'Textbooks, notebooks, pens, calculators, etc.',
        icon: '📚',
        sortOrder: 4,
      },
    }),
    context.query.Category.createOne({
      data: {
        name: 'Jewelry & Watches',
        description: 'Rings, necklaces, watches, bracelets, etc.',
        icon: '⌚',
        sortOrder: 5,
      },
    }),
    context.query.Category.createOne({
      data: {
        name: 'Keys & Key Chains',
        description: 'Car keys, house keys, key chains, etc.',
        icon: '🔑',
        sortOrder: 6,
      },
    }),
    context.query.Category.createOne({
      data: {
        name: 'Sports Equipment',
        description: 'Sports gear, water bottles, gym equipment, etc.',
        icon: '⚽',
        sortOrder: 7,
      },
    }),
    context.query.Category.createOne({
      data: {
        name: 'Other',
        description: 'Items that don\'t fit other categories',
        icon: '📦',
        sortOrder: 8,
      },
    }),
  ]);

  console.log('✅ Categories created');

  // Create locations
  const locations = await Promise.all([
    context.query.Location.createOne({
      data: {
        name: 'Library',
        description: 'Main campus library and study areas',
        building: 'Library Building',
        sortOrder: 1,
      },
    }),
    context.query.Location.createOne({
      data: {
        name: 'Cafeteria',
        description: 'Student dining hall and food court',
        building: 'Student Center',
        sortOrder: 2,
      },
    }),
    context.query.Location.createOne({
      data: {
        name: 'Gymnasium',
        description: 'Sports facilities and fitness center',
        building: 'Athletic Center',
        sortOrder: 3,
      },
    }),
    context.query.Location.createOne({
      data: {
        name: 'Dormitory',
        description: 'Student residence halls',
        building: 'Various Residence Halls',
        sortOrder: 4,
      },
    }),
    context.query.Location.createOne({
      data: {
        name: 'Classroom',
        description: 'Academic buildings and classrooms',
        building: 'Various Academic Buildings',
        sortOrder: 5,
      },
    }),
  ]);

  console.log('✅ Locations created');

  // Create sample lost items
  const lostItems = await Promise.all([
    context.query.LostItem.createOne({
      data: {
        itemName: 'iPhone 13 Pro',
        description: 'Black iPhone 13 Pro with a blue protective case. Has a small scratch on the back corner.',
        category: 'electronics',
        lostDate: new Date('2025-01-15T14:30:00Z'),
        lostTime: '2:30 PM',
        location: 'library',
        specificLocation: '2nd floor study area, near the windows',
        circumstances: 'Left it on the table while going to get coffee',
        contactEmail: 'john.doe@college.edu',
        contactPhone: '(555) 123-4567',
        privacyConsent: true,
        notifications: true,
        reportedBy: { connect: { id: users[0].id } },
      },
    }),
    context.query.LostItem.createOne({
      data: {
        itemName: 'Blue Spiral Notebook',
        description: 'Blue spiral-bound notebook with physics notes and formulas. Has my name "Jane" written on the cover.',
        category: 'books',
        lostDate: new Date('2025-01-12T10:15:00Z'),
        lostTime: '10:15 AM',
        location: 'classroom',
        specificLocation: 'Physics Lab Room 203',
        circumstances: 'Left behind after morning lab session',
        contactEmail: 'jane.smith@college.edu',
        privacyConsent: true,
        notifications: true,
        reportedBy: { connect: { id: users[1].id } },
      },
    }),
  ]);

  console.log('✅ Sample lost items created');

  // Create sample found items
  const foundItems = await Promise.all([
    context.query.FoundItem.createOne({
      data: {
        itemName: 'Silver Watch',
        description: 'Silver digital watch with black leather strap. Brand appears to be Casio.',
        category: 'jewelry',
        foundDate: new Date('2025-01-13T16:45:00Z'),
        foundTime: '4:45 PM',
        location: 'gym',
        specificLocation: 'Men\'s locker room, bench area',
        finderName: 'Mike Johnson',
        contactEmail: 'mike.johnson@college.edu',
        handoverLocation: 'security-office',
        additionalNotes: 'Found while cleaning the locker room',
        verifyOwnership: true,
        handoverAgreement: true,
        reportedBy: { connect: { id: users[2].id } },
      },
    }),
    context.query.FoundItem.createOne({
      data: {
        itemName: 'Black Backpack',
        description: 'Large black backpack with laptop compartment. Has a small college logo patch.',
        category: 'bags',
        foundDate: new Date('2025-01-14T12:20:00Z'),
        foundTime: '12:20 PM',
        location: 'cafeteria',
        specificLocation: 'Left table near the main entrance',
        finderName: 'Jane Smith',
        contactEmail: 'jane.smith@college.edu',
        handoverLocation: 'student-services',
        verifyOwnership: true,
        handoverAgreement: true,
        reportedBy: { connect: { id: users[1].id } },
      },
    }),
  ]);

  console.log('✅ Sample found items created');

  // Create system settings
  const settings = await Promise.all([
    context.query.SystemSettings.createOne({
      data: {
        settingKey: 'auction_duration_days',
        settingValue: '7',
        description: 'Default duration for auctions in days',
        dataType: 'number',
        isPublic: true,
        updatedBy: { connect: { id: adminUser.id } },
      },
    }),
    context.query.SystemSettings.createOne({
      data: {
        settingKey: 'unclaimed_threshold_days',
        settingValue: '30',
        description: 'Days after which unclaimed items move to auction',
        dataType: 'number',
        isPublic: true,
        updatedBy: { connect: { id: adminUser.id } },
      },
    }),
    context.query.SystemSettings.createOne({
      data: {
        settingKey: 'min_bid_increment',
        settingValue: '1.00',
        description: 'Minimum bid increment for auctions',
        dataType: 'number',
        isPublic: true,
        updatedBy: { connect: { id: adminUser.id } },
      },
    }),
    context.query.SystemSettings.createOne({
      data: {
        settingKey: 'email_notifications_enabled',
        settingValue: 'true',
        description: 'Enable email notifications system-wide',
        dataType: 'boolean',
        isPublic: false,
        updatedBy: { connect: { id: adminUser.id } },
      },
    }),
  ]);

  console.log('✅ System settings created');

  // Create a sample claim
  const claim = await context.query.Claim.createOne({
    data: {
      proofOfOwnership: 'I can provide the serial number and purchase receipt. The phone has my personal photos and contacts.',
      status: 'pending',
      claimant: { connect: { id: users[0].id } },
      foundItem: { connect: { id: foundItems[0].id } },
    },
  });

  console.log('✅ Sample claim created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📋 Summary:');
  console.log(`   • Admin user: admin@college.edu (password: admin123)`);
  console.log(`   • Sample users: ${users.length}`);
  console.log(`   • Categories: ${categories.length}`);
  console.log(`   • Locations: ${locations.length}`);
  console.log(`   • Lost items: ${lostItems.length}`);
  console.log(`   • Found items: ${foundItems.length}`);
  console.log(`   • System settings: ${settings.length}`);
  console.log('');
  console.log('🚀 You can now access:');
  console.log('   • Admin UI: http://localhost:3000');
  console.log('   • GraphQL API: http://localhost:3000/api/graphql');
  console.log('   • REST API: http://localhost:3000/api/rest');
}