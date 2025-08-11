import { config } from '@keystone-6/core';
import { lists } from './schema';
import { withAuth, session } from './auth';
import { seedDatabase } from './seed-data';

export default withAuth(
  config({
    db: {
      provider: 'sqlite',
      url: process.env.DATABASE_URL || 'file:./keystone.db',
      onConnect: async (context) => {
        // Seed database on first run
        const userCount = await context.query.User.count();
        if (userCount === 0) {
          await seedDatabase(context);
        }
      },
    },
    lists,
    session,
    server: {
      cors: {
        origin: [
          process.env.FRONTEND_URL || 'http://localhost:5173',
          'http://127.0.0.1:5173',
          'http://localhost:3000',
        ],
        credentials: true,
      },
      port: parseInt(process.env.PORT || '3000'),
    },
    storage: {
      local_images: {
        kind: 'local',
        type: 'image',
        generateUrl: (path) => `http://localhost:3000/images${path}`,
        serverRoute: {
          path: '/images',
        },
        storagePath: 'public/images',
      },
    },
    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },
    graphql: {
      playground: process.env.NODE_ENV !== 'production',
      apolloConfig: {
        introspection: process.env.NODE_ENV !== 'production',
      },
    },
  })
);