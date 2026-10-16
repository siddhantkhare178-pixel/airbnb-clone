import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, TrendingUp, DollarSign, CalendarDays } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import { adminService } from '../../services/adminService';
import type { HotelReportDto } from '../../types';
import { ErrorState } from '../../components/ui/States';
import { FormSkeleton } from '../../components/ui/Skeletons';

const HotelReportsPage: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<HotelReportDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(format(subMonths(new Date(), 1), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getHotelReport(Number(hotelId), startDate, endDate);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, [hotelId]);

  if (loading) return <div className="page-container py-8 max-w-3xl mx-auto"><FormSkeleton /></div>;
  if (error) return <div className="page-container py-8"><ErrorState message={error} onRetry={fetchReport} /></div>;

  return (
    <div className="page-container py-8 max-w-3xl mx-auto animate-fade-in">
      <button onClick={() => navigate('/host/properties')} className="btn-ghost text-sm mb-4"><ArrowLeft className="w-4 h-4" /> Back</button>
      <h1 className="section-title mb-6">Revenue Report</h1>

      {/* Date Filter */}
      <div className="card p-5 mb-8">
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1">
            <label className="label flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field" />
          </div>
          <div className="flex-1">
            <label className="label flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field" />
          </div>
          <button onClick={fetchReport} className="btn-primary text-sm !py-3"><BarChart3 className="w-4 h-4" /> Generate</button>
        </div>
      </div>

      {/* Report Stats */}
      {report && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-elevated p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-coral-50 text-coral-500 flex items-center justify-center mb-3">
              <CalendarDays className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{report.bookingCount}</p>
            <p className="text-sm text-gray-500 mt-1">Total Bookings</p>
          </div>
          <div className="card-elevated p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
              <DollarSign className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-gray-900">₹{Number(report.totalRevenue).toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
          </div>
          <div className="card-elevated p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-gray-900">₹{Number(report.avgRevenue).toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Avg. Revenue</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelReportsPage;
