import { Locator, Page } from "@playwright/test";

export class RegisterPage {

    readonly page: Page
    readonly registerHeadingElm: Locator;
    readonly firstNameInputElm: Locator;
    readonly lastNameInputElm: Locator;
    readonly emailInputElm: Locator;
    readonly phoneNumberInputElm: Locator;
    readonly occupationDropdownElm: Locator;
    readonly maleRadioElm: Locator;
    readonly femaleRadioElm: Locator;
    readonly passwordInputElm: Locator;
    readonly confirmPasswordInputElm: Locator;
    readonly olderCheckboxElm: Locator;
    readonly registerBtnElm: Locator;
    readonly firstNameErrorElm: Locator;
    readonly emailErrorElm: Locator;
    readonly phoneNumberErrorElm: Locator;
    readonly phoneNumberErrorElm1: Locator;
    readonly passwordErrorElm: Locator;
    readonly confirmPasswordErrorElm: Locator;
    readonly olderCheckboxErrorElm: Locator;
    readonly toasterAlertElm: Locator;
    readonly accountCreatedElm: Locator;

    constructor(page: Page) {
        this.page = page;
        this.registerHeadingElm = page.locator("//h1[text()='Register']");
        this.firstNameInputElm = page.locator("#firstName");
        this.lastNameInputElm = page.locator("#lastName");
        this.emailInputElm = page.locator("#userEmail");
        this.phoneNumberInputElm = page.locator("#userMobile");
        this.occupationDropdownElm = page.locator("select");
        this.maleRadioElm = page.locator("//input[@value='Male']");
        this.femaleRadioElm = page.locator("//input[@value='Female']");
        this.passwordInputElm = page.locator("#userPassword");
        this.confirmPasswordInputElm = page.locator("#confirmPassword");

        this.olderCheckboxElm = page.locator("//input[@type='checkbox']");
        this.registerBtnElm = page.locator("//input[@id='login']");
        this.firstNameErrorElm = page.locator("//*[contains(text(),'*First')]");
        this.emailErrorElm = page.locator("//div[@class='invalid-feedback']//*[contains(text(),'Email')]");
        this.phoneNumberErrorElm = page.locator("//*[contains(text(),'*Phone')]");
        this.phoneNumberErrorElm1 = page.locator("//*[contains(text(),'*only')]");
        this.passwordErrorElm = page.locator("//*[contains(text(),'*Password')]");
        this.confirmPasswordErrorElm = page.locator("//div[@class='invalid-feedback']//*[contains(text(),'Confirm')]");
        this.olderCheckboxErrorElm = page.locator("//*[contains(text(),'*Please')]");
        this.toasterAlertElm = page.locator("#toast-container");
        this.accountCreatedElm = page.locator("//h1[text()='Account Created Successfully']");


    }


    async goto() {
        await this.page.goto("https://rahulshettyacademy.com/client/#/auth/register", { timeout: 60000 });
    }

    // *************************** setters **************************

    async setFirstNameInputElm(firstName: string) {
        await this.firstNameInputElm.fill(firstName);
    }


    async setLastNameInputElm(lastName: string) {
        await this.lastNameInputElm.fill(lastName);
    }


    async setEmailInputElm(email: string) {
        await this.emailInputElm.fill(email);
    }


    async setPhoneNumberInputElm(phone: number | string) {
        await this.phoneNumberInputElm.fill(phone.toString());
    }


    async setOccupationDropdownElm(occupation: string) {
        await this.occupationDropdownElm.selectOption(occupation);
    }


    async clickMaleRadioElm() {
        await this.maleRadioElm.click();
    }

    async clickFemaleRadioElm() {
        await this.femaleRadioElm.click();
    }


    async setPasswordInputElm(password: string | number) {
        await this.passwordInputElm.fill(password.toString());
    }


    async setConfirmPasswordInputElm(confirmPassword: string | number) {
        await this.confirmPasswordInputElm.fill(confirmPassword.toString());
    }


    async clickOlderCheckboxErrorElm() {
        await this.olderCheckboxElm.click();
    }

    async clickRegisterBtnElm() {
        await this.registerBtnElm.click();
    }




    // ***************************** getters **************************

    async getRegisterHeadingElm(): Promise<string | null> {
        return await this.registerHeadingElm.textContent();
    }


    async getFirstNameErrorElm(): Promise<string | null> {
        return await this.firstNameErrorElm.textContent();
    }


    async getEmailErrorElm(): Promise<string | null> {
        return await this.emailErrorElm.textContent();
    }

    async getPhoneNumberErrorElm(): Promise<string | null> {
        return await this.phoneNumberErrorElm.textContent();
    }

    async getPhoneNumberErrorElm1(): Promise<string | null> {
        return await this.phoneNumberErrorElm1.textContent();
    }

    async getPasswordErrorElm(): Promise<string | null> {
        return await this.passwordErrorElm.textContent();
    }

    async getConfirmPasswordErrorElm(): Promise<string | null> {
        return await this.confirmPasswordErrorElm.textContent();
    }

    async getToasterAlertElm(): Promise<string | null> {
        return await this.toasterAlertElm.textContent();
    }

    async getAccountCreatedElm(): Promise<string | null> {
        return await this.accountCreatedElm.textContent();
    }




}