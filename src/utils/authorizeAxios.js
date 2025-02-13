import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'

// Khoi tao 1 doi tuong Axios(authorizeAxiosInstance) voi cac cau hinh custom va cau hinh chung cho du an
let authorizeAxiosInstance = axios.create()
// Tgian cho toi da cua 1 request la 10 phut
authorizeAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: true: sex cho phep axios tu dong gui cookie trong moi request le BE(phuc vu viec chung ta
// se luu Jwt tokens (refresh token and access token) vao trong httpOnly cookie cua trinh duyet)
authorizeAxiosInstance.defaults.withCredentials = true

// Cau hinh Interceptors cho Axios(Bo danh chan giua request va response)
// https://axios-http.com/docs/interceptors

// Add a request interceptor: Can thiep vao giua nhung cái Request API
authorizeAxiosInstance.interceptors.request.use(
  (config) => {
    // Ki thuat chan spam click
    interceptorLoadingElements(true)
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor: Can thiep vao giua nhung cái Response API
authorizeAxiosInstance.interceptors.response.use(
  (response) => {
    // Ki thuat chan spam click
    interceptorLoadingElements(false)
    return response
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    //    Moi ma status code nam ngoai khoang 200-299 se la error nen ta se xu ly o day
    // Ki thuat chan spam click
    interceptorLoadingElements(false)
    //   Xu li tap trung phan hien thi thong bao loi tra ve tu moi API o day(viet code 1 lan: Clean Code)
    //   console.log error ra la se thay cau truc data dan toi message loi nhu duoi day
    let errorMessage = error?.message

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }
    //   Dung toast de hien thi loi len man hinh, Ngoai tru ma loi 410 _ GONE phuc vu viec tu dong refresh token
    if (error.response?.status !== 410) {
      toast.error(errorMessage)
    }
    return Promise.reject(error)
  }
)

export default authorizeAxiosInstance
