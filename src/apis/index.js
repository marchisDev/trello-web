import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

// chung ta se khong try catch o day vi se gay ra code khong clean
//  thay vao do chung ta se xu dung 1 thu cuc ki manh me trong axios do la interceptor
// interceptor se giup chung ta xu ly loi o 1 noi duy nhat(interceptor la cach chung ta se danh chan vao giua request
// va response de xu ly logic ma chung ta muon)

// Board
export const fetchBoardDetailAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  //   axios se tra ket qua ve qua property cua no la data
  return response.data
}

// Column
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

// Card
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}
