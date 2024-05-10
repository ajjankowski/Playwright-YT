import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { PaymentPage } from '../pages/payment.page';
import { PulpitPage } from '../pages/pulpit.page';
import { loginData } from '../test-data/login.data';

test.describe('Payment tests', { tag: ['@payment', '@smoke'] }, () => {
    let paymentPage: PaymentPage;

    test.beforeEach(async ({ page }) => {
        const userId = loginData.userId;
        const userPassword = loginData.userPassword;

        await page.goto('/');
        const loginPage = new LoginPage(page);
        await loginPage.login(userId, userPassword);

        const pulpitPage = new PulpitPage(page);
        await pulpitPage.sideMenu.paymentButton.click();
        paymentPage = new PaymentPage(page);
    });

    test('simple payment', { tag: "@positive" }, async ({ page }) => {
        // Arrange
        const transferReceiver = 'Jan Nowak';
        const transferAccount = '12 3456 7890 1234 5678 9012 34568';
        const transferAmount = '222';
        const expectedMessage = `Przelew wykonany! ${transferAmount},00PLN dla Jan Nowak`;
        // Act
        await paymentPage.makeTransfer(transferReceiver, transferAccount, transferAmount)
        // Assert
        await expect(paymentPage.messageText).toHaveText(expectedMessage);
    });
});
