import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect, useState } from 'react'
import { fetchBoardDetailAPI } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // tam thoi fix cung, flow chuan chinh ve sau se dung react-router-dom de lay id tu URL ve
    const boardId = '678f798109598cdbc87c97d9'
    // call api de lay data
    fetchBoardDetailAPI(boardId).then((board) => {
      setBoard(board)
    })
  }, [setBoard])
  return (
    <Container
      disableGutters
      maxWidth='false'
      sx={{ height: '100vh', backgroundColor: 'primary.main' }}
    >
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  )
}

export default Board
