export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

// VID37
// Ham generatePlaceholderCard se tao ra mot card placeholder khong lien quan den BE
// Card dac biet nay se duoc an o giao dien UI nguoi dung

export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}
