# Art Portfolio TODO

## Core Features
- [x] Instagram feed integration (@__benjaminthomas)
- [x] Gallery page with grid layout
- [x] Individual artwork detail pages with high-res images
- [x] About/bio section
- [x] Contact form for inquiries and commissions
- [x] Print inquiry system (contact form based)
- [x] Social media links section
- [x] Responsive mobile-first design

## Backend Infrastructure
- [x] Database schema for artworks, inquiries, and artist info
- [x] tRPC procedures for artwork management
- [x] tRPC procedures for contact/inquiry forms
- [x] Instagram API integration research and implementation
- [x] Image storage setup with S3

## Frontend Pages & Components
- [x] Homepage with hero and featured works
- [x] Gallery page with filterable grid
- [x] Individual artwork detail pages with high-res images
- [x] About page
- [x] Contact page
- [x] Navigation component
- [x] Footer with social links
- [ ] Instagram feed component (using manual upload approach)
- [x] Print inquiry form component

## Design & Styling
- [x] Minimalist color palette and typography
- [x] Clean layout system
- [x] Image optimization and lazy loading
- [x] Smooth transitions and animations
- [x] Mobile responsive breakpoints

## Testing & Deployment
- [x] Test all forms and submissions
- [x] Test Instagram integration
- [x] Test responsive design on mobile
- [x] Create vitest tests for backend procedures
- [x] Final checkpoint for deployment

## Content Updates
- [x] Update hero tagline to "Contemporary artist exploring themes of idea, imagination and revival"
- [x] Update About page bio with custom artist text

## Shop Feature
- [x] Add price and forSale fields to artworks schema
- [x] Add PayPal integration fields to database
- [x] Create Shop page component
- [x] Add Shop navigation link between Gallery and About
- [x] Implement PayPal buy button functionality
- [x] Test shop and payment flow

## Profile Photo
- [x] Upload profile photo to S3 storage
- [x] Update artist_info database with profile photo URL
- [x] Adjust profile photo size (25% smaller), add black border, and round corners

## Artwork Upload
- [x] Upload "The Subject of Paint" images to S3
- [x] Add artwork entry to database with all details
- [x] Verify artwork appears in gallery and homepage
- [x] Upload "I saw the whole thing" artwork to gallery
- [x] Upload "Chrysalis I & II" artwork to gallery
- [x] Add hero background image using The Subject of Paint diptych
- [x] Increase hero background image opacity to 30%
- [x] Increase hero background image opacity to 45%
- [x] Add subtle zoom-in hover effect to hero background image
- [x] Update homepage tagline to "Ideas; imagination; revival"
- [x] Download "Delphium" from Instagram
- [x] Download "Tiefenschwarz" from Instagram
- [x] Upload and add both artworks to gallery
- [x] Download and add artwork from https://www.instagram.com/p/DKZUEFeMQC8/
- [x] Update Shop section text to "High-quality prints available to purchase"
- [x] Add hero image to Shop section

