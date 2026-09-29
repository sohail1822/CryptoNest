import { LEGACY_AUTH_KEYS, STORAGE_KEYS } from '../../../shared/constants/storage';

const storage = () => window.localStorage;

const normalizeUser = (data = {}) => ({
  userId: String(data.userId || data._id || '').replace(/["']/g, ''),
  email: data.email || '',
  firstName: data.firstName || data.first_name || '',
  lastName: data.lastName || data.last_name || '',
  subscription: data.subscription || 'basic',
});

const removeLegacyAuth = () => {
  LEGACY_AUTH_KEYS.forEach((key) => storage().removeItem(key));
};

const readLegacySession = () => {
  const token = storage().getItem('token');
  if (!token) return null;

  return {
    token,
    user: normalizeUser({
      userId: storage().getItem('userId'),
      email: storage().getItem('email'),
      firstName: storage().getItem('firstName') || storage().getItem('first_name'),
      lastName: storage().getItem('lastName') || storage().getItem('last_name'),
      subscription: storage().getItem('subscription'),
    }),
  };
};

export const getAuthSession = () => {
  try {
    const saved = storage().getItem(STORAGE_KEYS.auth);
    if (saved) {
      const session = JSON.parse(saved);
      if (session?.token) {
        return { token: session.token, user: normalizeUser(session.user) };
      }
    }

    const legacySession = readLegacySession();
    if (legacySession) {
      storage().setItem(STORAGE_KEYS.auth, JSON.stringify(legacySession));
      removeLegacyAuth();
      return legacySession;
    }
  } catch {
    storage().removeItem(STORAGE_KEYS.auth);
  }

  removeLegacyAuth();
  return null;
};

export const saveAuthSession = (data, currentSession = getAuthSession()) => {
  const token = data.token || currentSession?.token;
  if (!token) return null;

  const session = {
    token,
    user: normalizeUser({ ...currentSession?.user, ...data }),
  };

  storage().setItem(STORAGE_KEYS.auth, JSON.stringify(session));
  removeLegacyAuth();
  return session;
};

export const clearAuthSession = () => {
  storage().removeItem(STORAGE_KEYS.auth);
  removeLegacyAuth();
};

export const getAccessToken = () => getAuthSession()?.token || null;
