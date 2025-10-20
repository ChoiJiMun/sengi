// 메뉴 데이터 정의
const menuData = [
  {
    id: "certification-system",
    title: "재생원료인증",
    link: "overview.html",
    items: [
      { label: "제도개요", link: "overview.html" },
      { label: "법령 및 운영규정", link: "regulations.html" },
      { label: "제도 운영체계", link: "operations.html" },
      { label: "인증표시 소개", link: "certification-mark.html" }
    ]
  },
  {
    id: "procedures",
    title: "인증절차",
    link: "application.html",
    items: [
      { label: "신청방법", link: "application.html" },
      { label: "인증기준", link: "standards.html" },
      { label: "사후관리", link: "post-management.html" },
      { label: "인증기관", link: "cert-bodies.html" }
    ]
  },
  {
    id: "continuity",
    title: "연속성 관리",
    link: "continuity-overview.html",
    items: [
      { label: "연속성 관리 개요", link: "continuity-overview.html" },
      { label: "절차 및 방법", link: "continuity-procedures.html" }
    ]
  },
  {
    id: "status",
    title: "인증현황",
    link: "certified-companies.html",
    items: [
      { label: "인증기업", link: "certified-companies.html" },
      { label: "인증제품", link: "certified-products.html" },
      { label: "인증통계", link: "stats.html" }
    ]
  },
  {
    id: "information",
    title: "정보마당",
    link: "notices.html",
    items: [
      { label: "공지사항", link: "notices.html" },
      { label: "자료실", link: "downloads.html" },
      { label: "심사원 교육일정", link: "training.html" },
      { label: "FAQ", link: "faq.html" }
    ]
  }
];

// 모바일 메뉴 렌더링
function renderMobileMenu(data) {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  let html = '<ul>';
  data.forEach(section => {
    const sectionLink = section.link || '#';
    const sectionActive = (section.link === currentFile || (section.items && section.items.some(it => it.link === currentFile)));
    const openClass = sectionActive ? ' open' : '';
    html += `<li class="mobile-section${sectionActive ? ' active' : ''}${openClass}"><strong><a href="${sectionLink}">${section.title}</a></strong><ul>`;
    section.items.forEach(item => {
      const itemLink = item.link || '#';
      const isActive = (itemLink === currentFile);
      html += `<li class="mobile-item${isActive ? ' active' : ''}"><a href="${itemLink}">${item.label}</a></li>`;
    });
    html += '</ul></li>';
  });
  html += '</ul>';
  const el = document.querySelector('.nav-mobile');
  if (el) el.innerHTML = html;
}

// PC 메뉴 렌더링
function renderPCMenu(data) {
  const navUl = document.querySelector('.nav ul');
  if (!navUl) return;
  navUl.innerHTML = data.map(section => {
    const sectionLink = section.link || '#';
    return `<li class="main-menu-item" data-menu="${section.title}"><a href="${sectionLink}">${section.title}</a></li>`;
  }).join('');
}

// 메가메뉴 초기화
function initMegaMenu() {
  const megaMenu = document.querySelector('.mega-menu');
  const navItems = document.querySelectorAll('.nav ul li');
  let menuOpen = false;
  let activeNavItem = null;

  navItems.forEach((li) => {
    li.addEventListener('mouseenter', () => {
      if (!megaMenu) return;
      megaMenu.innerHTML = '<div class="mega-menu-columns" style="margin:auto;display:flex; gap:0px; justify-content:flex-end; align-items:flex-start; max-width:1440px; padding:16px 16px;">' +
        menuData.map(section =>
          `<div style="min-width:111px; text-align:center;"><ul class="submenu" style="margin:0; padding:0; list-style:none;">` +
          section.items.map(item => {
            const href = item.link || '#';
            const label = item.label || '';
            return `<li style="text-align:center; padding:4px 0;"><a href="${href}">${label}</a></li>`;
          }).join('') +
          '</ul></div>'
        ).join('') +
        '</div>';
      megaMenu.classList.add('active');
      li.classList.add('active');
      activeNavItem = li;
      menuOpen = true;
    });

    li.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (!menuOpen) {
          if (megaMenu) {
            megaMenu.classList.remove('active');
            megaMenu.innerHTML = '';
          }
          li.classList.remove('active');
          activeNavItem = null;
        }
      }, 50);
    });
  });

  // megaMenu가 있는 페이지에서만 이벤트 리스너를 추가합니다.
  if (megaMenu) {
    megaMenu.addEventListener('mouseenter', () => {
      menuOpen = true;
      if (activeNavItem) activeNavItem.classList.add('active');
    });
    megaMenu.addEventListener('mouseleave', () => {
      menuOpen = false;
      megaMenu.classList.remove('active');
      megaMenu.innerHTML = '';
      if (activeNavItem) {
        activeNavItem.classList.remove('active');
        activeNavItem = null;
      }
    });
  }

  const header = document.querySelector('header');
  // index.html에는 header가 없으므로, header가 존재할 때만 이벤트 리스너를 추가합니다.
  if (header) {
    header.addEventListener('mouseleave', () => {
      if (megaMenu) {
        megaMenu.classList.remove('active');
        megaMenu.innerHTML = '';
      }
      if (activeNavItem) {
        activeNavItem.classList.remove('active');
        activeNavItem = null;
      }
    });
  }
}

