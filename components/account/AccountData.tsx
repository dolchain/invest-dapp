import type { Database } from 'types_db';
import CopyableAddress from '@/components/CopyableAddress';
import QRCode from "react-qr-code";

interface AccountDataProps {
  userDetail: any;//Database['public']['Tables']['users']['Row']
}

const AccountData = ({ userDetail }: AccountDataProps) => {

  return (
    <div className='flex flex-col bg-white py-8 px-4 shadow sm:px-10 items-center justify-center space-y-2'>
      <div className="flex flex-col sm:flex-row sm:space-x-4">
        <label className="block text-sm font-medium text-gray-700">Email:</label>
        <div className="text-md text-gray-900">{userDetail.email}</div>
      </div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-x-12">
        <div>
          <label className="block text-sm font-medium text-gray-700">Account Wallet Address</label>
          <div className='space-y-2'>
            <CopyableAddress address={userDetail.eth_address!} />
            <div className="flex w-full h-auto max-w-[168px]">
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={userDetail.eth_address!}
                viewBox={`0 0 256 256`}
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Account wallet Balance</label>
            <div className="text-md text-gray-900">{userDetail.account_usdc}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Invested Balance</label>
            <div className="text-md text-gray-900">{userDetail.invested_usdc}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Un-invest Requested</label>
            <div className="text-md text-gray-900">{userDetail.uninvest_usdc}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountData;