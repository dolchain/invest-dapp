"use client";

interface Props {
  label?: string,
  value: string | number,
  setValue: Function,
  placeholder?: string,
  error: string,
  setError: Function,
}

const StyledInput = ({ label, value, setValue, placeholder, error, setError }: Props) => {
  return (
    <div>
      <div className="flex flex-row space-x-4">
        {label && <label className="block text-sm font-medium text-gray-700 py-2">{label}</label>}
        <input
          type="text"
          className="bg-gray-300 text-sm text-gray-800 px-2 py-2 w-20 flex-grow"
          placeholder={placeholder}
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(""); }}
        />
      </div>
      {error && <div className="block text-sm font-medium text-red-700">{error}</div>}
    </div>
  )
}

export default StyledInput;