// 햄버거 메뉴 토글
function initHamburgerMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');
  const overlay = document.querySelector('.nav-overlay');
  if (hamburger && navMobile && overlay) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('is-active');
      navMobile.classList.toggle('active');
      overlay.classList.toggle('active');
    });
    overlay.addEventListener('click', () => {
      hamburger.classList.remove('is-active');
      navMobile.classList.remove('active');
      overlay.classList.remove('active');
    });

    // Accordion menu logic
    navMobile.addEventListener('click', function(e) {
      const target = e.target;
      const sectionHeader = target.closest('.mobile-section > strong');

      if (sectionHeader) {
        e.preventDefault(); // Prevent link navigation
        const parentSection = sectionHeader.parentElement;
        parentSection.classList.toggle('open');
      }
    });
  }
}

// 사이드바 활성화 토글 함수
function setSidebarActive(index) {
  document.querySelectorAll('.menu button').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
}


// 사이드바 렌더링
function renderSidebarForCurrentSection() {
  try {
    const menuEl = document.querySelector('.menu');
    if (!menuEl) return;
    const fullPath = window.location.pathname;
    const currentFile = fullPath.split('/').pop().toLowerCase().trim() || 'index.html';


   //const currentFile = window.location.pathname.split('/').pop().toLowerCase().trim() || 'index.html';

    let section = menuData.find(s => {
      if (s.link === currentFile) return true;
      if (s.items && s.items.some(it => it.link === currentFile)) return true;
      return false;
    });

    if (!section) section = menuData[0];

    let html = `<div class="sidebar-section"><ul>`;
    section.items.forEach(item => {
      const href = item.link || '#';
      const isActive = (currentFile === href.toLowerCase().trim());
      html += `<li><button onclick="location.href='${href}'"${isActive ? ' class="active"' : ''}>${item.label}</button></li>`;
    });
    html += '</ul></div>';
    menuEl.innerHTML = html;
  } catch (e) {
    console.warn('renderSidebarForCurrentSection error', e);
  }
}

// 해시에서 탭 숫자 읽기 및 변경
function initTabFromHash() {
  const hash = window.location.hash;
  if (!hash) return;
  const match = hash.match(/tab=(\d+)/);
  if (match) {
    const idx = parseInt(match[1], 10);
    if (!isNaN(idx)) changeTab(idx);
  }
}

 

// 탭 변경 함수 (content 로드 등에서 사용)
function changeTab(index) {
  const content = document.getElementById('tab-content');
  if (!content) return;
  const tabFiles = menuData.reduce((acc, section) => {
    if (section.items && section.items.length) {
      section.items.forEach(it => acc.push(it));
    }
    return acc;
  }, []).map(it => `content/${it.link}`);

  const file = tabFiles[index];
  if (file) {
    fetch(file)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load ' + file);
        return r.text();
      })
      .then(html => {
        content.innerHTML = html;
        setSidebarActive(index);
      })
      .catch(err => {
        console.warn('Could not fetch fragment, falling back to inline content if present', err);
        if (typeof tabContent !== 'undefined' && tabContent[index]) {
          content.innerHTML = tabContent[index];
          setSidebarActive(index);
        } else {
          content.innerHTML = '<p>콘텐츠를 불러올 수 없습니다.</p>';
        }
      });
  } else {
    if (typeof tabContent !== 'undefined' && tabContent[index]) {
      content.innerHTML = tabContent[index];
      setSidebarActive(index);
    } else {
      content.innerHTML = '<p>콘텐츠가 없습니다.</p>';
    }
  }
}

