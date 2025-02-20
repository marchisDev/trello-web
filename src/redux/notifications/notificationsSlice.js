import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// Khoi tao gtri 1 slice trong redux
const initialState = {
  currentNotifications: null
}

export const fetchInvitationsAPI = createAsyncThunk(
  'notifications/fetchInvitationsAPI',
  async () => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/invitations`)
    return response.data
  }
)

export const updateBoardInvitationAPI = createAsyncThunk(
  'notifications/updateBoardInvitationAPI',
  async ({ status, invitationId }) => {
    const response = await authorizeAxiosInstance.put(
      `${API_ROOT}/v1/invitations/board/${invitationId}`,
      { status }
    )
    return response.data
  }
)

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  // Reducers la noi xu li du lieu dong bo
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload
    },
    // them moi mot cai ban ghi notification vao dau mang currentNotifications
    addNotification: (state, action) => {
      const incomingInvitation = action.payload
      // unshift() method adds new items to the beginning of an array, and returns the new length
      state.currentNotifications.unshift(incomingInvitation)
    }
  },

  // Extra reducers la noi xu li du lieu bat dong bo
  extraReducers: (builder) => {
    builder.addCase(fetchInvitationsAPI.fulfilled, (state, action) => {
      let incomingInvitations = action.payload
      state.currentNotifications = Array.isArray(incomingInvitations)
        ? incomingInvitations.reverse()
        : []
    })
    builder.addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
      const incomingInvitation = action.payload
      //   Cap nhat lai du lieu boardInvitation (ben trong no se co status moi sau khi update)
      const getInvitation = state.currentNotifications.find(
        (i) => i._id === incomingInvitation._id
      )
      getInvitation.boardInvitation = incomingInvitation.boardInvitation
    })
  }
})

// Action creators are generated for each case reducer function
// Actions: La noi danh cho cac components ben duoi goi bang dispatch() toi no de cap nhat lai du lieu
// thong qua cac reducers(chay dong bo)
// De y o tren thi khong thay properties actions dau ca, boi vi nhung cai actions nay don gian la duoc thang
// redux toolkit tu dong tao ra cho chung ta

export const {
  clearCurrentNotifications,
  updateCurrentNotifications,
  addNotification
} = notificationsSlice.actions

// Selectors la noi danh cho cac component ben duoi goi bang useSelector() de lay du lieu tu trong kho redux store ra su dung
export const selectCurrentNotifications = (state) => {
  return state.notifications.currentNotifications
}

// Cai file nay ten la activeCardSlice.js, nhung khi export chung ta se export ra mot thu ten la Reducer
export const notificationsReducer = notificationsSlice.reducer
