import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Building, Globe, MapPin, Save, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export const CompanyProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    website: '',
    size: '51-200',
    description: '',
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await api.get('/companies');
        if (res.success && res.data) {
          const c = res.data;
          setFormData({
            name: c.name || '',
            industry: c.industry || 'Technology',
            location: c.location || '',
            website: c.website || '',
            size: c.size || '51-200',
            description: c.description || '',
          });
        }
      } catch (err) {
        toast.error('Failed to load company profile');
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put('/companies', formData);
      if (res.success) {
        toast.success('Company profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update company.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton count={3} height="h-32" />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
            Company & Brand Profile
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Details appear on your published job vacancies and candidate application headers
          </p>
        </div>

        <Button variant="primary" type="submit" size="md" isLoading={saving} icon={Save}>
          Save Company Profile
        </Button>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
          Organization Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company Name *"
            icon={Building}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Google, Stripe, Apex..."
            required
          />

          <Input
            label="Industry Domain"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            placeholder="Fintech, Cloud Computing..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Headquarters Location"
            icon={MapPin}
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="San Francisco, CA"
          />

          <Input
            label="Careers Website URL"
            icon={Globe}
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://company.com"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Company Size
            </label>
            <select
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="1-10">1-10 employees (Startup)</option>
              <option value="11-50">11-50 employees (Early Growth)</option>
              <option value="51-200">51-200 employees (Scale-up)</option>
              <option value="201-1000">201-1,000 employees (Mid-Market)</option>
              <option value="1000+">1,000+ employees (Enterprise)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            About the Company
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Introduce your mission, engineering culture, and technological vision..."
            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </Card>
    </form>
  );
};
