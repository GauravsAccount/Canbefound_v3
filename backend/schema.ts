import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  image,
  integer,
  decimal,
  checkbox,
} from '@keystone-6/core/fields';


export const lists = {
  // Removed duplicate SystemSettings definition

  User: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      collegeId: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
        label: 'College ID',
      }),
      password: password({ validation: { isRequired: true } }),
      role: select({
        type: 'enum',
        options: [
          { label: 'Student', value: 'student' },
          { label: 'Staff', value: 'staff' },
          { label: 'Admin', value: 'admin' },
        ],
        defaultValue: 'student',
      }),
      phone: text({ label: 'Phone Number' }),
      isVerified: checkbox({
        defaultValue: false,
        label: 'Account Verified',
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      // Relationships
      lostItems: relationship({
        ref: 'LostItem.reportedBy',
        many: true,
      }),
      foundItems: relationship({
        ref: 'FoundItem.reportedBy',
        many: true,
      }),
      claims: relationship({
        ref: 'Claim.claimant',
        many: true,
      }),
      bids: relationship({
        ref: 'Bid.bidder',
        many: true,
      }),
    },
  }),

  LostItem: list({
    access: allowAll,
    fields: {
      itemName: text({
        validation: { isRequired: true },
        label: 'Item Name',
      }),
      description: text({
        validation: { isRequired: true },
        ui: { displayMode: 'textarea' },
      }),
      category: select({
        type: 'enum',
        options: [
          { label: 'Electronics', value: 'electronics' },
          { label: 'Clothing & Accessories', value: 'clothing' },
          { label: 'Bags & Backpacks', value: 'bags' },
          { label: 'Books & Stationery', value: 'books' },
          { label: 'Jewelry & Watches', value: 'jewelry' },
          { label: 'Keys & Key Chains', value: 'keys' },
          { label: 'Sports Equipment', value: 'sports' },
          { label: 'Other', value: 'other' },
        ],
        validation: { isRequired: true },
      }),
      status: select({
        type: 'enum',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Found', value: 'found' },
          { label: 'Claimed', value: 'claimed' },
          { label: 'Closed', value: 'closed' },
        ],
        defaultValue: 'active',
      }),
      lostDate: timestamp({
        validation: { isRequired: true },
        label: 'Date Lost',
      }),
      lostTime: text({ label: 'Time Lost (approximate)' }),
      location: select({
        type: 'enum',
        options: [
          { label: 'Library', value: 'library' },
          { label: 'Cafeteria', value: 'cafeteria' },
          { label: 'Gymnasium', value: 'gym' },
          { label: 'Dormitory', value: 'dormitory' },
          { label: 'Classroom', value: 'classroom' },
          { label: 'Parking Area', value: 'parking' },
          { label: 'Auditorium', value: 'auditorium' },
          { label: 'Laboratory', value: 'lab' },
          { label: 'Outdoor Area', value: 'outdoor' },
          { label: 'Other', value: 'other' },
        ],
        validation: { isRequired: true },
      }),
      specificLocation: text({
        label: 'Specific Location Details',
      }),
      circumstances: text({
        ui: { displayMode: 'textarea' },
        label: 'How was it lost?',
      }),
      photo: image({ storage: 'images' }),
      contactEmail: text({
        validation: { isRequired: true },
        label: 'Contact Email',
      }),
      contactPhone: text({ label: 'Contact Phone' }),
      privacyConsent: checkbox({
        defaultValue: false,
        label: 'Privacy Consent Given',
      }),
      notifications: checkbox({
        defaultValue: true,
        label: 'Email Notifications Enabled',
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      updatedAt: timestamp({
        defaultValue: { kind: 'now' },
        db: { updatedAt: true },
      }),
      // Relationships
      reportedBy: relationship({
        ref: 'User.lostItems',
        ui: {
          displayMode: 'cards',
          cardFields: ['name', 'email', 'collegeId'],
          inlineEdit: { fields: ['name', 'email'] },
          linkToItem: true,
          inlineCreate: { fields: ['name', 'email', 'collegeId'] },
        },
      }),
      claims: relationship({
        ref: 'Claim.lostItem',
        many: true,
      }),
      matchedFoundItem: relationship({
        ref: 'FoundItem.matchedLostItem',
      }),
    },
  }),

  FoundItem: list({
    access: allowAll,
    fields: {
      itemName: text({
        validation: { isRequired: true },
        label: 'Item Name',
      }),
      description: text({
        validation: { isRequired: true },
        ui: { displayMode: 'textarea' },
      }),
      category: select({
        type: 'enum',
        options: [
          { label: 'Electronics', value: 'electronics' },
          { label: 'Clothing & Accessories', value: 'clothing' },
          { label: 'Bags & Backpacks', value: 'bags' },
          { label: 'Books & Stationery', value: 'books' },
          { label: 'Jewelry & Watches', value: 'jewelry' },
          { label: 'Keys & Key Chains', value: 'keys' },
          { label: 'Sports Equipment', value: 'sports' },
          { label: 'Other', value: 'other' },
        ],
        validation: { isRequired: true },
      }),
      status: select({
        type: 'enum',
        options: [
          { label: 'Available', value: 'available' },
          { label: 'Claimed', value: 'claimed' },
          { label: 'Returned', value: 'returned' },
          { label: 'Moved to Auction', value: 'auction' },
        ],
        defaultValue: 'available',
      }),
      foundDate: timestamp({
        validation: { isRequired: true },
        label: 'Date Found',
      }),
      foundTime: text({ label: 'Time Found (approximate)' }),
      location: select({
        type: 'enum',
        options: [
          { label: 'Library', value: 'library' },
          { label: 'Cafeteria', value: 'cafeteria' },
          { label: 'Gymnasium', value: 'gym' },
          { label: 'Dormitory', value: 'dormitory' },
          { label: 'Classroom', value: 'classroom' },
          { label: 'Parking Area', value: 'parking' },
          { label: 'Auditorium', value: 'auditorium' },
          { label: 'Laboratory', value: 'lab' },
          { label: 'Outdoor Area', value: 'outdoor' },
          { label: 'Other', value: 'other' },
        ],
        validation: { isRequired: true },
      }),
      specificLocation: text({
        label: 'Specific Location Details',
      }),
      photo: image({ storage: 'images' }),
      finderName: text({
        validation: { isRequired: true },
        label: 'Finder Name',
      }),
      contactEmail: text({
        validation: { isRequired: true },
        label: 'Contact Email',
      }),
      handoverLocation: select({
        type: 'enum',
        options: [
          { label: 'Security Office', value: 'securityoffice' },
          { label: 'Student Services', value: 'studentservices' },
          { label: 'Library Information Desk', value: 'librarydesk' },
          { label: 'Administrative Office', value: 'adminoffice' },
          { label: 'Other', value: 'other' },
        ],
        validation: { isRequired: true },
        label: 'Handover Location',
      }),
      customHandoverLocation: text({
        label: 'Custom Handover Location',
      }),
      additionalNotes: text({
        ui: { displayMode: 'textarea' },
        label: 'Additional Notes',
      }),
      verifyOwnership: checkbox({
        defaultValue: true,
        label: 'Ownership Verification Required',
      }),
      handoverAgreement: checkbox({
        defaultValue: true,
        label: 'Handover Agreement Accepted',
      }),
      daysUnclaimed: integer({
        defaultValue: 0,
        label: 'Days Unclaimed',
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      updatedAt: timestamp({
        defaultValue: { kind: 'now' },
        db: { updatedAt: true },
      }),
      // Relationships
      reportedBy: relationship({
        ref: 'User.foundItems',
        ui: {
          displayMode: 'cards',
          cardFields: ['name', 'email', 'collegeId'],
          inlineEdit: { fields: ['name', 'email'] },
          linkToItem: true,
          inlineCreate: { fields: ['name', 'email', 'collegeId'] },
        },
      }),
      claims: relationship({
        ref: 'Claim.foundItem',
        many: true,
      }),
      matchedLostItem: relationship({
        ref: 'LostItem.matchedFoundItem',
      }),
      auction: relationship({
        ref: 'Auction.item',
      }),
    },
  }),

  Claim: list({
    access: allowAll,
    fields: {
      status: select({
        type: 'enum',
        options: [
          { label: 'Pending', value: 'pending' },
          { label: 'Under Review', value: 'review' },
          { label: 'Approved', value: 'approved' },
          { label: 'Rejected', value: 'rejected' },
          { label: 'Completed', value: 'completed' },
        ],
        defaultValue: 'pending',
      }),
      proofOfOwnership: text({
        validation: { isRequired: true },
        ui: { displayMode: 'textarea' },
        label: 'Proof of Ownership',
      }),
      verificationDetails: text({
        ui: { displayMode: 'textarea' },
        label: 'Verification Details',
      }),
      adminNotes: text({
        ui: { displayMode: 'textarea' },
        label: 'Admin Notes',
      }),
      reviewedAt: timestamp({ label: 'Reviewed At' }),
      completedAt: timestamp({ label: 'Completed At' }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      updatedAt: timestamp({
        defaultValue: { kind: 'now' },
        db: { updatedAt: true },
      }),
      // Relationships
      claimant: relationship({
        ref: 'User.claims',
      }),
      lostItem: relationship({
        ref: 'LostItem.claims',
      }),
      foundItem: relationship({
        ref: 'FoundItem.claims',
      }),
      reviewedBy: relationship({
        ref: 'User',
        label: 'Reviewed By Admin',
      }),
    },
  }),

  Auction: list({
    access: allowAll,
    fields: {
      title: text({
        validation: { isRequired: true },
        label: 'Auction Title',
      }),
      description: text({
        ui: { displayMode: 'textarea' },
      }),
      startingPrice: integer({
        validation: { isRequired: true },
        
        label: 'Starting Price ($)',
      }),
    currentBid: integer({
      defaultValue: 0,
      label: 'Current Highest Bid ($)',
    }),
    bidIncrement: integer({
      defaultValue: 1,
      label: 'Minimum Bid Increment ($)',
    }),
      startTime: timestamp({
        validation: { isRequired: true },
        label: 'Auction Start Time',
      }),
      endTime: timestamp({
        validation: { isRequired: true },
        label: 'Auction End Time',
      }),
      status: select({
        type: 'enum',
        options: [
          { label: 'Scheduled', value: 'scheduled' },
          { label: 'Active', value: 'active' },
          { label: 'Ending Soon', value: 'endingsoon' },
          { label: 'Ended', value: 'ended' },
          { label: 'Cancelled', value: 'cancelled' },
        ],
        defaultValue: 'scheduled',
      }),
      bidCount: integer({
        defaultValue: 0,
        label: 'Number of Bids',
      }),
      reservePrice: integer({
        label: 'Reserve Price ($)',
      }),
      buyNowPrice: integer({
        label: 'Buy Now Price ($)',
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      updatedAt: timestamp({
        defaultValue: { kind: 'now' },
        db: { updatedAt: true },
      }),
      // Relationships
      item: relationship({
        ref: 'FoundItem.auction',
      }),
      bids: relationship({
        ref: 'Bid.auction',
        many: true,
      }),
      winner: relationship({
        ref: 'User',
        label: 'Auction Winner',
      }),
      createdBy: relationship({
        ref: 'User',
        label: 'Created By Admin',
      }),
    },
  }),

  Bid: list({
    access: allowAll,
    fields: {
      amount: integer({
        validation: { isRequired: true },
        label: 'Bid Amount ($)',
      }),
      isWinning: checkbox({
        defaultValue: false,
        label: 'Is Current Winning Bid',
      }),
      isAutoBid: checkbox({
        defaultValue: false,
        label: 'Auto Bid',
      }),
      maxAutoBid: integer({
        label: 'Maximum Auto Bid Amount ($)',
      }),
      bidTime: timestamp({
        defaultValue: { kind: 'now' },
        label: 'Bid Placed At',
      }),
      // Relationships
        auction: relationship({
        ref: 'Auction.bids',
      }),
      bidder: relationship({
        ref: 'User.bids',
      }),
    },
  }),

  Category: list({
    access: allowAll,
    fields: {
      name: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      description: text(),
      icon: text({ label: 'Icon (emoji or class)' }),
      isActive: checkbox({
        defaultValue: true,
        label: 'Active Category',
      }),
      sortOrder: integer({
        defaultValue: 0,
        label: 'Sort Order',
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Location: list({
    access: allowAll,
    fields: {
      name: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      description: text(),
      building: text({ label: 'Building Name' }),
      floor: text({ label: 'Floor/Level' }),
      isActive: checkbox({
        defaultValue: true,
        label: 'Active Location',
      }),
      sortOrder: integer({
        defaultValue: 0,
        label: 'Sort Order',
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  ContactMessage: list({
    access: allowAll,
    fields: {
      name: text({
        validation: { isRequired: true },
        label: 'Sender Name',
      }),
      email: text({
        validation: { isRequired: true },
        label: 'Sender Email',
      }),
      subject: select({
        type: 'enum',
        options: [
          { label: 'Account Issues', value: 'account' },
          { label: 'Item Report Problem', value: 'item' },
          { label: 'Auction Question', value: 'auction' },
          { label: 'Technical Support', value: 'technical' },
          { label: 'Other', value: 'other' },
        ],
        validation: { isRequired: true },
      }),
      message: text({
        validation: { isRequired: true },
        ui: { displayMode: 'textarea' },
      }),
      status: select({
        type: 'enum',
        options: [
          { label: 'New', value: 'new' },
          { label: 'In Progress', value: 'inprogress' },
          { label: 'Resolved', value: 'resolved' },
          { label: 'Closed', value: 'closed' },
        ],
        defaultValue: 'new',
      }),
      priority: select({
        type: 'enum',
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
          { label: 'Urgent', value: 'urgent' },
        ],
        defaultValue: 'medium',
      }),
      adminResponse: text({
        ui: { displayMode: 'textarea' },
        label: 'Admin Response',
      }),
      respondedAt: timestamp({ label: 'Responded At' }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      updatedAt: timestamp({
        defaultValue: { kind: 'now' },
        db: { updatedAt: true },
      }),
      // Relationships
      respondedBy: relationship({
        ref: 'User',
        label: 'Responded By Admin',
      }),
    },
  }),

  SystemSettings: list({
    graphql: {
      plural: 'SystemSettingsList', // change to something different
    },
    access: allowAll,
    fields: {
      settingKey: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
        label: 'Setting Key',
      }),
      settingValue: text({
        validation: { isRequired: true },
        label: 'Setting Value',
      }),
      description: text({
        ui: { displayMode: 'textarea' },
      }),
      dataType: select({
        type: 'enum',
        options: [
          { label: 'String', value: 'string' },
          { label: 'Number', value: 'number' },
          { label: 'Boolean', value: 'boolean' },
          { label: 'JSON', value: 'json' },
        ],
        defaultValue: 'string',
      }),
      isPublic: checkbox({
        defaultValue: false,
        label: 'Public Setting',
      }),
      updatedAt: timestamp({
        defaultValue: { kind: 'now' },
        db: { updatedAt: true },
      }),
      // Relationships
      updatedBy: relationship({
        ref: 'User',
        label: 'Last Updated By',
      }),
    },
  }),
};