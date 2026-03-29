import { z } from 'zod';

const schema = z.object({
  supplierId: z.string().optional().nullable().transform(val => {
    if (val === 'none' || val === '') return undefined;
    return val;
  }).refine(val => {
    if (val === undefined) return true;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(val);
  }, { message: "Invalid UUID" }),
});

console.log(schema.safeParse({ supplierId: "none" }));
console.log(schema.safeParse({ supplierId: "" }));
console.log(schema.safeParse({ supplierId: undefined }));
console.log(schema.safeParse({ supplierId: "123e4567-e89b-12d3-a456-426614174000" }));
console.log(schema.safeParse({ supplierId: "invalid" }));
