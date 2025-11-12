import React from 'react'
export default function Toast({msg}){ if(!msg) return null
  return <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-3 py-2 rounded">{msg}</div>
}
