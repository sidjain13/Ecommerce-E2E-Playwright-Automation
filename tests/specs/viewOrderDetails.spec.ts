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
import { ViewOrderDetailsPage } from "../pages/ViewOrderDetailsPage";
let viewPageObj: ViewOrderDetailsPage;

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




for (const bigData of MainData) {
    // test.use({storageState:bigData.stateFile})

    test.describe(`View Order Details Page : `, () => {


        test.beforeAll("Just for Downloading csv file", async ({ browser }) => {

            test.setTimeout(80000);

            const context = await browser.newContext();
            const page = await context.newPage();

            let loginPageObj = new LoginPage(page);
            let dashboardPageObj = new DashboardPage(page);
            let cartPageObj = new CartPage(page);
            let checkoutPageObj = new CheckoutPage(page);
            let thankYouPageObj = new ThankYouPage(page);

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

                await cartPageObj.goto();
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

        test.beforeEach("going to orders page", async ({ page }) => {

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
            }

        })


        if (bigData.products.length > 0) {

            test(`checking view  functionality : ${bigData.loginEmail}`, async ({ page }) => {
                let orderPageObj = new OrdersPage(page);
                let viewOrderDetailsPageObj = new ViewOrderDetailsPage(page);

                for (let record of orderRecords) {
                    expect(orderPageObj.getViewBtnElmLocator(record['Invoice Number'])).toBeVisible();
                    expect(orderPageObj.getViewBtnElmLocator(record['Invoice Number'])).toBeEnabled();

                    await orderPageObj.clickViewBtmElm(record['Invoice Number']);

                    await expect(page).toHaveURL(`https://rahulshettyacademy.com/client/#/dashboard/order-details/${record['Invoice Number']}`);

                    expect(await viewOrderDetailsPageObj.getOrderSummaryTextElm()).toBe(" order summary ")
                    expect(await viewOrderDetailsPageObj.getOrderIdTextElm()).toBe(record['Invoice Number']);

                    await viewOrderDetailsPageObj.clickViewOrdersBtnElm();
                    await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/myorders")


                    // await orderPageObj.getOrderIdTextElmLocator(record['Invoice Number']).waitFor();
                }
            });
        }

    })

}
