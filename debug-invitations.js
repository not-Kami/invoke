import mongoose from 'mongoose';
import Table from './server/src/resources/table/table.model.js';

// Connexion à MongoDB
await mongoose.connect('mongodb://localhost:27017/invoke', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function debugInvitations() {
  try {
    console.log('🔍 Debugging invitations...\n');
    
    const testUserId = '68c6704258754d77fac3f16d';
    
    // 1. Vérifier toutes les tables
    console.log('1. All tables:');
    const allTables = await Table.find({});
    console.log(`Found ${allTables.length} tables total`);
    
    allTables.forEach(table => {
      console.log(`- Table: ${table.name} (${table._id})`);
      console.log(`  Owner: ${table.owner}`);
      console.log(`  Invited users: ${table.invitedUsers.length}`);
      if (table.invitedUsers.length > 0) {
        table.invitedUsers.forEach(inv => {
          console.log(`    - User: ${inv.user} (type: ${typeof inv.user})`);
        });
      }
    });
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 2. Chercher les tables avec des invitedUsers
    console.log('2. Tables with invited users:');
    const tablesWithInvites = await Table.find({ 
      'invitedUsers.0': { $exists: true }
    });
    console.log(`Found ${tablesWithInvites.length} tables with invited users`);
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 3. Chercher avec l'ID utilisateur en string
    console.log('3. Search with string ID:');
    const tablesWithStringId = await Table.find({ 
      'invitedUsers.user': testUserId
    });
    console.log(`Found ${tablesWithStringId.length} tables with string ID`);
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 4. Chercher avec ObjectId
    console.log('4. Search with ObjectId:');
    const ObjectId = mongoose.Types.ObjectId;
    const tablesWithObjectId = await Table.find({ 
      'invitedUsers.user': new ObjectId(testUserId)
    });
    console.log(`Found ${tablesWithObjectId.length} tables with ObjectId`);
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 5. Vérifier le type de l'ID dans la base
    if (tablesWithInvites.length > 0) {
      console.log('5. Checking ID types in database:');
      const table = tablesWithInvites[0];
      table.invitedUsers.forEach((inv, index) => {
        console.log(`Invitation ${index}:`);
        console.log(`  User ID: ${inv.user}`);
        console.log(`  Type: ${typeof inv.user}`);
        console.log(`  Constructor: ${inv.user.constructor.name}`);
        console.log(`  Is ObjectId: ${inv.user instanceof ObjectId}`);
        console.log(`  String value: ${inv.user.toString()}`);
        console.log(`  Equals test ID: ${inv.user.toString() === testUserId}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

await debugInvitations();
