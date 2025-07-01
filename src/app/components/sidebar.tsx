'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/payments', label: 'Payments' },
    { href: '/accounts', label: 'Accounts' },
  ];

  return (
    <aside style={{ width: '220px', background: '#f5f5f5', padding: '1rem' }}>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {navItems.map(({ href, label }) => (
            <li key={href} style={{ margin: '1rem 0' }}>
              <Link
                href={href}
                style={{
                  color: pathname === href ? 'blue' : 'black',
                  textDecoration: 'none',
                  fontWeight: pathname === href ? 'bold' : 'normal',
                }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}