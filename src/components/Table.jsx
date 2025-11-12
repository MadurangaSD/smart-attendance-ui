import React from 'react'
export default function Table({columns, data}){
  return (
    <table className="min-w-full bg-white">
      <thead className="bg-gray-100">
        <tr>
          {columns.map(c=> <th className="p-2 text-left" key={c.accessor}>{c.header}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row,i)=>(
          <tr key={i} className="border-t">
            {columns.map(c=> <td className="p-2" key={c.accessor}>{c.cell ? c.cell(row) : row[c.accessor]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
