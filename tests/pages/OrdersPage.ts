import { Locator, Page } from "@playwright/test";

export class OrdersPage {

    readonly page: Page;
    readonly noOrderTextElm: Locator;



    constructor(page: Page) {
        this.page = page;
        this.noOrderTextElm = page.locator("//div[contains(text(),'No Orders')]");
    }

    // order id finding
    //tbody//tr//th[text()='691781c95008f6a9091fa1a3']
    async goto() {
        await this.page.goto("https://rahulshettyacademy.com/client/#/dashboard/myorders", { timeout: 60000 });
    }


    getOrderIdTextElmLocator(orderId: string): Locator {
        return this.page.locator(`//*[text()='${orderId}']`);
    }

    async getOrderIdTextElm(orderId: string): Promise<string | null> {
        return await this.page.locator(`//*[text()='${orderId}']`).textContent();
    }


    async getNoOrderTextElm(): Promise<string | null> {
        return await this.noOrderTextElm.textContent();
    }

    //*[text()='691c5dc25008f6a90927fff5']//following-sibling::td[6]
    getDeleteBtnElmLocator(orderId: string): Locator {
        return this.getOrderIdTextElmLocator(orderId).locator("//following-sibling::td[6]//button")
    }

    //*[text()='691c5dc25008f6a90927fff5']//following-sibling::td[5]
    getViewBtnElmLocator(orderId: string): Locator {
        return this.getOrderIdTextElmLocator(orderId).locator("//following-sibling::td[5]//button")
    }


    async clickDeleteBtmElm(orderId: string) {
        await this.getDeleteBtnElmLocator(orderId).click();
    }

    async clickViewBtmElm(orderId: string) {
        await this.getViewBtnElmLocator(orderId).click();
    }




}