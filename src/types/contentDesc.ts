export interface ContentDescConfig {
    content: string;
}
class ContentDesc {
    private content: string;
    constructor(config: ContentDescConfig) {
        this.content = config.content;
    }
    getContent(): string {
        return this.content;
    }

    toConfigJSON(): ContentDescConfig {
        return {
            content: this.content
        };
    }
}

export { ContentDesc };

