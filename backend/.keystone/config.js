"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core2 = require("@keystone-6/core");

// schema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var lists = {
  // Removed duplicate SystemSettings definition
  User: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: "unique"
      }),
      collegeId: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: "unique",
        label: "College ID"
      }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      role: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "Student", value: "student" },
          { label: "Staff", value: "staff" },
          { label: "Admin", value: "admin" }
        ],
        defaultValue: "student"
      }),
      phone: (0, import_fields.text)({ label: "Phone Number" }),
      isVerified: (0, import_fields.checkbox)({
        defaultValue: false,
        label: "Account Verified"
      }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      }),
      // Relationships
      lostItems: (0, import_fields.relationship)({
        ref: "LostItem.reportedBy",
        many: true
      }),
      foundItems: (0, import_fields.relationship)({
        ref: "FoundItem.reportedBy",
        many: true
      }),
      claims: (0, import_fields.relationship)({
        ref: "Claim.claimant",
        many: true
      }),
      bids: (0, import_fields.relationship)({
        ref: "Bid.bidder",
        many: true
      })
    }
  }),
  LostItem: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      itemName: (0, import_fields.text)({
        validation: { isRequired: true },
        label: "Item Name"
      }),
      description: (0, import_fields.text)({
        validation: { isRequired: true },
        ui: { displayMode: "textarea" }
      }),
      category: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "Electronics", value: "electronics" },
          { label: "Clothing & Accessories", value: "clothing" },
          { label: "Bags & Backpacks", value: "bags" },
          { label: "Books & Stationery", value: "books" },
          { label: "Jewelry & Watches", value: "jewelry" },
          { label: "Keys & Key Chains", value: "keys" },
          { label: "Sports Equipment", value: "sports" },
          { label: "Other", value: "other" }
        ],
        validation: { isRequired: true }
      }),
      status: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "Active", value: "active" },
          { label: "Found", value: "found" },
          { label: "Claimed", value: "claimed" },
          { label: "Closed", value: "closed" }
        ],
        defaultValue: "active"
      }),
      lostDate: (0, import_fields.timestamp)({
        validation: { isRequired: true },
        label: "Date Lost"
      }),
      lostTime: (0, import_fields.text)({ label: "Time Lost (approximate)" }),
      location: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "Library", value: "library" },
          { label: "Cafeteria", value: "cafeteria" },
          { label: "Gymnasium", value: "gym" },
          { label: "Dormitory", value: "dormitory" },
          { label: "Classroom", value: "classroom" },
          { label: "Parking Area", value: "parking" },
          { label: "Auditorium", value: "auditorium" },
          { label: "Laboratory", value: "lab" },
          { label: "Outdoor Area", value: "outdoor" },
          { label: "Other", value: "other" }
        ],
        validation: { isRequired: true }
      }),
      specificLocation: (0, import_fields.text)({
        label: "Specific Location Details"
      }),
      circumstances: (0, import_fields.text)({
        ui: { displayMode: "textarea" },
        label: "How was it lost?"
      }),
      photo: (0, import_fields.image)({ storage: "images" }),
      contactEmail: (0, import_fields.text)({
        validation: { isRequired: true },
        label: "Contact Email"
      }),
      contactPhone: (0, import_fields.text)({ label: "Contact Phone" }),
      privacyConsent: (0, import_fields.checkbox)({
        defaultValue: false,
        label: "Privacy Consent Given"
      }),
      notifications: (0, import_fields.checkbox)({
        defaultValue: true,
        label: "Email Notifications Enabled"
      }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      }),
      updatedAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" },
        db: { updatedAt: true }
      }),
      // Relationships
      reportedBy: (0, import_fields.relationship)({
        ref: "User.lostItems",
        ui: {
          displayMode: "cards",
          cardFields: ["name", "email", "collegeId"],
          inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineCreate: { fields: ["name", "email", "collegeId"] }
        }
      }),
      claims: (0, import_fields.relationship)({
        ref: "Claim.lostItem",
        many: true
      }),
      matchedFoundItem: (0, import_fields.relationship)({
        ref: "FoundItem.matchedLostItem"
      })
    }
  }),
  FoundItem: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      itemName: (0, import_fields.text)({
        validation: { isRequired: true },
        label: "Item Name"
      }),
      description: (0, import_fields.text)({
        validation: { isRequired: true },
        ui: { displayMode: "textarea" }
      }),
      category: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "Electronics", value: "electronics" },
          { label: "Clothing & Accessories", value: "clothing" },
          { label: "Bags & Backpacks", value: "bags" },
          { label: "Books & Stationery", value: "books" },
          { label: "Jewelry & Watches", value: "jewelry" },
          { label: "Keys & Key Chains", value: "keys" },
          { label: "Sports Equipment", value: "sports" },
          { label: "Other", value: "other" }
        ],
        validation: { isRequired: true }
      }),
      status: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "Available", value: "available" },
          { label: "Claimed", value: "claimed" },
          { label: "Returned", value: "returned" },
          { label: "Moved to Auction", value: "auction" }
        ],
        defaultValue: "available"
      }),
      foundDate: (0, import_fields.timestamp)({
        validation: { isRequired: true },
        label: "Date Found"
      }),
      foundTime: (0, import_fields.text)({ label: "Time Found (approximate)" }),
      location: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "Library", value: "library" },
          { label: "Cafeteria", value: "cafeteria" },
          { label: "Gymnasium", value: "gym" },
          { label: "Dormitory", value: "dormitory" },
          { label: "Classroom", value: "classroom" },
          { label: "Parking Area", value: "parking" },
          { label: "Auditorium", value: "auditorium" },
          { label: "Laboratory", value: "lab" },
          { label: "Outdoor Area", value: "outdoor" },
          { label: "Other", value: "other" }
        ],
        validation: { isRequired: true }
      }),
      specificLocation: (0, import_fields.text)({
        label: "Specific Location Details"
      }),
      photo: (0, import_fields.image)({ storage: "images" }),
      finderName: (0, import_fields.text)({
        validation: { isRequired: true },
        label: "Finder Name"
      }),
      contactEmail: (0, import_fields.text)({
        validation: { isRequired: true },
        label: "Contact Email"
      }),
      handoverLocation: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "Security Office", value: "securityoffice" },
          { label: "Student Services", value: "studentservices" },
          { label: "Library Information Desk", value: "librarydesk" },
          { label: "Administrative Office", value: "adminoffice" },
          { label: "Other", value: "other" }
        ],
        validation: { isRequired: true },
        label: "Handover Location"
      }),
      customHandoverLocation: (0, import_fields.text)({
        label: "Custom Handover Location"
      }),
      additionalNotes: (0, import_fields.text)({
        ui: { displayMode: "textarea" },
        label: "Additional Notes"
      }),
      verifyOwnership: (0, import_fields.checkbox)({
        defaultValue: true,
        label: "Ownership Verification Required"
      }),
      handoverAgreement: (0, import_fields.checkbox)({
        defaultValue: true,
        label: "Handover Agreement Accepted"
      }),
      daysUnclaimed: (0, import_fields.integer)({
        defaultValue: 0,
        label: "Days Unclaimed"
      }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      }),
      updatedAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" },
        db: { updatedAt: true }
      }),
      // Relationships
      reportedBy: (0, import_fields.relationship)({
        ref: "User.foundItems",
        ui: {
          displayMode: "cards",
          cardFields: ["name", "email", "collegeId"],
          inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineCreate: { fields: ["name", "email", "collegeId"] }
        }
      }),
      claims: (0, import_fields.relationship)({
        ref: "Claim.foundItem",
        many: true
      }),
      matchedLostItem: (0, import_fields.relationship)({
        ref: "LostItem.matchedFoundItem"
      }),
      auction: (0, import_fields.relationship)({
        ref: "Auction.item"
      })
    }
  }),
  Claim: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      status: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "Pending", value: "pending" },
          { label: "Under Review", value: "review" },
          { label: "Approved", value: "approved" },
          { label: "Rejected", value: "rejected" },
          { label: "Completed", value: "completed" }
        ],
        defaultValue: "pending"
      }),
      proofOfOwnership: (0, import_fields.text)({
        validation: { isRequired: true },
        ui: { displayMode: "textarea" },
        label: "Proof of Ownership"
      }),
      verificationDetails: (0, import_fields.text)({
        ui: { displayMode: "textarea" },
        label: "Verification Details"
      }),
      adminNotes: (0, import_fields.text)({
        ui: { displayMode: "textarea" },
        label: "Admin Notes"
      }),
      reviewedAt: (0, import_fields.timestamp)({ label: "Reviewed At" }),
      completedAt: (0, import_fields.timestamp)({ label: "Completed At" }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      }),
      updatedAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" },
        db: { updatedAt: true }
      }),
      // Relationships
      claimant: (0, import_fields.relationship)({
        ref: "User.claims"
      }),
      lostItem: (0, import_fields.relationship)({
        ref: "LostItem.claims"
      }),
      foundItem: (0, import_fields.relationship)({
        ref: "FoundItem.claims"
      }),
      reviewedBy: (0, import_fields.relationship)({
        ref: "User",
        label: "Reviewed By Admin"
      })
    }
  }),
  Auction: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      title: (0, import_fields.text)({
        validation: { isRequired: true },
        label: "Auction Title"
      }),
      description: (0, import_fields.text)({
        ui: { displayMode: "textarea" }
      }),
      startingPrice: (0, import_fields.integer)({
        validation: { isRequired: true },
        label: "Starting Price ($)"
      }),
      currentBid: (0, import_fields.integer)({
        defaultValue: 0,
        label: "Current Highest Bid ($)"
      }),
      bidIncrement: (0, import_fields.integer)({
        defaultValue: 1,
        label: "Minimum Bid Increment ($)"
      }),
      startTime: (0, import_fields.timestamp)({
        validation: { isRequired: true },
        label: "Auction Start Time"
      }),
      endTime: (0, import_fields.timestamp)({
        validation: { isRequired: true },
        label: "Auction End Time"
      }),
      status: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "Scheduled", value: "scheduled" },
          { label: "Active", value: "active" },
          { label: "Ending Soon", value: "endingsoon" },
          { label: "Ended", value: "ended" },
          { label: "Cancelled", value: "cancelled" }
        ],
        defaultValue: "scheduled"
      }),
      bidCount: (0, import_fields.integer)({
        defaultValue: 0,
        label: "Number of Bids"
      }),
      reservePrice: (0, import_fields.integer)({
        label: "Reserve Price ($)"
      }),
      buyNowPrice: (0, import_fields.integer)({
        label: "Buy Now Price ($)"
      }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      }),
      updatedAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" },
        db: { updatedAt: true }
      }),
      // Relationships
      item: (0, import_fields.relationship)({
        ref: "FoundItem.auction"
      }),
      bids: (0, import_fields.relationship)({
        ref: "Bid.auction",
        many: true
      }),
      winner: (0, import_fields.relationship)({
        ref: "User",
        label: "Auction Winner"
      }),
      createdBy: (0, import_fields.relationship)({
        ref: "User",
        label: "Created By Admin"
      })
    }
  }),
  Bid: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      amount: (0, import_fields.integer)({
        validation: { isRequired: true },
        label: "Bid Amount ($)"
      }),
      isWinning: (0, import_fields.checkbox)({
        defaultValue: false,
        label: "Is Current Winning Bid"
      }),
      isAutoBid: (0, import_fields.checkbox)({
        defaultValue: false,
        label: "Auto Bid"
      }),
      maxAutoBid: (0, import_fields.integer)({
        label: "Maximum Auto Bid Amount ($)"
      }),
      bidTime: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" },
        label: "Bid Placed At"
      }),
      // Relationships
      auction: (0, import_fields.relationship)({
        ref: "Auction.bids"
      }),
      bidder: (0, import_fields.relationship)({
        ref: "User.bids"
      })
    }
  }),
  Category: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: "unique"
      }),
      description: (0, import_fields.text)(),
      icon: (0, import_fields.text)({ label: "Icon (emoji or class)" }),
      isActive: (0, import_fields.checkbox)({
        defaultValue: true,
        label: "Active Category"
      }),
      sortOrder: (0, import_fields.integer)({
        defaultValue: 0,
        label: "Sort Order"
      }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      })
    }
  }),
  Location: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: "unique"
      }),
      description: (0, import_fields.text)(),
      building: (0, import_fields.text)({ label: "Building Name" }),
      floor: (0, import_fields.text)({ label: "Floor/Level" }),
      isActive: (0, import_fields.checkbox)({
        defaultValue: true,
        label: "Active Location"
      }),
      sortOrder: (0, import_fields.integer)({
        defaultValue: 0,
        label: "Sort Order"
      }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      })
    }
  }),
  ContactMessage: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({
        validation: { isRequired: true },
        label: "Sender Name"
      }),
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        label: "Sender Email"
      }),
      subject: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "Account Issues", value: "account" },
          { label: "Item Report Problem", value: "item" },
          { label: "Auction Question", value: "auction" },
          { label: "Technical Support", value: "technical" },
          { label: "Other", value: "other" }
        ],
        validation: { isRequired: true }
      }),
      message: (0, import_fields.text)({
        validation: { isRequired: true },
        ui: { displayMode: "textarea" }
      }),
      status: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "New", value: "new" },
          { label: "In Progress", value: "inprogress" },
          { label: "Resolved", value: "resolved" },
          { label: "Closed", value: "closed" }
        ],
        defaultValue: "new"
      }),
      priority: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "Low", value: "low" },
          { label: "Medium", value: "medium" },
          { label: "High", value: "high" },
          { label: "Urgent", value: "urgent" }
        ],
        defaultValue: "medium"
      }),
      adminResponse: (0, import_fields.text)({
        ui: { displayMode: "textarea" },
        label: "Admin Response"
      }),
      respondedAt: (0, import_fields.timestamp)({ label: "Responded At" }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      }),
      updatedAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" },
        db: { updatedAt: true }
      }),
      // Relationships
      respondedBy: (0, import_fields.relationship)({
        ref: "User",
        label: "Responded By Admin"
      })
    }
  }),
  SystemSettings: (0, import_core.list)({
    graphql: {
      plural: "SystemSettingsList"
      // change to something different
    },
    access: import_access.allowAll,
    fields: {
      settingKey: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: "unique",
        label: "Setting Key"
      }),
      settingValue: (0, import_fields.text)({
        validation: { isRequired: true },
        label: "Setting Value"
      }),
      description: (0, import_fields.text)({
        ui: { displayMode: "textarea" }
      }),
      dataType: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "String", value: "string" },
          { label: "Number", value: "number" },
          { label: "Boolean", value: "boolean" },
          { label: "JSON", value: "json" }
        ],
        defaultValue: "string"
      }),
      isPublic: (0, import_fields.checkbox)({
        defaultValue: false,
        label: "Public Setting"
      }),
      updatedAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" },
        db: { updatedAt: true }
      }),
      // Relationships
      updatedBy: (0, import_fields.relationship)({
        ref: "User",
        label: "Last Updated By"
      })
    }
  })
};

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  sessionData: "name email role collegeId isVerified",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password", "collegeId", "role"],
    itemData: {
      role: "admin",
      isVerified: true
    }
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// keystone.ts
var keystone_default = withAuth(
  (0, import_core2.config)({
    db: {
      provider: "sqlite",
      url: "file:./keystone.db"
    },
    // 👇 Add storage configuration here
    storage: {
      images: {
        kind: "local",
        type: "image",
        generateUrl: (path) => `/images${path}`,
        serverRoute: {
          path: "/images"
        },
        storagePath: "public/images"
      }
    },
    lists,
    session,
    server: {
      cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        credentials: true
      },
      port: 3e3
    },
    ui: {
      isAccessAllowed: (context) => !!context.session?.data
    }
  })
);
//# sourceMappingURL=config.js.map
