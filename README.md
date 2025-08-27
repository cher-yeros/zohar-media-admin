# Zohar Media Admin Panel

A modern, clean, and minimal admin panel for managing media content, inquiries, testimonials, and analytics for Zohar Media company.

## Features

### 🎯 Dashboard

- Overview cards showing total inquiries, media items, and testimonials
- Recent inquiries table with status indicators
- Quick action buttons for uploading media and adding testimonials
- Inquiry trends chart for visual analytics
- Real-time statistics and metrics

### 📬 Inquiries Management

- Complete inquiry list with search and filtering capabilities
- Filter by status (unread/responded/resolved) and type (general/collaboration/pricing/support)
- Detailed modal view for reading full inquiry details
- Mark inquiries as resolved with one click
- Export functionality for CSV/PDF reports
- Status tracking and management

### 🎨 Media / Portfolio Management

- Responsive grid layout for videos and images
- Upload, edit, and delete media functionality
- Preview modal for media items with detailed information
- Tagging system for categorizing media
- Support for both images and videos
- File size and dimension tracking

### ⭐ Testimonials Management

- List all testimonials with approval workflow
- Approve/reject testimonials before publishing
- Feature testimonials for homepage display
- Star rating system visualization
- Customer avatar support
- Company and contact information tracking

### 📊 Analytics

- Visitor statistics and trends
- Inquiry volume tracking
- Media engagement metrics
- Device breakdown (desktop/mobile/tablet)
- Top performing content analysis
- Interactive charts and visualizations

## UI/UX Features

- **Modern Design**: Clean, minimal interface using ShadCN UI components
- **Responsive**: Fully responsive design that works on all devices
- **Dark/Light Mode**: Built-in theme switching capability
- **Smooth Animations**: Subtle transitions and hover effects
- **Accessible**: WCAG compliant components with proper ARIA labels
- **Loading States**: Elegant loading and empty states

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: ShadCN UI (Radix UI primitives)
- **Routing**: React Router DOM
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React hooks (can be extended with Redux/Zustand)

## Project Structure

```
src/
├── components/
│   ├── ui/                 # ShadCN UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   └── switch.tsx
│   ├── layout/             # Layout components
│   │   ├── layout.tsx
│   │   └── sidebar.tsx
│   └── theme-provider.tsx  # Theme management
├── pages/                  # Page components
│   ├── dashboard.tsx
│   ├── inquiries.tsx
│   ├── media.tsx
│   ├── testimonials.tsx
│   └── analytics.tsx
├── data/                   # Sample data and types
│   └── sample-data.ts
├── lib/                    # Utility functions
│   └── utils.ts
├── globals.css             # Global styles and CSS variables
├── App.tsx                 # Main app component
└── main.tsx               # Entry point
```

## Installation & Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run start
   ```

3. **Build for production:**

   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Development

### Adding New Features

1. **New Pages**: Add to `src/pages/` and update routing in `App.tsx`
2. **New Components**: Add to `src/components/` following the existing structure
3. **New UI Components**: Add to `src/components/ui/` following ShadCN patterns
4. **Data Types**: Update `src/data/sample-data.ts` with new interfaces

### Customization

- **Colors**: Modify CSS variables in `src/globals.css`
- **Theme**: Update `tailwind.config.js` for design system changes
- **Navigation**: Edit `src/components/layout/sidebar.tsx`
- **Sample Data**: Modify `src/data/sample-data.ts` for testing

### Code Style

- Use TypeScript for type safety
- Follow React functional component patterns
- Use Tailwind CSS classes for styling
- Implement proper error boundaries and loading states
- Follow accessibility best practices

## Sample Data

The application comes with comprehensive sample data including:

- 5 sample inquiries with different statuses and types
- 6 sample media items (images and videos)
- 5 sample testimonials with ratings and approval status
- Analytics data with visitor trends and engagement metrics

## Performance Optimizations

- **Lazy Loading**: Components can be lazy-loaded for better performance
- **Memoization**: Use React.memo for expensive components
- **Virtual Scrolling**: For large datasets (can be implemented)
- **Image Optimization**: Lazy loading and responsive images
- **Code Splitting**: Automatic code splitting with Vite

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

**Zohar Media Admin Panel** - Built with ❤️ using modern web technologies.
