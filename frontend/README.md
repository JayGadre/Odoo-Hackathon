# CivicTrack - Community Issue Reporting Platform

A modern, mobile-responsive React application that empowers communities to report, track, and resolve neighborhood issues together.

## 🌟 Features

### Core Functionality
- **Hero Landing Page**: Welcoming interface with cityscape background and login options
- **Issue Reporting**: Simple form with photo upload and GPS location capture
- **Interactive Map**: Live map with color-coded pins showing issue status
- **Advanced Filtering**: Search by category, status, distance, and keywords
- **Issue Details**: Comprehensive cards with comments and status history
- **Community Features**: Voting, commenting, and progress tracking

### Design Highlights
- **Mobile-First**: Responsive design optimized for all devices
- **Accessible**: ARIA labels, keyboard navigation, and screen reader support
- **Warm Palette**: Soft blues and greens creating a welcoming community feel
- **Smooth Animations**: Subtle transitions and micro-interactions
- **Clean Layout**: Uncluttered interface with intuitive navigation

### Technical Features
- **React + Next.js**: Modern framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling with custom theme
- **Leaflet Maps**: Interactive mapping with custom markers
- **shadcn/ui**: Accessible component library
- **Mock Data**: Complete demo data for testing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or download the project**
   \`\`\`bash
   # If you have the code files, navigate to the project directory
   cd civictrack
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage Guide

### For Community Members

1. **Landing Page**
   - Choose to log in or continue as guest
   - View community impact statistics
   - Get started with the platform

2. **Reporting Issues**
   - Click "Report Issue" button
   - Fill out the form with title, description, and category
   - Upload a photo (optional)
   - Use GPS to capture location
   - Submit to notify the community

3. **Exploring Issues**
   - Use the interactive map to see all issues
   - Filter by category, status, or distance
   - Search for specific issues
   - Click markers for quick previews

4. **Engaging with Issues**
   - Vote on issues to show support
   - Add comments and updates
   - Track status changes over time
   - Earn community badges

### For Administrators

- Monitor all reported issues
- Update issue statuses (Reported → In Progress → Resolved)
- Respond to community comments
- Track resolution metrics

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#3b82f6` - Trust and reliability
- **Primary Green**: `#22c55e` - Growth and resolution
- **Status Colors**:
  - Orange (`#f59e0b`): Reported issues
  - Blue (`#3b82f6`): In progress
  - Green (`#10b981`): Resolved

### Typography
- **Headings**: Bold, clear hierarchy
- **Body Text**: Readable, accessible contrast
- **UI Text**: Consistent sizing and spacing

### Components
- **Cards**: Subtle shadows and rounded corners
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clear labels and validation states
- **Maps**: Custom markers with status indicators

## 🏗️ Architecture

### Component Structure
\`\`\`
components/
├── hero-section.tsx      # Landing page hero
├── map-view.tsx          # Interactive Leaflet map
├── issue-form.tsx        # Issue reporting form
├── issue-card.tsx        # Detailed issue view
├── filter-sidebar.tsx    # Search and filter controls
└── ui/                   # shadcn/ui components
\`\`\`

### Data Flow
- **Mock Data**: Realistic sample issues with full details
- **State Management**: React hooks for local state
- **Real-time Updates**: Optimistic UI updates
- **Location Services**: GPS integration for precise reporting

### Key Features Implementation

#### Interactive Map
- Leaflet.js integration with custom markers
- Color-coded pins based on issue status
- Popup previews with quick actions
- Responsive zoom and pan controls

#### Issue Management
- Complete CRUD operations
- Status tracking with history
- Photo upload and display
- GPS location capture

#### Community Features
- Voting system with real-time counts
- Threaded comment system
- Badge notifications
- Progress tracking

## 🔧 Customization

### Adding New Categories
Edit `components/issue-form.tsx` and `components/filter-sidebar.tsx`:
\`\`\`typescript
const categories = [
  'Road Maintenance',
  'Street Lighting',
  'Your New Category', // Add here
  // ...
]
\`\`\`

### Modifying Status Flow
Update the status options in `lib/mock-data.ts`:
\`\`\`typescript
type IssueStatus = 'reported' | 'in-progress' | 'resolved' | 'your-status'
\`\`\`

### Customizing Colors
Modify `tailwind.config.ts` to change the color scheme:
\`\`\`typescript
civic: {
  blue: { /* your blue shades */ },
  green: { /* your green shades */ }
}
\`\`\`

## 🌐 Deployment

### Build for Production
\`\`\`bash
npm run build
npm start
\`\`\`

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Environment Variables
For production, you may want to add:
- `NEXT_PUBLIC_MAP_API_KEY`: For enhanced mapping features
- `DATABASE_URL`: For persistent data storage
- `AUTH_SECRET`: For user authentication

## 🤝 Contributing

We welcome contributions! Here's how to get involved:

1. **Report Issues**: Use the GitHub issues tab
2. **Suggest Features**: Open a feature request
3. **Submit PRs**: Fork, develop, and submit pull requests
4. **Improve Docs**: Help make the documentation better

### Development Guidelines
- Follow TypeScript best practices
- Maintain accessibility standards
- Write descriptive commit messages
- Test on multiple devices and browsers

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **shadcn/ui**: For the excellent component library
- **Leaflet**: For the mapping functionality
- **Lucide**: For the beautiful icons
- **Tailwind CSS**: For the utility-first styling
- **Community**: For inspiration and feedback

---

**Built with ❤️ for stronger communities**

*CivicTrack - Where every voice matters and every issue counts.*
