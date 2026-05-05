# Release Process

This repo should behave like a small production app, even while the product is early.

## Change Workflow

1. Start from a clean working tree.
2. Make the requested app change.
3. Bump the version:
   - Patch for fixes, docs, dependency pins, and polish.
   - Minor for new user-visible features.
   - Major for breaking architecture changes.
4. Update `CHANGELOG.md`.
5. Run verification:

```bash
npm run check:deps
npm run export:ios
npm run export:android
```

6. Commit the change.
7. Push to GitHub.
8. Tag stable milestones:

```bash
git tag -a vX.Y.Z -m "Allio vX.Y.Z"
git push origin vX.Y.Z
```

## Commit Style

Use short, direct commits:

- `Add connected services hub`
- `Downgrade Expo SDK for Expo Go`
- `Polish dashboard cards`
- `Fix email validation`

## Production Readiness Checklist

Before calling any version production-ready:

- App opens in Expo Go on iOS.
- App opens in Expo Go on Android if available.
- No broken navigation routes.
- Empty input states show friendly messages.
- Mock flows are clearly isolated in `services/`.
- `CHANGELOG.md` has the release notes.
- GitHub has the latest commit and version tag.
