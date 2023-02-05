// @ts-ignore
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
} from "react-table"
import { useSticky } from "react-table-sticky"

export default function Table({
  columns,
  data,
  onSetFromDate,
}: any) {
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
                onClick={() => onSetFromDate(column.date)}
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
