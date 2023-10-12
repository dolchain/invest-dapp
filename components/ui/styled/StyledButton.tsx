"use client";
import { MouseEventHandler } from 'react'; // Import MouseEventHandler

interface Props {
  onClickHandler: MouseEventHandler<HTMLButtonElement>,
  text: String
}

const StyledButton = ({ text, onClickHandler }: Props) => {
  return (
    <button
      className="bg-blue-500 text-white px-2 py-2 mt-2 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      onClick={onClickHandler}
    >
      {text}
    </button>
  )
}

export default StyledButton;