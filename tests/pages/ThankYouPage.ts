import { Locator, Page } from "@playwright/test";

export class ThankYouPage {

    readonly page: Page;
    readonly thankYouTextElm: Locator;
    readonly orderIdElm: Locator;
    readonly downloadCsvBtnElm: Locator;


    constructor(page: Page) {
        this.page = page;
        this.thankYouTextElm = page.locator("h1");
        this.orderIdElm = page.locator("label.ng-star-inserted");
        this.downloadCsvBtnElm = page.locator("//button[contains(text(),'Download')]");

    }


    async getThankYouTextElm(): Promise<string | null> {
        return await this.thankYouTextElm.textContent();
    }

    async getOrderNameTextElm(productName: string): Promise<string | null> {
        return await this.page.locator(`//*[contains(text(),'${productName}')]`).textContent();
    }

    async getOrderIdTextElms(): Promise<string[]> {
        // return await this.orderIdElm.allTextContents();

        let orderId = await this.orderIdElm.allTextContents();

        for (let i = 0; i < orderId.length; i++) {
            if (orderId) {
                let temporaryArray = orderId[i].split(" ");
                orderId[i] = temporaryArray[2];
                // console.log(orderId);
            }
        }


        return orderId;
    }


    async clickDownloadCsvBtnElm() {
        await this.downloadCsvBtnElm.click();
    }




}