import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tractor, Mail, Lock, User, Phone, MapPin, Loader2 } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  state: z.string().min(1, "Please select a state"),
  farmSize: z
    .number({ invalid_type_error: "Enter farm size" })
    .positive("Farm size must be positive"),
  primaryCrops: z
    .array(z.string())
    .min(1, "Select at least one crop"),
});

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    state: "",
    farmSize: "",
    primaryCrops: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };
    const cropOptions = [
    "Rice",
    "Wheat",
    "Maize",
    "Cotton",
    "Sugarcane",
    "Pulses",
    "Vegetables",
  ];


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      loginSchema.parse({ email: formData.email, password: formData.password });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach(e => {
          if (e.path[0]) fieldErrors[e.path[0] as string] = e.message;
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    setIsLoading(false);
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Invalid email or password");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Welcome back! 🌾");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      signupSchema.parse({
      ...formData,
      farmSize: Number(formData.farmSize),
});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach(e => {
          if (e.path[0]) fieldErrors[e.path[0] as string] = e.message;
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setIsLoading(true);
    const redirectUrl = `${window.location.origin}/`;

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
          state: formData.state,
          farm_size_acres: Number(formData.farmSize),
          primary_crops: formData.primaryCrops,
          preferred_language: "en",
        },
      },
    });
    const user = data.user;
    if (!user) {
      toast.error("User not created");
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        farm_size_acres: Number(formData.farmSize),
        primary_crops: formData.primaryCrops,
      })
      .eq("user_id", user.id);

    if (profileError) {
      console.error(profileError);
      toast.error("Profile update failed");
      return;
    }
    setIsLoading(false);
    if (error) {
      if (error.message.includes("already registered")) {
        toast.error("This email is already registered. Please login instead.");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Account created successfully! 🎉");
      }
      // ⏳ wait briefly for auth session to be ready
      // const { data } = await supabase.auth.getUser();
    //   const user = data.user;

    // if (!user) {
    //   toast.error("User session not found");
    //   return;
    // }

    // // 👤 CREATE PROFILE ROW
    // const { error: profileError } = await supabase
    //   .from("profiles")
    //   .insert({
    //     user_id: user.id,          // 🔑 PRIMARY KEY
    //     full_name: formData.fullName,
    //     phone: formData.phone,
    //     state: formData.state,
    //     preferred_language: "en",
        
    //   });

    // if (profileError) {
    //   console.error("Profile insert error:", profileError);
    //   toast.error("Profile creation failed");
    //   return;
    // }



  //   const { data, error } = await supabase.auth.signUp({
  //   email: formData.email,
  //   password: formData.password,
  //   options: {
  //     emailRedirectTo: redirectUrl,
  //   },
  // });

  // if (error) {
  //   setIsLoading(false);
  //   toast.error(error.message);
  //   return;
  // }

  // 👇 VERY IMPORTANT PART (CREATE PROFILE)
  // const user = data.user;

  // if (user) {
  //   const { error: profileError } = await supabase
  //     .from("profiles")
  //     .insert({
  //       user_id: user.id,
  //       full_name: formData.fullName,
  //       phone: formData.phone,
  //       state: formData.state,
  //       preferred_language: "en",
  //     });

  //   if (profileError) {
  //     console.error("Profile insert error:", profileError);
  //     toast.error("Profile creation failed");
  //     setIsLoading(false);
  //     return;
  //   }
  // }

  // setIsLoading(false);
  // toast.success("Account created successfully! 🎉");

  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center items-center px-8 py-12 xl:p-12 text-primary-foreground">
          <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mb-8">
            <Tractor className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">KrishiYantra</h1>
          {/* <p className="text-xl opacity-90 mb-2">कृषि यंत्र</p> */}
          <p className="text-center opacity-80 max-w-md mt-6">
            Join thousands of farmers accessing modern machinery for better harvests. 
            AI-powered recommendations tailored to your farm.
          </p>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold">5000+</p>
              <p className="text-sm opacity-80">Farmers</p>
            </div>
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm opacity-80">Machines</p>
            </div>
            <div>
              <p className="text-3xl font-bold">28</p>
              <p className="text-sm opacity-80">States</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center">
              <Tractor className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">KrishiYantra</h1>
              {/* <p className="text-xs text-muted-foreground">कृषि यंत्र</p>  */}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-elevated border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isLogin ? "Welcome Back!" : "Create Account"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isLogin ? "Login to access your farm dashboard" : "Join KrishiYantra today"}
            </p>

            <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="mt-1.5"
                    />
                    {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={10}
                      className="mt-1.5"
                    />
                    {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <Label htmlFor="state" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      State
                    </Label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="mt-1.5 w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select your state</option>
                      {indianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.state && <p className="text-destructive text-sm mt-1">{errors.state}</p>}
                  </div>
                  <div>
                      <Label>Farm Size (in acres)</Label>
                      <Input
                        type="number"
                        name="farmSize"
                        placeholder="Eg: 5"
                        value={formData.farmSize}
                        onChange={(e) =>
                          setFormData({ ...formData, farmSize: e.target.value })
                        }
                      />
                  </div>
                  <div>
                    <Label>Primary Crops</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {cropOptions.map((crop) => (
                        <label key={crop} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.primaryCrops.includes(crop)}
                            onChange={(e) => {
                              const updated = e.target.checked
                                ? [...formData.primaryCrops, crop]
                                : formData.primaryCrops.filter((c) => c !== crop);

                              setFormData({ ...formData, primaryCrops: updated });
                            }}
                          />
                          {crop}
                        </label>
                      ))}
                        </div>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1.5"
                />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1.5"
                />
                {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full mt-6" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isLogin ? "Logging in..." : "Creating account..."}
                  </>
                ) : (
                  isLogin ? "Login" : "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                  }}
                  className="ml-2 text-primary font-medium hover:underline"
                >
                  {isLogin ? "Sign up" : "Login"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;