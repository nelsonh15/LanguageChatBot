import admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

// Middleware to validate Firebase ID token
const validateFirebaseIdToken = async (req, res, next) => {
  // If there are no 'Authorization' header
  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))) {
    res.status(403).send('Unauthorized');
    return;
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying auth token', error);
    res.status(403).send('Unauthorized access');
  }
};

export default validateFirebaseIdToken;