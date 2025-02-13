import { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import {
  SortableContext,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable'
import {
  createNewColumnAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { cloneDeep } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'

function ListColumns({ columns }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Please enter Column Title!!!')
      return
    }
    // Tao du lieu column de goi API
    const newColumnData = {
      title: newColumnTitle
    }
    // goi API o day

    // function nay co nhiem vu goi API tao moi Column va lam moi lai du lieu State Board
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

    /**
     * Doan nay se dinh loi object is not extensible boi vi du da copy/clone ra gia tri newBoard nhung ban chat
     * cua spread operator la shallow copy, no chi copy ra 1 level, con cac level sau no chi tro den dia chi cua gia tri
     * cua newBoard, nen khong the goi lai API de tao column moi voi gia tri cua newBoard ne dinh phai rule Imutability trong Redux
     * Toolkit khong dung duoc ham PUSH (sua gia tri truc tiep), cach don gian nhat o trong Th nay la chung ta se dung toi
     * Deep Copy/Clone toan bo Board cho de hieu va de copy (B2)
     */
    // Shallow Copy
    // const newBoard = { ...board }
    // Deep Copy
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    /**
     * Ngoai ra con mot cach nua la van co the dung array.concat() thay cho push() nhu docs cua Reduc Toolkit o tren vi
     * push nhu da noi se thay doi gia tri mang truc tiep, con thang concat() thi no merge - ghep mang lai va tao ra mot
     * mang moi de chung ta gan lai gia tri nen khong van de gi
     */
    // const newBoard = { ...board }
    // newBoard.columns = newBoard.columns.concat(createdColumn)
    // newBoard.columnOrderIds = newBoard.columnOrderIds.concat(createdColumn._id)
    // Cap nhat du lieu Board vao trong Redux Store
    dispatch(updateCurrentActiveBoard(newBoard))


    // dong trang thai them column moi & Clear input
    toggleNewColumnForm()
    setNewColumnTitle('')
  }

  // SortableContext yêu cầu items là một mảng dạng ['id_1', 'id_2', ...] chứ không phải là mảng object [{_id: 'id_1', ...}, {_id: 'id_2', ...}, ...]
  // Nên cần chuyển đổi từ mảng object sang mảng id
  // Nếu không đúng thì vẫn kéo thả được nhưng không có hiệu ứng animation
  // https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
  return (
    <SortableContext
      items={columns?.map((c) => c._id)}
      strategy={horizontalListSortingStrategy}
    >
      <Box
        sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': { m: 2 }
        }}
      >
        {columns?.map((column) => (
          <Column
            key={column._id}
            column={column}
          />
        ))}

        {/* Box add new column */}
        {!openNewColumnForm ? (
          <Box
            onClick={toggleNewColumnForm}
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d'
            }}
          >
            <Button
              startIcon={<NoteAddIcon />}
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
            >
              Add new column
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <TextField
              label='Enter column title...'
              type='text'
              size='small'
              variant='outlined'
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white'
                  },
                  '&:hover fieldset': {
                    borderColor: 'white'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white'
                  }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                className='interceptor-loading'
                onClick={addNewColumn}
                variant='contained'
                color='success'
                size='small'
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                }}
              >
                Add Column
              </Button>
              <CloseIcon
                fontSize='small'
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': {
                    color: (theme) => theme.palette.warning.light
                  }
                }}
                onClick={toggleNewColumnForm}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  )
}

export default ListColumns
