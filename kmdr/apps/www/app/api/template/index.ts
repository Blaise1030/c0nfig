// pages/api/templates/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { db, templates, user } from '@/be/db';

export default async function templatesHandler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const userId = session.user.id;

  if (req.method === 'GET') {
    // Fetch all templates for the user
    const userTemplates = await db.query.templates.findMany({
      where: (templates, { eq }) => eq(templates.authorId, userId),
    });

    res.status(200).json(userTemplates);
  } else if (req.method === 'POST') {
    const { title, description, commandJson, url } = req.body;

    const [newTemplate] = await db.insert(templates).values({
      title,
      description,
      authorId: userId,
      commandJson,
      url,
    }).returning();

    res.status(201).json(newTemplate);
  } else {
    res.status(405).end();
  }
}