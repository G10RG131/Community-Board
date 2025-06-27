// src/routes/events.ts
import { Router } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '../middleware/auth';
import {
  requireAuth,
  optionalAuth,
  requireAdmin
} from '../middleware/auth';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEventById,
  deleteEventById,
  getEventsByUserId,
  checkEventOwnership,
  getPendingEvents,
  approveEventById,
  declineEventById
} from '../data/eventsStore';
import { validateBody } from '../middleware/validateBody';
import type { Event } from '../types/event';

const router = Router();

// Zod schemas
const EventSchema = z.object({
  title: z.string().min(1),
  date: z.string().refine(d => !isNaN(Date.parse(d)), { message: 'Invalid date' }),
  location: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  volunteerPositions: z.array(z.string()).optional(),
});

const EventUpdateSchema = EventSchema.partial().refine(
  obj => Object.keys(obj).length > 0,
  { message: 'At least one field required' }
);

// ─── Public ───────────────────────────────────────────
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const list = await getEvents();
    res.json(list);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const ev = await getEventById(req.params.id);
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    res.json(ev);
  } catch (e) {
    next(e);
  }
});

// ─── Authenticated Users ─────────────────────────────
router.get('/my', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const list = await getEventsByUserId(req.user!.id);
    res.json(list);
  } catch (e) {
    next(e);
  }
});

router.post('/', requireAuth, validateBody(EventSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const ev = await createEvent(req.body as Event, req.user!.id);
    res.status(201).json(ev);
  } catch (e) {
    next(e);
  }
});

router.patch('/:id', requireAuth, validateBody(EventUpdateSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!(await checkEventOwnership(req.params.id, req.user!.id))) {
      return res.status(403).json({ error: 'Cannot update others’ events' });
    }
    const upd = await updateEventById(req.params.id, req.body as Partial<Omit<Event, 'id'>>);
    if (!upd) return res.status(404).json({ error: 'Event not found' });
    res.json(upd);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!(await checkEventOwnership(req.params.id, req.user!.id))) {
      return res.status(403).json({ error: 'Cannot delete others’ events' });
    }
    const del = await deleteEventById(req.params.id);
    if (!del) return res.status(404).json({ error: 'Event not found' });
    res.json(del);
  } catch (e) {
    next(e);
  }
});

// ─── Admin Review Flows ───────────────────────────────
router.get('/admin/pending', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const pending = await getPendingEvents();
    res.json(pending);
  } catch (e) {
    next(e);
  }
});

router.patch('/:id/approve', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const ev = await approveEventById(req.params.id, req.user!.id);
    if (!ev) return res.status(404).json({ error: 'Not found or not pending' });
    res.json(ev);
  } catch (e) {
    next(e);
  }
});

router.patch('/:id/decline', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const ev = await declineEventById(req.params.id);
    if (!ev) return res.status(404).json({ error: 'Not found or not pending' });
    res.json(ev);
  } catch (e) {
    next(e);
  }
});

export default router;
