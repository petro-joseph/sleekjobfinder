import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Job, Resume, Application } from "@/types";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Building, MapPin, ChevronLeft, FileText, Sparkles, Upload, CheckCircle, PenTool, Send, Clock, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import TailorResumeModal from '@/components/TailorResumeModal';
import ApplyConfirmationModal from '../components/ApplyConfirmationModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJobById } from '@/api/jobs';
import { uploadResumeFile } from '@/integrations/supabase/uploadResume';
import { supabase } from '@/integrations/supabase/client';

// Define a type for the application object stored in Zustand/Supabase
interface Application {
  id: string;
  job_id: string;
  user_id: string;
  position: string;
  company: string;
  status: 'applied';
  createdAt: string;
  updatedAt: string;
}

interface ApplicationRecord {
  id?: string;
  job_id: string;
  user_id: string;
  position: string;
  company: string;
  status: 'applied';
  applied_at?: string;
  created_at?: string;
  updated_at?: string;
}

// ... rest of the component implementation remains unchanged
