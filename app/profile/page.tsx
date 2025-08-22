"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Camera,
  Heart,
  Star,
  Users,
  Trophy
} from "lucide-react";
import Image from "next/image";

// Mock user data
const userData = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  phone: "+234 801 234 5678",
  location: "Lagos, Nigeria",
  joinDate: "March 2024",
  bio: "Music lover and party enthusiast. Always looking for the next great rave experience!",
  avatar: "/api/placeholder/150/150",
  stats: {
    eventsAttended: 12,
    wishlistItems: 8,
    reviews: 5,
    avgRating: 4.8,
  },
  interests: ["Afrobeats", "Hip Hop", "Electronic", "Amapiano", "R&B"],
  recentEvents: [
    {
      id: "1",
      name: "Midnight Groove",
      date: "Nov 28, 2024",
      rating: 5,
    },
    {
      id: "2", 
      name: "Electronic Pulse",
      date: "Nov 15, 2024",
      rating: 4,
    },
    {
      id: "3",
      name: "Gospel Praise Night", 
      date: "Oct 20, 2024",
      rating: 5,
    },
  ],
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    bio: userData.bio,
    location: userData.location,
  });

  const handleSave = () => {
    // Here you would typically make an API call to update the profile
    console.log("Saving profile:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: userData.name,
      bio: userData.bio,
      location: userData.location,
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mx-auto">
                    <Image
                      src={userData.avatar}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-[#D72638] text-white rounded-full hover:bg-[#B91E2F] transition-colors touch-manipulation">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="text-center font-semibold"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{userData.name}</h2>
                    <p className="text-gray-600 text-sm mb-4">Member since {userData.joinDate}</p>
                  </div>
                )}

                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{userData.phone}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {isEditing ? (
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="h-6 text-center text-sm"
                      />
                    ) : (
                      <span>{userData.location}</span>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex-1 bg-[#D72638] hover:bg-[#B91E2F]">
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    variant="outline" 
                    className="w-full"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Activity Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#D72638]" />
                    <span className="text-sm">Events Attended</span>
                  </div>
                  <span className="font-semibold">{userData.stats.eventsAttended}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#D72638]" />
                    <span className="text-sm">Wishlist Items</span>
                  </div>
                  <span className="font-semibold">{userData.stats.wishlistItems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#D72638]" />
                    <span className="text-sm">Reviews Written</span>
                  </div>
                  <span className="font-semibold">{userData.stats.reviews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#D72638]" />
                    <span className="text-sm">Avg Rating</span>
                  </div>
                  <span className="font-semibold">{userData.stats.avgRating}/5</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About Me</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="resize-none"
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {userData.bio || "No bio added yet."}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Music Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userData.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="bg-[#D72638]/10 text-[#D72638]">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userData.recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{event.name}</h4>
                        <p className="text-sm text-gray-600">{event.date}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < event.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}