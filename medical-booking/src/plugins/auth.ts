import type { NextFunction, Request, Response } from "express";

/** TODO: validate X-Clinic-Api-Key and match :clinicId (see INTERVIEW_EXERCISE.md). */
export function clinicAuth(req: Request, res: Response, next: NextFunction) {
  void req;
  void res;
  next();
}
