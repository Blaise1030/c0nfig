'use client'
import AutoForm from "./ui/auto-form";
import z from "zod";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

const filterSchema = z.object({
  search: z.string({ description: 'Filter templates' }).optional(),
  category: z.object({
    authentication: z.boolean({ description: 'Authentication' }).optional(),
    templates: z.boolean({ description: 'Paid' }).optional()
  }),
  technologies: z.object({
    nextJS: z.boolean({ description: 'Next JS' }).optional(),
    honoJS: z.boolean({ description: 'Hono JS' }).optional(),
  }),
  pricing: z.object({
    free: z.boolean({ description: 'Free' }).optional(),
    paid: z.boolean({ description: 'Paid' }).optional()
  }),

})

export function TemplatesFilter() {
  return <div className="flex flex-col gap-4">
    <AutoForm
      onSubmit={(p) => {
        console.log(p)
      }}
      formSchema={filterSchema}
      fieldConfig={{
        search: { inputProps: { placeholder: 'Search templates...', } }
      }}
    >
      {(p) => {
        return <Button variant={'secondary'} className="w-full rounded-3xl">
          View Results
        </Button>
      }}
    </AutoForm>
  </div>
}