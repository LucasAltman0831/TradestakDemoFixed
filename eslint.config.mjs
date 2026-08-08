import {FlatCompat} from '@eslint/eslintrc';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const compat=new FlatCompat({baseDirectory:root});
const config=[...compat.extends('next/core-web-vitals','next/typescript'),{ignores:['.next/**','node_modules/**'],rules:{'@typescript-eslint/no-explicit-any':'off','react/no-unescaped-entities':'off'}}];
export default config;
