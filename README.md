# Filta

A professional, responsive React web application for downloading videos with subscription-based features.

## Features

### Core Functionality
- **Video Download**: Users can download videos by pasting URLs from popular platforms
- **Custom Save Location**: Users can specify where to save downloaded files
- **Progress Tracking**: Real-time download progress with visual feedback
- **7-Day Free Trial**: New users get 7 days of free access with limitations

### Subscription System
- **Trial Limitations**: 10 downloads per day, standard quality only
- **Subscription Plans**:
  - **Monthly Plan** ($9.99/month): Unlimited downloads, HD & 4K quality, priority support
  - **Yearly Plan** ($99.99/year): All monthly features plus analytics, API access, custom integrations

### Professional UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern Interface**: Clean, professional design with smooth animations
- **User-Friendly**: Intuitive navigation and clear call-to-action buttons
- **Visual Feedback**: Progress bars, notifications, and status indicators

## Technical Stack

### Frontend Technologies
- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing for navigation
- **Styled Components**: CSS-in-JS for component styling
- **Framer Motion**: Smooth animations and transitions
- **React Hot Toast**: Beautiful notification system
- **Lucide React**: Modern icon library
- **Context API**: Global state management

### Key Features Implementation

#### State Management
- **React Context**: Global user state management
- **useReducer**: Complex state logic handling
- **localStorage**: Persistent data storage
- **Custom Hooks**: Reusable state logic

#### Component Architecture
- **Functional Components**: Modern React patterns
- **Custom Hooks**: Shared logic extraction
- **Styled Components**: Scoped styling
- **Motion Components**: Animated interactions

#### Trial Management
- Tracks trial start date using localStorage
- Calculates remaining trial days
- Enforces download limits for trial users
- Automatic trial expiration handling

#### Download System
- URL validation for supported video platforms
- Simulated download progress with realistic timing
- File path selection and validation
- Download history tracking

#### Subscription Flow
- Modal-based subscription interface
- Form validation and payment simulation
- Plan comparison and selection
- Subscription status persistence

## File Structure

```
src/
├── components/
│   ├── Navbar.js              # Navigation component
│   ├── Hero.js                # Hero section with trial status
│   ├── DownloadForm.js        # Video download form
│   ├── Features.js            # Features showcase
│   ├── Pricing.js             # Subscription plans
│   ├── SubscriptionModal.js   # Payment modal
│   └── TrialExpiredModal.js   # Trial expiration modal
├── contexts/
│   └── UserContext.js         # Global state management
├── App.js                     # Main application component
├── App.css                    # Global styles
├── index.js                   # React entry point
└── index.css                  # Base styles
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Open Browser**: Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Usage

### For Trial Users
1. Visit the application
2. Paste a video URL in the input field
3. Select a save location
4. Click "Download" to start the process
5. Monitor progress and enjoy up to 10 downloads per day

### For Premium Users
1. Choose a subscription plan from the pricing section
2. Complete the subscription process
3. Enjoy unlimited downloads with premium features

## Component Details

### UserContext
- Manages global application state
- Handles trial tracking and subscription status
- Provides actions for state updates
- Persists data to localStorage

### DownloadForm
- Handles video URL input and validation
- Manages save location selection
- Shows download progress with animations
- Enforces trial limitations

### Pricing
- Displays subscription plans
- Handles plan selection
- Shows current subscription status
- Triggers subscription modal

### SubscriptionModal
- Collects payment information
- Validates form inputs
- Simulates payment processing
- Updates subscription status

## Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Breakpoints**: 
  - Mobile: < 480px
  - Tablet: 480px - 768px
  - Desktop: > 768px
- **Touch-Friendly**: Large buttons and touch targets
- **Flexible Layouts**: CSS Grid and Flexbox

## Browser Compatibility

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Future Enhancements

- **Backend Integration**: Real video downloading functionality
- **User Authentication**: Complete login/signup system
- **Payment Processing**: Integration with Stripe or PayPal
- **Download History**: Persistent download tracking
- **Batch Downloads**: Multiple file processing
- **Format Selection**: Choose video quality and format
- **Cloud Storage**: Integration with cloud storage providers
- **PWA Features**: Offline support and app installation

## Development Notes

### State Management
The application uses React Context with useReducer for state management:
- Trial tracking and expiration
- Subscription status and plan type
- Download progress and limitations
- Modal visibility states

### Simulated Features
For demonstration purposes, the following features are simulated:
- Video download process (progress bar animation)
- Payment processing (form validation only)
- File system access (mock folder selection)

### Performance Optimizations
- Component memoization where appropriate
- Lazy loading for heavy components
- Optimized re-renders with proper dependency arrays
- Efficient state updates

### Security Considerations
In a production environment, consider:
- Server-side validation for all user inputs
- Secure payment processing with PCI compliance
- Rate limiting and abuse prevention
- Content delivery network (CDN) for static assets
- Environment variables for sensitive data

## Scripts

- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run test suite
- `npm run eject`: Eject from Create React App

## License

This project is created for demonstration purposes. In a real-world scenario, ensure compliance with video platform terms of service and copyright laws.
