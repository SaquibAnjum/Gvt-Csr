import React from 'react'
import { clsx } from 'clsx'

const Table = ({ children, className = '', ...props }) => (
  <div className="overflow-x-auto">
    <table className={clsx('w-full border-collapse', className)} {...props}>
      {children}
    </table>
  </div>
)

const TableHeader = ({ children, className = '', ...props }) => (
  <thead className={clsx('bg-secondary-50', className)} {...props}>
    {children}
  </thead>
)

const TableBody = ({ children, className = '', ...props }) => (
  <tbody className={clsx('divide-y divide-secondary-200', className)} {...props}>
    {children}
  </tbody>
)

const TableRow = ({ children, className = '', hover = false, ...props }) => (
  <tr 
    className={clsx(
      'transition-colors',
      hover && 'hover:bg-secondary-50',
      className
    )} 
    {...props}
  >
    {children}
  </tr>
)

const TableHead = ({ children, className = '', ...props }) => (
  <th 
    className={clsx(
      'px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider',
      className
    )} 
    {...props}
  >
    {children}
  </th>
)

const TableCell = ({ children, className = '', ...props }) => (
  <td 
    className={clsx(
      'px-4 py-3 text-sm text-secondary-900',
      className
    )} 
    {...props}
  >
    {children}
  </td>
)

Table.Header = TableHeader
Table.Body = TableBody
Table.Row = TableRow
Table.Head = TableHead
Table.Cell = TableCell

export default Table
