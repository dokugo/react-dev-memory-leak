import { memo } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type Cell,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import { useTableData, type TableData } from './common'

const columnHelper = createColumnHelper<TableData>()

const columns = [
  columnHelper.accessor('c0', { header: 'Column 0' }),
  columnHelper.accessor('c1', { header: 'Column 1' }),
  columnHelper.accessor('c2', { header: 'Column 2' }),
  columnHelper.accessor('c3', { header: 'Column 3' }),
  columnHelper.accessor('c4', { header: 'Column 4' }),
  columnHelper.accessor('c5', { header: 'Column 5' }),
  columnHelper.accessor('c6', { header: 'Column 6' }),
  columnHelper.accessor('c7', { header: 'Column 7' }),
  columnHelper.accessor('c8', { header: 'Column 8' }),
  columnHelper.accessor('c9', { header: 'Column 9' }),
]
export function TanstackTable() {
  const data = useTableData()

  return <Table data={data} />
}

function Cell({ value }: { value: string }) {
  return <td>{value}</td>
}

const CellMemo = memo(Cell)

function Row({ cells }: { cells: Cell<TableData, string>[] }) {
  return (
    <tr>
      {cells.map((cell) => (
        <CellMemo key={cell.id} value={cell.getValue()} />
      ))}
    </tr>
  )
}

const RowMemo = memo(Row, (prevProps, nextProps) => {
  return prevProps.cells.every(
    (cell, index) => cell.getValue() === nextProps.cells[index].getValue()
  )
})

function Table({ data }: { data: TableData[] }) {
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row: TableData) => row.id,
  })

  const { rows } = table.getRowModel()

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 50,
    overscan: 5,
    getItemKey: (index: number) => rows[index].id,
  })

  const virtualRows = virtualizer.getVirtualItems()

  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0
  const paddingBottom =
    virtualRows.length > 0
      ? virtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
      : 0

  return (
    <div ref={tableContainerRef} className='container'>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {paddingTop > 0 && (
            <tr>
              <td colSpan={columns.length} style={{ height: `${paddingTop}px` }} />
            </tr>
          )}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index]
            return <RowMemo key={row.id} cells={row.getVisibleCells()} />
          })}
          {paddingBottom > 0 && (
            <tr>
              <td colSpan={columns.length} style={{ height: `${paddingBottom}px` }} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
