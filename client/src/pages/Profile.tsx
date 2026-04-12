import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { User, MapPin, Globe, Wrench, Save, Lock, Camera, CheckCircle2, Circle, Users } from "lucide-react";

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming"
];

const SKILL_OPTIONS = [
  "Butchering","Foraging","Building","Food Preservation","Gardening",
  "Hunting","Animal Husbandry","Water Systems","Solar Energy",
  "Beekeeping","Herbalism","Woodworking","Blacksmithing","Cheese Making",
  "Fermentation","Seed Saving","Permaculture","Off-Grid Living"
];

function ProfileCompletion({ form, selectedSkills, avatarUrl }: {
  form: { displayName: string; bio: string; location: string; state: string; websiteUrl: string };
  selectedSkills: string[];
  avatarUrl: string;
}) {
  const steps = [
    { label: "Display name", done: form.displayName.trim().length > 0 },
    { label: "About you (bio)", done: form.bio.trim().length > 20 },
    { label: "Location", done: form.location.trim().length > 0 || form.state.length > 0 },
    { label: "At least one skill", done: selectedSkills.length > 0 },
    { label: "Profile photo", done: avatarUrl.length > 0 },
  ];
  const done = steps.filter(s => s.done).length;
  const pct = Math.round((done / steps.length) * 100);

  return (
    <div className="rounded-2xl p-5 mb-6" style={{ background: "oklch(0.95 0.03 140)", border: "1px solid oklch(0.85 0.05 140)" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-sm" style={{ color: "oklch(0.28 0.08 140)" }}>Profile Completion</p>
        <span className="text-sm font-black" style={{ color: "oklch(0.38 0.09 140)" }}>{pct}%</span>
      </div>
      <div className="w-full h-2 rounded-full mb-4" style={{ background: "oklch(0.85 0.05 140)" }}>
        <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: "oklch(0.45 0.12 140)" }} />
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        {steps.map(step => (
          <div key={step.label} className="flex items-center gap-2 text-xs">
            {step.done
              ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "oklch(0.45 0.12 140)" }} />
              : <Circle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "oklch(0.60 0.05 140)" }} />
            }
            <span style={{ color: step.done ? "oklch(0.35 0.08 140)" : "oklch(0.55 0.05 140)" }}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, isAuthenticated, loading } = useAuth();

  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    location: "",
    state: "",
    websiteUrl: "",
    isPublic: true,
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading: profileLoading } = trpc.profile.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        displayName: profile.displayName || "",
        bio: profile.bio || "",
        location: profile.location || "",
        state: profile.state || "",
        websiteUrl: profile.websiteUrl || "",
        isPublic: profile.isPublic,
      });
      if (profile.skills) {
        setSelectedSkills(profile.skills.split(",").map(s => s.trim()).filter(Boolean));
      }
      if (profile.avatarUrl) {
        setAvatarPreview(profile.avatarUrl);
      }
    } else if (user) {
      setForm(f => ({ ...f, displayName: user.name || "" }));
    }
  }, [profile, user]);

  const uploadAvatar = trpc.profile.uploadAvatar.useMutation({
    onSuccess: (data) => {
      setAvatarPreview(data.avatarUrl);
      toast.success("Profile photo uploaded!");
    },
    onError: (err) => toast.error("Upload failed: " + err.message),
  });

  const saveProfile = trpc.profile.save.useMutation({
    onSuccess: () => toast.success("Profile saved! 🌿"),
    onError: (err) => toast.error("Error saving profile: " + err.message),
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be under 5 MB");
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleSave = async () => {
    // Upload avatar first if a new file was selected
    if (avatarFile) {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1];
        await uploadAvatar.mutateAsync({
          dataBase64: base64,
          mimeType: avatarFile.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
        });
      };
      reader.readAsDataURL(avatarFile);
    }

    saveProfile.mutate({
      ...form,
      skills: selectedSkills.join(", "),
    });
  };

  const initials = (form.displayName || user?.name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.97 0.02 80)" }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: "oklch(0.38 0.09 140)" }} />
          <p style={{ color: "oklch(0.45 0.04 50)" }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen" style={{ background: "oklch(0.97 0.02 80)" }}>
        <Navigation />
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <Lock size={48} className="mx-auto mb-6" style={{ color: "oklch(0.55 0.10 140)" }} />
          <h1 className="text-3xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.25 0.05 50)" }}>
            Sign In to Create Your Profile
          </h1>
          <p className="mb-8" style={{ color: "oklch(0.45 0.04 50)" }}>
            Join the Homestead Hub community. Create your homesteader profile, share your skills, and connect with others across the country.
          </p>
          <a href={getLoginUrl()}>
            <button className="px-8 py-3 rounded-xl font-bold text-white text-lg"
              style={{ background: "oklch(0.38 0.09 140)" }}>
              Sign In / Create Account — It's Free
            </button>
          </a>
          <p className="mt-4 text-sm" style={{ color: "oklch(0.60 0.04 80)" }}>
            No credit card. No subscription. Free forever.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.97 0.02 80)" }}>
      <Navigation />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <User size={28} style={{ color: "oklch(0.38 0.09 140)" }} />
            <div>
              <h1 className="text-3xl font-bold"
                style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.25 0.05 50)" }}>
                Your Homesteader Profile
              </h1>
              <p style={{ color: "oklch(0.50 0.04 50)" }}>
                Free community member — visible to other homesteaders
              </p>
            </div>
          </div>
          <Link href="/community">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "oklch(0.93 0.03 80)", color: "oklch(0.35 0.06 50)" }}>
              <Users size={14} /> View Community
            </button>
          </Link>
        </div>

        {/* Completion tracker */}
        <ProfileCompletion form={form} selectedSkills={selectedSkills} avatarUrl={avatarPreview} />

        <div className="rounded-2xl p-8 space-y-6"
          style={{ background: "white", border: "1px solid oklch(0.88 0.04 80)" }}>

          {/* Avatar Upload */}
          <div className="flex items-center gap-6">
            <div className="relative">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar preview"
                  className="w-20 h-20 rounded-full object-cover"
                  style={{ border: "3px solid oklch(0.85 0.05 80)" }} />
              ) : (
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                  style={{ background: "oklch(0.38 0.09 140)" }}>
                  {initials}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md"
                style={{ background: "oklch(0.45 0.12 140)" }}>
                <Camera size={13} className="text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div>
              <p className="font-semibold text-sm mb-1" style={{ color: "oklch(0.30 0.04 50)" }}>
                Profile Photo
              </p>
              <p className="text-xs" style={{ color: "oklch(0.55 0.04 80)" }}>
                JPG, PNG, or WebP · Max 5 MB
              </p>
              {avatarFile && (
                <p className="text-xs mt-1" style={{ color: "oklch(0.45 0.10 140)" }}>
                  ✓ New photo ready — click Save Profile to upload
                </p>
              )}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "oklch(0.35 0.04 50)" }}>
              Display Name *
            </label>
            <input
              type="text"
              value={form.displayName}
              onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
              placeholder="How you want to be known in the community"
              className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2"
              style={{ borderColor: "oklch(0.82 0.04 80)", background: "oklch(0.98 0.01 80)" }}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "oklch(0.35 0.04 50)" }}>
              About You
            </label>
            <textarea
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Tell the community about your homestead, your journey, and what you're working on..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border outline-none resize-none"
              style={{ borderColor: "oklch(0.82 0.04 80)", background: "oklch(0.98 0.01 80)" }}
            />
            <p className="text-xs mt-1" style={{ color: "oklch(0.60 0.04 80)" }}>
              {form.bio.length}/1000 characters
            </p>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "oklch(0.35 0.04 50)" }}>
                <MapPin size={13} className="inline mr-1" /> City / Region
              </label>
              <input
                type="text"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Blue Ridge Mountains"
                className="w-full px-4 py-3 rounded-xl border outline-none"
                style={{ borderColor: "oklch(0.82 0.04 80)", background: "oklch(0.98 0.01 80)" }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "oklch(0.35 0.04 50)" }}>
                State
              </label>
              <select
                value={form.state}
                onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border outline-none"
                style={{ borderColor: "oklch(0.82 0.04 80)", background: "oklch(0.98 0.01 80)" }}
              >
                <option value="">Select state...</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-semibold mb-3" style={{ color: "oklch(0.35 0.04 50)" }}>
              <Wrench size={13} className="inline mr-1" /> Your Homesteading Skills
              <span className="font-normal ml-2" style={{ color: "oklch(0.60 0.04 80)" }}>
                (tap to select)
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                  style={selectedSkills.includes(skill)
                    ? { background: "oklch(0.38 0.09 140)", color: "white" }
                    : { background: "oklch(0.93 0.03 80)", color: "oklch(0.40 0.04 50)", border: "1px solid oklch(0.82 0.04 80)" }
                  }
                >
                  {selectedSkills.includes(skill) ? "✓ " : ""}{skill}
                </button>
              ))}
            </div>
            {selectedSkills.length > 0 && (
              <p className="text-xs mt-2" style={{ color: "oklch(0.45 0.08 140)" }}>
                {selectedSkills.length} skill{selectedSkills.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "oklch(0.35 0.04 50)" }}>
              <Globe size={13} className="inline mr-1" /> Website or Blog (optional)
            </label>
            <input
              type="url"
              value={form.websiteUrl}
              onChange={e => setForm(f => ({ ...f, websiteUrl: e.target.value }))}
              placeholder="https://yourblog.com"
              className="w-full px-4 py-3 rounded-xl border outline-none"
              style={{ borderColor: "oklch(0.82 0.04 80)", background: "oklch(0.98 0.01 80)" }}
            />
          </div>

          {/* Public toggle */}
          <div className="flex items-center justify-between py-3 px-4 rounded-xl"
            style={{ background: "oklch(0.95 0.02 80)" }}>
            <div>
              <p className="font-semibold text-sm" style={{ color: "oklch(0.30 0.04 50)" }}>
                Show in community directory
              </p>
              <p className="text-xs" style={{ color: "oklch(0.55 0.04 50)" }}>
                Let other homesteaders find and connect with you
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, isPublic: !f.isPublic }))}
              className="w-12 h-6 rounded-full transition-all relative"
              style={{ background: form.isPublic ? "oklch(0.50 0.12 140)" : "oklch(0.75 0.04 50)" }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                style={{ left: form.isPublic ? "calc(100% - 1.375rem)" : "0.125rem" }}
              />
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saveProfile.isPending || uploadAvatar.isPending}
            className="w-full py-3 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: "oklch(0.38 0.09 140)" }}
          >
            <Save size={18} />
            {(saveProfile.isPending || uploadAvatar.isPending) ? "Saving..." : "Save Profile"}
          </button>

          <p className="text-center text-xs" style={{ color: "oklch(0.60 0.04 80)" }}>
            Your profile is free forever. No subscription required.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
