import { faker } from '@faker-js/faker';
import { test, expect } from '@fixtures/test';
import { phoneNumber } from '@utils/data-factory';

test.describe('My Info', () => {
  test('update contact details and verify they persist @smoke', async ({ myInfoPage, page }) => {
    const street = faker.location.streetAddress();
    const city = faker.location.city();
    const mobile = phoneNumber();

    await myInfoPage.goto();
    await myInfoPage.gotoContactDetails();
    await myInfoPage.setContactDetail('Street 1', street);
    await myInfoPage.setContactDetail('City', city);
    await myInfoPage.setContactDetail('Mobile', mobile);
    await myInfoPage.saveContactDetails();

    await page.reload();
    await expect.poll(() => myInfoPage.contactDetailValue('Street 1')).toBe(street);
    await expect.poll(() => myInfoPage.contactDetailValue('City')).toBe(city);
    await expect.poll(() => myInfoPage.contactDetailValue('Mobile')).toBe(mobile);
  });
});