// 현재 섹션에 따라 body에 클래스 추가
function setBodyClassForSection() {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  if (currentFile === 'index.html') return;

  const currentSection = menuData.find(s => 
    s.link === currentFile || (s.items && s.items.some(it => it.link === currentFile))
  );

  if (currentSection && currentSection.id) {
    document.body.classList.add(`section-${currentSection.id}`);
  }
}

// "콘텐츠 준비 중" 블록 렌더링
function renderUnderConstructionBlocks() {
  const placeholders = document.querySelectorAll('.content-under-construction');
  if (placeholders.length > 0) {
    const underConstructionHTML = `
      <img src="./img/Continuity.svg" alt="준비중 아이콘">
      <h2>콘텐츠 준비 중입니다.</h2>
      <p style="font-size: 1.1rem; color: var(--color-text-secondary);">보다 나은 정보를 제공하기 위해 페이지를 준비하고 있습니다.<br>빠른 시일 내에 찾아뵙겠습니다.</p>
    `;
    placeholders.forEach(el => el.innerHTML = underConstructionHTML);
  }
}


// 초기화: DOM 완료 후 실행
document.addEventListener('DOMContentLoaded', () => {
  renderMobileMenu(menuData);
  renderPCMenu(menuData);
  
  // Add section-specific class to body
  setBodyClassForSection();

  initMegaMenu();
  initHamburgerMenu();
  renderSidebarForCurrentSection();
  renderUnderConstructionBlocks();
  initTabFromHash();

  // 현재 페이지에 맞는 사이드바 메뉴를 자동으로 활성화합니다.
  // 이전에 정의된 `renderSidebarForCurrentSection` 함수가 이미 'active' 클래스를 버튼에 추가하므로
  // 별도의 함수 호출은 필요 없습니다. 하지만 만약 동적으로 콘텐츠를 로드하는 경우를 대비하여
  // 명시적으로 활성화 상태를 설정하는 로직을 여기에 둘 수 있습니다.
  // 현재 구조에서는 `renderSidebarForCurrentSection`이 그 역할을 충분히 수행합니다.

  // 만약 페이지 로드 시 특정 탭을 강제로 활성화해야 한다면 아래와 같은 코드를 사용할 수 있습니다.
  // 예: const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  // const section = menuData.find(s => s.items.some(it => it.link === currentFile));
  // if (section) {
  //   const itemIndex = section.items.findIndex(it => it.link === currentFile);
  //   if (itemIndex !== -1) setSidebarActive(itemIndex);
  // }

  // 직접 페이지 접근시 자동 탭 변경
  try {
    const file = window.location.pathname.split('/').pop() || 'index.html';
    // index.html이 아닌 다른 페이지에서만 탭 콘텐츠를 로드합니다.
    if (file !== 'index.html') {
      const flattenedItems = menuData.reduce((acc, section) => {
        if (section.items && section.items.length) {
          section.items.forEach(it => acc.push(it));
        }
        return acc;
      }, []);
      const matchedIndex = flattenedItems.findIndex(it => it.link === file);
      if (matchedIndex >= 0) {
        // 로컬 파일에서 직접 열었을 때는 fetch가 작동하지 않으므로 사이드바만 활성화합니다.
        if (window.location.protocol === 'file:') {
          setSidebarActive(matchedIndex);
        } else {
          changeTab(matchedIndex);
        }
      }
    }
  } catch (e) {
    console.warn('auto-load direct page fragment failed', e);
  }

  // Hero title text reveal effect
  const heroTitleElement = document.getElementById('hero-title');
  if (heroTitleElement) {
    const text1 = "지속가능한 미래,";
    const text2 = "재생원료인증으로 연결하다.";
    const lines = [text1, text2];
    const speed = 100; // 글자당 나타나는 속도 (ms)
    let lineIndex = 0;
    let charIndex = 0;

    function revealText() {
      if (lineIndex >= lines.length) {
        return; // 모든 텍스트가 나타나면 종료
      }

      const currentLine = lines[lineIndex];
      if (charIndex < currentLine.length) {
        heroTitleElement.textContent += currentLine.charAt(charIndex);
        charIndex++;
        setTimeout(revealText, speed);
      } else {
        // 한 줄이 끝나면 다음 줄로
        lineIndex++;
        charIndex = 0;
        if (lineIndex < lines.length) {
          heroTitleElement.textContent += '\n'; // 줄바꿈 문자 추가
          setTimeout(revealText, speed * 3); // 줄바꿈 후 잠시 딜레이
        }
      }
    }

    revealText(); // 효과 시작
  }
});
