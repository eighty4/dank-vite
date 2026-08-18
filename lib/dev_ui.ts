import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { type DefaultTreeAdapterTypes, html, parse, serialize } from 'parse5'

type Document = DefaultTreeAdapterTypes.Document
type Element = DefaultTreeAdapterTypes.Element
type ParentNode = DefaultTreeAdapterTypes.ParentNode

export async function addDankDevToPage(markup: string): Promise<string> {
    const doc = parse(markup)
    const head = findHead(doc)
    prependScript(head, await readDankDevJS())
    return serialize(doc)
}

function findHead(doc: Document): ParentNode {
    const head = (doc.childNodes[1] as ParentNode).childNodes[0] as ParentNode
    if (head.nodeName !== 'head') {
        throw TypeError()
    }
    return head
}

function prependScript(head: ParentNode, js: string) {
    const script: Element = {
        nodeName: 'script',
        tagName: 'script',
        attrs: [{ name: 'type', value: 'module' }],
        childNodes: [],
        parentNode: head,
        namespaceURI: html.NS.HTML,
    }
    head.childNodes.unshift(script)
    script.childNodes.push({
        nodeName: '#text',
        value: js,
        parentNode: script,
    })
}

let readingDankDevJS: Promise<string> | null = null

async function readDankDevJS(): Promise<string> {
    if (readingDankDevJS === null) {
        readingDankDevJS = readFile(
            join(import.meta.dirname, '../client/bootstrap.page.js'),
            'utf8',
        )
    }
    return await readingDankDevJS
}
