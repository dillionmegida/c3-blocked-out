import { useEffect, useState } from "react"
import styled from "styled-components"

import { interpretBlocked } from "./utils/block"
import { getDates } from "./utils/date"
import { format } from "date-fns"
import { removeSpaces } from "./string"
import queryString from "query-string"
import { isJsonString } from "./utils/json"
import DateRange from "./components/DateRange"
import Table from "./components/Table"

const Container = styled.div`
  .error {
    padding: 20px;
    font-weight: bold;
    font-size: 30px;
    color: red;
    text-align: center;
  }
`

const Styles = styled.div`
  padding: 1rem;

  .th {
    background-color: white;
    font-weight: bold;
  }

  .td {
    background-color: white;
    &.blocked {
      background-color: #a72f2f;
    }
  }

  .td.date-text,
  .th.date-header {
    width: 80px !important;
  }

  .th.date-header {
    font-size: 13px;
    text-align: center;
    cursor: pointer;

    &:hover {
      background-color: #333;
      color: white;
    }
  }

  .table {
    border: 1px solid #ddd;
    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }
    .th,
    .td {
      padding: 5px;
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;
      overflow: hidden;
      :last-child {
        border-right: 0;
      }
      .resizer {
        display: inline-block;
        width: 5px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 1;
        &.isResizing {
          background: red;
        }
      }
    }
    &.sticky {
      overflow: scroll;
      .header,
      .footer {
        position: sticky;
        z-index: 1;
        width: fit-content;
      }
      .header {
        top: 0;
        /* box-shadow: 0px 3px 3px #ccc; */
      }
      .footer {
        bottom: 0;
        /* box-shadow: 0px -3px 3px #ccc; */
      }
      .body {
        position: relative;
        z-index: 0;
      }
      [data-sticky-td] {
        position: sticky;
      }
      [data-sticky-last-left-td] {
        /* box-shadow: 2px 0px 3px #ccc; */
      }
      [data-sticky-first-right-td] {
        /* box-shadow: -2px 0px 3px #ccc; */
      }
    }
  }
`

type Props = {
  location?: any
}

const defaultFromDate = new Date()
const defaultToDate = new Date(2023, 8, 1)

function App({ location }: Props) {
  const [showDisplay, setShowDisplay] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState(false)

  const [fromDate, onChangeFromDate] =
    useState(defaultFromDate)
  const [toDate, onChangeToDate] = useState(defaultToDate)

  useEffect(() => {
    const parsedQuery: any = queryString.parse(
      window.location.search
    )
    if (parsedQuery) {
      const json = parsedQuery.json
      const isJson = isJsonString(json)

      if (!isJson) return setError(true)

      setDisplay(isJson)
    }
  }, [])

  const dates = getDates(fromDate, toDate)

  const columns = [
    {
      Header: "Name",
      accessor: "name",
      sticky: "left",
    },
  ].concat(
    (dates as any).map((date: any) => {
      const readableDate = format(date, "LLL do")
      return {
        Header: readableDate,
        accessor: removeSpaces(readableDate),
        date: date.getTime(),
      }
    })
  )

  function setDisplay(data: any) {
    const sortedWithBlock: any[] = []
    const searchIds: any[] = []

    data.forEach((user: any, i: any) => {
      if (searchIds.includes(i)) return

      if (user.blocked && user.blocked.length) {
        sortedWithBlock.unshift(user)
        searchIds.push(i)
      } else {
        sortedWithBlock.push(user)
      }
    })

    const modifiedData = interpretBlocked(sortedWithBlock)
    // console.log(modifiedData)

    setData(modifiedData)
    setShowDisplay(true)
  }

  const onSetFromDate = (milliseconds: number) => {
    onChangeFromDate(new Date(milliseconds))
  }

  return (
    <Container>
      <DateRange
        fromDate={fromDate}
        toDate={toDate}
        onSetFromDate={onChangeFromDate}
        onSetToDate={onChangeToDate}
      />
      {showDisplay && (
        <Styles>
          <Table
            onSetFromDate={onSetFromDate}
            columns={columns}
            data={data}
          />
        </Styles>
      )}
      {error && (
        <p className="error">
          There was an error from the report
        </p>
      )}
    </Container>
  )
}

export default App
