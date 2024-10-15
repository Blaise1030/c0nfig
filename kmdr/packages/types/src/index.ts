import { z } from 'zod';

// InputOperation Schema
export const InputOperationSchema = z.object({
    op: z.literal('input'),
    title: z.string(),
    defaultValue: z.string(),
    value: z.string(),
    actions: z.lazy(() => OperationArraySchema),
});

// AddOperation Schema
export const AddOperationSchema = z.object({
    op: z.literal('add'),
    remoteSrc: z.string(),
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
    value: z.string(),
    values: z.record(z.string(), z.lazy(() => OperationArraySchema)),
});

// ReadJSONOperation Schema
export const ReadJSONOperationSchema = z.object({
    op: z.literal('readJSON'),
    targetSrc: z.string(),
    value: z.string().optional(),
    path: z.string(),
    values: z.record(z.string(), z.lazy(() => OperationArraySchema)),
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
    then: z.lazy(() => OperationArraySchema),
    else: z.lazy(() => OperationArraySchema).optional(),
});

// Union of all Operations
export const OperationSchema = z.discriminatedUnion('op', [
    InputOperationSchema,
    AddOperationSchema,
    AddImportOperationSchema,
    AddExportOperationSchema,
    InstallOperationSchema,
    SelectOperationSchema,
    ReadJSONOperationSchema,
    UpdateJSONOperationSchema,
    ConditionalOperationSchema,
]);

// Array of Operations
export const OperationArraySchema = z.array(OperationSchema);

// Config Schema
export const ConfigSchema = OperationArraySchema;

// Type inference for InputOperation
export type InputOperation = z.infer<typeof InputOperationSchema>;

// Type inference for AddOperation
export type AddOperation = z.infer<typeof AddOperationSchema>;

// Type inference for AddImportOperation
export type AddImportOperation = z.infer<typeof AddImportOperationSchema>;

// Type inference for AddExportOperation
export type AddExportOperation = z.infer<typeof AddExportOperationSchema>;

// Type inference for InstallOperation
export type InstallOperation = z.infer<typeof InstallOperationSchema>;

// Type inference for Selection
export type Selection = z.infer<typeof SelectionSchema>;

// Type inference for SelectOperation
export type SelectOperation = z.infer<typeof SelectOperationSchema>;

// Type inference for ReadJSONOperation
export type ReadJSONOperation = z.infer<typeof ReadJSONOperationSchema>;

// Type inference for UpdateJSONOperation
export type UpdateJSONOperation = z.infer<typeof UpdateJSONOperationSchema>;

// Type inference for ConditionalOperation
export type ConditionalOperation = z.infer<typeof ConditionalOperationSchema>;

// Type inference for Operation
export type Operation = z.infer<typeof OperationSchema>;

// Type inference for Config
export type Config = z.infer<typeof ConfigSchema>;