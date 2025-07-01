import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ListCoupon = ({ token }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;
  const navigate = useNavigate();

  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/coupons/get", {
        headers: { token },
      });
      setCoupons(data.coupons);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const { data } = await axios.put(`http://localhost:5000/api/coupons/${id}/toggle`, {}, {
        headers: { token },
      });

      setCoupons((prev) =>
        prev.map((coupon) =>
          coupon._id === id ? { ...coupon, isActive: data.coupon.isActive } : coupon
        )
      );
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/coupons/${id}`, {
        headers: { token },
      });
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  const filteredCoupons = coupons.filter((c) =>
    c.couponCode.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedCoupons = filteredCoupons.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(filteredCoupons.length / limit);

  useEffect(() => {
    fetchCoupons();
  }, []);

  if (loading) return <div className="text-center mt-8">Loading coupons...</div>;

  return (
    <div className="w-full mx-auto p-6 mt-5 bg-white shadow rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Coupons</h2>
        <input
          type="text"
          placeholder="Search by code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-1 rounded"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 text-sm border">Code</th>
              <th className="p-2 text-sm border">Discount (%)</th>
              <th className="p-2 text-sm border">Discount Type</th>
              <th className="p-2 text-sm border">Min Purchase</th>
              <th className="p-2 text-sm border">Max Discount</th>
              <th className="p-2 text-sm border">Expiry</th>
              <th className="p-2 text-sm border">Status</th>
              <th className="p-2 text-sm border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCoupons.map((coupon) => (
              <tr key={coupon._id} className="border-b">
                <td className="p-2 text-sm border">{coupon.couponCode}</td>
                <td className="p-2 text-sm border">{coupon.discount}</td>
                <td className="p-2 text-sm border">{coupon.discounttype}</td>
                <td className="p-2 text-sm border">{coupon.minPurchaseAmount}</td>
                <td className="p-2 text-sm border">{coupon.maxDiscountAmount || '-'}</td>
                <td className="p-2 text-sm border">
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </td>
                <td className={`p-2 border ${coupon.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {coupon.isActive ? "Active" : "Inactive"}
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => toggleStatus(coupon._id)}
                    className={`px-3 py-1 rounded text-white ${coupon.isActive ? 'bg-red-600' : 'bg-green-600'}`}
                  >
                    {coupon.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => navigate("/addcoupon", { state: coupon })}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCoupon(coupon._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4 space-x-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">{page} / {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListCoupon;
