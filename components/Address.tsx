"use client";

interface AddressProps {
  eth_address: string;
}

export default async function Address({ eth_address }: AddressProps) {

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        eth_address);
      console.log("copy");
      alert('Address is copied to clipboard');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Deposit Address</label>
      <div className="mt-1">
        <div className="flex items-center rounded-md">
          <input
            type="text"
            name="address"
            className="text-sm text-gray-500 flex-grow"
            defaultValue={eth_address}
            placeholder="Your Address"
            maxLength={64}
          />

          <button
            type="submit"
            form="addressForm"
            onClick={copyToClipboard}
            className="bg-blue-500 text-white px-2 py-2 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}