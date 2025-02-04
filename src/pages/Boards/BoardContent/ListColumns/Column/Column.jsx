import { useState } from 'react'
import { toast } from 'react-toastify'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddCardIcon from '@mui/icons-material/AddCard'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCards from './ListCards/ListCards'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Column({ column, createNewCard }) {
  // Drag and Drop Column
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column._id,
    data: { ...column },
  })

  const dndKitColumnStyles = {
    // touchAction: 'none', // Prevent scrolling on touch devices dành cho sensor default dạng PointerSensor
    // Nếu sử dụng Css.Transform như docs sẽ bị lỗi kiểu stretch
    // https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform),
    transition,
    // Chiều cao phải luôn max 100% vì nếu không sẽ lỗi lúc kéo column ngắn qua một column dài thì phải kéo
    // ở một khu vực giữa rất khó chịu. Lưu ý lúc này phải kết hợp {...listeners} nằm ở Box
    // chứ không phải ở div cha của Box để không gây ra lỗi
    height: '100%',
    opacity: isDragging ? 0.5 : undefined,
  }

  // Dropdown Menu
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // Sort Cards
  const orderedCards = column.cards

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')
  const addNewCard = () => {
    if (!newCardTitle) {
      toast.error('Please enter Card Title!!!', { position: 'bottom-right' })
      return
    }
    // console.log('new Card title:', newCardTitle)

    // Tao du lieu column de goi API
    const newCardData = {
      title: newCardTitle,
      columnId: column._id,
    }
    // goi API o day
    /**
     * Goi len props function createNewColumn nam o component cha cao nhat (boards/_id.jsx)
     * Ve sau o hoc pham MERN Stack se hoc ve Redux de quan ly state toan bo ung dung
     * va luc nay chung ta co the goi luon API o day la xong thay vi phai lan luot goi nguoc len nhung
     * component cha phia tren 
     * voi viec su dung redux nhu vay thi code se clean va chuan chinh hon rat nhieu
     */
    createNewCard(newCardData)

    // dong trang thai them Card moi & Clear input
    toggleNewCardForm()
    setNewCardTitle('')
  }

  return (
    // Phải bọc div ở đây vì vấn đề chiều cao column khi kéo thả có bug kiểu flickering
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        {...listeners} // lắng nghe khu vực kéo thả
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#333643' : '#ebecf0',
          ml: 2,
          borderRadius: '8px',
          height: 'fit-content',
          maxHeight: (theme) =>
            `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`,
        }}
      >
        {/* Column Header */}
        <Box
          sx={{
            height: (theme) => theme.trello.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant='h6'
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {column?.title}
          </Typography>
          <Box>
            <Tooltip title='More options'>
              <ExpandMoreIcon
                sx={{
                  color: 'text.primary',
                  cursor: 'pointer',
                }}
                id='basic-column-dropdown'
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id='basic-menu-column-dropdown'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown',
              }}
            >
              <MenuItem>
                <ListItemIcon>
                  <AddCardIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize='small' />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize='small' />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize='small' />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <DeleteForeverIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize='small' />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* List Cards */}
        <ListCards cards={orderedCards} />

        {/* Column Footer */}
        <Box
          sx={{
            height: (theme) => theme.trello.columnFooterHeight,
            p: 2,
          }}
        >
          {!openNewCardForm ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Button startIcon={<AddCardIcon />} onClick={toggleNewCardForm}>
                Add new card
              </Button>
              <Tooltip title='Drag to move'>
                <DragHandleIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <TextField
                label='Enter column title...'
                type='text'
                size='small'
                variant='outlined'
                autoFocus
                data-no-dnd='true'
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark' ? '#333643' : 'white',
                  },
                  '& label.Mui-focused': {
                    color: (theme) => theme.palette.primary.main,
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    '&:hover fieldset': {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    '& .MuiOutlinedInput-input': { borderRadius: 1 },
                  },
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  onClick={addNewCard}
                  variant='contained'
                  color='success'
                  size='small'
                  data-no-dnd='true'
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.success.main,
                      // eslint-disable-next-line comma-dangle
                    },
                  }}
                >
                  Add
                </Button>
                <CloseIcon
                  fontSize='small'
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: 'pointer',
                  }}
                  onClick={toggleNewCardForm}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  )
}

export default Column
