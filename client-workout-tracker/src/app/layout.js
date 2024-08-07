import './globals.css';

export const metadata = {
  title: 'Workout Tracker Dashboard',
  description:
    'Track and manage your workouts with ease using our comprehensive dashboard.',
  keywords:
    'workout tracker, fitness, health, exercise, dashboard, activity tracking',
  author: 'Your Company Name',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow', // Allow search engines to index the page
  openGraph: {
    title: 'Workout Tracker Dashboard',
    description:
      'Track and manage your workouts with ease using our comprehensive dashboard.',
    url: 'https://www.yourwebsite.com/dashboard', // Replace with your website URL
    type: 'website',
    images: [
      {
        url: 'https://www.yourwebsite.com/images/dashboard-preview.jpg', // Replace with your image URL
        width: 800,
        height: 600,
        alt: 'Workout Tracker Dashboard Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yourtwitterhandle', // Replace with your Twitter handle
    title: 'Workout Tracker Dashboard',
    description:
      'Track and manage your workouts with ease using our comprehensive dashboard.',
    image: 'https://www.yourwebsite.com/images/dashboard-preview.jpg', // Replace with your image URL
  },
  canonical: 'https://www.yourwebsite.com/dashboard', // Replace with your canonical URL
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
