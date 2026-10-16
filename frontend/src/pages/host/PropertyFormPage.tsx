import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Save, ArrowLeft, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import type { HotelDto } from '../../types';
import { FormSkeleton } from '../../components/ui/Skeletons';

const PropertyFormPage: React.FC = () => {
  const { hotelId, id } = useParams<{ hotelId?: string; id?: string }>();
  const effectiveId = hotelId || id;
  const isEdit = !!effectiveId && effectiveId !== 'new';
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [photos, setPhotos] = useState<string[]>(['']);
  const [amenities, setAmenities] = useState<string[]>(['']);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && effectiveId) {
      adminService.getHotelById(Number(effectiveId)).then((h) => {
        setName(h.name);
        setCity(h.city);
        setPhotos(h.photos && h.photos.length > 0 ? [...h.photos] : ['']);
        setAmenities(h.amenities && h.amenities.length > 0 ? [...h.amenities] : ['']);
        setAddress(h.contactInfo?.address || '');
        setPhone(h.contactInfo?.phoneNumber || '');
        setEmail(h.contactInfo?.email || '');
        setLocation(h.contactInfo?.location || '');
      }).catch((err) => {
        toast.error(err instanceof Error ? err.message : 'Failed to load property');
        navigate('/host/properties');
      }).finally(() => setPageLoading(false));
    }
  }, [effectiveId, isEdit, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const hotel: HotelDto = {
      name,
      city,
      photos: photos.filter(Boolean),
      amenities: amenities.filter(Boolean),
      contactInfo: {
        address: address || undefined,
        phoneNumber: phone || undefined,
        email: email || undefined,
        location: location || undefined,
      },
    };

    try {
      if (isEdit && effectiveId) {
        await adminService.updateHotel(Number(effectiveId), hotel);
        toast.success('Property updated!');
      } else {
        await adminService.createHotel(hotel);
        toast.success('Property created!');
      }
      navigate('/host/properties');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const addArrayItem = (arr: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter([...arr, '']);
  };

  const updateArrayItem = (arr: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    const updated = [...arr];
    updated[index] = value;
    setter(updated);
  };

  const removeArrayItem = (arr: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(arr.filter((_, i) => i !== index));
  };

  if (pageLoading) return <div className="page-container py-8 max-w-2xl mx-auto"><FormSkeleton /></div>;

  return (
    <div className="page-container py-8 max-w-2xl mx-auto animate-fade-in">
      <button onClick={() => navigate('/host/properties')} className="btn-ghost text-sm mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Properties
      </button>

      <h1 className="section-title mb-6">{isEdit ? 'Edit Property' : 'Add New Property'}</h1>

      <div className="card-elevated p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Hotel Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="label">City *</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="input-field" required />
            </div>
          </div>

          {/* Photos */}
          <div>
            <label className="label">Photo URLs</label>
            {photos.map((photo, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="url" value={photo} onChange={(e) => updateArrayItem(photos, setPhotos, i, e.target.value)} className="input-field" placeholder="https://..." />
                {photos.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem(photos, setPhotos, i)} className="p-2 text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem(photos, setPhotos)} className="btn-ghost text-xs mt-1"><Plus className="w-3.5 h-3.5" /> Add Photo</button>
          </div>

          {/* Amenities */}
          <div>
            <label className="label">Amenities</label>
            {amenities.map((amenity, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="text" value={amenity} onChange={(e) => updateArrayItem(amenities, setAmenities, i, e.target.value)} className="input-field" placeholder="e.g. WiFi, Pool, Gym" />
                {amenities.length > 1 && (
                  <button type="button" onClick={() => removeArrayItem(amenities, setAmenities, i)} className="p-2 text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem(amenities, setAmenities)} className="btn-ghost text-xs mt-1"><Plus className="w-3.5 h-3.5" /> Add Amenity</button>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="label">Phone</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="label">Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="input-field" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> {isEdit ? 'Save Changes' : 'Create Property'}</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PropertyFormPage;
