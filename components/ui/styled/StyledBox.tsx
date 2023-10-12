"use client";

import { ReactNode } from "react";

interface Props {
  title?: string,
  children: ReactNode,
}

const StyledBox = ({ title, children, }: Props) => {
  return (
    <div className="mt-3 bg-white py-8 px-4 shadow sm:px-8 flex-grow space-y-2">
      <label className="block text-lg font-medium text-gray-700">{title}</label>
      <div className="flex flex-col w-full space-y-2">
        {children}
      </div>
    </div>
  )
}

export default StyledBox;