import { test, expect, Page } from "@playwright/test";
import { DashboardPage } from "../pages/DashboardPage";
import { CartPage } from "../pages/CartPage";
import MainData1 from "../testData/mainData.json"
import { CheckoutPage } from "../pages/CheckoutPage";
import { LoginPage } from "../pages/LoginPage";
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

    test.describe(`Checkout Page : `, () => {

        test.beforeEach("Just Login + Add to Cart + Click Checkout ", async ({ page }) => {

            let loginPageObj = new LoginPage(page);
            const dashboardPageObj = new DashboardPage(page);
            let cartPageObj = new CartPage(page);
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

                await headerPageObj.clickCartBtnElm();

                await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/cart");
                await cartPageObj.clickCheckoutBtnElm();
                expect(page.url()).toContain("order");
                await page.locator("//*[text()=' Payment Method ']").waitFor();
            }
            else {
                await headerPageObj.clickCartBtnElm();
                await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/cart");
            }



        })

        if (bigData.products.length > 0) {
            test(`Checking email id on ChP: ${bigData.loginEmail}`, async ({ page }) => {

                let checkoutPageObj = new CheckoutPage(page);
                expect(await checkoutPageObj.getEmailLabelElm()).toBe(bigData.loginEmail);

            });


            test(`filling country on ChP : ${bigData.loginEmail}`, async ({ page }) => {

                let checkoutPageObj = new CheckoutPage(page);
                await checkoutPageObj.setCountryInputElm(bigData.country);
                expect(await checkoutPageObj.countryInputElm.inputValue()).toBe(bigData.country);

            });

            test(`Checking PlaceOrder Button on ChP : ${bigData.loginEmail}`, async ({ page }) => {

                let checkoutPageObj = new CheckoutPage(page);
                await expect(checkoutPageObj.placeOrderBtnElm).toBeVisible();
                await expect(checkoutPageObj.placeOrderBtnElm).toBeEnabled();

                await checkoutPageObj.setCountryInputElm(bigData.country);

                await checkoutPageObj.clickPlaceOrderBtnElm();
                expect(page.url()).toContain("thanks");
            });



            for (let data of bigData.products) {

                test(`Checking Product name on ChP: ${bigData.loginEmail} ${data.productName}`, async ({ page }) => {
                    let checkoutPageObj = new CheckoutPage(page);
                    expect(await checkoutPageObj.getProductTextElm(data.productName)).toContain(data.productName);

                });
            }
        }



    })

}







