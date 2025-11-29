import { test, expect, Page } from "@playwright/test";
import { DashboardPage } from "../pages/DashboardPage";
import { CartPage } from "../pages/CartPage";
import MainData1 from "../testData/mainData.json"
import { CheckoutPage } from "../pages/CheckoutPage";
import { LoginPage } from "../pages/LoginPage";
import { ThankYouPage } from "../pages/ThankYouPage";
import { OrdersPage } from "../pages/OrdersPage";
import { HeaderPage } from "../pages/HeaderPage";
import { mainDataType, ordersDataType } from "../utils/types";
import fs from "fs";
import { parse } from "csv-parse/sync"

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

    test(`End to End Test for : ${bigData.loginEmail}`, async ({ page }) => {

        let loginPageObj = new LoginPage(page);
        let headerPageObj = new HeaderPage(page);
        await loginPageObj.goto();
        await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/auth/login");
        expect(await loginPageObj.getLoginHeadingElm()).toBe("Log in");

        await loginPageObj.setEmailInputElm(bigData.loginEmail);
        await loginPageObj.setPasswordInputElm(bigData.loginPassword);
        await loginPageObj.clickLoginBtnElm();


        let dashboardPageObj = new DashboardPage(page);
        await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/dash");


        if (bigData.products.length > 0) {
            for (let product of bigData.products) {
                await dashboardPageObj.clickAddToCartBtnElm(product.productName);
            }
            await expect(headerPageObj.cartCountElm).toHaveText(bigData.products.length.toString());

            await headerPageObj.clickCartBtnElm();
            await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/cart");


            let cartPageObj = new CartPage(page);
            await cartPageObj.clickCheckoutBtnElm();
            expect(page.url()).toContain("order");


            let checkoutPageObj = new CheckoutPage(page);
            await checkoutPageObj.setCountryInputElm(bigData.country);
            await checkoutPageObj.clickPlaceOrderBtnElm();
            expect(page.url()).toContain("thanks");


            let thankYouPageObj = new ThankYouPage(page);

            // downloading csv file
            const [downloadedFile] = await Promise.all([
                page.waitForEvent('download'),
                thankYouPageObj.clickDownloadCsvBtnElm()
            ])

            await downloadedFile.saveAs(`D://EcommerceProject//tests//testData//orders-${bigData.loginEmail}.csv`);

            // reading orders csv file
            const fileContent = fs.readFileSync(`D://EcommerceProject//tests//testData//orders-${bigData.loginEmail}.csv`);
            orderRecords = parse(fileContent, {
                columns: true,
                skip_empty_lines: true
            }) as ordersDataType[];

            let orderPageObj = new OrdersPage(page);
            // let headerPageObj=new HeaderPage(page);
            await headerPageObj.clickOrdersBtnElm();

            for (let record of orderRecords) {
                expect(await orderPageObj.getOrderIdTextElm(record['Invoice Number'])).toBe(record['Invoice Number']);
            }


        }
        else {
            console.log("No product in the data");
        }


    });


}







