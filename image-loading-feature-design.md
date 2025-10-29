# Image Loading Feature Design Document

**Date**: 2025-10-29
**Feature**: Add loading states to HeaderButton image preview
**Status**: Architecture design complete, awaiting implementation approval

---

## Table of Contents

1. [Feature Requirements](#feature-requirements)
2. [Codebase Exploration Summary](#codebase-exploration-summary)
3. [User Clarifications](#user-clarifications)
4. [Architecture Approaches](#architecture-approaches)
5. [Recommendation](#recommendation)
6. [Implementation Details](#implementation-details)

---

## Feature Requirements

### Problem Statement
The HeaderButton component in ProfileEditor uses timestamp-based cache busting to display updated header images. Currently, when a new timestamp is loaded, the old image disappears immediately and shows a blank background until the new image loads, creating a poor user experience.

### Goals
1. **Keep old image visible** until the new image is fully loaded (prevent flash of empty background)
2. **Show loading indicator** (spinner) centered over the preview while new image loads
3. **Handle errors gracefully** by reverting to the default placeholder (blue gradient) if load fails
4. **Trigger on src changes** including timestamp updates

### Current Implementation
- **File**: `/src/components/@molecules/ProfileEditor/Header/HeaderButton.tsx`
- **Current behavior**: Uses CSS `background-image` property with `addTimestamp(src)` from `useImgTimestamp` hook
- **Issue**: CSS background images don't expose load events, so no way to track loading state

---

## Codebase Exploration Summary

### Existing Patterns Found

#### 1. Image Loading State Management
**Source**: `/src/components/@molecules/ProfileEditor/Avatar/AvatarNFT.tsx` (lines 308-338)

```typescript
const [loadState, setLoadState] = useState<'loading' | 'error' | 'loaded'>('loading')

<NFTImage
  src={nft.media[0].thumbnail}
  loading="lazy"
  onLoad={() => setLoadState('loaded')}
  onError={() => setLoadState('error')}
  data-image-state={loadState}
/>
```

**Pattern**: Use HTML image element events (`onLoad`, `onError`) with local state tracking

#### 2. Loading Overlay Pattern
**Source**: `/src/components/@molecules/TransactionDialogManager/InputComponentWrapper.tsx` (lines 12-24)

```typescript
const SpinnerOverlay = styled.div(
  () => css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
  `,
)
```

**Pattern**: Absolute positioned overlay with centered spinner

#### 3. Cache Busting
**Source**: `/src/hooks/useImgTimestamp.ts`

```typescript
export const useImgTimestamp = () => {
  const query = useQuery({
    queryKey: ['image-timestamp'],
    queryFn: () => Date.now(),
    staleTime: Infinity,
    gcTime: Infinity,
  })
  return {
    addTimestamp: (url?: string | null) => {
      const isHttp = url?.startsWith('http')
      if (isHttp) return `${url}?timestamp=${query.data}`
      return url || undefined
    },
  }
}
```

**Pattern**: Append timestamp query parameter to force cache invalidation

#### 4. Spinner Component
**Source**: `@ensdomains/thorin` design system

```typescript
import { Spinner } from '@ensdomains/thorin'

<Spinner color="accent" size="large" />
```

**Usage**: Used in 241+ places across codebase for loading states

---

## User Clarifications

### Questions Asked & Answers

**Q1: Where should the loading indicator appear while the new header image loads?**
**A**: Center of preview (show spinner centered over the header preview area)

**Q2: What should happen if the new image fails to load?**
**A**: Go back to placeholder or default (revert to blue gradient background)

**Q3: How should the loading state be triggered?**
**A**: On src prop change (show loading whenever src changes, including timestamp updates)

---

## Architecture Approaches

### Approach 1: Minimal Changes

**Philosophy**: Smallest possible change, maximum code reuse

#### Implementation
- Keep existing CSS `background-image` approach
- Add hidden `<img>` element purely for load state tracking
- Simple `useState` for tracking `'loading' | 'error' | 'loaded'` states
- Add styled components for overlay directly in HeaderButton.tsx

#### Code Changes

**File**: `/src/components/@molecules/ProfileEditor/Header/HeaderButton.tsx`

```typescript
// Add imports
import { ComponentProps, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { Spinner } from '@ensdomains/thorin'

// Add styled components after HeaderPreview
const LoadingOverlay = styled.div(
  () => css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
  `,
)

const HiddenImage = styled.img(
  () => css`
    display: none;
  `,
)

// In HeaderButton component
const HeaderButton = ({ validated, src, ... }: Props) => {
  const { addTimestamp } = useImgTimestamp()
  const [imageLoadState, setImageLoadState] = useState<'loading' | 'error' | 'loaded'>('loading')

  useEffect(() => {
    if (src) {
      setImageLoadState('loading')
    } else {
      setImageLoadState('loaded')
    }
  }, [src])

  return (
    // ... existing JSX ...
    <HeaderPreview $src={addTimestamp(src)} id="header-field">
      <HiddenImage
        src={addTimestamp(src)}
        onLoad={() => setImageLoadState('loaded')}
        onError={() => setImageLoadState('error')}
        alt=""
      />
      {imageLoadState === 'loading' && src && (
        <LoadingOverlay>
          <Spinner size="large" color="accent" />
        </LoadingOverlay>
      )}
    </HeaderPreview>
  )
}
```

#### Pros & Cons
- ✅ Zero breaking changes
- ✅ Fastest to implement (~30 minutes)
- ✅ Easy to understand
- ✅ ~30 lines of code added
- ❌ Loads image twice (hidden img + CSS background) - mitigated by browser cache
- ❌ Pattern specific to HeaderButton, not reusable

---

### Approach 2: Clean Architecture

**Philosophy**: Build reusable abstractions for long-term maintainability

#### Implementation
- Create `useImageLoader` hook with discriminated union state types
- Create `ImageLoadingOverlay` atom component
- Create optional `ImageWithLoadingState` higher-order component
- Full TypeScript type safety
- Comprehensive test suite

#### File Structure

```
/src/hooks/
  useImageLoader.ts          (NEW - 80 lines)
  useImageLoader.test.ts     (NEW - 120 lines)

/src/utils/
  imageLoading.ts            (NEW - 30 lines)
  imageLoading.test.ts       (NEW - 40 lines)

/src/components/@atoms/
  ImageLoadingOverlay/
    ImageLoadingOverlay.tsx  (NEW - 60 lines)
    ImageLoadingOverlay.test.tsx (NEW - 50 lines)
  ImageWithLoadingState/     (OPTIONAL)
    ImageWithLoadingState.tsx (NEW - 70 lines)
    ImageWithLoadingState.test.tsx (NEW - 80 lines)
    README.md                (NEW)

/src/components/@molecules/ProfileEditor/Header/
  HeaderButton.tsx           (MODIFY - ~20 lines changed)
```

#### Hook Design

```typescript
// Discriminated union for type safety
type ImageLoadingState =
  | { status: 'idle' }
  | { status: 'loading'; previousSrc?: string }
  | { status: 'success'; currentSrc: string }
  | { status: 'error'; fallbackSrc: string }

interface UseImageLoaderReturn {
  state: ImageLoadingState
  setImageRef: (el: HTMLImageElement | null) => void
  imgRef: React.MutableRefObject<HTMLImageElement | null>
}

const useImageLoader = (options: {
  src?: string
  onError?: () => void
  onSuccess?: () => void
  defaultSrc?: string
}): UseImageLoaderReturn => {
  const imgRef = useRef<HTMLImageElement>(null)
  const [state, setState] = useState<ImageLoadingState>({ status: 'idle' })
  const previousSrcRef = useRef<string | undefined>()

  useEffect(() => {
    if (!imgRef.current || !options.src) {
      setState({ status: 'idle' })
      return
    }

    const img = imgRef.current

    if (previousSrcRef.current !== options.src) {
      previousSrcRef.current = options.src
      setState(prev => ({
        status: 'loading',
        previousSrc: prev.status === 'success' ? prev.currentSrc : undefined
      }))
    }

    const handleLoad = () => {
      setState({ status: 'success', currentSrc: options.src! })
      options.onSuccess?.()
    }

    const handleError = () => {
      setState({
        status: 'error',
        fallbackSrc: options.defaultSrc || previousSrcRef.current || ''
      })
      options.onError?.()
    }

    img.addEventListener('load', handleLoad)
    img.addEventListener('error', handleError)
    img.src = options.src

    return () => {
      img.removeEventListener('load', handleLoad)
      img.removeEventListener('error', handleError)
    }
  }, [options.src, options.onSuccess, options.onError, options.defaultSrc])

  return { state, imgRef }
}
```

#### Pros & Cons
- ✅ Highly reusable across avatar, header, profile images
- ✅ Clean separation of concerns
- ✅ Excellent type safety with discriminated unions
- ✅ Easy to test in isolation
- ✅ Well-documented with README
- ❌ Significant upfront investment (3-4 hours)
- ❌ ~450 lines across multiple files
- ❌ May be over-engineered for single use case

---

### Approach 3: Pragmatic Balance ⭐ **RECOMMENDED**

**Philosophy**: Balance speed with reusability, follow existing patterns closely

#### Implementation
- Create one `useImageLoadingState` hook (~60 lines)
- Modify HeaderButton.tsx with new styled components (~25 lines)
- Use native `Image()` constructor for load detection
- Simple boolean state (`isLoading`, `hasError`)

#### File Structure

```
/src/components/@molecules/ProfileEditor/Header/
  ImageLoadingState.ts       (NEW - 60 lines)
  HeaderButton.tsx           (MODIFY - ~25 lines added)
```

#### Hook Implementation

**File**: `/src/components/@molecules/ProfileEditor/Header/ImageLoadingState.ts`

```typescript
import { useEffect, useState } from 'react'

interface ImageLoadingState {
  isLoading: boolean
  hasError: boolean
}

export const useImageLoadingState = (src?: string): ImageLoadingState => {
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!src) {
      setIsLoading(false)
      setHasError(false)
      return
    }

    setIsLoading(true)
    setHasError(false)

    const img = new Image()

    img.onload = () => {
      setIsLoading(false)
    }

    img.onerror = () => {
      setIsLoading(false)
      setHasError(true)
    }

    img.src = src

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  return {
    isLoading,
    hasError,
  }
}
```

#### Component Changes

**File**: `/src/components/@molecules/ProfileEditor/Header/HeaderButton.tsx`

```typescript
// Add imports
import { useImageLoadingState } from './ImageLoadingState'
import { Spinner } from '@ensdomains/thorin'

// Add styled components after HeaderPreview
const HeaderPreviewWrapper = styled.div(
  ({ theme }) => css`
    position: relative;
    width: 18.75rem;
    height: 6.25rem;
    border-radius: ${theme.radii.large};
  `,
)

const LoadingOverlay = styled.div(
  ({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${theme.colors.background};
    opacity: 0.7;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${theme.radii.large};
    z-index: 10;
  `,
)

// In component
const HeaderButton = ({ src, validated, error, ... }: Props) => {
  const { addTimestamp } = useImgTimestamp()
  const imageState = useImageLoadingState(src)

  const displaySrc = imageState.hasError ? undefined : src
  const timestampedSrc = addTimestamp(displaySrc)

  return (
    <OuterContainer data-testid="header-button">
      <HeaderContainer>
        <Typography fontVariant="smallBold" color="textSecondary">
          Header
        </Typography>
        <IndicatorContainer
          $validated={validated && dirty}
          $error={error || imageState.hasError}
          $dirty={dirty}
          type="button"
        >
          <HeaderPreviewWrapper>
            <HeaderPreview
              $src={timestampedSrc}
              id="header-field"
            />
            {imageState.isLoading && (
              <LoadingOverlay data-testid="header-loading-overlay">
                <Spinner color="accent" size="small" />
              </LoadingOverlay>
            )}
          </HeaderPreviewWrapper>
        </IndicatorContainer>
      </HeaderContainer>
      {/* ... rest unchanged */}
    </OuterContainer>
  )
}
```

#### Data Flow

```
User changes src prop
  ↓
HeaderButton receives new src
  ↓
useImageLoadingState detects change via useEffect
  ↓
New Image() instance created, browser starts loading
  ↓
isLoading = true, LoadingOverlay appears with spinner
  ↓
Old image still visible in CSS background
  ↓
Image onload event fires
  ↓
isLoading = false, spinner hidden, new image visible

--- OR on error ---

Image onerror event fires
  ↓
hasError = true, displaySrc = undefined
  ↓
HeaderPreview shows blue gradient fallback
  ↓
Error indicator (red dot) lights up
```

#### Pros & Cons
- ✅ Reusable hook can be moved to `/src/hooks/` later
- ✅ Follows codebase conventions (mirrors `useImgTimestamp`)
- ✅ Medium implementation time (1-2 hours)
- ✅ Easy to extend to AvatarButton without refactoring
- ✅ Clear, maintainable code
- ✅ ~85 total lines across 2 files
- ⚖️ Slightly more code than minimal, but much more extensible

---

## Recommendation

### ⭐ **Approach 3: Pragmatic Balance**

#### Why This Is The Best Choice

1. **Sweet spot between speed and quality**
   - Fast to implement (1-2 hours)
   - Clean enough to extend later
   - Production-ready code

2. **Follows existing patterns**
   - Hook style mirrors `useImgTimestamp`, `useZorb`, etc.
   - Styled components follow codebase conventions
   - Uses native browser APIs (`Image()` constructor)

3. **Low-risk extensibility**
   - Hook can be moved to `/src/hooks/` if needed elsewhere
   - No refactoring required to reuse
   - Clear separation of logic (hook) and UI (component)

4. **Testing friendly**
   - Hook is pure logic, easy to unit test
   - Component changes straightforward to integration test
   - Mock `Image()` constructor for controlled testing

5. **Native browser behavior**
   - Uses `Image()` constructor (standard web API)
   - Browser handles caching automatically
   - No fetch() complexity or manual cache management

### Comparison Table

| Aspect | Approach 1: Minimal | Approach 2: Clean | Approach 3: Pragmatic ⭐ |
|--------|---------------------|-------------------|-------------------------|
| **Lines of code** | ~30 | ~450 | ~85 |
| **Files modified** | 1 | 6+ | 2 |
| **Implementation time** | 30 min | 3-4 hours | 1-2 hours |
| **Reusability** | Low | High | Medium-High |
| **Maintainability** | Medium | High | High |
| **Testing effort** | Low | High | Medium |
| **Type safety** | Medium | Excellent | Good |
| **Risk** | Very Low | Medium | Low |
| **Future-proofing** | Low | High | Medium-High |

---

## Implementation Details

### Build Sequence (Approach 3)

#### Phase 1: Create Loading State Hook
- [ ] Create `/src/components/@molecules/ProfileEditor/Header/ImageLoadingState.ts`
- [ ] Implement `useImageLoadingState` hook
- [ ] Add TypeScript interfaces
- [ ] Implement `useEffect` with src dependency
- [ ] Handle Image() instance creation and cleanup

#### Phase 2: Modify HeaderButton Component
- [ ] Import `useImageLoadingState` and `Spinner`
- [ ] Add `HeaderPreviewWrapper` styled component
- [ ] Add `LoadingOverlay` styled component
- [ ] Call `useImageLoadingState(src)` hook
- [ ] Update `$error` prop to include `imageState.hasError`
- [ ] Wrap HeaderPreview with HeaderPreviewWrapper
- [ ] Add conditional LoadingOverlay render
- [ ] Update displaySrc logic for error handling

#### Phase 3: Testing
- [ ] Test spinner appears when src changes
- [ ] Test spinner disappears when image loads
- [ ] Test error state shows red indicator
- [ ] Test fallback to gradient on error
- [ ] Test rapid src changes don't cause issues

### Critical Implementation Notes

1. **Error Handling**
   - On error, set `displaySrc = undefined` to show gradient fallback
   - Update `$error` prop to include `imageState.hasError` for red indicator
   - User can retry by selecting different image

2. **State Management**
   - State resets on every `src` change via `useEffect` dependency
   - Cleanup removes event listeners to prevent memory leaks
   - Simple boolean flags, no complex state machines

3. **Performance**
   - `Image()` instance reuses browser cache
   - Second fetch (CSS background) is instant from cache
   - Minimal re-renders (only when `isLoading` or `hasError` changes)

4. **Accessibility**
   - Spinner from Thorin has built-in ARIA attributes
   - `data-testid` for testing
   - Visual feedback with loading overlay + error indicator

5. **Future Extension**
   - Hook can be moved to `/src/hooks/useImageLoadingState.ts` if needed elsewhere
   - AvatarButton can use same pattern (though Thorin's Avatar already handles loading)
   - No code changes needed, just move file and update imports

---

## Next Steps

1. **Get approval on approach** (waiting for user confirmation)
2. **Implement Approach 3** (recommended)
3. **Test in browser** with actual header image uploads
4. **Launch code-reviewer agent** for quality review
5. **Create PR** with changes

---

## References

### Key Files Explored

- `/src/hooks/useImgTimestamp.ts` - Cache busting implementation
- `/src/components/@molecules/ProfileEditor/Header/HeaderButton.tsx` - Component to modify
- `/src/components/@molecules/ProfileEditor/Avatar/AvatarNFT.tsx` - Loading state pattern reference
- `/src/components/@molecules/TransactionDialogManager/InputComponentWrapper.tsx` - Overlay pattern reference
- `/src/components/@molecules/ScrollBoxWithSpinner.tsx` - Spinner usage pattern
- `/src/hooks/useEnsAvatar.ts` - Avatar/header metadata fetching
- `/src/transaction-flow/input/ProfileEditor/WrappedHeaderButton.tsx` - Form integration

### Design System

- **Thorin**: `@ensdomains/thorin` - Official ENS design system
- **Spinner**: `<Spinner color="accent" size="small|medium|large" />`
- **Styled Components**: All styling uses `styled-components` with theme

---

**Document Version**: 1.0
**Last Updated**: 2025-10-29
**Author**: Claude Code (feature-dev agent)
