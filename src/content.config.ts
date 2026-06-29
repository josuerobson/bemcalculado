import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    updatedDate: z.string().optional(),
    author: z.string().default('Josué R M de Souza'),
    category: z.string(),
    tags: z.array(z.string()),
    calculadora: z.string().optional(),
  }),
});

export const collections = { blog };
