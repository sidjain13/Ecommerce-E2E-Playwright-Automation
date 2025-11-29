import { Locator, Page } from "@playwright/test";

export class GlobalPage {
    readonly page: Page;
    readonly toasterElm: Locator;

    constructor(page: Page) {
        this.page = page;
        this.toasterElm = page.locator("#toast-container");
    }

    async getToasterTextElm(): Promise<string | null> {
        return await this.toasterElm.textContent();
    }
}