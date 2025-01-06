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
  closestCorners,
  pointerWithin,
  // rectIntersection,
  getFirstCollision,
  // closestCenter,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

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
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null)

  // diem va cham cuoi cung (xu li thuat toan phat hien va cham vid#37)
  const lastOverId = useRef(null)

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

  // Function chung xi li viec cap nhat lai state trong truong hop di chuyrn card giua ca Column khac nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
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

      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1

      // clone rieng mang OderedColumns cu ra mot cai moi de xu li data roi return - cap nhat lai
      // orderedColumns moi
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      )
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      )

      if (nextActiveColumn) {
        // xoa card o cai column active cu di
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        )

        // them placeholder card neu nhu coluumn rong: bi keo het card di, khong con cai nao nua
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        // cap nhat lai cardOrderIds cua activeColumn
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        )
      }

      if (nextOverColumn) {
        // kiem tra xem card dang keo co ton tai o overColumn chua, neu co thi can xoa no truoc di
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        )

        // Phai cap nhat lai chuan du lieu column trong card sau khi keo card giua 2 column khac nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id,
        }

        // them card dang keo vao overColumn
        // splice: sua truc tiep vao cai mang dang xu li con toSpliced: tao ra mot mang moi de lam viec, khong dung gi den mang cu
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        )
        // xoa card placeholder neu nhu no dang ton tai
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)
        // cap nhat lai cardOrderIds cua overColumn
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        )
      }
      console.log('nextColumns: ', nextColumns)
      return nextColumns
    })
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

    // neu la hanh dong keo card thi se luu lai column cu cua card do
    if (event?.active?.data?.current?.columnId) {
      // nếu là kéo card thì mới thực hiện
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
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
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  // Trigger khi kết thúc kéo thả
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)
    const { active, over } = event

    // Kiểm tra nếu không tồn tại active hoặc over(kéo ra ngoài board) thì return luôn tránh lỗi
    if (!active || !over) return

    // Xu li li keo tha card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
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
      // phai dung toi activeDragItemData._id hoac oldColumnWhenDraggingCard._id (set vao state tu buoc handleDragStart())
      // chu khong phai activeData trong scope handleDragEnd nay vi sau khi di qua onDragOver thi activeData se bi reset lai
      // nen phai dung toi state da set truoc do moi dung
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // keo tha card trong cung 1 column

        // vi tri cu(lay tu oldColumnWhenDraggingCard)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === activeDragItemId
        )
        // vi tri moi
        const newCardIndex = overColumn?.cards?.findIndex(
          (c) => c._id === overCardId
        )

        // Dung arrayMove vi keo card trong 1 column thi logic no cung tuong tu nhu keo 1 column trong boardContent
        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        )

        setOrderedColumns((prevColumns) => {
          // clone rieng mang OderedColumns cu ra mot cai moi de xu li data roi return - cap nhat lai
          // orderedColumns moi
          const nextColumns = cloneDeep(prevColumns)

          // tim toi column ma ta dang tha
          const targetColumn = nextColumns.find(
            (coloumn) => coloumn._id === overColumn._id
          )
          // cap nhat lai card va cardOrderIds cua column ma ta target
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id)

          // tra ve mang columns moi
          return nextColumns
        })
      }
    }

    // Xu li li keo tha column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        // vi tri cu
        const oldColumnIndex = orderedColumns.findIndex(
          (c) => c._id === active.id
        )
        // vi tri moi
        const newColumnIndex = orderedColumns.findIndex(
          (c) => c._id === over.id
        )

        // Dùng arrayMove để sắp xếp lại mảng Columns ban đầu
        // Code arrayMove: https://github.com/clauderic/dnd-kit/blob/master/packages/sortable/src/utilities/arrayMove.ts
        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        )
        // Sau dùng để sử lí cập nhật lại vị trí của column trong database
        // const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)

        // Cập nhật lại state columns ban đầu sau khi kéo thả
        setOrderedColumns(dndOrderedColumns)
      }
    }

    // nhung du lieu sau khi keo tha xong thi luon can reset lai
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } },
    }),
  }

  // args: tham so, doi so
  const collisionDetectionStrategy = useCallback(
    (args) => {
      // neu la hanh dong keo column thi se dung thuat toan closetCorners
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }

      // tim cac diem va cham, giao nhau - intersection vs con tro
      const pointerIntersection = pointerWithin(args)
      // keo 1 card lon co image cover lon va keo len phia tren cung ra khoi khu vuc keo tha
      if (!pointerIntersection?.length) return

      // // thuat toan phat hien va cham se tra ve mot mang cac va cham o day
      // const intersection = !!pointerIntersection?.length
      //   ? pointerIntersection
      //   : rectIntersection(args)

      // tim overId dau tien trong dam pointerIntersection o tren
      let overId = getFirstCollision(pointerIntersection, 'id')
      if (overId) {
        // neu cai over no la mot column thi se tim toi cai cardId gan nhat ben trong khu vuc va cham do dua
        // vao thuat toan phat hien va cham closestCorners hoac closestCenter deu duoc. Tuy nhien o day
        // dung closestCorners se muot ma hon.

        const checkColumn = orderedColumns.find(
          (column) => column._id === overId
        )
        if (checkColumn) {
          // console.log('overId before: ', overId)
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container.id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id)
                )
              }
            ),
          })[0]?.id
          // console.log('overId after: ', overId)
        }
        lastOverId.current = overId
        return [{ id: overId }]
      }

      // neu overId khong ton tai thi se tra ve mang rong
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderedColumns]
  )
  return (
    <DndContext
      // cam bien da giai thich o #vd30
      sensors={sensors}
      // Thuat toan phat hien va cham giua cac element(neu khong co no thi card vs cover lon se khong keo qua duoc vi
      // luc nay no dang bi conflict giua card va column), chung ta se dung closetConner thay vi closestCenter
      // collisionDetection={closestCorners}

      // tu custom lai collisionDetectionStrategy de xu li keo tha card giua cac column(vid #37)
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          height: (theme) => theme.trello.boardContentHeight,
          width: '100%',
          // eslint-disable-next-line comma-dangle
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
