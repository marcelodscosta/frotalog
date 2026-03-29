import { z } from 'zod';

const schema = z.object({
  supplierId: z.string().optional().transform(v => v === 'none' || v === '' ? undefined : v).pipe(z.string().uuid().optional()),
});

console.log(schema.safeParse({ supplierId: "none" }));
console.log(schema.safeParse({ supplierId: "" }));
console.log(schema.safeParse({ supplierId: undefined }));
console.log(schema.safeParse({ supplierId: "123e4567-e89b-12d3-a456-426614174000" }));
console.log(schema.safeParse({ supplierId: "invalid" }));
