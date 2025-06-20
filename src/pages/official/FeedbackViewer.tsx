
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import OfficialNavigation from '@/components/OfficialNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useLocationData } from '@/hooks/useLocationData';

interface Feedback {
  id: string;
  service_type: string;
  title: string;
  feedback_text: string;
  rating: number;
  location_details: string | null;
  district: string | null;
  mandal: string | null;
  village: string | null;
  created_at: string;
}

const FeedbackViewer = () => {
  const { user } = useAuth();
  const { getMandalsByDistrict, getVillagesByMandal, loading: locationLoading } = useLocationData();
  
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedMandal, setSelectedMandal] = useState<string>('');
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');

  // Get available mandals and villages based on official's district
  const availableMandals = user?.district ? getMandalsByDistrict(user.district) : [];
  const availableVillages = user?.district && selectedMandal ? getVillagesByMandal(user.district, selectedMandal) : [];

  useEffect(() => {
    if (user?.district && !locationLoading) {
      fetchFeedbacks();
    }
  }, [user?.district, selectedMandal, selectedVillage, serviceTypeFilter, ratingFilter, locationLoading]);

  const fetchFeedbacks = async () => {
    if (!user?.district) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching feedbacks for district:', user.district);
      
      let query = supabase
        .from('citizen_feedback')
        .select('*')
        .eq('district', user.district)
        .order('created_at', { ascending: false });

      // Apply filters
      if (selectedMandal) {
        query = query.eq('mandal', selectedMandal);
      }
      
      if (selectedVillage) {
        query = query.eq('village', selectedVillage);
      }
      
      if (serviceTypeFilter) {
        query = query.eq('service_type', serviceTypeFilter);
      }
      
      if (ratingFilter) {
        if (ratingFilter === 'low') {
          query = query.lte('rating', 2);
        } else if (ratingFilter === 'medium') {
          query = query.gte('rating', 3).lte('rating', 3);
        } else if (ratingFilter === 'high') {
          query = query.gte('rating', 4);
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('❌ Error fetching feedbacks:', fetchError);
        setError(fetchError.message);
      } else {
        console.log('✅ Feedbacks fetched:', data?.length || 0, 'items');
        
        // Apply text search filter on frontend
        let filteredData = data || [];
        if (searchText.trim()) {
          const searchLower = searchText.toLowerCase();
          filteredData = filteredData.filter(feedback => 
            feedback.feedback_text?.toLowerCase().includes(searchLower) ||
            feedback.title?.toLowerCase().includes(searchLower) ||
            feedback.service_type?.toLowerCase().includes(searchLower)
          );
        }
        
        setFeedbacks(filteredData);
      }
    } catch (err: any) {
      console.error('💥 Error fetching feedbacks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  const getRatingBadgeColor = (rating: number) => {
    if (rating <= 2) return 'destructive';
    if (rating <= 3) return 'secondary';
    return 'default';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-light-blue-bg">
        <OfficialNavigation />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Please log in to view feedback.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user.district) {
    return (
      <div className="min-h-screen bg-light-blue-bg">
        <OfficialNavigation />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">No district assigned to your profile. Please contact administrator.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-blue-bg">
      <OfficialNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-government-blue mb-8 text-center">
          Feedback Dashboard - {user.district} District 📊
        </h1>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div>
                <Label>Mandal</Label>
                <Select value={selectedMandal} onValueChange={setSelectedMandal}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Mandals" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
                    <SelectItem value="">All Mandals</SelectItem>
                    {availableMandals.map((mandal) => (
                      <SelectItem key={mandal} value={mandal}>
                        {mandal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Village</Label>
                <Select 
                  value={selectedVillage} 
                  onValueChange={setSelectedVillage}
                  disabled={!selectedMandal}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Villages" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
                    <SelectItem value="">All Villages</SelectItem>
                    {availableVillages.map((village) => (
                      <SelectItem key={village} value={village}>
                        {village}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Service Type</Label>
                <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
                    <SelectItem value="">All Services</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Water Supply">Water Supply</SelectItem>
                    <SelectItem value="Electricity">Electricity</SelectItem>
                    <SelectItem value="Sanitation">Sanitation</SelectItem>
                    <SelectItem value="Public Safety">Public Safety</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Government Services">Government Services</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Rating</Label>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Ratings" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <SelectItem value="">All Ratings</SelectItem>
                    <SelectItem value="low">Low (1-2 ⭐)</SelectItem>
                    <SelectItem value="medium">Medium (3 ⭐)</SelectItem>
                    <SelectItem value="high">High (4-5 ⭐)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Search Text</Label>
                <Input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search feedback..."
                />
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Showing feedback for: <strong>{user.district}</strong> district
              {selectedMandal && <span> → <strong>{selectedMandal}</strong> mandal</span>}
              {selectedVillage && <span> → <strong>{selectedVillage}</strong> village</span>}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-government-blue mx-auto mb-4"></div>
            <p>Loading feedback...</p>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-600">Error: {error}</p>
            </CardContent>
          </Card>
        ) : feedbacks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">No feedback found for the selected filters.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Found {feedbacks.length} feedback(s)
            </div>
            
            {feedbacks.map((feedback) => (
              <Card key={feedback.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-government-blue">
                        {feedback.title || 'Feedback'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{feedback.service_type}</Badge>
                        <Badge variant={getRatingBadgeColor(feedback.rating)}>
                          {feedback.rating}/5
                        </Badge>
                      </div>
                    </div>
                    <div className="flex">
                      {renderStars(feedback.rating)}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{feedback.feedback_text}</p>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>
                      📍 <strong>Location:</strong> {feedback.village}, {feedback.mandal}, {feedback.district}
                    </div>
                    {feedback.location_details && (
                      <div>
                        📝 <strong>Details:</strong> {feedback.location_details}
                      </div>
                    )}
                    <div>
                      📅 <strong>Submitted:</strong> {formatDate(feedback.created_at)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackViewer;
