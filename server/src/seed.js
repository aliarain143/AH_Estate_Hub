import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Property from './models/Property.js';

dotenv.config();

// Agar .env na mile toh default local MongoDB connection use ho ga
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/estatehub';

const runSeed = async () => {
  try {
    console.log('Connecting to MongoDB at:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected successfully!');

    let agent = await User.findOne({ email: 'agent@estatehub.demo' });
    if (!agent) {
      agent = await User.create({ 
        name: 'EstateHub Agent', 
        email: 'agent@estatehub.demo', 
        password: await bcrypt.hash('Demo123!', 12), 
        role: 'agent' 
      });
    }

    await Property.deleteMany({ owner: agent._id });

    await Property.insertMany([
      { 
        title: 'Contemporary family home', 
        description: 'A bright and welcoming family home with generous living spaces, a practical layout and a peaceful neighborhood setting.', 
        price: 42500000, 
        type: 'House', 
        listingType: 'Sale', 
        city: 'Karachi', 
        address: 'DHA Phase 6', 
        area: 240, 
        areaUnit: 'sqyd', 
        bedrooms: 4, 
        bathrooms: 4, 
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200'], 
        coordinates: { lat: 24.8105, lng: 67.0531 }, 
        features: ['Parking','Garden','Modern kitchen'], 
        status: 'approved', 
        owner: agent._id 
      },
      { 
        title: 'Calm, sunlit apartment', 
        description: 'A well-planned apartment with natural light, comfortable bedrooms and convenient access to local amenities.', 
        price: 18500000, 
        type: 'Apartment', 
        listingType: 'Sale', 
        city: 'Karachi', 
        address: 'Clifton Block 8', 
        area: 1450, 
        areaUnit: 'sqft', 
        bedrooms: 3, 
        bathrooms: 3, 
        images: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200'], 
        coordinates: { lat: 24.8138, lng: 67.0305 }, 
        features: ['Lift','Security','Balcony'], 
        status: 'approved', 
        owner: agent._id 
      },
      { 
        title: 'Residential plot in a quiet area', 
        description: 'A residential plot suitable for a thoughtfully designed home, located close to everyday facilities.', 
        price: 9800000, 
        type: 'Plot', 
        listingType: 'Sale', 
        city: 'Karachi', 
        address: 'Scheme 33', 
        area: 200, 
        areaUnit: 'sqyd', 
        bedrooms: 0, 
        bathrooms: 0, 
        images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200'], 
        coordinates: { lat: 24.9415, lng: 67.1352 }, 
        features: ['Road access','Residential zone'], 
        status: 'approved', 
        owner: agent._id 
      },
      { 
        title: 'Luxury Corner Villa with Swimming Pool', 
        description: 'Ultra-modern architectural design featuring basement, swimming pool, and lawn area.', 
        price: 95000000, 
        type: 'House', 
        listingType: 'Sale', 
        city: 'Karachi', 
        address: 'DHA Phase 8', 
        area: 500, 
        areaUnit: 'sqyd', 
        bedrooms: 6, 
        bathrooms: 7, 
        images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200'], 
        coordinates: { lat: 24.7900, lng: 67.0700 }, 
        features: ['Swimming Pool', 'Basement', 'Lawn'], 
        status: 'approved', 
        owner: agent._id 
      },
      { 
        title: 'Executive 2-Bed Luxury Apartment', 
        description: 'Prime location apartment right next to main commercial area with dedicated car parking.', 
        price: 13500000, 
        type: 'Apartment', 
        listingType: 'Sale', 
        city: 'Karachi', 
        address: 'Gulshan-e-Iqbal Block 13D', 
        area: 1100, 
        areaUnit: 'sqft', 
        bedrooms: 2, 
        bathrooms: 2, 
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200'], 
        coordinates: { lat: 24.9180, lng: 67.0970 }, 
        features: ['Standby Generator', 'Covered Parking'], 
        status: 'approved', 
        owner: agent._id 
      },
      { 
        title: 'Prime Commercial Plot for Project', 
        description: 'Corner commercial plot with double road access, approved for multi-story construction.', 
        price: 65000000, 
        type: 'Plot', 
        listingType: 'Sale', 
        city: 'Karachi', 
        address: 'Bahria Town Precinct 1', 
        area: 400, 
        areaUnit: 'sqyd', 
        bedrooms: 0, 
        bathrooms: 0, 
        images: ['https://picsum.photos/id/1040/800/600'], 
        coordinates: { lat: 25.0100, lng: 67.3100 }, 
        features: ['Main Boulevard', 'Corner Plot'], 
        status: 'approved', 
        owner: agent._id 
      },
      { 
        title: 'Renovated Single Story House', 
        description: 'Cozy, newly renovated single-story bungalow with sweet water connection and wide front street.', 
        price: 22000000, 
        type: 'House', 
        listingType: 'Sale', 
        city: 'Karachi', 
        address: 'Federal B Area Block 14', 
        area: 160, 
        areaUnit: 'sqyd', 
        bedrooms: 3, 
        bathrooms: 3, 
        images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200'], 
        coordinates: { lat: 24.9280, lng: 67.0670 }, 
        features: ['Gas Connection', 'Car Porch'], 
        status: 'approved', 
        owner: agent._id 
      },
      { 
        title: 'Fully Furnished Sea-Facing Penthouse', 
        description: 'Exclusive top-floor penthouse with private terrace view of Clifton beach.', 
        price: 150000, 
        type: 'Apartment', 
        listingType: 'Rent', 
        city: 'Karachi', 
        address: 'Sea View Clifton', 
        area: 2800, 
        areaUnit: 'sqft', 
        bedrooms: 4, 
        bathrooms: 4, 
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200'], 
        coordinates: { lat: 24.8020, lng: 67.0250 }, 
        features: ['Furnished', 'Sea View', 'Private Terrace'], 
        status: 'approved', 
        owner: agent._id 
      },
      { 
        title: 'Industrial Land Plot for Warehouse', 
        description: 'Heavy industrial plot suitable for manufacturing, chemical units, or storage facility.', 
        price: 52000000, 
        type: 'Plot', 
        listingType: 'Sale', 
        city: 'Karachi', 
        address: 'Korangi Industrial Area', 
        area: 1000, 
        areaUnit: 'sqyd', 
        bedrooms: 0, 
        bathrooms: 0, 
        images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200'], 
        coordinates: { lat: 24.8400, lng: 67.1100 }, 
        features: ['Industrial Zone', 'Heavy Transport Access'], 
        status: 'approved', 
        owner: agent._id 
      },
      { 
        title: 'Spacious 3-Bed Rental Upper Portion', 
        description: 'Independent upper portion with separate entry, wide balcony, and parking space for 2 cars.', 
        price: 65000, 
        type: 'House', 
        listingType: 'Rent', 
        city: 'Karachi', 
        address: 'PECHS Block 6', 
        area: 240, 
        areaUnit: 'sqyd', 
        bedrooms: 3, 
        bathrooms: 3, 
        images: ['https://images.unsplash.com/photo-1598228723793-52759bba239c?w=1200'], 
        coordinates: { lat: 24.8620, lng: 67.0710 }, 
        features: ['Separate Entry', 'Balcony', 'Covered Parking'], 
        status: 'approved', 
        owner: agent._id 
      }
    ]);

    console.log('✅ Demo properties added. Agent login: agent@estatehub.demo / Demo123!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error seeding DB:', error);
    await mongoose.disconnect();
  }
};

runSeed();