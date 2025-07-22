const https = require('https');
const fs = require('fs');
const path = require('path');

// Download African destination hero images to public folder
async function downloadHeroImages() {
  console.log('🌍 Downloading African destination hero images...');
  
  const publicDir = './public';
  const heroImagesDir = path.join(publicDir, 'images', 'destinations');
  
  // Create directories if they don't exist
  if (!fs.existsSync(path.join(publicDir, 'images'))) {
    fs.mkdirSync(path.join(publicDir, 'images'));
  }
  if (!fs.existsSync(heroImagesDir)) {
    fs.mkdirSync(heroImagesDir);
  }

  // High-quality African destination images from Unsplash (1920x1080)
  const heroImages = [
    {
      name: 'serengeti-migration.jpg',
      url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
      destination: 'Serengeti National Park',
      description: 'Wildebeest migration in Serengeti'
    },
    {
      name: 'kilimanjaro-sunrise.jpg',
      url: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
      destination: 'Mount Kilimanjaro',
      description: 'Mount Kilimanjaro at sunrise'
    },
    {
      name: 'victoria-falls.jpg',
      url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
      destination: 'Victoria Falls',
      description: 'Victoria Falls with rainbow mist'
    },
    {
      name: 'zanzibar-beach.jpg',
      url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
      destination: 'Zanzibar',
      description: 'Zanzibar pristine beach with dhow'
    },
    {
      name: 'sossusvlei-dunes.jpg',
      url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
      destination: 'Sossusvlei',
      description: 'Red sand dunes of Sossusvlei'
    },
    {
      name: 'cape-town-table-mountain.jpg',
      url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
      destination: 'Cape Town',
      description: 'Table Mountain and Cape Town skyline'
    },
    {
      name: 'masai-mara-balloon.jpg',
      url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
      destination: 'Masai Mara',
      description: 'Hot air balloon safari over Masai Mara'
    },
    {
      name: 'sahara-desert-morocco.jpg',
      url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
      destination: 'Sahara Desert',
      description: 'Sahara desert dunes with camel caravan'
    },
    {
      name: 'kruger-national-park.jpg',
      url: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
      destination: 'Kruger National Park',
      description: 'African elephant in Kruger National Park'
    },
    {
      name: 'pyramids-giza-egypt.jpg',
      url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
      destination: 'Pyramids of Giza',
      description: 'Great Pyramids of Giza at sunset'
    }
  ];

  const downloadPromises = heroImages.map(async (image, index) => {
    return new Promise((resolve, reject) => {
      const filePath = path.join(heroImagesDir, image.name);
      
      // Skip if file already exists
      if (fs.existsSync(filePath)) {
        console.log(`⏭️  ${image.name} already exists, skipping...`);
        resolve({ success: true, skipped: true, ...image });
        return;
      }

      console.log(`📥 Downloading ${image.name} (${image.destination})...`);
      
      const file = fs.createWriteStream(filePath);
      
      https.get(image.url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download ${image.name}: ${response.statusCode}`));
          return;
        }
        
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log(`✅ ${image.name} downloaded successfully`);
          resolve({ success: true, ...image });
        });
        
        file.on('error', (err) => {
          fs.unlink(filePath, () => {}); // Delete the file on error
          reject(err);
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  });

  try {
    const results = await Promise.allSettled(downloadPromises);
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    console.log('\n🎉 Download Summary:');
    console.log(`✅ Successfully downloaded: ${successful}/${heroImages.length} images`);
    if (failed > 0) {
      console.log(`❌ Failed downloads: ${failed}`);
    }
    
    // Generate image reference guide
    const imageGuide = {
      directory: '/images/destinations/',
      images: heroImages.map(img => ({
        filename: img.name,
        destination: img.destination,
        description: img.description,
        path: `/images/destinations/${img.name}`,
        usage: `<img src="/images/destinations/${img.name}" alt="${img.description}" />`
      }))
    };
    
    const guideFile = path.join(heroImagesDir, 'image-guide.json');
    fs.writeFileSync(guideFile, JSON.stringify(imageGuide, null, 2));
    
    console.log('\n📋 Image Reference Guide:');
    imageGuide.images.forEach(img => {
      console.log(`   ${img.destination}: /images/destinations/${img.filename}`);
    });
    
    console.log(`\n💾 Complete reference guide saved to: ${guideFile}`);
    console.log('\n🚀 You can now use these images in your hero sections!');
    
    return results;
  } catch (error) {
    console.error('💥 Download process failed:', error);
    throw error;
  }
}

// Alternative: High-quality placeholder images if Unsplash doesn't work
function generatePlaceholderImages() {
  console.log('🎨 Generating placeholder hero images...');
  
  const publicDir = './public';
  const heroImagesDir = path.join(publicDir, 'images', 'destinations');
  
  // Create directories
  if (!fs.existsSync(path.join(publicDir, 'images'))) {
    fs.mkdirSync(path.join(publicDir, 'images'));
  }
  if (!fs.existsSync(heroImagesDir)) {
    fs.mkdirSync(heroImagesDir);
  }

  // High-quality placeholder service (1920x1080)
  const placeholderImages = [
    { name: 'serengeti-migration.jpg', id: '1516426122078', color: '8B4513' },
    { name: 'kilimanjaro-sunrise.jpg', id: '1589553416260', color: 'FF6B35' },
    { name: 'victoria-falls.jpg', id: '1544735716392', color: '4682B4' },
    { name: 'zanzibar-beach.jpg', id: '1544551763460', color: '20B2AA' },
    { name: 'sossusvlei-dunes.jpg', id: '1544735716392', color: 'CD853F' },
    { name: 'cape-town-table-mountain.jpg', id: '1580060839134', color: '708090' },
    { name: 'masai-mara-balloon.jpg', id: '1516426122078', color: 'DAA520' },
    { name: 'sahara-desert-morocco.jpg', id: '1539650116574', color: 'F4A460' },
    { name: 'kruger-national-park.jpg', id: '1551632436', color: '228B22' },
    { name: 'pyramids-giza-egypt.jpg', id: '1539650116574', color: 'DEB887' }
  ];

  placeholderImages.forEach(img => {
    const url = `https://picsum.photos/1920/1080?random=${img.id}`;
    console.log(`📷 ${img.name}: ${url}`);
  });

  console.log('\n💡 Use these Picsum URLs as fallbacks if needed');
}

// Run the download
console.log('🌍 African Destination Hero Images Downloader');
console.log('============================================');

downloadHeroImages()
  .then(() => {
    console.log('\n🏁 All hero images ready for use!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Download failed:', error.message);
    console.log('\n🎨 Generating placeholder alternatives...');
    generatePlaceholderImages();
    process.exit(1);
  });