- [x] Create print catalog structure with database and Shop page layout
- [x] Add first print product "The Subject of Paint" with Order button
- [x] Add material and size dropdown selectors to print catalog (Giclée, PVC board, Canvas inkjet; 80x60cm, 100x120cm)
- [x] Add WhatsApp (+44 7597765530) and email (info@benjaminthomas.art) contact options to Contact page
- [x] Add dynamic pricing display to Shop page (80x60cm: £150, 120x100cm: £225)
- [x] Update size option from 100x120cm to 120x100cm
- [x] Update homepage tagline to "Fine art & prints"
- [x] Update Shop page hero background with new print photo
- [x] Add "Portmanteau" print to Shop catalog with same pricing structure
- [x] Add "One way or another" print to Shop catalog with same pricing structure
- [x] Update Shop page subtitle copy to mention materials, sizes, and custom orders
- [x] Add "Tiefenschwartz" diptych to Shop catalog with same pricing structure
- [x] Update pricing display to show "per piece" for clarity
- [x] Add comprehensive FAQ section to About page
- [x] Add image carousel to Chrysalis I & II gallery page
- [x] Add Candyflip diptych print to Shop catalog
- [x] Implement click-to-zoom functionality on Gallery and Shop images
- [x] Add click-to-zoom functionality to carousel images on artwork detail pages
- [x] Add keyboard navigation (left/right arrow keys) to carousels
- [x] Add single quotation marks around all artwork titles throughout the site
- [x] Add single quotation marks to print titles on Shop page
- [x] Implement lazy loading for all images to improve initial page load performance
- [x] Preload hero background image on homepage for immediate loading
- [x] Add 'Chrysalis' as second featured artwork on homepage
- [x] Update 'View Gallery' button to match 'Follow on Instagram' button style (outline variant)
- [x] Update Gallery page subtitle to 'Explore more works'
- [x] Add carousel with two additional images to 'The Subject of Paint' artwork
- [x] Add carousel to Gallery page grid for 'The Subject of Paint' with all three images
- [x] Fix third image not showing in Subject of Paint carousel (still not working)
- [x] Add 3-image carousel to Tiefenschwarz artwork with two detail shots
- [x] Fix Tiefenschwarz diptych image (both paintings together) not showing in carousel
- [x] Adjust 'I saw the whole thing' image aspect ratio in Gallery to match compact horizontal format of carousel artworks
- [x] Add Chrysalis diptych image (both paintings together) as first image in Chrysalis carousel on Gallery page
- [x] Adjust diptych images (Tiefenschwarz, Candyflip, Chrysalis) in Gallery to show full width without cropping
- [x] Fix missing images in Chrysalis carousel on Gallery page
- [x] Migrate all remaining old CloudFront CDN URLs to new CDN to prevent 403 errors
- [x] Add studio photo as background image to Contact page
- [x] Adjust Contact page background to be more visible (reposition to top, increase opacity)
- [x] Reposition Contact page background to show artist's face
- [x] Center artist's face in Contact page background
- [x] Fine-tune Contact page background to perfectly center artist's face
- [x] Move Contact page background to right for mobile face visibility
- [x] Replace Contact page background with new studio photo
- [x] Move Contact page background 25% to the right
- [x] Adjust Contact page background to make face visible again
- [x] Optimize Contact page background for mobile to match desktop face visibility
- [x] Fix Gallery carousels not working on mobile devices
- [x] Implement touch swipe gestures for Gallery carousel navigation
- [x] Reduce spacing between Gallery images and titles by 50%
- [x] Change grey background boxes around Gallery images to white
- [x] Change carousel dot indicators from white to grey for visibility
- [x] Implement scroll-to-top behavior when navigating between pages
- [x] Reduce text size under Shop headline and increase horizontal padding by 25%
- [x] Fix Portmanteau and One way or another images to show full paintings without cropping
- [x] Add subtle border to Shop page print containers
- [x] Add light grey border to Gallery artwork containers for consistency
- [x] Make image hover zoom effect more gentle with slower transition
- [x] Fix buggy close function when clicking on images
- [x] Reduce FAQ answer text size by 25% and add accordion open/close functionality
- [x] Remove return policy question from FAQ and replace 'we' with 'I' in all answers
- [x] Update homepage text to 'Interested in a print?' with lowercase 'p'
- [x] Implement availability badges on Gallery items showing 'Available' or 'Sold' status
- [x] Change 'Benjamin Thomas' text color to Prussian blue on homepage and navigation
- [x] Add FAQ about creative process
- [x] Change 'Fine art & prints' text to deep maroon color
- [x] Add classic gallery-style red dots to sold artworks on Gallery page
- [x] Move red dot to appear next to artwork title instead of on image
- [x] Update sold status: remove from Delphium, ensure on Candy Flip and Chrysalis 1 & 2
- [x] Add red dot to 'Chrysalis I & II' artwork
- [x] Reorder Gallery to place Candyflip above Tiefenschwarz
- [x] Implement drag-and-drop interface for reordering artworks in Gallery
- [x] Change 'Fine art & prints' text to lighter pink color
