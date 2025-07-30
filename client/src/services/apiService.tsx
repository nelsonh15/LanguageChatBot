import { getAuth, getIdToken, signOut } from 'firebase/auth';

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
    return response;
  }
  else if (response.status === 403) {
    // If token is expired or unauthorized, log out the user
    await signOut(auth); // Ensure you import signOut from Firebase auth
    window.dispatchEvent(new CustomEvent('session-expired'));
    throw new Error('Session expired. Please log in again.');
  }
  else {
    // Handle error
    const errorText = await response.text();
    console.error('API call failed', response.statusText, errorText);
    throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
}
