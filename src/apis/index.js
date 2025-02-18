import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'

// chung ta se khong try catch o day vi se gay ra code khong clean
//  thay vao do chung ta se xu dung 1 thu cuc ki manh me trong axios do la interceptor
// interceptor se giup chung ta xu ly loi o 1 noi duy nhat(interceptor la cach chung ta se danh chan vao giua request
// va response de xu ly logic ma chung ta muon)

// Board
// export const fetchBoardDetailAPI = async (boardId) => {
//   const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
//   //   axios se tra ket qua ve qua property cua no la data
//   return response.data
// }

export const updateBoardDetailAPI = async (boardId, updateData) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData
  )
  //   axios se tra ket qua ve qua property cua no la data
  return response.data
}

// Column
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/columns`,
    newColumnData
  )
  return response.data
}

export const updateColumnDetailAPI = async (columnId, updateData) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData
  )
  return response.data
}

export const deleteColumnDetailAPI = async (columnId) => {
  const response = await authorizeAxiosInstance.delete(
    `${API_ROOT}/v1/columns/${columnId}`
  )
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/boards/supports/moving_card`,
    updateData
  )
  //   axios se tra ket qua ve qua property cua no la data
  return response.data
}

// Card
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/cards`,
    newCardData
  )
  return response.data
}

export const registerUserAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/users/register`,
    data
  )
  toast.success(
    'Account created successfully! Please check and verify your email to login!',
    { theme: 'colored' }
  )
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/users/verify`,
    data
  )
  toast.success(
    'Account verified successfully! Now you can login to enjoy our services',
    { theme: 'colored' }
  )
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/users/refresh_token`
  )
  return response.data
}

export const fetchBoardsAPI = async (searchPage) => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/boards${searchPage}`
  )
  return response.data
}
