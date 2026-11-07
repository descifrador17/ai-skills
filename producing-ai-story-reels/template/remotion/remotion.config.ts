/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);
// The default chrome-headless-shell crashes on this Mac: its separate GPU process cannot receive the
// ICU data fd from the parent ("icudtl.dat not found in bundle"). The wrapper launches the same
// headless shell with --in-process-gpu. (Chrome for Testing also starts, but it screenshots
// without frame-exact BeginFrame control and dropped overlays on some frames.)
// Path is relative to this folder (renders run from remotion/).
Config.setBrowserExecutable("../tools/chrome-headless-wrapper.sh");
// Standard limited-range BT.709 (the default tags full-range bt470bg, which phones may show with shifted contrast).
Config.setColorSpace("bt709");
