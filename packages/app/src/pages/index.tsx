import {
  LandingContent,
  LandingTemplate,
} from '@slides/templates/LandingTemplate';
import { NextPage } from 'next';

const content: LandingContent = {
  navbar: {
    title: 'Pitch Deck Generator',
    buttonText: 'Create Deck',
    buttonHref: '/app',
  },
  hero: {
    title: 'Create Stunning Pitch Decks Instantly',
    tagline:
      'A fast, intuitive, and privacy-first pitch deck generator that works entirely in your browser.',
    buttonText: 'Start Creating',
    buttonHref: '/app',
  },
  features: {
    title: 'Features',
    items: [
      {
        id: 'instant-templates',
        emoji: '📄',
        title: 'Instant Templates',
        description:
          'Choose from professional templates to get your pitch deck started in seconds.',
      },
      {
        id: 'drag-drop-editor',
        emoji: '✏️',
        title: 'Drag & Drop Editor',
        description:
          'Easily add slides, text, images, and charts with an intuitive drag-and-drop interface.',
      },
      {
        id: 'charts-diagrams',
        emoji: '📊',
        title: 'Charts & Diagrams',
        description:
          'Visualize your data with ready-to-use charts, graphs, and diagrams for impactful presentations.',
      },
      {
        id: 'privacy-first',
        emoji: '🔒',
        title: 'Privacy First',
        description:
          'All your decks stay in your browser. No data is uploaded or stored remotely.',
      },
      {
        id: 'export-options',
        emoji: '💾',
        title: 'Export Options',
        description:
          'Export your pitch deck as PDF, PPTX, or share a secure link instantly.',
      },
      {
        id: 'collaboration',
        emoji: '🤝',
        title: 'Collaborate Easily',
        description:
          'Work with your team in real-time or asynchronously, without losing privacy.',
      },
    ],
  },
  cta: {
    title: 'Start Building Your Pitch Deck Today',
    description:
      'Create professional decks quickly, securely, and with full control. No signup required.',
    buttonText: 'Create Deck',
    buttonHref: '/app',
  },
  footer: {
    name: 'Pitch Deck Generator',
  },
};

const HomePage: NextPage = () => {
  return <LandingTemplate content={content} />;
};

export default HomePage;
