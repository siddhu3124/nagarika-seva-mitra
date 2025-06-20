
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OfficialNavigation from '@/components/OfficialNavigation';
import { useState } from 'react';

const DistrictSummary = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('hyderabad');

  // Mock district data
  const districtData = {
    hyderabad: {
      name: 'హైదరాబాద్',
      totalFeedbacks: 245,
      avgRating: 3.2,
      topComplaints: [
        { type: 'Roads', count: 78, avgRating: 2.1 },
        { type: 'Water Supply', count: 65, avgRating: 2.8 },
        { type: 'Electricity', count: 45, avgRating: 3.1 },
        { type: 'Healthcare', count: 32, avgRating: 3.8 },
        { type: 'Education', count: 25, avgRating: 4.1 }
      ],
      criticalMandals: [
        { name: 'కుకట్‌పల్లి', avgRating: 2.1, issues: 'Poor road conditions, water scarcity' },
        { name: 'LB నగర్', avgRating: 2.3, issues: 'Frequent power cuts, drainage problems' }
      ],
      improvements: [
        'New water treatment plant installed in Kukatpally',
        'Road repairs completed in 15 villages',
        'Additional medical staff recruited for PHCs'
      ],
      aiSummary: 'District shows moderate satisfaction levels with significant room for improvement in infrastructure. Priority areas: road maintenance and water supply consistency. Positive trends in healthcare and education services.'
    },
    warangal: {
      name: 'వరంగల్',
      totalFeedbacks: 178,
      avgRating: 3.5,
      topComplaints: [
        { type: 'Agriculture Support', count: 52, avgRating: 2.8 },
        { type: 'Roads', count: 48, avgRating: 3.2 },
        { type: 'Water Supply', count: 38, avgRating: 3.1 },
        { type: 'Healthcare', count: 28, avgRating: 3.9 },
        { type: 'Education', count: 12, avgRating: 4.2 }
      ],
      criticalMandals: [
        { name: 'హనుమకొండ', avgRating: 2.8, issues: 'Agricultural equipment shortage' }
      ],
      improvements: [
        'New irrigation channels completed',
        'Agricultural equipment distribution program launched',
        'Road connectivity improved to 8 villages'
      ],
      aiSummary: 'District performance is above average with strong education and healthcare systems. Agricultural support needs attention. Infrastructure development is progressing well.'
    }
  };

  const currentDistrict = districtData[selectedDistrict as keyof typeof districtData];

  const getStatusColor = (rating: number) => {
    if (rating < 2.5) return 'destructive';
    if (rating < 3.5) return 'default';
    return 'secondary';
  };

  const getStatusText = (rating: number) => {
    if (rating < 2.5) return 'Critical';
    if (rating < 3.5) return 'Needs Attention';
    return 'Good';
  };

  return (
    <div className="min-h-screen bg-light-blue-bg">
      <OfficialNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-government-blue mb-8 text-center">
          District Summary Report 📋
        </h1>

        {/* District Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select District</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hyderabad">హైదరాబాద్ (Hyderabad)</SelectItem>
                <SelectItem value="warangal">వరంగల్ (Warangal)</SelectItem>
                <SelectItem value="nizamabad">నిజామాబాద్ (Nizamabad)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Overview Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {currentDistrict.name} Overview
                <Badge variant={getStatusColor(currentDistrict.avgRating)}>
                  {getStatusText(currentDistrict.avgRating)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-government-blue">
                    {currentDistrict.totalFeedbacks}
                  </div>
                  <div className="text-sm text-gray-600">Total Feedbacks</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {currentDistrict.avgRating}/5
                  </div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Complaints */}
          <Card>
            <CardHeader>
              <CardTitle>Top Complaint Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentDistrict.topComplaints.map((complaint, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{complaint.type}</div>
                      <div className="text-sm text-gray-600">{complaint.count} complaints</div>
                    </div>
                    <Badge variant={getStatusColor(complaint.avgRating)}>
                      {complaint.avgRating}/5
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Critical Mandals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-700">🚨 Critical Mandals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentDistrict.criticalMandals.map((mandal, index) => (
                  <div key={index} className="p-4 border-l-4 border-red-400 bg-red-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-red-700">{mandal.name}</h4>
                      <Badge variant="destructive">{mandal.avgRating}/5</Badge>
                    </div>
                    <p className="text-sm text-red-600">{mandal.issues}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Improvements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">✅ Recent Improvements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentDistrict.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                    <div className="text-green-600 mr-2 mt-1">✓</div>
                    <div className="text-sm text-green-700">{improvement}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI-Generated Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              🤖 AI-Generated District Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                {currentDistrict.aiSummary}
              </p>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              * This analysis is generated based on citizen feedback patterns and service metrics
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DistrictSummary;
