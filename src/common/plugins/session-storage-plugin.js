export function sessionStoragePlugin({ store }) {
  if (store.$id === 'filter') {
    const sessionKey = sessionStorage.getItem('sessionKey');
    const saved = sessionStorage.getItem(sessionKey);

    if (saved) {
      try {        
        store.$patch(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load session:', e);
      }
    }

    store.$subscribe((mutation, state) => {
      sessionStorage.setItem(sessionKey, JSON.stringify(state));
    });
  }
}
