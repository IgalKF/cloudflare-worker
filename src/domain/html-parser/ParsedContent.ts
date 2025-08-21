export interface NavigationLink {
    text: string;
    href: string;
}

export class ParsedContent {
    navigationLinks: NavigationLink[];
    mainContent: string;
    footerContent: string;
    headerContent: string;

    constructor(
        navigationLinks: NavigationLink[] = [],
        mainContent: string = '',
        footerContent: string = '',
        headerContent: string = ''
    ) {
        this.navigationLinks = navigationLinks;
        this.mainContent = mainContent;
        this.footerContent = footerContent;
        this.headerContent = headerContent;
    }
}