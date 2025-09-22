import { useAppSelector } from '@/redux/hook';

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6">Profile</h2>
        <div className="space-y-4">
          <div>
            <span className="font-semibold">Name:</span> {user?.name || 'N/A'}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {user?.email || 'N/A'}
          </div>
          <div>
            <span className="font-semibold">Role:</span> {user?.role || 'N/A'}
          </div>
          <div>
            <span className="font-semibold">Verified:</span> {user?.isVerified ? 'Yes' : 'No'}
          </div>
        </div>
      </div>
    </div>
  );
}
