// src/services/adminService.ts
import { ApiError } from "../utils/ApiError";
import {
  getPendingEvents as storeGetPending,
  approveEventById as storeApprove,
  rejectEventById as storeReject,
} from "../data/adminStore";

export async function listPendingEvents() {
  return storeGetPending();
}

export async function approveEvent(id: string, adminId: number) {
  const evt = await storeApprove(id, adminId);
  if (!evt) throw new ApiError(404, "Event not found");
  return evt;
}

export async function rejectEvent(id: string, adminId: number) {
  const evt = await storeReject(id, adminId);
  if (!evt) throw new ApiError(404, "Event not found");
  return evt;
}
