import type { Dimension, StyleConfig } from './types';

export const DIMENSIONS: Dimension[] = [
  // Instagram
  { id: 'instagram-story', label: 'Instagram Story', width: 1080, height: 1920, category: 'Instagram' },
  { id: 'instagram-highlight', label: 'Instagram Highlight', width: 1080, height: 1920, category: 'Instagram' },
  { id: 'instagram-post-square', label: 'Instagram Post (Square)', width: 1080, height: 1080, category: 'Instagram' },
  { id: 'instagram-post-landscape', label: 'Instagram Post (Landscape)', width: 1080, height: 566, category: 'Instagram' },
  { id: 'instagram-post-portrait', label: 'Instagram Post (Portrait)', width: 1080, height: 1350, category: 'Instagram' },
  // Facebook
  { id: 'facebook-story', label: 'Facebook Story', width: 1080, height: 1920, category: 'Facebook' },
  { id: 'facebook-post', label: 'Facebook Post', width: 1200, height: 630, category: 'Facebook' },
  { id: 'facebook-cover', label: 'Facebook Cover Photo', width: 851, height: 315, category: 'Facebook' },
  { id: 'facebook-event-cover', label: 'Facebook Event Cover', width: 1920, height: 1005, category: 'Facebook' },
  // LinkedIn
  { id: 'linkedin-cover', label: 'LinkedIn Cover Photo', width: 1584, height: 396, category: 'LinkedIn' },
  { id: 'linkedin-post', label: 'LinkedIn Post', width: 1200, height: 627, category: 'LinkedIn' },
  { id: 'linkedin-story', label: 'LinkedIn Story', width: 1080, height: 1920, category: 'LinkedIn' },
  // YouTube
  { id: 'youtube-thumbnail', label: 'YouTube Thumbnail', width: 1280, height: 720, category: 'YouTube' },
  { id: 'youtube-banner', label: 'YouTube Channel Banner', width: 2560, height: 1440, category: 'YouTube' },
  // Twitter / X
  { id: 'twitter-post', label: 'Twitter/X Post', width: 1200, height: 675, category: 'Twitter/X' },
  { id: 'twitter-header', label: 'Twitter/X Header', width: 1500, height: 500, category: 'Twitter/X' },
  // TikTok
  { id: 'tiktok-video', label: 'TikTok Video', width: 1080, height: 1920, category: 'TikTok' },
  // Pinterest
  { id: 'pinterest-pin', label: 'Pinterest Pin', width: 1000, height: 1500, category: 'Pinterest' },
  { id: 'pinterest-square', label: 'Pinterest Square', width: 1000, height: 1000, category: 'Pinterest' },
  // Snapchat
  { id: 'snapchat-story', label: 'Snapchat Story', width: 1080, height: 1920, category: 'Snapchat' },
  // Standard print/other
  { id: 'a4-portrait', label: 'A4 Portrait', width: 2480, height: 3508, category: 'Print' },
  { id: 'a4-landscape', label: 'A4 Landscape', width: 3508, height: 2480, category: 'Print' },
  { id: 'square-hd', label: 'Square HD (1:1)', width: 1920, height: 1920, category: 'Other' },
  { id: 'widescreen-hd', label: 'Widescreen HD (16:9)', width: 1920, height: 1080, category: 'Other' },
];

export const STYLE_CONFIGS: StyleConfig[] = [
  {
    id: 'dark',
    label: 'Dark',
    tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    overlayBg: 'rgba(0, 0, 0, 0.75)',
    overlayText: '#ffffff',
    posterBg: '#0a0a0a',
    accentColor: '#4a9eff',
  },
  {
    id: 'light',
    label: 'Light',
    tileUrl: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    overlayBg: 'rgba(255, 255, 255, 0.85)',
    overlayText: '#1a1a1a',
    posterBg: '#f5f5f5',
    accentColor: '#2563eb',
  },
  {
    id: 'classic',
    label: 'Classic',
    tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    overlayBg: 'rgba(245, 230, 200, 0.88)',
    overlayText: '#3d2b1f',
    posterBg: '#e8d5b0',
    accentColor: '#8b4513',
  },
  {
    id: 'modern',
    label: 'Modern',
    tileUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    overlayBg: 'rgba(30, 41, 59, 0.82)',
    overlayText: '#f0f9ff',
    posterBg: '#1e293b',
    accentColor: '#06b6d4',
  },
];
