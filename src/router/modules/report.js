import ReportList from '../../views/ReportList.vue'

export default [
  {
    path: '/reports',
    name: 'Reports',
    component: ReportList,
    meta: { requiresAuth: true }
  }
]
