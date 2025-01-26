import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect, useState } from 'react'
import {
  fetchBoardDetailAPI,
  createNewColumnAPI,
  createNewCardAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
// import { mockData } from '~/apis/mock-data'

function Board() {
  // eslint-disable-next-line no-unused-vars
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // tam thoi fix cung, flow chuan chinh ve sau se dung react-router-dom de lay id tu URL ve
    const boardId = '678f798109598cdbc87c97d9'
    // call api de lay data
    fetchBoardDetailAPI(boardId).then((board) => {
      //khi F5 trang web can xu li van de keo tha mot column rong
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
      })
      // console.log('board: ', board)
      setBoard(board)
    })
  }, [setBoard])

  // function nay co nhiem vu goi API tao moi Column va lam moi lai du lieu State Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // khi tao column moi se chua co card, can xu li van de keo tha vao mot column rong (vid37)
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // cap nhat lai state board
    // Phia FE chung ta phia tu lam dung lai state databoard (thay vi goi lai api
    // fetchBoardDetailAPI(boardId) de lay lai du lieu moi nhat)
    // Luu y: cach lam nay phu thuoc vao tuy lua chon va dac thu cua du an, cp noi thi BE se ho tro tra ve
    // luon toan bo Board du day co la api tao COlumn hay Card di chang nua => Fe nhan hon
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  // function nay co nhiem vu goi API tao moi Card va lam moi lai du lieu State Board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // console.log('createdCard: ', createdCard)

    // cap nhat lai state board
    // Phia FE chung ta phia tu lam dung lai state databoard (thay vi goi lai api
    // fetchBoardDetailAPI(boardId) de lay lai du lieu moi nhat)
    // Luu y: cach lam nay phu thuoc vao tuy lua chon va dac thu cua du an, cp noi thi BE se ho tro tra ve
    // luon toan bo Board du day co la api tao COlumn hay Card di chang nua => Fe nhan hon
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === createdCard.columnId
    )
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  }

  return (
    <Container
      disableGutters
      maxWidth='false'
      sx={{ height: '100vh', backgroundColor: 'primary.main' }}
    >
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container>
  )
}

export default Board
