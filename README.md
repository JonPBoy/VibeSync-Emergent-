# VibeSync - Visual Inspiration Library

A production-ready full-stack application for browsing, remixing, and exporting beautiful design styles.

## 🌟 Features

- **Browse Styles**: Explore curated UI design styles with colors, typography, shadows, and animations
- **Search & Filter**: Find styles by name or category (minimal, bold, gradient, glassmorphism, etc.)
- **Favorites**: Save your favorite styles to local storage
- **Style Randomizer**: Mix and match properties with lockable controls to create unique combinations
- **Live Preview**: See styles rendered in real-time with hero sections and UI components
- **Create Custom Styles**: Design your own styles with an intuitive form and live preview
- **WordPress Theme Export**: Download any style as a ready-to-use WordPress theme (.zip)

## 🛠 Tech Stack

- **Framework**: Next.js 15.1.7 (App Router, ESM)
- **Frontend**: React 18, Framer Motion (animations)
- **Styling**: Tailwind CSS 3.4
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Theme Generator**: JSZip (client-side WordPress .zip generation)

## 📦 Setup Instructions

### 1. Install Dependencies

Dependencies are already installed via Yarn.

### 2. Configure Supabase Database

#### Step 1: Create the Database Table

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase_setup.sql` 
4. Click **Run** to create the `styles` table with sample data

The SQL script will:
- Create the `styles` table with proper schema
- Enable Row Level Security with public access policies
- Insert 10 sample styles across different categories

#### Step 2: Environment Variables

Your Supabase credentials are already configured in `.env`:

```
NEXT_PUBLIC_SUPABASE_URL=https://cjtjtdqbmyecfespsner.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_2hKcDBu5xTyz-vc7exU8Mg_40iuzjgv
```

### 3. Start the Application

The Next.js server is already running on:
- **Local**: http://localhost:3000
- **Network**: http://0.0.0.0:3000

## 🚀 Usage

### Browse Styles (Home Page)
- Use the search bar to find styles by name
- Filter by category using the pill buttons
- Click the heart icon to favorite a style
- Click "Copy CSS" to copy CSS variables
- Click "Preview" to see a full modal with tabs

### Randomizer
- Lock specific properties (colors, typography, radius, shadow, animation)
- Click "Generate Random Mix" to create unique combinations
- Download as WordPress theme

### Favorites
- View all your favorited styles
- Favorites are stored in browser localStorage

### Create
- Fill out the form with style properties
- See real-time preview on the right
- Color pickers with hex input fields
- Submit to save to Supabase database

### Preview Modal
- **Preview UI Tab**: See the style applied to a mock landing page
- **Get CSS Tab**: Copy CSS variables for your project
- **Export as WordPress Theme**: Download a complete WP theme .zip

## 📂 Project Structure

```
/app
├── app/
│   ├── layout.js              # Root layout with header & footer
│   ├── page.js                # Home page wrapper
│   ├── globals.css            # Tailwind directives & custom styles
│   ├── components/
│   │   ├── Navbar.jsx         # Navigation with active states
│   │   ├── StyleCard.jsx      # Style display card
│   │   └── StylePreview.jsx   # Preview modal with tabs
│   ├── home/
│   │   └── HomeClient.jsx     # Home page with search & filter
│   ├── favorites/
│   │   └── page.js            # Favorites page
│   ├── randomizer/
│   │   └── page.js            # Randomizer with locks
│   └── create/
│       └── page.js            # Create style form
├── lib/
│   ├── supabase.js            # Supabase client with fallback
│   └── wpThemeGenerator.js    # WordPress theme .zip generator
├── supabase_setup.sql         # Database schema & sample data
├── .env                       # Environment variables
├── package.json               # Dependencies (ESM)
├── tailwind.config.js         # Tailwind config (ESM)
├── postcss.config.js          # PostCSS config (ESM)
└── next.config.js             # Next.js config (ESM)
```

## 🎨 Design System

- **Gradient Header**: Violet to Fuchsia
- **Primary Color**: Violet 600
- **Rounded Corners**: Extensive use of rounded-2xl, rounded-3xl
- **Hover Effects**: Smooth scale and shadow transitions
- **Empty States**: Friendly with large icons
- **Form Inputs**: Focus rings with violet accent
- **Animations**: Framer Motion for smooth transitions

## 🔧 Technical Details

### ESM Configuration
The project uses `"type": "module"` in package.json, so all config files use ESM exports:
- `export default` instead of `module.exports`

### Supabase Graceful Fallback
If Supabase credentials are missing:
- App shows a helpful setup message
- Doesn't crash
- Guides user to run SQL setup script

### WordPress Theme Structure
Generated themes include:
- `style.css` (theme metadata + CSS variables)
- `index.php` (main template with loop)
- `header.php` (site header with nav)
- `footer.php` (site footer)
- `functions.php` (theme setup & support)

All styled with CSS variables from the chosen style.

## 🐛 Troubleshooting

### Database Not Connected
If you see a yellow warning about database not being connected:
1. Verify your Supabase credentials in `.env`
2. Run the `supabase_setup.sql` script in your Supabase dashboard
3. Refresh the page

### No Styles Showing
1. Make sure you've run the SQL setup script
2. Check browser console for errors
3. Verify Supabase credentials are correct

## 📝 License

MIT License - Feel free to use this project for your own purposes.

## 🙏 Credits

Built with ❤️ using Next.js, Supabase, Framer Motion, and Tailwind CSS.
