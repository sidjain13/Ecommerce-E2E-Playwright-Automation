import { test, expect, Browser, BrowserContext, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import MainData1 from "../testData/mainData.json"
import { DashboardPage } from "../pages/DashboardPage";
import { CartPage } from "../pages/CartPage";
import { mainDataType } from "../utils/types";
let dashboardPageObj: DashboardPage;
let count = 1;

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

    test.describe('Dashboard Page : ', () => {
        test.beforeEach('Just for Login : ', async ({ page }) => {

            let loginPageObj = new LoginPage(page);
            await loginPageObj.goto();
            await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/auth/login");
            expect(await loginPageObj.getLoginHeadingElm()).toBe("Log in");

            await loginPageObj.setEmailInputElm(bigData.loginEmail);
            await loginPageObj.setPasswordInputElm(bigData.loginPassword);
            await loginPageObj.clickLoginBtnElm();

            dashboardPageObj = new DashboardPage(page);
            await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/dash");

        });


        if (bigData.products.length == 0) {

            test(`Empty Product User : ${bigData.loginEmail}`, async ({ page }) => {
                // do nothing for this
            });

        }
        else {
            for (const data of bigData.products) {

                test(`Checking Product Text on DP ${count++}: ${data.productName} ${bigData.loginEmail}`, async ({ page }) => {

                    let productText = await dashboardPageObj.getProductText(data.productName);
                    expect(productText).toBe(data.productName);

                });


                test(`Checking Product Amount on DP ${count++}: ${data.productName} ${bigData.loginEmail}`, async ({ page }) => {

                    let productAmount = await dashboardPageObj.getProductAmount(data.productName);
                    expect(productAmount).toBe(data.productAmount);

                });


                test(`Checking View Button on DP ${count++}: ${data.productName} ${bigData.loginEmail}`, async ({ page }) => {

                    // checking viewButton of product
                    await expect(dashboardPageObj.getViewProductBtnLocator(data.productName)).toBeVisible();
                    await expect(dashboardPageObj.getViewProductBtnLocator(data.productName)).toBeEnabled();

                    await dashboardPageObj.clickViewProductBtnElm(data.productName);
                    await expect(page).toHaveURL(`https://rahulshettyacademy.com/client/#/dashboard/product-details/${data.productId}`);
                });



                test(`Checking Add to Cart Functionality on DP ${count++}: ${data.productName} ${bigData.loginEmail}`, async ({ page }) => {

                    await expect(dashboardPageObj.getAddToCartBtnLocator(data.productName)).toBeVisible();
                    await expect(dashboardPageObj.getAddToCartBtnLocator(data.productName)).toBeEnabled();


                    await expect(page.locator('#toast-container', { hasText: ' Login Successfully ' }))
                        .toBeHidden({ timeout: 10000 });

                    await dashboardPageObj.clickAddToCartBtnElm(data.productName);

                    await expect(page.locator('#toast-container', { hasText: 'Product Added To Cart' }))
                        .toBeVisible({ timeout: 5000 });
                });
            }
        }


    })


}





