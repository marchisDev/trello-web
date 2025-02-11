import { Route, Routes, Navigate } from 'react-router-dom'

import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'

function App() {
  return (
    <Routes>
      {/* Redirect Route */}
      {/* O day chung ta can replace gia tri true de no thay the route /, co the hieu la route / se khong con nam trong
      history cua Browser
      Thuc hanh de hieu hon bang cach nhan Go Home tu trang 404 xong quay lai bang nut back cua trinh duyet
      giua 2 TH co replace va khong co replace */}
      <Route path='/' element={<Navigate to='/boards/678f798109598cdbc87c97d9' />} />
      {/* Board Details */}
      <Route path='/boards/:boardId' element={<Board />} />

      {/* Authentication */}
      <Route path='/login' element={<Auth/>} />
      <Route path='/register' element={<Auth/>} />

      {/* 404 Not Found */}
      <Route path='*' element={<NotFound/>} />
    </Routes>
  )
}

export default App
