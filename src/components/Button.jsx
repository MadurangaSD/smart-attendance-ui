import React from 'react'
export default function Button({children, onClick, className='', ...rest}){
  return (
    <button onClick={onClick} className={'px-3 py-1 rounded bg-sky-600 text-white '+className} {...rest}>
      {children}
    </button>
  )
}
