import { Route, Routes, Navigate, Outlet } from 'react-router-dom'

import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

/**
 * Giai phap Clean Code trong viec xac dinh cac route nao can dang nhap tai khoan xong thi moi cho truy cap
 * Su dung Outlet cua react-router-dom de chay vao cac child route cua no
 * https://www.robinwieruch.de/react-router-private-routes/
 */
const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to='/login' replace={true} />
  }
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      {/* Redirect Route */}
      {/* O day chung ta can replace gia tri true de no thay the route /, co the hieu la route / se khong con nam trong
      history cua Browser
      Thuc hanh de hieu hon bang cach nhan Go Home tu trang 404 xong quay lai bang nut back cua trinh duyet
      giua 2 TH co replace va khong co replace */}
      <Route
        path='/'
        element={<Navigate to='/boards/678f798109598cdbc87c97d9' />}
      />
      {/* Protected Route: Hieu don gian trong du an cua chung ta la nhung route chi cho truy cap sau khi da login */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        {/*<Oultlet /> cua react-router-dom se chay vao cac child route trong nay  */}
        {/* Board Details */}
        <Route path='/boards/:boardId' element={<Board />} />
      </Route>
      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />

      {/* 404 Not Found */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
