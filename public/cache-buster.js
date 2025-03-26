// Cache buster - forces browsers to reload assets
(function() {
  // Create a random version query parameter for all assets
  const cacheBuster = Math.floor(Math.random() * 1000000);
  
  // Force reload ALL favicon variants
  const faviconLinks = [
    {rel: 'icon', href: '/lgsol.png?v=' + cacheBuster, type: 'image/png'},
    {rel: 'shortcut icon', href: '/lgsol.png?v=' + cacheBuster, type: 'image/png'},
    {rel: 'apple-touch-icon', href: '/lgsol.png?v=' + cacheBuster, type: 'image/png'},
    {rel: 'icon', href: '/images/lgsol.png?v=' + cacheBuster, type: 'image/png'},
    {rel: 'shortcut icon', href: '/images/lgsol.png?v=' + cacheBuster, type: 'image/png'},
    {rel: 'apple-touch-icon', href: '/images/lgsol.png?v=' + cacheBuster, type: 'image/png'}
  ];
  
  // Replace any existing favicons
  const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
  existingFavicons.forEach(icon => {
    document.head.removeChild(icon);
  });
  
  // Add our new favicons
  faviconLinks.forEach(linkProps => {
    const link = document.createElement('link');
    link.rel = linkProps.rel;
    link.href = linkProps.href;
    link.type = linkProps.type;
    document.head.appendChild(link);
  });
  
  // Force browser to reload favicon by creating a fake favicon error
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const faviconUrl = canvas.toDataURL();
  const errorLink = document.createElement('link');
  errorLink.rel = 'icon';
  errorLink.href = faviconUrl;
  document.head.appendChild(errorLink);
  setTimeout(() => {
    document.head.removeChild(errorLink);
  }, 100);
})(); 