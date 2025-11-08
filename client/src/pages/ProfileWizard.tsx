import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MapPin, User, Heart, Briefcase, AlertCircle, Check, ArrowRight, ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { useLocation } from 'wouter';

const STEPS = [
  { id: 1, title: 'Location', icon: MapPin },
  { id: 2, title: 'Basic Info', icon: User },
  { id: 3, title: 'Health', icon: Heart },
  { id: 4, title: 'Skills', icon: Briefcase },
  { id: 5, title: 'Needs', icon: AlertCircle },
  { id: 6, title: 'Consent', icon: Check }
];

export default function ProfileWizard() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    location: { lat: '', lng: '', address: '' },
    name: '',
    alias: '',
    age: '',
    gender: '',
    photo: null as File | null,
    healthNotes: '',
    healthConditions: [] as string[],
    skills: '',
    workHistory: '',
    needs: '',
    priority: 'medium',
    consent: false
  });

  const progress = (currentStep / STEPS.length) * 100;

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    //todo: remove mock functionality - auto-save to IndexedDB
    localStorage.setItem('profile_draft', JSON.stringify({ ...formData, [field]: value }));
    toast.success('Draft saved', { duration: 1000 });
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!formData.consent) {
      toast.error('Please provide consent to continue');
      return;
    }

    //todo: remove mock functionality
    toast.success('Profile created successfully!');
    setShowSuccess(true);
  };

  const mockProfileId = 'NEST-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl w-full"
        >
          <Card className="rounded-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 p-3 w-fit">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">Profile Created Successfully!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted rounded-xl p-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Digital ID</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-profile-id">{mockProfileId}</p>
                </div>
                <div className="flex justify-center py-4">
                  <QRCodeSVG value={mockProfileId} size={160} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium text-foreground">{formData.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Age</p>
                    <p className="font-medium text-foreground">{formData.age || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setLocation('/dashboard')} className="flex-1" data-testid="button-back-dashboard">
                  Back to Dashboard
                </Button>
                <Button onClick={() => window.print()} variant="outline" data-testid="button-print-profile">
                  Print Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto py-4 sm:py-6 md:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Create New Profile</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}</p>
          <Progress value={progress} className="mt-4" />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6 sm:mb-8">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                  isActive ? 'bg-primary/10 ring-2 ring-primary' :
                  isCompleted ? 'bg-green-50 dark:bg-green-900/20' :
                  'bg-muted'
                }`}
              >
                <StepIcon className={`h-5 w-5 ${
                  isActive ? 'text-primary' :
                  isCompleted ? 'text-green-600 dark:text-green-400' :
                  'text-muted-foreground'
                }`} />
                <span className={`text-xs font-medium ${
                  isActive ? 'text-primary' :
                  isCompleted ? 'text-green-600 dark:text-green-400' :
                  'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentStep === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Textarea
                        placeholder="Enter current location or last known address"
                        value={formData.location.address}
                        onChange={(e) => updateField('location', { ...formData.location, address: e.target.value })}
                        data-testid="input-location-address"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Latitude</Label>
                        <Input
                          placeholder="e.g., 28.6139"
                          value={formData.location.lat}
                          onChange={(e) => updateField('location', { ...formData.location, lat: e.target.value })}
                          data-testid="input-latitude"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Longitude</Label>
                        <Input
                          placeholder="e.g., 77.2090"
                          value={formData.location.lng}
                          onChange={(e) => updateField('location', { ...formData.location, lng: e.target.value })}
                          data-testid="input-longitude"
                        />
                      </div>
                    </div>
                    <div className="bg-muted rounded-xl h-64 flex items-center justify-center">
                      <p className="text-muted-foreground">Map will be displayed here (Leaflet)</p>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t('profile.name')}</Label>
                        <Input
                          placeholder="Full legal name"
                          value={formData.name}
                          onChange={(e) => updateField('name', e.target.value)}
                          data-testid="input-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('profile.alias')}</Label>
                        <Input
                          placeholder="Nickname or preferred name"
                          value={formData.alias}
                          onChange={(e) => updateField('alias', e.target.value)}
                          data-testid="input-alias"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t('profile.age')}</Label>
                        <Input
                          type="number"
                          placeholder="Age"
                          value={formData.age}
                          onChange={(e) => updateField('age', e.target.value)}
                          data-testid="input-age"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('profile.gender')}</Label>
                        <Select value={formData.gender} onValueChange={(val) => updateField('gender', val)}>
                          <SelectTrigger data-testid="select-gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer_not">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('profile.photo')}</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => updateField('photo', e.target.files?.[0] || null)}
                        data-testid="input-photo"
                      />
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <div className="space-y-4">
                      <Label>Health Conditions</Label>
                      {['Diabetes', 'Hypertension', 'Mental Health', 'Disability'].map(condition => (
                        <div key={condition} className="flex items-center space-x-2">
                          <Checkbox
                            id={condition}
                            checked={formData.healthConditions.includes(condition)}
                            onCheckedChange={(checked) => {
                              const newConditions = checked
                                ? [...formData.healthConditions, condition]
                                : formData.healthConditions.filter(c => c !== condition);
                              updateField('healthConditions', newConditions);
                            }}
                            data-testid={`checkbox-health-${condition.toLowerCase().replace(/\s+/g, '-')}`}
                          />
                          <label htmlFor={condition} className="text-sm font-medium cursor-pointer">
                            {condition}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label>Additional Health Notes</Label>
                      <Textarea
                        placeholder="Any additional health information..."
                        value={formData.healthNotes}
                        onChange={(e) => updateField('healthNotes', e.target.value)}
                        data-testid="input-health-notes"
                      />
                    </div>
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <div className="space-y-2">
                      <Label>Skills</Label>
                      <Textarea
                        placeholder="List any skills (e.g., carpentry, cooking, IT, etc.)"
                        value={formData.skills}
                        onChange={(e) => updateField('skills', e.target.value)}
                        data-testid="input-skills"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Work History</Label>
                      <Textarea
                        placeholder="Previous employment or work experience"
                        value={formData.workHistory}
                        onChange={(e) => updateField('workHistory', e.target.value)}
                        data-testid="input-work-history"
                      />
                    </div>
                  </>
                )}

                {currentStep === 5 && (
                  <>
                    <div className="space-y-2">
                      <Label>Immediate Needs</Label>
                      <Textarea
                        placeholder="What are the most urgent needs? (shelter, food, medical, etc.)"
                        value={formData.needs}
                        onChange={(e) => updateField('needs', e.target.value)}
                        data-testid="input-needs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Priority Level</Label>
                      <Select value={formData.priority} onValueChange={(val) => updateField('priority', val)}>
                        <SelectTrigger data-testid="select-priority">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-xl p-6">
                      <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-3">Consent & Privacy</h3>
                      <p className="text-sm text-amber-800 dark:text-amber-300 mb-4">
                        By submitting this profile, you consent to store and process this data for humanitarian assistance purposes. 
                        All personal information will be handled with confidentiality and used solely for providing aid services.
                      </p>
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="consent"
                          checked={formData.consent}
                          onCheckedChange={(checked) => updateField('consent', checked)}
                          data-testid="checkbox-consent"
                        />
                        <label htmlFor="consent" className="text-sm font-medium cursor-pointer text-amber-900 dark:text-amber-200">
                          I understand and consent to the collection and use of this information
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    data-testid="button-previous"
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" data-testid="button-save-draft" className="flex-1 sm:flex-none">
                      <Save className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Save Draft</span>
                      <span className="sm:hidden">Save</span>
                    </Button>

                    {currentStep < STEPS.length ? (
                      <Button onClick={nextStep} data-testid="button-next" className="flex-1 sm:flex-none">
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button onClick={handleSubmit} disabled={!formData.consent} data-testid="button-submit" className="flex-1 sm:flex-none">
                        Submit
                        <Check className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
