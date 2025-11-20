// Quick test of the chat endpoint
const testMessage = "What causes acne?";

console.log('Testing chat endpoint...');
console.log('Message:', testMessage);

fetch('http://localhost:5001/api/chat/message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: testMessage,
    conversationHistory: []
  })
})
.then(async response => {
  console.log('Status:', response.status);
  const data = await response.json();
  console.log('Response:', JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error('Error:', error.message);
});
