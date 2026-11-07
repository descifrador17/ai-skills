"""Live stills page for the pair in $EPS (decision 41): each shot's checked candidate, its status and an Approve button.
A click on Approve copies the candidate (and its end frame) into epNN/stills/NNA_<name>.png, which the clip runner picks
up at once. Needs `source "$SKILL_DIR/scripts/env.sh" && cd "$SERIES_DIR"` first (SERIES_DIR, COMPANION_DIR, RUN_DIR, EPS).
  python3 scripts/live.py set ep13/02 --cand ep13/stills/work/02A_flight_v2_t1.png --status review|redo|waiting|approved --note '...' [--end <path>]
  python3 scripts/live.py sync      # apply new clicks; prints APPROVED/UNDONE lines; run it every 10 s in a loop
  python3 scripts/live.py approve ep13/02   # the user approved in chat: same copy as a click (never set --status approved by hand)
Candidate names must start NNA_<lowercase-letters> (02A_flight_v2_t1.png -> stills/02A_flight.png).
Optional: write extra HTML to $COMPANION_DIR/content/_extra.part to show another checkpoint above the stills
(the server shows the newest .html file, so one page must carry everything that is waiting for the user).
"""
import html, json, os, re, shutil, subprocess, sys, time
SER = os.environ['SERIES_DIR']
BR = os.environ['COMPANION_DIR']
EPS = os.environ['EPS'].split()
CONTENT, EVENTS = BR + '/content', BR + '/state/events'
STATE = os.environ['RUN_DIR'] + '/live_state_' + '_'.join(EPS) + '.json'
PAGE = CONTENT + '/stills-live-' + '-'.join(EPS) + '.html'
EXTRA = CONTENT + '/_extra.part'  # optional block shown above the stills (e.g. another checkpoint)
_tf = os.environ['RUN_DIR'] + '/TRANSFORM'  # morph shots (need an approved _end still); the file wins over env.sh
TRANSFORM = set((open(_tf).read() if os.path.exists(_tf) else os.environ.get('TRANSFORM', '')).split())

def load():
    return json.load(open(STATE)) if os.path.exists(STATE) else {}

def save(st):
    tmp = STATE + '.tmp'; json.dump(st, open(tmp, 'w'), indent=1); os.replace(tmp, STATE)

def rows(ep):
    t = open(f'{SER}/{ep}/script.md').read()
    sec = t.split('## Shots')[1].split('\n## ')[0]
    txt = t.split('## On-screen text')[1].split('\n## ')[0]
    lines = {int(m.group(1)): m.group(2) for m in re.finditer(r'^\| (\d+)[^|]*\| (.*?) \|', txt, re.M)}
    out = {}
    for l in sec.splitlines():
        c = [x.strip() for x in l.strip('|').split('|')]
        if len(c) > 3 and c[0].isdigit():
            out[int(c[0])] = (re.sub(r'\*\*(.+?)\*\*', r'\1', c[2]), lines.get(int(c[0]), ''))
    return out

def final_path(ep, cand, end=False):
    m = re.match(r'(\d\dA_[a-z]+)', os.path.basename(cand))
    return f'{SER}/{ep}/stills/{m.group(1)}{"_end" if end else ""}.png'

def clip_state(key):
    ep, n = key.split('/')
    if os.path.exists(f'{SER}/{ep}/clips/{n}B.mp4'):
        return 'clip done'
    return None

def thumb(path):
    name = 'live_' + re.sub(r'[^A-Za-z0-9_.-]', '_', path.replace(SER + '/', '')).replace('.png', '.jpg')
    dst = f'{CONTENT}/{name}'
    src = path if path.startswith('/') else f'{SER}/{path}'
    if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src):
        subprocess.run(['sips', '-Z', '1600', src, '--out', dst, '-s', 'format', 'jpeg'], capture_output=True)
    return name

