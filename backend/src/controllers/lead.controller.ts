import { Request, Response, NextFunction } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getAllLeadsForExport,
} from '../services/lead.service';
import { sendSuccess, sendCreated } from '../utils/response';
import { generateLeadsCsv } from '../utils/csv';
import { LeadFilters, LeadStatus, LeadSource, SortOrder } from '../types';

export const listLeads = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters: LeadFilters = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      status: req.query.status as LeadStatus | undefined,
      source: req.query.source as LeadSource | undefined,
      search: req.query.search as string | undefined,
      sort: (req.query.sort as SortOrder) ?? 'latest',
    };

    const isAdmin = req.user!.role === 'admin';
    const result = await getLeads(filters, req.user!.userId, isAdmin);
    sendSuccess(res, result, 'Leads retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await getLeadById(req.params.id!);
    sendSuccess(res, lead, 'Lead retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createNewLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await createLead({
      ...req.body as { name: string; email: string; source: LeadSource; notes?: string; assignedTo?: string },
      createdBy: req.user!.userId,
    });
    sendCreated(res, lead, 'Lead created successfully');
  } catch (err) {
    next(err);
  }
};

export const updateExistingLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isAdmin = req.user!.role === 'admin';
    const lead = await updateLead(req.params.id!, req.body as Record<string, unknown>, req.user!.userId, isAdmin);
    sendSuccess(res, lead, 'Lead updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteExistingLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isAdmin = req.user!.role === 'admin';
    await deleteLead(req.params.id!, req.user!.userId, isAdmin);
    sendSuccess(res, null, 'Lead deleted successfully');
  } catch (err) {
    next(err);
  }
};

export const exportLeadsCsv = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters: Omit<LeadFilters, 'page' | 'limit'> = {
      status: req.query.status as LeadStatus | undefined,
      source: req.query.source as LeadSource | undefined,
      search: req.query.search as string | undefined,
      sort: (req.query.sort as SortOrder) ?? 'latest',
    };

    const isAdmin = req.user!.role === 'admin';
    const leads = await getAllLeadsForExport(filters, req.user!.userId, isAdmin);
    const csv = generateLeadsCsv(leads as unknown as Parameters<typeof generateLeadsCsv>[0]);

    const filename = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
};