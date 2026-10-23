import { test, expect } from '@fixtures/test';
import { newEmployee } from '@utils/data-factory';

test.describe('Directory', () => {
  test('directory page loads with search filters', async ({ directoryPage, page }) => {
    await directoryPage.goto();
    await expect(directoryPage.nameInput).toBeVisible();
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
  });

  test('search by employee name shows a result card and reset clears the search', async ({
    directoryPage,
    pimPage,
  }) => {
    const created = await pimPage.addEmployee(newEmployee());
    await directoryPage.goto();
    await directoryPage.searchByName(created);
    await directoryPage.expectResultVisible(created);

    await directoryPage.reset();
    await expect(directoryPage.nameInput).toHaveValue('');
  });
});
