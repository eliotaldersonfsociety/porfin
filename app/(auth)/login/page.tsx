"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/context/SessionContext";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "react-hot-toast";

export default function Header() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const { session, clearUserSession, setUserSession, sessionLoading } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const router = useRouter();

  //const RECAPTCHA_SITE_KEY = "6LfLAO8qAAAAAI4R6zMJhrRUuZ9S1-8092snupvt";

  interface Product {
    id: number;
    name: string;
    price: string;
    permalink: string;
    images: { src: string }[];
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) searchProducts(searchQuery);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const searchProducts = async (query: string) => {
    try {
      const response = await fetch(`/api/search?query=${query}`);
      if (!response.ok) throw new Error("Error buscando productos");
      setSearchResults(await response.json());
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //if (!recaptchaToken) return toast.error("Verifica que no eres un robot");
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, recaptchaToken }),
        credentials: "include",
      });
  
      const data = await response.json();
      console.log("Respuesta de login:", data); // 🔍 Verificar qué devuelve la API
  
      if (!response.ok) throw new Error(data.message || "Error en el inicio de sesión");
  
      if (!data.user) throw new Error("Usuario no definido en la respuesta");
  
      setUserSession({ ...data.user, isOnline: true }, data.token);
      setEmail("");
      setPassword("");
      router.push(data.user.isAdmin ? "/panel" : "/dashboard");
      toast.success("Inicio de sesión exitoso");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast.error(error.message || "Error en el inicio de sesión");
    }
  };
  

  const handleLogout = () => {
    clearUserSession();
    router.push("/login");
  };

  return (
    <header className="bg-[#041E42] p-4 border-b-4 border-[#AC252D]">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <Image src="/tsb.png" alt="Logo" width={128} height={40} />
        </Link>
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 rounded-md w-full"
          />
          {searchResults.length > 0 && (
            <div className="absolute bg-white border rounded-md w-full mt-1 z-10">
              {searchResults.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <div className="p-2 flex items-center hover:bg-gray-100">
                    <img src={product.images[0]?.src || "/placeholder.png"} alt={product.name} className="w-10 h-10 mr-2" />
                    <div>
                      <p>{product.name}</p>
                      <p className="text-gray-600">${product.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.avatar || "/usuario.png"} alt="Usuario" />
                  <AvatarFallback>{session?.name[0].toUpperCase() || <User />}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {session ? (
                <>
                  <DropdownMenuItem>{session.name} {session.lastname}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(session.isAdmin ? "/panel/" : "/dashboard/")}>Ir al Dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Cerrar sesión</DropdownMenuItem>
                </>
              ) : (
                <form onSubmit={handleLogin} className="p-4 space-y-2">
                  <Label>Email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <Label>Contraseña</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  {/* <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={setRecaptchaToken} /> */}
                  <Button type="submit" className="w-full">Iniciar sesión</Button>
                </form>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Toaster position="top-right" />
    </header>
  );
}
