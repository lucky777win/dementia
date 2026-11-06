#!/bin/sh
# 產生 Design System 的 bundle.js / bundle.css
set -e
OUT=${1:?out dir}
npx esbuild src/ds-entry.ts --bundle --format=iife --global-name=__yq --jsx=automatic --minify --loader:.webp=dataurl \
  --alias:react/jsx-runtime=./ds-build/jsx-shim.cjs --alias:react=./ds-build/react-shim.cjs \
  --footer:js='window.YiqiCare=__yq;' --outfile=ds-build/bundle.raw.js --log-level=warning
{ echo '/* @ds-bundle: {"format":4,"namespace":"YiqiCare","components":[{"name":"Button"},{"name":"Chip"},{"name":"Badge"},{"name":"Icon"},{"name":"SearchField"},{"name":"SelectField"},{"name":"StateView"},{"name":"ResultCard"},{"name":"SectionHeading"},{"name":"Logo"},{"name":"FontSizeSwitch"},{"name":"Illustrations"},{"name":"Header"},{"name":"Hero"},{"name":"IdentitySection"},{"name":"QuickSearch"},{"name":"StageSection"},{"name":"ResourceFinder"},{"name":"Footer"},{"name":"HomePage"}]} */'; cat ds-build/bundle.raw.js; } > $OUT/components/bundle.js
{ echo "@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap');"; DS_PREVIEWS=$OUT/components npx tailwindcss -c ds-build/tailwind.ds.js -i src/index.css --minify 2>/dev/null; } > $OUT/components/bundle.css
rm ds-build/bundle.raw.js
