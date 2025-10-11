// netlify/functions/addRating.js
const { initializeApp, getApps } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');

// ✅ Use environment variables for Firebase config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only once
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'POST') {
      const { stars } = JSON.parse(event.body);
      if (!stars || stars < 1 || stars > 5) {
        return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Invalid stars' }) };
      }

      await addDoc(collection(db, 'ratings'), {
        stars: stars,
        timestamp: new Date()
      });

      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }

    // GET request for average rating
    if (event.httpMethod === 'GET') {
      const snapshot = await getDocs(collection(db, 'ratings'));
      let total = 0, count = 0;
      snapshot.forEach(doc => {
        total += doc.data().stars;
        count++;
      });
      const avg = count ? (total / count).toFixed(1) : 0;
      return { statusCode: 200, body: JSON.stringify({ avg, count }) };
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
  }
};
