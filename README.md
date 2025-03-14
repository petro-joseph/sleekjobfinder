
# SleekJobs - Mobile-First Job Search App

## Overview

SleekJobs is a modern, mobile-first job search web application built with React, Tailwind CSS, and Shadcn/UI. This application prioritizes the mobile user experience with a sleek bottom navigation bar inspired by popular apps like X (Twitter) and LinkedIn.

## Key Mobile Features

- **Bottom Navigation Bar**: Fixed at the bottom of the screen for logged-in users, providing easy access to primary sections (Home, Jobs, Saved, Progress, Profile)
- **Touch-Optimized UI**: All interactive elements are sized appropriately for touch (minimum 48x48px)
- **Horizontal Scrolling Cards**: Used for lists and collections that would normally appear as grids on desktop
- **Responsive Typography**: Text sizes are optimized for mobile viewing
- **Fixed Action Buttons**: Important actions are easily accessible via fixed position buttons
- **Swipeable Elements**: Many elements support swipe gestures for a native app feel

## Mobile-First Approach

The application follows these mobile-first principles:

1. **Design for small screens first**: All components are designed to look great on mobile before being adapted for larger screens
2. **Progressive enhancement**: Additional features and layouts are added as screen size increases
3. **Touch as primary input**: All interactive elements are designed for touch rather than mouse
4. **Simplified navigation**: Bottom navigation provides quick access to key areas
5. **Content prioritization**: Critical content appears above the fold on mobile devices

## Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Technology Stack

- **React** with React Router for routing
- **TailwindCSS** for styling
- **Shadcn/UI** for UI components
- **React Query** for data fetching
- **Zustand** for state management
- **Framer Motion** for animations

## Mobile Navigation

The bottom navigation bar:

- Appears only for authenticated users
- Is hidden on desktop viewports (replaced by the top navigation)
- Provides haptic feedback on navigation (where supported)
- Visually indicates the current section

## Mobile Optimization Tips

When extending this application, follow these guidelines:

1. Test on real mobile devices, not just browser developer tools
2. Ensure touch targets are at least 48x48px
3. Use `touch-action` CSS property appropriately for custom touch behaviors
4. Consider offline capabilities for mobile users with spotty connections
5. Optimize images and assets for mobile data connections
6. Implement skeleton loaders for better perceived performance
7. Use system fonts where possible for better performance

## File Structure Highlights

- `/components/BottomNav.tsx`: The mobile bottom navigation component
- `/styles/mobile.css`: Mobile-specific styles
- `/components/Layout.tsx`: Responsive layout with adjustments for bottom navigation

## Contributing

Contributions are welcome! Please follow the mobile-first approach when adding new features or components.
