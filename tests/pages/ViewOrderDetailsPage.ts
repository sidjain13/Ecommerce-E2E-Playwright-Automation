import { Locator, Page } from "@playwright/test";

export class ViewOrderDetailsPage {
    readonly page: Page;
    readonly orderSummaryTextElm: Locator;
    readonly orderIdTextElm: Locator;
    readonly viewOrdersBtnElm: Locator;


    constructor(page: Page) {
        this.page = page;
        this.orderSummaryTextElm = page.locator(".email-title");
        this.orderIdTextElm = page.locator("//*[@class='col-text -main']");
        this.viewOrdersBtnElm = page.locator("//*[text()=' View Orders ']");
    }


    async getOrderSummaryTextElm(): Promise<string | null> {
        return await this.orderSummaryTextElm.textContent();
    }

    async getOrderIdTextElm(): Promise<string | null> {
        return await this.orderIdTextElm.textContent();
    }

    async clickViewOrdersBtnElm() {
        await this.viewOrdersBtnElm.click();
    }
}