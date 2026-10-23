(() => {
  'use strict';
  const params = new URLSearchParams(location.hash.slice(1));
  const courseInfo = globalThis.HikeHelper.cleanCourseInfo(Object.fromEntries(params));
  document.getElementById('courseName').textContent = courseInfo.courseName || '课堂视频';
  for (const [key, row] of [['teacherName', 'teacherInfo'], ['className', 'classInfo']]) {
    document.getElementById(key).textContent = courseInfo[key] || '';
    document.getElementById(row).hidden = !courseInfo[key];
  }
  for (const option of document.querySelectorAll('input[name="pageTheme"]')) {
    option.addEventListener('change', () => {
      if (option.checked) document.body.dataset.background = option.value;
    });
  }
  try {
    const sources = globalThis.HikeHelper.buildMediaSources(params.get('rpId'));
    const player = globalThis.jydH5Player({
      ...sources, element: 'h5PlayerId', publicRpType: '1,2,3', videoSize: ''
    });
    window.addEventListener('pagehide', () => player.stopVideo());
  } catch (error) {
    document.getElementById('h5PlayerId').textContent = error.message;
  }
})();
