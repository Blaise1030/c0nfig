// lib/generateMdxContent.ts

import { Operation, Config, InstallOperation, AddOperation, UpdateJSONOperation, InputOperation, SelectOperation, ConditionalOperation, AddImportOperation, AddExportOperation, ReadJSONOperation } from '@kmdr/types';
type Context = { manualSteps: number, commandLineSteps: number }
export async function generateMdxContent(operations: Config, host: string): Promise<{ mdxContent: string, manualSteps: number, commandLineSteps: number }> {
    const frontmatter = ``;

    const contentLines: string[] = [];

    // Start the Stepper component
    contentLines.push('<Stepper>');
    contentLines.push('');

    const context = {
        manualSteps: 0,
        commandLineSteps: 1
    }

    // Use a for loop to handle async operations
    for (let index = 0; index < operations.length; index++) {
        const operation = operations[index];
        const operationLines = await renderOperation(operation, index + 1, host, context);
        contentLines.push(...operationLines);
    }

    // Close the Stepper component
    contentLines.push('</Stepper>');
    contentLines.push('');

    const mdxContent = frontmatter + contentLines.join('\n');

    return { mdxContent, ...context };
}

async function renderOperation(operation: Operation, number: number, host: string, context: Context): Promise<string[]> {

    context.manualSteps++

    if (['input', 'select'].includes(operation?.op))
        context.commandLineSteps++

    switch (operation.op) {
        case 'install':
            return renderInstallOperation(operation as InstallOperation, number);
        case 'add':
            return await renderAddOperation(operation as AddOperation, number, host);
        case 'updateJSON':
            return renderUpdateJSONOperation(operation as UpdateJSONOperation, number);
        case 'input':
            return await renderInputOperation(operation as InputOperation, number, host, context);
        case 'select':
            return await renderSelectOperation(operation as SelectOperation, number, host, context);
        case 'conditional':
            return await renderConditionalOperation(operation as ConditionalOperation, number, host, context);
        case 'add-import':
        case 'add-export':
            return renderAddImportExportOperation(operation as AddImportOperation | AddExportOperation, number);
        case 'readJSON':
            return await renderReadJSONOperation(operation as ReadJSONOperation, number, host, context);
        default:
            return renderUnknownOperation(operation, number);
    }
}

// Function to render 'install' operation
function renderInstallOperation(operation: InstallOperation, number: number): string[] {
    const lines: string[] = [];

    lines.push(`<StepperItem title="Install Dependencies">`);
    lines.push('');

    if (operation.dep && operation.dep.length > 0) {
        lines.push(`**Dependencies:**`);
        lines.push('');
        lines.push('```bash');
        lines.push(operation.dep.join('\n'));
        lines.push('```');
        lines.push('');
    }

    if (operation.devDep && operation.devDep.length > 0) {
        lines.push(`**Dev Dependencies:**`);
        lines.push('');
        lines.push('```bash');
        lines.push(operation.devDep.join('\n'));
        lines.push('```');
        lines.push('');
    }

    lines.push(`</StepperItem>`);
    lines.push('');

    return lines;
}

// Function to render 'add' operation
async function renderAddOperation(operation: AddOperation, number: number, host: string): Promise<string[]> {
    const lines: string[] = [];

    lines.push(`<StepperItem title="Add File">`);
    lines.push('');

    lines.push(
        `Copy file from \`${operation.remoteSrc}\` to \`${operation.targetSrc}\`.`
    );
    lines.push('');

    // Fetch the content of the remote file
    const fileUrl = `${host}${operation.remoteSrc}`;
    try {
        const response = await fetch(fileUrl);
        const fileContent = await response.text();

        lines.push('```jsx');
        lines.push(fileContent);
        lines.push('```');
        lines.push('');
    } catch (error) {
        lines.push('```');
        lines.push(`Error fetching file content from ${fileUrl}: ${error.message}`);
        lines.push('```');
        lines.push('');
    }

    lines.push(`</StepperItem>`);
    lines.push('');

    return lines;
}

// Function to render 'updateJSON' operation
function renderUpdateJSONOperation(operation: UpdateJSONOperation, number: number): string[] {
    const lines: string[] = [];

    lines.push(`<StepperItem title="Update JSON">`);
    lines.push('');

    lines.push(
        `Update \`${operation.targetSrc}\` at path \`${operation.path}\` with value \`${operation.value}\`.`
    );
    lines.push('');

    lines.push('```json');
    const updatedJson = JSON.stringify(
        setJsonValue({}, operation.path, operation.value),
        null,
        2
    );
    lines.push(updatedJson);
    lines.push('```');
    lines.push('');

    lines.push(`</StepperItem>`);
    lines.push('');

    return lines;
}

// Function to render 'input' operation
async function renderInputOperation(operation: InputOperation, number: number, host: string, context: Context): Promise<string[]> {
    const lines: string[] = [];

    lines.push(`<StepperItem title="Input Prompt">`);
    lines.push('');

    lines.push(`Prompt: **${operation.title}** (default: \`${operation.defaultValue}\`)`);
    lines.push('');
    lines.push(`Saved value as \`${operation.value}\`.`);
    lines.push('');

    const actionLines = await renderOperations(operation.actions, host, context);
    lines.push(...actionLines);

    lines.push(`</StepperItem>`);
    lines.push('');

    return lines;
}

