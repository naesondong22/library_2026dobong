/**
 * 도봉꿈의극단 아카이빙 웹사이트
 * <사람 책 도서관: 이야기와 함께 걷기>
 * 직관적 관리자 스튜디오 컨트롤러 (js/admin.js)
 *
 * 5대 직관적 관리 워크스페이스:
 * 1. 프로젝트 인포 관리 (PROJECT_INFO: 로고 업로드, 기획의도, 도서관 소개글)
 * 2. Monologue 관리 (좌측 슬라이드 사진 관리, 20개 거점 고정 산책경로/공간사진/음성)
 * 3. TimeWork 관리 (10개 수업 회차 책 펼침면 1:1 직관 편집, 좌/우 사진 및 아이들 작업 파일 바로 업로드)
 * 4. 환경음(Ambient) 관리 (환경음 라이브러리 목록, 랜덤 재생(Shuffle) 스위치, 오디오 바로 업로드)
 * 5. 프리뷰 & 퍼블리시 (실시간 반응형 프리뷰 및 라이브 배포)
 */

class ArchiveStudioAdmin {
  constructor() {
    this.data = window.ArchiveStore.getData(true);
    this.audio = new window.MonologueAudioEngine();

    this.activeTab = 'project_info'; // 'project_info' | 'monologue' | 'timework' | 'ambient' | 'preview_publish'

    // Monologue 탭 상태
    this.monoSpaceTab = 'chaeum'; // 'chaeum' | 'huingomusin'
    this.monoSelectedElemId = 'c-01';

    // TimeWork 탭 상태
    this.twActivePageIdx = 0; // 0 ~ 9 (P.01 ~ P.10)

    // 프리뷰 상태
    this.previewViewport = '100%';

    this.init();
  }

  async init() {
    if (window.LargeMediaDB && window.LargeMediaDB.initCache) {
      await window.LargeMediaDB.initCache();
    }
    this.data = window.ArchiveStore.getData(true);

    // 기본 영구 저장된 DEFAULT_ARCHIVE_DATA의 사진과 작품들이 누락되지 않도록 안전 보장
    if (window.DEFAULT_ARCHIVE_DATA && window.DEFAULT_ARCHIVE_DATA.timeworks) {
      window.DEFAULT_ARCHIVE_DATA.timeworks.forEach((defTw) => {
        const tw = (this.data.timeworks || []).find((t) => t.id === defTw.id);
        if (tw) {
          if ((!tw.chaeumPhotos || !tw.chaeumPhotos.length) && defTw.chaeumPhotos && defTw.chaeumPhotos.length) {
            tw.chaeumPhotos = JSON.parse(JSON.stringify(defTw.chaeumPhotos));
          }
          if ((!tw.huinPhotos || !tw.huinPhotos.length) && defTw.huinPhotos && defTw.huinPhotos.length) {
            tw.huinPhotos = JSON.parse(JSON.stringify(defTw.huinPhotos));
          }
          if ((!tw.works || !tw.works.length) && defTw.works && defTw.works.length) {
            tw.works = JSON.parse(JSON.stringify(defTw.works));
          }
        }
      });
    }

    this.setupLoginGate();
    this.bindTopHeaderActions();
    this.bindSidebarNavigation();
    this.setupAudioCallbacks();
    this.renderAll();
  }

  async recoverOrphanedTimeWorkMedia() {
    if (!window.LargeMediaDB || !window.LargeMediaDB.getAllItems) return 0;
    try {
      const items = await window.LargeMediaDB.getAllItems();
      if (!items || !items.length) return 0;

      const timeworks = this.data.timeworks || [];
      const referenced = new Set();
      timeworks.forEach((tw) => {
        (tw.chaeumPhotos || []).forEach((p) => { if (typeof p === 'string') referenced.add(p); });
        (tw.huinPhotos || []).forEach((p) => { if (typeof p === 'string') referenced.add(p); });
        (tw.works || []).forEach((w) => {
          if (w.image) referenced.add(w.image);
          if (w.imageUrl) referenced.add(w.imageUrl);
        });
      });

      let recovered = 0;
      items.forEach((item) => {
        if (!item || !item.id || item.id === '__archive_data_latest__') return;
        const idbUrl = `idb://${item.id}`;
        if (referenced.has(idbUrl)) return;

        let twId = item.meta?.twId || '';
        if (!twId) {
          const m = item.id.match(/^tw-(?:ch|hg)-(tw-\d+)-/);
          if (m) twId = m[1];
        }
        if (!twId) return;

        const tw = timeworks.find((t) => t.id === twId);
        if (!tw) return;

        if (item.id.startsWith('tw-ch-')) {
          tw.chaeumPhotos = tw.chaeumPhotos || [];
          tw.chaeumPhotos.push(idbUrl);
          referenced.add(idbUrl);
          recovered++;
        } else if (item.id.startsWith('tw-hg-')) {
          tw.huinPhotos = tw.huinPhotos || [];
          tw.huinPhotos.push(idbUrl);
          referenced.add(idbUrl);
          recovered++;
        } else if (item.id.startsWith('tw-wk-')) {
          tw.works = tw.works || [];
          tw.works.push({
            id: item.meta?.workId || `wk-${Date.now()}-${recovered}`,
            title: item.meta?.title || `복구된 기록물 ${recovered + 1}`,
            childName: '단원',
            author: '단원',
            workType: '작업 기록',
            description: '',
            image: idbUrl,
            imageUrl: idbUrl
          });
          referenced.add(idbUrl);
          recovered++;
        }
      });

      if (recovered > 0) {
        // 자동 복구된 미디어 파일은 메모리에 연결하되, 사용자가 확인할 수 있도록 토스트 표시 (강제 덮어쓰기 방지)
      }
      return recovered;
    } catch (e) {
      console.warn('Orphaned media recovery warning:', e);
      return 0;
    }
  }

