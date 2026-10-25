import app from './app.js';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';

const PORT = process.env.PORT || 5000;

// Ensure initial Admin exists
const ensureAdminAccount = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@recruitiq.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const adminName = process.env.ADMIN_NAME || 'System Administrator';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isActive: true,
      });
      console.log(`🔐 Initial Admin initialized: ${adminEmail}`);
    }
  } catch (err) {
    console.error('Error ensuring admin account:', err.message);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await ensureAdminAccount();

    const server = app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`⚡ RecruitIQ API running on http://localhost:${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`======================================================\n`);
    });

    const shutdown = () => {
      console.log('Stopping server gracefully...');
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error.message);
  }
};

startServer();
