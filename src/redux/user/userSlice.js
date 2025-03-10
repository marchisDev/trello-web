import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// Khoi tao gia tri ban dau cua state cua slice trong redux
const initialState = {
  currentUser: null
}

// Cac hanh dong goi api(bat dong bo) va cap nhat du lieu vao Redux, se dung Midleware createAsyncThunk
// di kem voi extraReducers
// https://redux-toolkit.js.org/api/createAsyncThunk
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    //   axios se tra ket qua ve qua property cua no la data
    return response.data
  }
)

export const updateUserAPI = createAsyncThunk(
  'user/updateUserAPI',
  async (data) => {
    const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/users/update`, data)
    //   axios se tra ket qua ve qua property cua no la data
    return response.data
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    if (showSuccessMessage) {
      toast.success('Logout successfully!')
    }
    //   axios se tra ket qua ve qua property cua no la data
    return response.data
  }
)

// Khoi tao 1 slice trong kho luu tru redux
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // Reducers: Noi xu li cac du lieu dong bo
  reducers: {},
  // ExtraReducers: Noi xu li cac du lieu bat dong bo
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      //   action.payload la response.data tra ve o tren ham createAsyncThunk
      const user = action.payload
      //   Update lai du lieu cua currentUser
      state.currentUser = user
    })

    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      // API logout sau khi goi thanh cong thi se clear thong tin tai currentUser ve null tai day
      // Ket hop voi ProtectedRoute de redirect ve trang login
      state.currentUser = null
    })

    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
  }
})

// Action la noi danh cho cac component ben duoi goi bang dispatch() toi no de CAP NHAT LAI DU LIEU
// thong qua cac reducers(chay dong bo)
// De y o tren thi khong thay properties action dau c boi vi nhung cai actions nay don gian la duoc
// redux toolkit tu dong tao ra tu cac reducers

// export const {} = userSlice.actions

// Selectors la noi danh cho cac component ben duoi goi bang useSelector() de lay du lieu tu state
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer
