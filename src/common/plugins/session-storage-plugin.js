// Đồng bộ với filter trên host app
export function sessionStoragePlugin({ store }) {
  if (store.$id === 'filter') {
    const getSessionKey = () => sessionStorage.getItem('sessionKey') || 'default';
    const sessionKey = sessionStorage.getItem('sessionKey');
    const saved = sessionStorage.getItem(sessionKey);

    if (saved) {
      try {
        store.$patch(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load session:', e);
      }
    }

    // Cập nhật vào session storage khi store thay đổi
    const unsubscribe = store.$subscribe((mutation, state) => {
      const currentKey = getSessionKey();
      if (currentKey) {
        sessionStorage.setItem(currentKey, JSON.stringify(state));
      }
    });

    // Cleanup khi store bị dispose (unmount)
    store.$onAction(({ after, onError }) => {
      // Nếu có action dispose/reset
      after(() => {
        if (store.$disposed) {
          unsubscribe();
        }
      });
    });
  }
}
