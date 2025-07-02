import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { toast } from "react-toastify";

const AddCoupon = ({ token }) => {
  const [formData, setFormData] = useState({
    couponCode: '',
    discount: '',
    discounttype: 'percentage',
    expiryDate: '',
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    isActive: true,
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const editingCoupon = location.state || null;

  useEffect(() => {
    if (editingCoupon) {
      setFormData({
        couponCode: editingCoupon.couponCode || '',
        discount: editingCoupon.discount || '',
        discounttype: editingCoupon.discounttype || 'percentage',
        expiryDate: editingCoupon.expiryDate?.slice(0, 10) || '',
        minPurchaseAmount: editingCoupon.minPurchaseAmount || '',
        maxDiscountAmount: editingCoupon.maxDiscountAmount || '',
        isActive: editingCoupon.isActive !== undefined ? editingCoupon.isActive : true,
      });
    }
  }, [editingCoupon]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const payload = {
      ...formData,
      discount: Number(formData.discount),
      minPurchaseAmount: Number(formData.minPurchaseAmount),
      maxDiscountAmount: Number(formData.maxDiscountAmount),
    };

    try {
      let response;
      if (editingCoupon) {
        response = await axios.put(
          `https://myinnerside.com/api/coupons/${editingCoupon._id}`,
          payload,
          { headers: { token } }
        );
      } else {
        response = await axios.post(
          'https://myinnerside.com/api/coupons/add',
          payload,
          { headers: { token } }
        );
      }

      toast.success(response.data.message || 'Coupon saved successfully');
      if (!editingCoupon) {
        setFormData({
          couponCode: '',
          discount: '',
          discounttype: 'percentage',
          expiryDate: '',
          minPurchaseAmount: '',
          maxDiscountAmount: '',
          isActive: true,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save coupon');
    }
  };

  return (
    <div className="w-full mx-auto p-8 mt-5 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
      </h2>

      {message && <p className="text-green-600 text-center mb-4">{message}</p>}
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Coupon Code */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
          <input
            type="text"
            name="couponCode"
            value={formData.couponCode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Discount Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Discount Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
          <select
            name="discounttype"
            value={formData.discounttype}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="percentage">Percentage</option>
            <option value="simple">Simple</option>
          </select>
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Minimum Purchase Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Purchase Amount</label>
          <input
            type="number"
            name="minPurchaseAmount"
            value={formData.minPurchaseAmount}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Maximum Discount Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Discount Amount</label>
          <input
            type="number"
            name="maxDiscountAmount"
            value={formData.maxDiscountAmount}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Active Checkbox */}
        <div className="flex items-center space-x-2 col-span-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700">Active</label>
        </div>

        {/* Submit Button */}
        <div className="col-span-2">
          <button
            type="submit"
            className="px-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            {editingCoupon ? 'Update Coupon' : 'Add Coupon'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCoupon;
