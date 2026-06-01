// 내 정보 화면 — Safe Q-Web
// 프로필 + 계정 설정(회원정보 수정) + 그룹 관리 + 로그아웃
// 3개의 서브 탭: 프로필 / 계정 / 그룹

const ProfileScreen = ({ user, onLogout, onBack }) => {
  const { profile, myGroups } = window.MOCK;
  const [tab, setTab] = React.useState('profile');   // 'profile' | 'account' | 'groups'
  const [otp, setOtp] = React.useState(profile.otpEnabled);
  const [notifyDanger, setNotifyDanger] = React.useState(profile.notifyDanger);
  const [notifyGroup, setNotifyGroup] = React.useState(profile.notifyGroup);
  const [openGroup, setOpenGroup] = React.useState(null);  // groupId or null

  const initial = (profile.displayName || 'U').charAt(0);

  return (
    <div className="profile-screen">
      {/* 헤더 */}
      <div className="page-header">
        <div>
          <div className="t-meta" style={{ color: 'var(--c205-mint-deep)', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', marginBottom: 2 }}>SAFE Q-WEB</div>
          <h1>내 정보</h1>
        </div>
        <div className="actions">
          <button className="icon-btn" aria-label="로그아웃" onClick={onLogout}><Icon name="log-out" size={18} /></button>
        </div>
      </div>

      {/* 프로필 요약 카드 */}
      <div className="profile-card">
        <div className="avatar">{initial}</div>
        <div className="profile-id">
          <div className="name">{profile.displayName}</div>
          <div className="handle">@{profile.username} · {profile.email}</div>
          <span className="plan-chip">{profile.plan} 플랜</span>
        </div>
        <button className="edit-btn" onClick={() => setTab('account')}>
          <Icon name="gear" size={16} /> 편집
        </button>
      </div>

      {/* 통계 미니 */}
      <div className="profile-stats">
        <div className="ps"><span className="n">{profile.stats.scanned}</span><span className="l">스캔</span></div>
        <div className="ps danger"><span className="n">{profile.stats.blocked}</span><span className="l">차단</span></div>
        <div className="ps safe"><span className="n">{profile.stats.shared}</span><span className="l">공유</span></div>
        <div className="ps"><span className="n">{myGroups.length}</span><span className="l">그룹</span></div>
      </div>

      {/* 서브 탭 */}
      <div className="seg-tabs">
        <button className={tab === 'profile' ? 'seg active' : 'seg'} onClick={() => setTab('profile')}>프로필</button>
        <button className={tab === 'account' ? 'seg active' : 'seg'} onClick={() => setTab('account')}>계정 설정</button>
        <button className={tab === 'groups' ? 'seg active' : 'seg'} onClick={() => setTab('groups')}>그룹 관리</button>
      </div>

      {/* ── 탭: 프로필 ── */}
      {tab === 'profile' && (
        <div className="prof-section">
          <InfoRow icon="user"   label="이름"     value={profile.displayName} />
          <InfoRow icon="user"   label="아이디"   value={profile.username} />
          <InfoRow icon="mail"   label="이메일"   value={profile.email} />
          <InfoRow icon="bell"   label="휴대폰"   value={profile.phone} />
          <InfoRow icon="history" label="가입일"  value={profile.registeredAt} />
          <button className="row-link" onClick={() => setTab('account')}>
            <Icon name="gear" size={16} color="var(--c205-mint-deep)" />
            <span>회원 정보 수정하기</span>
            <Icon name="chevron-r" size={16} color="var(--fg-4)" />
          </button>
        </div>
      )}

      {/* ── 탭: 계정 설정 (회원정보 수정) ── */}
      {tab === 'account' && (
        <div className="prof-section">
          <div className="field-label">기본 정보</div>
          <EditField icon="user" label="이름" value={profile.displayName} />
          <EditField icon="mail" label="이메일" value={profile.email} />
          <EditField icon="bell" label="휴대폰" value={profile.phone} />

          <button className="row-link" onClick={() => toast('비밀번호 변경은 데모 범위 밖이에요')}>
            <Icon name="lock" size={16} color="var(--c205-mint-deep)" />
            <span>비밀번호 변경</span>
            <Icon name="chevron-r" size={16} color="var(--fg-4)" />
          </button>

          <div className="field-label" style={{ marginTop: 18 }}>보안 · 알림</div>
          <ToggleRow icon="lock"  label="OTP 2단계 인증" desc="로그인 시 추가 인증 코드를 요구해요"
                     on={otp} onToggle={() => { setOtp(v => !v); toast(otp ? 'OTP 인증을 껐어요' : 'OTP 인증을 켰어요'); }} />
          <ToggleRow icon="shield-alert" label="위험 URL 알림" desc="Danger 등급 스캔 시 즉시 알림"
                     on={notifyDanger} onToggle={() => setNotifyDanger(v => !v)} />
          <ToggleRow icon="users" label="그룹 공유 알림" desc="그룹에 위험 URL이 공유되면 알림"
                     on={notifyGroup} onToggle={() => setNotifyGroup(v => !v)} />

          <button className="save-btn" onClick={() => { toast('변경 사항을 저장했어요'); setTab('profile'); }}>
            <Icon name="check" size={18} color="#fff" strokeWidth={2.4} /> 변경 사항 저장
          </button>
          <button className="danger-link" onClick={() => toast('회원 탈퇴는 데모 범위 밖이에요')}>
            회원 탈퇴
          </button>
        </div>
      )}

      {/* ── 탭: 그룹 관리 ── */}
      {tab === 'groups' && (
        <div className="prof-section">
          <div className="section-head" style={{ marginTop: 4 }}>
            <h3>내 그룹 {myGroups.length}</h3>
            <button className="more" onClick={() => toast('새 그룹 만들기는 데모 범위 밖이에요')}>
              <Icon name="plus" size={13} /> 새 그룹
            </button>
          </div>

          {myGroups.map(g => (
            <div key={g.groupId} className="group-card">
              <button className="group-head" onClick={() => setOpenGroup(openGroup === g.groupId ? null : g.groupId)}>
                <div className={`group-icon ${g.role === '관리자' ? 'admin' : ''}`}>
                  <Icon name={g.icon} size={20} strokeWidth={2.1} />
                </div>
                <div className="group-meta">
                  <div className="g-name">
                    {g.name}
                    {g.role === '관리자' && <span className="admin-chip">관리자</span>}
                  </div>
                  <div className="g-sub">멤버 {g.members.length}명{g.pending.length ? ` · 초대 대기 ${g.pending.length}` : ''}</div>
                </div>
                <Icon name="chevron-r" size={16} color="var(--fg-4)"
                      style={{ transform: openGroup === g.groupId ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }} />
              </button>

              {openGroup === g.groupId && (
                <div className="group-body">
                  {g.members.map((m, i) => (
                    <div key={i} className="member-row">
                      <div className="m-avatar">{m.name.charAt(0)}</div>
                      <div className="m-name">{m.name}{m.me && <span className="me-chip">나</span>}</div>
                      <span className={`m-role ${m.role === '관리자' ? 'admin' : ''}`}>{m.role}</span>
                    </div>
                  ))}

                  {g.pending.map((p, i) => (
                    <div key={`p${i}`} className="member-row pending">
                      <div className="m-avatar pending"><Icon name="mail" size={14} /></div>
                      <div className="m-name">{p.email}<span className="pending-tag">초대 대기 · {p.sentAt}</span></div>
                    </div>
                  ))}

                  {g.role === '관리자' ? (
                    <div className="group-actions">
                      <button className="ga-btn" onClick={() => toast('초대 링크를 복사했어요')}>
                        <Icon name="plus" size={15} /> 멤버 초대
                      </button>
                      <button className="ga-btn ghost" onClick={() => toast('그룹 설정은 데모 범위 밖이에요')}>
                        <Icon name="gear" size={15} /> 그룹 설정
                      </button>
                    </div>
                  ) : (
                    <div className="group-actions">
                      <button className="ga-btn ghost danger" onClick={() => toast('그룹에서 나갔어요 (데모)')}>
                        <Icon name="log-out" size={15} /> 그룹 나가기
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button className="logout-row" onClick={onLogout}>
        <Icon name="log-out" size={16} /> 로그아웃
      </button>
    </div>
  );
};

// ── 하위 컴포넌트 ──
const InfoRow = ({ icon, label, value }) => (
  <div className="info-row">
    <div className="ir-icon"><Icon name={icon} size={16} color="var(--fg-3)" /></div>
    <div className="ir-label">{label}</div>
    <div className="ir-value">{value}</div>
  </div>
);

const EditField = ({ icon, label, value }) => (
  <div className="edit-field">
    <label>{label}</label>
    <div className="ef-input">
      <Icon name={icon} size={15} color="var(--fg-4)" />
      <input defaultValue={value} />
    </div>
  </div>
);

const ToggleRow = ({ icon, label, desc, on, onToggle }) => (
  <button className="toggle-row" onClick={onToggle}>
    <div className="tr-icon"><Icon name={icon} size={16} color="var(--fg-3)" /></div>
    <div className="tr-text">
      <div className="tr-label">{label}</div>
      <div className="tr-desc">{desc}</div>
    </div>
    <div className={`switch ${on ? 'on' : ''}`}><span className="knob" /></div>
  </button>
);

window.ProfileScreen = ProfileScreen;
