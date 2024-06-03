import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
  token: '',
  isLoggedIn: false,
  isEmailVerified: false,
  userProfile: null,
  userId: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.token = action.payload;
      state.isLoggedIn = !!state.token;
      localStorage.setItem('token', state.token);
    },
    logout(state) {
      state.token = '';
      state.isLoggedIn = false;
      state.userProfile = null;
      state.isEmailVerified = false;
      state.userId = '';
      localStorage.removeItem('token');
    },
    setUserProfile(state, action) {
      state.userProfile = action.payload;
      state.userId = action.payload.localId;
    },
    setVerificationStatus(state, action) {
      state.isEmailVerified = action.payload;
    },
    setError(state, action) { // Define setError action
      state.error = action.payload;
    },
    setLoading(state, action) { // Define setLoading action
      state.loading = action.payload;
    },
    setUserId(state, action) {
      state.userId = action.payload;
    },
  },
});

export const authActions = authSlice.actions;

export const sendVerificationEmail = async (token, apiKey) => {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
      {
        method: 'POST',
        body: JSON.stringify({
          requestType: 'VERIFY_EMAIL',
          idToken: token,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to send verification email.');
    }

    console.log('Verification email sent successfully.');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

export default authSlice.reducer;
