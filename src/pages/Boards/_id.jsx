import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { useEffect, useState } from 'react'
import {
  fetchBoardDetailAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailAPI,
  updateColumnDetailAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'

// import { mockData } from '~/apis/mock-data'

function Board() {
  // eslint-disable-next-line no-unused-vars
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // tam thoi fix cung, flow chuan chinh ve sau se dung react-router-dom de lay id tu URL ve
    const boardId = '678f798109598cdbc87c97d9'
    // call api de lay data
    fetchBoardDetailAPI(boardId).then((board) => {
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
      // console.log('full board: ', board)
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

  // function nay co nhiem vu goi API va xu li sau khi keo tha column xong xuoi
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)

    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // call API de update lai thu tu column
    updateBoardDetailAPI(newBoard._id, {
      columnOrderIds: newBoard.columnOrderIds
    })
  }

  // Khi di chuyen card trong cung 1 column, ta chi can goi API de cap nhat mang cardOrderIds cua column chua no
  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    // Update cho chuan du lieu State Board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    )
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)
    // Goi API update Column
    updateColumnDetailAPI(columnId, {
      cardOrderIds: dndOrderedCardIds
    })
  }

  // Khi di chuyen card sang 1 column khac
  // B1: Cap nhat lai mang cardOrderIds cua column ban dau chua no (xoa _id cua card khoi mang)
  // B2: Cap nhat lai mang cardOrderIds cua column chua no (them _id cua card vao cuoi mang)
  // B3: Cap nhat lai truong ColumnId cua card da keo
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // Update cho chuan du lieu State Board
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Goi API update Column
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds: dndOrderedColumns.find((c) => c._id === prevColumnId)?.cardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, width: '100vw', height: '100vh' }}>
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    )
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
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
