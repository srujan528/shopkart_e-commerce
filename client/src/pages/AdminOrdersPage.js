import AdminOrders from "../features/admin/components/AdminOrders";
import NavBar from "../features/navbar/Navbar";
import { Link } from "react-router-dom";

function AdminOrdersPage() {
  return (
    <>
      <NavBar>
        {/* Admin Orders Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-8 px-6 sm:px-8 border-b border-indigo-900/50 shadow-xl mb-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="bg-rose-500/20 text-rose-300 text-xs font-bold px-3 py-1 rounded-full border border-rose-500/40 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                    Admin Control Center Active
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-white flex items-center gap-3">
                  📦 Customer Orders Management
                </h1>
                <p className="text-slate-300 text-sm mt-1 max-w-xl">
                  Inspect customer order transactions, update shipping statuses, and manage fulfillment.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/admin"
                  className="bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl border border-slate-700 shadow-md transition-all flex items-center gap-2"
                >
                  👑 Back to Admin Dashboard
                </Link>
                <Link
                  to="/admin/product-form"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  ➕ Add New Product
                </Link>
              </div>
            </div>
          </div>
        </div>

        <AdminOrders></AdminOrders> 
      </NavBar>
    </>
  );
}

export default AdminOrdersPage;
