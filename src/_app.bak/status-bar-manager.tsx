"use client";

import { useEffect } from 'react';
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

const StatusBarManager = () => {
  useEffect(() => {
    const setupStatusBar = async () => {
      // Run only in a native environment (Capacitor)
      if (Capacitor.isNativePlatform()) {
        try {
          // Force the webview to be under the status bar (overlay mode)
          await StatusBar.setOverlaysWebView({ overlay: true });
          console.log('StatusBar overlay forced via plugin');

          // Get the status bar height from the native system
          const info = await StatusBar.getInfo();
          const statusBarHeight = info.statusBarHeight;
          console.log(`Status bar height from plugin: ${statusBarHeight}px`);

          // Inject the height as a CSS variable on the root element
          if (statusBarHeight > 0) {
            document.documentElement.style.setProperty(
              '--status-bar-height',
              `${statusBarHeight}px`
            );
            console.log(`CSS variable --status-bar-height set to ${statusBarHeight}px`);
          }

        } catch (error) {
          console.error('Failed to configure StatusBar via plugin', error);
        }
      }
    };

    setupStatusBar();
  }, []);

  return null; // This component renders nothing
};

export default StatusBarManager;
