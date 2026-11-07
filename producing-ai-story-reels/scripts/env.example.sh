# Copy to env.sh and fill in. Claude Code's Bash keeps no environment between calls, so EVERY command that uses these
# starts with:  source "<skill>/scripts/env.sh" && cd "$SERIES_DIR" && ...   (scripts always run from the project folder)
export SKILL_DIR="$HOME/Desktop/content/.claude/skills/producing-ai-story-reels"   # this skill
export CONTENT_DIR="$HOME/Desktop/content"                        # the shared content folder (holds tools/hf_web and the project)
export SERIES_DIR="$CONTENT_DIR/<project_folder>"                 # the project folder (PROJECT_PROFILE.md, CLAUDE.md, EDIT_PLAN.md, epNN/, tools/, remotion/)
export HF_WEB="$CONTENT_DIR/tools/hf_web/hf_web.py"               # the free Higgsfield driver (web route); see SKILL.md §2.5 for a local model
export RUN_DIR="$SERIES_DIR/.superpowers/run"                     # runner logs, STOP files, live-page state
export COMPANION_DIR=""                                           # the review server's session dir (…/.superpowers/brainstorm/<id>), from start-server.sh
export EPS="ep01 ep02"                                            # the batch in progress (folder names)
export RATIO="9:16"                                                # still aspect for image_runner (16:9 for landscape films)
export MODEL=""                                                   # still model for image_runner (empty = hf_web default, Seedream 4.5)
export TRANSFORM=""                                               # shots that morph start->end, e.g. "ep01/08"; while runners run, write it to "$RUN_DIR/TRANSFORM" instead
export REQUIRED_FILES=""                                          # extra files the preflight must find, relative to SERIES_DIR or absolute (music bed, wordmark, style frame…)
export WHISPER_MODEL="$CONTENT_DIR/models/ggml-large-v3-turbo.bin"   # curl -L -o it from https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo.bin
export OVERLAY_PY="$CONTENT_DIR/.venv-overlay/bin/python"   # python3 -m venv "$CONTENT_DIR/.venv-overlay" && "$CONTENT_DIR/.venv-overlay/bin/pip" install numpy opencv-python
mkdir -p "$RUN_DIR"
