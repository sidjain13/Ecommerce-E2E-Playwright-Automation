import { test, expect } from '@playwright/test';
import path from 'path';
import * as XLSX from "xlsx";
import { registerDataType } from '../utils/types';
import { RegisterPage } from '../pages/RegisterPage';
import { GlobalPage } from '../pages/GlobalPage';

let countTest: number = 1;

const workbook = XLSX.readFile(path.join(__dirname, "../testData/registerData.xlsx"));
const sheet = workbook.Sheets['Sheet1'];
const registerData: registerDataType[] = XLSX.utils.sheet_to_json(sheet);


test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        const screenshot = await page.screenshot({ fullPage: true });
        await testInfo.attach('Full Page Screenshot', {
            body: screenshot,
            contentType: 'image/png',
        });
    }
});


for (const data of registerData) {

    test(`Register Test ${countTest++} : ${data.expected}`, async ({ page }) => {
        const registerPageObj = new RegisterPage(page);
        const globalPageObj = new GlobalPage(page);

        // added this b/c website is slow test are failing due to this
        // await page.waitForLoadState('networkidle');

        await registerPageObj.goto();
        await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/auth/register");
        expect(await registerPageObj.getRegisterHeadingElm()).toBe("Register");


        // added this b/c website is slow test are failing due to this
        await registerPageObj.registerBtnElm.waitFor();

        await registerPageObj.setFirstNameInputElm(data.firstName ?? "");
        await registerPageObj.setLastNameInputElm(data.lastName ?? "");
        await registerPageObj.setEmailInputElm(data.email ?? "");
        await registerPageObj.setPhoneNumberInputElm(data.phone ?? "");
        await registerPageObj.setOccupationDropdownElm(data.occupation);

        if (data.gender === "Male") {
            await registerPageObj.clickMaleRadioElm();
        }
        else {
            await registerPageObj.clickFemaleRadioElm();
        }

        await registerPageObj.setPasswordInputElm(data.password ?? "");
        await registerPageObj.setConfirmPasswordInputElm(data.confirmPassword ?? "");

        await registerPageObj.clickOlderCheckboxErrorElm();


        await registerPageObj.clickRegisterBtnElm();

        if (data.expected === "firstName less character") {
            expect(await registerPageObj.getFirstNameErrorElm()).toBe("*First Name must be 3 or more character long");
        }

        else if (data.expected === "firstName empty") {
            expect(await registerPageObj.getFirstNameErrorElm()).toBe("*First Name is required");
        }

        else if (data.expected === "firstName more character") {
            expect(await registerPageObj.getFirstNameErrorElm()).toBe("*First Name must be 12 or less character long");
        }




        else if (data.expected === "lastName empty") {
            // expect(await registerPageObj.getToasterAlertElm()).toBe(" Last Name is required! ");
            expect(await globalPageObj.getToasterTextElm()).toBe(" Last Name is required! ");
        }
        else if (data.expected === "lastName invalid") {
            // expect(await registerPageObj.getToasterAlertElm()).toBe(" last Name must be 3 to 20 characters long! ");
            expect(await globalPageObj.getToasterTextElm()).toBe(" last Name must be 3 to 20 characters long! ");
        }




        else if (data.expected === "invalid email") {
            expect(await registerPageObj.getEmailErrorElm()).toBe("*Enter Valid Email");
        }
        else if (data.expected === "empty email") {
            expect(await registerPageObj.getEmailErrorElm()).toBe("*Email is required");
        }
        else if (data.expected === "email already exists") {
            // expect(await registerPageObj.getToasterAlertElm()).toBe(" User already exisits with this Email Id! ");
            expect(await globalPageObj.getToasterTextElm()).toBe(" User already exisits with this Email Id! ");
        }





        else if (data.expected === "phoneNumber less digit") {
            expect(await registerPageObj.getPhoneNumberErrorElm()).toBe("*Phone Number must be 10 digit");
        }

        else if (data.expected === "phoneNumber more digit") {
            expect(await registerPageObj.getPhoneNumberErrorElm()).toBe("*Phone Number must be 10 digit");
        }

        else if (data.expected === "phoneNumber empty") {
            expect(await registerPageObj.getPhoneNumberErrorElm()).toBe("*Phone Number is required");
        }
        else if (data.expected === "character in phoneNumber") {
            expect(await registerPageObj.getPhoneNumberErrorElm()).toBe("*Phone Number must be 10 digit");
            expect(await registerPageObj.getPhoneNumberErrorElm1()).toBe("*only numbers is allowed");
        }




        else if (data.expected === "empty password") {
            expect(await registerPageObj.getPasswordErrorElm()).toBe("*Password is required");
        }

        else if (data.expected === "empty confirm password") {
            expect(await registerPageObj.getConfirmPasswordErrorElm()).toBe("Confirm Password is required");
        }




        else if (data.expected === "password mismatch") {
            expect(await registerPageObj.getConfirmPasswordErrorElm()).toBe("Password and Confirm Password must match with each other.");
        }
        else if (data.expected === "password character less") {
            // expect(await registerPageObj.getToasterAlertElm()).toBe(" Password must be 8 Character Long! ");
            expect(await globalPageObj.getToasterTextElm()).toBe(" Password must be 8 Character Long! ");
        }
        else if (data.expected === "password critera fail") {
            // expect(await registerPageObj.getToasterAlertElm()).toBe(" Please enter 1 Special Character, 1 Capital 1, Numeric 1 Small ");
            expect(await globalPageObj.getToasterTextElm()).toBe(" Please enter 1 Special Character, 1 Capital 1, Numeric 1 Small ");
        }




        else if (data.expected === "success") {
            expect(await registerPageObj.getAccountCreatedElm()).toBe("Account Created Successfully");
        }



    });
}