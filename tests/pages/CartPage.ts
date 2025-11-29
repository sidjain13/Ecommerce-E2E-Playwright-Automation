import { Locator, Page } from "@playwright/test";

export class CartPage {
    readonly page: Page;
    readonly continueShoppingBtnElm: Locator;
    readonly checkoutBtnElm: Locator;
    readonly cartEmptyTextElm: Locator;



    constructor(page: Page) {
        this.page = page;
        this.continueShoppingBtnElm = page.locator("//button[@routerlink='/dashboard']");
        this.checkoutBtnElm = page.locator("//button[text()='Checkout']");
        this.cartEmptyTextElm = page.locator("//h1[contains(text(),'No')]");
    }

    async goto() {
        await this.page.goto("https://rahulshettyacademy.com/client/#/dashboard/cart", { timeout: 60000 });
    }


    async clickContinueShoppingBtnElm() {
        await this.continueShoppingBtnElm.click();
    }

    async clickCheckoutBtnElm() {
        await this.checkoutBtnElm.click();
    }


    //p[contains(text(),'68a961459320a140fe1ca57a')]
    getProductIdLocator(productId: string): Locator {
        return this.page.locator(`//p[contains(text(),'${productId}')]`);
    }


    //p[contains(text(),'68a961459320a140fe1ca57a')]
    getBuyNowBtnLocator(productId: string): Locator {
        return this.getProductIdLocator(productId).locator("//parent::div//following-sibling::div//button[contains(text(),'Buy Now')]");
    }


    //p[contains(text(),'68a961459320a140fe1ca57a')]
    getDeleteBtnLocator(productId: string): Locator {
        return this.getProductIdLocator(productId).locator("//parent::div//following-sibling::div//button//i");
    }


    async getProductIdElm(productId: string): Promise<string | null> {
        return await this.getProductIdLocator(productId).textContent();
    }


    //p[contains(text(),'68a961459320a140fe1ca57a')]//following-sibling::h3
    async getProductNameElm(productId: string): Promise<string | null> {
        return await this.getProductIdLocator(productId).locator("//following-sibling::h3").textContent();
    }


    //p[contains(text(),'68a961459320a140fe1ca57a')]//following-sibling::p[contains(text(),'MRP')]
    async getProductMrpElm(productId: string): Promise<string | null> {
        return await this.getProductIdLocator(productId).locator("//following-sibling::p[contains(text(),'MRP')]").textContent();
    }


    //p[contains(text(),'68a961459320a140fe1ca57a')]//parent::div//following-sibling::div//p
    async getProductPriceElm(productId: string): Promise<string | null> {
        return await this.getProductIdLocator(productId).locator("//parent::div//following-sibling::div//p").textContent();
    }


    //p[contains(text(),'68a961459320a140fe1ca57a')]//following-sibling::p[contains(text(),'Stock')]
    async getStockElm(productId: string): Promise<string | null> {
        return await this.getProductIdLocator(productId).locator("//following-sibling::p[contains(text(),'Stock')]").textContent();
    }


    //p[contains(text(),'68a961459320a140fe1ca57a')]//parent::div//following-sibling::div//button[contains(text(),'Buy Now')]
    async clickBuyNowBtnElm(productId: string) {
        await this.getBuyNowBtnLocator(productId).click();
    }


    //p[contains(text(),'68a961459320a140fe1ca57a')]//parent::div//following-sibling::div//button//i
    async clickDeleteBtnElm(productId: string) {
        await this.getDeleteBtnLocator(productId).click();
    }



    async getCartEmtpyTextElm(): Promise<string | null> {
        return await this.cartEmptyTextElm.textContent();
    }

}