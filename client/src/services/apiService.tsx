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
    return response;
  } else {
    // Handle error
    console.error('API call failed', response.statusText);
  }
}
