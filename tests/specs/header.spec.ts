import { test, expect, Browser, BrowserContext, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import MainData1 from "../testData/mainData.json"
import { DashboardPage } from "../pages/DashboardPage";
import { CartPage } from "../pages/CartPage";
import { HeaderPage } from "../pages/HeaderPage";
import { mainDataType } from "../utils/types";
import { GlobalPage } from "../pages/GlobalPage";
let dashboardPageObj: DashboardPage;
let headerPageObj: HeaderPage;
let globalPageObj: GlobalPage;

const MainData: mainDataType[] = MainData1;

test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        const screenshot = await page.screenshot({ fullPage: true });
        await testInfo.attach('Full Page Screenshot', {
            body: screenshot,
            contentType: 'image/png',
        });
    }
});



for (const bigData of MainData) {
    // test.use({storageState:bigData.stateFile})

    test.describe('Headers Btn Checking : ', () => {
        test.beforeEach('test', async ({ page }) => {

            let loginPageObj = new LoginPage(page);
            await loginPageObj.goto();
            await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/auth/login");
            expect(await loginPageObj.getLoginHeadingElm()).toBe("Log in");

            await loginPageObj.setEmailInputElm(bigData.loginEmail);
            await loginPageObj.setPasswordInputElm(bigData.loginPassword);
            await loginPageObj.clickLoginBtnElm();

            dashboardPageObj = new DashboardPage(page);
            await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/dash");

            headerPageObj = new HeaderPage(page);
            globalPageObj = new GlobalPage(page);

        });


        test(`Checking Home Btn : ${bigData.loginEmail}`, async ({ page }) => {
            await expect(headerPageObj.homeBtnElm).toBeVisible();
            await expect(headerPageObj.homeBtnElm).toBeEnabled();
            await headerPageObj.clickHomeBtnElm();
            await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/dash");
        });

        test(`Checking Orders Btn : ${bigData.loginEmail}`, async ({ page }) => {
            await expect(headerPageObj.ordersBtnElm).toBeVisible();
            await expect(headerPageObj.ordersBtnElm).toBeEnabled();
            await headerPageObj.clickOrdersBtnElm();
            await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/myorders");
        });

        test(`Checking Cart Btn : ${bigData.loginEmail}`, async ({ page }) => {
            await expect(headerPageObj.cartBtnElm).toBeVisible();
            await expect(headerPageObj.cartBtnElm).toBeEnabled();
            await headerPageObj.clickCartBtnElm();
            await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/cart");
        });

        test(`Checking SignOut Btn : ${bigData.loginEmail}`, async ({ page }) => {
            await expect(headerPageObj.signOutBtnElm).toBeVisible();
            await expect(headerPageObj.signOutBtnElm).toBeEnabled();
            await headerPageObj.clickSignOutBtnElm();


            await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/auth/login");
        });


        test(`Checking cart Count Functionality on header : ${bigData.loginEmail} `, async ({ page }) => {

            if (bigData.products.length == 0) {
                // cart count should be null
                // expect(await headerPageObj.getCartCountElm()).toBe("");
                await expect(headerPageObj.cartCountElm).toHaveText("");
            }
            else {
                let count = 1;
                for (let data of bigData.products) {
                    await dashboardPageObj.clickAddToCartBtnElm(data.productName);
                    await expect(headerPageObj.cartCountElm).toHaveText((count++).toString());
                }
            }

        });






    })


}



