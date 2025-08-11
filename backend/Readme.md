# CanBeFound.com Backend

This is the backend API for the CanBeFound.com Lost and Found platform, built with Keystone.js and SQLite.

## Features

- **User Management**: College ID-based authentication
- **Lost Items**: Report and manage lost items
- **Found Items**: Report and track found items
- **Claims System**: Handle ownership verification
- **Auction System**: Auction unclaimed items
- **Admin Dashboard**: Comprehensive management interface
- **File Uploads**: Image storage for items
- **Contact System**: Handle support messages

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the development server:
```bash
npm run dev
```

4. Access the admin interface:
- Admin UI: http://localhost:3000
- GraphQL Playground: http://localhost:3000/api/graphql

### Default Admin Account

- Email: `admin@college.edu`
- Password: `admin123`
- College ID: `ADMIN001`

## API Endpoints

### GraphQL API
- **Endpoint**: `http://localhost:3000/api/graphql`
- **Playground**: Available in development mode

### REST API Examples

#### Get All Items
```
GET /api/items?category=electronics&location=library&search=iphone
```

#### Submit Lost Item
```
POST /api/lost-items
Content-Type: application/json

{
  "itemName": "iPhone 13 Pro",
  "category": "electronics",
  "description": "Black iPhone with blue case",
  "lostDate": "2025-01-15",
  "location": "library",
  "fullName": "John Doe",
  "collegeId": "STU001",
  "email": "john.doe@college.edu"
}
```

#### Submit Found Item
```
POST /api/found-items
Content-Type: application/json

{
  "itemName": "Silver Watch",
  "category": "jewelry",
  "description": "Silver digital watch",
  "foundDate": "2025-01-15",
  "location": "gym",
  "finderName": "Jane Smith",
  "collegeId": "STU002",
  "contactEmail": "jane.smith@college.edu"
}
```

## Database Schema

### Core Entities

- **Users**: Students, staff, and admins
- **LostItems**: Items reported as lost
- **FoundItems**: Items reported as found
- **Claims**: Ownership verification requests
- **Auctions**: Unclaimed items moved to auction
- **Bids**: Auction bid tracking
- **Categories**: Item categorization
- **Locations**: Campus location management
- **ContactMessages**: Support and contact messages
- **SystemSettings**: Configurable system parameters

### Key Relationships

- Users can report multiple lost/found items
- Items can have multiple claims
- Found items can be moved to auctions
- Auctions can have multiple bids
- Claims link lost and found items

## Configuration

### Environment Variables

- `DATABASE_URL`: SQLite database path
- `SESSION_SECRET`: Session encryption key
- `PORT`: Server port (default: 3000)
- `FRONTEND_URL`: Frontend URL for CORS
- `ADMIN_EMAIL`: Default admin email
- `ADMIN_PASSWORD`: Default admin password

### System Settings

Configurable via admin interface:
- Auction duration (days)
- Unclaimed item threshold (days)
- Minimum bid increment
- Email notification settings

## Development

### Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm start`: Start production server

### Database Management

The SQLite database is automatically created and seeded on first run. The database file is located at `./keystone.db`.

To reset the database:
```bash
rm keystone.db
npm run dev
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database URL
3. Set secure session secret
4. Configure email settings for notifications
5. Set up proper file storage (consider cloud storage)

## Security Features

- College ID-based authentication
- Role-based access control
- Session management
- CORS protection
- Input validation
- File upload restrictions

## Support

For issues or questions, contact the development team or check the main project documentation.