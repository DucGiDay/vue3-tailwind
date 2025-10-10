import UserList from '../../views/UserList.vue'

export default [
  {
    path: '/users',
    name: 'Users',
    component: UserList,
    meta: { requiresAuth: true }
  }
]
