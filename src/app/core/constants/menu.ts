import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Provider',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Provider',
          route: '/service-provider',
          children: [
            { label: 'Service Contact', route: '/service-provider/service-contact' },
            { label: 'Service', route: '/service-provider/service' },
            { label: 'Review Services', route: '/service-provider/review-service' },
            { label: 'Booking Services', route: '/service-provider/booking-service' },
          ],
        },
      ],
    },
    {
      group: 'Operations',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Operations',
          children: [
            { label: 'Request Service', route: '/ceo/staff' },
            { label: 'Operation', route: '/ceo/customer' },
            { label: 'Tour Operation', route: '/ceo/customer' },
          ],
        }
      ],
    },
    {
      group: 'Salesman',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Tour',
          children: [
            { label: 'Booking Tours', route: '/m/blog' },
            { label: 'Review Tours', route: '/m/blog' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Retail Services',
          route: '/m/blog',
        },
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Reports',
          route: '/m/blog',
        }
      ],
    },
    {
      group: 'Marketing',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Blog',
          children: [
            { label: 'List Blog', route: '/m/blog' }
          ],
        },
      ],
    },
    {
      group: 'Head of Business',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Tour',
          children: [
            { label: 'Tours', route: '/m/blog' },
            { label: 'Tours Guide', route: '/m/blog' }
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Locations',
          route: '/head-business/locations',
        },
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Refund',
          route: '/m/blog',
        }
      ],
    },
    {
      group: 'Accountant',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Expenditure',
          route: '/m/blog',
        },
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Revenue',
          route: '/m/blog',
        }
      ],
    },
    {
      group: 'CEO',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Tour Confirmation',
          route: '/ceo/staff',
        },
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Providers',
          route: '/ceo/staff',
        }
      ],
    },
    {
      group: 'System',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Users',
          children: [
            { label: 'Staff', route: '/sa/staff' },
            { label: 'Customer', route: '/sa/customer' },
          ],
        },
      ],
    },
  ];
}
