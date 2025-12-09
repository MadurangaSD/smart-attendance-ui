import React from 'react'
import { useTheme } from '../context/ThemeContext'

export default function Table({columns, data}){
  const { isDark } = useTheme()
  
  return (
    <table className={`min-w-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <tr>
          {columns.map(c=> <th className={`p-2 text-left ${isDark ? 'text-gray-200' : ''}`} key={c.accessor}>{c.header}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row,i)=>(
          <tr key={i} className={`border-t ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
            {columns.map(c=> <td className={`p-2 ${isDark ? 'text-gray-300' : ''}`} key={c.accessor}>{c.cell ? c.cell(row) : row[c.accessor]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
