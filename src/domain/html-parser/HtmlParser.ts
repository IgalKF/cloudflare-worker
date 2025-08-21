import { NavigationLink, ParsedContent } from "./ParsedContent";
import { HTMLElement, parse } from 'node-html-parser';

export class HtmlParser {
    private content: ParsedContent;
    private document: HTMLElement;

    constructor(html: string) {
        this.content = new ParsedContent();
        this.document = parse(html);
    }
    
    public parse(): ParsedContent {
        return this.content;
    }
    
    public stripDocumentToPlainText(): string {
        let plainText = '';
        try {
            const traverse = (node: HTMLElement) => {
            if ((node.tagName === 'A' || node.tagName === 'a' || node.tagName === 'LINK' || node.tagName === 'link') && node.getAttribute('href')) {
                const text = node.text.trim();
                const href = node.getAttribute('href');
                if (text) {
                plainText += ` | ${text}(${href}) | `;
                }
            } else if (node.childNodes && node.childNodes.length > 0) {
                node.childNodes.forEach(child => {
                try {
                    if (child instanceof HTMLElement) {
                    traverse(child);
                    } else if (child.nodeType === 3) { // text node
                    const text = child.rawText.trim();
                    if (text) {
                        plainText += `${text} `;
                    }
                    }
                } catch (childErr) {
                    console.error('Error traversing child node:', childErr);
                }
                });
            }
            };

            traverse(this.document);
        } catch (err) {
            console.error('Error stripping document to plain text:', err);
        }
        return plainText;
    }
}