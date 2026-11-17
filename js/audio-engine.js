/**
 * 도봉꿈의극단 <사람 책 도서관: 이야기와 함께 걷기>
 * 연극적 공간 오디오 · 독백 음성 재생 & 전 대시보드 환경음(Ambient Sound) 엔진
 */

function formatAudioSrc(src) {
  if (!src || src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  try {
    return encodeURI(src.normalize('NFC'));
  } catch (e) {
    return encodeURI(src);
  }
}

class MonologueAudioEngine {
  constructor() {
    this.ctx = null;
    this.htmlAudio = new Audio();
    this.ambientAudio = new Audio();
    this.ambientAudio.loop = true;

    this.isPlaying = false;
    this.isPaused = false;
    this.currentElement = null;
    this.elapsed = 0;
    this.duration = 40;
    this.timerInterval = null;
    this.ambientNodes = [];
    this.monologueVolume = 0.4; // 기본 독백 음량 최대의 40% 기본 설정

    // 환경음(Ambient) 상태
    this.activeAmbientChannelId = null;
    this.isAmbientPlaying = false;
    this.userAmbientVolume = null;
    this.ambientSynthNodes = [];
    this.ambientPulseTimer = null;

    this.onStateChange = null;
    this.onAmbientChange = null;
    this.onTick = null;
    this.useTTS = true;

    this.htmlAudio.addEventListener('timeupdate', () => {
      if (this.currentElement && this.currentElement.audioUrl) {
        this.elapsed = this.htmlAudio.currentTime;
        this.duration = this.htmlAudio.duration || this.currentElement.audioDuration || 40;
        const ratio = this.duration > 0 ? Math.min(1, this.elapsed / this.duration) : 0;
        const sample = this.getWaveformSample();
        if (this.onTick) this.onTick(this.elapsed, this.duration, sample);
        if (this.onProgress) {
          this.onProgress({ currentTime: this.elapsed, duration: this.duration, ratio, sample });
        }
      }
    });

    this.htmlAudio.addEventListener('ended', () => {
      this.stop();
    });
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /* ========================================================================
     전 대시보드 환경음(Ambient Sound) 관리 시스템
     ======================================================================== */
  toggleAmbient(requestedChannel = null) {
    if (this.isAmbientPlaying) {
      this.stopAmbientChannel();
      return;
    }

    const archiveData = window.ArchiveStore ? window.ArchiveStore.getData() : window.DEFAULT_ARCHIVE_DATA;
    const settings = archiveData?.ambientSettings || {};
    const masterVol = settings.masterVolume ?? 0.45;
    const isRandom = settings.randomPlay !== false;
    const library = (settings.library && settings.library.length) ? settings.library : [];

    // 인덱스(우리들의 이야기) 페이지 전용 환경음이 지정된 경우 우선 재생
    if (requestedChannel === 'index' && settings.channels?.index?.audioUrl && settings.channels.index.enabled !== false) {
      this.startAmbientChannel(settings.channels.index, masterVol);
      return;
    }

    if (isRandom && library.length > 0) {
      const randTrack = library[Math.floor(Math.random() * library.length)];
      this.startAmbientTrack(randTrack, masterVol);
    } else {
      const chKey = requestedChannel || settings.activePreviewChannel || 'chaeum';
      const ch = settings.channels?.[chKey] || settings.channels?.global;
      this.startAmbientChannel(ch, masterVol);
    }
  }

  startAmbientTrack(track, masterVolume = 0.45) {
    if (!track) return;
    this.stopAmbientChannel(true);
    this.activeAmbientChannelId = track.id;
    this.isAmbientPlaying = true;
    const baseMaster = this.userAmbientVolume !== null ? this.userAmbientVolume : (masterVolume ?? 0.5);
    const effectiveVol = Math.max(0, Math.min(1, (track.volume ?? 0.45) * baseMaster));

    if (track.audioUrl && track.audioUrl.trim() !== '') {
      const archiveData = window.ArchiveStore ? window.ArchiveStore.getData() : window.DEFAULT_ARCHIVE_DATA;
      const libList = archiveData?.ambientSettings?.library || [];
      const shouldAdvanceRandom = archiveData?.ambientSettings?.randomPlay !== false && libList.length > 1;
      // 랜덤 연속 재생 시에는 loop를 끄고 onended에서 다음 트랙으로 넘김
      this.ambientAudio.loop = !shouldAdvanceRandom;

      let src = track.audioUrl;
      if (src.startsWith('idb://') && window.LargeMediaDB) {
        src = window.LargeMediaDB.resolveUrlSync(src) || src;
      }
      if (src.startsWith('idb://') && window.LargeMediaDB) {
        window.LargeMediaDB.resolveUrl(src).then((resolved) => {
          if (resolved && this.ambientAudio && this.isAmbientPlaying) {
            this.ambientAudio.src = resolved;
            this.ambientAudio.volume = effectiveVol;
            this.ambientAudio.play().catch(() => { });
          }
        });
      } else {
        this.ambientAudio.src = formatAudioSrc(src);
        this.ambientAudio.volume = effectiveVol;
        this.ambientAudio.play().catch(() => { });
      }
      this.ambientAudio.onended = () => {
        const freshData = window.ArchiveStore ? window.ArchiveStore.getData() : window.DEFAULT_ARCHIVE_DATA;
        const freshLib = freshData?.ambientSettings?.library || [];
        if (freshData?.ambientSettings?.randomPlay !== false && freshLib.length > 1) {
          const candidates = freshLib.filter((t) => t.id !== track.id);
          const nextTrack = candidates[Math.floor(Math.random() * candidates.length)];
          this.startAmbientTrack(nextTrack, masterVolume);
        }
      };
    }

    if (this.onAmbientChange) {
      this.onAmbientChange({
        isPlaying: this.isAmbientPlaying,
        channelId: this.activeAmbientChannelId,
        channelName: track.name
      });
    }
  }

  startAmbientChannel(channelConfig, masterVolume = 0.45) {
    if (!channelConfig || !channelConfig.enabled) {
      this.stopAmbientChannel();
      return;
    }

    this.stopAmbientChannel(true);
    this.activeAmbientChannelId = channelConfig.id;
    this.isAmbientPlaying = true;
    const baseMaster = this.userAmbientVolume !== null ? this.userAmbientVolume : (masterVolume ?? 0.5);
    const effectiveVol = Math.max(0, Math.min(1, (channelConfig.volume ?? 0.45) * baseMaster));

    // 실제 업로드된 환경음 오디오 파일이 있는 경우에만 재생 (더미 합성음은 사용자 요청으로 제거됨)
    if (channelConfig.audioUrl && channelConfig.audioUrl.trim() !== '') {
      let src = channelConfig.audioUrl;
      if (src.startsWith('idb://') && window.LargeMediaDB) {
        src = window.LargeMediaDB.resolveUrlSync(src) || src;
      }
      if (src.startsWith('idb://') && window.LargeMediaDB) {
        window.LargeMediaDB.resolveUrl(src).then((resolved) => {
          if (resolved && this.ambientAudio && this.isAmbientPlaying) {
            this.ambientAudio.src = resolved;
            this.ambientAudio.volume = effectiveVol;
            this.ambientAudio.play().catch(() => { });
          }
        });
      } else {
        this.ambientAudio.src = formatAudioSrc(src);
        this.ambientAudio.volume = effectiveVol;
        this.ambientAudio.play().catch(() => { });
      }
    }

    if (this.onAmbientChange) {
      this.onAmbientChange({
        isPlaying: this.isAmbientPlaying,
        channelId: this.activeAmbientChannelId,
        channelName: channelConfig.name
      });
    }
  }

  startProceduralAmbient(presetType, volume = 0.25) {
    // 사용자 요청으로 신디사이저 기반 배경 더미 사운드 완전 제거
    return;
  }

  updateAmbientVolume(volumeRatio) {
    const v = Math.max(0, Math.min(1, volumeRatio));
    this.userAmbientVolume = v;
    this.ambientAudio.volume = v;
    if (this.ambientSynthNodes.length >= 4 && this.ctx) {
      const gainNode = this.ambientSynthNodes[3];
      try {
        gainNode.gain.setValueAtTime(Math.max(0.001, v * 0.12), this.ctx.currentTime);
      } catch (e) { }
    }
  }

  stopAmbientChannel(silent = false) {
    this.isAmbientPlaying = false;
    this.activeAmbientChannelId = null;
    clearInterval(this.ambientPulseTimer);
    this.ambientPulseTimer = null;

    try {
      this.ambientAudio.pause();
      this.ambientAudio.currentTime = 0;
    } catch (e) { }

    if (this.ambientSynthNodes && this.ambientSynthNodes.length) {
      this.ambientSynthNodes.forEach(n => {
        try {
          if (n.stop) n.stop();
          if (n.disconnect) n.disconnect();
        } catch (e) { }
      });
    }
    this.ambientSynthNodes = [];

    if (!silent && this.onAmbientChange) {
      this.onAmbientChange({
        isPlaying: false,
        channelId: null,
        channelName: ''
      });
    }
  }

  /* ========================================================================
     공간 요소 스포트라이트 & 독백 음성 재생
     ======================================================================== */
  playSpotlightCue(spaceId = 'chaeum') {
    try {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(spaceId === 'chaeum' ? 190 : 140, now);
      clickOsc.frequency.exponentialRampToValueAtTime(55, now + 0.065);
      clickGain.gain.setValueAtTime(0.18, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.075);

      const shimmerOsc = this.ctx.createOscillator();
      const shimmerGain = this.ctx.createGain();
      shimmerOsc.type = 'sine';
      shimmerOsc.frequency.setValueAtTime(spaceId === 'chaeum' ? 220 : 164.8, now + 0.03);
      shimmerGain.gain.setValueAtTime(0.001, now);
      shimmerGain.gain.linearRampToValueAtTime(0.04, now + 0.25);
      shimmerGain.gain.exponentialRampToValueAtTime(0.0008, now + 1.4);
      shimmerOsc.connect(shimmerGain);
      shimmerGain.connect(this.ctx.destination);
      shimmerOsc.start(now + 0.03);
      shimmerOsc.stop(now + 1.45);
    } catch (e) { }
  }

  playFootstep() {
    try {
      this.ensureContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.08);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.095);
    } catch (e) { }
  }

  async play(element) {
    if (!element) return;

    if (this.currentElement && this.currentElement.id !== element.id) {
      this.stop(true);
    }

    if (this.isPaused && this.currentElement && this.currentElement.id === element.id) {
      this.resume();
      return;
    }

    this.currentElement = element;
    this.duration = Number(element.audioDuration) || 40;
    this.elapsed = 0;

    let src = element.audioUrl || '';
    if (src.startsWith('idb://') && window.LargeMediaDB) {
      src = window.LargeMediaDB.resolveUrlSync(src) || (await window.LargeMediaDB.resolveUrl(src));
    }

    // 실제 업로드된 독백 음성이 있는 경우에만 재생 (더미 합성음/로봇TTS는 사용자 요청으로 제거됨)
    if (src && src.trim() !== '') {
      this.isPlaying = true;
      this.isPaused = false;
      this.htmlAudio.src = formatAudioSrc(src);
      this.htmlAudio.volume = this.monologueVolume;
      this.htmlAudio.currentTime = 0;
      try {
        await this.htmlAudio.play();
      } catch (err) {
        console.warn('Audio playback prevented or failed:', err);
        this.isPlaying = false;
      }
    } else {
      this.isPlaying = false;
      this.isPaused = false;
      this.stopAmbientSynth();
    }

    this.emitState();
  }

  setVolume(vol) {
    const v = Math.max(0, Math.min(1, Number(vol)));
    this.monologueVolume = v;
    if (this.htmlAudio) {
      this.htmlAudio.volume = v;
    }
    this.emitState();
  }

  startDummyTheatricalPlayback(element) {
    // 사용자 요청으로 신디사이저 및 로봇 TTS 기반 더미 음성 완전 제거
    this.stopAmbientSynth();
    this.isPlaying = false;
    this.emitState();
  }

  playSyllablePulse(element) {
    // 더미 비프음 제거
    return;
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPaused = true;
    this.isPlaying = false;

    if (this.currentElement && this.currentElement.audioUrl) {
      this.htmlAudio.pause();
    } else {
      if ('speechSynthesis' in window) {
        try { window.speechSynthesis.pause(); } catch (e) { }
      }
      this.stopAmbientSynth();
    }
    this.emitState();
  }

  resume() {
    if (!this.currentElement) return;
    this.isPaused = false;
    this.isPlaying = true;

    if (this.currentElement.audioUrl) {
      this.htmlAudio.play().catch(() => { });
    } else {
      if ('speechSynthesis' in window) {
        try { window.speechSynthesis.resume(); } catch (e) { }
      }
      this.startDummyTheatricalPlayback(this.currentElement);
    }
    this.emitState();
  }

  stop(silent = false) {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.elapsed = 0;

    try {
      this.htmlAudio.pause();
      this.htmlAudio.currentTime = 0;
    } catch (e) { }

    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) { }
    }

    this.stopAmbientSynth();

    if (!silent) {
      if (this.onTick) this.onTick(0, this.duration, 0);
      this.emitState();
    }
  }

  seek(ratio) {
    if (!this.currentElement) return;
    const clamped = Math.max(0, Math.min(1, ratio));
    this.elapsed = clamped * this.duration;
    if (this.currentElement.audioUrl && this.htmlAudio.duration) {
      this.htmlAudio.currentTime = clamped * this.htmlAudio.duration;
    }
    if (this.onTick) {
      this.onTick(this.elapsed, this.duration, this.getWaveformSample());
    }
  }

  stopAmbientSynth() {
    if (this.ambientNodes && this.ambientNodes.length) {
      this.ambientNodes.forEach(node => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch (e) { }
      });
    }
    this.ambientNodes = [];
  }

  getWaveformSample() {
    if (!this.isPlaying || this.isPaused) return 0.08;
    return 0.25 + Math.abs(Math.sin(this.elapsed * 3.7)) * 0.55 + Math.random() * 0.2;
  }

  emitState() {
    if (this.onStateChange) {
      this.onStateChange({
        isPlaying: this.isPlaying,
        isPaused: this.isPaused,
        currentElement: this.currentElement,
        elapsed: this.elapsed,
        duration: this.duration
      });
    }
  }

  static formatTime(sec) {
    const s = Math.max(0, Math.floor(sec || 0));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  }
}

window.MonologueAudioEngine = MonologueAudioEngine;
