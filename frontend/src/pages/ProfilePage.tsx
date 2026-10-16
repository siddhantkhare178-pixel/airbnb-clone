import React, { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { Gender } from '../types';
import { FormSkeleton } from '../components/ui/Skeletons';

const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setGender(user.gender || '');
      setDateOfBirth(user.dateOfBirth || '');
      setPageLoading(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await userService.updateProfile({
        name: name || undefined,
        gender: gender as Gender || undefined,
        dateOfBirth: dateOfBirth || undefined,
      });
      await refreshUser();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <div className="page-container py-8 max-w-xl mx-auto"><FormSkeleton /></div>;

  return (
    <div className="page-container py-8 max-w-xl mx-auto animate-fade-in">
      <h1 className="section-title mb-2">Profile</h1>
      <p className="section-subtitle mb-8">Manage your personal information</p>

      <div className="card-elevated p-6">
        {/* Email (read-only) */}
        <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
          <p className="text-sm font-medium text-gray-700">{user?.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="profile-name" className="label">Full Name</label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="profile-gender" className="label">Gender</label>
            <select
              id="profile-gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="input-field"
            >
              <option value="">Select gender</option>
              <option value={Gender.MALE}>Male</option>
              <option value={Gender.FEMALE}>Female</option>
              <option value={Gender.OTHER}>Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="profile-dob" className="label">Date of Birth</label>
            <input
              id="profile-dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="input-field"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
