import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DEFAULT_CUSTOMIZE } from '../constants';
import customizationApi from '../apis/customizationApi.JS';


export const fetchDataCustomize = createAsyncThunk('customize/fetchData', async () => {
  const response = await customizationApi.get();
  return response.data;
});



const initialState = {
    style:  DEFAULT_CUSTOMIZE,
  }
  

const customizeSlice = createSlice({
  name: 'customize',
  initialState,
  reducers: {
    updateCustomize(state, action) {
      const data = {...state.style,...action.payload}
      state.style = data
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDataCustomize.fulfilled, (state, action) => {
      console.log(action.payload)
     
       state.style = action.payload || DEFAULT_CUSTOMIZE
    })
  },
})

export const { updateCustomize } = customizeSlice.actions
export default customizeSlice.reducer