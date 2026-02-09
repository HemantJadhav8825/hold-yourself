import { canViewerSeeShare } from '../middleware/visibility';
import { serializeShare } from '../services/share.serializer';

async function runSimulation() {
  console.log('--- MILESTONE 3 PRIVACY SIMULATION ---\n');

  const authorId = 'author-123';
  const followersShare: any = {
    _id: 'share-followers-id',
    authorId: authorId,
    content: 'Followers only content',
    visibility: 'followers',
    anonymous: false,
    sensitivityTags: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const anonymousFollowersShare: any = {
    _id: 'share-anon-followers-id',
    authorId: authorId,
    content: 'Anonymous followers only content',
    visibility: 'followers',
    anonymous: true,
    sensitivityTags: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Scenario 1: Unauthenticated request to GET /shares (simulated via canViewerSeeShare)
  const isS1Visible = await canViewerSeeShare('', followersShare);
  console.log(`Scenario 1: Unauthenticated guest see followers-only? -> ${isS1Visible}`);

  // Scenario 2: Authenticated non-follower
  const isS2Visible = await canViewerSeeShare('viewer-non-follower', followersShare);
  console.log(`Scenario 2: Authenticated non-follower see followers-only? -> ${isS2Visible}`);

  // Scenario 3: Anonymous + followers share fetch (by follower)
  const isS4Visible = await canViewerSeeShare('viewer-follower', anonymousFollowersShare);
  const serializedS4 = serializeShare(anonymousFollowersShare);
  console.log(`Scenario 4: Follower see anonymous followers-only? -> ${isS4Visible}`);
  console.log(`Scenario 4: authorId in response -> ${serializedS4.authorId}`);

  console.log('\n--- METADATA & EXISTENCE ANALYSIS ---');
  console.log('Observation: If a share is not visible, it should be excluded from the feed or return 404.');
  console.log('Existence check: If getShare(id) returns 404 for forbidden content, existence is hidden.');
}

runSimulation();
