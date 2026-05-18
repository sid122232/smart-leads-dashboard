import { Router } from 'express';
import {
  listLeads,
  getLead,
  createNewLead,
  updateExistingLead,
  deleteExistingLead,
  exportLeadsCsv,
} from '../controllers/lead.controller';
import { authenticate, authorize } from '../middleware/auth';
import {
  createLeadValidator,
  updateLeadValidator,
  leadQueryValidator,
} from '../validators/lead.validator';
import { validate } from '../middleware/validate';

const router = Router();

// All lead routes require authentication
router.use(authenticate);

router.get('/', leadQueryValidator, validate, listLeads);
router.get('/export', leadQueryValidator, validate, exportLeadsCsv);
router.get('/:id', getLead);
router.post('/', createLeadValidator, validate, createNewLead);
router.patch('/:id', updateLeadValidator, validate, updateExistingLead);

// Only admins can hard-delete leads
router.delete('/:id', authorize('admin'), deleteExistingLead);

export default router;