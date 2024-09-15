export type TDBConfigStruct = {
  dependencies: string[],
  devDependencies: string[],
  init: string,
  drizzleKit: string,
  schema: string
}

export type TAuthDBConfigStruct = {
  adapter: string;
  "auth-schema": string;
  "oauth-schema": string;
}

export type TAuthConfigStruct = {
  dependencies: string[],
  devDependencies: string[],
  index: string,
  db: {
    sqlite: TAuthDBConfigStruct,
    postgres: TAuthDBConfigStruct,
  }
}