export default [
  {
    path: '/',
    name: 'home',
    meta: {
      layout: 'main',
    },
    component: () => import('@/pages/public/home/index.vue'),
  },
  {
    path: '/standings',
    name: 'standings',
    meta: {
      layout: 'main',
    },
    component: () => import('@/pages/public/standings/index.vue'),
  },
  {
    path: '/drivers',
    name: 'drivers',
    meta: {
      layout: 'main',
    },
    component: () => import('@/pages/public/drivers/index.vue'),
  },
  {
    path: '/drivers/:driver',
    name: 'driver-profile',
    meta: {
      layout: 'main',
    },
    component: () => import('@/pages/public/drivers/profile/index.vue'),
  },
  {
    path: '/teams',
    name: 'teams',
    meta: {
      layout: 'main',
    },
    component: () => import('@/pages/public/teams/index.vue'),
  },
  {
    path: '/results',
    name: 'results',
    meta: {
      layout: 'main',
    },
    component: () => import('@/pages/public/results/index.vue'),
  },
  {
    path: '/statistics',
    name: 'statistics',
    meta: {
      layout: 'main',
    },
    component: () => import('@/pages/public/statistics/index.vue'),
  },
  {
    path: '/regulations',
    name: 'regulations',
    meta: {
      layout: 'main',
    },
    component: () => import('@/pages/public/regulations/index.vue'),
  },
  {
    path: '/calendar',
    name: 'calendar',
    meta: {
      layout: 'main',
    },
    component: () => import('@/pages/public/calendar/index.vue'),
  },
  {
    path: '/calendar/:round',
    name: 'calendar-schedule',
    meta: {
      layout: 'main',
    },
    component: () => import('@/pages/public/calendar/race/schedule/index.vue'),
  },
  {
    path: '/calendar/:round/:session',
    name: 'calendar-session',
    meta: {
      layout: 'main',
    },
    component: () => import('@/pages/public/calendar/race/results/index.vue'),
  },
]
