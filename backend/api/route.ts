import { KeystoneContext } from '@keystone-6/core/types';

// Helper function to format items for frontend
function formatItemForFrontend(item: any, type: 'lost' | 'found') {
  return {
    id: item.id,
    title: item.itemName,
    category: item.category,
    status: type,
    description: item.description,
    location: item.location,
    specificLocation: item.specificLocation,
    date: type === 'lost' ? item.lostDate : item.foundDate,
    time: type === 'lost' ? item.lostTime : item.foundTime,
    image: item.photo?.url || null,
    reportedBy: item.reportedBy?.name || 'Anonymous',
    contactEmail: item.contactEmail,
    contactPhone: item.contactPhone || null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

// Get all items (lost and found combined)
export async function getAllItems(context: KeystoneContext, filters: any = {}) {
  const { category, location, status, search, limit = 20, offset = 0 } = filters;

  // Build where clauses
  const lostWhere: any = {};
  const foundWhere: any = {};

  if (category) {
    lostWhere.category = { equals: category };
    foundWhere.category = { equals: category };
  }

  if (location) {
    lostWhere.location = { equals: location };
    foundWhere.location = { equals: location };
  }

  if (search) {
    const searchFilter = {
      OR: [
        { itemName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    };
    lostWhere.AND = [lostWhere.AND || {}, searchFilter].filter(Boolean);
    foundWhere.AND = [foundWhere.AND || {}, searchFilter].filter(Boolean);
  }

  // Fetch items based on status filter
  let lostItems: readonly Record<string, any>[] = [];
  let foundItems: readonly Record<string, any>[] = [];

  if (!status || status === 'lost') {
    lostItems = await context.query.LostItem.findMany({
      where: { ...lostWhere, status: { equals: 'active' } },
      query: `
        id
        itemName
        description
        category
        status
        lostDate
        lostTime
        location
        specificLocation
        photo { url }
        contactEmail
        contactPhone
        reportedBy { name }
        createdAt
        updatedAt
      `,
      take: limit,
      skip: offset,
    });
  }

  if (!status || status === 'found') {
    foundItems = await context.query.FoundItem.findMany({
      where: { ...foundWhere, status: { equals: 'available' } },
      query: `
        id
        itemName
        description
        category
        status
        foundDate
        foundTime
        location
        specificLocation
        photo { url }
        contactEmail
        finderName
        reportedBy { name }
        createdAt
        updatedAt
      `,
      take: limit,
      skip: offset,
    });
  }

  // Format and combine items
  const formattedLostItems = lostItems.map(item => formatItemForFrontend(item, 'lost'));
  const formattedFoundItems = foundItems.map(item => formatItemForFrontend(item, 'found'));

  const allItems = [...formattedLostItems, ...formattedFoundItems];

  // Sort by date (newest first)
  allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return allItems;
}

// Get recent items for homepage
export async function getRecentItems(context: KeystoneContext, limit: number = 8) {
  const recentLost = await context.query.LostItem.findMany({
    where: { status: { equals: 'active' } },
    query: `
      id
      itemName
      description
      category
      lostDate
      location
      photo { url }
      reportedBy { name }
    `,
    take: limit / 2,
    orderBy: { createdAt: 'desc' },
  });

  const recentFound = await context.query.FoundItem.findMany({
    where: { status: { equals: 'available' } },
    query: `
      id
      itemName
      description
      category
      foundDate
      location
      photo { url }
      reportedBy { name }
    `,
    take: limit / 2,
    orderBy: { createdAt: 'desc' },
  });

  const formattedLost = recentLost.map(item => formatItemForFrontend(item, 'lost'));
  const formattedFound = recentFound.map(item => formatItemForFrontend(item, 'found'));

  return [...formattedLost, ...formattedFound]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

// Get platform statistics
export async function getPlatformStats(context: KeystoneContext) {
  const [
    totalLostItems,
    totalFoundItems,
    claimedItems,
    activeAuctions,
    totalUsers,
    pendingClaims,
  ] = await Promise.all([
    context.query.LostItem.count({ where: { status: { equals: 'active' } } }),
    context.query.FoundItem.count({ where: { status: { equals: 'available' } } }),
    context.query.FoundItem.count({ where: { status: { equals: 'claimed' } } }),
    context.query.Auction.count({ where: { status: { equals: 'active' } } }),
    context.query.User.count(),
    context.query.Claim.count({ where: { status: { equals: 'pending' } } }),
  ]);

  return {
    totalActiveItems: totalLostItems + totalFoundItems,
    successfullyReturned: claimedItems,
    activeLostReports: totalLostItems,
    foundItemsAwaiting: totalFoundItems,
    itemsInAuction: activeAuctions,
    totalUsers,
    pendingClaims,
  };
}

// Submit lost item report
export async function submitLostItemReport(context: KeystoneContext, data: any) {
  const {
    itemName,
    category,
    description,
    lostDate,
    lostTime,
    location,
    specificLocation,
    circumstances,
    fullName,
    collegeId,
    email,
    phone,
    privacyConsent,
    notifications,
  } = data;

  // Find or create user
  let user = await context.query.User.findOne({
    where: { collegeId },
    query: 'id name email',
  });

  if (!user) {
    user = await context.query.User.createOne({
      data: {
        name: fullName,
        email,
        collegeId,
        password: 'temp123', // Temporary password
        phone,
        role: 'student',
        isVerified: false,
      },
    });
  }

  // Create lost item report
  const lostItem = await context.query.LostItem.createOne({
    data: {
      itemName,
      description,
      category,
      lostDate: new Date(lostDate),
      lostTime,
      location,
      specificLocation,
      circumstances,
      contactEmail: email,
      contactPhone: phone,
      privacyConsent,
      notifications,
      reportedBy: { connect: { id: user.id } },
    },
  });

  return {
    success: true,
    itemId: lostItem.id,
    message: 'Lost item report submitted successfully',
  };
}

// Submit found item report
export async function submitFoundItemReport(context: KeystoneContext, data: any) {
  const {
    itemName,
    category,
    description,
    foundDate,
    foundTime,
    location,
    specificLocation,
    finderName,
    collegeId,
    contactEmail,
    handoverLocation,
    customHandoverLocation,
    additionalNotes,
    verifyOwnership,
    handoverAgreement,
  } = data;

  // Find or create user
  let user = await context.query.User.findOne({
    where: { collegeId },
    query: 'id name email',
  });

  if (!user) {
    user = await context.query.User.createOne({
      data: {
        name: finderName,
        email: contactEmail,
        collegeId,
        password: 'temp123', // Temporary password
        role: 'student',
        isVerified: false,
      },
    });
  }

  // Create found item report
  const foundItem = await context.query.FoundItem.createOne({
    data: {
      itemName,
      description,
      category,
      foundDate: new Date(foundDate),
      foundTime,
      location,
      specificLocation,
      finderName,
      contactEmail,
      handoverLocation,
      customHandoverLocation,
      additionalNotes,
      verifyOwnership,
      handoverAgreement,
      reportedBy: { connect: { id: user.id } },
    },
  });

  return {
    success: true,
    itemId: foundItem.id,
    message: 'Found item report submitted successfully',
  };
}

// Submit contact message
export async function submitContactMessage(context: KeystoneContext, data: any) {
  const { name, email, subject, message } = data;

  const contactMessage = await context.query.ContactMessage.createOne({
    data: {
      name,
      email,
      subject,
      message,
      status: 'new',
      priority: 'medium',
    },
  });

  return {
    success: true,
    messageId: contactMessage.id,
    message: 'Contact message submitted successfully',
  };
}