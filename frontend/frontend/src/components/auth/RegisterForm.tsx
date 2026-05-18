import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@/types';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/types';

interface FormState {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export const RegisterForm = () => {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    role: 'sales',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    else if (form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = 'Must include uppercase, lowercase, and a number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await register(form.name.trim(), form.email, form.password, form.role);
      toast.success('Account created! Welcome aboard.');
      navigate('/leads', { replace: true });
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse>;
      const msg = axiosErr.response?.data?.message ?? 'Registration failed. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Full name"
        type="text"
        placeholder="Rahul Sharma"
        value={form.name}
        onChange={handleChange('name')}
        error={errors.name}
        leftIcon={<User className="size-4" />}
        required
        autoComplete="name"
      />

      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={handleChange('email')}
        error={errors.email}
        leftIcon={<Mail className="size-4" />}
        required
        autoComplete="email"
      />

      <Input
        label="Password"
        type="password"
        placeholder="Min. 8 chars with upper, lower, number"
        value={form.password}
        onChange={handleChange('password')}
        error={errors.password}
        leftIcon={<Lock className="size-4" />}
        required
        autoComplete="new-password"
        hint="At least 8 characters with one uppercase, lowercase, and number"
      />

      <Select
        label="Role"
        value={form.role}
        onChange={handleChange('role')}
      >
        <option value="sales">Sales User</option>
        <option value="admin">Admin</option>
      </Select>

      <Button type="submit" isLoading={isLoading} className="mt-1 w-full" size="lg">
        Create account
      </Button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
          Sign in
        </Link>
      </p>
    </form>
  );
};