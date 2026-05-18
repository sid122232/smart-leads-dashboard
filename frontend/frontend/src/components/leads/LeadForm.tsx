import { useState, FormEvent, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCreateLead, useUpdateLead } from '@/hooks/useLeads';
import { Lead, LeadStatus, LeadSource, CreateLeadPayload, UpdateLeadPayload } from '@/types';
import { LEAD_STATUSES, LEAD_SOURCES } from '@/utils';

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingLead?: Lead | null;
}

interface FormState {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource | '';
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  source?: string;
}

const defaultForm: FormState = {
  name: '',
  email: '',
  status: 'New',
  source: '',
  notes: '',
};

export const LeadForm = ({ isOpen, onClose, editingLead }: LeadFormProps) => {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Populate form when editing
  useEffect(() => {
    if (editingLead) {
      setForm({
        name: editingLead.name,
        email: editingLead.email,
        status: editingLead.status,
        source: editingLead.source,
        notes: editingLead.notes ?? '',
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [editingLead, isOpen]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.source) newErrors.source = 'Source is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editingLead) {
        const payload: UpdateLeadPayload = {
          name: form.name.trim(),
          email: form.email,
          status: form.status,
          source: form.source as LeadSource,
          notes: form.notes.trim() || undefined,
        };
        await updateMutation.mutateAsync({ id: editingLead._id, payload });
      } else {
        const payload: CreateLeadPayload = {
          name: form.name.trim(),
          email: form.email,
          status: form.status,
          source: form.source as LeadSource,
          notes: form.notes.trim() || undefined,
        };
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch {
      // Toast is shown by mutation onError
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingLead ? 'Edit lead' : 'Log incoming lead'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Full name"
            value={form.name}
            onChange={handleChange('name')}
            error={errors.name}
            placeholder="Rahul Sharma"
            required
          />
          <Input
            label="Email address"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
            placeholder="rahul@example.com"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Status"
            value={form.status}
            onChange={handleChange('status')}
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>

          <Select
            label="Source"
            value={form.source}
            onChange={handleChange('source')}
            error={errors.source}
            placeholder="Select source"
            required
          >
            {LEAD_SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            value={form.notes}
            onChange={handleChange('notes')}
            placeholder="Any additional context about this lead…"
            rows={3}
            maxLength={1000}
            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500"
          />
          <p className="text-right text-xs text-gray-400">{form.notes.length}/1000</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t border-gray-100 pt-3 dark:border-white/10">
          <Button variant="secondary" size="md" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} size="md">
            {editingLead ? 'Save changes' : 'Log lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};