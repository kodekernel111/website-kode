import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/auth/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Try to get error message from backend
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.access_token); // Persist token
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user)); // Persist user info
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            // userData should contain: name, email, password, role(optional)
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                let errorMessage = 'Registration failed';
                try {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                    } else {
                        const errorText = await response.text();
                        errorMessage = errorText || response.statusText;
                    }
                } catch (e) {
                    errorMessage = response.statusText || 'Registration failed';
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

const getUserFromStorage = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        return null;
    }
};

const getInitialState = () => {
    const token = localStorage.getItem('token');
    const user = getUserFromStorage();
    let isAuthenticated = !!token;

    if (token) {
        const decoded = decodeToken(token);
        const currentTime = Date.now() / 1000;
        if (decoded && decoded.exp && decoded.exp < currentTime) {
            isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
        }
    }

    return {
        token: isAuthenticated ? token : null,
        isAuthenticated,
        user: isAuthenticated ? user : null,
        loading: false,
        error: null,
    };
};

const initialState = getInitialState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            if (user) {
                state.user = user;
                localStorage.setItem('user', JSON.stringify(user));
            }
            if (token) {
                state.token = token;
                state.isAuthenticated = true;
                localStorage.setItem('token', token);
            }
        },
        logout: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn'); // maintain compatibility if used elsewhere
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.access_token;
                state.isAuthenticated = true;
                state.user = action.payload.user; // Get user from payload
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Register
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.access_token;
                state.isAuthenticated = true;
                state.user = action.payload.user; // Get user from payload
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
