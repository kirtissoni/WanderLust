import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useAnimation, useTransform } from 'framer-motion';

const REVIEWS = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      review: "Absolutely stunning villa in Bali! The host was incredibly welcoming and the photos don't do it justice. Will definitely book again!",
      avatar: "https://i.pravatar.cc/150?img=1",
      propertyImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
    },
    {
      name: "Rahul Sharma",
      location: "Mumbai, India",
      rating: 5,
      review: "Perfect mountain retreat in Manali. Clean, cozy, and exactly as described. The sunrise views were breathtaking!",
      avatar: "https://i.pravatar.cc/150?img=12",
      propertyImage: "https://images.unsplash.com/photo-1506781961370-37a89d6b3095?w=400&h=300&fit=crop"
    },
    {
      name: "Emma Wilson",
      location: "London, UK",
      rating: 5,
      review: "Best Airbnb experience ever! The beachfront cottage in Goa exceeded all expectations. Host communication was excellent.",
      avatar: "https://i.pravatar.cc/150?img=5",
      propertyImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop"
    },
    {
      name: "Carlos Rodriguez",
      location: "Barcelona, Spain",
      rating: 5,
      review: "Luxurious apartment in the heart of Paris. Everything was perfect - location, amenities, and hospitality. Highly recommend!",
      avatar: "https://i.pravatar.cc/150?img=8",
      propertyImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"
    },
    {
      name: "Priya Patel",
      location: "Delhi, India",
      rating: 5,
      review: "The Kerala houseboat was a dream come true! Peaceful, beautiful, and the host made sure we had everything we needed.",
      avatar: "https://i.pravatar.cc/150?img=9",
      propertyImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop"
    },
    {
      name: "Michael Chen",
      location: "Singapore",
      rating: 5,
      review: "Tokyo apartment was spotless and perfectly located. Easy check-in process and great value for money. Would stay again!",
      avatar: "https://i.pravatar.cc/150?img=13",
      propertyImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"
    },
    {
      name: "Sophie Martin",
      location: "Paris, France",
      rating: 5,
      review: "Charming countryside cottage in Tuscany. The vineyard views and authentic Italian hospitality made our trip unforgettable!",
      avatar: "https://i.pravatar.cc/150?img=10",
      propertyImage: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=300&fit=crop"
    },
    {
      name: "David Kim",
      location: "Seoul, Korea",
      rating: 5,
      review: "Modern loft in Dubai with stunning views. Super clean, well-equipped kitchen, and the rooftop pool was amazing!",
      avatar: "https://i.pravatar.cc/150?img=14",
      propertyImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"
    }
  ];
const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-10 h-[250px] flex flex-col justify-between border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={review.avatar} 
            alt={review.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold text-gray-900">{review.name}</h4>
            <p className="text-sm text-gray-500">{review.location}</p>
          </div>
        </div>
        
        <div className="flex gap-1 mb-3">
          {[...Array(review.rating)].map((_, i) => (
            <svg key={i} className="w-5 h-5 fill-[#FF385C]" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
          ))}
        </div>
        
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
          "{review.review}"
        </p>
      </div>
      
      
    </div>
  );
};

const Reviews = ({ autoplay = true, pauseOnHover = true }) => {
  const [isScreenSizeSm, setIsScreenSizeSm] = useState(window.innerWidth <= 640);
  
  useEffect(() => {
    const handleResize = () => setIsScreenSizeSm(window.innerWidth <= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Adjusted cylinder width and card spacing
  const cylinderWidth = isScreenSizeSm ? 1400 : 2200; // Increased width
  const faceCount = REVIEWS.length;
  const cardWidth = isScreenSizeSm ? 280 : 320; // Fixed card width
  const spacing = isScreenSizeSm ? 30 : 50; // Space between cards
  const faceWidth = cardWidth + spacing; // Include spacing in face width
  const radius = cylinderWidth / (2 * Math.PI);

  const dragFactor = 0.05;
  const rotation = useMotionValue(0);
  const controls = useAnimation();

  const transform = useTransform(rotation, val => `rotate3d(0,1,0,${val}deg)`);

  const startInfiniteSpin = startAngle => {
    controls.start({
      rotateY: [startAngle, startAngle - 360],
      transition: {
        duration: 40,
        ease: 'linear',
        repeat: Infinity
      }
    });
  };

  useEffect(() => {
    if (autoplay) {
      const currentAngle = rotation.get();
      startInfiniteSpin(currentAngle);
    } else {
      controls.stop();
    }
  }, [autoplay]);

  const handleUpdate = latest => {
    if (typeof latest.rotateY === 'number') {
      rotation.set(latest.rotateY);
    }
  };

  const handleDrag = (_, info) => {
    controls.stop();
    rotation.set(rotation.get() + info.offset.x * dragFactor);
  };

  const handleDragEnd = (_, info) => {
    const finalAngle = rotation.get() + info.velocity.x * dragFactor;
    rotation.set(finalAngle);

    if (autoplay) {
      startInfiniteSpin(finalAngle);
    }
  };

  const handleMouseEnter = () => {
    if (autoplay && pauseOnHover) {
      controls.stop();
    }
  };
  
  const handleMouseLeave = () => {
    if (autoplay && pauseOnHover) {
      const currentAngle = rotation.get();
      startInfiniteSpin(currentAngle);
    }
  };

  return (
    <div className="w-full bg-gray-50 py-20">
      <div className="max-w-[1440px] mx-auto px-10 sm:px-16 lg:px-20 mb-12">
        <div className="text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Loved by{" "}
            <span className="text-[#FF385C] relative inline-block">
              travelers worldwide
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5.5C50 2.5 150 2.5 199 5.5" stroke="#FF385C" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mt-6">
            Join millions of happy travelers who found their perfect stay with Wanderlust
          </p>
        </div>
      </div>

      <div className="relative h-[400px] w-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full w-[100px] z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, rgba(249,250,251,0) 0%, rgb(249,250,251) 100%)'
          }}
        />
        <div
          className="absolute top-0 right-0 h-full w-[100px] z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(249,250,251,0) 0%, rgb(249,250,251) 100%)'
          }}
        />

        <div className="flex h-full items-center justify-center" style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
          <motion.div
            drag="x"
            dragElastic={0}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            animate={controls}
            onUpdate={handleUpdate}
            style={{
              transform: transform,
              rotateY: rotation,
              width: cylinderWidth,
              transformStyle: 'preserve-3d'
            }}
            className="flex min-h-[280px] cursor-grab active:cursor-grabbing items-center justify-center"
          >
            {REVIEWS.map((review, i) => (
              <div
                key={i}
                className="absolute flex items-center justify-center p-4"
                style={{
                  width: `${faceWidth}px`, // Updated to include spacing
                  transform: `rotateY(${(360 / faceCount) * i}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'hidden'
                }}
              >
                <div className="w-full flex justify-center">
                  <div style={{ width: `${cardWidth}px` }}> {/* Fixed card width container */}
                    <ReviewCard review={review} />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;