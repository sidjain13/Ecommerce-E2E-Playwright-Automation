import { test, expect, Page } from "@playwright/test";
import { DashboardPage } from "../pages/DashboardPage";
import { CartPage } from "../pages/CartPage";
import MainData1 from "../testData/mainData.json"
import { CheckoutPage } from "../pages/CheckoutPage";
import { LoginPage } from "../pages/LoginPage";
import { ThankYouPage } from "../pages/ThankYouPage";
import { mainDataType } from "../utils/types";
import { HeaderPage } from "../pages/HeaderPage";

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

    test.describe(`Thank You Page : `, () => {

        test.beforeEach("Login + Add To Cart + Checkout + Place order ", async ({ page }) => {

            let loginPageObj = new LoginPage(page);
            let dashboardPageObj = new DashboardPage(page);
            let cartPageObj = new CartPage(page);
            let checkoutPageObj = new CheckoutPage(page);
            let headerPageObj = new HeaderPage(page);

            await loginPageObj.goto();
            await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/auth/login");
            expect(await loginPageObj.getLoginHeadingElm()).toBe("Log in");

            await loginPageObj.setEmailInputElm(bigData.loginEmail);
            await loginPageObj.setPasswordInputElm(bigData.loginPassword);
            await loginPageObj.clickLoginBtnElm();

            await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/dash");

            if (bigData.products.length > 0) {
                for (const product of bigData.products) {
                    await dashboardPageObj.clickAddToCartBtnElm(product.productName);
                }
                // await cartPageObj.goto();
                await headerPageObj.clickCartBtnElm();
                await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/cart");

                await cartPageObj.clickCheckoutBtnElm();
                expect(page.url()).toContain("order");

                await checkoutPageObj.setCountryInputElm(bigData.country);
                await checkoutPageObj.clickPlaceOrderBtnElm();
                expect(page.url()).toContain("thanks");
            }
        })


        if (bigData.products.length > 0) {
            test(`checking Thank you heading On ThP: ${bigData.loginEmail}`, async ({ page }) => {

                let thankYouPageObj = new ThankYouPage(page);
                expect(await thankYouPageObj.getThankYouTextElm()).toBe(" Thankyou for the order. ");

            });



            for (let data of bigData.products) {

                test(`Checking Product Name On ThP: ${bigData.loginEmail} ${data.productName}`, async ({ page }) => {
                    let thankYouPageObj = new ThankYouPage(page);
                    expect(await thankYouPageObj.getOrderNameTextElm(data.productName)).toContain(data.productName);
                });
            }
        }


    })

}







