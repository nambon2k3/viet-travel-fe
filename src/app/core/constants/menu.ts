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
    }, {
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
      group: 'Trưởng phòng kinh doanh',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Tour',
          route: '/head-business/list-tour'
        },
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Địa điểm',
          route: '/head-business/locations',
        },
      ],
    },
    {
      group: 'Kế toán',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/bill.svg',
          label: 'Phiếu dịch vụ',
          children: [
            { label: 'Phiếu thu', route: '/accountant/list-receipt' },
            { label: 'Phiếu chi', route: '/accountant/list-payment' },
            { label: 'Phiếu hoàn tiền', route: '/accountant/list-refund' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/dollar-svgrepo-com.svg',
          label: 'Quyết toán tour',
          route: '/accountant/list-tour',
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
          label: 'Người dùng',
          children: [
            { label: 'Staff', route: '/admin/user' },
            { label: 'Customer', route: '/admin/customer' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Danh mục dịch vụ',
          route: '/admin/service-category',
        },
      ],
    },
  ];
}
