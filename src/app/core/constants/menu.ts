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
    },{
      group: 'Bán hàng',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/cart.svg',
          label: 'Tour',
          route: '/salesman',
          children: [
            { label: 'Danh sách booking', route: '/salesman/list-booking' },
            { label: 'Tour mở bán (SIC)', route: '/salesman/service' },
            { label: 'Tour đặt riêng', route: '/salesman/review-service' },
            { label: 'Đánh giá', route: '/salesman/booking-service' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/ticket.svg',
          label: 'Dịch vụ bán lẻ',
          route: '/salesman',
          children: [
            { label: 'Danh sách dịch vụ', route: '/salesman/list-booking' },
            { label: 'Tour mở bán (SIC)', route: '/salesman/service' },
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
      group: 'Marketing',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Blog',
          children: [
            { label: 'List Blog', route: '/marketer/blog' }
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
            { label: 'Tours', route: '/marketer/blog' },
            { label: 'Tours Guide', route: '/marketer/blog' }
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
          route: '/marketer/blog',
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
          route: '/marketer/blog',
        },
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Revenue',
          route: '/marketer/blog',
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
            { label: 'Staff', route: '/admin/user' },
            { label: 'Customer', route: '/admin/user' },
          ],
        },
      ],
    },
  ];
}
