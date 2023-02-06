export function getDates(
  startDate,
  endDate,
  inc = 1,
  showOnlySunday = false
) {
  const dates = []
  let currentDate = startDate
  const addDays = function (days) {
    const date = new Date(this.valueOf())
    date.setDate(date.getDate() + days)
    return date
  }
  while (currentDate <= endDate) {
    const day = currentDate.getDay()
    console.log(day)

    if (showOnlySunday) {
      if (day === 0)
        dates.push(currentDate)
    } else dates.push(currentDate)

    currentDate = addDays.call(currentDate, inc)
  }
  return dates
}
