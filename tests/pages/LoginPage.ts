import { Locator, Page } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly emailInputElm: Locator;
    readonly passwordInputElm: Locator;
    readonly loginBtnElm: Locator;
    readonly emailErrorElm: Locator;
    readonly passwordErrorElm: Locator;
    readonly loginHeadingElm: Locator;
    readonly registerBtnElm: Locator;
    readonly forgotPasswordElm: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInputElm = page.locator("#userEmail");
        this.passwordInputElm = page.locator("#userPassword");
        this.loginBtnElm = page.locator("#login")
        this.emailErrorElm = page.locator("//*[contains(text(),'*E')]");
        this.passwordErrorElm = page.locator("//div[text()='*Password is required']");
        this.loginHeadingElm = page.locator("//h1[text()='Log in']");
        this.registerBtnElm = page.locator("//*[text()='Register']");
        this.forgotPasswordElm = page.locator("//*[text()='Forgot password?']");

    }

    async goto() {
        await this.page.goto("https://rahulshettyacademy.com/client", { timeout: 80000 });
    }

    async getLoginHeadingElm(): Promise<string | null> {
        return await this.loginHeadingElm.textContent();
    }

    async setEmailInputElm(email: string) {
        await this.emailInputElm.fill(email);
    }

    async setPasswordInputElm(password: string) {
        await this.passwordInputElm.fill(password);
    }

    async clickLoginBtnElm() {
        await this.loginBtnElm.click();
    }

    async clickRegisterBtnElm() {
        await this.registerBtnElm.click();
    }

    async clickForgotPasswordElm() {
        await this.forgotPasswordElm.click();
    }

    async clickLoginHeadingElm() {
        await this.loginHeadingElm.click();
    }
}