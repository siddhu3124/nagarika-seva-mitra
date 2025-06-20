
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usePhoneAuth } from '@/hooks/usePhoneAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const EmployeeProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { phoneNumber } = usePhoneAuth();

  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    department: '',
    employee_id: ''
  });

  const validateEmployeeCredentials = async (name: string, department: string, employeeId: string) => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('name', name)
      .eq('department', department)
      .eq('employee_id', employeeId)
      .single();

    if (error || !data) {
      return null;
    }
    return data;
  };

  const handleSubmit = async () => {
    if (!employeeForm.name || !employeeForm.department || !employeeForm.employee_id) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const employeeData = await validateEmployeeCredentials(
      employeeForm.name, 
      employeeForm.department, 
      employeeForm.employee_id
    );
    
    if (!employeeData) {
      toast({
        title: "Error",
        description: "Invalid employee credentials",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('employeeInfo', JSON.stringify(employeeData));

    const userData = {
      id: 'official_' + Date.now(),
      name: employeeData.name,
      department: employeeData.department,
      employee_id: employeeData.employee_id,
      phone_number: employeeData.phone_number || phoneNumber,
      district: employeeData.district,
      mandal: employeeData.mandal,
      village: employeeData.village,
      role: 'official' as const
    };

    try {
      await login(userData);
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      navigate('/official/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete login",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="employee-name">Name *</Label>
        <Input
          id="employee-name"
          value={employeeForm.name}
          onChange={(e) => setEmployeeForm({...employeeForm, name: e.target.value})}
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <Label htmlFor="department">Department *</Label>
        <Input
          id="department"
          value={employeeForm.department}
          onChange={(e) => setEmployeeForm({...employeeForm, department: e.target.value})}
          placeholder="Enter your department"
        />
      </div>

      <div>
        <Label htmlFor="employee-id">Employee ID *</Label>
        <Input
          id="employee-id"
          value={employeeForm.employee_id}
          onChange={(e) => setEmployeeForm({...employeeForm, employee_id: e.target.value})}
          placeholder="Enter your employee ID"
        />
      </div>

      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
        <p className="font-medium mb-1">Test Credentials:</p>
        <p>Name: Rajesh Kumar | Dept: Revenue | ID: REV001</p>
        <p>Name: Priya Sharma | Dept: Health | ID: HLT001</p>
      </div>

      <Button 
        onClick={handleSubmit}
        disabled={authLoading}
        className="w-full bg-government-blue hover:bg-government-blue/90"
      >
        {authLoading ? 'Processing...' : 'Complete Profile'}
      </Button>
    </div>
  );
};

export default EmployeeProfileForm;
