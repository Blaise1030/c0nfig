import { OperationConfigSchema } from "@k0nfig/types"
import { NextResponse } from "next/server";
import zodToJsonSchema from "zod-to-json-schema"

export const dynamic = 'force-static';

export const GET = () => {
  const schema = zodToJsonSchema(OperationConfigSchema, { errorMessages: true })
  return NextResponse.json(schema)
}