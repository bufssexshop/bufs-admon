import React from 'react'

type TProps = {
  [key: string]: string;
}

export const LockIcon = (props: TProps) => (
  <svg
    aria-hidden='true'
    fill='none'
    focusable='false'
    height='1.2em'
    role='presentation'
    viewBox='0 0 24 24'
    width='1.2em'
    {...props}
  >
    <path
      clipRule='evenodd'
      fillRule='evenodd'
      d='M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z'
      fill='currentColor'
    />
  </svg>
)