import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { mapOrder } from '~/utils/sorts'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

// Khoi tao gia tri ban dau cua state cua slice trong redux
const initialState = {
  currentActiveBoard: null
}

// Cac hanh dong goi api(bat dong bo) va cap nhat du lieu vao Redux, se dung Midleware createAsyncThunk
// di kem voi extraReducers
// https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchBoardDetailAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailAPI',
  async (boardId) => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    //   axios se tra ket qua ve qua property cua no la data
    return response.data
  }
)

// Khoi tao 1 slice trong kho luu tru redux
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers: Noi xu li cac du lieu dong bo
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // action.payload la chuan dat ten nhan du lieu vao reducer. o day chung ta gan no ra mot bien co nghia hon
      const board = action.payload

      //   Xu li du lieu neu can thiet

      //   Update lai du lieu cua currentActiveBoard
      state.currentActiveBoard = board
    }
  },
  // ExtraReducers: Noi xu li cac du lieu bat dong bo
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailAPI.fulfilled, (state, action) => {
      //   action.payload la response.data tra ve o tren ham createAsyncThunk
      let board = action.payload

      // Sap xep thu tu cac column o day truowc khi dua du lieu xuong duoi cac component con
      board.columns = mapOrder(board?.columns, board?.columnOrderIds, '_id')

      board.columns.forEach((column) => {
        //khi F5 trang web can xu li van de keo tha mot column rong
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // Sap xep thu tu cac column o day truowc khi dua du lieu xuong duoi cac component con (vic71)
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      //   Update lai du lieu cua currentActiveBoard
      state.currentActiveBoard = board
    })
  }
})

// Action la noi danh cho cac component ben duoi goi bang dispatch() toi no de CAP NHAT LAI DU LIEU
// thong qua cac reducers(chay dong bo)
// De y o tren thi khong thay properties action dau c boi vi nhung cai actions nay don gian la duoc
// redux toolkit tu dong tao ra tu cac reducers
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// Selectors la noi danh cho cac component ben duoi goi bang useSelector() de lay du lieu tu state
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// export default activeBoardSlice.reducer

export const activeBoardReducer = activeBoardSlice.reducer
