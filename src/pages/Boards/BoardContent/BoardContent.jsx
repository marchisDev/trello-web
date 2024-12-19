import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

function BoardContent({ board }) {
  // https://docs.dndkit.com/api-documentation/sensors#usesensor
  // Dung duoc nhung con bug khi keo tren mobile
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: { distance: 10 },
  // })

  // This line of code sets up a pointer sensor that activates when the pointer moves at least 10 pixels.
  // This is useful in scenarios like drag-and-drop interfaces to ensure that slight, unintended movements don't trigger the drag action.
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }
  })

  // Nhấn giữ 250ms và di chuyển/ chênh lệch 5px mới bắt đầu kéo thả để kích hoạt event
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 }
  })

  // const sensors = useSensors(pointerSensor)
  // Ưu tiên sử dụng kết hợp cả 2 loại sensor MouseSensor và TouchSensor để có trải nghiệm modile 1 cách tốt nhất không bị bugbug
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    const orderedColumns = mapOrder(
      board?.columns,
      board?.columnOrderIds,
      '_id'
    )
    setOrderedColumns(orderedColumns)
  }, [board])
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)
    const { active, over } = event

    // Kiểm tra nếu không tồn tại over(kéo ra ngoài board) thì return luôn tránh lỗi
    if (!over) return

    if (active.id !== over.id) {
      // vi tri cu
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id)
      // vi tri moi
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id)

      // Dùng arrayMove để sắp xếp lại mảng Columns ban đầu
      // Code arrayMove: https://github.com/clauderic/dnd-kit/blob/master/packages/sortable/src/utilities/arrayMove.ts
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // Sau dùng để sử lí cập nhật lại vị trí của column trong database
      // const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)

      // Cập nhật lại state columns ban đầu sau khi kéo thả
      setOrderedColumns(dndOrderedColumns)
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          height: (theme) => theme.trello.boardContentHeight,
          width: '100%',
          p: '10px 0'
        }}
      >
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
