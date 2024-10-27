import { z } from 'zod';

// Define OperationSchema with explicit type annotation to avoid implicit 'any' error
export const OperationSchema: z.ZodType = z.lazy(() =>
    z.discriminatedUnion('op', [
        InputOperationSchema,
        AddOperationSchema,
        AddImportOperationSchema,
        AddExportOperationSchema,
        InstallOperationSchema,
        SelectOperationSchema,
        ReadJSONOperationSchema,
        UpdateJSONOperationSchema,
        ConditionalOperationSchema,
    ])
);

// Define OperationArraySchema
export const OperationArraySchema = z.array(OperationSchema);

// InputOperation Schema
export const InputOperationSchema = z.object({
    op: z.literal('input'),
    title: z.string(),
    defaultValue: z.string(),
    value: z.string()?.regex(/^\$/, 'Variables must start with a $'),
    actions: OperationArraySchema,
});

// AddOperation Schema
export const AddOperationSchema = z.object({
    op: z.literal('add'),
    content: z.string(),
    targetSrc: z.string(),
});

// AddImportOperation Schema
export const AddImportOperationSchema = z.object({
    op: z.literal('add-import'),
    targetSrc: z.string(),
    content: z.string(),
});

// AddExportOperation Schema
export const AddExportOperationSchema = z.object({
    op: z.literal('add-export'),
    targetSrc: z.string(),
    content: z.string(),
});

// InstallOperation Schema
export const InstallOperationSchema = z.object({
    op: z.literal('install'),
    dep: z.array(z.string()),
    devDep: z.array(z.string()).optional(),
});

// Selection Schema
export const SelectionSchema = z.object({
    label: z.string(),
    value: z.string(),
});

// SelectOperation Schema
export const SelectOperationSchema = z.object({
    op: z.literal('select'),
    title: z.string(),
    selections: z.array(SelectionSchema),
    value: z.string().regex(/^\$/, 'Variables must start with a $'),
    values: z.record(z.string(), OperationArraySchema),
});

// ReadJSONOperation Schema
export const ReadJSONOperationSchema = z.object({
    op: z.literal('readJSON'),
    targetSrc: z.string(),
    value: z.string().regex(/^\$/, 'Variables must start with a $').optional(),
    path: z.string(),
    values: z.record(z.string(), OperationArraySchema),
});

// UpdateJSONOperation Schema
export const UpdateJSONOperationSchema = z.object({
    op: z.literal('updateJSON'),
    targetSrc: z.string(),
    path: z.string(),
    value: z.string(),
});

// ConditionalOperation Schema
export const ConditionalOperationSchema = z.object({
    op: z.literal('conditional'),
    condition: z.string(),
    then: OperationArraySchema,
    else: OperationArraySchema.optional(),
});

export const OperationConfigSchema = z.object({
    $schema: z.string(),
    title: z.string(),
    description: z.string(),
    version: z.number(),
    operation: OperationArraySchema,
})

// Config Schema
export const ConfigSchema = OperationArraySchema;

// Type inference using z.infer
export type InputOperation = z.infer<typeof InputOperationSchema>;
export type AddOperation = z.infer<typeof AddOperationSchema>;
export type AddImportOperation = z.infer<typeof AddImportOperationSchema>;
export type AddExportOperation = z.infer<typeof AddExportOperationSchema>;
export type InstallOperation = z.infer<typeof InstallOperationSchema>;
export type Selection = z.infer<typeof SelectionSchema>;
export type SelectOperation = z.infer<typeof SelectOperationSchema>;
export type ReadJSONOperation = z.infer<typeof ReadJSONOperationSchema>;
export type UpdateJSONOperation = z.infer<typeof UpdateJSONOperationSchema>;
export type ConditionalOperation = z.infer<typeof ConditionalOperationSchema>;

export type Operation =
    | InputOperation
    | AddOperation
    | AddImportOperation
    | AddExportOperation
    | InstallOperation
    | SelectOperation
    | ReadJSONOperation
    | UpdateJSONOperation
    | ConditionalOperation;

export type Config = Operation[];

export type OperationConfig = {
    title: string;
    description: string;
    version: number;
    operation: Config;
};