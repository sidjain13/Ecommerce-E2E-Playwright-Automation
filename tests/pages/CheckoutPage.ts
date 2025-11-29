import { Locator, Page } from "@playwright/test";
import { count } from "console";

export class CheckoutPage {

    readonly page: Page;
    readonly emailLabelElm: Locator;
    readonly countryInputElm: Locator;
    readonly placeOrderBtnElm: Locator;
    readonly allCountryDropdownElm: Locator;
    readonly toasterElm: Locator;


    constructor(page: Page) {
        this.page = page;
        this.emailLabelElm = page.locator("//div[contains(@class,'user__name')]//label");
        this.countryInputElm = page.locator("//input[@placeholder='Select Country']");
        // this.placeOrderBtnElm=page.locator("//a[text()='Place Order ']");
        this.placeOrderBtnElm = page.locator("//*[text()='Place Order ']");
        this.allCountryDropdownElm = page.locator("section.ta-results");
        this.toasterElm = page.locator("#toast-container");
    }

    async getEmailLabelElm(): Promise<string | null> {
        return await this.emailLabelElm.textContent();
    }

    async setCountryInputElm(country: string) {

        await this.countryInputElm.click();

        for (let i = 0; i < country.length; i++) {
            await this.countryInputElm.pressSequentially(country[i]);
        }


        await this.allCountryDropdownElm.first().waitFor();

        const countCountry = await this.allCountryDropdownElm.locator("button").count();

        // HANDLING COUNTRY DROPDOWN IN CHECKOUT PAGE
        for (let i = 0; i < countCountry; i++) {

            const text = await this.allCountryDropdownElm.locator("button").nth(i).textContent();
            if (text === (" " + country)) {
                await this.allCountryDropdownElm.locator("button").nth(i).click();
                break;
            }
        }

    }


    async clickPlaceOrderBtnElm() {

        await Promise.all([
            this.page.waitForURL(/.*thanks.*/),
            this.placeOrderBtnElm.click()
        ]);

    }

    async getProductTextElm(productName: string): Promise<string | null> {
        return await this.page.locator(`//*[contains(text(),'${productName}')]`).textContent();
    }

}