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

    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const maxAllowedSessionTimeInSeconds = 3600; //Set to one hour

    if ((currentTimeInSeconds - decodedToken.iat) > maxAllowedSessionTimeInSeconds) {
      console.log("Token expired!")
      res.status(403).send('Token expired');
      return;
    }
    
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying auth token', error);
    res.status(403).send('Unauthorized access');
  }
};

export default validateFirebaseIdToken;