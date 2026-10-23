(() => {
  'use strict';
  const origin = 'https://jxypt.hitsz.edu.cn';

  function isSitePage(value) {
    try {
      const url = new URL(value);
      return url.origin === origin && url.pathname.startsWith('/ve/');
    } catch {
      return false;
    }
  }

  // Parse the site's literal arguments without evaluating page-supplied code.
  // Course, class and account identifiers are never hard-coded.
  function parseHandler(source) {
    if (typeof source !== 'string' || source.length > 2400) return null;
    const call = /^\s*(?:return\s+)?getStuControlType\s*\(([\s\S]*)\)\s*;?\s*$/.exec(source);
    if (!call) return null;
    const values = [];
    let rest = call[1];
    for (let index = 0; index < 4; index++) {
      const token = /^\s*(?:'([^'\\\r\n]*)'|"([^"\\\r\n]*)")\s*(,|$)/.exec(rest);
      if (!token || (index < 3 ? token[3] !== ',' : token[3] !== '')) return null;
      const value = token[1] ?? token[2];
      if (value.length > 512 || /[\x00-\x1f\x7f]/.test(value)) return null;
      values.push(value);
      rest = rest.slice(token[0].length);
    }
    if (rest.trim() || !values[0] || !values[1]) return null;
    return { rpId: values[0], courseId: values[1], courseNum: values[2], fzId: values[3] };
  }

  function buildPlayerUrl(record) {
    const keys = ['rpId', 'courseId', 'courseNum', 'fzId'];
    if (!record || keys.some(key => typeof record[key] !== 'string' ||
        record[key].length > 512 || /[\x00-\x1f\x7f]/.test(record[key])) ||
        !record.rpId || !record.courseId) throw new Error('视频入口参数无效。');
    const url = new URL('/ve/back/rp/common/rpIndex.shtml', origin);
    // "Deatil" is the spelling used by the site's existing player endpoint.
    url.search = new URLSearchParams({
      method: 'studyCourseDeatil',
      courseId: record.courseId,
      dataSource: '1',
      courseNum: record.courseNum,
      fzId: record.fzId,
      rpId: record.rpId,
      publicRpType: '1,2,3'
    }).toString();
    return url.href;
  }

  function isReplayId(value) {
    return typeof value === 'string' && /^[a-f0-9]{32}$/i.test(value);
  }

  function cleanCourseInfo(input) {
    const result = {};
    for (const key of ['courseName', 'teacherName', 'className']) {
      const value = typeof input?.[key] === 'string'
        ? input[key].replace(/[\x00-\x1f\x7f]/g, ' ').trim().slice(0, 160) : '';
      if (value) result[key] = value;
    }
    return result;
  }

  function readCourseInfo(doc, link) {
    const header = doc.querySelector?.('.curr-contentltop');
    const classLabel = header?.querySelector('.topb');
    return cleanCourseInfo({
      courseName: header?.querySelector('.topm')?.textContent,
      teacherName: link.querySelector?.('.titlex')?.textContent,
      className: classLabel?.getAttribute('title') || classLabel?.textContent.replace(/^\s*授课班级\s*[:：]\s*/, '')
    });
  }

  function buildStealthPlayerPath(rpId, courseInfo) {
    if (!isReplayId(rpId)) throw new Error('视频编号无效。');
    return 'player/index.html#' + new URLSearchParams({ rpId, ...cleanCourseInfo(courseInfo) });
  }

  function buildMediaSources(rpId) {
    if (!isReplayId(rpId)) throw new Error('视频编号无效。');
    const mediaUrl = type => {
      const url = new URL('https://jxlmtt.hitsz.edu.cn:78/Root/download.shtml');
      url.search = new URLSearchParams({ p: 'recordRp', type, id: rpId });
      return url.href;
    };
    return {
      teacherVideoUrl: mediaUrl('2'),
      studentVideoUrl: mediaUrl('1'),
      courseVideoUrl: mediaUrl('3')
    };
  }

  globalThis.HikeHelper = Object.freeze({
    isSitePage, parseHandler, buildPlayerUrl, isReplayId, buildStealthPlayerPath, buildMediaSources,
    cleanCourseInfo, readCourseInfo
  });
})();