  renderEmergencyRecoveryBanner() {
    let banner = document.getElementById('admEmergencyRecoveryBanner');
    if (banner) banner.remove();

    const idbItems = (window.LargeMediaDB && window.LargeMediaDB.cache)
      ? Array.from(window.LargeMediaDB.cache.keys())
      : [];

    const foundKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || k.includes('AUTH')) continue;
      const raw = localStorage.getItem(k);
      if (!raw || typeof raw !== 'string') continue;
      try {
        const p = JSON.parse(raw);
        if (p && p.timeworks) {
          const time = p.meta?.publishedAt || p.meta?.lastDraftSaved || p.meta?.lastUpdated || '시간 정보 없음';
          let customScore = 0;
          const titles = (p.timeworks || []).slice(0, 7).map((tw, idx) => {
            const isCustom = tw.title && !['환승의 길목에서 무대까지', '마루의 온도를 측정하는 발걸음', '골목길 요철에서 놀이터로', '도깨비 시소와 그물 다리의 리듬', '파란 계단과 옥상 잔디마당', '사물함 벽 뒤에 숨은 목소리', '흰 배경막 무대와 검은 피아노'].includes(tw.title);
            if (isCustom) customScore += 100;
            const wCount = (tw.works || []).length;
            const pCount = (tw.chaeumPhotos || []).length + (tw.huinPhotos || []).length;
            return `P.${idx + 1}: ${tw.title || '무제'} (글 ${tw.bodyParagraphs?.length || 0}문단, 사진 ${pCount}장, 작업물 ${wCount}개)`;
          });
          foundKeys.push({ key: k, time, customScore, titles, rawData: p });
        }
      } catch (e) {}
    }

    // 서버 로그로도 키 목록 전송하여 확인 가능하게 함
    try {
      const summaryPayload = foundKeys.map((f) => `${f.key}[score:${f.customScore},time:${f.time}]`).join(';');
      fetch(`/__debug_storage?keys=${encodeURIComponent(summaryPayload)}&idbCount=${idbItems.length}`).catch(() => {});
    } catch (e) {}

    banner = document.createElement('div');
    banner.id = 'admEmergencyRecoveryBanner';
    banner.style.cssText = 'background:#FFF8E7; border:2px solid #E6A23C; padding:16px 20px; margin:16px 20px; box-shadow:0 4px 12px rgba(0,0,0,0.08);';

    banner.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
        <div>
          <strong style="font-size:16px; color:#B88230;">🚨 브라우저 내 저장소 복구 매니저</strong>
          <p style="font-size:13px; color:#666; margin:4px 0 0 0;">
            브라우저 내부 저장소에서 발견된 데이터 목록입니다. 작성하셨던 내용이 있는 항목의 <strong>[이 버전으로 복원]</strong> 버튼을 누르면 즉시 복구됩니다.
          </p>
        </div>
        <button class="adm-btn sm" id="btnCloseRecoveryBanner">✕ 닫기</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px;">
        ${foundKeys.map((item, idx) => `
          <div style="background:#fff; border:1.5px solid ${item.customScore > 0 ? '#0052FF' : '#DDD'}; padding:12px; display:flex; justify-content:space-between; align-items:center;">
            <div style="max-width:75%;">
              <div style="display:flex; align-items:center; gap:8px;">
                <strong style="color:${item.customScore > 0 ? '#0052FF' : '#333'}; font-size:13px;">${item.key}</strong>
                ${item.customScore > 0 ? '<span style="background:#0052FF; color:#fff; font-size:11px; padding:1px 6px; border-radius:3px; font-weight:bold;">★ 작성 텍스트 감지됨</span>' : ''}
                <span style="font-size:12px; color:#888;">(저장 시각: ${item.time})</span>
              </div>
              <div style="font-size:11.5px; color:#555; margin-top:4px; line-height:1.4;">
                ${item.titles.slice(0, 3).join(' / ')}${item.titles.length > 3 ? ' ...' : ''}
              </div>
            </div>
            <button class="adm-btn ${item.customScore > 0 ? 'primary' : ''} sm" data-restore-key-idx="${idx}">
              📥 이 버전으로 복원
            </button>
          </div>
        `).join('')}
      </div>
    `;

    const root = document.querySelector('.adm-container') || document.body;
    root.insertBefore(banner, root.firstChild);

    document.getElementById('btnCloseRecoveryBanner')?.addEventListener('click', () => banner.remove());

    banner.querySelectorAll('[data-restore-key-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-restore-key-idx'), 10);
        const selected = foundKeys[idx];
        if (selected && selected.rawData) {
          this.data = selected.rawData;
          window.ArchiveStore.saveData(this.data, `${selected.key} 수동 복원`);
          this.renderAll();
          banner.remove();
          this.showToast(`✅ [${selected.key}] 버전으로 즉시 복원되었습니다!`);
        }
      });
    });
  }

  /* ========================================================================
     0. 관리자 전용 로그인 인증 게이트
     ======================================================================== */
  setupLoginGate() {
    const overlay = document.getElementById('adminLoginOverlay');
    const form = document.getElementById('adminLoginForm');
    const quickBtn = document.getElementById('btnQuickFillLogin');
    const logoutBtn = document.getElementById('btnAdminLogout');
    const errEl = document.getElementById('loginErrorMsg');

    const checkAuth = () => {
      if (window.ArchiveStore.isAuthenticated()) {
        overlay.classList.add('hidden');
      } else {
        overlay.classList.remove('hidden');
      }
    };

    checkAuth();

    if (quickBtn) {
      quickBtn.addEventListener('click', () => {
        const cred = window.ArchiveStore.getCredentials();
        document.getElementById('loginIdInput').value = cred.id;
        document.getElementById('loginPwInput').value = cred.pw;
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('loginIdInput').value.trim();
        const pw = document.getElementById('loginPwInput').value.trim();
        if (window.ArchiveStore.login(id, pw, true)) {
          errEl.style.display = 'none';
          overlay.classList.add('hidden');
          this.showToast('관리자님 환영합니다. 아카이브 관리 스튜디오에 접속되었습니다.');
        } else {
          errEl.style.display = 'block';
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.audio.stop();
        this.audio.stopAmbientChannel();
        window.ArchiveStore.logout();
        checkAuth();
      });
    }
  }

  showToast(msg) {
    let toast = document.getElementById('adminToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'adminToast';
      toast.className = 'admin-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  saveDraft(msg = '드래프트가 저장되었습니다.') {
    this.syncCurrentInputs();
    window.ArchiveStore.saveDraft(this.data);
    this.refreshPreviewIframe();
    this.showToast(msg);
  }

  async syncToDisk(showToastMsg = true) {
    this.syncCurrentInputs();
    if (showToastMsg) this.showToast('⏳ 디스크 파일(js/data.js 및 image/uploaded/)에 영구 동기화 중...');

    try {
      const mediaFiles = {};
      if (window.LargeMediaDB) {
        if (window.LargeMediaDB.cache) {
          window.LargeMediaDB.cache.forEach((dataUrl, id) => {
            if (id && dataUrl && typeof dataUrl === 'string' && dataUrl.startsWith('data:')) {
              mediaFiles[id] = dataUrl;
            }
          });
        }
        if (window.LargeMediaDB.getAllItems) {
          try {
            const items = await window.LargeMediaDB.getAllItems();
            for (const it of items) {
              if (it && it.id && it.dataUrl && typeof it.dataUrl === 'string' && it.dataUrl.startsWith('data:')) {
                mediaFiles[it.id] = it.dataUrl;
              }
            }
          } catch (e) {}
        }
      }

      // Also resolve any idb:// URLs inside this.data
      const resolveIdbInObject = async (obj) => {
        if (!obj) return;
        if (typeof obj === 'string' && obj.startsWith('idb://')) {
          const blobId = obj.replace('idb://', '');
          if (!mediaFiles[blobId] && window.LargeMediaDB) {
            const resolved = await window.LargeMediaDB.resolveUrl(obj);
            if (resolved && resolved.startsWith('data:')) {
              mediaFiles[blobId] = resolved;
            }
          }
        } else if (Array.isArray(obj)) {
          for (const item of obj) await resolveIdbInObject(item);
        } else if (typeof obj === 'object') {
          for (const k of Object.keys(obj)) await resolveIdbInObject(obj[k]);
        }
      };
      await resolveIdbInObject(this.data);

      const resp = await fetch('/api/sync-to-disk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: this.data, mediaFiles })
      });

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const res = await resp.json();
      if (res && res.ok) {
        if (showToastMsg) this.showToast(`✅ ${res.message || 'js/data.js에 영구 저장 완료!'}`);
        return true;
      } else {
        throw new Error(res?.error || '알 수 없는 오류');
      }
    } catch (err) {
      console.warn('syncToDisk skipped/failed:', err);
      if (showToastMsg) this.showToast(`⚠️ 디스크 파일 동기화 실패: ${err.message}`);
      return false;
    }
  }

  async publishNow(note = '관리자 스튜디오 업데이트 퍼블리시') {
    this.showToast('⏳ 라이브 페이지 및 디스크 파일(js/data.js)에 영구 동기화 중...');
    this.syncCurrentInputs();
    try {
      await this.syncToDisk(false);
      const res = await window.ArchiveStore.saveDataAsync(this.data, note);
      this.refreshPreviewIframe();
      this.renderAll();
      if (res && res.ok) {
        this.showToast('✅ 라이브 페이지와 디스크 파일(js/data.js)에 성공적으로 영구 저장되었습니다!');
      } else {
        const errMsg = res?.error || '알 수 없는 오류';
        this.showToast(`❌ 라이브 적용 오류: ${errMsg}`);
        alert(`라이브 페이지 적용 중 오류가 발생했습니다:\n${errMsg}`);
      }
    } catch (e) {
      this.showToast(`❌ 라이브 적용 오류: ${e?.message || '저장 실패'}`);
      alert(`라이브 페이지 적용 중 오류가 발생했습니다:\n${e?.message || e}`);
    }
  }

  syncCurrentInputs() {
    // 1. 프로젝트 인포 동기화
    const siteTitle = document.getElementById('piSiteTitle');
    if (siteTitle) {
      this.data.meta = this.data.meta || {};
      this.data.meta.siteTitle = siteTitle.value.trim();
    }
    const siteSubtitle = document.getElementById('piSiteSubtitle');
    if (siteSubtitle) {
      this.data.meta = this.data.meta || {};
      this.data.meta.siteSubtitle = siteSubtitle.value.trim();
    }
    const kicker = document.getElementById('piKicker');
    if (kicker) {
      this.data.projectInfo = this.data.projectInfo || {};
      this.data.projectInfo.kicker = kicker.value.trim();
    }
    const leadCopy = document.getElementById('piLeadCopy');
    if (leadCopy) {
      this.data.projectInfo = this.data.projectInfo || {};
      this.data.projectInfo.leadCopy = leadCopy.value.trim();
    }
    const conceptText = document.getElementById('piConceptText');
    if (conceptText) {
      this.data.projectInfo = this.data.projectInfo || {};
      this.data.projectInfo.conceptText = conceptText.value
        .split(/\n\s*\n/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    const dlTag = document.getElementById('piDirectorLetterTag');
    if (dlTag) {
      this.data.projectInfo = this.data.projectInfo || {};
      this.data.projectInfo.directorLetterTag = dlTag.value.trim();
    }
    const dlTitle = document.getElementById('piDirectorLetterTitle');
    if (dlTitle) {
      this.data.projectInfo = this.data.projectInfo || {};
      this.data.projectInfo.directorLetterTitle = dlTitle.value.trim();
    }
    const dlBody = document.getElementById('piDirectorLetter');
    if (dlBody) {
      this.data.projectInfo = this.data.projectInfo || {};
      this.data.projectInfo.directorLetter = dlBody.value.trim();
    }
    const piCredits = document.getElementById('piCredits');
    if (piCredits) {
      this.data.projectInfo = this.data.projectInfo || {};
      this.data.projectInfo.credits = piCredits.value
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((line) => {
          const parts = line.split(':');
          if (parts.length >= 2) {
            return { role: parts[0].trim(), value: parts.slice(1).join(':').trim() };
          }
          return { role: '역할', value: line };
        });
    }

    // 1-1. Monologue 메인 안내 텍스트 동기화
    const mBadge = document.getElementById('monoHeroBadge');
    if (mBadge) {
      this.data.monologueHero = this.data.monologueHero || {};
      this.data.monologueHero.badge = mBadge.value.trim();
      this.data.monologueHero.sub = (document.getElementById('monoHeroSub')?.value || '').trim();
      this.data.monologueHero.title = (document.getElementById('monoHeroTitle')?.value || '').trim();
      this.data.monologueHero.titleSize = (document.getElementById('monoHeroTitleSize')?.value || '64px').trim();
      this.data.monologueHero.lead = (document.getElementById('monoHeroLead')?.value || '').trim();
      this.data.monologueHero.desc = (document.getElementById('monoHeroDesc')?.value || '').trim();
      this.data.monologueHero.align = (document.getElementById('monoHeroAlign')?.value || 'left').trim();
    }
    const chDesc = document.getElementById('piChaeumDesc');
    const huDesc = document.getElementById('piHuinDesc');
    if (chDesc) {
      const ch = this.data.spaces?.find((s) => s.id === 'chaeum');
      if (ch) {
        ch.floorPlanDesc = chDesc.value.trim();
        ch.description = chDesc.value.trim();
      }
    }
    if (huDesc) {
      const hu = this.data.spaces?.find((s) => s.id === 'huingomusin');
      if (hu) {
        hu.floorPlanDesc = huDesc.value.trim();
        hu.description = huDesc.value.trim();
      }
    }

    // 2. Monologue 거점 필드 동기화 (이름, 독백제목, 인용구, 본문 등)
    const spacesList = Array.isArray(this.data.spaces)
      ? this.data.spaces
      : Object.values(this.data.spaces || {});

    document.querySelectorAll('[data-elem-field]').forEach((input) => {
      const elId = input.getAttribute('data-target-id');
      const field = input.getAttribute('data-elem-field');
      const val = input.value.trim();
      for (const sp of spacesList) {
        const target = (sp.elements || []).find((el) => el.id === elId);
        if (target) {
          target[field] = val;
          target.monologue = target.monologue || {};
          if (field === 'childName') target.childName = val;
          if (field === 'name') target.name = val;
          if (field === 'monologueTitle') {
            target.monologueTitle = val;
            target.monologue.title = val;
          }
          if (field === 'quote') {
            target.quote = val;
            target.monologue.quote = val;
          }
          if (field === 'monologueText') {
            target.monologueText = val;
            target.monologue.fullStory = val;
          }
          break;
        }
      }
    });

    // 3. TimeWork 현재 활성 페이지 동기화
    const timeworks = this.data.timeworks || [];
    const session = timeworks[this.twActivePageIdx];
    if (session) {
      const twDate = document.getElementById('twDateInput');
      if (twDate) session.date = twDate.value.trim();
      const twTitle = document.getElementById('twTitleInput');
      if (twTitle) session.title = twTitle.value.trim();
      const twLead = document.getElementById('twLeadQuoteInput');
      if (twLead) {
        session.summary = twLead.value.trim();
        session.leadQuote = session.summary;
      }
      const twKw = document.getElementById('twKeywordsInput');
      if (twKw) {
        session.keywords = twKw.value
          .split(',')
          .map((s) => s.replace(/^#/, '').trim())
          .filter(Boolean);
      }
      const twChLabel = document.getElementById('twChaeumLabelInput');
      if (twChLabel) session.chaeumPhotoLabel = twChLabel.value.trim();
      const twHgLabel = document.getElementById('twHuinLabelInput');
      if (twHgLabel) session.huinPhotoLabel = twHgLabel.value.trim();
      const twBody = document.getElementById('twBodyInput');
      if (twBody) {
        session.bodyText = twBody.value;
        session.bodyColumns = twBody.value.split(/\n\s*\n\s*\n+/).map((col) =>
          col.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)
        ).filter((col) => col.length > 0);
        session.bodyParagraphs = twBody.value
          .split(/\n\s*\n/)
          .map((s) => s.trim())
          .filter(Boolean);
        session.paragraphs = session.bodyParagraphs;
      }
      document.querySelectorAll('[data-fn-field]').forEach((input) => {
        const fnIdx = parseInt(input.getAttribute('data-fn-idx'), 10);
        const field = input.getAttribute('data-fn-field');
        if (session.footnotes && session.footnotes[fnIdx]) {
          session.footnotes[fnIdx][field] = input.value.trim();
          if (field === 'content') session.footnotes[fnIdx].body = input.value.trim();
        }
      });
      document.querySelectorAll('[data-work-field]').forEach((input) => {
        const wIdx = parseInt(input.getAttribute('data-work-idx'), 10);
        const field = input.getAttribute('data-work-field');
        if (session.works && session.works[wIdx]) {
          session.works[wIdx][field] = input.value.trim();
          if (field === 'childName') session.works[wIdx].author = input.value.trim();
        }
      });
    }

    // 4. 환경음 필드 동기화
    const library = this.data.ambientSettings?.library || [];
    document.querySelectorAll('[data-amb-field]').forEach((input) => {
      const idx = parseInt(input.getAttribute('data-amb-idx'), 10);
      const field = input.getAttribute('data-amb-field');
      if (library[idx]) {
        library[idx][field] = input.value.trim();
      }
    });
  }

  setupAudioCallbacks() {
    this.audio.onAmbientChange = () => {
      this.renderGlobalAmbientBar();
    };
    this.audio.onStateChange = () => {
      this.renderGlobalAmbientBar();
    };
  }

  bindTopHeaderActions() {
    const draftBtn = document.getElementById('btnSaveDraftTop');
    const pubBtn = document.getElementById('btnPublishTop');
    const syncDiskBtn = document.getElementById('btnSyncToDisk');
    const exportBtn = document.getElementById('btnExportJson');
    const importInput = document.getElementById('inputImportJson');
    const resetBtn = document.getElementById('btnResetDummy');

    if (syncDiskBtn) {
      syncDiskBtn.addEventListener('click', async () => {
        await this.syncToDisk(true);
      });
    }

    if (draftBtn) {
      draftBtn.addEventListener('click', () => {
        this.syncCurrentInputs();
        this.publishNow('편집 내용이 저장 및 라이브에 즉시 반영되었습니다.');
      });
    }
    if (pubBtn) {
      pubBtn.addEventListener('click', () => {
        this.syncCurrentInputs();
        this.publishNow('상단 툴바 즉시 퍼블리시');
      });
    }
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(this.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `도봉꿈의극단_사람책도서관_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('아카이브 전체 JSON 백업 파일이 다운로드되었습니다.');
      });
    }
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const parsed = JSON.parse(ev.target.result);
            if (parsed && parsed.spaces && parsed.timeworks) {
              this.data = parsed;
              this.publishNow('JSON 백업 파일 복원 퍼블리시');
            } else {
              alert('올바른 아카이브 JSON 형식이 아닙니다.');
            }
          } catch (err) {
            alert('JSON 파싱 오류가 발생했습니다.');
          }
        };
        reader.readAsText(file);
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('모든 데이터를 초기 상태로 되돌리시겠습니까?')) {
          this.data = window.ArchiveStore.resetToDefault();
          this.renderAll();
          this.showToast('초기 상태로 복원되었습니다.');
        }
      });
    }
    const inspectBtn = document.getElementById('btnInspectStorage');
    if (inspectBtn) {
      inspectBtn.addEventListener('click', () => {
        this.openStorageInspectorModal();
      });
    }
  }

  async openStorageInspectorModal() {
    let modal = document.getElementById('storageInspectorModal');
    if (modal) modal.remove();

    const idbItems = window.LargeMediaDB && window.LargeMediaDB.getAllItems
      ? await window.LargeMediaDB.getAllItems()
      : [];
    const idbJsonItem = idbItems.find((it) => it.id === '__archive_data_latest__');

    const summarizeSource = (label, rawStr) => {
      if (!rawStr) return { label, exists: false, time: '없음', sizeKB: 0, twList: [], parsed: null };
      try {
        const p = JSON.parse(rawStr);
        const time = p?.meta?.publishedAt || p?.meta?.lastDraftSaved || p?.meta?.lastUpdated || '시간 정보 없음';
        const twList = (p?.timeworks || []).slice(0, 7).map((tw) => {
          const chCount = (tw.chaeumPhotos || tw.photos || []).length;
          const hgCount = (tw.huinPhotos || tw.photos || []).length;
          const wkCount = (tw.works || []).length;
          const pCount = (tw.bodyParagraphs || tw.paragraphs || []).length;
          return `${tw.sessionNumber || tw.id}: "${tw.title || ''}" (문단 ${pCount}, 좌사진 ${chCount}, 우사진 ${hgCount}, 기록물 ${wkCount})`;
        });
        return {
          label,
          exists: true,
          time,
          sizeKB: Math.round(rawStr.length / 1024),
          twList,
          parsed: p
        };
      } catch (e) {
        return { label, exists: false, time: '파싱 오류', sizeKB: Math.round(rawStr.length / 1024), twList: [], parsed: null };
      }
    };

    const sources = [
      summarizeSource('1. STORAGE_KEY (라이브 저장소)', localStorage.getItem('DOBONG_DREAM_THEATER_ARCHIVE_V8')),
      summarizeSource('2. DRAFT_STORAGE_KEY (임시 저장소)', localStorage.getItem('DOBONG_DREAM_THEATER_ARCHIVE_DRAFT_V8')),
      summarizeSource('3. IndexedDB JSON 백업 (__archive_data_latest__)', idbJsonItem?.dataUrl || null)
    ];

    // 다른 localStorage 키들도 확인
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k !== 'DOBONG_DREAM_THEATER_ARCHIVE_V8' && k !== 'DOBONG_DREAM_THEATER_ARCHIVE_DRAFT_V8' && k.includes('DOBONG') && !k.includes('AUTH')) {
        sources.push(summarizeSource(`기타 키: ${k}`, localStorage.getItem(k)));
      }
    }

    const mediaBlobs = idbItems.filter((it) => it.id !== '__archive_data_latest__');
    const twMediaCount = mediaBlobs.filter((it) => it.id.startsWith('tw-')).length;
    const latestMediaTime = mediaBlobs.reduce((max, it) => Math.max(max, it.savedAt || 0), 0);
    const latestMediaStr = latestMediaTime ? new Date(latestMediaTime).toLocaleString('ko-KR') : '없음';

    modal = document.createElement('div');
    modal.id = 'storageInspectorModal';
    modal.style.cssText = 'position:fixed; inset:0; z-index:99999; background:rgba(0,0,0,0.65); display:flex; align-items:center; justify-content:center; padding:20px;';
    modal.innerHTML = `
      <div style="background:#fff; width:100%; max-width:860px; max-height:88vh; overflow:auto; border:2px solid #0052FF; padding:24px; box-shadow:0 20px 50px rgba(0,0,0,0.3);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0052FF; padding-bottom:12px; margin-bottom:16px;">
          <h3 style="margin:0; font-size:18px; color:#0052FF;">🔍 브라우저 저장소 진단 및 복구 현황 (${window.location.origin})</h3>
          <button class="adm-btn sm" id="btnCloseInspectorModal">✕ 닫기</button>
        </div>

        <div style="background:#F2F6FF; border:1px solid #C5D7FF; padding:12px; margin-bottom:16px; font-size:12.5px; line-height:1.5;">
          <strong>현재 접속 주소:</strong> <code>${window.location.origin}</code><br/>
          <strong>IndexedDB 저장 미디어 파일:</strong> 총 <strong>${mediaBlobs.length}개</strong> (TimeWork 관련 ${twMediaCount}개 / 최근 파일 저장: ${latestMediaStr})
          <button class="adm-btn primary sm" id="btnForceRecoverMedia" style="margin-left:10px;">♻️ IndexedDB 미연결 파일 강제 복구</button>
        </div>

        <div style="display:flex; flex-direction:column; gap:14px;">
          ${sources.map((src, sIdx) => `
            <div style="border:1.5px solid ${src.exists ? '#0052FF' : '#DDD'}; padding:14px; background:${src.exists ? '#FAFBF8' : '#F9F9F9'};">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div>
                  <strong style="font-size:14px;">${src.label}</strong>
                  <span style="margin-left:10px; font-size:12px; color:#555;">최종 시각: <strong>${src.time}</strong> (${src.sizeKB} KB)</span>
                </div>
                ${src.exists ? `<button class="adm-btn primary sm" data-restore-src-idx="${sIdx}">이 버전으로 복원</button>` : '<span style="font-size:12px; color:#999;">데이터 없음</span>'}
              </div>
              ${src.twList.length ? `
                <ul style="margin:6px 0 0 18px; padding:0; font-size:12px; line-height:1.6; color:#333;">
                  ${src.twList.map((line) => `<li>${line}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('btnCloseInspectorModal').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    modal.querySelectorAll('[data-restore-src-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-restore-src-idx'), 10);
        const targetSrc = sources[idx];
        if (targetSrc && targetSrc.parsed) {
          this.data = targetSrc.parsed;
          window.ArchiveStore.saveData(this.data, `${targetSrc.label}에서 수동 복원`);
          this.renderAll();
          modal.remove();
          this.showToast(`✅ ${targetSrc.label} 데이터로 복원되었습니다!`);
        }
      });
    });

    const forceBtn = document.getElementById('btnForceRecoverMedia');
    if (forceBtn) {
      forceBtn.addEventListener('click', async () => {
        const count = await this.recoverOrphanedTimeWorkMedia();
        this.renderAll();
        modal.remove();
        if (count > 0) {
          this.showToast(`♻️ IndexedDB에서 ${count}개 파일을 TimeWork로 복구했습니다!`);
        } else {
          this.showToast('IndexedDB에 미연결된 TimeWork 파일이 없습니다.');
        }
      });
    }
  }

  bindSidebarNavigation() {
    document.querySelectorAll('[data-adm-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.syncCurrentInputs();
        this.activeTab = btn.getAttribute('data-adm-tab');
        document.querySelectorAll('[data-adm-tab]').forEach((b) => {
          b.classList.toggle('active', b.getAttribute('data-adm-tab') === this.activeTab);
        });
        document.querySelectorAll('.adm-panel').forEach((p) => {
          p.classList.toggle('active', p.id === `adm-panel-${this.activeTab}`);
        });
        this.renderAll();
      });
    });
  }

  renderAll() {
    this.renderGlobalAmbientBar();
    this.renderProjectInfoWorkspace();
    this.renderMonologueWorkspace();
    this.renderTimeWorkWorkspace();
    this.renderAmbientWorkspace();
    this.renderPreviewPublishWorkspace();
  }

  /* ========================================================================
     상단 글로벌 환경음(Ambient Sound) 바
     ======================================================================== */
  renderGlobalAmbientBar() {
    const bar = document.getElementById('globalAmbientBar');
    if (!bar) return;

    const amb = this.data.ambientSettings || {};
    const isPlaying = this.audio.isAmbientPlaying;
    const isShuffle = amb.randomPlay !== false;

    bar.innerHTML = `
      <div class="ambient-bar-left">
        <span class="ambient-pill-tag">🔊 환경음(Ambient) 빠른 제어</span>
        <button class="adm-btn sm ${isPlaying ? 'danger' : 'primary'}" id="btnTopToggleAmbient">
          ${isPlaying ? '■ 환경음 정지' : '▶ 환경음 듣기'}
        </button>
        <label style="display:flex; align-items:center; gap:6px; font-size:12px; color:var(--adm-muted); cursor:pointer;">
          <input type="checkbox" id="chkTopShuffleAmbient" ${isShuffle ? 'checked' : ''} />
          <span>랜덤 셔플 재생 (ON)</span>
        </label>
      </div>

      <div class="ambient-bar-right">
        ${
          this.audio.isPlaying && this.audio.currentElement
            ? `
          <span style="color:var(--adm-accent); font-family:var(--font-mono); font-size:11px;">
            🎙️ 독백 재생 중: ${this.audio.currentElement.childName} · 《${this.audio.currentElement.monologueTitle || this.audio.currentElement.name}》
          </span>
          <button class="adm-btn sm danger" id="btnTopStopVoice">독백 멈추기</button>
        `
            : ''
        }

        <label style="display:flex; align-items:center; gap:6px; font-family:var(--font-mono); font-size:11px; color:var(--adm-muted);">
          <span>볼륨</span>
          <input type="range" id="topAmbVolSlider" min="0" max="1" step="0.05"
                 value="${amb.masterVolume ?? 0.45}" style="width:80px;" />
          <span>${Math.round((amb.masterVolume ?? 0.45) * 100)}%</span>
        </label>
      </div>
    `;

    const btnToggle = document.getElementById('btnTopToggleAmbient');
    if (btnToggle) {
      btnToggle.addEventListener('click', () => {
        this.audio.toggleAmbient();
      });
    }

    const chkShuffle = document.getElementById('chkTopShuffleAmbient');
    if (chkShuffle) {
      chkShuffle.addEventListener('change', (e) => {
        this.data.ambientSettings.randomPlay = e.target.checked;
        this.saveDraft(`환경음 랜덤 셔플이 ${e.target.checked ? '켜짐' : '꺼짐'} 상태로 변경되었습니다.`);
      });
    }

    const volSlider = document.getElementById('topAmbVolSlider');
    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.data.ambientSettings.masterVolume = val;
        this.audio.updateAmbientVolume(val);
      });
      volSlider.addEventListener('change', (e) => {
        this.saveDraft('마스터 볼륨이 저장되었습니다.');
      });
    }

    const btnStopVoice = document.getElementById('btnTopStopVoice');
    if (btnStopVoice) {
      btnStopVoice.addEventListener('click', () => this.audio.stop());
    }
  }

  safeImg(url) {
    if (!url) return '';
    if (url.startsWith('idb://') && window.LargeMediaDB) {
      return window.LargeMediaDB.resolveUrlSync(url) || url;
    }
    if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
    try {
      const [path, query] = url.split('?');
      const nfcPath = path.normalize('NFC');
      const encoded = encodeURI(nfcPath);
      return query ? `${encoded}?${query}` : encoded;
    } catch (e) {
      return encodeURI(url);
    }
  }

  readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawUrl = e.target.result;
        if (file && file.type && file.type.startsWith('image/') && file.type !== 'image/svg+xml' && file.type !== 'image/gif') {
          const img = new Image();
          img.onload = () => {
            const maxDim = 1600;
            let w = img.naturalWidth || img.width;
            let h = img.naturalHeight || img.height;
            if (w > maxDim || h > maxDim) {
              if (w >= h) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
              } else {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
              }
            }
            try {
              const canvas = document.createElement('canvas');
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, w, h);
              const outFormat = file.type === 'image/png' ? 'image/webp' : 'image/webp';
              const compressed = canvas.toDataURL(outFormat, 0.84);
              resolve(compressed.length < rawUrl.length ? compressed : rawUrl);
            } catch (err) {
              resolve(rawUrl);
            }
          };
          img.onerror = () => resolve(rawUrl);
          img.src = rawUrl;
        } else {
          resolve(rawUrl);
        }
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  /* ========================================================================
     [워크스페이스 1] 프로젝트 인포 관리 (PROJECT_INFO)
     ======================================================================== */
  renderProjectInfoWorkspace() {
    const container = document.getElementById('admProjectInfoContainer');
    if (!container) return;

    const pi = this.data.projectInfo || {};
    const meta = this.data.meta || {};
    const chaeum = this.data.spaces?.find((s) => s.id === 'chaeum') || {};
    const huin = this.data.spaces?.find((s) => s.id === 'huingomusin') || {};

    const logoUrl = pi.customLogoUrl || 'image/선과요소/사용/로고.png';

    container.innerHTML = `
      <div class="panel-header">
        <div>
          <h2>1. 프로젝트 인포 관리 (PROJECT_INFO)</h2>
          <p style="font-size:13px; color:var(--adm-muted); margin-top:4px;">
            〈사람 책 도서관: 이야기와 함께 걷기〉의 <strong>프로젝트 로고, 타이틀, 기획 의도 및 두 도서관(채움 & 마을극장 흰고무신) 소개글</strong>을 직접 수정합니다.
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="adm-btn primary" id="btnSaveProjectInfo">💾 프로젝트 인포 저장</button>
          <button class="adm-btn publish-cta" id="btnPublishProjectInfo">🚀 라이브 퍼블리시</button>
        </div>
      </div>

      <div class="form-grid-2">
        <!-- 1) 프로젝트 로고 바로 업로드 및 타이틀 정보 -->
        <div class="adm-card">
          <div class="adm-card-head">
            <strong>🎨 프로젝트 로고 & 메인 타이틀</strong>
          </div>

          <div style="display:flex; gap:20px; align-items:center; margin-bottom:18px; padding:14px; background:var(--adm-bg); border:1px solid var(--adm-border);">
            <div style="width:130px; height:130px; background:#ffffff; border:1px solid var(--adm-border); display:flex; align-items:center; justify-content:center; padding:10px;">
              <img id="piLogoPreview" src="${this.safeImg(logoUrl)}" alt="로고 미리보기" style="max-width:100%; max-height:100%; object-fit:contain;" />
            </div>
            <div style="flex:1;">
              <div style="font-weight:700; font-size:14px; margin-bottom:6px;">프로젝트 로고 이미지</div>
              <p style="font-size:12px; color:var(--adm-muted); margin-bottom:10px;">
                사람 책 도서관 상단과 소개 영역에 과감하게 들어가는 심볼 로고입니다.
              </p>
              <label class="adm-btn primary sm" style="cursor:pointer; display:inline-flex;">
                📁 로고 파일 바로 업로드 (PNG/JPG)
                <input type="file" id="inputPiLogoUpload" accept="image/*" style="display:none;" />
              </label>
              ${
                pi.customLogoUrl
                  ? `<button class="adm-btn sm danger" id="btnResetPiLogo" style="margin-left:6px;">기본 로고로 복원</button>`
                  : ''
              }
            </div>
          </div>

          <div class="form-group">
            <label for="piSiteTitle">사이트 메인 타이틀</label>
            <input type="text" class="adm-input" id="piSiteTitle" value="${meta.siteTitle || '사람 책 도서관: 이야기와 함께 걷기'}" />
          </div>

          <div class="form-group">
            <label for="piSiteSubtitle">서브 타이틀</label>
            <input type="text" class="adm-input" id="piSiteSubtitle" value="${meta.siteSubtitle || ''}" />
          </div>

          <div class="form-group">
            <label for="piKicker">상단 키커 (Kicker)</label>
            <input type="text" class="adm-input" id="piKicker" value="${pi.kicker || 'DOBONG DREAM THEATER · SPATIAL ARCHIVE'}" />
          </div>

          <div class="form-group">
            <label for="piLeadCopy">한 줄 대표 소개글 (Lead Copy)</label>
            <textarea class="adm-input" id="piLeadCopy" rows="3">${pi.leadCopy || ''}</textarea>
          </div>
        </div>

        <!-- 2) 기획 의도, 예술감독의 여는 글 및 함께한 사람들(크레딧) -->
        <div class="adm-card">
          <div class="adm-card-head">
            <strong>📝 기획 의도 & 예술감독의 여는 글</strong>
          </div>

          <div class="form-group">
            <label for="piConceptText">기획 의도 및 컨셉 본문 (문단별로 줄바꿈하여 작성)</label>
            <textarea class="adm-input" id="piConceptText" rows="5" style="font-size:13px; line-height:1.6;">${(pi.conceptText || []).join('\n\n')}</textarea>
          </div>

          <div class="form-group">
            <div style="display:flex; gap:10px; margin-bottom:6px;">
              <div style="flex:0 0 120px;">
                <label for="piDirectorLetterTag">구분 태그</label>
                <input type="text" class="adm-input" id="piDirectorLetterTag" value="${pi.directorLetterTag || '예술감독'}" />
              </div>
              <div style="flex:1;">
                <label for="piDirectorLetterTitle">여는 글 제목</label>
                <input type="text" class="adm-input" id="piDirectorLetterTitle" value="${pi.directorLetterTitle || '예술감독의 여는 글'}" />
              </div>
            </div>
            <label for="piDirectorLetter">예술감독의 여는 글 본문</label>
            <textarea class="adm-input" id="piDirectorLetter" rows="6" style="font-size:13px; line-height:1.7;">${pi.directorLetter || `어린 배우들의 발걸음이 머물렀던 공간은 단순한 연습실을 넘어 하나의 책이 됩니다.
도봉산역 환승 통로의 노란 점자블록부터 마을극장 흰고무신의 작은 나무 액자까지, 아이들은 매일 지나치던 일상의 모퉁이에서 자신의 목소리를 길어 올렸습니다.
〈사람 책 도서관: 이야기와 함께 걷기〉는 그들이 공간의 숨결과 마주하며 써 내려간 20편의 독백을 엮은 살아있는 아카이브입니다.
이 지도 위를 천천히 걸으며, 아이들이 공간에 새겨둔 작고 단단한 마음의 소리에 귀 기울여 주시길 바랍니다.`}</textarea>
          </div>

          <div class="form-group">
            <label for="piCredits">함께한 사람들 (한 줄에 "구분: 역할 — 이름 / 역할 — 이름" 형식으로 입력 · '/' 입력 시 줄바꿈되며, '—' 앞의 역할은 70% 크기 청록색으로 표시됩니다)</label>
            <textarea class="adm-input" id="piCredits" rows="5" style="font-size:13px; font-family:monospace; line-height:1.6;">${(pi.credits && pi.credits.length
              ? pi.credits.map((c) => `${c.role}: ${c.value || c.names || ''}`)
              : [
                  '주최 · 주관: 도봉꿈의극단',
                  '프로젝트명: 〈사람 책 도서관: 이야기와 함께 걷기〉',
                  '참여 사람 책 (총 20권): 청소년예술공간 채움 단원 9명 · 마을극장 흰고무신 단원 11명',
                  '수업 및 기록 공간: 청소년예술공간 채움 · 마을극장 흰고무신',
                  '아카이빙 구성: 예술교육 기록가 · 공간 사진/사운드 아카이브 팀'
                ]
            ).join('\n')}</textarea>
          </div>
        </div>
      </div>
    `;

    // 이벤트 바인딩
    const logoInput = document.getElementById('inputPiLogoUpload');
    if (logoInput) {
      logoInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const dataUrl = await this.readFileAsDataURL(file);
        this.data.projectInfo.customLogoUrl = dataUrl;
        document.getElementById('piLogoPreview').src = dataUrl;
        this.saveDraft('프로젝트 로고가 업로드되었습니다.');
      });
    }

    const resetLogoBtn = document.getElementById('btnResetPiLogo');
    if (resetLogoBtn) {
      resetLogoBtn.addEventListener('click', () => {
        delete this.data.projectInfo.customLogoUrl;
        this.saveDraft('기본 로고로 복원되었습니다.');
        this.renderProjectInfoWorkspace();
      });
    }

    const savePi = () => {
      this.data.meta.siteTitle = document.getElementById('piSiteTitle').value.trim();
      this.data.meta.siteSubtitle = document.getElementById('piSiteSubtitle').value.trim();
      this.data.projectInfo.kicker = document.getElementById('piKicker').value.trim();
      this.data.projectInfo.leadCopy = document.getElementById('piLeadCopy').value.trim();
      this.data.projectInfo.conceptText = document
        .getElementById('piConceptText')
        .value.split(/\n\s*\n/)
        .map((s) => s.trim())
        .filter(Boolean);

      this.data.projectInfo.directorLetterTag = document.getElementById('piDirectorLetterTag').value.trim();
      this.data.projectInfo.directorLetterTitle = document.getElementById('piDirectorLetterTitle').value.trim();
      this.data.projectInfo.directorLetter = document.getElementById('piDirectorLetter').value.trim();

      const credRaw = document.getElementById('piCredits').value.split('\n').map((l) => l.trim()).filter(Boolean);
      this.data.projectInfo.credits = credRaw.map((line) => {
        const colonIdx = line.indexOf(':');
        if (colonIdx !== -1) {
          return { role: line.slice(0, colonIdx).trim(), value: line.slice(colonIdx + 1).trim() };
        }
        return { role: '역할', value: line };
      });
    };

    const btnSave = document.getElementById('btnSaveProjectInfo');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        savePi();
        this.publishNow('프로젝트 인포 정보가 저장 및 라이브에 즉시 반영되었습니다.');
      });
    }

    const btnPub = document.getElementById('btnPublishProjectInfo');
    if (btnPub) {
      btnPub.addEventListener('click', () => {
        savePi();
        this.publishNow('프로젝트 인포 라이브 퍼블리시');
      });
    }
  }

  /* ========================================================================
     [워크스페이스 2] Monologue 관리 (좌측 슬라이드 + 20개 거점 산책경로/공간사진/음성)
     ======================================================================== */
  renderMonologueWorkspace() {
    const container = document.getElementById('admMonologueContainer');
    if (!container) return;

    const hero = this.data.monologueHero || {
      badge: '2026 도봉꿈의극단',
      sub: '',
      title: '사람 책\n도서관',
      titleSize: '104px',
      lead: '이야기와 함께 걷기',
      desc: '지도 위의 거점(원)을 누르면 그 공간의 요소와\n아이들의 생생한 독백으로 이어집니다.',
      align: 'left'
    };
    const numericTitleSize = parseInt(String(hero.titleSize || '104').replace(/[^0-9]/g, ''), 10) || 104;
    const spaces = this.data.spaces || [];
    const currentSpace = spaces.find((s) => s.id === this.monoSpaceTab) || spaces[0];
    const elements = currentSpace?.elements || [];

    container.innerHTML = `
      <div class="panel-header">
        <div>
          <h2>2. Monologue 페이지 관리</h2>
          <p style="font-size:13px; color:var(--adm-muted); margin-top:4px;">
            메인 페이지 <strong>좌측 타이포그래피 안내 텍스트(문구·크기·위치)</strong>와 지도에 연결된 <strong>20개 거점의 산책 동선 순서, 공간 사진(16:9), 독백 음성 및 텍스트</strong>를 관리합니다.
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="adm-btn primary" id="btnSaveMonologue">💾 Monologue 저장</button>
          <button class="adm-btn publish-cta" id="btnPublishMonologue">🚀 라이브 퍼블리시</button>
        </div>
      </div>

      <!-- ================= [섹션 A] Monologue 메인 타이틀 & 안내 텍스트 설정 ================= -->
      <div class="adm-card" style="margin-bottom:24px;">
        <div class="adm-card-head">
          <div>
            <strong>🏷️ Monologue 메인 타이포그래피 & 안내 텍스트 설정</strong>
            <span style="font-size:12px; color:var(--adm-muted); margin-left:8px;">
              지도 좌측에 크게 표시되는 타이틀, 구분 배지, 부제목, 안내 문구 및 글자 크기를 설정합니다.
            </span>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:16px; margin-bottom:14px;">
          <div class="form-group">
            <label for="monoHeroBadge">상단 구분 태그</label>
            <input type="text" class="adm-input" id="monoHeroBadge" value="${hero.badge || '2026 도봉꿈의극단'}" />
          </div>

          <div class="form-group">
            <label for="monoHeroSub">서브 타이틀 (비워두면 숨김)</label>
            <input type="text" class="adm-input" id="monoHeroSub" value="${hero.sub || ''}" placeholder="비워두면 표시되지 않음" />
          </div>

          <div class="form-group">
            <label for="monoHeroTitleSize">‘사람 책 도서관’ 타이틀 글자 크기 (<span id="monoHeroSizeLabel">${numericTitleSize}px</span>)</label>
            <div style="display:flex; align-items:center; gap:8px;">
              <input type="range" id="monoHeroTitleSizeRange" min="40" max="180" step="2" value="${numericTitleSize}" style="flex:1;" />
              <input type="text" class="adm-input" id="monoHeroTitleSize" value="${numericTitleSize}px" style="width:76px; text-align:center;" />
            </div>
          </div>

          <div class="form-group">
            <label for="monoHeroAlign">텍스트 위치 / 정렬</label>
            <select class="adm-input" id="monoHeroAlign">
              <option value="left" ${hero.align === 'left' || !hero.align ? 'selected' : ''}>왼쪽 상단 (기본)</option>
              <option value="center" ${hero.align === 'center' ? 'selected' : ''}>중앙 상단 정렬</option>
            </select>
          </div>
        </div>

        <div class="form-group" style="margin-bottom:14px;">
          <label for="monoHeroTitle">메인 타이틀 문구 (줄바꿈 가능)</label>
          <textarea class="adm-input" id="monoHeroTitle" rows="2" style="font-size:15px; font-weight:800;">${hero.title || '사람 책\n도서관'}</textarea>
        </div>

        <div class="form-group" style="margin-bottom:14px;">
          <label for="monoHeroLead">대표 부제목 (Lead)</label>
          <input type="text" class="adm-input" id="monoHeroLead" value="${hero.lead || '이야기와 함께 걷기'}" />
        </div>

        <div class="form-group">
          <label for="monoHeroDesc">상세 안내 설명문 (줄바꿈 가능)</label>
          <textarea class="adm-input" id="monoHeroDesc" rows="3">${hero.desc || '지도 위의 거점(원)을 누르면 그 공간의 요소와\n아이들의 생생한 독백으로 이어집니다.'}</textarea>
        </div>
      </div>

      <!-- ================= [섹션 B] 20개 거점 고정 산책 경로 & 독백/공간사진/음성 ================= -->
      <div class="adm-card">
        <div class="adm-card-head">
          <div>
            <strong>🧭 20개 거점 고정 산책 경로 &amp; 공간 사진(16:9) · 독백 음성 편집</strong>
            <span style="font-size:12px; color:var(--adm-muted); margin-left:8px;">
              지도.png의 선을 따라 이어지는 산책 순서대로 배치되어 있으며, 사진과 음성을 바로 변경할 수 있습니다.
            </span>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="adm-btn sm ${this.monoSpaceTab === 'chaeum' ? 'primary' : ''}" data-mono-space="chaeum">
              🌸 청소년예술공간 채움 (9개)
            </button>
            <button class="adm-btn sm ${this.monoSpaceTab === 'huingomusin' ? 'primary' : ''}" data-mono-space="huingomusin">
              🌿 마을극장 흰고무신 (11개)
            </button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(360px, 1fr)); gap:16px;">
          ${elements
            .map((el, idx) => {
              const num = this.monoSpaceTab === 'chaeum'
                ? String(idx + 2).padStart(2, '0')
                : String(idx + 11).padStart(2, '0');
              const defaultSpacePhoto = `image/공간/벡터/벡터공간들/web/space-${num}.webp`;
              const vectorCutoutUrl = `image/공간/벡터/web/vec-${num}.png`;
              const hasCustomUpload = el.photoUrl && (el.photoUrl.startsWith('data:') || el.photoUrl.startsWith('idb://'));
              const photoUrl = this.safeImg(hasCustomUpload ? el.photoUrl : defaultSpacePhoto);
              const isPlaying = this.audio.isPlaying && this.audio.currentElement?.id === el.id;

              return `
              <div class="adm-card" style="margin-bottom:0; padding:16px; border:1.5px solid var(--adm-border);" data-mono-elem-id="${el.id}">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                  <span class="admin-badge" style="background:${this.monoSpaceTab === 'chaeum' ? '#ff66cc' : '#86e086'}; color:#000; font-weight:900;">
                    산책 거점 #${idx + 1} (${el.code || ''})
                  </span>
                  <span style="font-size:12px; font-weight:800; color:var(--adm-accent);">${el.childName || ''}</span>
                </div>

                <!-- 실제 벡터가 올라간 공간 사진(16:9) 미리보기 & 바로 변경 버튼 -->
                <div style="position:relative; width:100%; aspect-ratio:16/9; background:#111; overflow:hidden; margin-bottom:10px; border:1px solid var(--adm-border);">
                  <img src="${photoUrl}" alt="${el.name}" style="width:100%; height:100%; object-fit:contain;" id="imgPreview-${el.id}" />
                  <img src="${this.safeImg(vectorCutoutUrl)}" alt="" style="position:absolute; inset:0; width:100%; height:100%; object-fit:contain; pointer-events:none; filter:drop-shadow(0 2px 6px rgba(0,0,0,0.45));" />
                  <label class="adm-btn sm primary" style="position:absolute; right:8px; bottom:8px; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.5); z-index:3;">
                    📷 공간 사진(16:9) 바로 변경
                    <input type="file" accept="image/*" data-elem-photo-upload="${el.id}" style="display:none;" />
                  </label>
                </div>

                <div class="form-group" style="margin-bottom:8px;">
                  <label style="font-size:11px;">아이 이름 (단원 이름)</label>
                  <input type="text" class="adm-input" value="${el.childName || ''}" data-elem-field="childName" data-target-id="${el.id}" placeholder="예: 권민서 (12세)" />
                </div>

                <div class="form-group" style="margin-bottom:8px;">
                  <label style="font-size:11px;">공간 장소명</label>
                  <input type="text" class="adm-input" value="${el.name || ''}" data-elem-field="name" data-target-id="${el.id}" />
                </div>

                <div class="form-group" style="margin-bottom:8px;">
                  <label style="font-size:11px;">독백 제목</label>
                  <input type="text" class="adm-input" value="${el.monologueTitle || el.monologue?.title || ''}" data-elem-field="monologueTitle" data-target-id="${el.id}" />
                </div>

                <div class="form-group" style="margin-bottom:8px;">
                  <label style="font-size:11px; font-weight:800; color:var(--adm-primary);">아이 한 줄 문구 (독백 클릭 시 벡터 이미지 위에 올라오는 문구)</label>
                  <input type="text" class="adm-input" value="${el.quote || el.monologue?.quote || ''}" data-elem-field="quote" data-target-id="${el.id}" placeholder="예: 무빙워크 위에 서 있으면 세상이 나를 앞으로 밀어준다." />
                </div>

                <div class="form-group" style="margin-bottom:8px;">
                  <label style="font-size:11px;">전체 독백 이야기 본문</label>
                  <textarea class="adm-input" rows="3" data-elem-field="monologueText" data-target-id="${el.id}">${el.monologueText || el.monologue?.fullStory || ''}</textarea>
                </div>

                <!-- 독백 오디오 음성 파일 바로 업로드 & 미리듣기 -->
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:var(--adm-bg); border:1px solid var(--adm-border); margin-top:8px;">
                  <div style="font-size:11.5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:180px;">
                    🎙️ <code>${el.audioFileName || (el.audioUrl ? '커스텀 음성 등록됨' : '음성 파일 없음')}</code>
                  </div>
                  <div style="display:flex; gap:6px;">
                    <label class="adm-btn sm" style="cursor:pointer;">
                      음성 업로드
                      <input type="file" accept="audio/*" data-elem-audio-upload="${el.id}" style="display:none;" />
                    </label>
                    ${el.audioUrl ? `<button class="adm-btn sm danger" data-elem-audio-del="${el.id}">삭제</button>` : ''}
                    <button class="adm-btn sm ${isPlaying ? 'danger' : 'primary'}" data-elem-listen="${el.id}">
                      ${isPlaying ? '■ 멈춤' : '▶ 듣기'}
                    </button>
                  </div>
                </div>
              </div>
            `;
            })
            .join('')}
        </div>
      </div>
    `;

    // 이벤트: 모놀로그 메인 히어로 텍스트 & 스타일 실시간 동기화
    const sizeRange = document.getElementById('monoHeroTitleSizeRange');
    const sizeInput = document.getElementById('monoHeroTitleSize');
    const sizeLabel = document.getElementById('monoHeroSizeLabel');
    if (sizeRange && sizeInput) {
      sizeRange.addEventListener('input', (e) => {
        const val = `${e.target.value}px`;
        sizeInput.value = val;
        if (sizeLabel) sizeLabel.textContent = val;
        this.syncCurrentInputs();
      });
      sizeRange.addEventListener('change', () => {
        this.syncCurrentInputs();
        this.saveDraft('타이틀 글자 크기가 저장되었습니다.');
      });
      sizeInput.addEventListener('input', (e) => {
        const num = parseInt(String(e.target.value).replace(/[^0-9]/g, ''), 10);
        if (num >= 40 && num <= 180) {
          sizeRange.value = num;
          if (sizeLabel) sizeLabel.textContent = `${num}px`;
        }
      });
    }

    ['monoHeroBadge', 'monoHeroSub', 'monoHeroTitleSize', 'monoHeroAlign', 'monoHeroTitle', 'monoHeroLead', 'monoHeroDesc'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          this.syncCurrentInputs();
          this.saveDraft('모놀로그 안내 텍스트가 임시저장되었습니다.');
        });
        el.addEventListener('change', () => {
          this.syncCurrentInputs();
          this.saveDraft('모놀로그 안내 텍스트가 저장되었습니다.');
        });
      }
    });

    // 공간 탭 전환 (채움 / 흰고무신) — 탭 이동 전 현재 입력창 정보 자동 동기화
    container.querySelectorAll('[data-mono-space]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.syncCurrentInputs();
        this.monoSpaceTab = btn.getAttribute('data-mono-space');
        this.renderMonologueWorkspace();
      });
    });

    // 거점 공간 사진 바로 업로드 (LargeMediaDB 연동으로 쿼터 초과 원천 방지)
    container.querySelectorAll('[data-elem-photo-upload]').forEach((input) => {
      input.addEventListener('change', async (e) => {
        const elId = input.getAttribute('data-elem-photo-upload');
        const file = e.target.files[0];
        if (!file) return;
        const dataUrl = await this.readFileAsDataURL(file);

        const blobId = `photo-${elId}`;
        if (window.LargeMediaDB) {
          await window.LargeMediaDB.saveBlob(blobId, dataUrl, { fileName: file.name, elId });
        }

        const spacesList = Array.isArray(this.data.spaces)
          ? this.data.spaces
          : Object.values(this.data.spaces || {});

        for (const sp of spacesList) {
          const target = (sp.elements || []).find((el) => el.id === elId);
          if (target) {
            target.photoUrl = `idb://${blobId}`;
            target.photo = `idb://${blobId}`;
            target.photoFileName = file.name;
            break;
          }
        }
        const img = document.getElementById(`imgPreview-${elId}`);
        if (img) img.src = dataUrl;
        this.saveDraft(`거점 사진이 업로드되었습니다.`);
      });
    });

    // 거점 독백 음성 바로 업로드 (IndexedDB 연동으로 대용량 음성 파일도 100% 안전 저장)
    container.querySelectorAll('[data-elem-audio-upload]').forEach((input) => {
      input.addEventListener('change', async (e) => {
        const elId = input.getAttribute('data-elem-audio-upload');
        const file = e.target.files[0];
        if (!file) return;
        const dataUrl = await this.readFileAsDataURL(file);

        const blobId = `audio-${elId}`;
        if (window.LargeMediaDB) {
          await window.LargeMediaDB.saveBlob(blobId, dataUrl, { fileName: file.name, elId });
        }

        const spacesList = Array.isArray(this.data.spaces)
          ? this.data.spaces
          : Object.values(this.data.spaces || {});

        for (const sp of spacesList) {
          const target = (sp.elements || []).find((el) => el.id === elId);
          if (target) {
            target.audioUrl = `idb://${blobId}`;
            target.audioFileName = file.name;
            break;
          }
        }
        this.saveDraft(`거점 독백 음성(${file.name})이 등록되었습니다.`);
        this.renderMonologueWorkspace();
      });
    });

    // 거점 독백 음성 삭제
    container.querySelectorAll('[data-elem-audio-del]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const elId = btn.getAttribute('data-elem-audio-del');
        if (window.LargeMediaDB) {
          await window.LargeMediaDB.deleteBlob(`audio-${elId}`);
        }
        const spacesList = Array.isArray(this.data.spaces)
          ? this.data.spaces
          : Object.values(this.data.spaces || {});

        for (const sp of spacesList) {
          const target = (sp.elements || []).find((el) => el.id === elId);
          if (target) {
            target.audioUrl = '';
            target.audioFileName = '';
            break;
          }
        }
        this.saveDraft(`거점 독백 음성이 삭제되었습니다.`);
        this.renderMonologueWorkspace();
      });
    });

    // 음성 미리듣기
    container.querySelectorAll('[data-elem-listen]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const elId = btn.getAttribute('data-elem-listen');
        const all = window.ArchiveStore.getAllElements(this.data);
        const target = all.find((e) => e.id === elId);
        if (!target) return;

        if (this.audio.isPlaying && this.audio.currentElement?.id === elId) {
          this.audio.stop();
        } else {
          this.audio.play(target);
        }
      });
    });

    // 거점 텍스트 필드 변경 감지 (실시간 input 및 change 모두 반영)
    container.querySelectorAll('[data-elem-field]').forEach((input) => {
      const applyFieldValue = () => {
        const elId = input.getAttribute('data-target-id');
        const field = input.getAttribute('data-elem-field');
        const val = input.value.trim();

        const spacesList = Array.isArray(this.data.spaces)
          ? this.data.spaces
          : Object.values(this.data.spaces || {});

        for (const sp of spacesList) {
          const target = (sp.elements || []).find((el) => el.id === elId);
          if (target) {
            target[field] = val;
            target.monologue = target.monologue || {};
            if (field === 'childName') target.childName = val;
            if (field === 'name') target.name = val;
            if (field === 'monologueTitle') {
              target.monologueTitle = val;
              target.monologue.title = val;
            }
            if (field === 'quote') {
              target.quote = val;
              target.monologue.quote = val;
            }
            if (field === 'monologueText') {
              target.monologueText = val;
              target.monologue.fullStory = val;
            }
            break;
          }
        }
      };

      input.addEventListener('input', () => {
        applyFieldValue();
      });

      input.addEventListener('change', (e) => {
        applyFieldValue();
        this.saveDraft('독백 텍스트 정보가 저장되었습니다.');
      });
    });

    const btnSave = document.getElementById('btnSaveMonologue');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        this.syncCurrentInputs();
        this.publishNow('Monologue 페이지 정보가 저장 및 라이브에 즉시 반영되었습니다.');
      });
    }

    const btnPub = document.getElementById('btnPublishMonologue');
    if (btnPub) {
      btnPub.addEventListener('click', () => {
        this.syncCurrentInputs();
        this.publishNow('Monologue 페이지 라이브 퍼블리시');
      });
    }
  }

  /* ========================================================================
     [워크스페이스 3] TimeWork 관리 (10개 수업 회차 책 펼침면 1:1 직관 편집)
     ======================================================================== */
  renderTimeWorkWorkspace() {
    const container = document.getElementById('admTimeWorkContainer');
    if (!container) return;

    const timeworks = this.data.timeworks || [];
    if (!timeworks.length) return;

    if (this.twActivePageIdx >= timeworks.length) this.twActivePageIdx = 0;
    const session = timeworks[this.twActivePageIdx];

    const chPhotos = (session.chaeumPhotos || session.photos || []).map((p) =>
      typeof p === 'string' ? p : p.url || p.filePath || ''
    );
    const huinPhotos = (session.huinPhotos || session.photos || []).map((p) =>
      typeof p === 'string' ? p : p.url || p.filePath || ''
    );
    const footnotes = session.footnotes || [];
    const works = session.works || [];

    container.innerHTML = `
      <div class="panel-header">
        <div>
          <h2>3. TimeWork 관리 (수업 회차별 1:1 직관 편집)</h2>
          <p style="font-size:13px; color:var(--adm-muted); margin-top:4px;">
            실제 사이트의 책 펼침면과 <strong>동일한 10개 수업 페이지 구조</strong>에서 제목, 본문, 좌/우 사진(채움 & 마을극장), 풋노트 책갈피 및 <strong>우리의 기록 파일을 바로 업로드</strong>합니다.
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="adm-btn primary" id="btnSaveTimeWork">💾 TimeWork 저장</button>
          <button class="adm-btn publish-cta" id="btnPublishTimeWork">🚀 라이브 퍼블리시</button>
        </div>
      </div>

      <!-- 회차 선택 탭 (P.01 ~ P.10) -->
      <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:20px; padding:10px; background:var(--adm-bg); border:1px solid var(--adm-border);">
        <span style="font-weight:900; font-size:12px; margin-right:8px; align-self:center;">수업 회차 선택:</span>
        ${timeworks
          .map(
            (tw, idx) => `
          <button class="adm-btn sm ${idx === this.twActivePageIdx ? 'primary' : ''}" data-tw-tab-idx="${idx}">
            ${tw.sessionNumber || String(idx + 1).padStart(2, '0')} (${tw.date || '회차'})
          </button>
        `
          )
          .join('')}
      </div>

      <!-- 회차 편집 본문 카드 -->
      <div class="adm-card">
        <div class="adm-card-head">
          <div>
            <strong>📖 수업 회차 ${session.sessionNumber || this.twActivePageIdx + 1} 편집</strong>
            <span style="font-size:12px; color:var(--adm-muted); margin-left:8px;">${session.date || ''}</span>
          </div>
        </div>

        <!-- 1) 헤더 정보 -->
        <div class="form-grid-3">
          <div class="form-group">
            <label>수업 날짜</label>
            <input type="text" class="adm-input" id="twDateInput" value="${session.date || ''}" />
          </div>
          <div class="form-group" style="grid-column: span 2;">
            <label>회차 제목</label>
            <input type="text" class="adm-input" id="twTitleInput" value="${session.title || ''}" />
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>리드 인용구</label>
            <textarea class="adm-input" id="twLeadQuoteInput" rows="2">${session.summary || session.leadQuote || ''}</textarea>
          </div>
          <div class="form-group">
            <label>해시태그 키워드 (쉼표로 구분)</label>
            <input type="text" class="adm-input" id="twKeywordsInput" value="${(session.keywords || []).join(', ')}" />
          </div>
        </div>

        <!-- 2) 좌/우 분할 수업 사진 (파일 바로 추가) -->
        <div class="form-grid-2" style="margin-top:10px; margin-bottom:20px;">
          <!-- 좌측: 사진 상단 텍스트 및 사진들 -->
          <div style="padding:14px; background:var(--adm-bg); border:1px solid var(--adm-border);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
              <div>
                <strong style="color:var(--c-blue);">🌸 [좌측] 사진 영역 (${chPhotos.length}장)</strong>
                <span style="font-size:11px; color:var(--adm-muted); margin-left:6px;">
                  💡 썸네일을 드래그하여 순서 변경
                </span>
              </div>
              <label class="adm-btn primary sm" style="cursor:pointer; display:inline-flex;">
                + 사진 바로 추가
                <input type="file" accept="image/*" multiple id="inputUploadTwChaeum" style="display:none;" />
              </label>
            </div>
            <div class="form-group" style="margin-bottom:10px;">
              <label style="font-size:11px;">좌측 사진 위 표시 텍스트</label>
              <input type="text" class="adm-input" id="twChaeumLabelInput" value="${session.chaeumPhotoLabel || '청소년예술공간 채움'}" placeholder="예: 청소년예술공간 채움" />
            </div>
            <div class="tw-sortable-grid" data-sort-type="chaeum" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(90px, 1fr)); gap:8px;">
              ${chPhotos
                .map(
                  (url, pIdx) => `
                <div class="tw-thumb-item"
                     draggable="true"
                     data-thumb-idx="${pIdx}"
                     data-sort-type="chaeum"
                     title="드래그하여 순서 변경 (현재 ${pIdx + 1}번째)"
                     style="position:relative; width:100%; height:75px; background:#000; border:2px solid var(--adm-border); cursor:grab;">
                  <span style="position:absolute; top:2px; left:2px; background:rgba(0,82,255,0.88); color:#fff; font-size:10px; font-weight:800; padding:1px 5px; border-radius:2px; pointer-events:none; z-index:3;">${pIdx + 1}</span>
                  <img src="${this.safeImg(url)}" alt="" style="width:100%; height:100%; object-fit:cover; pointer-events:none;" />
                  <button class="adm-btn sm danger" data-del-ch-photo="${pIdx}" title="삭제" style="position:absolute; top:2px; right:2px; padding:1px 5px; font-size:10px; z-index:4;">✕</button>
                </div>
              `
                )
                .join('')}
            </div>
          </div>

          <!-- 우측: 사진 상단 텍스트 및 사진들 -->
          <div style="padding:14px; background:var(--adm-bg); border:1px solid var(--adm-border);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
              <div>
                <strong style="color:var(--c-blue);">🌿 [우측] 사진 영역 (${huinPhotos.length}장)</strong>
                <span style="font-size:11px; color:var(--adm-muted); margin-left:6px;">
                  💡 썸네일을 드래그하여 순서 변경
                </span>
              </div>
              <label class="adm-btn primary sm" style="cursor:pointer; display:inline-flex;">
                + 사진 바로 추가
                <input type="file" accept="image/*" multiple id="inputUploadTwHuin" style="display:none;" />
              </label>
            </div>
            <div class="form-group" style="margin-bottom:10px;">
              <label style="font-size:11px;">우측 사진 위 표시 텍스트</label>
              <input type="text" class="adm-input" id="twHuinLabelInput" value="${session.huinPhotoLabel || '마을극장 흰고무신'}" placeholder="예: 마을극장 흰고무신" />
            </div>
            <div class="tw-sortable-grid" data-sort-type="huin" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(90px, 1fr)); gap:8px;">
              ${huinPhotos
                .map(
                  (url, pIdx) => `
                <div class="tw-thumb-item"
                     draggable="true"
                     data-thumb-idx="${pIdx}"
                     data-sort-type="huin"
                     title="드래그하여 순서 변경 (현재 ${pIdx + 1}번째)"
                     style="position:relative; width:100%; height:75px; background:#000; border:2px solid var(--adm-border); cursor:grab;">
                  <span style="position:absolute; top:2px; left:2px; background:rgba(32,185,226,0.92); color:#fff; font-size:10px; font-weight:800; padding:1px 5px; border-radius:2px; pointer-events:none; z-index:3;">${pIdx + 1}</span>
                  <img src="${this.safeImg(url)}" alt="" style="width:100%; height:100%; object-fit:cover; pointer-events:none;" />
                  <button class="adm-btn sm danger" data-del-hg-photo="${pIdx}" title="삭제" style="position:absolute; top:2px; right:2px; padding:1px 5px; font-size:10px; z-index:4;">✕</button>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        </div>

        <!-- 3) 본문 2단 문단 -->
        <div class="form-group">
          <label style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
            <span>본문 2단 내용 (문단별로 빈 줄을 두어 구분)</span>
            <span style="font-size:12px; font-weight:700; color:var(--c-blue);">
              💡 문단 사이를 두 줄 띄우면(엔터 3번) 우측 열로 나뉩니다 · '#해시태그_단어'는 굵은 글씨 · 각주는 [*1], [*2] 입력
            </span>
          </label>
          <textarea class="adm-input" id="twBodyInput" rows="8" style="line-height:1.6; font-size:13.5px;" placeholder="내용을 입력하세요. 문단 사이를 두 줄 띄우면 우측 열로 나뉩니다. '#예술가의_시작'처럼 작성하면 굵은 글씨로 표시됩니다. 문장 뒤에 [*1] 처럼 각주 태그를 넣으시면 해당 위치에 각주가 달립니다.">${session.bodyText || (session.bodyParagraphs || session.paragraphs || []).join('\n\n')}</textarea>
        </div>

        <!-- 4) 본문 옆 풋노트(책갈피) 관리 -->
        <div style="margin-top:20px; padding:14px; background:var(--adm-bg); border:1px solid var(--adm-border);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <div>
              <strong>🏷️ 본문 옆 풋노트 책갈피 (${footnotes.length}개)</strong>
              <div style="font-size:11.5px; color:var(--adm-muted); margin-top:2px;">
                본문에 <code>[*1]</code>, <code>[*2]</code>, <code>[*3]</code>을 넣으면 각 번호의 풋노트가 문장 뒤에 연동됩니다.
              </div>
            </div>
            <button class="adm-btn sm primary" id="btnAddFootnote">+ 풋노트 추가</button>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:10px;" id="twFootnotesGrid">
            ${footnotes
              .map(
                (fn, fnIdx) => {
                  const markerTag = `[*${fnIdx + 1}]`;
                  return `
              <div style="background:#ffffff; border:1px solid var(--adm-border); padding:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <div style="display:flex; align-items:center; gap:6px;">
                    <span style="font-weight:900; font-size:12px; color:var(--c-blue);">${fn.marker || `*${fnIdx + 1}`}</span>
                    <button type="button" class="adm-btn sm" data-insert-fn-tag="${markerTag}" style="padding:1px 6px; font-size:10.5px; background:#eff6ff; color:var(--c-blue); border:1px solid #bfdbfe; font-weight:700;" title="본문 커서 위치에 ${markerTag} 삽입">
                      + 본문에 ${markerTag} 삽입
                    </button>
                  </div>
                  <button class="adm-btn sm danger" data-del-fn-idx="${fnIdx}" style="padding:1px 6px; font-size:11px;">삭제</button>
                </div>
                <input type="text" class="adm-input" value="${fn.title || ''}" data-fn-field="title" data-fn-idx="${fnIdx}" placeholder="풋노트 제목" style="margin-bottom:6px; font-size:12px;" />
                <textarea class="adm-input" rows="2" data-fn-field="content" data-fn-idx="${fnIdx}" placeholder="내용" style="font-size:12px;">${fn.content || fn.body || ''}</textarea>
              </div>
            `;
                }
              )
              .join('')}
          </div>
        </div>

        <!-- 5) 우리의 기록 간편 업로드 (파일 바로 업로드) -->
        <div style="margin-top:20px; padding:16px; background:#FAFBF8; border:1.5px solid var(--c-blue);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
            <div>
              <strong style="color:var(--c-blue); font-size:14px;">🎨 우리의 기록 (${works.length}개)</strong>
              <span style="font-size:12px; color:var(--adm-muted); margin-left:8px;">
                복잡한 단계 없이 사진을 바로 추가하며, 카드를 마우스로 드래그하면 순서가 변경됩니다.
              </span>
            </div>
            <label class="adm-btn primary sm" style="cursor:pointer; display:inline-flex;">
              + 작업물 이미지 바로 업로드 (다중 선택 가능)
              <input type="file" accept="image/*" multiple id="inputUploadTwWorks" style="display:none;" />
            </label>
          </div>

          <div class="tw-sortable-grid" data-sort-type="works" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:14px;" id="twWorksGrid">
            ${works
              .map((w, wIdx) => {
                const img = this.safeImg(w.image || w.imageUrl);
                return `
                <div class="tw-work-card-sortable"
                     draggable="true"
                     data-thumb-idx="${wIdx}"
                     data-sort-type="works"
                     title="카드를 드래그하여 순서 변경 (현재 ${wIdx + 1}번째)"
                     style="background:#ffffff; border:1.5px solid var(--c-blue); padding:12px; box-shadow:3px 3px 0 rgba(32,185,226,0.18); cursor:grab;">
                  <div class="tw-card-drag-handle" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding-bottom:6px; border-bottom:1.5px dashed rgba(32,185,226,0.3); font-size:11.5px; font-weight:800; color:var(--c-blue);">
                    <span style="display:flex; align-items:center; gap:4px; pointer-events:none;">
                      <span>☰</span> <span>순서 ${wIdx + 1}</span> <span style="font-size:10px; opacity:0.7;">(드래그 이동)</span>
                    </span>
                    <button class="adm-btn sm danger" data-del-work-idx="${wIdx}" style="padding:1px 6px; font-size:11px;">삭제</button>
                  </div>
                  <div style="position:relative; width:100%; height:130px; background:#000; overflow:hidden; margin-bottom:8px; border:1px solid var(--adm-border);">
                    <img src="${img}" alt="${w.title}" style="width:100%; height:100%; object-fit:cover; pointer-events:none;" />
                  </div>
                  <div class="form-group" style="margin-bottom:6px;">
                    <label style="font-size:11px;">작업물 제목</label>
                    <input type="text" class="adm-input" value="${w.title || ''}" data-work-field="title" data-work-idx="${wIdx}" style="font-size:12px;" />
                  </div>
                  <div class="form-group" style="margin-bottom:6px;">
                    <label style="font-size:11px;">만든이 (단원 이름)</label>
                    <input type="text" class="adm-input" value="${w.author || w.childName || ''}" data-work-field="childName" data-work-idx="${wIdx}" style="font-size:12px;" />
                  </div>
                  <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size:11px;">설명 (선택)</label>
                    <textarea class="adm-input" rows="2" data-work-field="description" data-work-idx="${wIdx}" style="font-size:12px;">${w.description || ''}</textarea>
                  </div>
                </div>
              `;
              })
              .join('')}
          </div>
        </div>
      </div>
    `;

    // 회차 전환
    container.querySelectorAll('[data-tw-tab-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.syncCurrentInputs();
        this.twActivePageIdx = parseInt(btn.getAttribute('data-tw-tab-idx'), 10);
        this.renderTimeWorkWorkspace();
      });
    });

    // 채움 사진 바로 추가 (크기 자동 최적화 + IndexedDB 즉시 저장 + 페이지별 반영)
    const chInput = document.getElementById('inputUploadTwChaeum');
    if (chInput) {
      chInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        if (!Array.isArray(session.chaeumPhotos)) session.chaeumPhotos = [...chPhotos];
        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          this.showToast(`⏳ 좌측 이미지 최적화 및 저장 중... (${i + 1}/${files.length})`);
          const dataUrl = await this.readFileAsDataURL(f);
          const blobId = `tw-ch-${session.id}-${Date.now()}-${i}`;
          if (window.LargeMediaDB) {
            await window.LargeMediaDB.saveBlob(blobId, dataUrl, { twId: session.id, side: 'chaeum', fileName: f.name });
            session.chaeumPhotos.push(`idb://${blobId}`);
          } else {
            session.chaeumPhotos.push(dataUrl);
          }
        }
        const res = await window.ArchiveStore.saveDataAsync(this.data, `${session.sessionNumber}페이지 좌측 사진 ${files.length}장 업로드`);
        this.refreshPreviewIframe();
        this.renderTimeWorkWorkspace();
        if (res && res.ok) {
          this.showToast(`✅ ${session.sessionNumber}페이지 좌측 사진 ${files.length}장이 최적화되어 저장되었습니다.`);
        } else {
          this.showToast(`❌ 사진 저장 오류: ${res?.error || '저장소 쓰기 실패'}`);
        }
      });
    }

    // 채움 사진 삭제
    container.querySelectorAll('[data-del-ch-photo]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const pIdx = parseInt(btn.getAttribute('data-del-ch-photo'), 10);
        if (!Array.isArray(session.chaeumPhotos)) session.chaeumPhotos = [...chPhotos];
        const removed = session.chaeumPhotos[pIdx];
        if (typeof removed === 'string' && removed.startsWith('idb://') && window.LargeMediaDB) {
          await window.LargeMediaDB.deleteBlob(removed.replace('idb://', ''));
        }
        session.chaeumPhotos.splice(pIdx, 1);
        await window.ArchiveStore.saveDataAsync(this.data, `${session.sessionNumber}페이지 좌측 사진 삭제`);
        this.refreshPreviewIframe();
        this.renderTimeWorkWorkspace();
        this.showToast('채움 사진이 삭제되었습니다.');
      });
    });

    // 흰고무신 사진 바로 추가 (크기 자동 최적화 + IndexedDB 즉시 저장 + 페이지별 반영)
    const huinInput = document.getElementById('inputUploadTwHuin');
    if (huinInput) {
      huinInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        if (!Array.isArray(session.huinPhotos)) session.huinPhotos = [...huinPhotos];
        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          this.showToast(`⏳ 우측 이미지 최적화 및 저장 중... (${i + 1}/${files.length})`);
          const dataUrl = await this.readFileAsDataURL(f);
          const blobId = `tw-hg-${session.id}-${Date.now()}-${i}`;
          if (window.LargeMediaDB) {
            await window.LargeMediaDB.saveBlob(blobId, dataUrl, { twId: session.id, side: 'huingomusin', fileName: f.name });
            session.huinPhotos.push(`idb://${blobId}`);
          } else {
            session.huinPhotos.push(dataUrl);
          }
        }
        const res = await window.ArchiveStore.saveDataAsync(this.data, `${session.sessionNumber}페이지 우측 사진 ${files.length}장 업로드`);
        this.refreshPreviewIframe();
        this.renderTimeWorkWorkspace();
        if (res && res.ok) {
          this.showToast(`✅ ${session.sessionNumber}페이지 우측 사진 ${files.length}장이 최적화되어 저장되었습니다.`);
        } else {
          this.showToast(`❌ 사진 저장 오류: ${res?.error || '저장소 쓰기 실패'}`);
        }
      });
    }

    // 흰고무신 사진 삭제
    container.querySelectorAll('[data-del-hg-photo]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const pIdx = parseInt(btn.getAttribute('data-del-hg-photo'), 10);
        if (!Array.isArray(session.huinPhotos)) session.huinPhotos = [...huinPhotos];
        const removed = session.huinPhotos[pIdx];
        if (typeof removed === 'string' && removed.startsWith('idb://') && window.LargeMediaDB) {
          await window.LargeMediaDB.deleteBlob(removed.replace('idb://', ''));
        }
        session.huinPhotos.splice(pIdx, 1);
        await window.ArchiveStore.saveDataAsync(this.data, `${session.sessionNumber}페이지 우측 사진 삭제`);
        this.refreshPreviewIframe();
        this.renderTimeWorkWorkspace();
        this.showToast('흰고무신 사진이 삭제되었습니다.');
      });
    });

    // 우리의 기록 바로 업로드 (크기 자동 최적화 + IndexedDB 즉시 저장)
    const worksInput = document.getElementById('inputUploadTwWorks');
    if (worksInput) {
      worksInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        session.works = session.works || [];
        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          this.showToast(`⏳ 작업물 이미지 최적화 및 저장 중... (${i + 1}/${files.length})`);
          const dataUrl = await this.readFileAsDataURL(f);
          const rawName = f.name.replace(/\.[^/.]+$/, '');
          const workId = `wk-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          const blobId = `tw-wk-${workId}`;
          let storedRef = dataUrl;
          if (window.LargeMediaDB) {
            await window.LargeMediaDB.saveBlob(blobId, dataUrl, { twId: session.id, workId, title: rawName, fileName: f.name });
            storedRef = `idb://${blobId}`;
          }
          session.works.push({
            id: workId,
            title: rawName,
            childName: '단원',
            author: '단원',
            workType: '작업 기록',
            description: '',
            image: storedRef,
            imageUrl: storedRef
          });
        }
        const res = await window.ArchiveStore.saveDataAsync(this.data, `${session.sessionNumber}페이지 우리의 기록 ${files.length}개 등록`);
        this.refreshPreviewIframe();
        this.renderTimeWorkWorkspace();
        if (res && res.ok) {
          this.showToast(`✅ ${session.sessionNumber}페이지 우리의 기록 ${files.length}개가 최적화되어 저장되었습니다.`);
        } else {
          this.showToast(`❌ 작업물 저장 오류: ${res?.error || '저장소 쓰기 실패'}`);
        }
      });
    }

    // 작업물 필드 수정
    container.querySelectorAll('[data-work-field]').forEach((input) => {
      input.addEventListener('change', (e) => {
        const wIdx = parseInt(input.getAttribute('data-work-idx'), 10);
        const field = input.getAttribute('data-work-field');
        if (session.works && session.works[wIdx]) {
          session.works[wIdx][field] = input.value.trim();
          if (field === 'childName') session.works[wIdx].author = input.value.trim();
          this.saveDraft('작업물 정보가 수정되었습니다.');
        }
      });
    });

    // 작업물 삭제
    container.querySelectorAll('[data-del-work-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const wIdx = parseInt(btn.getAttribute('data-del-work-idx'), 10);
        if (confirm('이 작업물을 삭제하시겠습니까?')) {
          const targetWork = session.works[wIdx];
          const imgRef = targetWork?.image || targetWork?.imageUrl || '';
          if (typeof imgRef === 'string' && imgRef.startsWith('idb://') && window.LargeMediaDB) {
            window.LargeMediaDB.deleteBlob(imgRef.replace('idb://', ''));
          }
          session.works.splice(wIdx, 1);
          this.saveDraft('작업물이 삭제되었습니다.');
          this.renderTimeWorkWorkspace();
        }
      });
    });

    // 풋노트 추가
    const btnAddFn = document.getElementById('btnAddFootnote');
    if (btnAddFn) {
      btnAddFn.addEventListener('click', () => {
        session.footnotes = session.footnotes || [];
        const n = session.footnotes.length + 1;
        session.footnotes.push({
          id: `fn-${Date.now()}`,
          marker: `*${n}`,
          title: `기록 노트 ${n}`,
          content: '',
          body: '',
          author: '아카이빙 기록'
        });
        this.saveDraft('풋노트가 추가되었습니다.');
        this.renderTimeWorkWorkspace();
      });
    }

    // 풋노트 수정
    container.querySelectorAll('[data-fn-field]').forEach((input) => {
      input.addEventListener('change', (e) => {
        const fnIdx = parseInt(input.getAttribute('data-fn-idx'), 10);
        const field = input.getAttribute('data-fn-field');
        if (session.footnotes && session.footnotes[fnIdx]) {
          session.footnotes[fnIdx][field] = input.value.trim();
          if (field === 'content') session.footnotes[fnIdx].body = input.value.trim();
          this.saveDraft('풋노트가 수정되었습니다.');
        }
      });
    });

    // 풋노트 본문 삽입 버튼
    container.querySelectorAll('[data-insert-fn-tag]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tag = btn.getAttribute('data-insert-fn-tag');
        const textarea = document.getElementById('twBodyInput');
        if (!textarea) return;
        const start = textarea.selectionStart ?? textarea.value.length;
        const end = textarea.selectionEnd ?? textarea.value.length;
        const text = textarea.value;
        textarea.value = text.substring(0, start) + tag + text.substring(end);
        const newPos = start + tag.length;
        textarea.selectionStart = textarea.selectionEnd = newPos;
        textarea.focus();
        saveTw();
        window.ArchiveStore.saveDraft(this.data);
        this.refreshPreviewIframe();
      });
    });

    // 풋노트 삭제
    container.querySelectorAll('[data-del-fn-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const fnIdx = parseInt(btn.getAttribute('data-del-fn-idx'), 10);
        session.footnotes.splice(fnIdx, 1);
        this.saveDraft('풋노트가 삭제되었습니다.');
        this.renderTimeWorkWorkspace();
      });
    });

    // 저장 함수
    const saveTw = () => {
      session.date = document.getElementById('twDateInput').value.trim();
      session.title = document.getElementById('twTitleInput').value.trim();
      session.summary = document.getElementById('twLeadQuoteInput').value.trim();
      session.leadQuote = session.summary;
      const chLabelEl = document.getElementById('twChaeumLabelInput');
      if (chLabelEl) session.chaeumPhotoLabel = chLabelEl.value.trim();
      const hgLabelEl = document.getElementById('twHuinLabelInput');
      if (hgLabelEl) session.huinPhotoLabel = hgLabelEl.value.trim();
      session.keywords = document
        .getElementById('twKeywordsInput')
        .value.split(',')
        .map((s) => s.replace(/^#/, '').trim())
        .filter(Boolean);
      const twBodyEl = document.getElementById('twBodyInput');
      if (twBodyEl) {
        session.bodyText = twBodyEl.value;
        session.bodyColumns = twBodyEl.value.split(/\n\s*\n\s*\n+/).map((col) =>
          col.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)
        ).filter((col) => col.length > 0);
        session.bodyParagraphs = twBodyEl.value
          .split(/\n\s*\n/)
          .map((s) => s.trim())
          .filter(Boolean);
        session.paragraphs = session.bodyParagraphs;
      }
    };

    // 텍스트 입력 실시간 자동 저장 (새로고침해도 작성 중인 텍스트 손실 방지)
    let twAutoSaveTimer = null;
    ['twDateInput', 'twTitleInput', 'twLeadQuoteInput', 'twKeywordsInput', 'twChaeumLabelInput', 'twHuinLabelInput', 'twBodyInput'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          saveTw();
          clearTimeout(twAutoSaveTimer);
          twAutoSaveTimer = setTimeout(() => {
            window.ArchiveStore.saveDraft(this.data);
            this.refreshPreviewIframe();
          }, 400);
        });
        el.addEventListener('change', () => {
          clearTimeout(twAutoSaveTimer);
          saveTw();
          window.ArchiveStore.saveDraft(this.data);
          this.refreshPreviewIframe();
        });
      }
    });

    const btnSave = document.getElementById('btnSaveTimeWork');
    if (btnSave) {
      btnSave.addEventListener('click', async () => {
        this.showToast(`⏳ ${session.sessionNumber}페이지 저장 중입니다...`);
        saveTw();
        this.syncCurrentInputs();
        const res = await window.ArchiveStore.saveDataAsync(this.data, `TimeWork ${session.sessionNumber}페이지 저장`);
        this.refreshPreviewIframe();
        if (res && res.ok) {
          this.showToast(`✅ TimeWork ${session.sessionNumber}페이지 텍스트와 파일이 저장되었습니다.`);
        } else {
          this.showToast(`❌ 저장 오류: ${res?.error || '저장소 쓰기 실패'}`);
          alert(`저장 중 오류가 발생했습니다:\n${res?.error || '저장소 쓰기 실패'}`);
        }
      });
    }

    const btnPub = document.getElementById('btnPublishTimeWork');
    if (btnPub) {
      btnPub.addEventListener('click', async () => {
        saveTw();
        await this.publishNow(`TimeWork ${session.sessionNumber}페이지 라이브 퍼블리시`);
      });
    }

    // 사진 썸네일 & 작업물 드래그 앤 드롭 순서 변경 바인딩
    this.setupThumbnailDragAndDrop(session, container);
  }

  // TimeWork 좌/우 사진 및 작업물 썸네일 드래그 앤 드롭 순서 변경
  setupThumbnailDragAndDrop(session, container) {
    let draggedType = null;
    let draggedIdx = null;

    const sortables = container.querySelectorAll('[draggable="true"][data-sort-type]');
    sortables.forEach((item) => {
      // 텍스트 필드, 버튼, 텍스트 영역 등 클릭 시 드래그 동작 충돌 방지
      item.querySelectorAll('input, textarea, button').forEach((el) => {
        el.setAttribute('draggable', 'false');
        el.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          item.setAttribute('draggable', 'false');
        });
        el.addEventListener('mouseup', () => {
          item.setAttribute('draggable', 'true');
        });
        el.addEventListener('mouseleave', () => {
          item.setAttribute('draggable', 'true');
        });
      });

      item.addEventListener('dragstart', (e) => {
        draggedType = item.getAttribute('data-sort-type');
        draggedIdx = parseInt(item.getAttribute('data-thumb-idx'), 10);
        item.classList.add('is-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', `${draggedType}:${draggedIdx}`);
      });

      item.addEventListener('dragend', () => {
        item.classList.remove('is-dragging');
        container.querySelectorAll('.drag-over').forEach((el) => el.classList.remove('drag-over'));
        draggedType = null;
        draggedIdx = null;
      });

      item.addEventListener('dragover', (e) => {
        const targetType = item.getAttribute('data-sort-type');
        if (targetType === draggedType) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          const targetIdx = parseInt(item.getAttribute('data-thumb-idx'), 10);
          if (targetIdx !== draggedIdx) {
            item.classList.add('drag-over');
          }
        }
      });

      item.addEventListener('dragleave', (e) => {
        if (!item.contains(e.relatedTarget)) {
          item.classList.remove('drag-over');
        }
      });

      item.addEventListener('drop', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        item.classList.remove('drag-over');

        const targetType = item.getAttribute('data-sort-type');
        const targetIdx = parseInt(item.getAttribute('data-thumb-idx'), 10);

        if (targetType !== draggedType || isNaN(draggedIdx) || isNaN(targetIdx) || draggedIdx === targetIdx) {
          return;
        }

        // 현재 작성 중이던 본문/텍스트 등 동기화
        this.syncCurrentInputs();

        let labelName = '사진';
        if (targetType === 'chaeum') {
          if (!Array.isArray(session.chaeumPhotos)) {
            session.chaeumPhotos = [...(session.photos || [])];
          }
          const [moved] = session.chaeumPhotos.splice(draggedIdx, 1);
          session.chaeumPhotos.splice(targetIdx, 0, moved);
          labelName = '채움(좌측) 사진';
        } else if (targetType === 'huin') {
          if (!Array.isArray(session.huinPhotos)) {
            session.huinPhotos = [...(session.photos || [])];
          }
          const [moved] = session.huinPhotos.splice(draggedIdx, 1);
          session.huinPhotos.splice(targetIdx, 0, moved);
          labelName = '마을극장(우측) 사진';
        } else if (targetType === 'works') {
          session.works = session.works || [];
          const [moved] = session.works.splice(draggedIdx, 1);
          session.works.splice(targetIdx, 0, moved);
          labelName = '우리의 기록';
        }

        this.showToast(`⏳ ${labelName} 순서 변경 저장 중...`);
        const res = await window.ArchiveStore.saveDataAsync(this.data, `${session.sessionNumber}페이지 ${labelName} 순서 변경`);
        this.refreshPreviewIframe();
        this.renderTimeWorkWorkspace();
        if (res && res.ok) {
          this.showToast(`✅ ${labelName} 순서가 성공적으로 변경되었습니다.`);
        } else {
          this.showToast('✅ 사진 순서가 변경되었습니다.');
        }
      });
    });
  }

  /* ========================================================================
     [워크스페이스 4] 환경음(Ambient) 라이브러리 & 셔플 재생 관리
     ======================================================================== */
  renderAmbientWorkspace() {
    const container = document.getElementById('admAmbientContainer');
    if (!container) return;

    const amb = this.data.ambientSettings || {};
    const library = amb.library || [];
    const isShuffle = amb.randomPlay !== false;
    const indexCh = (amb.channels && amb.channels.index) || {
      id: 'index',
      name: '우리들의 이야기 (INDEX) 전용 환경음',
      enabled: true,
      volume: 0.45,
      audioUrl: '',
      fileName: ''
    };
    const isIndexPlaying = this.audio.isAmbientPlaying && this.audio.activeAmbientChannelId === 'index';

    container.innerHTML = `
      <div class="panel-header">
        <div>
          <h2>4. 환경음(Ambient Sound) 라이브러리 관리</h2>
          <p style="font-size:13px; color:var(--adm-muted); margin-top:4px;">
            도서관 산책 시 흐르는 <strong>환경음들을 라이브러리에 등록하고, 랜덤 셔플로 순차 재생</strong>되도록 설정할 수 있습니다.
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="adm-btn primary" id="btnSaveAmbient">💾 환경음 설정 저장</button>
          <button class="adm-btn publish-cta" id="btnPublishAmbient">🚀 라이브 퍼블리시</button>
        </div>
      </div>

      <!-- 상단 컨트롤 박스: 셔플 재생 & 마스터 볼륨 -->
      <div class="adm-card" style="margin-bottom:20px;">
        <div class="adm-card-head">
          <strong>🎛️ 환경음 마스터 & 셔플 재생 옵션</strong>
        </div>
        <div class="form-grid-3">
          <div style="padding:14px; background:var(--adm-bg); border:1px solid var(--adm-border);">
            <label style="display:flex; align-items:center; gap:8px; font-weight:800; cursor:pointer;">
              <input type="checkbox" id="chkAmbientShuffle" ${isShuffle ? 'checked' : ''} />
              <span>랜덤 셔플 재생 (Shuffle Play)</span>
            </label>
            <p style="font-size:12px; color:var(--adm-muted); margin-top:6px;">
              라이브러리에 등록된 환경음들을 무작위 순서로 자동 전환하며 재생합니다.
            </p>
          </div>

          <div style="padding:14px; background:var(--adm-bg); border:1px solid var(--adm-border);">
            <label style="font-weight:800; display:block; margin-bottom:8px;">마스터 볼륨 (${Math.round((amb.masterVolume ?? 0.45) * 100)}%)</label>
            <input type="range" class="adm-input" id="ambMasterVolSlider" min="0" max="1" step="0.05" value="${amb.masterVolume ?? 0.45}" />
          </div>

          <div style="padding:14px; background:var(--adm-bg); border:1px solid var(--adm-border); display:flex; flex-direction:column; justify-content:center;">
            <button class="adm-btn ${this.audio.isAmbientPlaying ? 'danger' : 'primary'}" id="btnTestAmbientPlay">
              ${this.audio.isAmbientPlaying ? '■ 환경음 테스트 정지' : '▶ 환경음 랜덤 재생 테스트'}
            </button>
          </div>
        </div>
      </div>

      <!-- 우리들의 이야기 (INDEX) 페이지 전용 환경음 지정 -->
      <div class="adm-card" style="margin-bottom:20px; border:1.5px solid #0052FF;">
        <div class="adm-card-head">
          <div>
            <strong>📖 우리들의 이야기 (INDEX) 페이지 전용 환경음 지정</strong>
            <span style="font-size:12px; color:var(--adm-muted); margin-left:8px;">
              인덱스(우리들의 이야기) 페이지에 입장했을 때만 따로 재생되는 전용 환경음을 지정합니다.
            </span>
          </div>
          <label style="display:flex; align-items:center; gap:6px; font-weight:800; font-size:13px; cursor:pointer;">
            <input type="checkbox" id="chkIndexAmbientEnabled" ${indexCh.enabled !== false ? 'checked' : ''} />
            <span>전용 환경음 활성화</span>
          </label>
        </div>

        <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:14px; padding:12px 14px; background:var(--adm-bg); border:1px solid var(--adm-border);">
          <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
            <span style="font-size:12.5px; font-weight:700;">
              현재 파일: <code>${indexCh.fileName || (indexCh.audioUrl ? '인덱스 환경음 등록됨' : '지정된 파일 없음')}</code>
            </span>
            <label class="adm-btn sm primary" style="cursor:pointer;">
              🎵 인덱스 환경음 업로드
              <input type="file" accept="audio/*" id="inputUploadIndexAmbient" style="display:none;" />
            </label>
            ${indexCh.audioUrl ? `<button class="adm-btn sm danger" id="btnDelIndexAmbient">삭제</button>` : ''}
          </div>

          <div style="display:flex; align-items:center; gap:12px;">
            <label style="font-size:12px; font-weight:700; display:flex; align-items:center; gap:6px;">
              <span>볼륨 (${Math.round((indexCh.volume ?? 0.45) * 100)}%)</span>
              <input type="range" min="0" max="1" step="0.05" id="indexAmbVolSlider" value="${indexCh.volume ?? 0.45}" style="width:90px;" />
            </label>
            <button class="adm-btn sm ${isIndexPlaying ? 'danger' : 'primary'}" id="btnPlayIndexAmbient">
              ${isIndexPlaying ? '■ 정지' : '▶ 미리듣기'}
            </button>
          </div>
        </div>
      </div>

      <!-- 환경음 라이브러리 목록 카드 -->
      <div class="adm-card">
        <div class="adm-card-head">
          <div>
            <strong>📚 환경음 트랙 라이브러리 (${library.length}개 등록됨)</strong>
            <span style="font-size:12px; color:var(--adm-muted); margin-left:8px;">
              실제 녹음된 오디오 파일(wav, mp3 등)을 업로드하거나 공간 합성 프리셋을 지정할 수 있습니다.
            </span>
          </div>
          <div style="display:flex; gap:8px;">
            <label class="adm-btn primary sm" style="cursor:pointer; display:inline-flex;">
              + 새 오디오 파일 바로 업로드
              <input type="file" accept="audio/*" id="inputUploadNewAmbient" style="display:none;" />
            </label>
            <button class="adm-btn sm" id="btnAddSynthAmbient">+ 합성 환경음 추가</button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(340px, 1fr)); gap:14px;">
          ${library
            .map((track, idx) => {
              const isPlayingThis =
                this.audio.isAmbientPlaying && this.audio.activeAmbientChannelId === track.id;
              return `
              <div class="adm-card" style="margin-bottom:0; padding:14px; background:var(--adm-bg); border:1px solid var(--adm-border);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <span class="admin-badge" style="background:#0052FF; color:#fff;">TRACK #${idx + 1}</span>
                  <button class="adm-btn sm danger" data-del-amb-track="${idx}" style="padding:2px 6px; font-size:11px;">삭제</button>
                </div>

                <div class="form-group" style="margin-bottom:8px;">
                  <label style="font-size:11px;">트랙 명칭</label>
                  <input type="text" class="adm-input" value="${track.name || ''}" data-amb-field="name" data-amb-idx="${idx}" />
                </div>

                <div class="form-group" style="margin-bottom:8px;">
                  <label style="font-size:11px;">공간 합성음 프리셋 (오디오 파일 없을 때 자동 합성)</label>
                  <select class="adm-input" data-amb-field="presetType" data-amb-idx="${idx}" style="font-size:12px;">
                    <option value="library-paper" ${track.presetType === 'library-paper' ? 'selected' : ''}>서재·로비 책장 넘김과 발걸음 공기음</option>
                    <option value="chaeum-roomtone" ${track.presetType === 'chaeum-roomtone' ? 'selected' : ''}>채움 연습실 나무 마루 & 환승통로 공간음</option>
                    <option value="huingomusin-roomtone" ${track.presetType === 'huingomusin-roomtone' ? 'selected' : ''}>흰고무신 극장 암막 & 작은 옥상 바람소리</option>
                    <option value="breeze-footsteps" ${track.presetType === 'breeze-footsteps' ? 'selected' : ''}>산책로 바람 & 풀벌레 소리</option>
                  </select>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 10px; background:#ffffff; border:1px solid var(--adm-border); margin-bottom:8px;">
                  <span style="font-size:11px; color:var(--adm-muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:170px;">
                    <code>${track.audioUrl ? '커스텀 오디오 파일 등록됨' : track.fileName || '합성 프리셋 모드'}</code>
                  </span>
                  <label class="adm-btn sm" style="cursor:pointer; font-size:11px;">
                    오디오 변경
                    <input type="file" accept="audio/*" data-amb-file-replace="${idx}" style="display:none;" />
                  </label>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <label style="font-size:11px; display:flex; align-items:center; gap:6px;">
                    <span>볼륨</span>
                    <input type="range" min="0" max="1" step="0.05" value="${track.volume ?? 0.45}" data-amb-vol-idx="${idx}" style="width:75px;" />
                  </label>
                  <button class="adm-btn sm ${isPlayingThis ? 'danger' : 'primary'}" data-play-amb-track="${idx}">
                    ${isPlayingThis ? '■ 정지' : '▶ 개별 청취'}
                  </button>
                </div>
              </div>
            `;
            })
            .join('')}
        </div>
      </div>
    `;

    // 셔플 재생 체크박스
    const chkShuffle = document.getElementById('chkAmbientShuffle');
    if (chkShuffle) {
      chkShuffle.addEventListener('change', (e) => {
        this.data.ambientSettings.randomPlay = e.target.checked;
        this.saveDraft(`환경음 랜덤 셔플이 ${e.target.checked ? '활성화' : '비활성화'}되었습니다.`);
      });
    }

    // 마스터 볼륨 슬라이더
    const volSlider = document.getElementById('ambMasterVolSlider');
    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.data.ambientSettings.masterVolume = val;
        this.audio.updateAmbientVolume(val);
      });
    }

    // 테스트 재생 버튼
    const btnTest = document.getElementById('btnTestAmbientPlay');
    if (btnTest) {
      btnTest.addEventListener('click', () => {
        this.audio.toggleAmbient();
        this.renderAmbientWorkspace();
      });
    }

    // 인덱스(우리들의 이야기) 전용 환경음 제어
    const ensureIndexChannel = () => {
      this.data.ambientSettings = this.data.ambientSettings || {};
      this.data.ambientSettings.channels = this.data.ambientSettings.channels || {};
      this.data.ambientSettings.channels.index = this.data.ambientSettings.channels.index || {
        id: 'index',
        name: '우리들의 이야기 (INDEX) 전용 환경음',
        dashboard: 'index',
        enabled: true,
        volume: 0.45,
        audioUrl: '',
        fileName: ''
      };
      return this.data.ambientSettings.channels.index;
    };

    const chkIndexAmb = document.getElementById('chkIndexAmbientEnabled');
    if (chkIndexAmb) {
      chkIndexAmb.addEventListener('change', (e) => {
        const ch = ensureIndexChannel();
        ch.enabled = e.target.checked;
        this.saveDraft(`인덱스 전용 환경음이 ${e.target.checked ? '활성화' : '비활성화'}되었습니다.`);
      });
    }

    const inputIndexAmb = document.getElementById('inputUploadIndexAmbient');
    if (inputIndexAmb) {
      inputIndexAmb.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const dataUrl = await this.readFileAsDataURL(file);
        const ch = ensureIndexChannel();
        ch.audioUrl = dataUrl;
        ch.fileName = file.name;
        ch.enabled = true;
        this.saveDraft(`인덱스 전용 환경음 [${file.name}]이 등록되었습니다.`);
        this.renderAmbientWorkspace();
      });
    }

    const btnDelIndexAmb = document.getElementById('btnDelIndexAmbient');
    if (btnDelIndexAmb) {
      btnDelIndexAmb.addEventListener('click', () => {
        const ch = ensureIndexChannel();
        ch.audioUrl = '';
        ch.fileName = '';
        if (this.audio.isAmbientPlaying && this.audio.activeAmbientChannelId === 'index') {
          this.audio.stopAmbientChannel();
        }
        this.saveDraft('인덱스 전용 환경음이 삭제되었습니다.');
        this.renderAmbientWorkspace();
      });
    }

    const indexVolSlider = document.getElementById('indexAmbVolSlider');
    if (indexVolSlider) {
      indexVolSlider.addEventListener('input', (e) => {
        const ch = ensureIndexChannel();
        ch.volume = parseFloat(e.target.value);
        if (this.audio.isAmbientPlaying && this.audio.activeAmbientChannelId === 'index') {
          this.audio.updateAmbientVolume(ch.volume * (this.data.ambientSettings.masterVolume ?? 0.45));
        }
      });
      indexVolSlider.addEventListener('change', () => {
        this.saveDraft('인덱스 전용 환경음 볼륨이 저장되었습니다.');
        this.renderAmbientWorkspace();
      });
    }

    const btnPlayIndexAmb = document.getElementById('btnPlayIndexAmbient');
    if (btnPlayIndexAmb) {
      btnPlayIndexAmb.addEventListener('click', () => {
        const ch = ensureIndexChannel();
        if (this.audio.isAmbientPlaying && this.audio.activeAmbientChannelId === 'index') {
          this.audio.stopAmbientChannel();
        } else if (ch.audioUrl) {
          this.audio.startAmbientChannel(ch, this.data.ambientSettings?.masterVolume ?? 0.45);
        } else {
          alert('먼저 인덱스 전용 환경음 오디오 파일을 업로드해 주세요.');
          return;
        }
        this.renderAmbientWorkspace();
      });
    }

    // 새 오디오 파일 바로 업로드하여 라이브러리에 추가
    const newAudioInput = document.getElementById('inputUploadNewAmbient');
    if (newAudioInput) {
      newAudioInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const dataUrl = await this.readFileAsDataURL(file);
        const rawName = file.name.replace(/\.[^/.]+$/, '');
        this.data.ambientSettings.library = this.data.ambientSettings.library || [];
        this.data.ambientSettings.library.push({
          id: `amb-${Date.now()}`,
          name: rawName,
          audioUrl: dataUrl,
          fileName: file.name,
          presetType: 'library-paper',
          volume: 0.45,
          description: '새로 업로드된 환경음 트랙'
        });
        this.saveDraft(`새 환경음 [${rawName}]이 라이브러리에 등록되었습니다.`);
        this.renderAmbientWorkspace();
      });
    }

    // 합성 환경음 추가
    const btnAddSynth = document.getElementById('btnAddSynthAmbient');
    if (btnAddSynth) {
      btnAddSynth.addEventListener('click', () => {
        this.data.ambientSettings.library = this.data.ambientSettings.library || [];
        const n = this.data.ambientSettings.library.length + 1;
        this.data.ambientSettings.library.push({
          id: `amb-${Date.now()}`,
          name: `공간 환경음 트랙 ${n}`,
          audioUrl: '',
          fileName: `ambient_synth_${n}.wav`,
          presetType: 'chaeum-roomtone',
          volume: 0.45,
          description: '합성 공간음'
        });
        this.saveDraft('합성 환경음 트랙이 추가되었습니다.');
        this.renderAmbientWorkspace();
      });
    }

    // 트랙 필드 수정
    container.querySelectorAll('[data-amb-field]').forEach((input) => {
      input.addEventListener('change', (e) => {
        const idx = parseInt(input.getAttribute('data-amb-idx'), 10);
        const field = input.getAttribute('data-amb-field');
        if (library[idx]) {
          library[idx][field] = input.value.trim();
          this.saveDraft('환경음 정보가 수정되었습니다.');
        }
      });
    });

    // 트랙 볼륨 수정
    container.querySelectorAll('[data-amb-vol-idx]').forEach((input) => {
      input.addEventListener('change', (e) => {
        const idx = parseInt(input.getAttribute('data-amb-vol-idx'), 10);
        if (library[idx]) {
          library[idx].volume = parseFloat(input.value);
          this.saveDraft('트랙 볼륨이 수정되었습니다.');
        }
      });
    });

    // 트랙 오디오 교체
    container.querySelectorAll('[data-amb-file-replace]').forEach((input) => {
      input.addEventListener('change', async (e) => {
        const idx = parseInt(input.getAttribute('data-amb-file-replace'), 10);
        const file = e.target.files[0];
        if (!file || !library[idx]) return;
        const dataUrl = await this.readFileAsDataURL(file);
        library[idx].audioUrl = dataUrl;
        library[idx].fileName = file.name;
        this.saveDraft(`트랙 [${library[idx].name}]의 오디오가 교체되었습니다.`);
        this.renderAmbientWorkspace();
      });
    });

    // 개별 청취
    container.querySelectorAll('[data-play-amb-track]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-play-amb-track'), 10);
        const track = library[idx];
        if (!track) return;

        if (this.audio.isAmbientPlaying && this.audio.activeAmbientChannelId === track.id) {
          this.audio.stopAmbientChannel();
        } else {
          this.audio.startAmbientTrack(track, amb.masterVolume ?? 0.45);
        }
        this.renderAmbientWorkspace();
      });
    });

    // 트랙 삭제
    container.querySelectorAll('[data-del-amb-track]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-del-amb-track'), 10);
        if (confirm('이 환경음 트랙을 삭제하시겠습니까?')) {
          library.splice(idx, 1);
          this.saveDraft('환경음 트랙이 삭제되었습니다.');
          this.renderAmbientWorkspace();
        }
      });
    });

    const btnSave = document.getElementById('btnSaveAmbient');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        this.publishNow('환경음 설정이 저장 및 라이브에 즉시 반영되었습니다.');
      });
    }

    const btnPub = document.getElementById('btnPublishAmbient');
    if (btnPub) {
      btnPub.addEventListener('click', () => {
        this.publishNow('환경음 설정 라이브 퍼블리시');
      });
    }
  }

  /* ========================================================================
     [워크스페이스 5] 프리뷰 & 퍼블리시
     ======================================================================== */
  renderPreviewPublishWorkspace() {
    const container = document.getElementById('admPreviewPublishContainer');
    if (!container) return;

    const hist = this.data.publishHistory || [];

    container.innerHTML = `
      <div class="panel-header">
        <div>
          <h2>5. 실시간 프리뷰 &amp; 퍼블리시 (Preview &amp; Publish)</h2>
          <p style="font-size:13px; color:var(--adm-muted); margin-top:4px;">
            실제 반응형 뷰포트에서 웹사이트를 실시간으로 테스트하고, 검증이 완료되면 <strong>라이브 사이트(index.html)에 즉시 퍼블리시</strong>합니다.
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="adm-btn publish-cta" id="btnPublishFinal">🚀 라이브 사이트에 퍼블리시 (Live Publish)</button>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding:10px 14px; background:var(--adm-bg); border:1px solid var(--adm-border);">
        <div style="display:flex; gap:8px; align-items:center;">
          <span style="font-weight:800; font-size:12px;">뷰포트 크기:</span>
          <button class="adm-btn sm ${this.previewViewport === '100%' ? 'primary' : ''}" data-vp="100%">데스크톱 (100%)</button>
          <button class="adm-btn sm ${this.previewViewport === '1024px' ? 'primary' : ''}" data-vp="1024px">태블릿 (1024px)</button>
          <button class="adm-btn sm ${this.previewViewport === '375px' ? 'primary' : ''}" data-vp="375px">모바일 (375px)</button>
        </div>
        <button class="adm-btn sm" id="btnReloadPreview">🔄 프리뷰 새로고침</button>
      </div>

      <div style="display:flex; justify-content:center; background:#1e1e24; padding:16px; border:1px solid var(--adm-border); margin-bottom:20px; overflow-x:auto;">
        <iframe id="previewIframe" src="index.html" style="width:${this.previewViewport}; height:720px; border:2px solid #ffffff; background:#ffffff; transition:width 0.3s ease;"></iframe>
      </div>

      <!-- 퍼블리시 히스토리 내역 -->
      <div class="adm-card">
        <div class="adm-card-head">
          <strong>📜 최근 퍼블리시 이력 (최근 10건)</strong>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${hist
            .slice(0, 10)
            .map(
              (h) => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:var(--adm-bg); border:1px solid var(--adm-border); font-size:12.5px;">
              <div>
                <strong>${h.version || '배포'}</strong>
                <span style="margin-left:8px; color:var(--adm-text);">${h.note || ''}</span>
              </div>
              <span style="font-family:var(--font-mono); font-size:11px; color:var(--adm-muted);">${h.publishedAt || ''}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('[data-vp]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.previewViewport = btn.getAttribute('data-vp');
        this.renderPreviewPublishWorkspace();
      });
    });

    const btnReload = document.getElementById('btnReloadPreview');
    if (btnReload) {
      btnReload.addEventListener('click', () => this.refreshPreviewIframe());
    }

    const btnPub = document.getElementById('btnFinalPublish') || document.getElementById('btnPublishFinal');
    if (btnPub) {
      btnPub.addEventListener('click', () => {
        this.publishNow('관리자 검증 후 최종 라이브 퍼블리시');
      });
    }
  }

  refreshPreviewIframe() {
    const iframe = document.getElementById('previewIframe');
    if (iframe) {
      try {
        iframe.contentWindow.location.reload();
      } catch (e) {
        iframe.src = iframe.src;
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.ArchiveStudioAdminInstance = new ArchiveStudioAdmin();
  if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
    setTimeout(() => {
      if (window.ArchiveStudioAdminInstance) {
        window.ArchiveStudioAdminInstance.syncToDisk(false);
      }
    }, 1500);
  }
});
