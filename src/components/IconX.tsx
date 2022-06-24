import React, { CSSProperties } from 'react'

interface Props {
    width?: number;
    height?: number;
    fill?: string;
    style?: CSSProperties
}
const IconX = ({width, height, fill, style}: Props) => {
    return (
      <svg
        viewBox="0 0 24 24"
        width={width}
        height={height}
        style={style}
        fill={fill}
      >
        <path
          fillRule="evenodd"
          stroke="none"
          d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z" fill={fill}/>
      </svg>
    )
  }

export default (IconX)