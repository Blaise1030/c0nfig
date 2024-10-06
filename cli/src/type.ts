import { z } from 'zod';

// InputOperation Schema
const InputOperationSchema = z.object({
    op: z.literal('input'),
    title: z.string(),
    defaultValue: z.string(),
    value: z.string(),
    actions: z.lazy(() => OperationArraySchema),
});

// Type inference for InputOperation
export type InputOperation = z.infer<typeof InputOperationSchema>;

// AddOperation Schema
const AddOperationSchema = z.object({
    op: z.literal('add'),
    remoteSrc: z.string(),
    targetSrc: z.string(),
});

// Type inference for AddOperation
export type AddOperation = z.infer<typeof AddOperationSchema>;

// AddImportOperation Schema
const AddImportOperationSchema = z.object({
    op: z.literal('add-import'),
    targetSrc: z.string(),
    content: z.string(),
});

// Type inference for AddImportOperation
export type AddImportOperation = z.infer<typeof AddImportOperationSchema>;

// AddExportOperation Schema
const AddExportOperationSchema = z.object({
    op: z.literal('add-export'),
    targetSrc: z.string(),
    content: z.string(),
});

// Type inference for AddExportOperation
export type AddExportOperation = z.infer<typeof AddExportOperationSchema>;

// InstallOperation Schema
const InstallOperationSchema = z.object({
    op: z.literal('install'),
    dep: z.array(z.string()),
    devDep: z.array(z.string()).optional(),
});

// Type inference for InstallOperation
export type InstallOperation = z.infer<typeof InstallOperationSchema>;

// Selection Schema
const SelectionSchema = z.object({
    label: z.string(),
    value: z.string(),
});

// Type inference for Selection
export type Selection = z.infer<typeof SelectionSchema>;

// SelectOperation Schema
const SelectOperationSchema = z.object({
    op: z.literal('select'),
    title: z.string(),
    selections: z.array(SelectionSchema),
    value: z.string(),
    values: z.record(z.string(), z.lazy(() => OperationArraySchema)),
});

// Type inference for SelectOperation
export type SelectOperation = z.infer<typeof SelectOperationSchema>;

// ReadJSONOperation Schema
const ReadJSONOperationSchema = z.object({
    op: z.literal('readJSON'),
    targetSrc: z.string(),
    value: z.string().optional(),
    path: z.string(),
    values: z.record(z.string(), z.lazy(() => OperationArraySchema)),
});

// Type inference for ReadJSONOperation
export type ReadJSONOperation = z.infer<typeof ReadJSONOperationSchema>;

// UpdateJSONOperation Schema
const UpdateJSONOperationSchema = z.object({
    op: z.literal('updateJSON'),
    targetSrc: z.string(),
    path: z.string(),
    value: z.string(),
});

// Type inference for UpdateJSONOperation
export type UpdateJSONOperation = z.infer<typeof UpdateJSONOperationSchema>;

// ConditionalOperation Schema
const ConditionalOperationSchema = z.object({
    op: z.literal('conditional'),
    condition: z.string(),
    then: z.lazy(() => OperationArraySchema),
    else: z.lazy(() => OperationArraySchema).optional(),
});

// Type inference for ConditionalOperation
export type ConditionalOperation = z.infer<typeof ConditionalOperationSchema>;

// Union of all Operations
const OperationSchema = z.discriminatedUnion('op', [
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

// Type inference for Operation
export type Operation = z.infer<typeof OperationSchema>;

// Array of Operations
const OperationArraySchema = z.array(OperationSchema);

// Config Schema
export const ConfigSchema = OperationArraySchema;

// Type inference for Config
export type Config = z.infer<typeof ConfigSchema>;