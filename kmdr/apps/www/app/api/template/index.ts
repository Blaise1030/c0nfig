// pages/api/templates/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { db, templates, user } from '@/be/db';
import { eq } from 'drizzle-orm';

export default async function templatesHandler(req: NextApiRequest, res: NextApiResponse) {

  const database = await db.query.templates.findMany({ limit: 9 })

  return {}
}