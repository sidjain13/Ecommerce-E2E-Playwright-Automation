import { Locator, Page } from "@playwright/test";

export class DashboardPage {
    readonly page: Page;
    readonly automationTextElm: Locator;
    readonly cardBodyElm: Locator;
    readonly toastAlertElm: Locator;
    readonly cartCountElm: Locator;
    readonly cartBtnElm: Locator;
    readonly ordersBtnElm: Locator;



    constructor(page: Page) {
        this.page = page;
        this.automationTextElm = page.locator("//*[text()='Automation Practice']");
        this.cardBodyElm = page.locator("//div[@class='card-body']");
        this.toastAlertElm = page.locator("#toast-container");
        this.cartCountElm = page.locator("//button[@routerlink='/dashboard/cart']//label");
        this.cartBtnElm = page.locator("//button[@routerlink='/dashboard/cart']");
        this.ordersBtnElm = page.locator("//button[@routerlink='/dashboard/myorders']");

    }


    async goto() {
        await this.page.goto("https://rahulshettyacademy.com/client/#/dashboard/dash", { timeout: 60000 });
    }

    //div[@class='card-body']//b[text()='ZARA COAT 3']
    async getProductText(productName: string): Promise<string | null> {
        return await this.cardBodyElm.locator(`//b[text()='${productName}']`).textContent();
    }


    //div[@class='card-body']//b[text()='ZARA COAT 3']//parent::h5//following-sibling::div//div
    async getProductAmount(productName: string): Promise<string | null> {
        return await this.cardBodyElm.locator(`//b[text()='${productName}']//parent::h5//following-sibling::div//div`).textContent();
    }

    //div[@class='card-body']//b[text()='ZARA COAT 3']//parent::h5//following-sibling::button[contains(text(),'View')]
    getViewProductBtnLocator(productName: string): Locator {
        return this.cardBodyElm.locator(`//b[text()='${productName}']//parent::h5//following-sibling::button[contains(text(),'View')]`);
    }

    //div[@class='card-body']//b[text()='ZARA COAT 3']//parent::h5//following-sibling::button[contains(text(),'Add')]
    getAddToCartBtnLocator(productName: string): Locator {
        return this.cardBodyElm.locator(`//b[text()='${productName}']//parent::h5//following-sibling::button[contains(text(),'Add')]`);
    }

    async clickViewProductBtnElm(productName: string) {
        await this.getViewProductBtnLocator(productName).click();
    }

    async clickAddToCartBtnElm(productName: string) {
        await this.getAddToCartBtnLocator(productName).click();
    }


    getProductPageUrl(): string {
        return this.page.url();
    }

    async getToastAlertElm(): Promise<string | null> {
        return await this.toastAlertElm.textContent();
    }

    async getCartCountElm(): Promise<string | null> {
        return await this.cartCountElm.textContent();
    }


    async clickCartBtnElm() {
        await this.cartBtnElm.click();
    }

    async clickOrdersBtnElm() {
        await this.ordersBtnElm.click();
    }

}