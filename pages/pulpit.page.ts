import { Page } from "@playwright/test";
import { SideMenuComponent } from "../components/side-menu.component";

export class PulpitPage {
    constructor(private page: Page) { }

    sideMenu = new SideMenuComponent(this.page);

    transferReceiver = this.page.locator('#widget_1_transfer_receiver');
    transferAmount = this.page.locator('#widget_1_transfer_amount');
    transferTitle = this.page.locator('#widget_1_transfer_title');
    executeButton = this.page.locator('#execute_btn');
    closeButton = this.page.getByTestId('close-button');
    confirmationMessage = this.page.locator('#show_messages');
    receiverDropdown = this.page.locator('#widget_1_topup_receiver');
    moneyAmount = this.page.locator('#widget_1_topup_amount');
    agreementCheckmark = this.page.locator('#widget_1_topup_agreement');
    confirmationButton = this.page.getByRole('button', { name: 'doładuj telefon' });
    moneyValue = this.page.locator('#money_value');

    async executeQuickPayment(receiverId: string, transferAmount: string, transferTitle: string): Promise<void> {
        await this.transferReceiver.selectOption(receiverId);
        await this.transferAmount.fill(transferAmount);
        await this.transferTitle.fill(transferTitle);
        await this.executeButton.click();
        await this.closeButton.click();
    }


    async executeMobilePayment(phoneNumber: string, amountOfMoney: string): Promise<void> {
        await this.receiverDropdown.selectOption(phoneNumber);
        await this.moneyAmount.fill(amountOfMoney);
        await this.agreementCheckmark.click();
        await this.confirmationButton.click();
        await this.closeButton.click();

    }
}
