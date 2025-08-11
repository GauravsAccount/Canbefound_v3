const express = require('express');
const router = express.Router();

// Middleware to get Keystone context
const getContext = (req) => req.context;

// Get all items (lost and found combined)
router.get('/items', async (req, res) => {
  try {
    const context = getContext(req);
    const { category, location, status, search, limit = 20, offset = 0 } = req.query;
    
    // Build where clauses
    const lostWhere = {};
    const foundWhere = {};

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
      Object.assign(lostWhere, searchFilter);
      Object.assign(foundWhere, searchFilter);
    }

    // Fetch items based on status filter
    let lostItems = [];
    let foundItems = [];

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
        take: parseInt(limit),
        skip: parseInt(offset),
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
        take: parseInt(limit),
        skip: parseInt(offset),
      });
    }

    // Format and combine items
    const formattedLostItems = lostItems.map(item => ({
      ...item,
      title: item.itemName,
      date: item.lostDate,
      time: item.lostTime,
      status: 'lost',
      reportedBy: item.reportedBy?.name || 'Anonymous',
    }));

    const formattedFoundItems = foundItems.map(item => ({
      ...item,
      title: item.itemName,
      date: item.foundDate,
      time: item.foundTime,
      status: 'found',
      reportedBy: item.reportedBy?.name || 'Anonymous',
    }));

    const allItems = [...formattedLostItems, ...formattedFoundItems];
    allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json({ success: true, items: allItems });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get platform statistics
router.get('/stats', async (req, res) => {
  try {
    const context = getContext(req);
    
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

    const stats = {
      totalActiveItems: totalLostItems + totalFoundItems,
      successfullyReturned: claimedItems,
      activeLostReports: totalLostItems,
      foundItemsAwaiting: totalFoundItems,
      itemsInAuction: activeAuctions,
      totalUsers,
      pendingClaims,
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit lost item report
router.post('/lost-items', async (req, res) => {
  try {
    const context = getContext(req);
    const data = req.body;

    // Find or create user
    let user = await context.query.User.findOne({
      where: { collegeId: data.collegeIdContact },
      query: 'id name email',
    });

    if (!user) {
      user = await context.query.User.createOne({
        data: {
          name: data.fullName,
          email: data.email,
          collegeId: data.collegeIdContact,
          password: 'temp123',
          phone: data.phone,
          role: 'student',
          isVerified: false,
        },
      });
    }

    // Create lost item report
    const lostItem = await context.query.LostItem.createOne({
      data: {
        itemName: data.itemName,
        description: data.description,
        category: data.category,
        lostDate: new Date(data.lostDate),
        lostTime: data.lostTime,
        location: data.location,
        specificLocation: data.specificLocation,
        circumstances: data.circumstances,
        contactEmail: data.email,
        contactPhone: data.phone,
        privacyConsent: data.privacyConsent === 'on',
        notifications: data.notifications === 'on',
        reportedBy: { connect: { id: user.id } },
      },
    });

    res.json({
      success: true,
      itemId: lostItem.id,
      message: 'Lost item report submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting lost item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit found item report
router.post('/found-items', async (req, res) => {
  try {
    const context = getContext(req);
    const data = req.body;

    // Find or create user
    let user = await context.query.User.findOne({
      where: { collegeId: data.collegeId },
      query: 'id name email',
    });

    if (!user) {
      user = await context.query.User.createOne({
        data: {
          name: data.finderName,
          email: data.contactEmail,
          collegeId: data.collegeId,
          password: 'temp123',
          role: 'student',
          isVerified: false,
        },
      });
    }

    // Create found item report
    const foundItem = await context.query.FoundItem.createOne({
      data: {
        itemName: data.itemName,
        description: data.description,
        category: data.category,
        foundDate: new Date(data.foundDate),
        foundTime: data.foundTime,
        location: data.location,
        specificLocation: data.specificLocation,
        finderName: data.finderName,
        contactEmail: data.contactEmail,
        handoverLocation: data.handoverLocation,
        customHandoverLocation: data.customLocation,
        additionalNotes: data.additionalNotes,
        verifyOwnership: data.verifyOwnership === 'on',
        handoverAgreement: data.handoverAgreement === 'on',
        reportedBy: { connect: { id: user.id } },
      },
    });

    res.json({
      success: true,
      itemId: foundItem.id,
      message: 'Found item report submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting found item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get auctions
router.get('/auctions', async (req, res) => {
  try {
    const context = getContext(req);
    const { category, status, limit = 20, offset = 0 } = req.query;
    
    let where = {};
    if (category) {
      where.item = { category: { equals: category } };
    }
    if (status) {
      where.status = { equals: status };
    }

    const auctions = await context.query.Auction.findMany({
      where,
      query: `
        id
        title
        description
        startingPrice
        currentBid
        bidCount
        startTime
        endTime
        status
        item {
          id
          itemName
          category
          description
          photo { url }
          location
        }
        bids(orderBy: { bidTime: desc }, take: 1) {
          amount
          bidder { name }
          bidTime
        }
      `,
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { endTime: 'asc' },
    });

    res.json({ success: true, auctions });
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit contact message
router.post('/contact', async (req, res) => {
  try {
    const context = getContext(req);
    const { name, email, subject, message } = req.body;

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

    res.json({
      success: true,
      messageId: contactMessage.id,
      message: 'Contact message submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Authentication endpoints
router.post('/auth/login', async (req, res) => {
  try {
    const context = getContext(req);
    const { email, password } = req.body;

    // Validate email format (must be college email)
    if (!email.endsWith('@college.edu')) {
      return res.status(400).json({
        success: false,
        error: 'Please use your college email address'
      });
    }

    const user = await context.query.User.findOne({
      where: { email },
      query: 'id name email collegeId role isVerified',
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // In a real app, you'd verify the password here
    // For now, we'll accept any password for existing users
    
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        collegeId: user.collegeId,
        role: user.role,
        isVerified: user.isVerified,
      },
      token: 'mock-jwt-token'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/auth/signup', async (req, res) => {
  try {
    const context = getContext(req);
    const { name, email, collegeId, password } = req.body;

    // Validate email format
    if (!email.endsWith('@college.edu')) {
      return res.status(400).json({
        success: false,
        error: 'Please use your college email address'
      });
    }

    // Check if user already exists
    const existingUser = await context.query.User.findOne({
      where: { email },
      query: 'id',
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Create new user
    const user = await context.query.User.createOne({
      data: {
        name,
        email,
        collegeId,
        password,
        role: 'student',
        isVerified: false,
      },
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        collegeId: user.collegeId,
        role: user.role,
        isVerified: user.isVerified,
      },
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;