import type { Database } from 'types_db';
import CopyableAddress from '@/components/CopyableAddress';

interface AccountDataProps {
  userDetail: Database['public']['Tables']['profiles']['Row'],
  email: string
}

const AccountData = ({ userDetail, email }: AccountDataProps) => {
  // const [userDetail, setUserDetail] = useState(detail);

  // useEffect(() => {
  //   setUserDetail(detail);
  // }, [detail]);

  return (
    <div className="flex flex-col bg-white py-8 px-4 shadow sm:px-10">
      <div className="flex flex-col sm:flex-row flex-grow">
        <div className="mb-2 flex-grow max-w-md">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1">
            <span className="text-md text-gray-900">{email}</span>
          </div>
        </div>
        <div className="mb-2 flex-grow">
          <label className="block text-sm font-medium text-gray-700">Account Wallet Address</label>
          <div className="mt-1">
            <CopyableAddress address={userDetail.eth_address || ""} />
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row flex-grow">
        <div className="mb-2 flex-grow">
          <label className="block text-sm font-medium text-gray-700">Account wallet Balance</label>
          <div className="mt-1">
            <span className="text-md text-gray-900">{userDetail.account_usdc}</span>
          </div>
        </div>
        <div className="mb-2 flex-grow">
          <label className="block text-sm font-medium text-gray-700">Invested Balance</label>
          <div className="mt-1">
            <span className="text-md text-gray-900">{userDetail.invested_usdc}</span>
          </div>
        </div>
        <div className="mb-2 flex-grow">
          <label className="block text-sm font-medium text-gray-700">Un-invest Requested</label>
          <div className="mt-1">
            <span className="text-md text-gray-900">{userDetail.uninvest_usdc}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default AccountData;