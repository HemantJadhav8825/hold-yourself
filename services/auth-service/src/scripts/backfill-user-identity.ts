import mongoose from 'mongoose';
import { UserModel } from '../modules/users/user.schema';
import { ENV } from '../config/env';

/**
 * Backfill User Identity Script
 * 
 * Goal: Populate missing username and displayName for existing records.
 */

async function backfill() {
  try {
    console.log('--- STARTING IDENTITY BACKFILL ---');
    
    // 1. Connect to DB
    await mongoose.connect(ENV.DATABASE_URL);
    console.log('Connected to MongoDB.');

    // 2. Identify target users
    const users = await UserModel.find({
      $or: [
        { username: { $exists: false } },
        { username: null },
        { username: '' },
        { displayName: { $exists: false } },
        { displayName: null },
        { displayName: '' }
      ]
    });

    console.log(`Found ${users.length} users requiring update.`);

    if (users.length === 0) {
      console.log('All users have identities. Nothing to do.');
      return;
    }

    let updatedCount = 0;

    for (const user of users) {
      const email = user.email;
      let needsUpdate = false;

      // --- DISPLAY NAME LOGIC ---
      if (!user.displayName) {
        // Fallback: Use email local part capitalized or 'Member'
        const emailPrefix = email.split('@')[0];
        user.displayName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
        needsUpdate = true;
      }

      // --- USERNAME LOGIC ---
      if (!user.username) {
        let baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // Ensure uniqueness
        let finalUsername = baseUsername;
        let suffix = 1;
        
        while (await UserModel.findOne({ username: finalUsername, _id: { $ne: user._id } })) {
          finalUsername = `${baseUsername}${suffix}`;
          suffix++;
        }

        user.username = finalUsername;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await user.save();
        updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} users.`);
    console.log('--- BACKFILL COMPLETE ---');

  } catch (error) {
    console.error('Backfill failed:', error);
  } finally {
    await mongoose.connection.close();
  }
}

backfill();
