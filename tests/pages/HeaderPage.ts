import { Locator, Page } from "@playwright/test";

export class HeaderPage {
    readonly page: Page;
    readonly homeBtnElm: Locator;
    readonly cartBtnElm: Locator;
    readonly cartCountElm: Locator;
    readonly ordersBtnElm: Locator;
    readonly signOutBtnElm: Locator;


    constructor(page: Page) {
        this.page = page;
        this.homeBtnElm = page.locator("//button[@routerlink='/dashboard/']");
        this.cartBtnElm = page.locator("//button[@routerlink='/dashboard/cart']");
        this.cartCountElm = page.locator("//button[@routerlink='/dashboard/cart']//label");
        this.ordersBtnElm = page.locator("//button[@routerlink='/dashboard/myorders']");
        this.signOutBtnElm = page.locator("//button[text()=' Sign Out ']");

    }

    async getCartCountElm(): Promise<string | null> {
        return await this.cartCountElm.textContent();
    }

    async clickHomeBtnElm() {
        await this.homeBtnElm.click();
    }

    async clickCartBtnElm() {
        await this.cartBtnElm.click();
    }

    async clickOrdersBtnElm() {
        await this.ordersBtnElm.click();
    }

    async clickSignOutBtnElm() {
        await this.signOutBtnElm.click();
    }
}