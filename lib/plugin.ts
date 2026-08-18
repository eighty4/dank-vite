import type { Plugin } from 'vite'
import { addDankDevToPage } from './dev_ui.ts'

export default function DANK(): Plugin {
    return {
        apply: 'serve',
        name: 'DANK',
        async transformIndexHtml(markup: string): Promise<string> {
            return await addDankDevToPage(markup)
        },
    }
}
