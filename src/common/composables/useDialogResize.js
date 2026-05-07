import { ref } from 'vue';

export function useDialogResize(minWidth = 400, minHeight = 200) {
  const dialogWidth = ref(null);
  const dialogHeight = ref(null);

  function startResizeLeft(e) {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const rect = document.querySelector('.p-dialog')?.getBoundingClientRect();
    const startWidth = rect?.width || 800;

    function onMouseMove(e) {
      const delta = startX - e.clientX;
      dialogWidth.value = Math.max(minWidth, startWidth + delta);
    }

    function onMouseUp() {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  function startResizeTop(e) {
    e.preventDefault();
    e.stopPropagation();

    const startY = e.clientY;
    const rect = document.querySelector('.p-dialog')?.getBoundingClientRect();
    const startHeight = rect?.height || 600;

    function onMouseMove(e) {
      const delta = startY - e.clientY;
      dialogHeight.value = Math.max(minHeight, startHeight + delta);
    }

    function onMouseUp() {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  // Kéo góc trên-trái: resize cả 2 chiều cùng lúc
  function startResizeCorner(e) {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const rect = document.querySelector('.p-dialog')?.getBoundingClientRect();
    const startWidth = rect?.width || 800;
    const startHeight = rect?.height || 600;

    function onMouseMove(e) {
      const deltaX = startX - e.clientX;
      const deltaY = startY - e.clientY;
      dialogWidth.value = Math.max(minWidth, startWidth + deltaX);
      dialogHeight.value = Math.max(minHeight, startHeight + deltaY);
    }

    function onMouseUp() {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  return { dialogWidth, dialogHeight, startResizeLeft, startResizeTop, startResizeCorner };
}
