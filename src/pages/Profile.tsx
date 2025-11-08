import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Edit2, Save } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { userGroup, location } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [guestData, setGuestData] = useState({
    name: 'Guest User',
    email: 'guest@karachieats.com',
    phone: '0300-1234567',
  });

  const isLargeText = userGroup === 'senior' || userGroup === 'disability';
  const isIconFocused = userGroup === 'lowLiteracy';

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className={`font-bold ${isLargeText ? 'text-4xl' : 'text-3xl'} mb-6`}>
          {isIconFocused ? '👤 Profile' : 'Profile'}
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
              {guestData.name}
            </h2>
            <p className={`text-muted-foreground ${isLargeText ? 'text-lg' : ''}`}>Guest Account</p>
          </div>

          <Button
            variant="outline"
            className="w-full"
            size={isLargeText ? 'lg' : 'default'}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <Save className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'} mr-2`} />
                {isIconFocused ? '💾 Save Changes' : 'Save Changes'}
              </>
            ) : (
              <>
                <Edit2 className={`${isLargeText ? 'w-6 h-6' : 'w-5 h-5'} mr-2`} />
                {isIconFocused ? '✏️ Edit Profile' : 'Edit Profile'}
              </>
            )}
          </Button>
        </Card>

        {/* Profile Information */}
        <Card className="p-6 mb-6">
          <h3 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-4`}>
            {isIconFocused ? 'ℹ️ Personal Information' : 'Personal Information'}
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className={`flex items-center gap-2 mb-2 ${isLargeText ? 'text-lg' : ''}`}>
                <User className="w-4 h-4" />
                Name
              </Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={guestData.name}
                  onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                  className={isLargeText ? 'h-14 text-lg' : 'h-12'}
                />
              ) : (
                <p className={`text-muted-foreground ${isLargeText ? 'text-lg' : ''} pl-6`}>
                  {guestData.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className={`flex items-center gap-2 mb-2 ${isLargeText ? 'text-lg' : ''}`}>
                <Mail className="w-4 h-4" />
                Email
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={guestData.email}
                  onChange={(e) => setGuestData({ ...guestData, email: e.target.value })}
                  className={isLargeText ? 'h-14 text-lg' : 'h-12'}
                />
              ) : (
                <p className={`text-muted-foreground ${isLargeText ? 'text-lg' : ''} pl-6`}>
                  {guestData.email}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className={`flex items-center gap-2 mb-2 ${isLargeText ? 'text-lg' : ''}`}>
                <Phone className="w-4 h-4" />
                Phone
              </Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={guestData.phone}
                  onChange={(e) => setGuestData({ ...guestData, phone: e.target.value })}
                  className={isLargeText ? 'h-14 text-lg' : 'h-12'}
                />
              ) : (
                <p className={`text-muted-foreground ${isLargeText ? 'text-lg' : ''} pl-6`}>
                  {guestData.phone}
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
          </div>

          {isEditing && (
            <Button onClick={handleSave} className="w-full mt-6" size={isLargeText ? 'lg' : 'default'}>
              {isIconFocused ? '💾 Save Changes' : 'Save Changes'}
            </Button>
          )}
        </Card>

        {/* Account Actions */}
        <Card className="p-6">
          <h3 className={`font-semibold ${isLargeText ? 'text-2xl' : 'text-xl'} mb-4`}>
            {isIconFocused ? '⚙️ Account' : 'Account'}
          </h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              size={isLargeText ? 'lg' : 'default'}
              onClick={() => navigate('/auth')}
            >
              {isIconFocused ? '🔑 Login / Sign Up' : 'Login / Sign Up'}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              size={isLargeText ? 'lg' : 'default'}
              onClick={() => navigate('/order-history')}
            >
              {isIconFocused ? '📦 Order History' : 'View Order History'}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
