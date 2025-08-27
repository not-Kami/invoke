// Test script for conversation API
const testConversationAPI = async () => {
  try {
    console.log('Testing conversation API...');
    
    const testData = {
      userEmail: 'test@example.com',
      content: 'This is a test message for the conversation API',
      conversationType: 'contact_admin',
      subject: 'Test Conversation'
    };

    console.log('Sending data:', testData);

    const response = await fetch('http://localhost:3000/api/v1/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response body:', result);

    if (response.ok) {
      console.log('✅ API test successful!');
      
      // Test admin endpoint (without auth for now)
      console.log('\nTesting admin endpoint...');
      try {
        const adminResponse = await fetch('http://localhost:3000/api/v1/conversations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log('Admin response status:', adminResponse.status);
        if (adminResponse.ok) {
          const adminResult = await adminResponse.json();
          console.log('Admin response:', adminResult);
        } else {
          console.log('Admin endpoint requires authentication');
        }
      } catch (adminError) {
        console.log('Admin endpoint error:', adminError.message);
      }

      // Test individual conversation endpoint
      if (result.data && result.data._id) {
        console.log('\nTesting individual conversation endpoint...');
        try {
          const individualResponse = await fetch(`http://localhost:3000/api/v1/conversations/${result.data._id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          console.log('Individual conversation response status:', individualResponse.status);
          if (individualResponse.ok) {
            const individualResult = await individualResponse.json();
            console.log('Individual conversation response:', individualResult);
          } else {
            console.log('Individual conversation endpoint requires authentication');
          }
        } catch (individualError) {
          console.log('Individual conversation endpoint error:', individualError.message);
        }
      }
    } else {
      console.log('❌ API test failed:', result);
    }

  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
};

// Test de la route utilisateur avec ID (nécessite un utilisateur existant)
async function testUserConversationsById() {
  console.log('\nTesting user conversations by ID...');
  
  try {
    // Note: Ce test nécessite un ID utilisateur valide de votre base de données
    // Remplacez par un ID réel pour tester
    const testUserId = '507f1f77bcf86cd799439011'; // ID de test MongoDB
    
    const response = await fetch(`http://localhost:3000/api/v1/conversations/user/${testUserId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Note: Ce test nécessite un token d'authentification valide
        // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
      }
    });
    
    console.log('User conversations by ID response status:', response.status);
    
    if (response.status === 401) {
      console.log('✅ User conversations by ID endpoint requires authentication (expected)');
    } else if (response.status === 404) {
      console.log('✅ User conversations by ID endpoint works but user not found (expected with test ID)');
    } else {
      const responseBody = await response.json();
      console.log('User conversations by ID response:', responseBody);
    }
    
  } catch (error) {
    console.error('❌ Error testing user conversations by ID:', error.message);
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testConversationAPI()
    .then(() => testUserConversationsById())
    .then(() => console.log('\n🎉 All tests completed!'))
    .catch(console.error);
} 