import mongoose from 'mongoose';
import { Lead, ILead } from '../models/lead';
import { LeadFilters, PaginatedResponse, LeadStatus, LeadSource } from '../types';
import { AppError } from '../middleware/errorHandler';
import { config } from '../config';

interface CreateLeadInput {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: string;
  createdBy: string;
}

interface UpdateLeadInput {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
  notes?: string;
  assignedTo?: string;
}

export const getLeads = async (
  filters: LeadFilters,
  userId: string,
  isAdmin: boolean
): Promise<PaginatedResponse<ILead>> => {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(
    config.pagination.maxLimit,
    filters.limit ?? config.pagination.defaultLimit
  );
  const skip = (page - 1) * limit;

  // Build query object
  const query: mongoose.FilterQuery<ILead> = {};

  // Sales users can only see their own leads
  if (!isAdmin) {
    query.createdBy = new mongoose.Types.ObjectId(userId);
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.source) {
    query.source = filters.source;
  }

  if (filters.search?.trim()) {
    const searchRegex = new RegExp(filters.search.trim(), 'i');
    query.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const sortDirection = filters.sort === 'oldest' ? 1 : -1;

  const [leads, total] = await Promise.all([
    Lead.find(query)
      .sort({ createdAt: sortDirection })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .lean(),
    Lead.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: leads as unknown as ILead[],
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

export const getLeadById = async (leadId: string): Promise<ILead> => {
  const lead = await Lead.findById(leadId)
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email');

  if (!lead) {
    throw new AppError('Lead not found.', 404);
  }

  return lead;
};

export const createLead = async (input: CreateLeadInput): Promise<ILead> => {
  const lead = await Lead.create(input);
  return lead.populate('createdBy', 'name email');
};

export const updateLead = async (
  leadId: string,
  input: UpdateLeadInput,
  userId: string,
  isAdmin: boolean
): Promise<ILead> => {
  const lead = await Lead.findById(leadId);

  if (!lead) {
    throw new AppError('Lead not found.', 404);
  }

  // Sales users can only update their own leads
  if (!isAdmin && lead.createdBy.toString() !== userId) {
    throw new AppError('You are not authorized to update this lead.', 403);
  }

  const updated = await Lead.findByIdAndUpdate(leadId, input, {
    new: true,
    runValidators: true,
  })
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email');

  if (!updated) {
    throw new AppError('Lead not found.', 404);
  }

  return updated;
};

export const deleteLead = async (
  leadId: string,
  userId: string,
  isAdmin: boolean
): Promise<void> => {
  const lead = await Lead.findById(leadId);

  if (!lead) {
    throw new AppError('Lead not found.', 404);
  }

  if (!isAdmin && lead.createdBy.toString() !== userId) {
    throw new AppError('You are not authorized to delete this lead.', 403);
  }

  await lead.deleteOne();
};

export const getAllLeadsForExport = async (
  filters: Omit<LeadFilters, 'page' | 'limit'>,
  userId: string,
  isAdmin: boolean
): Promise<ILead[]> => {
  const query: mongoose.FilterQuery<ILead> = {};

  if (!isAdmin) {
    query.createdBy = new mongoose.Types.ObjectId(userId);
  }

  if (filters.status) query.status = filters.status;
  if (filters.source) query.source = filters.source;

  if (filters.search?.trim()) {
    const searchRegex = new RegExp(filters.search.trim(), 'i');
    query.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const sortDirection = filters.sort === 'oldest' ? 1 : -1;

  return Lead.find(query)
    .sort({ createdAt: sortDirection })
    .lean() as unknown as ILead[];
};