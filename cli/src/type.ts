export type Config = Operation[];
type Operation = AddImportOperation | AddOperation | AddExportOperation | InstallOperation | SelectOperation | ReadJSONOperation | UpdateJSONOperation | InputOperation | ConditionalOperation;


export interface InputOperation {
    op: 'input';
    title: string;
    defaultValue: string;
    value: string;
    actions: Operation[];
}

export interface AddOperation {
    op: 'add';
    remoteSrc: string;
    targetSrc: string;
}

export interface AddImportOperation {
    op: 'add-import';
    targetSrc: string;
    content: string;
}

export interface AddExportOperation {
    op: 'add-export';
    targetSrc: string;
    content: string;
}

export interface InstallOperation {
    op: 'install';
    dep: string[];
    devDep?: string[];
}

export interface Selection {
    label: string;
    value: string;
}

export interface SelectOperation {
    op: 'select';
    title: string;
    selections: Selection[];
    value: string,
    values: {
        [key: string]: Operation[];
    };
}

export interface ReadJSONOperation {
    targetSrc: './setup.json',
    value?: string;
    op: 'readJSON';
    path: string;
    values: {
        [key: string]: Operation[];
    };
}

export interface UpdateJSONOperation {
    op: "updateJSON",
    targetSrc: string,
    path: string,
    value: string
}

export interface ConditionalOperation {
    op: 'conditional';
    condition: string;
    then: Config;
    else?: Config;
}