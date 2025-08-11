// CanBeFound.com - API Client for Frontend Integration

class CanBeFoundAPI {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
    this.restEndpoint = `${baseURL}/api/rest`;
    this.graphqlEndpoint = `${baseURL}/api/graphql`;
  }

  // Helper method for REST requests
  async restRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.restEndpoint}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        credentials: 'include',
        ...options,
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Request failed');
      }

      return result;
    } catch (error) {
      console.error('REST request failed:', error);
      throw error;
    }
  }

  // Helper method for GraphQL requests
  async graphqlRequest(query, variables = {}) {
    try {
      const response = await fetch(this.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data;
    } catch (error) {
      console.error('GraphQL request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email, password) {
    return await this.restRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(name, email, collegeId, password) {
    return await this.restRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, collegeId, password }),
    });
  }

  async logout() {
    const query = `
      mutation {
        endSession
      }
    `;

    return await this.graphqlRequest(query);
  }

  async getCurrentUser() {
    const query = `
      query {
        authenticatedItem {
          ... on User {
            id
            name
            email
            collegeId
            role
            isVerified
            phone
          }
        }
      }
    `;

    const data = await this.graphqlRequest(query);
    return data.authenticatedItem;
  }

  // Items
  async getAllItems(filters = {}) {
    const params = new URLSearchParams(filters);
    const result = await this.restRequest(`/items?${params}`);
    return result.items;
  }

  async getRecentItems(limit = 8) {
    const result = await this.restRequest(`/items?limit=${limit}`);
    return result.items.slice(0, limit);
  }

  async getPlatformStats() {
    const result = await this.restRequest('/stats');
    return result.stats;
  }

  // Submit lost item report
  async submitLostItem(formData) {
    return await this.restRequest('/lost-items', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // Submit found item report
  async submitFoundItem(formData) {
    return await this.restRequest('/found-items', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // Submit contact message
  async submitContactMessage(formData) {
    return await this.restRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // Get auctions
  async getAuctions(filters = {}) {
    const params = new URLSearchParams(filters);
    const result = await this.restRequest(`/auctions?${params}`);
    return result.auctions;
  }

  // Place bid
  async placeBid(auctionId, amount) {
    const query = `
      mutation PlaceBid($auctionId: ID!, $amount: String!) {
        createBid(data: {
          amount: $amount,
          auction: { connect: { id: $auctionId } },
          bidder: { connect: { id: "current-user-id" } }
        }) {
          id
          amount
          bidTime
          isWinning
        }
      }
    `;

    return await this.graphqlRequest(query, { auctionId, amount: amount.toString() });
  }

  // Submit claim
  async submitClaim(itemId, itemType, proofOfOwnership) {
    const query = `
      mutation CreateClaim($data: ClaimCreateInput!) {
        createClaim(data: $data) {
          id
          status
          createdAt
        }
      }
    `;

    const claimData = {
      proofOfOwnership,
      status: 'pending',
      claimant: { connect: { id: 'current-user-id' } },
    };

    if (itemType === 'lost') {
      claimData.lostItem = { connect: { id: itemId } };
    } else {
      claimData.foundItem = { connect: { id: itemId } };
    }

    return await this.graphqlRequest(query, { data: claimData });
  }

  // Get user's items
  async getUserItems(userId) {
    const query = `
      query GetUserItems($userId: ID!) {
        user(where: { id: $userId }) {
          lostItems {
            id
            itemName
            category
            status
            lostDate
            location
            photo {
              url
            }
          }
          foundItems {
            id
            itemName
            category
            status
            foundDate
            location
            photo {
              url
            }
          }
          claims {
            id
            status
            createdAt
            lostItem {
              itemName
            }
            foundItem {
              itemName
            }
          }
          bids {
            id
            amount
            bidTime
            isWinning
            auction {
              title
              status
              endTime
            }
          }
        }
      }
    `;

    const data = await this.graphqlRequest(query, { userId });
    return data.user;
  }
}

// Create global API instance
window.API = new CanBeFoundAPI();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CanBeFoundAPI;
}