import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD',
}

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

function BoardContent({ board }) {
  // https://docs.dndkit.com/api-documentation/sensors#usesensor
  // Dung duoc nhung con bug khi keo tren mobile
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: { distance: 10 },
  // })

  // This line of code sets up a pointer sensor that activates when the pointer moves at least 10 pixels.
  // This is useful in scenarios like drag-and-drop interfaces to ensure that slight, unintended movements don't trigger the drag action.
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  })

  // Nhấn giữ 250ms và di chuyển/ chênh lệch 5px mới bắt đầu kéo thả để kích hoạt event
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 },
  })

  // const sensors = useSensors(pointerSensor)
  // Ưu tiên sử dụng kết hợp cả 2 loại sensor MouseSensor và TouchSensor để có trải nghiệm modile 1 cách tốt nhất không bị bugbug
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // cùng 1 thời điểm chỉ có một phần tử đang được kéo (column or card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() => {
    const orderedColumns = mapOrder(
      board?.columns,
      board?.columnOrderIds,
      '_id'
    )
    setOrderedColumns(orderedColumns)
  }, [board])

  const findColumnByCardId = (cardId) => {
    // nen dung c.cards thay vi c.cardOrderIds vi o buoc handleDragOver chung ta se
    // se lam du lieu cho cards hoan chinh truoc roi moi tao cardOrderIds moi.
    return orderedColumns.find((column) =>
      column.cards.map((card) => card._id)?.includes(cardId)
    )
  }

  // Trigger khi bắt đầu kéo thả
  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)

    // console.log('activeDragItemId: ', activeDragItemId)
    // console.log('activeDragItemType: ', activeDragItemType)
    // console.log('activeDragItemData: ', activeDragItemData)
  }

  // Trigger khi kéo thả qua các vùng target
  const handleDragOver = (event) => {
    // không làm gì thêm nếu đang kéo thả column (không cần phải xử lý gì cả)
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // còn nếu kéo card thì xử lí thêm để có thể kéo card qua lại giữa các column
    // console.log('handleDragOver: ', event)
    const { active, over } = event

    // Kiểm tra nếu không tồn tại active hoặc over(kéo ra ngoài board) thì return luôn tránh lỗi
    if (!active || !over) return

    // activeDraggingCardId: là cái card đang được kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active

    // overCardId: là cái card đang tương tác trên hoặc dưới so vs cái card được kéo ở trên
    const { id: overCardId } = over

    // Tìm ColumnID của 2 cái card đang đươc kéo
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // Nếu không tìm thấy Column nào thì return luôn tránh lỗi
    if (!overColumn || !activeColumn) return

    // chi xu li o day khi keo qua 2 cot khac nhau, chung cot thi giu nguyen khong lam gi ca
    // vi day la doan dang xu li luc keo handleDragOver, con xu li luc keo xong xong cuoi
    // thi no la van de o handleDragEnd
    if (overColumn._id !== activeColumn._id) {
      setOrderedColumns((prevColumns) => {
        // tim vi tri index cua cai overCard trong Column đích (noi card sap duoc tha)
        const overCardIndex = overColumn?.cards?.findIndex(
          (card) => card._id === overCardId
        )
        // tinh toan "cardIndex moi" (tren or duoi cua overCard)
        let newCardIndex
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0

        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        // clone rieng mang OderedColumns cu ra mot cai moi de xu li data roi return - cap nhat lai
        // orderedColumns moi
        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

        if (nextActiveColumn) {
          // xoa card o cai column active cu di
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // cap nhat lai cardOrderIds cua activeColumn
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
         }
        
        if (nextOverColumn) {
          // kiem tra xem card dang keo co ton tai o overColumn chua, neu co thi can xoa no truoc di
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

          // them card dang keo vao overColumn
          // splice: sua truc tiep vao cai mang dang xu li con toSpliced: tao ra mot mang moi de lam viec, khong dung gi den mang cu
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)
          // cap nhat lai cardOrderIds cua overColumn
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
         }

        console.log('nextColumns: ', nextColumns)
        return nextColumns
      })
    }
  }

  // Trigger khi kết thúc kéo thả
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log('keo tha card - khong lam gi ca')
      return
    }
    const { active, over } = event

    // Kiểm tra nếu không tồn tại active hoặc over(kéo ra ngoài board) thì return luôn tránh lỗi
    if (!active || !over) return

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

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } },
    }),
  }
  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          height: (theme) => theme.trello.boardContentHeight,
          width: '100%',
          p: '10px 0',
        }}
      >
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
