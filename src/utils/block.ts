import { format } from "date-fns"
import { getDates } from "./date"
import { removeSpaces } from "../string"

export function interpretBlocked(data: any) {
  const intepretation = data.map((user: any) => {
    const userName = user.name.split(" ")[0]

    const info = {
      name: userName,
    } as any

    if (user.blocked) {
      user.blocked.forEach((date: any) => {
        const startDate = new Date(date.start)
        const endDate = new Date(date.end)

        const sameDate =
          startDate.getTime() === endDate.getTime()

        if (!sameDate) {
          const populatedDatesInRange = getDates(
            startDate,
            endDate
          )

          populatedDatesInRange.forEach((eachDate) => {
            const key = removeSpaces(
              format(new Date(eachDate), "LLL do")
            )
            info[key] = userName
            info[eachDate.getTime()] = userName
          })
        } else {
          const key = removeSpaces(
            format(new Date(startDate), "LLL do")
          )
          info[key] = userName
          info[startDate.getTime()] = userName
        }
      })
    }

    return info
  })

  return intepretation
}
