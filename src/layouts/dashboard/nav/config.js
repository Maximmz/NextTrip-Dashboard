// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Hotels',
    path: '/dashboard/hotels',
    icon: icon('ic_cart'),
  },
  {
    title: 'Rooms',
    path: '/dashboard/rooms',
    icon: icon('ic_blog'),
  },
  {
    title: 'Bookings',
    path: '/dashboard/bookings',
    icon: icon('ic_blog'),
  },
];

export default navConfig;
