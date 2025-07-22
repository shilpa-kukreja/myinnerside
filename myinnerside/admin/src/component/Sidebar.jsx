import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronRight,
  FaBoxOpen,
  FaLayerGroup,
  FaShoppingBag,
  FaTags,
  FaUsers,
  FaHeadset,
  FaStore,
  FaTicketAlt
} from "react-icons/fa";
import { FiHome, FiMail } from "react-icons/fi";
import { AdminContext } from "../context/AdminContext";
import { TeamContext } from "../context/TeamContext";

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({
    category: false,
    subcategory: false,
    products: false,
    shopConcerns: false,
    coupons: false,
    blogs: false
  });

  const { aToken } = useContext(AdminContext);
  const { tToken } = useContext(TeamContext);

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const menuItemClasses = ({ isActive }) =>
    `flex items-center gap-4 px-6 py-3 rounded-lg mx-2 transition-all duration-200 font-medium text-sm ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
    }`;

  const dropdownItemClasses = ({ isActive }) =>
    `flex items-center gap-3 px-8 py-2 text-sm rounded-lg mx-2 transition-all ${
      isActive
        ? "bg-blue-100 text-blue-700 font-medium"
        : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <div className="w-80 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-center text-blue-600">
          {aToken ? "Admin Panel" : "Team Panel"}
        </h1>
      </div>

      <nav className="flex-1 flex flex-col px-2 py-4 space-y-1 overflow-y-auto">
        {/* Dashboard - Visible to both */}
       {aToken && (  <NavLink to="/admin/dashboard" className={menuItemClasses}>
          <FiHome className="text-lg" />
          <span>Dashboard</span>
        </NavLink>
         )}

        {/* Team Management - Only for Admin */}
        {aToken && (
          <div>
            <div
              onClick={() => toggleMenu('category')}
              className={`flex items-center justify-between px-6 py-3 mx-2 cursor-pointer rounded-lg transition-all ${
                openMenus.category ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <FaBoxOpen className="text-lg" />
                <span className="text-sm font-medium">Team</span>
              </div>
              {openMenus.category ? (
                <FaChevronDown className="text-xs" />
              ) : (
                <FaChevronRight className="text-xs" />
              )}
            </div>
            <div className={`overflow-hidden transition-all duration-200 ${
              openMenus.category ? 'max-h-40' : 'max-h-0'
            }`}>
              <div className="py-1 pl-2">
                <NavLink to="/admin/add" className={dropdownItemClasses}>
                  <span>Add Team</span>
                </NavLink>
                <NavLink to="/admin/list" className={dropdownItemClasses}>
                  <span>List Team</span>
                </NavLink>
              </div>
            </div>
          </div>
        )}

        {/* SubCategory - Visible to both */}
        {/* <div>
          <div
            onClick={() => toggleMenu('subcategory')}
            className={`flex items-center justify-between px-6 py-3 mx-2 cursor-pointer rounded-lg transition-all ${
              openMenus.subcategory ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            <div className="flex items-center gap-4">
              <FaLayerGroup className="text-lg" />
              <span className="text-sm font-medium">SubCategory</span>
            </div>
            {openMenus.subcategory ? (
              <FaChevronDown className="text-xs" />
            ) : (
              <FaChevronRight className="text-xs" />
            )}
          </div>
          <div className={`overflow-hidden transition-all duration-200 ${
            openMenus.subcategory ? 'max-h-40' : 'max-h-0'
          }`}>
            <div className="py-1 pl-2">
              <NavLink to="/addsubcategory" className={dropdownItemClasses}>
                <span>Add SubCategory</span>
              </NavLink>
              <NavLink to="/addsubcategorylist" className={dropdownItemClasses}>
                <span>List SubCategory</span>
              </NavLink>
            </div>
          </div>
        </div> */}

        {/* Products - Visible to both */}
        {/* <div>
          <div
            onClick={() => toggleMenu('products')}
            className={`flex items-center justify-between px-6 py-3 mx-2 cursor-pointer rounded-lg transition-all ${
              openMenus.products ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            <div className="flex items-center gap-4">
              <FaShoppingBag className="text-lg" />
              <span className="text-sm font-medium">Products</span>
            </div>
            {openMenus.products ? (
              <FaChevronDown className="text-xs" />
            ) : (
              <FaChevronRight className="text-xs" />
            )}
          </div>
          <div className={`overflow-hidden transition-all duration-200 ${
            openMenus.products ? 'max-h-40' : 'max-h-0'
          }`}>
            <div className="py-1 pl-2">
              <NavLink to="/addproduct" className={dropdownItemClasses}>
                <span>Add Products</span>
              </NavLink>
              <NavLink to="/listproduct" className={dropdownItemClasses}>
                <span>List Products</span>
              </NavLink>
            </div>
          </div>
        </div> */}

        {/* Shop Concerns - Only for Admin */}
        {/* {aToken && (
          <div>
            <div
              onClick={() => toggleMenu('shopConcerns')}
              className={`flex items-center justify-between px-6 py-3 mx-2 cursor-pointer rounded-lg transition-all ${
                openMenus.shopConcerns ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <FaStore className="text-lg" />
                <span className="text-sm font-medium">ShopConcerns</span>
              </div>
              {openMenus.shopConcerns ? (
                <FaChevronDown className="text-xs" />
              ) : (
                <FaChevronRight className="text-xs" />
              )}
            </div>
            <div className={`overflow-hidden transition-all duration-200 ${
              openMenus.shopConcerns ? 'max-h-40' : 'max-h-0'
            }`}>
              <div className="py-1 pl-2">
                <NavLink to="/addshop" className={dropdownItemClasses}>
                  <span>Add Shop Concerns</span>
                </NavLink>
                <NavLink to="/listshop" className={dropdownItemClasses}>
                  <span>List Shop Concerns</span>
                </NavLink>
              </div>
            </div>
          </div>
        )} */}

        {/* Coupons - Only for Admin */}
        {aToken && (
          <div>
            <div
              onClick={() => toggleMenu('coupons')}
              className={`flex items-center justify-between px-6 py-3 mx-2 cursor-pointer rounded-lg transition-all ${
                openMenus.coupons ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <FaTicketAlt className="text-lg" />
                <span className="text-sm font-medium">Coupons</span>
              </div>
              {openMenus.coupons ? (
                <FaChevronDown className="text-xs" />
              ) : (
                <FaChevronRight className="text-xs" />
              )}
            </div>
            <div className={`overflow-hidden transition-all duration-200 ${
              openMenus.coupons ? 'max-h-40' : 'max-h-0'
            }`}>
              <div className="py-1 pl-2">
                <NavLink to="/admin/addcoupon" className={dropdownItemClasses}>
                  <span>Add Coupons</span>
                </NavLink>
                <NavLink to="/admin/listcoupon" className={dropdownItemClasses}>
                  <span>List Coupons</span>
                </NavLink>
              </div>
            </div>
          </div>
        )}

        {/* Order Items - Visible to both */}
       {aToken && (  <NavLink to="/admin/listappointment" className={menuItemClasses}>
          <FaShoppingBag className="text-lg" />
          <span>Appointments List</span>
        </NavLink>
 )}
        {/* Blogs - Only for Admin */}
        {aToken && (
          <div>
            <div
              onClick={() => toggleMenu('blogs')}
              className={`flex items-center justify-between px-6 py-3 mx-2 cursor-pointer rounded-lg transition-all ${
                openMenus.blogs ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <NavLink to='/admin/lifecoach' className="flex items-center gap-4">
                <FaShoppingBag className="text-lg" />
                <span className="text-sm font-medium">LifeCoach Appointment</span>
              </NavLink>
              
            </div>
           
          </div>
        )}

        {/* Manage Users - Only for Admin */}
        {aToken && (
          <NavLink to="/admin/user" className={menuItemClasses}>
            <FaUsers className="text-lg" />
            <span>Manage Users</span>
          </NavLink>
        )}

         {/* Manage Slot - Only for Admin */}
        {aToken && (
          <NavLink to="/admin/manageslot" className={menuItemClasses}>
            <FaUsers className="text-lg" />
            <span>Manage Slot</span>
          </NavLink>
        )}

        {/* Contacts - Visible to both */}
        {aToken && (  <NavLink to="/admin/listcontact" className={menuItemClasses}>
          <FiMail className="text-lg" />
          <span>Contacts</span>
        </NavLink>
        )}

        {
          aToken && (
            <NavLink to="/admin/admincouponclaim" className={menuItemClasses}>
              <FaUsers className="text-lg" />
              <span>Admin Coupon Claim</span>
            </NavLink>
          )
        }

        {/* Team Specific Menu Items */}
        {tToken && (
          <>
            <NavLink  to="/admin/team/appointments"  className={menuItemClasses}>
              <FaHeadset className="text-lg" />
              <span>My Apponitments</span>
            </NavLink>
           
          </>
        )}
      </nav>

      {/* Bottom Area */}
      <div className="p-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} Your Brand
        </div>
      </div>
    </div>
  );
};

export default Sidebar;