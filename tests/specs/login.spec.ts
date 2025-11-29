import { test, expect } from '@playwright/test';
import LoginData from "../testData/loginData.json";
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { loginDataType } from '../utils/types';
import { GlobalPage } from '../pages/GlobalPage';

let countTest: number = 1;
const loginData: loginDataType[] = LoginData;

test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        const screenshot = await page.screenshot({ fullPage: true });
        await testInfo.attach('Full Page Screenshot', {
            body: screenshot,
            contentType: 'image/png',
        });
    }
});



for (const data of loginData) {
    test(`Login test ${countTest++} : ${data.expected}`, async ({ page }) => {
        const loginPageObj = new LoginPage(page);
        const globalPageObj = new GlobalPage(page);

        await loginPageObj.goto();
        await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/auth/login");
        expect(await loginPageObj.getLoginHeadingElm()).toBe("Log in");

        await loginPageObj.setEmailInputElm(data.loginEmail);
        await loginPageObj.setPasswordInputElm(data.loginPassword);
        await loginPageObj.clickLoginBtnElm();

        if (data.expected === 'success') {
            await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/dash");
        }
        else if (data.expected === 'invalid email') {
            expect("*Enter Valid Email").toBe(await loginPageObj.emailErrorElm.innerText());
        }
        else if (data.expected === 'empty email') {
            expect("*Email is required").toBe(await loginPageObj.emailErrorElm.innerText());
        }
        else if (data.expected === 'empty password') {
            expect("*Password is required").toBe(await loginPageObj.passwordErrorElm.innerText());
        }
        else if (data.expected === 'both empty') {
            expect("*Email is required").toBe(await loginPageObj.emailErrorElm.innerText());
            expect("*Password is required").toBe(await loginPageObj.passwordErrorElm.innerText());
        }
        else if (data.expected === 'failure') {
            expect(await globalPageObj.getToasterTextElm()).toContain("Incorrect email or password")
        }
    })
}