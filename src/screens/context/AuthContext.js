import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD TOKEN ON APP START ---------------- */
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setUserToken(token);
        }
      } catch (e) {
        console.log('Error loading token', e);
      }
      setLoading(false);
    };

    loadToken();
  }, []);

  /* ---------------- LOGIN ---------------- */
  const login = async ({token, email, name, userId}) => {
    try {
      setUserToken(token);

      await AsyncStorage.multiSet([
        ['userToken', token],
        ['userEmail', email],
        ['userName', name],
        ['userId', userId],
      ]);
    } catch (e) {
      console.log('Login storage error', e);
    }
  };

  /* ---------------- LOGOUT (REMOVE ALL) ---------------- */
  const logout = async () => {
    try {
      setUserToken(null);

      // OPTION 1 (Recommended): Remove only app-related keys
      await AsyncStorage.multiRemove([
        'userToken',
        'userEmail',
        'userName',
        'userId',
      ]);

      // OPTION 2 (Force clear EVERYTHING) ❗
      // await AsyncStorage.clear();
    } catch (e) {
      console.log('Logout error', e);
    }
  };

  /* ---------------- SIGNUP ---------------- */
  const signup = async ({token, email, name, userId}) => {
    try {
      setUserToken(token);

      await AsyncStorage.multiSet([
        ['userToken', token],
        ['userEmail', email],
        ['userName', name],
        ['userId', userId],
      ]);
    } catch (e) {
      console.log('Signup storage error', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        loading,
        login,
        logout,
        signup,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// import React, {createContext, useState, useEffect} from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const AuthContext = createContext();

// export const AuthProvider = ({children}) => {
//   const [userToken, setUserToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check token on app start
//     const loadToken = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         if (token) setUserToken(token);
//       } catch (e) {
//         console.log('Error loading token', e);
//       }
//       setLoading(false);
//     };
//     loadToken();
//   }, []);

//   const login = async token => {
//     setUserToken(token);
//     await AsyncStorage.setItem('userToken', token);
//   };

//   const logout = async () => {
//     setUserToken(null);
//     await AsyncStorage.removeItem('userToken');
//   };

//   const signup = async token => {
//     setUserToken(token);
//     await AsyncStorage.setItem('userToken', token);
//   };

//   return (
//     <AuthContext.Provider value={{userToken, loading, login, logout, signup}}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
