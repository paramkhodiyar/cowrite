import { createClient } from '@sanity/client';
export const client = createClient({
    projectId: 'uj1z65p3',
    dataset: 'production',
    useCdn: true,
  });