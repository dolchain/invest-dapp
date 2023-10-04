"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { reduceAddress } from '@/utils/helpers';

interface AddressProps {
  address: string;
}

export default async function Address({ address }: AddressProps) {

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      alert('Address is copied to clipboard');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex flex-row hover:cursor-pointer" onClick={copyToClipboard}>
      <div className="text-md text-sky-500">{reduceAddress(address)}</div>
      <FontAwesomeIcon icon={faCopy} style={{color: "#0ea5f3",}} />
    </div>
  );
} 