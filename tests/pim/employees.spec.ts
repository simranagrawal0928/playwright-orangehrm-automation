import { test, expect } from '@fixtures/test';
import {
  displayName,
  fullName,
  licenseNumber,
  newEmployee,
  strongPassword,
  uniqueUsername,
} from '@utils/data-factory';
import data from '@test-data/test-data.json';

test.describe('PIM - Employee management', () => {
  test('add employee with generated data @smoke', async ({ pimPage }) => {
    const employee = await pimPage.addEmployee(newEmployee());
    expect(employee.employeeId).not.toBe('');
    await expect(pimPage.personalDetailsHeading).toHaveText(fullName(employee));
  });

  test('search finds a created employee by name', async ({ pimPage }) => {
    const created = await pimPage.addEmployee(newEmployee());
    await pimPage.gotoList();
    await pimPage.searchByName(created);
    await pimPage.expectEmployeeListed(created);
  });

  test('search finds a created employee by employee id', async ({ pimPage }) => {
    const created = await pimPage.addEmployee(newEmployee());
    await pimPage.gotoList();
    await pimPage.searchByEmployeeId(created.employeeId);
    await pimPage.expectEmployeeListed(created);
  });

  test('edit personal details and save', async ({ pimPage }) => {
    await pimPage.addEmployee(newEmployee());
    const license = licenseNumber();
    await pimPage.setDriversLicense(license);
    await pimPage.savePersonalDetails();
    await expect.poll(() => pimPage.driversLicenseValue()).toBe(license);
  });

  test('employee created with login details appears in Admin user search', async ({
    pimPage,
    adminPage,
  }) => {
    const employee = newEmployee();
    const username = uniqueUsername(employee.firstName, employee.lastName);
    const created = await pimPage.addEmployee(employee, {
      username,
      password: strongPassword(),
    });

    await adminPage.gotoList();
    await adminPage.searchByUsername(username);
    const row = adminPage.table.rowWithText(username).first();
    await expect(row).toBeVisible();
    await expect(row).toContainText(fullName(created));
    await expect(row).toContainText('ESS');

    await adminPage.deleteUser(username);
    await pimPage.gotoList();
    await pimPage.deleteEmployee(created);
  });

  test('delete a created employee', async ({ pimPage }) => {
    const created = await pimPage.addEmployee(newEmployee());
    await pimPage.gotoList();
    await pimPage.deleteEmployee(created);
    await pimPage.searchByTypedName(displayName(created));
    await pimPage.table.expectNoRecords();
  });

  for (const record of data.employees) {
    test(`add employee from data set: ${record.firstName} ${record.lastName} @regression`, async ({
      pimPage,
    }) => {
      const created = await pimPage.addEmployee(record);
      await expect(pimPage.personalDetailsHeading).toHaveText(fullName(created));
      await pimPage.gotoList();
      await pimPage.searchByEmployeeId(created.employeeId);
      await pimPage.expectEmployeeListed(created);
    });
  }
});
