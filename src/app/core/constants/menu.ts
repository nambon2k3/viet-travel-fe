import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Nhà cung cấp',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Dịch vụ',
          route: '/service-provider',
          children: [
            { label: 'Dịch vụ', route: '/service-provider/service' },
            { label: 'Yêu cầu Dịch vụ', route: '/service-provider/service-request' },
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
            { label: 'Tour mở bán (SIC)', route: '/salesman/list-tour-public' },
            { label: 'Tour đặt riêng', route: '/salesman/list-tour-private' },
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
      group: 'Điều hành',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Điều hành Tour',
          route: '/operator/view-list-tour',
        },
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Xử lý yêu cầu',
          route: '/operator/view-list-request',
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
          label: 'Duyệt Tour',
          route: '/ceo/tour-request',
        },
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Nhà cung cấp',
          route: '/ceo/service-provider',
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
