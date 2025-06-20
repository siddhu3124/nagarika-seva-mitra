
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import OfficialNavigation from '@/components/OfficialNavigation';
import { useState } from 'react';

const AnalyticsDashboard = () => {
  const [filters, setFilters] = useState({
    district: '',
    mandal: '',
    village: '',
    service: '',
    dateRange: '30'
  });

  // Mock data for charts
  const serviceRatings = [
    { service: 'Roads', avgRating: 2.3, complaints: 45 },
    { service: 'Water', avgRating: 3.1, complaints: 32 },
    { service: 'PHC', avgRating: 3.8, complaints: 18 },
    { service: 'Education', avgRating: 4.2, complaints: 12 },
    { service: 'Electricity', avgRating: 2.8, complaints: 28 },
    { service: 'Ration', avgRating: 3.5, complaints: 22 }
  ];

  const complaintsData = [
    { name: 'Open', value: 45, color: '#ff6b6b' },
    { name: 'In Progress', value: 23, color: '#ffa726' },
    { name: 'Resolved', value: 67, color: '#66bb6a' }
  ];

  const villageData = [
    { village: 'గ్రామం 1', avgRating: 2.1, complaints: 25 },
    { village: 'గ్రామం 2', avgRating: 3.2, complaints: 18 },
    { village: 'గ్రామం 3', avgRating: 2.8, complaints: 22 },
    { village: 'గ్రామం 4', avgRating: 3.9, complaints: 15 },
    { village: 'గ్రామం 5', avgRating: 2.3, complaints: 31 }
  ];

  const topWords = [
    { word: 'రోడ్', count: 45, size: 24 },
    { word: 'మరమ్మత్తు', count: 38, size: 20 },
    { word: 'నీరు', count: 32, size: 18 },
    { word: 'గుంతలు', count: 28, size: 16 },
    { word: 'సమస్య', count: 25, size: 14 },
    { word: 'వైద్యం', count: 18, size: 12 },
    { word: 'కరెంటు', count: 22, size: 13 },
    { word: 'రేషన్', count: 20, size: 12 }
  ];

  const criticalAreas = villageData.filter(v => v.avgRating < 2.5);

  const exportData = () => {
    // Mock export functionality
    alert('Data exported successfully! (This would download a CSV/PDF in a real implementation)');
  };

  return (
    <div className="min-h-screen bg-light-blue-bg">
      <OfficialNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-government-blue mb-8 text-center">
          Analytics Dashboard 📊
        </h1>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Select onValueChange={(value) => setFilters({...filters, district: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hyderabad">హైదరాబాద్</SelectItem>
                  <SelectItem value="warangal">వరంగల్</SelectItem>
                  <SelectItem value="nizamabad">నిజామాబాద్</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setFilters({...filters, mandal: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Mandal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="secunderabad">సికింద్రాబాద్</SelectItem>
                  <SelectItem value="kukatpally">కుకట్‌పల్లి</SelectItem>
                  <SelectItem value="lbnagar">LB నగర్</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setFilters({...filters, village: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Village" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="village1">గ్రామం 1</SelectItem>
                  <SelectItem value="village2">గ్రామం 2</SelectItem>
                  <SelectItem value="village3">గ్రామం 3</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setFilters({...filters, service: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roads">Roads</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="phc">PHC</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={exportData} className="bg-government-blue hover:bg-government-blue/90">
                Export Data 📥
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Ratings Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Average Ratings by Service Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={serviceRatings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="service" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgRating" fill="#29ABE2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Complaints Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Complaints Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={complaintsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {complaintsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Village Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Village Performance Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={villageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="village" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgRating" fill="#90EE90" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Word Cloud (Mock) */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center items-center h-[300px] gap-2">
                {topWords.map((word, index) => (
                  <span
                    key={index}
                    style={{ fontSize: `${word.size}px` }}
                    className="text-government-blue font-semibold"
                  >
                    {word.word}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Areas Alert */}
        {criticalAreas.length > 0 && (
          <Card className="mt-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center">
                🚨 Critical Areas (Rating < 2.5)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {criticalAreas.map((area, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-700">{area.village}</h4>
                    <p className="text-sm text-red-600">
                      Rating: {area.avgRating} • Complaints: {area.complaints}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
