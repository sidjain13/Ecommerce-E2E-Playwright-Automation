import { test, expect, Browser, BrowserContext, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import MainData1 from "../testData/mainData.json"
import { DashboardPage } from "../pages/DashboardPage";
import { ViewProductDetailsPage } from "../pages/ViewProductDetailsPage";
import { mainDataType } from "../utils/types";
let dashboardPageObj: DashboardPage;
let viewPageObj: ViewProductDetailsPage;

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

    test.describe('View Product Details Page : ', () => {
        test.beforeEach('Just Login : ', async ({ page }) => {

            let loginPageObj = new LoginPage(page);
            dashboardPageObj = new DashboardPage(page);
            viewPageObj = new ViewProductDetailsPage(page);

            await loginPageObj.goto();
            await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/auth/login");
            expect(await loginPageObj.getLoginHeadingElm()).toBe("Log in");

            await loginPageObj.setEmailInputElm(bigData.loginEmail);
            await loginPageObj.setPasswordInputElm(bigData.loginPassword);
            await loginPageObj.clickLoginBtnElm();

            await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/dash");


        });


        if (bigData.products.length > 0) {
            for (const data of bigData.products) {

                test(`Checking Product Text on VP : ${data.productName} ${bigData.loginEmail}`, async ({ page }) => {

                    await dashboardPageObj.clickViewProductBtnElm(data.productName);

                    await viewPageObj.productTextElm.waitFor();

                    await expect(page).toHaveURL(`https://rahulshettyacademy.com/client/#/dashboard/product-details/${data.productId}`);

                    expect(await viewPageObj.getProductTextElm()).toBe(data.productName);

                });


                test(`Checking Product Amount on VP : ${data.productName} ${bigData.loginEmail}`, async ({ page }) => {

                    await dashboardPageObj.clickViewProductBtnElm(data.productName);
                    await viewPageObj.productAmountElm.waitFor();

                    await expect(page).toHaveURL(`https://rahulshettyacademy.com/client/#/dashboard/product-details/${data.productId}`);

                    expect(await viewPageObj.getProductAmountElm()).toBe(data.productAmount);

                });




                test(`Checking Add to Cart Functionality on VP : ${data.productName} ${bigData.loginEmail}`, async ({ page }) => {



                    await expect(page.locator('#toast-container', { hasText: ' Login Successfully ' })).toBeHidden({ timeout: 10000 });

                    await dashboardPageObj.clickViewProductBtnElm(data.productName);
                    await expect(page).toHaveURL(`https://rahulshettyacademy.com/client/#/dashboard/product-details/${data.productId}`);

                    await viewPageObj.clickAddToCartBtnElm();

                    await expect(page.locator('#toast-container', { hasText: 'Product Added To Cart' })).toBeVisible({ timeout: 5000 });
                });
            }


        }



    })


}