def render(st):
    css = ('<style>.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px}.c{background:var(--bg-secondary);'
           'border-radius:12px;padding:8px;font-size:.8rem}.c img{width:100%;border-radius:8px;display:block}.c h4{margin:6px 0 2px;font-size:.9rem}'
           '.b{display:inline-block;border-radius:6px;padding:2px 7px;font-size:.75rem;margin:4px 0;font-weight:600}.review{background:#f3c77b;color:#222}'
           '.approved{background:#5cb85c;color:#fff}.redo{background:#d9534f;color:#fff}.waiting{background:#888;color:#fff}.clip{background:#5b8def;color:#fff}'
           '.btn{margin-top:6px;padding:7px;text-align:center;border-radius:8px;border:2px solid var(--accent);cursor:pointer;font-weight:600}'
           '.btn.selected{background:var(--accent);color:#fff}.t{color:var(--text-secondary)}.ln{font-style:italic}.end{margin-top:6px}</style>')
    eps = ' and '.join('EP ' + e[2:] for e in EPS)
    parts = [css, (open(EXTRA).read() if os.path.exists(EXTRA) else '') + f'<h2>Stills, {eps} (live)</h2><p class="subtitle">New stills appear here as they are made and checked. '
             '<b>Click "Approve" under any still you are happy with</b> (it locks in and its clip starts generating at once), or tell me in chat. '
             'For changes, tell me in chat with the shot number. Refresh to see the latest.</p>']
    for ep in EPS:
        title = open(f'{SER}/{ep}/script.md').readline().lstrip('# ').strip()
        parts.append(f'<h3>{title}</h3><div class="g" data-multiselect>')
        for n, (pic, line) in sorted(rows(ep).items()):
            key = f'{ep}/{n:02d}'; s = st.get(key, {'status': 'waiting'})
            status = s['status']; cs = clip_state(key) or s.get('noclip')  # noclip: shot made in the edit (card, held still), never a Kling clip
            badge = {'review': 'ready for review', 'approved': 'approved', 'redo': 'redo queued', 'waiting': 'generating'}[status]
            b = f'<span class="b {status}">{badge}</span>' + (f' <span class="b clip">{cs}</span>' if cs else
                (' <span class="b clip">clip generating</span>' if status == 'approved' else ''))
            img = f'<img src="/files/{thumb(s["cand"])}">' if s.get('cand') else '<div style="height:120px"></div>'
            if s.get('end'):
                img += f'<div class="end t">end frame (the morph target):</div><img src="/files/{thumb(s["end"])}">'
            note = f'<div class="t">{html.escape(s["note"])}</div>' if s.get('note') else ''
            ln = re.sub(r'\*(.+?)\*', r'<b>\1</b>', line.replace('`', ''))
            btn = ''
            if status == 'review':
                btn = f'<div class="btn" data-choice="approve:{key}" onclick="toggleSelect(this)">Approve {n:02d}</div>'
            elif status == 'approved' and not cs:
                btn = f'<div class="btn" data-choice="undo:{key}" onclick="toggleSelect(this)">Undo approval</div>'
            parts.append(f'<div class="c">{img}<h4>{n:02d}</h4>{b}<div>{html.escape(pic[:150])}</div>'
                         f'<div class="ln">{ln}</div>{note}{btn}</div>')
        parts.append('</div>')
    open(PAGE + '.tmp', 'w').write(''.join(parts)); os.replace(PAGE + '.tmp', PAGE)

def approve(st, key):
    s = st.get(key)
    if not s or s['status'] != 'review':
        return False
    if clip_state(key):  # rename the old clip to _alt_NNB_vK.mp4 first, so an approved redo gets a new clip
        print('REFUSED', key, '(a clip already exists: rename it to _alt_ first)'); return False
    ep = key.split('/')[0]
    shutil.copyfile(f'{SER}/{s["cand"]}', final_path(ep, s['cand']))
    if s.get('end'):
        shutil.copyfile(f'{SER}/{s["end"]}', final_path(ep, s['cand'], end=True))
    s['status'] = 'approved'; s['approved_at'] = time.strftime('%H:%M')
    return True

def main():
    st = load()
    if sys.argv[1] == 'set':
        key = sys.argv[2]; s = st.setdefault(key, {})
        a = sys.argv[3:]
        for i in range(0, len(a), 2):
            s[a[i].lstrip('-')] = a[i + 1]
        save(st); render(st); print('set', key, s.get('status'))
    elif sys.argv[1] == 'approve':
        k = sys.argv[2]
        print(('APPROVED ' + k) if approve(st, k) else ('NOT APPROVED ' + k + ' (status must be review, and no clip may exist)'))
        save(st); render(st)
    elif sys.argv[1] == 'sync':
        changed = False
        if os.path.exists(EVENTS):
            last = st.get('_last_ts', 0)
            for l in open(EVENTS):
                try: e = json.loads(l)
                except ValueError: continue
                if e.get('timestamp', 0) <= last: continue  # each click is applied once (the events file is never cleared)
                st['_last_ts'] = last = e.get('timestamp', 0); changed = True
                ch = e.get('choice', '')
                if ch.startswith('approve:') and approve(st, ch[8:]):
                    print('APPROVED', ch[8:]); changed = True
                elif ch.startswith('undo:'):
                    k = ch[5:]; s = st.get(k)
                    if s and s['status'] == 'approved' and not clip_state(k):
                        for p in (final_path(k.split('/')[0], s['cand']), final_path(k.split('/')[0], s['cand'], True)):
                            if os.path.exists(p): os.remove(p)
                        s['status'] = 'review'; print('UNDONE', k); changed = True
        if changed or (os.path.exists(STATE) and os.path.getmtime(STATE) > os.path.getmtime(PAGE) if os.path.exists(PAGE) else True):
            save(st); render(st)
        elif any(clip_state(k) and not st[k].get('clip_seen') for k in st if '/' in k):
            for k in st:
                if '/' in k and clip_state(k): st[k]['clip_seen'] = True
            save(st); render(st)

main()
