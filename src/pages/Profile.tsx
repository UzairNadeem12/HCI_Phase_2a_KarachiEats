import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Edit2, Save, LogIn, History } from 'lucide-react';
import { toast } from 'sonner';
import { getUserData, updateProfile } from '@/services/appsScript';
import { useTranslation } from '@/hooks/useTranslation';

const Profile = () => {
  const navigate = useNavigate();
  const { settings, location, isLoggedIn, userInfo, setUserInfo } = useApp();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: 'Guest User',
    email: 'guest@karachieats.com',
    phone: '0300-1234567',
    locations: [],
  });

  const isLargeText = settings.largeText;

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        if (userInfo?.email) {
          const result = await getUserData(userInfo.email);

          if (result.success) {
            // Backend returns data at root level, not in .data property
            const data = result as any;
            setUserData({
              name: data.name,
              email: data.email,
              phone: data.phone,
              locations: data.locations || [],
            });
          } else {
            toast.error(result.error || 'Failed to fetch user data');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to fetch user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userInfo?.email]);

  const handleSave = async () => {
    if (!userInfo?.email) {
      toast.error('Email not found');
      return;
    }

    try {
      console.log('Updating profile:', { email: userInfo.email, name: userData.name, phone: userData.phone });
      const result = await updateProfile(userInfo.email, userData.name, userData.phone);
      
      console.log('Update profile result:', result);
      
      if (result.success) {
        // Update context
        setUserInfo({
          ...userInfo,
          name: userData.name,
          phone: userData.phone,
        });
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className={`font-bold ${isLargeText ? 'text-4xl' : 'text-3xl'} mb-6`}>
          Profile
        </h1>

        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className={`${isLargeText ? 'w-28 h-28' : 'w-24 h-24'} mb-4`}>
              <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                <User className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>
            <h2 className={`font-bold ${isLargeText ? 'text-3xl' : 'text-2xl'} mb-2`}>
              {userData.name}
            </h2>
            <p className={`text-muted-foreground ${isLargeText ? 'text-lg' : ''}`}>
              {isLoggedIn ? 'Registered Account' : 'Guest Account'}
            </p>
          </div>

          {isLoggedIn && (
            <Button
              variant="outline"
              className="w-full"
              size={isLargeText ? 'lg' : 'default'}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Save className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'} mr-2`} />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit2 className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'} mr-2`} />
                  Edit Profile
                </>
              )}
            </Button>
          )}
        </Card>

        {/* Profile Information */}
        <Card className="p-6 mb-6">
          <h3 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-4`}>
            Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className={`flex items-center gap-2 mb-2 ${isLargeText ? 'text-lg' : ''}`}>
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <p className={`text-muted-foreground ${isLargeText ? 'text-lg' : ''} pl-6`}>
                {userData.email}
              </p>
            </div>

            <div>
              <Label htmlFor="name" className={`flex items-center gap-2 mb-2 ${isLargeText ? 'text-lg' : ''}`}>
                <User className="w-4 h-4" />
                Name
              </Label>
              {isEditing && isLoggedIn ? (
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className={isLargeText ? 'h-14 text-lg' : 'h-12'}
                />
              ) : (
                <p className={`text-muted-foreground ${isLargeText ? 'text-lg' : ''} pl-6`}>
                  {userData.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className={`flex items-center gap-2 mb-2 ${isLargeText ? 'text-lg' : ''}`}>
                <Phone className="w-4 h-4" />
                Phone
              </Label>
              {isEditing && isLoggedIn ? (
                <Input
                  id="phone"
                  value={userData.phone}
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  className={isLargeText ? 'h-14 text-lg' : 'h-12'}
                />
              ) : (
                <p className={`text-muted-foreground ${isLargeText ? 'text-lg' : ''} pl-6`}>
                  {userData.phone}
                </p>
              )}
            </div>

            <div>
              <Label className={`flex items-center gap-2 mb-2 ${isLargeText ? 'text-lg' : ''}`}>
                <MapPin className="w-4 h-4" />
                Default Location
              </Label>
              <p className={`text-muted-foreground ${isLargeText ? 'text-lg' : ''} pl-6`}>{location}</p>
            </div>

            {userData.locations && userData.locations.length > 0 && (
              <div>
                <Label className={`flex items-center gap-2 mb-2 ${isLargeText ? 'text-lg' : ''}`}>
                  <MapPin className="w-4 h-4" />
                  Saved Locations
                </Label>
                <div className="pl-6 space-y-1">
                  {userData.locations.map((loc, idx) => (
                    <p key={idx} className={`text-muted-foreground ${isLargeText ? 'text-base' : 'text-sm'}`}>
                      • {loc}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {isEditing && isLoggedIn && (
            <Button onClick={handleSave} className="w-full mt-6" size={isLargeText ? 'lg' : 'default'}>
              Save Changes
            </Button>
          )}
        </Card>

        {/* Account Actions */}
        <Card className="p-6">
          <h3 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-4`}>
            Account
          </h3>
          <div className="space-y-3">
            {!isLoggedIn && (
              <Button
                variant="outline"
                className="w-full justify-start flex items-center gap-2"
                size={isLargeText ? 'lg' : 'default'}
                onClick={() => navigate('/auth')}
              >
                <LogIn className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'}`} />
                Login / Sign Up
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full justify-start flex items-center gap-2"
              size={isLargeText ? 'lg' : 'default'}
              onClick={() => navigate('/order-history')}
            >
              <History className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'}`} />
              View Order History
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
