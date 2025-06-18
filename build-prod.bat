@echo off
REM Copy the production config
copy next.config.prod.mjs next.config.mjs

REM Run the build
call pnpm build

REM Restore original config if available
if exist next.config.mjs.backup (
  copy next.config.mjs.backup next.config.mjs
)
