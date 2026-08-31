import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';

// Thunk to fetch user data
export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (_, thunkAPI) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await api.get(`/doctorPanel/viewById/${userId}`);

      return response?.data?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// Thunk to update user profile
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (formData, thunkAPI) => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      const response = await api.put(
        `/doctorPanel/doctor-edit/${userId}`,
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}},
      );

      return response?.data?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

// export const updateProfile = createAsyncThunk(
//   'user/updateProfile',
//   async (formData, thunkAPI) => {
//     try {
//       const userId = await AsyncStorage.getItem('userId');
//       const response = await api.put(
//         `/doctorPanel/doctor-edit/${userId}`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         },
//       );

//       return response?.data?.message;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response ? error.response.data : error.message,
//       );
//     }
//   },
// );

const userSlice = createSlice({
  name: 'user',
  initialState: {
    image: null,
    address: [''],
    fullname: '',
    email: '',
    date: '',
    city: '',
    mobileNumber: '',
    docCategory: '',
    experience: '',
    aboutMe: '',
    education: '',
    specialization: '',
    affiliations: '',
    researchAndPublications: '',
    hospital: '',
    personalVisitFee: '',
    ratePerMinChatFee: '',
    ratePerMinVoiceFee: '',
    ratePerMinVideoCallFee: '',
    error: null,
    status: 'idle',
  },
  reducers: {
    setField: (state, action) => {
      state[action.payload.field] = action.payload.value;
    },
    addAddress: (state, action) => {
      state.address.push(action.payload); // Add new address to the array
    },
    removeAddress: (state, action) => {
      state.address = state.address.filter(
        (address, index) => index !== action.payload,
      ); // Remove address by index
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserData.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        const userData = action.payload;
        // populate state with user data
        state.address = userData.address || state.address;
        state.image = userData.image || state.image;
        state.fullname = userData.fullname || state.fullname;
        state.email = userData.email || state.email;
        state.city = userData.city || state.city;
        state.mobileNumber = userData.mobileNumber || state.mobileNumber;
        state.experience = userData.experience || state.experience;
        state.docCategory = userData.category || userData.docCategory || state.docCategory;
        state.affiliations = userData.affiliations || state.affiliations;
        state.education = userData.education || state.education;
        state.hospital = userData.hospital || state.hospital;
        state.personalVisitFee = userData.personalVisitFee
          ? Number(userData.personalVisitFee)
          : state.personalVisitFee;
        state.ratePerMinChatFee = userData.ratePerMinChatFee
          ? Number(userData.ratePerMinChatFee)
          : state.ratePerMinChatFee;

        state.ratePerMinVoiceFee =
          userData.ratePerMinVoiceFee || state.ratePerMinVoiceFee;
        state.ratePerMinVideoCallFee =
          userData.ratePerMinVideoCallFee || state.ratePerMinVideoCallFee;
        state.researchAndPublications =
          userData.researchAndPublications || state.researchAndPublications;
        state.specialization = userData.specialization || state.specialization;
        state.aboutMe = userData.aboutMe || state.aboutMe;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateProfile.fulfilled, state => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';

        const payload = action.payload;

        state.error =
          typeof payload === 'string'
            ? payload
            : payload?.error || payload?.message || 'Something went wrong';
      });
  },
});

export const {setField, addAddress, removeAddress} = userSlice.actions;

export default userSlice.reducer;
