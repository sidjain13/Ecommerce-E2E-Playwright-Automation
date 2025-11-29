import { test, expect, Page } from "@playwright/test";
import { DashboardPage } from "../pages/DashboardPage";
import { CartPage } from "../pages/CartPage";
import MainData1 from "../testData/mainData.json"
import { CheckoutPage } from "../pages/CheckoutPage";
import { LoginPage } from "../pages/LoginPage";
import { ThankYouPage } from "../pages/ThankYouPage";
import { OrdersPage } from "../pages/OrdersPage";
import { HeaderPage } from "../pages/HeaderPage";
import fs from "fs";
import { parse } from "csv-parse/sync"
import { mainDataType, ordersDataType } from "../utils/types";

let orderRecords: ordersDataType[] = [];
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

    test.describe(`Orders Page : `, () => {


        test.beforeAll("Login + Add to Cart + Checkout + PlaceOrder + Downloading Order Csv file on ThP", async ({ browser }) => {

            test.setTimeout(80000);

            const context = await browser.newContext();
            const page = await context.newPage();

            let loginPageObj = new LoginPage(page);
            let dashboardPageObj = new DashboardPage(page);
            let cartPageObj = new CartPage(page);
            let checkoutPageObj = new CheckoutPage(page);
            let thankYouPageObj = new ThankYouPage(page);
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

                // downloading csv file
                const [downloadedFile] = await Promise.all([
                    page.waitForEvent('download'),
                    thankYouPageObj.clickDownloadCsvBtnElm()
                ])

                await downloadedFile.saveAs(`D://EcommerceProject//tests//testData//orders-${bigData.loginEmail}.csv`);
            }




            await context.close();

        })

        test.beforeEach("going to cart page", async ({ page }) => {

            let loginPageObj = new LoginPage(page);
            let headersPageObj = new HeaderPage(page);

            await loginPageObj.goto();
            await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/auth/login");
            expect(await loginPageObj.getLoginHeadingElm()).toBe("Log in");

            await loginPageObj.setEmailInputElm(bigData.loginEmail);
            await loginPageObj.setPasswordInputElm(bigData.loginPassword);
            await loginPageObj.clickLoginBtnElm();

            await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/dash");

            await headersPageObj.clickOrdersBtnElm();
            await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/myorders")



            if (bigData.products.length > 0) {
                // reading orders csv file
                const fileContent = fs.readFileSync(`D://EcommerceProject//tests//testData//orders-${bigData.loginEmail}.csv`);
                orderRecords = parse(fileContent, {
                    columns: true,
                    skip_empty_lines: true
                }) as ordersDataType[];

                // this is added b/c i want the order page is loaded properly before interacting
                await page.locator("//*[text()='View']").first().waitFor();
            }

        })


        if (bigData.products.length == 0) {
            test('Orders Page empty on OP : ', async ({ page }) => {
                let orderPageObj = new OrdersPage(page);
                expect(await orderPageObj.getNoOrderTextElm()).toBe(" You have No Orders to show at this time. Please Visit Back Us ");
            });
        }
        else {
            test(`checking order id on OP : ${bigData.loginEmail}`, async ({ page }) => {
                let orderPageObj = new OrdersPage(page);
                for (let record of orderRecords) {
                    expect(await orderPageObj.getOrderIdTextElm(record['Invoice Number'])).toBe(record['Invoice Number']);
                }
            });


            test(`checking delete button functionality on OP : ${bigData.loginEmail}`, async ({ page }) => {
                let orderPageObj = new OrdersPage(page);
                for (let record of orderRecords) {
                    expect(orderPageObj.getDeleteBtnElmLocator(record['Invoice Number'])).toBeVisible();
                    expect(orderPageObj.getDeleteBtnElmLocator(record['Invoice Number'])).toBeEnabled();

                    await orderPageObj.clickDeleteBtmElm(record['Invoice Number']);

                    await expect(orderPageObj.getOrderIdTextElmLocator(record['Invoice Number'])).toHaveCount(0, { timeout: 20000 });
                }
            });

            test(`checking view button functionality on OP : ${bigData.loginEmail}`, async ({ page }) => {
                let orderPageObj = new OrdersPage(page);
                for (let record of orderRecords) {
                    expect(orderPageObj.getViewBtnElmLocator(record['Invoice Number'])).toBeVisible();
                    expect(orderPageObj.getViewBtnElmLocator(record['Invoice Number'])).toBeEnabled();

                    await orderPageObj.clickViewBtmElm(record['Invoice Number']);

                    await expect(page).toHaveURL(`https://rahulshettyacademy.com/client/#/dashboard/order-details/${record['Invoice Number']}`);
                    await page.goBack();
                    await orderPageObj.getOrderIdTextElmLocator(record['Invoice Number']).waitFor();
                }
            });
        }

    })

}
