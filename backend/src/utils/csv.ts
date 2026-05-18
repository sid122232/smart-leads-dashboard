import { ILeadDocument } from '../types';

const escapeCsvField = (field: string | undefined): string => {
  if (!field) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const generateLeadsCsv = (leads: ILeadDocument[]): string => {
  const headers = ['ID', 'Name', 'Email', 'Status', 'Source', 'Notes', 'Created At'];

  const rows = leads.map((lead) => [
    escapeCsvField(lead._id),
    escapeCsvField(lead.name),
    escapeCsvField(lead.email),
    escapeCsvField(lead.status),
    escapeCsvField(lead.source),
    escapeCsvField(lead.notes),
    escapeCsvField(new Date(lead.createdAt).toISOString()),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csvContent;
};