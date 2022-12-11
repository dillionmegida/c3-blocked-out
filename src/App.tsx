import { useEffect, useState } from "react"
import styled from "styled-components"
// @ts-ignore
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
} from "react-table"
import { useSticky } from "react-table-sticky"
import { interpretBlocked } from "./utils/block"
import { getDates } from "./date"
import { format } from "date-fns"
import { removeSpaces } from "./string"
import queryString from "query-string"
import { isJsonString } from "./utils/json"

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

function Table({ columns, data }: any) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useBlockLayout,
    useResizeColumns,
    useSticky
  )

  return (
    <div {...getTableProps()} className="table sticky">
      <div className="header">
        {headerGroups.map((headerGroup: any) => (
          <div
            {...headerGroup.getHeaderGroupProps()}
            className="tr"
          >
            {headerGroup.headers.map((column: any) => (
              <div
                {...column.getHeaderProps()}
                className={`th ${
                  column.id !== "name"
                    ? "date-header"
                    : "name"
                }`}
              >
                {column.render("Header")}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div {...getTableBodyProps()} className="body">
        {rows.map((row: any) => {
          prepareRow(row)
          return (
            <div {...row.getRowProps()} className="tr">
              {row.cells.map((cell: any) => {
                const cellContent = cell.render(
                  "Cell"
                ) as any
                const hasValue = !!cellContent?.props?.value

                const showValue =
                  cellContent?.props?.column.id === "name"

                return (
                  <div
                    {...cell.getCellProps()}
                    className={`td ${
                      !showValue && hasValue
                        ? "blocked"
                        : ""
                    } ${showValue ? "show-border" : ""} ${
                      !showValue && "date-text"
                    }`}
                  >
                    {showValue && cellContent}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

type Props = {
  location?: any
}

function App({ location }: Props) {
  const [parsedQuery, setParsedQuery] = useState<any>(null)

  const [showDisplay, setShowDisplay] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState(false)

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

  const dates = getDates(
    new Date(2022, 8, 11),
    new Date(2023, 8, 1)
  )

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

    setData(modifiedData)
    setShowDisplay(true)
  }

  //   const data = useMemo(() => interpretBlocked(), [])

  return (
    <Container>
      {/* {showDisplay ? (
        <div className="table">
          <Styles>
            <Table columns={columns} data={data} />
          </Styles>
        </div>
      ) : (
        <GetData display={setDisplay} />
      )} */}
      {showDisplay && (
        <Styles>
          <Table columns={columns} data={data} />
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
