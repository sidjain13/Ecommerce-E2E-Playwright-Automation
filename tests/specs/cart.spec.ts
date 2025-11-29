import { test, expect, Browser, BrowserContext, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { CartPage } from "../pages/CartPage";
import MainData1 from "../testData/mainData.json"
import { mainDataType } from "../utils/types";


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



for (let bigData of MainData) {

    test.describe("Cart Page : ", () => {

        test.beforeEach("Login + Add to cart + Going to cart", async ({ page }) => {


            let loginPageObj = new LoginPage(page);
            await loginPageObj.goto();
            await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/auth/login");
            expect(await loginPageObj.getLoginHeadingElm()).toBe("Log in");


            await loginPageObj.setEmailInputElm(bigData.loginEmail);
            await loginPageObj.setPasswordInputElm(bigData.loginPassword);
            await loginPageObj.clickLoginBtnElm();

            let dashboardPageObj = new DashboardPage(page);
            await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/dash");


            for (let products of bigData.products) {
                await dashboardPageObj.clickAddToCartBtnElm(products.productName);
            }

            // cartPageObj = new CartPage(page);
            // await cartPageObj.goto();
            await dashboardPageObj.clickCartBtnElm();
            await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/cart");


        })




        if (bigData.products.length == 0) {

            test(`Empty Product User on CP: ${bigData.loginEmail}`, async ({ page }) => {
                let cartPageObj = new CartPage(page);
                let dashboardPageObj = new DashboardPage(page);

                await dashboardPageObj.clickCartBtnElm();
                expect(await cartPageObj.getCartEmtpyTextElm()).toBe("No Products in Your Cart !");

                await expect(page.locator('#toast-container', { hasText: ' Login Successfully ' }))
                    .toBeHidden({ timeout: 10000 });

                // expect(await dashboardPageObj.getToastAlertElm(),).toBe(" No Products in Your Cart");
            });

        }
        else {
            for (let data of bigData.products) {

                test(`checking basic prouduct Detail on CP: ${data.productName} ${bigData.loginEmail}`, async ({ page }) => {
                    let cartPageObj = new CartPage(page);
                    await cartPageObj.getProductIdLocator(data.productId).waitFor();

                    expect(await cartPageObj.getProductIdElm(data.productId)).toBe("#" + data.productId);
                    expect(await cartPageObj.getProductNameElm(data.productId)).toBe(data.productName);
                    expect(await cartPageObj.getProductMrpElm(data.productId)).toBe(" MRP " + data.productAmount);
                    expect(await cartPageObj.getProductPriceElm(data.productId)).toBe(data.productAmount);

                });

                test(`checking buy now button on CP : ${data.productName} ${bigData.loginEmail}`, async ({ page }) => {
                    let cartPageObj = new CartPage(page);

                    await expect(cartPageObj.getBuyNowBtnLocator(data.productId)).toBeVisible();
                    await expect(cartPageObj.getBuyNowBtnLocator(data.productId)).toBeEnabled();

                    await cartPageObj.clickBuyNowBtnElm(data.productId);
                    expect(page.url()).toContain(data.productId);
                    expect(page.url()).toContain("order");
                });


                // here some test may fail b/c the same token is there for all the users to authenticate that's why due to autmation one product may selected twice
                // and due to which an error of strict violation came
                test(`checking delete button on CP : ${data.productName} ${bigData.loginEmail}`, async ({ page }) => {
                    let cartPageObj = new CartPage(page);

                    await expect(cartPageObj.getDeleteBtnLocator(data.productId)).toBeVisible();
                    await expect(cartPageObj.getDeleteBtnLocator(data.productId)).toBeEnabled();


                    await cartPageObj.clickDeleteBtnElm(data.productId);
                    await expect(page.locator(`text=${data.productName}`)).toHaveCount(0);
                });






            }


            test(`checking continue shopping button on cart page : ${bigData.loginEmail}`, async ({ page }) => {
                let cartPageObj = new CartPage(page);


                await cartPageObj.clickContinueShoppingBtnElm();
                expect(page.url()).toBe("https://rahulshettyacademy.com/client/#/dashboard/dash")

            });

            test(`checking checkout button on cart page : ${bigData.loginEmail}`, async ({ page }) => {
                let cartPageObj = new CartPage(page);

                await cartPageObj.clickCheckoutBtnElm();
                expect(page.url()).toContain("order");

            });
        }



    })



}




