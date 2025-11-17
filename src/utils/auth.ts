export const getToken = () => {
  return localStorage.getItem("token");
};

export const getAuthenticatedUserFromStorage = () => {
  const userJson = localStorage.getItem("authenticatedUser");
  if (userJson) {
    return JSON.parse(userJson);
  }
  return null;
}

export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    const now = Date.now() / 1000;
    return payload.exp > now;
  } catch {
    return false;
  }
};