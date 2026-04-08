# Artifact Policy

This repository currently contains oversized and mixed-purpose content. From this point forward:

## Do not commit
- portable runtimes
- generated archives
- browser recordings
- local test output directories
- ad-hoc exported datasets

## Preferred destinations
- GitHub Releases for versioned distributables
- object storage / cloud buckets for media and exports
- CI artifacts for test recordings and traces

## Migration note
Existing large tracked assets should be removed in a future history-cleanup pass. That work should be done carefully with history rewriting tools so clones are not broken unexpectedly.
