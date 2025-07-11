
import { useEffect, useState } from 'react';
import moment from 'moment';

const AdminCouponClaims = () => {
  const [claims, setClaims] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await fetch('https://myinnerside.com/api/coupons/claims');
        const data = await res.json();
        if (res.ok) {
          setClaims(data.claims);
        } else {
          alert('Failed to load claims');
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchClaims();
  }, []);

  const filtered = claims.filter(claim =>
    claim.phone.includes(search.trim())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          📋 Coupon Claim List
        </h1>

        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by phone number..."
            className="border border-gray-300 rounded-md px-4 py-2 w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="text-gray-600">
            Total: <strong>{filtered.length}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-200">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-2 px-4 text-left">#</th>
                <th className="py-2 px-4 text-left">Phone Number</th>
                <th className="py-2 px-4 text-left">Claimed At</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((claim, index) => (
                  <tr key={claim._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{claim.phone}</td>
                    <td className="py-2 px-4 text-sm text-gray-600">
                      {moment(claim.createdAt).format('DD MMM YYYY, hh:mm A')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No claims found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCouponClaims;
