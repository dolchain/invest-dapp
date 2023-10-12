"use client";

interface Props {
  label?: string,
  value: string | number,
  setValue: Function,
  placeholder?: string,
}

const StyledInput = ({ label, value, setValue, placeholder, }: Props) => {
  return (
    <div className="flex flex-row space-x-4">
      {label && <label className="block text-sm font-medium text-gray-700 py-2">{label}</label>}
      <input
        type="text"
        className="bg-gray-300 text-sm text-gray-800 px-2 py-2 w-20 flex-grow"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}

export default StyledInput;