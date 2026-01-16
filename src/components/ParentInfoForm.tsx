import { useState } from 'react';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { Button } from './Button';
import { CareerPrediction } from '@/data/quizData';
import { User, Mail, Phone, School, Baby, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveUserAndQuizResults } from '@/lib/quizStorage';

interface ParentInfoFormProps {
  prediction: CareerPrediction;
  personalityAnswers: Record<string, string>;
  logicalAnswers: Record<string, string>;
  logicalScore: number;
  completionTime: number;
  onComplete: () => void;
}

export function ParentInfoForm({
  prediction,
  personalityAnswers,
  logicalAnswers,
  logicalScore,
  completionTime,
  onComplete
}: ParentInfoFormProps) {
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!childName.trim()) {
      toast({
        title: "Oops!",
        description: "Please enter the child's name",
        variant: "destructive"
      });
      return;
    }

    if (!age || parseInt(age) <= 0) {
      toast({
        title: "Oops!",
        description: "Please enter a valid age",
        variant: "destructive"
      });
      return;
    }

    if (!parentEmail.trim()) {
      toast({
        title: "Oops!",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    if (!parentPhone.trim()) {
      toast({
        title: "Oops!",
        description: "Please enter a phone number",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await saveUserAndQuizResults(
        {
          name: childName.trim(),
          age: parseInt(age),
          phone: parentPhone.trim(),
          email: parentEmail.trim(),
        },
        {
          personalityAnswers,
          logicalAnswers,
          logicalScore,
          careerType: prediction.type,
        }
      );

      if (!result) {
        throw new Error('Failed to save data');
      }

      toast({
        title: "🎉 Awesome!",
        description: "Your adventure awaits!",
      });

      onComplete();
    } catch (error) {
      console.error('Error saving quiz result:', error);
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again!",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-lavender/20 via-background to-secondary/20">
      <div 
        ref={formRef}
        className="max-w-lg w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-lavender text-lavender-foreground font-nunito font-semibold text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            Almost There!
          </div>
          <h2 className="font-fredoka text-3xl md:text-4xl font-bold text-foreground mb-2">
            One More Step! 🚀
          </h2>
          <p className="font-nunito text-muted-foreground">
            Tell us a little about yourself to start your adventure!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-3xl p-8 border-2 border-lavender/30 shadow-card space-y-5">
          {/* Child Name - Required */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-nunito font-semibold text-foreground">
              <User className="w-4 h-4 text-lavender" />
              Your Name *
            </label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="What's your name, superstar?"
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-lavender focus:outline-none transition-colors font-nunito"
              required
            />
          </div>

          {/* Age */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-nunito font-semibold text-foreground">
              <Baby className="w-4 h-4 text-secondary" />
              Age *
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="How old are you?"
              min="3"
              max="15"
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none transition-colors font-nunito"
              required
            />
          </div>

          {/* Parent Email */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-nunito font-semibold text-foreground">
              <Mail className="w-4 h-4 text-accent" />
              Email *
            </label>
            <input
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none transition-colors font-nunito"
              required
            />
          </div>

          {/* Parent Phone */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-nunito font-semibold text-foreground">
              <Phone className="w-4 h-4 text-coral" />
              Phone Number *
            </label>
            <input
              type="tel"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              placeholder="Your phone number"
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-coral focus:outline-none transition-colors font-nunito"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Saving...'
            ) : (
              <>
                Start My Adventure!
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
