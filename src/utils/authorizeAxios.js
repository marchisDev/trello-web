import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

/**
 * Khong the import { store } from '~/redux/store o day
 * Giai phap: Inject store: la ki thuat khi can su dung bien redux store o cac file ngoai pham vi component
 * nhu file authorizedAxios hien tai
 * Hieu don gian khi ung dung bat dau chay len code se vao main.jsx dau tien tu do chung ta se goi ham injectStore ngay
 * lap tuc de gan bien mainStore vao trong bien axiosReduxStore cuc bo trong file nay
 * https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
 */

let axiosReduxStore = null

export const injectStore = mainStore => { axiosReduxStore = mainStore }

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

// Khoi tao mot cai promise cho viec goi api refresh token
// Muc dich khoi tao promise nay la de khi nao goi api refresh_token xong xuoi thi moi retry lai nhieu apt bi loi truoc do
// https://www.thedutchlab.com/en/insights/using-axios-interceptors-for-refreshing-your-api-token
let refreshTokenPromise = null

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

    /** Quan trong: Xu li Refresh Token tu dong */
    // TH1: Neu nhu nhan ma loi 401 tu BE thi goi api dang xuat luon
    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false))
    }
    // TH2: Neu nhu nhan ma loi 410 _ GONE tu BE thi goi api refresh token de lam moi access token
    // Dau tien lay duoc cac request API dang bi loi thong qua error.config
    const originalRequests = error.config
    // console.log('originalRequests', originalRequests)
    if (error.response?.status === 410 && !originalRequests._retry) {
      // Gan them 1 gia tri _retry luon bang true trong khoang thoi gian cho, dam bao viec refresh token nay
      // chi luon goi 1 lan tai 1 thoi diem (nhin lai dieu kien if ngay phia tren)
      originalRequests._retry = true

      // Kiem tra xem neu chua co refreshTokenPromise thi thuc hien viec goi api refresh_token dong thoi
      // gan vao cho cai refreshTokenPromise
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then(data => {
            // dong thoi accessToken da nam trong httpOnly cookie cua trinh duyet (xu li tu phia BE)
            return data?.accessToken
          })
          .catch((_error) => {
            // neu co bat ki loi nao tu api refresh token thi logout luon
            axiosReduxStore.dispatch(logoutUserAPI(false))
            // tranh mot loi bi goi API 2 lan
            return Promise.reject(_error)
          })
          .finally(() => {
          // Du API co ok hay loi thi van luon gan lai cai refreshTokenPromise bang null
            refreshTokenPromise = null
          })
      }

      // can return TH refreshToken chay thanh cong xa xu li them o day:
      // eslint-disable-next-line no-unused-vars
      return refreshTokenPromise.then((accessToken) => {
        /**
         * Buoc 1: Doi voi TH neu du an can luu accessToken vao localStorage hoac dau do thi se viet them code xu li vao day
         * Htai o day khong can buoc 1 nay vi chung ta da dua accessToken vao trong httpOnly cookie (xu li tu phia BE) sau khi
         * api refresh_token chay thanh cong
         */

        // Buoc 2: Buoc QUAN TRONG: Return lai axios instance cua chung ta ket hop voi cac originalRequests
        // de goi lai nhung api ban dau bi loi
        return authorizeAxiosInstance(originalRequests)
      })
    }

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
