export const roleAccess: Record<string, string[]> = {
  Owner: [
    'Dashboard',
    'Inventory',
    'Compliance',
    'Customers',
    'Sales',
    'Delivery',
    'Analytics',
    'Settings',
    'Loyalty',
    'Users',
  ],
  Manager: [
    'Dashboard',
    'Inventory',
    'Customers',
    'Sales',
    'Analytics',
    'Loyalty',
  ],
  Budtender: [
    'Sales',
    'Customers',
    'Loyalty',
  ],
  Driver: [
    'Delivery',
  ],
  'Compliance Officer': [
    'Compliance',
  ],
}

export function canAccess(role: string, moduleName: string) {
  return roleAccess[role]?.includes(moduleName) || false
}