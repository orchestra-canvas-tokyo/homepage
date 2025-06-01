import { browser } from '$app/environment';
import externalIconSvg from '$lib/assets/icons/external-link-icon.svg'; // Path to the SVG

export function externalLink(node: HTMLAnchorElement) {
  const href = node.getAttribute('href');

  if (!href) {
    return;
  }

  // Check if it's an absolute HTTP/S URL
  const isAbsoluteHttpUrl = /^https?:\/\//i.test(href);

  if (isAbsoluteHttpUrl && browser) { // Ensure execution only in browser for window.location
    try {
      const url = new URL(href);
      if (url.origin !== window.location.origin) {
        // External link
        node.target = '_blank';
        node.rel = 'noopener noreferrer';

        // Create and append icon
        const icon = document.createElement('img');
        icon.src = externalIconSvg;
        icon.alt = '外部リンク'; // "External link" in Japanese
        icon.style.display = 'inline-block';
        icon.style.width = '0.8em'; // Relative to parent font size
        icon.style.height = '0.8em'; // Relative to parent font size
        icon.style.marginLeft = '0.25em';
        icon.style.verticalAlign = 'middle';
        // To prevent the icon from shrinking when the link text wraps
        icon.style.flexShrink = '0';


        // Check if the link already contains an icon to avoid duplicates (e.g. for SNS icons)
        // This is a simple check, might need refinement based on actual link content.
        if (!node.querySelector('img')) {
            // Append the icon ensuring text nodes are preserved
            // If the link only contains text, just append.
            // If it contains other elements, try to append it after the last child.
            node.appendChild(icon);
        }
      }
    } catch (e) {
      // Invalid URL, probably not an external link in the way we expect
      console.warn(`Could not parse URL for link: ${href}`, e);
    }
  }

  return {
    // No update or destroy needed for this simple case
  };
}
