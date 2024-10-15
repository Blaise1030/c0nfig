import { ReadJSONOperationSchema, UpdateJSONOperationSchema, ConditionalOperationSchema, OperationSchema, ConfigSchema, InputOperationSchema, AddExportOperationSchema, AddImportOperationSchema, AddOperationSchema, InstallOperationSchema, SelectionSchema, SelectOperationSchema } from "."
import { z } from 'zod';

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