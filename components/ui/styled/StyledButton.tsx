"use client";
import { MouseEventHandler } from 'react'; // Import MouseEventHandler

interface Props {
  onClickHandler: (param?: any) => void;
  text?: String;
  clickParam?: any | null;
}

const StyledButton = ({ text, onClickHandler, clickParam }: Props) => {
  return (
    <button
      className="bg-blue-500 text-white text-sm px-2 py-1 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      onClick={() => onClickHandler(clickParam)}
    >
      {text}
    </button>
  )
}

export default StyledButton;