// Function to render 'select' operation using Tabs component
async function renderSelectOperation(operation: SelectOperation, number: number, host: string, context: Context): Promise<string[]> {
    const lines: string[] = [];

    lines.push(`<StepperItem title="${operation.title}">`);
    lines.push('');

    lines.push(
        `<Tabs defaultValue="${operation.selections[0]?.value}" className="pt-5 pb-1">`
    );
    lines.push(`  <TabsList>`);

    operation.selections.forEach((selection) => {
        lines.push(
            `    <TabsTrigger value="${selection.value}">${selection.label}</TabsTrigger>`
        );
    });

    lines.push(`  </TabsList>`);
    lines.push('');

    for (const selection of operation.selections) {
        lines.push(`  <TabsContent value="${selection.value}">`);
        lines.push('');

        const contentLines = await renderOperations(operation.values[selection.value], host, context);
        const indentedContent = contentLines.map((line) => `    ${line}`);
        lines.push(...indentedContent);

        lines.push(`  </TabsContent>`);
        lines.push('');
    }

    lines.push(`</Tabs>`);
    lines.push('');

    lines.push(`</StepperItem>`);
    lines.push('');

    return lines;
}

// Function to render 'conditional' operation
async function renderConditionalOperation(operation: ConditionalOperation, number: number, host: string, context: Context): Promise<string[]> {
    const lines: string[] = [];

    lines.push(`<StepperItem title="Conditional Operation">`);
    lines.push('');

    lines.push(`If \`${operation.condition}\`, then:`);
    lines.push('');

    const thenLines = await renderOperations(operation.then, host, context);
    lines.push(...thenLines);

    if (operation.else) {
        lines.push('');
        lines.push(`Else:`);
        lines.push('');
        const elseLines = await renderOperations(operation.else, host, context);
        lines.push(...elseLines);
    }

    lines.push(`</StepperItem>`);
    lines.push('');

    return lines;
}

// Function to render 'add-import' and 'add-export' operations
function renderAddImportExportOperation(operation: AddImportOperation | AddExportOperation, number: number): string[] {
    const lines: string[] = [];
    const action = operation.op === 'add-import' ? 'Add Import' : 'Add Export';

    lines.push(`<StepperItem title="${action}">`);
    lines.push('');

    lines.push(`Add the following to \`${operation.targetSrc}\`:`);
    lines.push('');
    lines.push('```jsx');
    lines.push(operation.content);
    lines.push('```');
    lines.push('');

    lines.push(`</StepperItem>`);
    lines.push('');

    return lines;
}

// Function to render 'readJSON' operation
async function renderReadJSONOperation(operation: ReadJSONOperation, number: number, host: string, context: Context): Promise<string[]> {
    const lines: string[] = [];

    lines.push(`<StepperItem title="Read JSON">`);
    lines.push('');

    lines.push(
        `Read value from \`${operation.targetSrc}\` at path \`${operation.path}\`.`
    );
    lines.push('');

    if (operation.value) {
        lines.push(`Save value as \`${operation.value}\`.`);
        lines.push('');
    }

    if (operation.values && Object.keys(operation.values).length > 0) {
        lines.push(
            `<Tabs defaultValue="${Object.keys(operation.values)[0]}" className="pt-5 pb-1">`
        );
        lines.push(`  <TabsList>`);

        Object.keys(operation.values).forEach((key) => {
            lines.push(`    <TabsTrigger value="${key}">${key}</TabsTrigger>`);
        });

        lines.push(`  </TabsList>`);
        lines.push('');

        for (const [key, ops] of Object.entries(operation.values)) {
            lines.push(`  <TabsContent value="${key}">`);
            lines.push('');

            const contentLines = await renderOperations(ops as Config, host, context);
            const indentedContent = contentLines.map((line) => `    ${line}`);
            lines.push(...indentedContent);

            lines.push(`  </TabsContent>`);
            lines.push('');
        }

        lines.push(`</Tabs>`);
        lines.push('');
    }

    lines.push(`</StepperItem>`);
    lines.push('');

    return lines;
}

// Function to render unknown operations
function renderUnknownOperation(operation: Operation, number: number): string[] {
    const lines: string[] = [];

    lines.push(`<StepperItem title="Unknown Operation">`);
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(operation, null, 2));
    lines.push('```');
    lines.push('');
    lines.push(`</StepperItem>`);
    lines.push('');

    return lines;
}

// Helper function to render an array of operations
async function renderOperations(operations: Config, host: string, context: Context): Promise<string[]> {
    let lines: string[] = [];

    // Start a new Stepper for nested operations
    lines.push('<Stepper>');
    lines.push('');

    for (let index = 0; index < operations.length; index++) {
        const operation = operations[index];
        const operationLines = await renderOperation(operation, index + 1, host, context);
        lines.push(...operationLines);
    }

    // Close the nested Stepper
    lines.push('</Stepper>');
    lines.push('');

    return lines;
}

// Utility function to set a JSON value at a given path
function setJsonValue(obj: any, path: string, value: any): any {
    const keys = path.split('.');
    let temp = obj;
    while (keys.length > 1) {
        const key = keys.shift();
        if (key) {
            if (!temp[key]) temp[key] = {};
            temp = temp[key];
        }
    }
    const lastKey = keys.shift();
    if (lastKey) temp[lastKey] = value;
    return obj;
}