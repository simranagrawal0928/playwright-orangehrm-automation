import { faker } from '@faker-js/faker';

export interface EmployeeData {
  firstName: string;
  middleName: string;
  lastName: string;
}

export function newEmployee(): EmployeeData {
  return {
    firstName: faker.person.firstName(),
    middleName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  };
}

export function fullName(employee: EmployeeData): string {
  return `${employee.firstName} ${employee.lastName}`;
}

/** Name as OrangeHRM lists it in tables and pickers: first, middle and last. */
export function displayName(employee: EmployeeData): string {
  return [employee.firstName, employee.middleName, employee.lastName].filter(Boolean).join(' ');
}

/** Usernames must be at least 5 characters and unique across the whole demo. */
export function uniqueUsername(firstName: string, lastName: string): string {
  const clean = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
  const suffix = faker.string.numeric(5);
  return `${clean(firstName)}.${clean(lastName)}${suffix}`;
}

/** OrangeHRM passwords need length plus upper, lower, digit and special characters. */
export function strongPassword(): string {
  const pick = (chars: string) => chars[Math.floor(Math.random() * chars.length)];
  const required = [
    pick('ABCDEFGHJKLMNPQRSTUVWXYZ'),
    pick('abcdefghijkmnpqrstuvwxyz'),
    pick('23456789'),
    pick('!@#$%^&*'),
  ];
  const all = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  const rest = Array.from({ length: 8 }, () => pick(all));
  return [...required, ...rest].sort(() => Math.random() - 0.5).join('');
}

export function emailFor(username: string): string {
  return `${username}@example.com`;
}

export function licenseNumber(): string {
  return faker.string.alphanumeric({ length: 9, casing: 'upper' });
}

/**
 * Employee ids are pre-filled by OrangeHRM with the next free number, which
 * races when tests create employees in parallel. Setting our own keeps the
 * id deterministic for the test that created the record.
 */
export function uniqueEmployeeId(): string {
  return faker.string.numeric({ length: 8, allowLeadingZeros: false });
}

export function phoneNumber(): string {
  return faker.string.numeric(10);
}
