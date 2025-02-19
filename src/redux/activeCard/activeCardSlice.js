import { createSlice } from '@reduxjs/toolkit'

// Khoi tao gia tri cua 1 Slice trong redux
const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false
}

const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  // Reuducers la noi xu li du lieu dong bo
  reducers: {
    // Luu y luon la o day can cap ngoac nhon cho function trong reducers cho
    // du code ben trong chi co 1 dong, day la rule cua redux
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true
    },

    // Clear data va dong modal active card
    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null,
      state.isShowModalActiveCard = false
    },

    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload //action.payload la chuan dat ten nhan du lieu vao reducer,
      // o day chung ta gan cho no ra mot bien co nghia hon
      // Xu li du lieu neu can thiet

      // Update lai du lieu cho currentActiveCard trong redux
      state.currentActiveCard = fullCard
    }
  },
  // Extra Reducers: Noi xu li cac du lieu dong bo
  // eslint-disable-next-line no-unused-vars
  extraReducers: (builder) => {}
})

// Action creators are generated for each case reducer function
// Actions: La noi danh cho cac components ben duoi goi bang dispatch() toi no de cap nhat lai du lieu
// thong qua cac reducers(chay dong bo)
// De y o tren thi khong thay properties actions dau ca, boi vi nhung cai actions nay don gian la duoc thang
// redux toolkit tu dong tao ra cho chung ta
export const { clearAndHideCurrentActiveCard, updateCurrentActiveCard, showModalActiveCard } = activeCardSlice.actions

// Selectors la noi danh cho cac component ben duoi goi bang useSelector() de lay du lieu tu trong kho redux store ra su dung
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard
}

// Cai file nay ten la activeCardSlice.js, nhung khi export chung ta se export ra mot thu ten la Reducer
export const activeCardReducer = activeCardSlice.reducer
