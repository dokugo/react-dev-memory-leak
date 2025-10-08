import { memo } from 'react'
import { useTableData, type TableData } from './common'

const Cell = ({ value }: { value: string }) => {
  return <td>{value}</td>
}

const Row = memo(({ row }: { row: TableData }) => {
  return (
    <tr>
      <Cell value={row.c0} />
      <Cell value={row.c1} />
      <Cell value={row.c2} />
      <Cell value={row.c3} />
      <Cell value={row.c4} />
      <Cell value={row.c5} />
      <Cell value={row.c6} />
      <Cell value={row.c7} />
      <Cell value={row.c8} />
      <Cell value={row.c9} />
    </tr>
  )
})

export function PlainTable() {
  const data = useTableData()

  return (
    <div className='container'>
      <table>
        <thead>
          <tr>
            <th>Column 0</th>
            <th>Column 1</th>
            <th>Column 2</th>
            <th>Column 3</th>
            <th>Column 4</th>
            <th>Column 5</th>
            <th>Column 6</th>
            <th>Column 7</th>
            <th>Column 8</th>
            <th>Column 9</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
