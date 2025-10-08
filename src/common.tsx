import { useState, useEffect, useRef } from 'react'

const ROWS_AMOUNT = 400
const INTERVAL = 1000
const UPDATE_PERCENTAGE = 0.5
// const UPDATE_PERCENTAGE = 0.2
// const UPDATE_PERCENTAGE = 0.1
// const UPDATE_PERCENTAGE = 0.01

export type TableData = {
  id: string
  c0: string
  c1: string
  c2: string
  c3: string
  c4: string
  c5: string
  c6: string
  c7: string
  c8: string
  c9: string
}

export function createCellData(rowId: string | number, colName: string, counter: number) {
  return `R${rowId}-${colName} UPD: ${counter}`
}

export function createInitialData(): TableData[] {
  return Array.from({ length: ROWS_AMOUNT }, (_, i) => ({
    id: `row-${i}`,
    ...(Object.fromEntries(
      Array.from({ length: 10 }, (_, ix) => [`c${ix}`, createCellData(i, `C${ix}`, 0)])
    ) as Omit<TableData, 'id'>),
  }))
}

export function createRow(rowNum: number, updateCount: number): TableData {
  return {
    id: `row-${rowNum}`,
    ...(Object.fromEntries(
      Array.from({ length: 10 }, (_, ix) => [
        `c${ix}`,
        createCellData(rowNum, `C${ix}`, updateCount),
      ])
    ) as Omit<TableData, 'id'>),
  }
}

export function updateTableData(prevData: TableData[], updateCount: number): TableData[] {
  const newRow = createRow(updateCount + ROWS_AMOUNT, updateCount)
  const newData = [newRow, ...prevData.slice(0, ROWS_AMOUNT - 1)]
  const cellsToUpdate = Math.floor(ROWS_AMOUNT * 10 * UPDATE_PERCENTAGE)
  const rowUpdates = new Map<string, Partial<TableData>>()

  for (let i = 0; i < cellsToUpdate; i++) {
    const rowIndex = Math.floor(Math.random() * newData.length)
    const colIndex = Math.floor(Math.random() * 10)
    const colKey = `c${colIndex}` as keyof Omit<TableData, 'id'>
    const rowId = newData[rowIndex].id
    const rowNum = rowId.replace('row-', '')

    if (!rowUpdates.has(rowId)) {
      rowUpdates.set(rowId, {})
    }

    rowUpdates.get(rowId)![colKey] = createCellData(rowNum, `C${colIndex}`, updateCount)
  }

  if (rowUpdates.size === 0) {
    return newData
  }

  return newData.map((row) => {
    const rowUpdate = rowUpdates.get(row.id)
    return rowUpdate ? { ...row, ...rowUpdate } : row
  })
}

export function useTableData() {
  const [data, setData] = useState<TableData[]>(createInitialData)
  const updateCounter = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      updateCounter.current += 1
      setData((prev) => updateTableData(prev, updateCounter.current))
    }, INTERVAL)

    return () => clearInterval(interval)
  }, [])

  return data
}
