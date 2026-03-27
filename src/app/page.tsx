'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sparkles, X, ChefHat, Trash2, Loader2, BookOpen, LogIn } from "lucide-react";
import { analyzeFridge, getIngredients, deleteIngredient } from "@/app/actions/chef";
import { generateRecipe } from "@/app/actions/recipe";

// Food symbols for the background animation
const foodIcons = ["🍅", "🧀", "🧅", "🥦", "🍗", "🍳", "🥕", "🥑", "🍋", "🍄"];

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<string | null>(null);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchStoredIngredients();
  }, []);

  const fetchStoredIngredients = async () => {
    const result = await getIngredients();
    if (result.success && result.items) {
      setIngredients(result.items);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setError(null);
        setRecipe(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    setIsScanning(true);
    setError(null);
    try {
      const result = await analyzeFridge(image);
      if (result.success) {
        await fetchStoredIngredients();
      } else {
        setError(result.error || "Failed to scan fridge");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleDelete = async (name: string) => {
    const result = await deleteIngredient(name);
    if (result.success) {
      setIngredients(prev => prev.filter(i => i !== name));
    }
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) return;
    setIsGeneratingRecipe(true);
    setRecipe(null);
    try {
      const result = await generateRecipe(ingredients);
      if (result.success && result.recipe) {
        setRecipe(result.recipe);
      } else {
        setError(result.error || "Failed to generate recipe");
      }
    } catch (err) {
      setError("Failed to connect to the chef.");
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden selection:bg-[#A4C6A8] selection:text-black flex flex-col"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.65)), url('/gourmet_bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Floating Background Effects */}
      <div className="absolute inset-0 z-0 opacity-40 overflow-hidden pointer-events-none">
        {isMounted && Array.from({ length: 45 }).map((_, i) => (
          <div
            key={i}
            className="food-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${20 + Math.random() * 25}s`
            }}
          >
            {foodIcons[i % foodIcons.length]}
          </div>
        ))}
      </div>

      {/* Header - Flex 3-way layout */}
      <header className="z-foreground w-full px-8 py-2 flex items-center justify-between bg-transparent">
        {/* Left: Brand & Logo */}
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-36 h-12 flex items-center justify-center group">
            <Image
              src="/Logo_png.png"
              alt="Smart Chef Bebo Logo"
              fill
              className="object-contain mix-blend-screen filter brightness-[2] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-500 group-hover:scale-110"
              priority
            />
          </div>
          <span className="text-xl font-black tracking-widest uppercase text-white hidden md:block">
            Smart Chef Bebo
          </span>
        </div>

        {/* Center: Slogan */}
        <div className="flex-1 flex justify-center">
          <p className="font-slogan text-6xl lg:text-6xl font-bold text-[#A4C6A8] drop-shadow-[0_4px_8px_rgba(0,0,0,1)] whitespace-nowrap">
            Don’t throw it out — cook it up!!
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex justify-end gap-6 items-center">
          <button className="hidden sm:flex text-xs font-black uppercase tracking-widest text-white/40 hover:text-[#A4C6A8] transition-colors">
            My Pantry
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#A4C6A8] transition-all shadow-lg active:scale-95">
            <LogIn size={16} />
            <span>Sign In</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard - Three Column Grid */}
      <main className="z-foreground flex-1 w-full max-w-none grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/10">

        {/* Column 1: Upload & Scan */}
        <section className="p-8 lg:p-12 flex flex-col gap-10 bg-white/[0.02]">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black text-[#A4C6A8] uppercase tracking-[0.3em]">Step 01</h2>
            <h3 className="text-4xl font-black text-white uppercase">Vision Scan</h3>
          </div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="glass-dark rounded-[2.5rem] p-4 aspect-square relative flex items-center justify-center group overflow-hidden border border-white/10 shadow-2xl"
          >
            {image ? (
              <div className="w-full h-full relative">
                <Image src={image} alt="Target" fill className="object-cover rounded-[2rem]" />
                <AnimatePresence>
                  {isScanning && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="scanner-shimmer" />}
                </AnimatePresence>
                {!isScanning && (
                  <button onClick={() => setImage(null)} className="absolute top-6 right-6 bg-black/60 backdrop-blur-md p-3 rounded-full text-white hover:text-red-500 transition-colors border border-white/10">
                    <X size={24} />
                  </button>
                )}
              </div>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all rounded-[2rem] group/label">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-[#A4C6A8] mb-6 border border-white/10 group-hover/label:bg-[#A4C6A8]/20 transition-all">
                  <Camera size={40} />
                </div>
                <span className="text-sm font-black text-white/40 uppercase tracking-widest">Input Fridge Data</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            )}
          </motion.div>

          <button
            onClick={handleScan}
            disabled={!image || isScanning}
            className={`h-20 rounded-3xl font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95 ${!image || isScanning
              ? "bg-white/5 text-white/10 cursor-not-allowed border border-white/5"
              : "bg-[#A4C6A8] text-black hover:bg-white"
              }`}
          >
            {isScanning ? (
              <><Loader2 className="animate-spin" size={28} /><span>Analyzing...</span></>
            ) : (
              <><Sparkles size={28} fill="currentColor" /><span>Execute Scan</span></>
            )}
          </button>

          {error && <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-black text-center uppercase tracking-widest">{error}</div>}
        </section>

        {/* Column 2: Ingredients */}
        <section className="p-8 lg:p-12 flex flex-col gap-10 bg-white/[0.01]">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black text-[#A4C6A8] uppercase tracking-[0.3em]">Step 02</h2>
            <div className="flex items-center justify-between">
              <h3 className="text-4xl font-black text-white uppercase">Pantry Core</h3>
              <span className="text-xs font-black text-[#A4C6A8] bg-[#A4C6A8]/10 px-3 py-1 rounded-md border border-[#A4C6A8]/20">{ingredients.length} UNITS</span>
            </div>
          </div>

          <div className="flex-1 flex flex-wrap content-start gap-3">
            <AnimatePresence>
              {ingredients.map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-3 px-5 py-3.5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:border-[#A4C6A8]/40 transition-all group"
                >
                  <span className="w-1.5 h-1.5 bg-[#A4C6A8] rounded-full group-hover:scale-150 transition-transform" />
                  <span className="uppercase tracking-widest text-xs opacity-70 group-hover:opacity-100">{item}</span>
                  <button onClick={() => handleDelete(item)} className="ml-1 text-white/10 hover:text-red-500 transition-colors">
                    <X size={14} strokeWidth={3} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {ingredients.length === 0 && (
              <div className="w-full h-full flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-white/10 rounded-[2.5rem]">
                <Trash2 size={48} className="mb-4" />
                <p className="font-black text-xs uppercase tracking-widest">Waiting for input...</p>
              </div>
            )}
          </div>

          {ingredients.length > 0 && (
            <motion.button
              whileHover={{ x: 5 }}
              onClick={handleGenerateRecipe}
              disabled={isGeneratingRecipe}
              className="mt-auto w-full h-20 bg-white/5 border-2 border-white/10 text-white rounded-3xl font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-[#A4C6A8] hover:text-black transition-all"
            >
              {isGeneratingRecipe ? (
                <Loader2 className="animate-spin" size={28} />
              ) : (
                <><ChefHat size={28} strokeWidth={2.5} /><span>Generate Recipe</span></>
              )}
            </motion.button>
          )}
        </section>

        {/* Column 3: Recipe Result */}
        <section className="p-8 lg:p-12 flex flex-col gap-10 bg-white/[0.02]">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black text-[#A4C6A8] uppercase tracking-[0.3em]">Step 03</h2>
            <h3 className="text-4xl font-black text-white uppercase">Output Tome</h3>
          </div>

          <div className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              {recipe ? (
                <motion.div
                  key="recipe"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-dark rounded-[3rem] p-10 border-2 border-[#A4C6A8]/20 shadow-2xl relative h-full flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <BookOpen size={32} className="text-[#A4C6A8]" strokeWidth={2.5} />
                    <h4 className="text-xl font-black text-white uppercase tracking-tight">Chef's Algorithm</h4>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
                    <div className="whitespace-pre-line text-xl leading-loose text-white/80 font-medium font-acme border-l-2 border-[#A4C6A8]/20 pl-6">
                      {recipe}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button onClick={() => setRecipe(null)} className="text-[10px] font-black uppercase tracking-widest text-[#A4C6A8] hover:text-white underline underline-offset-4">Dismiss Output</button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center opacity-10 border-2 border-dashed border-white/10 rounded-[2.5rem]"
                >
                  <BookOpen size={64} className="mb-6" />
                  <p className="font-black text-sm uppercase tracking-[0.5em] text-center">Output stream offline</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Footer Branding */}
      <footer className="z-foreground w-full py-4 border-t border-white/5 bg-black text-center">
        <span className="text-[8px] font-black uppercase tracking-[1em] text-white/20">Pro-Dark Full-Width Core v3.2</span>
      </footer>
    </div>
  );
}
