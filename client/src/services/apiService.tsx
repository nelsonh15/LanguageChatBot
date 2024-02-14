import { getAuth, getIdToken } from 'firebase/auth';

export async function secureApiCall(endpoint, method, body) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const idToken = await getIdToken(user);

  const response = await fetch(endpoint, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  });

  // Handle response
  if (response.ok) {
    return response.json();
  } else {
    // Handle error
    console.error('API call failed', response.statusText);
  }
}

export async function fetchIdToken() {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      try {
        const idToken = await getIdToken(user);
        return idToken;
      } catch (error) {
        console.error("Error getting ID token", error);
        return null;
      }
    } else {
      console.log("No authenticated user");
      return null;
    }
  }
