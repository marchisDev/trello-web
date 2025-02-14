import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect } from 'react'
import {
  updateBoardDetailAPI,
  updateColumnDetailAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailAPI
} from '~/apis'
import { cloneDeep } from 'lodash'
import { toast } from 'react-toastify'
import {
  fetchBoardDetailAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

// import { mockData } from '~/apis/mock-data'

function Board() {
  const dispatch = useDispatch()
  // eslint-disable-next-line no-unused-vars
  // khong dung toi useState vi chung ta se dung Redux de quan ly state cua Board
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)

  const { boardId } = useParams()

  useEffect(() => {
    // call api de lay data
    dispatch(fetchBoardDetailAPI(boardId))
  }, [dispatch, boardId])


  // function nay co nhiem vu goi API va xu li sau khi keo tha column xong xuoi
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
    // Update cho chuan du lieu State Board
    /**
     * TH dung Spread Operator nay thi khong sao boi vi o day chung ta khong dung push nhu o tren lam thay doi
     * truc tiep mang ma chi dang gan lai gia tri cho columns va columnOrderIds bang 2 mang moi, nen khong co van de gi
     * tuong tu nhu cach lam concat() o tren createNewColumn
     */
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

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
    // Tuong tu ham createNewColumn, chung ta se dung toi Deep Copy/Clone de tranh loi object is not extensible
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    )
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))
    // Goi API update Column
    updateColumnDetailAPI(columnId, {
      cardOrderIds: dndOrderedCardIds
    })
  }

  // Xu li xoa 1 column va card ben trong no
  const deleteColumnDetails = (columnId) => {
    // Update cho chuan du lieu State Board
    // Tuong tu doan xu li cua ham moveColumns nen khong anh huong gi toi Redux Toolkit Imutibility
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(
      (column) => column._id !== columnId
    )
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
      (_id) => _id !== columnId
    )
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))
    // Goi API xoa Column
    deleteColumnDetailAPI(columnId).then((res) => {
      toast.success(res?.deleteResult)
    })
  }

  // Khi di chuyen card sang 1 column khac
  // B1: Cap nhat lai mang cardOrderIds cua column ban dau chua no (xoa _id cua card khoi mang)
  // B2: Cap nhat lai mang cardOrderIds cua column chua no (them _id cua card vao cuoi mang)
  // B3: Cap nhat lai truong ColumnId cua card da keo
  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    // Update cho chuan du lieu State Board
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
    // Tuong tu doan xu li cua ham moveColumns nen khong anh huong gi toi Redux Toolkit Imutibility
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // Goi API update Column
    let prevCardOrderIds = dndOrderedColumns.find(
      (c) => c._id === prevColumnId
    )?.cardOrderIds
    if (prevCardOrderIds[0].includes('placeholder-card')) {
      prevCardOrderIds = []
    }
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)
        ?.cardOrderIds
    })
  }

  if (!board) {
    return <PageLoadingSpinner caption='Loading Board...' />
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

        // createNewColumn={createNewColumn}
        // createNewCard={createNewCard}
        deleteColumnDetails={deleteColumnDetails}

        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
