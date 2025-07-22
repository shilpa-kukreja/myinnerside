import { useEffect, useState } from 'react';
import moment from 'moment';

const AdminCouponClaims = () => {
  const [claims, setClaims] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
    claim.phone.toLowerCase().includes(search.trim().toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="mx-auto bg-white shadow-xl rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">📋 Coupon Claim List</h1>

        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search by phone number..."
            className="border border-gray-300 rounded-md px-4 py-2 w-72"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset to page 1 on search
            }}
          />
          <div className="text-gray-600">
            Showing <strong>{currentItems.length}</strong> of <strong>{filtered.length}</strong> claims
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
              {currentItems.length > 0 ? (
                currentItems.map((claim, index) => (
                  <tr key={claim._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-4">{indexOfFirstItem + index + 1}</td>
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2 flex-wrap">
            <button
              className="px-3 py-1 border rounded-md text-sm hover:bg-gray-200 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 border rounded-md text-sm ${
                  currentPage === i + 1
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="px-3 py-1 border rounded-md text-sm hover:bg-gray-200 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCouponClaims;
