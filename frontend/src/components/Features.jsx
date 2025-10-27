import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
  IconHome,
  IconShieldCheck,
  IconUsers,
  IconWorld,
  IconCalendarEvent,
  IconStar,
  IconHeart,
} from "@tabler/icons-react";

export function Features() {
  return (
    <div className="w-full bg-white py-20">
      <div className="max-w-[1440px] mx-auto px-10 sm:px-16 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Your journey starts with{" "}
            <span className="text-[#FF385C] relative inline-block">
              Wanderlust
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5.5C50 2.5 150 2.5 199 5.5" stroke="#FF385C" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover unique homes and experiences around the world, with the trust and quality you deserve
          </p>
        </div>
        
        <BentoGrid className="max-w-[1440px] mx-auto gap-4">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
}

const FeatureImage = ({ imageUrl, alt }) => (
  <div className="flex flex-1 w-full h-full min-h-[200px] rounded-xl overflow-hidden relative group">
    <img 
      src={imageUrl} 
      alt={alt}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
  </div>
);

const items = [
  {
    title: "Unique stays",
    description: "From cozy cottages to luxurious villas, find spaces that feel like home.",
    header: <FeatureImage 
      imageUrl="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop" 
      alt="Modern luxury home interior"
    />,
    icon: <IconHome className="h-5 w-5 text-[#FF385C]" />,
  },
  {
    title: "Trust and safety",
    description: "Every listing is verified. Book with confidence knowing you're protected.",
    header: <FeatureImage 
      imageUrl="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop" 
      alt="Secure and verified properties"
    />,
    icon: <IconShieldCheck className="h-5 w-5 text-[#FF385C]" />,
  },
  {
    title: "Guest favorites",
    description: "Explore the most loved homes by travelers worldwide with real reviews.",
    header: <FeatureImage 
      imageUrl="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop" 
      alt="Beautiful vacation home"
    />,
    icon: <IconStar className="h-5 w-5 text-[#FF385C]" />,
  },
  {
    title: "Plan together, travel together",
    description: "Share wishlists with friends and family, message hosts as a group, and send trip invitations. Make group travel planning seamless.",
    header: <FeatureImage 
      imageUrl="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1600&h=600&fit=crop" 
      alt="Group travel planning"
    />,
    icon: <IconUsers className="h-5 w-5 text-[#FF385C]" />,
  },
  {
    title: "Flexible booking",
    description: "Instant booking available with flexible cancellation policies for peace of mind.",
    header: <FeatureImage 
      imageUrl="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop" 
      alt="Easy booking process"
    />,
    icon: <IconCalendarEvent className="h-5 w-5 text-[#FF385C]" />,
  },
  {
    title: "Wishlist magic",
    description: "Save your favorite places and create collections for different trips.",
    header: <FeatureImage 
      imageUrl="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop" 
      alt="Dream destinations"
    />,
    icon: <IconHeart className="h-5 w-5 text-[#FF385C]" />,
  },
  {
    title: "Explore the world",
    description: "Over 7 million listings across 220+ countries. From bustling cities to peaceful nature retreats, find your perfect destination.",
    header: <FeatureImage 
      imageUrl="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&h=600&fit=crop" 
      alt="Global destinations"
    />,
    icon: <IconWorld className="h-5 w-5 text-[#FF385C]" />,
  },
];