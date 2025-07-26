import React, { createContext, useContext, useReducer, useEffect } from 'react';

const UserContext = createContext();

function getDefaultDownloadPath() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Mac')) {
    return '/Users/Downloads';
  } else if (userAgent.includes('Windows')) {
    return 'C:\\Users\\Downloads';
  } else {
    return '/home/Downloads';
  }
}

const initialState = {
  trialStartDate: localStorage.getItem('trialStartDate') || new Date().toISOString(),
  trialDaysRemaining: 7,
  isSubscribed: localStorage.getItem('isSubscribed') === 'true',
  subscriptionPlan: localStorage.getItem('subscriptionPlan') || null,
  downloadsToday: parseInt(localStorage.getItem('downloadsToday')) || 0,
  lastDownloadDate: localStorage.getItem('lastDownloadDate') || null,
  showSubscriptionModal: false,
  showTrialExpiredModal: false,
  trialModalDismissed: localStorage.getItem('trialModalDismissed') === 'true',
  selectedPlan: null,
  isDownloading: false,
  downloadProgress: 0,
  saveLocation: localStorage.getItem('saveLocation') || getDefaultDownloadPath(),
  // Authentication state
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  showAuthModal: false,
  authModalType: null // 'login' or 'signup'
};

function userReducer(state, action) {
  console.log('UserReducer action:', action.type, action.payload);
  
  switch (action.type) {
    case 'UPDATE_TRIAL_STATUS':
      return {
        ...state,
        trialDaysRemaining: action.payload
      };
    
    case 'INCREMENT_DOWNLOADS':
      const newCount = state.downloadsToday + 1;
      localStorage.setItem('downloadsToday', newCount.toString());
      localStorage.setItem('lastDownloadDate', new Date().toDateString());
      return {
        ...state,
        downloadsToday: newCount,
        lastDownloadDate: new Date().toDateString()
      };
    
    case 'RESET_DAILY_DOWNLOADS':
      localStorage.setItem('downloadsToday', '0');
      localStorage.setItem('lastDownloadDate', new Date().toDateString());
      return {
        ...state,
        downloadsToday: 0,
        lastDownloadDate: new Date().toDateString()
      };
    
    case 'SUBSCRIBE':
      localStorage.setItem('isSubscribed', 'true');
      localStorage.setItem('subscriptionPlan', action.payload);
      return {
        ...state,
        isSubscribed: true,
        subscriptionPlan: action.payload,
        showSubscriptionModal: false
      };
    
    case 'SHOW_SUBSCRIPTION_MODAL':
      return {
        ...state,
        showSubscriptionModal: true,
        selectedPlan: action.payload
      };
    
    case 'HIDE_SUBSCRIPTION_MODAL':
      return {
        ...state,
        showSubscriptionModal: false,
        selectedPlan: null
      };
    
    case 'SHOW_TRIAL_EXPIRED_MODAL':
      return {
        ...state,
        showTrialExpiredModal: true
      };
    
    case 'HIDE_TRIAL_EXPIRED_MODAL':
      localStorage.setItem('trialModalDismissed', 'true');
      return {
        ...state,
        showTrialExpiredModal: false,
        trialModalDismissed: true
      };
    
    case 'SET_DOWNLOAD_PROGRESS':
      return {
        ...state,
        isDownloading: action.payload.isDownloading,
        downloadProgress: action.payload.progress
      };
    
    case 'SET_SAVE_LOCATION':
      localStorage.setItem('saveLocation', action.payload);
      return {
        ...state,
        saveLocation: action.payload
      };
    
    case 'RESET_TRIAL':
      const newTrialStart = new Date().toISOString();
      localStorage.setItem('trialStartDate', newTrialStart);
      localStorage.removeItem('trialModalDismissed');
      localStorage.removeItem('isSubscribed');
      localStorage.removeItem('subscriptionPlan');
      return {
        ...state,
        trialStartDate: newTrialStart,
        trialDaysRemaining: 7,
        isSubscribed: false,
        subscriptionPlan: null,
        trialModalDismissed: false,
        showTrialExpiredModal: false
      };
    
    case 'EXPIRE_TRIAL':
      const expiredTrialStart = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(); // 8 days ago
      localStorage.setItem('trialStartDate', expiredTrialStart);
      localStorage.removeItem('trialModalDismissed');
      return {
        ...state,
        trialStartDate: expiredTrialStart,
        trialDaysRemaining: 0,
        trialModalDismissed: false,
        showTrialExpiredModal: false
      };

    // Authentication actions
    case 'LOGIN':
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        showAuthModal: false,
        authModalType: null
      };

    case 'LOGOUT':
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        showAuthModal: false,
        authModalType: null
      };

    case 'SHOW_AUTH_MODAL':
      console.log('SHOW_AUTH_MODAL reducer case hit with payload:', action.payload);
      return {
        ...state,
        showAuthModal: true,
        authModalType: action.payload // 'login' or 'signup'
      };

    case 'HIDE_AUTH_MODAL':
      return {
        ...state,
        showAuthModal: false,
        authModalType: null
      };
    
    default:
      return state;
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    // Initialize trial start date if not exists
    if (!localStorage.getItem('trialStartDate')) {
      localStorage.setItem('trialStartDate', state.trialStartDate);
    }

    // Reset daily downloads if new day
    const today = new Date().toDateString();
    if (state.lastDownloadDate !== today) {
      dispatch({ type: 'RESET_DAILY_DOWNLOADS' });
    }

    // Update trial status
    const updateTrialStatus = () => {
      const trialStart = new Date(state.trialStartDate);
      const now = new Date();
      const daysPassed = Math.floor((now - trialStart) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, 7 - daysPassed);
      
      dispatch({ type: 'UPDATE_TRIAL_STATUS', payload: daysRemaining });
      
      // Only show modal if trial expired, user not subscribed, modal not already showing, and not dismissed
      if (daysRemaining <= 0 && !state.isSubscribed && !state.showTrialExpiredModal && !state.trialModalDismissed) {
        dispatch({ type: 'SHOW_TRIAL_EXPIRED_MODAL' });
      }
    };

    updateTrialStatus();
    const interval = setInterval(updateTrialStatus, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [state.trialStartDate, state.lastDownloadDate, state.isSubscribed, state.showTrialExpiredModal, state.trialModalDismissed]);

  const actions = {
    incrementDownloads: () => dispatch({ type: 'INCREMENT_DOWNLOADS' }),
    subscribe: (plan) => dispatch({ type: 'SUBSCRIBE', payload: plan }),
    showSubscriptionModal: (plan) => dispatch({ type: 'SHOW_SUBSCRIPTION_MODAL', payload: plan }),
    hideSubscriptionModal: () => dispatch({ type: 'HIDE_SUBSCRIPTION_MODAL' }),
    showTrialExpiredModal: () => dispatch({ type: 'SHOW_TRIAL_EXPIRED_MODAL' }),
    hideTrialExpiredModal: () => dispatch({ type: 'HIDE_TRIAL_EXPIRED_MODAL' }),
    setDownloadProgress: (isDownloading, progress) => 
      dispatch({ type: 'SET_DOWNLOAD_PROGRESS', payload: { isDownloading, progress } }),
    setSaveLocation: (location) => dispatch({ type: 'SET_SAVE_LOCATION', payload: location }),
    resetTrial: () => dispatch({ type: 'RESET_TRIAL' }),
    expireTrial: () => dispatch({ type: 'EXPIRE_TRIAL' }),
    // Authentication actions
    login: (user) => dispatch({ type: 'LOGIN', payload: user }),
    logout: () => dispatch({ type: 'LOGOUT' }),
    showAuthModal: (type) => {
      console.log('showAuthModal action called with type:', type);
      dispatch({ type: 'SHOW_AUTH_MODAL', payload: type });
    },
    hideAuthModal: () => dispatch({ type: 'HIDE_AUTH_MODAL' })
  };

  return (
    <UserContext.Provider value={{ ...state, ...actions }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}