import React, { useState, useEffect } from 'react';
import {
  Shield,
  LogOut,
  Search,
  Trash2,
  Phone,
  Eye,
  X,
  RefreshCw,
  ArrowLeft,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import CustomSelect from './ui/CustomSelect';

export default function AdminDashboard({ isOpen, onClose }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('bookings');
  const [stats, setStats] = useState({ total: 0, newCount: 0, confirmedCount: 0, completedCount: 0, totalBrahmins: 0 });
  const [bookings, setBookings] = useState([]);
  const [brahmins, setBrahmins] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

  // Verify existing httpOnly cookie session on mount
  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/admin/me', { credentials: 'include' })
      .then((res) => setAuthenticated(res.ok))
      .catch(() => setAuthenticated(false))
      .finally(() => setCheckingSession(false));
  }, [isOpen]);

  useEffect(() => {
    if (authenticated && isOpen) {
      fetchDashboardData();
    }
  }, [authenticated, isOpen, statusFilter]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setAuthenticated(true);
        setPassword('');
      } else {
        setAuthError(data.message || 'Invalid username or password');
      }
    } catch {
      setAuthError('Failed to connect to authentication server');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    setAuthenticated(false);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetch('/api/stats', { credentials: 'include' });
      if (statsRes.status === 401 || statsRes.status === 403) {
        setAuthenticated(false);
        return;
      }
      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.stats);

      let url = `/api/bookings?status=${encodeURIComponent(statusFilter)}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const bookingsRes = await fetch(url, { credentials: 'include' });
      const bookingsData = await bookingsRes.json();
      if (bookingsData.success) setBookings(bookingsData.bookings);

      const brahminsRes = await fetch('/api/brahmins', { credentials: 'include' });
      const brahminsData = await brahminsRes.json();
      if (brahminsData.success) setBrahmins(brahminsData.brahmins);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMsg(`Booking status changed to ${newStatus}`);
        setTimeout(() => setActionMsg(''), 3000);
        fetchDashboardData();
        if (selectedBooking && selectedBooking._id === id) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMsg('Booking enquiry deleted successfully');
        setTimeout(() => setActionMsg(''), 3000);
        setSelectedBooking(null);
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="min-h-screen bg-[#FFF8EC] text-[#5D4037] flex flex-col font-sans">
      {/* Header Bar */}
      <header className="h-16 bg-[#3B1208] text-[#FFF1D6] border-b border-[#C8961E]/30 flex items-center justify-between px-4 sm:px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#FFF1D6]/10 border border-[#C8961E] flex items-center justify-center text-[#C8961E]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="font-heading font-bold text-base sm:text-lg text-white">
              Divine Vedic Admin Portal
            </div>
            <div className="text-xs text-[#FFF1D6]/75">
              Puja Enquiries &amp; Brahmin Council Management
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {authenticated && (
            <button
              onClick={handleLogout}
              className="min-h-[44px] bg-[#FFF1D6]/10 border border-[#C8961E]/50 rounded-lg text-[#FFF1D6] hover:text-white px-3.5 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="min-h-[44px] bg-[#FFF1D6]/10 border border-[#C8961E]/50 rounded-lg text-white px-3.5 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Site</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {checkingSession ? (
          <div className="text-center py-16 text-[#5D4037]">Checking session...</div>
        ) : !authenticated ? (
          <div className="max-w-md mx-auto my-10 bg-[#FFFFFF] border border-[#EBD5B0] rounded-2xl p-6 sm:p-8 shadow-[0_8px_24px_rgba(74,28,12,0.08)] text-center">
            <div className="w-14 h-14 rounded-full bg-[#FBEBD0] border border-[#C8961E] flex items-center justify-center mx-auto mb-4 text-[#E65100]">
              <Shield className="w-7 h-7" />
            </div>

            <h1 className="font-heading text-2xl font-bold text-[#4A1C0C] mb-1">
              Admin Authentication
            </h1>

            <p className="text-sm text-[#8D6E63] mb-6">
              Authorized Coordinator Access Only
            </p>

            {authError && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-3 text-red-800 text-sm mb-4">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="text-left flex flex-col gap-4">
              <div>
                <label className="vedic-label">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  autoComplete="username"
                  className="vedic-input"
                  required
                />
              </div>

              <div>
                <label className="vedic-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="vedic-input"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-saffron-primary w-full text-sm mt-2"
              >
                {loading ? 'Authenticating...' : 'Enter Dashboard'}
              </button>
            </form>
          </div>
        ) : (
          <div>
            {actionMsg && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 text-emerald-800 mb-5 text-sm font-medium">
                ✓ {actionMsg}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="vedic-card rounded-xl p-5">
                <div className="text-xs text-[#8D6E63] font-bold uppercase tracking-wider">Total Enquiries</div>
                <div className="text-3xl font-bold text-[#4A1C0C] my-1">{stats.total}</div>
              </div>
              <div className="vedic-card rounded-xl p-5">
                <div className="text-xs text-[#8D6E63] font-bold uppercase tracking-wider">New &amp; Pending</div>
                <div className="text-3xl font-bold text-[#E65100] my-1">{stats.newCount}</div>
              </div>
              <div className="vedic-card rounded-xl p-5">
                <div className="text-xs text-[#8D6E63] font-bold uppercase tracking-wider">Confirmed</div>
                <div className="text-3xl font-bold text-emerald-700 my-1">{stats.confirmedCount}</div>
              </div>
              <div className="vedic-card rounded-xl p-5">
                <div className="text-xs text-[#8D6E63] font-bold uppercase tracking-wider">Registered Brahmins</div>
                <div className="text-3xl font-bold text-[#4A1C0C] my-1">{stats.totalBrahmins}</div>
              </div>
            </div>

            {/* Tabs & Filter */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex gap-2.5">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`min-h-[44px] px-4 rounded-lg font-bold text-sm cursor-pointer border ${
                    activeTab === 'bookings'
                      ? 'bg-[#E65100] text-white border-[#E65100]'
                      : 'bg-[#FFFFFF] text-[#4A1C0C] border-[#EBD5B0]'
                  }`}
                >
                  Puja Enquiries ({bookings.length})
                </button>

                <button
                  onClick={() => setActiveTab('brahmins')}
                  className={`min-h-[44px] px-4 rounded-lg font-bold text-sm cursor-pointer border ${
                    activeTab === 'brahmins'
                      ? 'bg-[#E65100] text-white border-[#E65100]'
                      : 'bg-[#FFFFFF] text-[#4A1C0C] border-[#EBD5B0]'
                  }`}
                >
                  Registered Brahmins ({brahmins.length})
                </button>
              </div>

              {activeTab === 'bookings' && (
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="relative w-52 sm:w-60">
                    <Search className="w-4 h-4 text-[#8D6E63] absolute top-3.5 left-3" />
                    <input
                      type="text"
                      placeholder="Search devotee, city..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchDashboardData()}
                      className="vedic-input pl-9 text-sm"
                    />
                  </div>

                  <div className="w-44">
                    <CustomSelect
                      value={statusFilter}
                      onChange={(val) => setStatusFilter(val)}
                      options={[
                        { value: 'All', label: 'All Statuses', icon: Filter },
                        { value: 'New', label: 'New', icon: CheckCircle2 },
                        { value: 'Contacted', label: 'Contacted', icon: CheckCircle2 },
                        { value: 'Confirmed', label: 'Confirmed', icon: CheckCircle2 },
                        { value: 'Completed', label: 'Completed', icon: CheckCircle2 },
                        { value: 'Cancelled', label: 'Cancelled', icon: CheckCircle2 },
                      ]}
                      placeholder="All Statuses"
                    />
                  </div>

                  <button
                    onClick={fetchDashboardData}
                    className="w-11 h-11 rounded-lg bg-[#FFFFFF] border border-[#EBD5B0] text-[#4A1C0C] flex items-center justify-center hover:border-[#E65100] cursor-pointer"
                    title="Refresh List"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {activeTab === 'bookings' ? (
              <div className="bg-[#FFFFFF] border border-[#EBD5B0] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(74,28,12,0.08)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-[#FBEBD0] border-b border-[#EBD5B0] text-[#4A1C0C] font-heading">
                        <th className="p-4">Devotee</th>
                        <th className="p-4">Puja</th>
                        <th className="p-4">Date &amp; Slot</th>
                        <th className="p-4">City</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-[#8D6E63]">
                            No booking enquiries found.
                          </td>
                        </tr>
                      ) : (
                        bookings.map((b) => (
                          <tr key={b._id} className="border-b border-[#EBD5B0]/60 hover:bg-[#FFF8EC]">
                            <td className="p-4">
                              <div className="font-bold text-[#4A1C0C]">{b.fullName}</div>
                              <div className="text-[#E65100] text-xs font-semibold">{b.mobile}</div>
                              <div className="text-[#8D6E63] text-xs">{b.email}</div>
                            </td>
                            <td className="p-4 text-[#4A1C0C] font-medium">{b.puja}</td>
                            <td className="p-4 text-[#5D4037]">
                              <div>{b.preferredDate}</div>
                              <div className="text-xs text-[#8D6E63]">{b.preferredTime}</div>
                            </td>
                            <td className="p-4 text-[#5D4037]">{b.city}</td>
                            <td className="p-4 min-w-[160px]">
                              <CustomSelect
                                value={b.status}
                                onChange={(val) => handleStatusChange(b._id, val)}
                                options={[
                                  { value: 'New', label: 'New', icon: CheckCircle2 },
                                  { value: 'Contacted', label: 'Contacted', icon: CheckCircle2 },
                                  { value: 'Confirmed', label: 'Confirmed', icon: CheckCircle2 },
                                  { value: 'Completed', label: 'Completed', icon: CheckCircle2 },
                                  { value: 'Cancelled', label: 'Cancelled', icon: CheckCircle2 },
                                ]}
                                placeholder="Status"
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => setSelectedBooking(b)}
                                  className="w-10 h-10 rounded-lg bg-[#FFF8EC] border border-[#EBD5B0] text-[#4A1C0C] hover:border-[#E65100] flex items-center justify-center cursor-pointer"
                                  aria-label="View details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(b._id)}
                                  className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 flex items-center justify-center cursor-pointer"
                                  aria-label="Delete enquiry"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {brahmins.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-[#8D6E63]">
                    No Brahmin registrations yet.
                  </div>
                ) : (
                  brahmins.map((br) => (
                    <div key={br._id} className="vedic-card rounded-2xl p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-heading text-lg font-bold text-[#4A1C0C]">{br.fullName}</h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FBEBD0] text-[#E65100] font-semibold">
                          {br.status}
                        </span>
                      </div>
                      <div className="text-sm text-[#5D4037] space-y-1">
                        <div><strong>Mobile:</strong> {br.mobile}</div>
                        <div><strong>City:</strong> {br.city}</div>
                        <div><strong>Experience:</strong> {br.experience}</div>
                        <div><strong>Qualification:</strong> {br.qualification}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 bg-[#3B1208]/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="max-w-lg w-full bg-[#FFFFFF] border border-[#EBD5B0] rounded-2xl p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#FFF8EC] border border-[#EBD5B0] flex items-center justify-center text-[#4A1C0C] cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading text-2xl font-bold text-[#4A1C0C] mb-4">
              {selectedBooking.puja}
            </h3>

            <div className="space-y-2 text-sm text-[#5D4037] mb-6">
              <div><strong>Devotee:</strong> {selectedBooking.fullName}</div>
              <div><strong>Mobile:</strong> {selectedBooking.mobile}</div>
              <div><strong>Email:</strong> {selectedBooking.email}</div>
              <div><strong>Date:</strong> {selectedBooking.preferredDate} ({selectedBooking.preferredTime})</div>
              <div><strong>Address:</strong> {selectedBooking.city}</div>
              <div><strong>Language:</strong> {selectedBooking.language}</div>
              {selectedBooking.gotra && <div><strong>Gotra:</strong> {selectedBooking.gotra}</div>}
              <div><strong>Notes:</strong> {selectedBooking.additionalRequirements || 'None'}</div>
            </div>

            <div className="flex gap-3">
              <a
                href={`tel:${selectedBooking.mobile}`}
                className="btn-saffron-primary flex-1 text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Call Devotee</span>
              </a>
              <button
                onClick={() => handleDelete(selectedBooking._id)}
                className="min-h-[44px] px-4 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold text-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
