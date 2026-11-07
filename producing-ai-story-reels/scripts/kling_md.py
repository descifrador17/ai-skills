"""Write epNN/kling_prompts.md (the clip record) for the pair in $EPS from the live-page state (approved candidates and
end frames), the runner logs in $RUN_DIR (Higgsfield job ids) and each epNN/clips/NNB.prompt.txt.
Run after the clips are in:  source "$SKILL_DIR/scripts/env.sh" && cd "$SERIES_DIR" && python3 "$SKILL_DIR/scripts/kling_md.py"
"""
import glob, json, os, re
SER, RUN, EPS = os.environ['SERIES_DIR'], os.environ['RUN_DIR'], os.environ['EPS'].split()
st = json.load(open(f'{RUN}/live_state_{"_".join(EPS)}.json'))
jobs = {}  # out path -> last job id
for f in sorted(glob.glob(RUN + '/*.log'), key=os.path.getmtime):
    for l in open(f, errors='ignore'):
        m = re.search(r'"job": "([0-9a-f-]{36})".*"out": "([^"]+)"', l)
        if m: jobs[m.group(2)] = m.group(1)
os.chdir(SER)
for ep in EPS:
    script = open(f'{ep}/script.md').read()
    title = script.splitlines()[0].lstrip('# ').strip()
    rows = {}
    for l in script.split('## Shots')[1].split('\n## ')[0].splitlines():
        c = [x.strip() for x in l.strip('|').split('|')]
        if len(c) > 3 and c[0].isdigit(): rows[int(c[0])] = re.sub(r'\*\*(.+?)\*\*', r'\1', c[2]).split('(my call')[0].strip()
    out = [f'# {title}: Kling prompts (Kling 3.0 Unlimited, 1080p, 9:16, 5 s, sound off; made with tools/hf_web)\n',
           'Each clip starts from its still (morph shots also end on an end frame). Motion and camera only; every character as in the start frame; silent; no text.\n']
    for n in sorted(rows):
        s = st.get(f'{ep}/{n:02d}', {})
        def ident(p):
            if not p: return '`?`'
            src = re.sub(r'_t1[cf]?\.png$', '_t1.png', p)
            note = ' (border cropped)' if p.endswith('_t1c.png') else ' (mirrored)' if p.endswith('_t1f.png') else ''
            return f'`{jobs.get(src, "not in the logs")}`' + note
        finals = sorted(x for x in glob.glob(f'{ep}/stills/{n:02d}A_*.png') if not x.endswith('_end.png'))
        final = finals[0].split('/', 1)[1] if finals else '(not approved yet)'
        h = rows[n] if len(rows[n]) <= 90 else rows[n][:90].rsplit(' ', 1)[0] + '…'
        out.append(f'## {n:02d}B: {h}\n')
        out.append(f'**Start frame:** `{final}` (Higgsfield image {ident(s.get("cand"))})  ')
        if s.get('end'): out.append(f'**End frame:** `{final.replace(".png", "_end.png")}` (Higgsfield image {ident(s["end"])})  ')
        clip = f'{ep}/clips/{n:02d}B.mp4'
        out.append(f'**Clip:** `clips/{n:02d}B.mp4` (Kling job `{jobs.get(clip, "pending")}`)\n')
        pp = f'{ep}/clips/{n:02d}B.prompt.txt'
        out.append('```\n' + (open(pp).read().strip() if os.path.exists(pp) else '(no prompt yet)') + '\n```\n')
    open(f'{ep}/kling_prompts.md', 'w').write('\n'.join(out))
    print(ep, 'kling_prompts.md written,', len(rows), 'shots')
