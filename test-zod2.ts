import { z } from 'zod';

const schema = z.object({
  supplierId: z.union([
    z.string().uuid(),
    z.literal('none'),
    z.literal(''),
  ]).optional().nullable().transform(v => (v === '' || v === 'none' || v === null) ? undefined : v),
});

console.log(schema.safeParse({ supplierId: "none" }));
console.log(schema.safeParse({ supplierId: "" }));
console.log(schema.safeParse({ supplierId: undefined }));
console.log(schema.safeParse({ supplierId: "123e4567-e89b-12d3-a456-426614174000" }));
console.log(schema.safeParse({ supplierId: "invalid" }));
